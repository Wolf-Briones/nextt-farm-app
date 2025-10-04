/**
 * 📚 Tutorial Simple para Minijuegos
 */

"use client";

import { motion } from 'framer-motion';
import type { MinigameType } from '@/lib/types/minigames';
import { MINIGAME_INFO } from '@/lib/const/minigames';


interface MinigamesGameSelectorProps {
  onSelectGame: (game: MinigameType) => void;
}

export default function MinigamesGameSelector({ onSelectGame }: MinigamesGameSelectorProps) {
  const games: MinigameType[] = ['irrigation', 'heatwave', 'pest', 'drought'];

  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-6 overflow-y-auto">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="text-6xl mb-4"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌱
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Agricultura Inteligente
        </h2>
        <p className="text-gray-400 text-lg">
          Aprende con datos reales de NASA + Sensores IoT
        </p>
      </motion.div>

      {/* Grid de juegos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {games.map((gameId, index) => {
          const game = MINIGAME_INFO[gameId];
          
          return (
            <motion.div
              key={gameId}
              className={`${game.bgColor} ${game.borderColor} border-4 rounded-xl p-6 cursor-pointer transition-all hover:shadow-2xl`}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectGame(gameId)}
            >
              {/* Icono animado */}
              <div className="text-center mb-4">
                <motion.div
                  className="text-7xl mb-3 inline-block"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  {game.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Pasos del juego */}
              <div className="bg-black/30 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-bold text-cyan-400 mb-2">
                  ¿Cómo jugar?
                </h4>
                <ul className="space-y-2">
                  {game.steps.map((step, i) => (
                    <li 
                      key={i}
                      className="text-xs text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-yellow-400 font-bold flex-shrink-0">
                        {i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Datos NASA e IoT */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-lg mb-1">🛰️</div>
                  <div className="text-xs text-gray-400 font-semibold">
                    NASA
                  </div>
                  <div className="text-xs text-gray-300">
                    {game.nasaData[0]}
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-lg mb-1">📱</div>
                  <div className="text-xs text-gray-400 font-semibold">
                    IoT
                  </div>
                  <div className="text-xs text-gray-300">
                    {game.iotDevices[0]}
                  </div>
                </div>
              </div>

              {/* Botón de jugar */}
              <motion.button
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3 px-6 rounded-lg font-bold text-white text-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🚀 ¡Jugar Ahora!
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Panel de información NASA */}
      <motion.div 
        className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-2 border-cyan-400/30 rounded-xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
          🛰️ Tecnología NASA + IoT en Tiempo Real
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📡', title: 'SMAP', desc: 'Humedad del suelo desde el espacio' },
            { icon: '🌡️', title: 'POWER', desc: 'Datos meteorológicos globales' },
            { icon: '🌿', title: 'MODIS', desc: 'Salud de cultivos por satélite' },
            { icon: '📱', title: 'IoT', desc: 'Sensores inteligentes en campo' }
          ].map((tech, i) => (
            <motion.div
              key={i}
              className="text-center bg-black/30 rounded-lg p-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">{tech.icon}</div>
              <div className="font-bold text-white mb-1">{tech.title}</div>
              <div className="text-xs text-gray-400">{tech.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decoración de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-10"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌽
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-6xl opacity-10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🚜
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-20 text-6xl opacity-10"
          animate={{ 
            x: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🛰️
        </motion.div>
      </div>
    </div>
  );
}