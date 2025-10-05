"use client";

import { motion } from "framer-motion";
import type { ParcelMapProps, ParcelState } from "@/lib/types/crops";
import { calculateNDVI, calculatePestProbability } from "@/lib/utils/calculations";

export function ParcelMap({
  parcels,
  onSelectParcel,
  selectedCrop,
  autoWateringParcels,
  onManualWatering,
  onHarvestParcel,
}: ParcelMapProps) {
  const getParcelColor = (health: number): string => {
    if (health > 80) return "bg-green-600";
    if (health > 60) return "bg-green-500";
    if (health > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getParcelBorder = (isSelected: boolean, hasCrop: boolean): string => {
    if (isSelected) return "border-cyan-400 border-4";
    if (selectedCrop && !hasCrop) return "border-green-400 border-2 cursor-pointer";
    return "border-gray-600 border-2";
  };

  const getPestProbabilityColor = (probability: number): string => {
    if (probability < 20) return "text-green-400";
    if (probability < 50) return "text-yellow-400";
    if (probability < 75) return "text-orange-400";
    return "text-red-400";
  };

  const getNDVIColor = (ndvi: number, optimalNDVI: number): string => {
    const difference = Math.abs(ndvi - optimalNDVI);
    if (difference < 0.05) return "text-green-400";
    if (difference < 0.1) return "text-yellow-400";
    return "text-red-400";
  };

  const handleParcelClick = (parcel: ParcelState) => {
    // Si la parcela está lista para cosechar
    if (parcel.crop && parcel.growthStage >= 100) {
      // Cosechar la parcela
      onHarvestParcel(parcel.id);
      
      // Buscar otra parcela con cultivo para seleccionarla
      const otherParcelWithCrop = parcels.find(
        p => p.id !== parcel.id && p.crop && p.growthStage < 100
      );
      
      if (otherParcelWithCrop) {
        onSelectParcel(otherParcelWithCrop.id);
      } else {
        // Si no hay otras parcelas con cultivo, deseleccionar
        onSelectParcel(-1);
      }
    } else {
      // Comportamiento normal de selección
      onSelectParcel(parcel.id);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          🗺️ Parcelas - Sistema IoT Activo
        </h3>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded" />
            <span className="text-gray-300">Saludable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-gray-300">Atención</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-gray-300">Crítico</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[650px]">
        {parcels.map((parcel) => {
          const currentNDVI = calculateNDVI(parcel);
          const pestProbability = calculatePestProbability(parcel);
          
          const showManualWatering = parcel.crop && parcel.growthStage < 100;
          
          const isWaterCritical = parcel.waterLevel < 30;
          const isWaterLow = parcel.waterLevel < 50;
          
          const showIoTAlert = parcel.waterLevel <= 60 && parcel.waterLevel > 45;
          
          const isReadyToHarvest = parcel.crop && parcel.growthStage >= 100;

          return (
            <motion.div
              key={parcel.id}
              className={`${parcel.crop ? getParcelColor(parcel.health) : "bg-amber-900"} ${getParcelBorder(
                parcel.isSelected,
                !!parcel.crop
              )} rounded-lg relative overflow-hidden transition-all duration-300 ${
                isReadyToHarvest ? 'cursor-pointer ring-4 ring-yellow-400 ring-opacity-50' : 'cursor-pointer'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleParcelClick(parcel)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: parcel.id * 0.03 }}
            >
              {parcel.crop && (
                <div className="absolute top-1 left-1 bg-cyan-500/80 text-black px-2 py-0.5 rounded text-xs font-bold">
                  📡 IoT Live
                </div>
              )}
              
              {parcel.crop && showIoTAlert && !isReadyToHarvest && (
                <motion.div
                  className="absolute top-8 left-1 bg-yellow-500/90 text-black px-2 py-0.5 rounded text-xs font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⚠️ IoT en 45%
                </motion.div>
              )}

              {isReadyToHarvest && (
                <motion.div
                  className="absolute top-1 left-1 right-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white px-2 py-1 rounded text-xs font-bold text-center shadow-lg pointer-events-none"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    scale: { duration: 1, repeat: Infinity }
                  }}
                >
                  🚜 ¡LISTO PARA COSECHAR! (Click aquí)
                </motion.div>
              )}

              {showManualWatering && (
                <motion.button
                  className={`absolute top-1 right-1 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg z-10 ${
                    isWaterCritical 
                      ? 'bg-red-500 hover:bg-red-400' 
                      : isWaterLow 
                      ? 'bg-orange-500 hover:bg-orange-400'
                      : 'bg-blue-500 hover:bg-blue-400'
                  }`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: isWaterCritical ? [1, 1.3, 1] : isWaterLow ? [1, 1.15, 1] : 1,
                    boxShadow: isWaterCritical
                      ? [
                          "0 0 0 0 rgba(239, 68, 68, 0.7)",
                          "0 0 0 10px rgba(239, 68, 68, 0)",
                          "0 0 0 0 rgba(239, 68, 68, 0.7)",
                        ]
                      : isWaterLow
                      ? [
                          "0 0 0 0 rgba(249, 115, 22, 0.7)",
                          "0 0 0 8px rgba(249, 115, 22, 0)",
                          "0 0 0 0 rgba(249, 115, 22, 0.7)",
                        ]
                      : "0 0 3px rgba(59, 130, 246, 0.5)",
                  }}
                  transition={{ 
                    duration: isWaterCritical ? 0.8 : 1.2, 
                    repeat: Infinity 
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onManualWatering(parcel.id, e);
                  }}
                  title={
                    isWaterCritical 
                      ? '¡CRÍTICO! Riego manual GRATIS (Click aquí)' 
                      : isWaterLow 
                      ? 'Agua baja - Riego manual GRATIS'
                      : 'Riego manual disponible (GRATIS)'
                  }
                >
                  💧
                </motion.button>
              )}

              <div className="h-full flex flex-col items-center justify-center p-3">
                {parcel.crop ? (
                  <>
                    <motion.div
                      className="text-3xl mb-2"
                      animate={{
                        scale: parcel.health > 70 ? [1, 1.1, 1] : [1, 0.95, 1],
                        rotate: parcel.pestLevel > 50 ? [-2, 2, -2] : 0,
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {parcel.crop.icon}
                    </motion.div>

                    <div className="text-sm font-semibold text-white text-center mb-1">
                      {parcel.crop.name}
                    </div>
                    <div className="text-xs text-gray-200 mb-1">
                      Crecimiento: {parcel.growthStage.toFixed(1)}%
                    </div>
                    <div className={`text-xs text-center mb-1 ${
                      isWaterCritical ? 'text-red-200 font-bold' : 
                      isWaterLow ? 'text-orange-200 font-bold' : 
                      'text-gray-300'
                    }`}>
                      💧{parcel.waterLevel.toFixed(1)}% ❤️{parcel.health.toFixed(1)}%
                    </div>

                    {isWaterCritical && !isReadyToHarvest && (
                      <div className="text-xs text-red-200 font-bold animate-pulse mb-1">
                        ⚠️ ¡SED EXTREMA!
                      </div>
                    )}

                    <div
                      className={`text-xs ${getNDVIColor(
                        currentNDVI,
                        parcel.crop.nasaOptimalNDVI
                      )} text-center mb-1`}
                    >
                      🌿NDVI: {currentNDVI.toFixed(3)}
                    </div>

                    {(parcel.hasPestsAppeared || pestProbability > 10) && !isReadyToHarvest && (
                      <div
                        className={`text-xs ${getPestProbabilityColor(
                          pestProbability
                        )} text-center`}
                      >
                        🐛Plagas: {pestProbability.toFixed(1)}%
                      </div>
                    )}

                    {parcel.daysToHarvest <= 7 && parcel.growthStage >= 90 && parcel.growthStage < 100 && (
                      <motion.div
                        className="absolute -top-1 -right-1 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        !
                      </motion.div>
                    )}

                    {autoWateringParcels.has(parcel.id) && !isReadyToHarvest && (
                      <motion.div
                        className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1, repeat: Infinity },
                        }}
                      >
                        🔄
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌱</div>
                    <div className="text-sm text-gray-300">Libre</div>
                  </div>
                )}

                {parcel.crop && !isReadyToHarvest && (
                  <div className="absolute bottom-2 left-2 right-2 space-y-1">
                    <div className="flex gap-1">
                      <div
                        className={`h-1.5 flex-1 rounded ${
                          parcel.waterLevel > 60
                            ? "bg-blue-400"
                            : parcel.waterLevel > 30
                            ? "bg-yellow-400"
                            : "bg-red-400 animate-pulse"
                        }`}
                      />
                      <div
                        className={`h-1.5 flex-1 rounded ${
                          parcel.health > 60
                            ? "bg-green-400"
                            : parcel.health > 30
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {parcel.crop && parcel.growthStage >= 90 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent"
                  animate={{ x: [-50, 150] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}

              {parcel.crop && parcel.pestLevel > 70 && !isReadyToHarvest && (
                <motion.div
                  className="absolute inset-0 bg-red-500/20"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              
              {parcel.crop && isWaterCritical && !isReadyToHarvest && (
                <motion.div
                  className="absolute inset-0 bg-red-500/30 pointer-events-none"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">💧 Riego Manual:</span>
            <span className="text-green-400 font-semibold">SIEMPRE GRATIS</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-400">Normal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-400">Bajo</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Crítico</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">🚜</span>
              <span className="text-gray-400">Click para cosechar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}