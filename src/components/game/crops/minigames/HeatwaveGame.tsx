/**
 * 🌡️ Juego de Protección contra Olas de Calor
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { MinigameProps, HeatStressedCrop, ProtectionType } from '@/lib/types/minigames';
import { useActions } from '@/hooks/useMinigame';
import { HEATWAVE_CONFIG, IOT_SENSORS } from '@/lib/const/minigames';
import {
  generateHeatwaveCrops,
  createGameResult,
  getHealthColor
} from '@/lib/utils/minigames';


export default function HeatwaveGame({
  level,
  nasaData,
  onComplete
}: MinigameProps) {
  const [crops, setCrops] = useState<HeatStressedCrop[]>([]);
  const [heatWave, setHeatWave] = useState(1); // Número de ola de calor
  const [heatIntensity, setHeatIntensity] = useState(nasaData.temperature);
  const { actions, doAction, hasActionsLeft } = useActions(HEATWAVE_CONFIG.INITIAL_ACTIONS);
  const [gameOver, setGameOver] = useState(false);
  const [deadCrops, setDeadCrops] = useState(0);

  // Inicializar cultivos
  useEffect(() => {
    setCrops(generateHeatwaveCrops(HEATWAVE_CONFIG.CROPS_COUNT, nasaData));
  }, [nasaData]);

  // Terminar juego
  const endGame = useCallback((success: boolean, message: string) => {
    if (gameOver) return;
    setGameOver(true);

    const livingCrops = crops.filter(c => c.health > 0);
    const avgHealth = livingCrops.length > 0
      ? livingCrops.reduce((sum, crop) => sum + crop.health, 0) / livingCrops.length
      : 0;

    const survivalRate = (livingCrops.length / crops.length) * 100;
    const finalScore = Math.round((avgHealth * 0.6) + (survivalRate * 0.4));

    const result = createGameResult(
      finalScore,
      level.targetScore,
      ['Temperature Max', 'Heat Index'],
      [IOT_SENSORS.TEMPERATURE, IOT_SENSORS.COOLING_SYSTEM]
    );

    result.success = success && finalScore >= level.targetScore;
    result.lessonsLearned = [
      ...result.lessonsLearned,
      message,
      `Cultivos supervivientes: ${livingCrops.length}/${crops.length}`,
      `Olas de calor soportadas: ${heatWave}`,
      `Temperatura máxima: ${heatIntensity.toFixed(1)}°C`
    ];

    setTimeout(() => onComplete(result), 1500);
  }, [crops, heatWave, heatIntensity, level.targetScore, onComplete, gameOver]);

  doAction();

  const applyProtection = useCallback((cropId: number, type: ProtectionType) => {
    if (!hasActionsLeft || gameOver) return;

    setCrops(prev => prev.map(crop => {
      if (crop.id !== cropId) return crop;

      const updates: Partial<HeatStressedCrop> = {};

      if (type === 'shade') {
        updates.hasShade = true;
        updates.iotDevice = { ...crop.iotDevice };
      } else if (type === 'cooling') {
        updates.hasCooling = true;
        updates.iotDevice = { ...crop.iotDevice, coolingSystem: true };
      } else if (type === 'water') {
        updates.hasWater = true;
        updates.iotDevice = { ...crop.iotDevice, autoIrrigation: true };
      }

      return { ...crop, ...updates };
    }));
  }, [hasActionsLeft, gameOver]);

  // Sistema de olas de calor progresivas
  useEffect(() => {
    if (gameOver) return;

    const heatTimer = setInterval(() => {
      // Cada 10 segundos, nueva ola de calor
      setHeatWave(prev => prev + 1);
      setHeatIntensity(prev => {
        const increase = 2 + Math.random() * 3; // Incremento aleatorio
        return Math.min(HEATWAVE_CONFIG.MAX_TEMPERATURE, prev + increase);
      });

      // Aplicar daño por calor
      setCrops(prev => prev.map(crop => {
        if (crop.health <= 0) return crop; // Ya muerta

        let effectiveTemp = heatIntensity;

        // Aplicar protecciones
        if (crop.hasShade) effectiveTemp -= HEATWAVE_CONFIG.SHADE_REDUCTION;
        if (crop.hasCooling) effectiveTemp -= HEATWAVE_CONFIG.COOLING_REDUCTION;

        let damage = 0;
        if (effectiveTemp > crop.heatResistance) {
          damage = (effectiveTemp - crop.heatResistance) * HEATWAVE_CONFIG.DAMAGE_MULTIPLIER;

          // El agua reduce el daño
          if (crop.hasWater) {
            damage *= HEATWAVE_CONFIG.WATER_DAMAGE_REDUCTION;
          }
        }

        const newHealth = Math.max(0, crop.health - damage);

        return {
          ...crop,
          health: newHealth,
          temperature: effectiveTemp
        };
      }));
    }, 8000); // Cada 8 segundos una ola

    return () => clearInterval(heatTimer);
  }, [heatIntensity, gameOver]);

  // Verificar condiciones de victoria/derrota
  useEffect(() => {
    if (gameOver) return;

    const dead = crops.filter(c => c.health <= 0).length;
    setDeadCrops(dead);

    // Perder si mueren más del 60% de los cultivos
    if (dead > crops.length * 0.6) {
      endGame(false, '💀 Demasiados cultivos murieron por el calor extremo');
      return;
    }

    // Perder si no quedan acciones y hay cultivos en peligro crítico
    if (actions === 0) {
      const criticalCrops = crops.filter(c =>
        c.health > 0 &&
        c.temperature > c.heatResistance &&
        !c.hasShade &&
        !c.hasCooling &&
        !c.hasWater
      ).length;

      if (criticalCrops > 0) {
        endGame(false, '⚠️ Sin acciones y cultivos sin protección');
      } else {
        // Todos protegidos, esperar resultado final
        const living = crops.filter(c => c.health > 30);
        if (living.length >= crops.length * 0.7) {
          endGame(true, '🏆 ¡Protegiste exitosamente tus cultivos!');
        }
      }
    }

    // Victoria si sobreviven con buena salud después de 5 olas
    if (heatWave >= 6 && dead <= crops.length * 0.3) {
      const avgHealth = crops.reduce((sum, c) => sum + c.health, 0) / crops.length;
      if (avgHealth >= 50) {
        endGame(true, '🎉 ¡Sobreviviste a la ola de calor!');
      }
    }
  }, [crops, actions, heatWave, gameOver, endGame]);

  const getHeatWarningLevel = (temp: number): string => {
    if (temp < 35) return 'bg-green-500';
    if (temp < 40) return 'bg-yellow-500';
    if (temp < 45) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-full bg-gradient-to-b from-orange-900 to-red-900 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🌡️</div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-400">Protección Solar</h3>
            <p className="text-sm text-gray-300">Ola #{heatWave} 🔥</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`text-center px-4 py-2 rounded-lg ${getHeatWarningLevel(heatIntensity)}/30 border-2 ${getHeatWarningLevel(heatIntensity)}`}>
            <div className="text-2xl font-bold text-white">{heatIntensity.toFixed(1)}°C</div>
            <div className="text-xs text-gray-200">🌡️ Calor</div>
          </div>
          <div className={`text-center px-4 py-2 rounded-lg ${actions < 3 ? 'bg-red-600/40 animate-pulse' : 'bg-blue-600/30'
            }`}>
            <div className="text-2xl font-bold text-white">{actions}</div>
            <div className="text-xs text-gray-300">🛠️ Acciones</div>
          </div>
          <div className="text-center bg-red-600/30 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold text-white">{deadCrops}</div>
            <div className="text-xs text-gray-300">💀 Muertas</div>
          </div>
        </div>
      </div>

      {/* NASA Alert */}
      <motion.div
        className="bg-red-600/20 border-2 border-red-500 rounded-lg p-4 mb-4"
        animate={{ opacity: heatIntensity > 40 ? [1, 0.7, 1] : 1 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {heatIntensity > 45 ? '🚨' : heatIntensity > 40 ? '⚠️' : '🌡️'}
          </div>
          <div>
            <h4 className="font-bold text-red-300">
              {heatIntensity > 45 ? 'CALOR EXTREMO' :
                heatIntensity > 40 ? 'ALERTA DE CALOR' :
                  'Ola de Calor Activa'}
            </h4>
            <p className="text-sm text-gray-300">
              Temperatura: {nasaData.temperatureMax.toFixed(1)}°C máx |
              Ola #{heatWave} | ¡Protege tus cultivos ahora!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Campo de cultivos */}
      <div className="relative bg-amber-800/30 rounded-lg p-4 mb-4">
        {/* Efectos de calor intenso */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/30 to-transparent rounded-lg"
          animate={{ x: [-200, 800] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative grid grid-cols-4 gap-3">
          {crops.map((crop) => {
            const healthColor = getHealthColor(crop.health);
            const isDead = crop.health <= 0;
            const isCritical = crop.temperature > crop.heatResistance && crop.health > 0 && crop.health < 40;
            const hasAnyProtection = crop.hasShade || crop.hasCooling || crop.hasWater;

            return (
              <motion.div
                key={crop.id}
                className={`relative ${healthColor} rounded-lg p-3 ${isDead ? 'opacity-30' : ''
                  }`}
                animate={{
                  scale: isDead ? 0.9 : (isCritical && !hasAnyProtection ? [1, 1.05, 1] : 1),
                  rotate: isDead ? [-3, 3, -3] : 0
                }}
                transition={{
                  duration: 1.5,
                  repeat: (isCritical || isDead) ? Infinity : 0
                }}
              >
                {/* Alerta IoT */}
                {isCritical && !hasAnyProtection && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-7 h-7 flex items-center justify-center border-2 border-white z-10"
                    animate={{ scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <span className="text-sm">🚨</span>
                  </motion.div>
                )}

                {/* Planta muerta */}
                {isDead && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-4xl">💀</div>
                  </div>
                )}

                <div className="text-center">
                  <div className={`text-3xl mb-1 ${isDead ? 'grayscale' : ''}`}>
                    {crop.type}
                  </div>

                  {!isDead && (
                    <>
                      <div className="text-white font-bold text-sm mb-1">
                        ❤️ {Math.round(crop.health)}%
                      </div>

                      {/* Sensor IoT */}
                      <div className="bg-black/50 rounded p-1 mb-2 text-xs">
                        <div className={crop.temperature > crop.heatResistance ? 'text-red-400' : 'text-green-400'}>
                          🌡️ {crop.temperature.toFixed(1)}°C
                        </div>
                        <div className="text-gray-300 text-xs">
                          Max: {crop.heatResistance.toFixed(0)}°C
                        </div>
                      </div>

                      {/* Indicadores de protección */}
                      <div className="flex justify-center gap-1 mb-2 min-h-[20px]">
                        {crop.hasShade && <span className="text-sm">🏖️</span>}
                        {crop.hasCooling && <span className="text-sm">❄️</span>}
                        {crop.hasWater && <span className="text-sm">💧</span>}
                      </div>

                      {/* Botones de protección */}
                      {!gameOver && (
                        <div className="flex gap-1">
                          <button
                            className={`flex-1 py-1 rounded text-xs font-bold ${!hasActionsLeft || crop.hasShade
                              ? 'bg-gray-600 cursor-not-allowed opacity-50'
                              : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                            onClick={() => applyProtection(crop.id, 'shade')}
                            disabled={!hasActionsLeft || crop.hasShade}
                            title="Sombra -5°C"
                          >
                            🏖️
                          </button>
                          <button
                            className={`flex-1 py-1 rounded text-xs font-bold ${!hasActionsLeft || crop.hasCooling
                              ? 'bg-gray-600 cursor-not-allowed opacity-50'
                              : 'bg-blue-700 hover:bg-blue-600'
                              }`}
                            onClick={() => applyProtection(crop.id, 'cooling')}
                            disabled={!hasActionsLeft || crop.hasCooling}
                            title="Enfriamiento -8°C"
                          >
                            ❄️
                          </button>
                          <button
                            className={`flex-1 py-1 rounded text-xs font-bold ${!hasActionsLeft || crop.hasWater
                              ? 'bg-gray-600 cursor-not-allowed opacity-50'
                              : 'bg-cyan-700 hover:bg-cyan-600'
                              }`}
                            onClick={() => applyProtection(crop.id, 'water')}
                            disabled={!hasActionsLeft || crop.hasWater}
                            title="Riego -40% daño"
                          >
                            💧
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Efecto visual de daño crítico */}
                {isCritical && (
                  <motion.div
                    className="absolute inset-0 bg-red-500/30 rounded-lg pointer-events-none"
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Panel de herramientas */}
      <div className="bg-black/30 rounded-lg p-4 text-center">
        <h4 className="font-bold text-white mb-2">
          {gameOver ? '🎮 Juego Terminado' : '🛠️ Protecciones Disponibles'}
        </h4>
        {!gameOver ? (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-lg">🏖️</span>
              <span>Sombra (-5°C)</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-lg">❄️</span>
              <span>Enfriamiento (-8°C)</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-lg">💧</span>
              <span>Riego (-40% daño)</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm">Analizando resultados...</p>
        )}
      </div>
    </div>
  );
}