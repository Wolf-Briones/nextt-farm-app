"use client";

import { useState } from "react";
import type { CropType, ParcelState, CultivosGameProps } from "@/lib/types/crops";
import { useNASAData } from "@/hooks/useNASAData";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useAutoWatering } from "@/hooks/useAutoWatering";
import { ParcelMap } from "@/components/game/crops/sowing/ParcelMap";
import { CropSelector } from "@/components/game/crops/sowing/CropSelector";

// Parcelas iniciales
const createInitialParcels = (): ParcelState[] =>
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    crop: null,
    plantedDate: null,
    growthStage: 0,
    health: 100,
    waterLevel: 80,
    fertilizerLevel: 50,
    pestLevel: Math.random() * 20,
    ndviValue: 0.45,
    soilMoisture: 45,
    temperature: 22.0,
    isSelected: i === 0,
    lastAction: "Ninguna",
    daysToHarvest: 0,
    hasPestsAppeared: false,
  }));

export default function CultivosGame({
  parcels: externalParcels,
  onParcelsChange,
  playerMoney = 1000,
  onMoneyChange,
  playerXP = 0,
  onXPChange,
}: CultivosGameProps) {
  // Estado local si no se proporcionan props externas
  const [localParcels] = useState<ParcelState[]>(createInitialParcels);
  const [localMoney, setLocalMoney] = useState(playerMoney);
  const [localXP, setLocalXP] = useState(playerXP);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);

  // Hooks
  const { nasaData, isLoading, error } = useNASAData();

  // Determinar qué parcelas y funciones usar
  const initialParcels = externalParcels || localParcels;
  const currentMoney = externalParcels ? playerMoney : localMoney;
  const currentXP = externalParcels ? playerXP : localXP;

  const updateMoney = onMoneyChange || setLocalMoney;
  const updateXP = onXPChange
    ? (xp: number) => onXPChange(xp)
    : (xp: number) => setLocalXP(xp);

  // Lógica del juego
  const { parcels, gameDay, setParcels, handleSelectParcel } = useGameLogic(
    initialParcels,
    nasaData.temperature,
    nasaData.soilMoisture
  );

  // Sistema de riego automático
  const { autoWateringParcels } = useAutoWatering(
    parcels,
    onParcelsChange || setParcels,
    updateMoney,
    currentMoney
  );

  // Manejador de riego manual (gratuito)
  const handleManualWatering = (parcelId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    const updatedParcels = parcels.map((parcel) => {
      if (parcel.id === parcelId && parcel.crop) {
        const waterNeeded = parcel.crop.waterNeeds;
        return {
          ...parcel,
          waterLevel: Math.min(100, waterNeeded + 10),
          health: Math.min(100, parcel.health + 5),
          lastAction: `Riego manual - ${waterNeeded}% aplicado`,
        };
      }
      return parcel;
    });

    if (onParcelsChange) {
      onParcelsChange(updatedParcels);
    } else {
      setParcels(updatedParcels);
    }

    updateXP(currentXP + 5);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Panel de estado del jugador */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👨‍🌾</span>
              <div>
                <div className="text-white font-semibold">Granjero Espacial</div>
                <div className="text-gray-400 text-sm">Día {gameDay}</div>
              </div>
            </div>

            {/* Indicadores NASA */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span>🌡️</span>
                <span className="text-cyan-400">{nasaData.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>💧</span>
                <span className="text-blue-400">{nasaData.soilMoisture.toFixed(0)}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📡</span>
                <span className="text-green-400">NASA Live</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-green-400 font-semibold">
              Parcelas activas: {parcels.filter((p) => p.crop).length}/{parcels.length}
            </div>
            <div className="text-gray-400 text-sm">
              Riesgo sequía: {nasaData.droughtRisk}
              {nasaData.heatStress && " | 🔥 Estrés térmico"}
            </div>
          </div>
        </div>

        {/* Advertencia de error NASA */}
        {error && (
          <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-600/50 rounded text-yellow-400 text-xs">
            ⚠️ Error al conectar con NASA: {error}. Usando datos simulados.
          </div>
        )}

        {/* Indicador de carga */}
        {isLoading && (
          <div className="mt-2 text-cyan-400 text-xs">
            🔄 Conectando con satélites NASA...
          </div>
        )}
      </div>

      {/* Selector de cultivos */}
      <CropSelector
        selectedCrop={selectedCrop}
        onSelectCrop={setSelectedCrop}
        playerMoney={currentMoney}
      />

      {/* Mapa de parcelas */}
      <div className="flex-1">
        <ParcelMap
          parcels={parcels}
          onSelectParcel={(id) =>
            handleSelectParcel(
              id,
              selectedCrop,
              currentMoney,
              updateMoney,
              updateXP,
              currentXP
            )
          }
          selectedCrop={selectedCrop}
          autoWateringParcels={autoWateringParcels}
          onManualWatering={handleManualWatering}
        />
      </div>
    </div>
  );
}

// Exportar tipos y funciones para uso externo
export { createInitialParcels };
export type { ParcelState, CropType } from "@/lib/types/crops";