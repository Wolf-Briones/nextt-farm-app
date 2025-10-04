/**
 * 🐛 Juego de Control de Plagas con Detección IoT
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MinigameProps, InfestedPlant } from '@/lib/types/minigames';
import {useActions } from '@/hooks/useMinigame';
import { PEST_CONFIG, IOT_SENSORS } from '@/lib/const/minigames';
import { 
  generatePestPlants,
  createGameResult,
  getHealthColor
} from '@/lib/utils/minigames';



export default function PestControlGame({ 
  level, 
  nasaData, 
  onComplete 
}: MinigameProps) {
  const [plants, setPlants] = useState<InfestedPlant[]>([]);
  const [detectedPests, setDetectedPests] = useState<number[]>([]);
  const { actions, doAction, hasActionsLeft } = useActions(PEST_CONFIG.INITIAL_ACTIONS);
  const [gameOver, setGameOver] = useState(false);
  const [pestWaves, setPestWaves] = useState(0);
  const [totalInfested, setTotalInfested] = useState(0);
  
  // Inicializar plantas
  useEffect(() => {
    setPlants(generatePestPlants(PEST_CONFIG.PLANTS_COUNT, nasaData));
  }, [nasaData]);

  // Terminar juego
  const endGame = useCallback((success: boolean, message: string) => {
    if (gameOver) return;
    setGameOver(true);

    const healthyPlants = plants.filter(p => p.health > 50 && p.pestLevel < 20);
    const avgHealth = plants.reduce((sum, p) => sum + p.health, 0) / plants.length;
    const cleanRate = (plants.filter(p => p.pestLevel === 0).length / plants.length) * 100;
    
    const finalScore = Math.round((avgHealth * 0.5) + (cleanRate * 0.5));
    
    const result = createGameResult(
      finalScore,
      level.targetScore,
      ['Temperature', 'Humidity'],
      [IOT_SENSORS.PEST_DETECTOR, IOT_SENSORS.SMART_TRAP]
    );
    
    result.success = success && finalScore >= level.targetScore;
    result.lessonsLearned = [
      ...result.lessonsLearned,
      message,
      `Plantas saludables: ${healthyPlants.length}/${plants.length}`,
      `Oleadas de plagas: ${pestWaves}`,
      `Infestaciones detectadas: ${totalInfested}`
    ];
    
    setTimeout(() => onComplete(result), 1500);
  }, [plants, pestWaves, totalInfested, level.targetScore, onComplete, gameOver]);

  // Aplicar tratamiento
  const applyTreatment = useCallback((plantId: number, type: 'pesticide' | 'trap' | 'biocontrol') => {
    if (!hasActionsLeft || gameOver) return;

    let effectiveness = 0;
    if (type === 'pesticide') effectiveness = PEST_CONFIG.PESTICIDE_EFFECTIVENESS;
    else if (type === 'trap') effectiveness = PEST_CONFIG.TRAP_EFFECTIVENESS;
    else if (type === 'biocontrol') effectiveness = PEST_CONFIG.BIOCONTROL_EFFECTIVENESS;

    setPlants(prev => prev.map(plant => {
      if (plant.id !== plantId) return plant;
      
      const newPestLevel = Math.max(0, plant.pestLevel - effectiveness);
      
      return {
        ...plant,
        pestLevel: newPestLevel,
        hasPesticide: type === 'pesticide' ? true : plant.hasPesticide,
        hasTrap: type === 'trap' ? true : plant.hasTrap,
        hasBioControl: type === 'biocontrol' ? true : plant.hasBioControl,
        iotSensor: {
          ...plant.iotSensor,
          detected: newPestLevel > 0,
          severity: Math.round(newPestLevel)
        }
      };
    }));

    doAction();
    
    // Animación de detección
    setDetectedPests(prev => [...prev, plantId]);
    setTimeout(() => {
      setDetectedPests(prev => prev.filter(id => id !== plantId));
    }, 1000);
  }, [hasActionsLeft, doAction, gameOver]);

  // Sistema realista de propagación de plagas
  useEffect(() => {
    if (gameOver) return;

    const spreadTimer = setInterval(() => {
      setPestWaves(prev => prev + 1);

      setPlants(prev => {
        const newPlants = [...prev];
        let newInfestations = 0;
        
        newPlants.forEach((plant, index) => {
          // Daño por plagas existentes
          if (plant.pestLevel > 0) {
            const damage = (plant.pestLevel / 100) * PEST_CONFIG.PEST_DAMAGE_RATE;
            plant.health = Math.max(0, plant.health - damage);
          }
          
          // Propagación a vecinos (arriba, abajo, izquierda, derecha)
          if (plant.pestLevel > 30) {
            const neighbors = [
              index - 1, // izquierda
              index + 1, // derecha
              index - 4, // arriba
              index + 4  // abajo
            ].filter(i => {
              // Verificar que el vecino existe y está en la misma fila/columna
              if (i < 0 || i >= newPlants.length) return false;
              
              // Verificar límites de columna para izquierda/derecha
              if (i === index - 1 && index % 4 === 0) return false;
              if (i === index + 1 && (index + 1) % 4 === 0) return false;
              
              return true;
            });
            
            neighbors.forEach(neighborIndex => {
              // Mayor probabilidad de propagación con alta infestación
              const spreadChance = PEST_CONFIG.PEST_SPREAD_RATE * (plant.pestLevel / 100);
              
              if (Math.random() < spreadChance) {
                const spreadAmount = 15 + Math.random() * 10;
                newPlants[neighborIndex].pestLevel = Math.min(
                  PEST_CONFIG.MAX_PEST_LEVEL,
                  newPlants[neighborIndex].pestLevel + spreadAmount
                );
                newPlants[neighborIndex].iotSensor.detected = true;
                newInfestations++;
              }
            });
          }
          
          // Nuevas plagas aparecen si NASA detecta condiciones favorables
          if (nasaData.pestAlert && Math.random() < PEST_CONFIG.PEST_SPAWN_RATE) {
            plant.pestLevel = Math.min(
              PEST_CONFIG.MAX_PEST_LEVEL, 
              plant.pestLevel + 20
            );
            plant.iotSensor.detected = true;
            newInfestations++;
          }
        });
        
        setTotalInfested(prev => prev + newInfestations);
        return newPlants;
      });
    }, 3000); // Cada 3 segundos

    return () => clearInterval(spreadTimer);
  }, [nasaData.pestAlert, gameOver]);

  // Verificar condiciones de victoria/derrota
  useEffect(() => {
    if (gameOver) return;

    const deadPlants = plants.filter(p => p.health <= 0).length;
    const heavilyInfested = plants.filter(p => p.pestLevel > 70).length;
    const cleanPlants = plants.filter(p => p.pestLevel === 0).length;

    // Perder si más del 50% mueren
    if (deadPlants > plants.length / 2) {
      endGame(false, '💀 Demasiadas plantas murieron por las plagas');
      return;
    }

    // Perder si todo el campo está muy infestado
    if (heavilyInfested > plants.length * 0.7) {
      endGame(false, '🐛 El campo está completamente infestado');
      return;
    }

    // Perder si no quedan acciones y hay plagas activas
    if (actions === 0) {
      const activePests = plants.filter(p => p.pestLevel > 20).length;
      
      if (activePests > plants.length * 0.3) {
        endGame(false, '⚠️ Sin acciones y muchas plagas activas');
      } else {
        // Si hay pocas plagas activas, evaluar victoria
        if (cleanPlants >= plants.length * 0.6) {
          endGame(true, '🏆 ¡Campo controlado exitosamente!');
        }
      }
    }

    // Victoria automática si todo limpio
    if (cleanPlants === plants.length && pestWaves > 3) {
      endGame(true, '🎉 ¡Eliminaste todas las plagas!');
    }
  }, [plants, actions, pestWaves, gameOver, endGame]);

  const getPestIcon = (type: 'insects' | 'fungus' | 'bacteria'): string => {
    if (type === 'insects') return '🐛';
    if (type === 'fungus') return '🍄';
    return '🦠';
  };

  const getFieldStatus = () => {
    const healthy = plants.filter(p => p.pestLevel === 0 && p.health > 70).length;
    const infested = plants.filter(p => p.pestLevel > 30).length;
    const critical = plants.filter(p => p.pestLevel > 70 || p.health < 30).length;
    
    return { healthy, infested, critical };
  };

  const fieldStatus = getFieldStatus();

  return (
    <div className="h-full bg-gradient-to-b from-green-900 to-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🐛</div>
          <div>
            <h3 className="text-2xl font-bold text-green-400">Detector de Plagas</h3>
            <p className="text-sm text-gray-300">Oleada #{pestWaves} 🦠</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`text-center px-4 py-2 rounded-lg ${
            nasaData.pestAlert ? 'bg-red-600/40 animate-pulse' : 'bg-green-600/30'
          }`}>
            <div className="text-2xl font-bold text-white">
              {nasaData.pestAlert ? '🚨' : '✅'}
            </div>
            <div className="text-xs text-gray-300">Alerta NASA</div>
          </div>
          <div className={`text-center px-4 py-2 rounded-lg ${
            actions < 3 ? 'bg-red-600/40 animate-pulse' : 'bg-blue-600/30'
          }`}>
            <div className="text-2xl font-bold text-white">{actions}</div>
            <div className="text-xs text-gray-300">🛠️ Acciones</div>
          </div>
          <div className="text-center bg-red-600/30 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold text-white">{fieldStatus.critical}</div>
            <div className="text-xs text-gray-300">⚠️ Críticas</div>
          </div>
        </div>
      </div>

      {/* NASA Pest Alert */}
      {nasaData.pestAlert && (
        <motion.div 
          className="bg-yellow-600/20 border-2 border-yellow-500 rounded-lg p-4 mb-4"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h4 className="font-bold text-yellow-300">Condiciones Ideales para Plagas</h4>
              <p className="text-sm text-gray-300">
                Temp: {nasaData.temperature.toFixed(1)}°C, Humedad: {nasaData.humidity.toFixed(0)}% - 
                ¡Las plagas se multiplican rápidamente!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Estado del campo */}
      <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-green-900/40 rounded p-2">
            <div className="text-lg font-bold text-green-400">{fieldStatus.healthy}</div>
            <div className="text-xs text-gray-300">✅ Saludables</div>
          </div>
          <div className="bg-yellow-900/40 rounded p-2">
            <div className="text-lg font-bold text-yellow-400">{fieldStatus.infested}</div>
            <div className="text-xs text-gray-300">🐛 Infestadas</div>
          </div>
          <div className="bg-red-900/40 rounded p-2">
            <div className="text-lg font-bold text-red-400">{fieldStatus.critical}</div>
            <div className="text-xs text-gray-300">💀 Críticas</div>
          </div>
        </div>
      </div>

      {/* Campo de cultivo */}
      <div className="relative bg-green-900/20 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {plants.map((plant) => {
            const healthColor = getHealthColor(plant.health);
            const isPestDetected = plant.iotSensor.detected;
            const isBeingTreated = detectedPests.includes(plant.id);
            const pestSeverity = plant.iotSensor.severity;
            const isDead = plant.health <= 0;
            const isCritical = (plant.pestLevel > 70 || plant.health < 30) && !isDead;
            
            return (
              <motion.div
                key={plant.id}
                className={`relative ${healthColor} rounded-lg p-2 ${
                  isDead ? 'opacity-40' : ''
                }`}
                animate={{ 
                  scale: isPestDetected && !isDead ? [1, 1.03, 1] : 1,
                  rotate: isDead ? [-2, 2, -2] : 0
                }}
                transition={{ 
                  scale: { duration: 1, repeat: Infinity },
                  rotate: { duration: 2, repeat: isDead ? Infinity : 0 }
                }}
              >
                {/* Alerta IoT de plaga detectada */}
                {isPestDetected && !isDead && (
                  <motion.div 
                    className={`absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white z-10 ${
                      isCritical ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    animate={{ 
                      scale: isCritical ? [1, 1.5, 1] : [1, 1.2, 1],
                      rotate: [0, 15, -15, 0]
                    }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    <span className="text-xs">📡</span>
                  </motion.div>
                )}

                {/* Efecto de tratamiento */}
                <AnimatePresence>
                  {isBeingTreated && (
                    <motion.div
                      className="absolute inset-0 bg-green-400/50 rounded-lg z-20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <div className="flex items-center justify-center h-full text-2xl">
                        ✨
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Planta muerta */}
                {isDead && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-3xl">💀</div>
                  </div>
                )}
                
                <div className="text-center relative z-10">
                  <div className={`text-2xl mb-1 ${isDead ? 'grayscale' : ''}`}>
                    {plant.type}
                  </div>
                  
                  {/* Icono de plaga */}
                  {isPestDetected && !isDead && (
                    <div className="absolute top-0 left-0 text-lg">
                      {getPestIcon(plant.iotSensor.type)}
                    </div>
                  )}
                  
                  {!isDead && (
                    <>
                      <div className="text-white font-bold text-xs mb-1">
                        ❤️ {Math.round(plant.health)}%
                      </div>

                      {/* Sensor IoT */}
                      <div className="bg-black/50 rounded p-1 mb-1 text-xs">
                        <div className={isPestDetected ? 'text-red-400' : 'text-green-400'}>
                          📱 {isPestDetected ? 'PLAGA!' : 'Limpio'}
                        </div>
                        {isPestDetected && (
                          <div className="text-orange-300">
                            {pestSeverity}%
                          </div>
                        )}
                      </div>

                      {/* Barra de plaga */}
                      {plant.pestLevel > 0 && (
                        <div className="w-full bg-gray-600 rounded-full h-1 mb-1">
                          <div 
                            className={`h-1 rounded-full transition-all ${
                              plant.pestLevel > 70 ? 'bg-red-500' :
                              plant.pestLevel > 30 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${plant.pestLevel}%` }}
                          />
                        </div>
                      )}

                      {/* Indicadores de tratamiento */}
                      <div className="flex justify-center gap-1 mb-1 min-h-[16px]">
                        {plant.hasPesticide && <span className="text-xs">💊</span>}
                        {plant.hasTrap && <span className="text-xs">🕷️</span>}
                        {plant.hasBioControl && <span className="text-xs">🐞</span>}
                      </div>

                      {/* Botones de control */}
                      {isPestDetected && !gameOver && (
                        <div className="flex gap-1">
                          <button
                            className={`flex-1 py-1 rounded text-xs font-bold ${
                              !hasActionsLeft || plant.hasPesticide
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-red-700 hover:bg-red-600'
                            }`}
                            onClick={() => applyTreatment(plant.id, 'pesticide')}
                            disabled={!hasActionsLeft || plant.hasPesticide}
                          >
                            💊
                          </button>
                          <button
                            className={`flex-1 py-1 rounded text-xs font-bold ${
                              !hasActionsLeft || plant.hasTrap
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-purple-700 hover:bg-purple-600'
                            }`}
                            onClick={() => applyTreatment(plant.id, 'trap')}
                            disabled={!hasActionsLeft || plant.hasTrap}
                          >
                            🕷️
                          </button>
                          <button
                            className={`flex-1 py-1 rounded text-xs font-bold ${
                              !hasActionsLeft || plant.hasBioControl
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-green-700 hover:bg-green-600'
                            }`}
                            onClick={() => applyTreatment(plant.id, 'biocontrol')}
                            disabled={!hasActionsLeft || plant.hasBioControl}
                          >
                            🐞
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Efecto visual de propagación */}
                {plant.pestLevel > 50 && !isDead && (
                  <motion.div
                    className="absolute inset-0 border-2 border-red-500/50 rounded-lg pointer-events-none"
                    animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Objetivo */}
      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
        <h4 className="font-bold text-white mb-2">
          {gameOver ? '🎮 Juego Terminado' : '🎯 Objetivo'}
        </h4>
        <p className="text-gray-300 text-sm">
          {gameOver 
            ? 'Analizando resultados...'
            : `Los sensores 📱 detectan plagas. Usa pesticida 💊 (rápido -40), trampas 🕷️ (medio -25) o control biológico 🐞 (lento -15 pero ecológico). ¡Las plagas se propagan a vecinos!`
          }
        </p>
      </div>
    </div>
  );
}