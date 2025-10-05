import { useState, useEffect } from "react";
import type { ParcelState, CropType } from "@/lib/types/crops";
import { updateParcelState, calculateNDVI } from "@/lib/utils/calculations";
import { GAME_TIMING } from "@/lib/const/crops";

export function useGameLogic(
  initialParcels: ParcelState[],
  nasaTemperature: number,
  nasaSoilMoisture: number
) {
  const [parcels, setParcels] = useState<ParcelState[]>(initialParcels);
  const [gameDay, setGameDay] = useState(1);
  const [gameStarted, setGameStarted] = useState(false); // Nuevo: controla si el juego ha iniciado

  /**
   * Simular paso del tiempo (1 segundo = 1 día)
   * SOLO inicia cuando hay al menos un cultivo plantado
   */
  useEffect(() => {
    // Verificar si hay al menos una parcela con cultivo
    const hasCrops = parcels.some(p => p.crop !== null);
    
    if (hasCrops && !gameStarted) {
      setGameStarted(true); // Activar el juego cuando se planta el primer cultivo
    }

    // Solo avanzar el tiempo si el juego ha iniciado
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setGameDay((prev) => prev + 1);

      setParcels((currentParcels) =>
        currentParcels.map((parcel) =>
          updateParcelState(parcel, nasaTemperature, nasaSoilMoisture)
        )
      );
    }, GAME_TIMING.GAME_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [nasaTemperature, nasaSoilMoisture, gameStarted, parcels]);

  /**
   * Seleccionar o plantar en una parcela
   */
  const handleSelectParcel = (
    parcelId: number| null,
    selectedCrop: CropType | null,
    playerMoney: number,
    onMoneyChange: (money: number) => void,
    onXPChange: (xp: number, currentXP: number) => void,
    currentXP: number
  ) => {
    const parcel = parcels.find((p) => p.id === parcelId);

    if (!selectedCrop) {
      setParcels((prev) =>
        prev.map((p) => ({ ...p, isSelected: p.id === parcelId }))
      );
      return;
    }

    if (parcel && !parcel.crop && playerMoney >= 50) {
      setParcels((prev) =>
        prev.map((p) => {
          if (p.id === parcelId) {
            const newParcel = {
              ...p,
              crop: selectedCrop,
              plantedDate: new Date(),
              growthStage: 5,
              health: 90,
              waterLevel: 80,
              fertilizerLevel: 70,
              lastAction: `Plantado ${selectedCrop.name}`,
              daysToHarvest: selectedCrop.growthDays,
              isSelected: true,
              hasPestsAppeared: false,
              ndviValue: calculateNDVI({
                ...p,
                crop: selectedCrop,
                growthStage: 5,
                health: 90,
                waterLevel: 80,
                fertilizerLevel: 70,
              }),
            };
            return newParcel;
          }
          return { ...p, isSelected: p.id === parcelId };
        })
      );

      onMoneyChange(playerMoney - 50);
      onXPChange(currentXP + 10, currentXP);
    } else if (parcel && parcel.crop) {
      setParcels((prev) =>
        prev.map((p) => ({ ...p, isSelected: p.id === parcelId }))
      );
    }
  };

  const applyAction = (
    parcelId: number,
    action: string,
    cost: number,
    playerMoney: number,
    onMoneyChange: (money: number) => void,
    onXPChange: (xp: number, currentXP: number) => void,
    currentXP: number
  ) => {
    if (cost > 0 && playerMoney < cost) {
      return;
    }

    setParcels((prev) =>
      prev.map((parcel) => {
        if (parcel.id === parcelId && parcel.crop) {
          const newParcel = { ...parcel };

          switch (action) {
            case "water": {
              const waterNeeded = parcel.crop.waterNeeds;
              newParcel.waterLevel = Math.min(100, waterNeeded + 30);
              newParcel.health = Math.min(100, newParcel.health + 10);
              newParcel.lastAction = `Riego manual - ${waterNeeded}% aplicado`;
              break;
            }
            case "fertilizer": {
              newParcel.fertilizerLevel = Math.min(100, newParcel.fertilizerLevel + 40);
              newParcel.health = Math.min(100, newParcel.health + 15);
              newParcel.growthStage = Math.min(100, newParcel.growthStage + 5);
              newParcel.lastAction = "Fertilizante aplicado";
              break;
            }
            case "pest": {
              newParcel.pestLevel = Math.max(0, newParcel.pestLevel - 50);
              newParcel.health = Math.min(100, newParcel.health + 20);
              newParcel.lastAction = "Control de plagas aplicado";
              break;
            }
            case "heat": {
              newParcel.health = Math.min(100, newParcel.health + 25);
              newParcel.lastAction = "Protección térmica aplicada";
              break;
            }
            case "harvest": {
              const yield_value = Math.round((newParcel.health / 100) * (newParcel.crop as CropType).marketPrice);
              onMoneyChange(playerMoney + yield_value);
              onXPChange(currentXP + 50, currentXP);
              
              return {
                ...parcel,
                crop: null,
                plantedDate: null,
                growthStage: 0,
                health: 100,
                waterLevel: 80,
                fertilizerLevel: 50,
                pestLevel: Math.random() * 20,
                lastAction: `Cosechado - $${yield_value}`,
                daysToHarvest: 0,
                hasPestsAppeared: false,
                ndviValue: 0.45,
              };
            }
            default:
              break;
          }

          newParcel.ndviValue = calculateNDVI(newParcel);

          return newParcel;
        }
        return parcel;
      })
    );

    if (cost > 0) {
      onMoneyChange(playerMoney - cost);
    }

    if (action !== "harvest") {
      onXPChange(currentXP + 15, currentXP);
    }
  };

  return {
    parcels,
    gameDay,
    setParcels,
    handleSelectParcel,
    applyAction,
  };
}