/**
 * 📚 Tutorial Simple para Minijuegos
 */

"use client";

import { motion, AnimatePresence } from 'framer-motion';
import type { MinigameType } from '@/lib/types/minigames';
import { MINIGAME_INFO } from '@/lib/const/minigames';

interface MinigameTutorialProps {
  gameType: MinigameType;
  onClose: () => void;
}

export default function MinigameTutorial({ gameType, onClose }: MinigameTutorialProps) {
  const game = MINIGAME_INFO[gameType];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full border-4 border-cyan-400/50 shadow-2xl"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="text-8xl mb-4 inline-block"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {game.icon}
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {game.title}
            </h2>
            <p className="text-gray-400 text-lg">
              ¡Súper fácil de jugar!
            </p>
          </div>

          {/* Pasos del tutorial */}
          <div className="space-y-4 mb-8">
            {game.steps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-gray-700/50 rounded-lg p-4 border-2 border-cyan-400/30"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Datos NASA e IoT */}
          <div className="bg-black/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 text-center">
              🛰️ Usarás Datos Reales NASA + Sensores IoT
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 rounded-lg p-4">
                <div className="text-3xl mb-2 text-center">🛰️</div>
                <div className="font-semibold text-white text-center mb-2">
                  Datos NASA
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  {game.nasaData.map((data, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-cyan-400">•</span>
                      {data}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-900/30 rounded-lg p-4">
                <div className="text-3xl mb-2 text-center">📱</div>
                <div className="font-semibold text-white text-center mb-2">
                  Sensores IoT
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  {game.iotDevices.map((device, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-400">•</span>
                      {device}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tip */}
          <motion.div
            className="bg-yellow-600/20 border-2 border-yellow-500 rounded-lg p-4 mb-6"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h4 className="font-bold text-yellow-300 mb-1">
                  Tip Importante
                </h4>
                <p className="text-sm text-gray-300">
                  Observa los sensores 📱 - te avisan qué plantas necesitan ayuda. 
                  ¡Los datos de NASA te ayudan a tomar mejores decisiones!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Botón de inicio */}
          <motion.button
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-4 px-6 rounded-xl font-bold text-white text-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            🚀 ¡Entendido, vamos a jugar!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}