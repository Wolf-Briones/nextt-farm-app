import { useState, useEffect, useCallback, useRef } from "react";
import type { ParcelState } from "@/lib/types/crops";
import { applyWatering } from "@/lib/utils/calculations";
//import { GAME_TIMING } from "@/lib/const/constants";

export function useAutoWatering(
  parcels: ParcelState[],
  onUpdateParcels: (parcels: ParcelState[]) => void,
  onMoneyChange: (newMoney: number) => void,
  currentMoney: number
) {
  const [autoWateringParcels, setAutoWateringParcels] = useState<Set<number>>(new Set());
  const [processingQueue, setProcessingQueue] = useState<number[]>([]);
  
  const lastActionTime = useRef<Map<number, number>>(new Map());
  const recentlyProcessed = useRef<Set<number>>(new Set());

  const registerManualAction = useCallback((parcelId: number) => {
    lastActionTime.current.set(parcelId, Date.now());
    setProcessingQueue((prev) => prev.filter((id) => id !== parcelId));
    recentlyProcessed.current.add(parcelId);
    setTimeout(() => {
      recentlyProcessed.current.delete(parcelId);
    }, 3000);
  }, []);

  const shouldAutoActivate = useCallback((parcelId: number): boolean => {
    const lastAction = lastActionTime.current.get(parcelId);
    if (!lastAction) {
      return true;
    }
    const timeSinceLastAction = Date.now() - lastAction;
    return timeSinceLastAction >= 3000; // 3 segundos desde última acción
  }, []);

  /**
   * Verificar y activar riego automático
   * Cobra y riega cuando agua <= 45%
   */
  const checkAutoWatering = useCallback(() => {
    if (currentMoney < 20) return;

    const parcelsNeedingWater = parcels.filter((parcel) => {
      if (autoWateringParcels.has(parcel.id)) return false;
      if (processingQueue.includes(parcel.id)) return false;
      if (recentlyProcessed.current.has(parcel.id)) return false;

      // Activar cuando agua baje a 45% o menos
      return (
        parcel.crop &&
        shouldAutoActivate(parcel.id) &&
        parcel.growthStage < 100 &&
        parcel.waterLevel <= 45 // Umbral de activación
      );
    });

    if (parcelsNeedingWater.length > 0) {
      const newParcels = parcelsNeedingWater
        .filter(p => !processingQueue.includes(p.id))
        .map(p => p.id);
      
      if (newParcels.length > 0) {
        console.log(`🤖 IoT: Activando riego para parcelas:`, newParcels);
        setProcessingQueue((prev) => [...prev, ...newParcels]);
      }
    }
  }, [parcels, autoWateringParcels, processingQueue, shouldAutoActivate, currentMoney]);

  /**
   * Procesar cola de riego automático
   */
  useEffect(() => {
    if (processingQueue.length === 0) return;

    const parcelId = processingQueue[0];
    const parcel = parcels.find((p) => p.id === parcelId);
    
    if (currentMoney < 20) {
      console.warn(`IoT: Sin fondos suficientes ($${currentMoney} < $20)`);
      setProcessingQueue((prev) => prev.filter((id) => id !== parcelId));
      return;
    }

    if (!parcel || !parcel.crop || parcel.waterLevel > 45) {
      setProcessingQueue((prev) => prev.filter((id) => id !== parcelId));
      return;
    }

    if (autoWateringParcels.has(parcelId)) {
      return;
    }
    
    setAutoWateringParcels((prev) => new Set([...prev, parcelId]));
    recentlyProcessed.current.add(parcelId);

    // Cobrar inmediatamente
    const newMoney = currentMoney - 5;
    onMoneyChange(newMoney);
    
    console.log(`💰 IoT: Parcela ${parcelId} - Cobrando $5 (Balance: $${newMoney})`);

    // Aplicar riego después de 3 segundos
    const timer = setTimeout(() => {
      const waterNeeded = parcel.crop!.waterNeeds;
      const waterToAdd = waterNeeded + 15;
      
      const updatedParcels = parcels.map((p) => {
        if (p.id === parcelId) {
          const newParcel = applyWatering(p, waterToAdd);
          console.log(`💧 IoT: Parcela ${parcelId} regada - Agua: ${p.waterLevel.toFixed(1)}% → ${newParcel.waterLevel.toFixed(1)}%`);
          return {
            ...newParcel,
            lastAction: `🤖 IoT - Riego automático +${waterToAdd}% (-$5)`,
          };
        }
        return p;
      });

      onUpdateParcels(updatedParcels);
      
      lastActionTime.current.set(parcelId, Date.now());

      setTimeout(() => {
        setAutoWateringParcels((prev) => {
          const newSet = new Set(prev);
          newSet.delete(parcelId);
          return newSet;
        });
        recentlyProcessed.current.delete(parcelId);
      }, 1000);

      setProcessingQueue((prev) => prev.filter((id) => id !== parcelId));
    }, 3000); // 3 segundos de delay

    return () => clearTimeout(timer);
  }, [processingQueue, parcels, onUpdateParcels, onMoneyChange, currentMoney, autoWateringParcels]);

  /**
   * Verificar cada 1 segundo
   */
  useEffect(() => {
    const interval = setInterval(() => {
      checkAutoWatering();
    }, 1000); // Cada 1 segundo para detectar rápidamente

    return () => clearInterval(interval);
  }, [checkAutoWatering]);

  const activateAutoWatering = useCallback(
    (parcelId: number) => {
      if (currentMoney < 20) {
        console.warn('IoT: Se requieren >= $20');
        return;
      }

      if (
        !autoWateringParcels.has(parcelId) &&
        !processingQueue.includes(parcelId) &&
        !recentlyProcessed.current.has(parcelId)
      ) {
        setProcessingQueue((prev) => [...prev, parcelId]);
      }
    },
    [autoWateringParcels, processingQueue, currentMoney]
  );

  return {
    autoWateringParcels,
    activateAutoWatering,
    registerManualAction,
    checkAndActivate: activateAutoWatering
  };
}