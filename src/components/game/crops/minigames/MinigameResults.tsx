/**
 * 🏆 Pantalla de Resultados del Juego
 */

"use client";

import { motion } from 'framer-motion';
import type { GameResult, MinigameType } from '@/lib/types/minigames';
import { MINIGAME_INFO } from '@/lib/const/minigames';

interface GameResultsProps {
  result: GameResult;
  gameType: MinigameType;
  level: number;
  onNextLevel?: () => void;
  onRetry?: () => void;
  onExit: () => void;
}

export default function GameResults({ 
  result, 
  gameType,
  level,
  onNextLevel,
  onRetry,
  onExit 
}: GameResultsProps) {
  const game = MINIGAME_INFO[gameType];
  const canAdvance = result.success && level < 3 && onNextLevel;

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full border-4 border-cyan-400/50 shadow-2xl"
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* Resultado principal */}
        <div className="text-center mb-8">
          <motion.div
            className="text-9xl mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 1 }}
          >
            {result.success ? '🏆' : '💪'}
          </motion.div>
          
          <h2 className={`text-4xl font-bold mb-2 ${
            result.success ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {result.success ? '¡Nivel Completado!' : '¡Buen Intento!'}
          </h2>
          
          <p className="text-gray-400 text-lg mb-4">
            {game.title} - Nivel {level}
          </p>

          {/* Puntuación */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 mb-6">
            <div className="text-6xl font-bold text-white mb-2">
              {result.score}%
            </div>
            <div className="text-gray-300">Puntuación Final</div>
          </div>

          {/* Estrellas */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                className="text-6xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: star <= result.stars ? 1 : 0.3,
                  scale: 1
                }}
                transition={{ delay: star * 0.2 }}
              >
                {star <= result.stars ? '⭐' : '☆'}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Datos NASA utilizados */}
        <div className="bg-black/30 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
            🛰️ Datos NASA Utilizados
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.nasaDataUsed.map((data, i) => (
              <motion.div
                key={i}
                className="bg-blue-900/50 px-3 py-2 rounded-full text-sm text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                📡 {data}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sensores IoT utilizados */}
        <div className="bg-black/30 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            📱 Sensores IoT Utilizados
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.iotDevicesUsed.map((device, i) => (
              <motion.div
                key={i}
                className="bg-green-900/50 px-3 py-2 rounded-full text-sm text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                📱 {device}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lecciones aprendidas */}
        {result.lessonsLearned.length > 0 && (
          <div className="bg-yellow-900/20 border-2 border-yellow-500/50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
              💡 Lo que Aprendiste
            </h3>
            <ul className="space-y-2">
              {result.lessonsLearned.map((lesson, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-gray-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 + 0.5 }}
                >
                  <span className="text-yellow-400 text-xl flex-shrink-0">✓</span>
                  <span className="text-sm">{lesson}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="grid grid-cols-1 gap-3">
          {canAdvance && (
            <motion.button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextLevel}
            >
              🚀 Siguiente Nivel
            </motion.button>
          )}
          
          {!result.success && onRetry && (
            <motion.button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
            >
              🔄 Intentar de Nuevo
            </motion.button>
          )}
          
          <motion.button
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExit}
          >
            ← Volver al Menú
          </motion.button>
        </div>

        {/* Mensaje motivacional */}
        <motion.div
          className="mt-6 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {result.success 
            ? '¡Excelente trabajo usando tecnología NASA e IoT! 🌟'
            : '¡Sigue practicando! La agricultura inteligente requiere paciencia 🌱'}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}