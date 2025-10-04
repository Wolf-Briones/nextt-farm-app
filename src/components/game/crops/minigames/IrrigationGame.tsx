/**
 * 💧 Juego de Riego Inteligente - Versión Realista
 * El juego termina cuando: se acaba el agua, todas las plantas mueren, o completas el objetivo
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { MinigameProps, CropParcel } from '@/lib/types/minigames';
import { IRRIGATION_CONFIG, IOT_SENSORS } from '@/lib/const/minigames';
import {
  generateIrrigationParcels,
  createGameResult,
  getHealthColor
} from '@/lib/utils/minigames';

export default function IrrigationGame({
  level,
  nasaData,
  onComplete
}: MinigameProps) {
  const [parcels, setParcels] = useState<CropParcel[]>([]);
  const [waterBudget, setWaterBudget] = useState<number>(IRRIGATION_CONFIG.INITIAL_WATER_BUDGET);
  const [selectedParcel, setSelectedParcel] = useState<number | null>(null);
  const [deadPlants, setDeadPlants] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Inicializar parcelas
  useEffect(() => {
    setParcels(generateIrrigationParcels(IRRIGATION_CONFIG.PARCELS_COUNT, nasaData));
  }, [nasaData]);

  // Sistema de marchitamiento y muerte de plantas
  useEffect(() => {
    if (gameOver) return;

    const deathTimer = setInterval(() => {
      setParcels(prev => prev.map(parcel => {
        // Si el nivel de agua está muy bajo, la planta se marchita
        let newWaterLevel = parcel.waterLevel;

        // Evaporación basada en datos NASA
        const evaporationRate = (nasaData.evapotranspiration / 10) * (nasaData.temperature / 20);
        newWaterLevel = Math.max(0, newWaterLevel - evaporationRate);

        return {
          ...parcel,
          waterLevel: newWaterLevel
        };
      }));
    }, 2000);

    return () => clearInterval(deathTimer);
  }, [gameOver, nasaData]);

  // Terminar juego
  const endGame = useCallback((success: boolean, message: string) => {
    if (gameOver) return;
    setGameOver(true);

    const efficiency = parcels.reduce((acc, parcel) => {
      if (parcel.waterLevel < 10) return acc;
      const diff = Math.abs(parcel.waterLevel - parcel.optimalWater);
      return acc + Math.max(0, 100 - diff);
    }, 0) / Math.max(1, parcels.length - deadPlants);

    const budgetEfficiency = (waterBudget / IRRIGATION_CONFIG.INITIAL_WATER_BUDGET) * 100;
    const finalScore = Math.round((efficiency * 0.7 + budgetEfficiency * 0.3));

    const result = createGameResult(
      finalScore,
      level.targetScore,
      ['SMAP Soil Moisture', 'Evapotranspiration', 'Temperature'],
      [IOT_SENSORS.SOIL_MOISTURE, IOT_SENSORS.AUTO_VALVE, IOT_SENSORS.TEMPERATURE]
    );

    result.success = success && finalScore >= level.targetScore;
    result.lessonsLearned = [
      ...result.lessonsLearned,
      message,
      `Plantas salvadas: ${parcels.length - deadPlants}/${parcels.length}`,
      waterBudget > 0 ? `Agua sobrante: ${waterBudget}L` : 'Usaste toda el agua disponible'
    ];

    setTimeout(() => onComplete(result), 1500);
  }, [parcels, waterBudget, deadPlants, level.targetScore, onComplete, gameOver]);

    // Verificar plantas muertas
useEffect(() => {
  if (gameOver) return;

  const dead = parcels.filter(p => p.waterLevel < 10).length;
  setDeadPlants(dead);

  if (dead > parcels.length / 2) {
    endGame(false, 'Demasiadas plantas murieron por falta de agua 💀');
  }

  if (waterBudget <= 0) {
    const plantsNeedingWater = parcels.filter(p => 
      Math.abs(p.waterLevel - p.optimalWater) > 20
    ).length;

    if (plantsNeedingWater > 0) {
      endGame(false, '¡Se acabó el agua! 💧');
    } else {
      endGame(true, '¡Agua usada perfectamente! 🏆');
    }
  }
}, [parcels, waterBudget, gameOver, endGame]);

  // Riego manual
  const waterParcel = useCallback((parcelId: number, amount: number) => {
    if (waterBudget < amount || gameOver) return;

    setParcels(prev => prev.map(p =>
      p.id === parcelId ? {
        ...p,
        waterLevel: Math.min(100, p.waterLevel + amount)
      } : p
    ));

    setWaterBudget(prev => prev - amount);
  }, [waterBudget, gameOver]);

  // Riego automático con IoT
  const activateAutoWatering = useCallback(() => {
    if (gameOver || waterBudget < 50) return;

    setAutoMode(true);

    // Sistema inteligente: riega solo plantas que lo necesitan
    const plantsNeedingWater = parcels.filter(p =>
      p.waterLevel < p.optimalWater - 15
    ).sort((a, b) => a.waterLevel - b.waterLevel); // Más críticas primero

    let waterUsed = 0;
    const updates: Record<number, number> = {};

    for (const plant of plantsNeedingWater) {
      const needed = Math.min(30, plant.optimalWater - plant.waterLevel);
      if (waterBudget - waterUsed >= needed) {
        updates[plant.id] = needed;
        waterUsed += needed;
      }
    }

    setParcels(prev => prev.map(p =>
      updates[p.id] ? {
        ...p,
        waterLevel: Math.min(100, p.waterLevel + updates[p.id])
      } : p
    ));

    setWaterBudget(prev => prev - waterUsed);

    setTimeout(() => setAutoMode(false), 2000);
  }, [parcels, waterBudget, gameOver]);

  // Análisis de campo completo
  const analyzeField = () => {
    const critical = parcels.filter(p => p.waterLevel < 30).length;
    const optimal = parcels.filter(p =>
      Math.abs(p.waterLevel - p.optimalWater) < 15
    ).length;
    const overwatered = parcels.filter(p => p.waterLevel > 90).length;

    return { critical, optimal, overwatered };
  };

  const fieldAnalysis = analyzeField();
  const getParcelStatus = (parcel: CropParcel): string => {
    if (parcel.waterLevel < 10) return 'bg-gray-800'; // Muerta
    const diff = Math.abs(parcel.waterLevel - parcel.optimalWater);
    if (diff < 10) return getHealthColor(95);
    if (diff < 20) return getHealthColor(75);
    if (diff < 30) return getHealthColor(50);
    return getHealthColor(25);
  };

  return (
    <div className="h-full bg-gradient-to-b from-blue-900 to-gray-800 rounded-lg p-6">
      {/* Header con stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">💧</div>
          <div>
            <h3 className="text-2xl font-bold text-cyan-400">Riego Inteligente</h3>
            <p className="text-sm text-gray-300">¡No dejes que mueran! 🌱</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`text-center px-4 py-2 rounded-lg ${waterBudget < 50 ? 'bg-red-600/40 animate-pulse' : 'bg-blue-600/30'
            }`}>
            <div className="text-2xl font-bold text-white">{waterBudget}L</div>
            <div className="text-xs text-gray-300">💧 Agua</div>
          </div>
          <div className="text-center bg-red-600/30 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold text-white">{deadPlants}</div>
            <div className="text-xs text-gray-300">💀 Muertas</div>
          </div>
          <div className="text-center bg-green-600/30 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold text-white">{fieldAnalysis.optimal}</div>
            <div className="text-xs text-gray-300">✅ Óptimas</div>
          </div>
        </div>
      </div>

      {/* Panel NASA IoT */}
      <motion.div
        className="bg-gray-700/50 rounded-lg p-4 mb-4 border-2 border-cyan-400/30"
        animate={autoMode ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5, repeat: autoMode ? Infinity : 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-cyan-400 flex items-center gap-2">
            🛰️ Sistema de Riego Inteligente
          </h4>
          <motion.button
            className={`px-4 py-2 rounded-lg font-bold text-white ${waterBudget < 50 || gameOver
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
              }`}
            whileHover={waterBudget >= 50 && !gameOver ? { scale: 1.05 } : {}}
            whileTap={waterBudget >= 50 && !gameOver ? { scale: 0.95 } : {}}
            onClick={activateAutoWatering}
            disabled={waterBudget < 50 || gameOver}
          >
            {autoMode ? '🔄 Regando...' : '🤖 Riego Automático (50L)'}
          </motion.button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-blue-900/40 rounded p-2">
            <div className="text-sm font-bold text-white">{nasaData.soilMoisture.toFixed(0)}%</div>
            <div className="text-xs text-gray-300">💧 Humedad</div>
          </div>
          <div className="bg-orange-900/40 rounded p-2">
            <div className="text-sm font-bold text-white">{nasaData.evapotranspiration.toFixed(1)}mm</div>
            <div className="text-xs text-gray-300">☀️ Evaporación</div>
          </div>
          <div className="bg-red-900/40 rounded p-2">
            <div className="text-sm font-bold text-white">{fieldAnalysis.critical}</div>
            <div className="text-xs text-gray-300">⚠️ Críticas</div>
          </div>
          <div className="bg-purple-900/40 rounded p-2">
            <div className="text-sm font-bold text-white">{nasaData.temperature.toFixed(1)}°C</div>
            <div className="text-xs text-gray-300">🌡️ Temp</div>
          </div>
        </div>
      </motion.div>

      {/* Grid de parcelas */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {parcels.map((parcel, index) => {
          const isSelected = selectedParcel === parcel.id;
          const status = getParcelStatus(parcel);
          const isDead = parcel.waterLevel < 10;
          const isCritical = parcel.waterLevel < 30 && !isDead;

          return (
            <motion.div
              key={parcel.id}
              className={`${status} rounded-lg p-3 cursor-pointer transition-all border-4 ${isSelected ? 'border-yellow-400 scale-105' :
                  isCritical ? 'border-red-500 animate-pulse' :
                    'border-transparent'
                }`}
              onClick={() => !isDead && setSelectedParcel(isSelected ? null : parcel.id)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isDead ? 0.3 : 1,
                scale: 1,
                rotate: isDead ? [0, -5, 5, 0] : 0
              }}
              transition={{
                delay: index * 0.05,
                rotate: { duration: 2, repeat: isDead ? Infinity : 0 }
              }}
            >
              {/* Sensor IoT alertando */}
              {isCritical && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full w-7 h-7 flex items-center justify-center border-2 border-white"
                  animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <span className="text-sm">🚨</span>
                </motion.div>
              )}

              {/* Planta muerta */}
              {isDead && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl">💀</div>
                </div>
              )}

              <div className="text-center">
                <div className={`text-3xl mb-2 ${isDead ? 'grayscale' : ''}`}>
                  {parcel.plantType}
                </div>

                {/* Nivel de agua */}
                {!isDead && (
                  <>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-white mb-1">
                        <span>💧 {Math.round(parcel.waterLevel)}%</span>
                        <span>🎯 {Math.round(parcel.optimalWater)}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${parcel.waterLevel < 30 ? 'bg-red-500' :
                              parcel.waterLevel < 50 ? 'bg-yellow-500' :
                                'bg-cyan-400'
                            }`}
                          style={{ width: `${parcel.waterLevel}%` }}
                        />
                      </div>
                    </div>

                    {/* Sensor IoT */}
                    <div className="bg-black/40 rounded p-1 mb-2 text-xs">
                      <div className={isCritical ? 'text-red-400' : 'text-green-400'}>
                        📱 {isCritical ? '¡ALERTA!' : 'Normal'}
                      </div>
                    </div>

                    {/* Botones de riego */}
                    {isSelected && !gameOver && (
                      <motion.div
                        className="flex gap-1 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[10, 25, 50].map(amount => (
                          <button
                            key={amount}
                            className={`flex-1 py-2 rounded font-bold text-sm ${waterBudget < amount
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              waterParcel(parcel.id, amount);
                            }}
                            disabled={waterBudget < amount}
                          >
                            +{amount}L
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Objetivo */}
      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
        <h4 className="font-bold text-white mb-2">
          {gameOver ? '🎮 Juego Terminado' : '🎯 Objetivo'}
        </h4>
        <p className="text-gray-300 text-sm">
          {gameOver
            ? 'Analizando resultados...'
            : `Mantén vivas al menos ${Math.ceil(parcels.length / 2)} plantas con niveles óptimos. Los sensores 📱 te avisan de peligros. ¡No desperdicies agua!`
          }
        </p>
      </div>
    </div>
  );
}