/**
 * 🎮 Sistema Principal de Minijuegos de Agricultura Inteligente
 * Integra todos los componentes y gestiona el flujo del juego
 */

"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {GameResult } from '@/lib/types/minigames';
import { useGameState, useNASAData } from '@/hooks/useMinigame';
import { GAME_LEVELS, MINIGAME_INFO } from '@/lib/const/minigames';

// Importar componentes
import MinigamesGameSelector from '@/components/game/crops/minigames/MinigameSelector';
import MinigameTutorial from '@/components/game/crops/minigames/MinigameTutorial';
import MinigameResults from '@/components/game/crops/minigames/MinigameResults';
import IrrigationGame from '@/components/game/crops/minigames/IrrigationGame';
import HeatwaveGame from '@/components/game/crops/minigames/HeatwaveGame';
import PestControlGame from '@/components/game/crops/minigames/PestControlGame';

export default function MinigamesSystem() {
  const { gameState, startGame, completeGame, pauseGame, exitGame, closeTutorial } = useGameState();
  const { nasaData, isLoading, error } = useNASAData();
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Manejar finalización del juego
  const handleGameComplete = useCallback((result: GameResult) => {
    setGameResult(result);
    setShowResults(true);
    
    // Después de mostrar resultados, decidir qué hacer
    setTimeout(() => {
      completeGame(result);
      setShowResults(false);
    }, 5000);
  }, [completeGame]);

  // Manejar siguiente nivel
  const handleNextLevel = useCallback(() => {
    setShowResults(false);
    // completeGame ya avanza el nivel automáticamente
  }, []);

  // Manejar reintentar
  const handleRetry = useCallback(() => {
    setShowResults(false);
    if (gameState.currentGame) {
      startGame(gameState.currentGame);
    }
  }, [gameState.currentGame, startGame]);

  // Manejar salir
  const handleExit = useCallback(() => {
    setShowResults(false);
    exitGame();
  }, [exitGame]);

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🛰️
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">
            Cargando Datos NASA...
          </h3>
          <p className="text-gray-400">
            Conectando con satélites 🌍
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error || !nasaData) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">
            Error al Cargar Datos
          </h3>
          <p className="text-gray-400 mb-4">
            {error || 'No se pudieron cargar los datos de NASA'}
          </p>
          <p className="text-sm text-gray-500">
            Usando datos de respaldo para continuar...
          </p>
        </div>
      </div>
    );
  }

  // Vista del selector de juegos
  if (!gameState.currentGame) {
    return <MinigamesGameSelector onSelectGame={startGame} />;
  }

  // Obtener configuración del nivel actual
  const currentLevel = GAME_LEVELS[gameState.level];
  const currentGameInfo = MINIGAME_INFO[gameState.currentGame];

  return (
    <div className="h-full relative">
      {/* Header del juego activo */}
      <motion.div 
        className="bg-gray-800 rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exitGame}
            >
              ← Salir
            </motion.button>
            
            <div className="flex items-center gap-3">
              <div className="text-3xl">{currentGameInfo.icon}</div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {currentGameInfo.shortTitle} - Nivel {gameState.level}
                </h2>
                <p className="text-sm text-gray-400 capitalize">
                  Dificultad: {currentLevel.difficulty}
                </p>
              </div>
            </div>
          </div>

          {/* Indicadores de progreso */}
          <div className="flex items-center gap-4">
            {/* Nivel */}
            <div className="flex gap-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-full ${
                    level <= gameState.level 
                      ? 'bg-cyan-400' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Botón de pausa */}
            <motion.button
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-bold text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={pauseGame}
            >
              {gameState.isPaused ? '▶️ Reanudar' : '⏸️ Pausar'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Juego activo */}
      <AnimatePresence mode="wait">
        {gameState.isPlaying && !showResults && (
          <motion.div
            key={`${gameState.currentGame}-${gameState.level}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="h-[calc(100%-6rem)]"
          >
            {gameState.currentGame === 'irrigation' && (
              <IrrigationGame
                level={currentLevel}
                nasaData={nasaData}
                onComplete={handleGameComplete}
              />
            )}
            
            {gameState.currentGame === 'heatwave' && (
              <HeatwaveGame
                level={currentLevel}
                nasaData={nasaData}
                onComplete={handleGameComplete}
              />
            )}
            
            {gameState.currentGame === 'pest' && (
              <PestControlGame
                level={currentLevel}
                nasaData={nasaData}
                onComplete={handleGameComplete}
              />
            )}
    
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial - USANDO MinigameTutorial con prop gameType */}
      {gameState.showTutorial && gameState.currentGame && (
        <MinigameTutorial
          gameType={gameState.currentGame}
          onClose={closeTutorial}
        />
      )}

      {/* Pantalla de pausa */}
      <AnimatePresence>
        {gameState.isPaused && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-8 text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <div className="text-6xl mb-4">⏸️</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Juego Pausado
              </h3>
              <motion.button
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold text-white text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseGame}
              >
                ▶️ Continuar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultados - USANDO MinigameResults */}
      {showResults && gameResult && gameState.currentGame && (
        <MinigameResults
          result={gameResult}
          gameType={gameState.currentGame}
          level={gameState.level}
          onNextLevel={gameResult.success && gameState.level < 3 ? handleNextLevel : undefined}
          onRetry={!gameResult.success ? handleRetry : undefined}
          onExit={handleExit}
        />
      )}

      {/* Indicador de conexión NASA */}
      <motion.div
        className="fixed bottom-4 right-4 bg-green-600/90 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🛰️
          </motion.span>
          NASA Conectado
        </span>
      </motion.div>
    </div>
  );
}