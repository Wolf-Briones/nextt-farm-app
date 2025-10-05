"use client";

import { motion } from 'framer-motion';
import { Achievement } from '@/lib/types/rewards';
import { 
  getRarityColor, 
  getRarityBadgeColor, 
  getRarityBarColor, 
  getCategoryIcon 
} from '@/lib/utils/rewards.utils';

type AchievementCardProps = {
  achievement: Achievement;
  isNew?: boolean;
};

export const AchievementCard = ({ achievement, isNew }: AchievementCardProps) => {
  const progressPercent = Math.min(
    100, 
    (achievement.requirement.current / achievement.requirement.target) * 100
  );

  return (
    <motion.div
      className={`relative rounded-lg border-2 p-3 sm:p-4 transition-all duration-300 ${
        achievement.unlocked 
          ? getRarityColor(achievement.rarity) 
          : 'border-gray-700 bg-gray-800/30'
      } ${achievement.unlocked ? '' : 'opacity-60'}`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Indicador de nuevo logro */}
      {isNew && (
        <motion.div
          className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold z-10"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          !
        </motion.div>
      )}

      {/* Badge de rareza y categoría */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <span className="text-xs sm:text-sm">
          {getCategoryIcon(achievement.category)}
        </span>
        <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold ${
          getRarityBadgeColor(achievement.rarity)
        }`}>
          {achievement.rarity.toUpperCase()}
        </div>
      </div>

      <div className="flex items-start gap-2 sm:gap-3 mt-6 sm:mt-0">
        {/* Icono del logro */}
        <motion.div
          className="text-2xl sm:text-3xl flex-shrink-0"
          animate={achievement.unlocked ? { 
            scale: [1, 1.1, 1], 
            rotate: [0, 5, -5, 0] 
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {achievement.unlocked ? achievement.icon : '🔒'}
        </motion.div>

        <div className="flex-1 min-w-0">
          {/* Nombre del logro */}
          <h4 className={`font-bold mb-1 text-sm sm:text-base ${
            achievement.unlocked ? 'text-white' : 'text-gray-400'
          } truncate`}>
            {achievement.name}
          </h4>

          {/* Descripción */}
          <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3 line-clamp-2">
            {achievement.description}
          </p>

          {/* Barra de progreso - solo si no está desbloqueado */}
          {!achievement.unlocked && (
            <div className="mb-2 sm:mb-3">
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-1">
                <span>Progreso</span>
                <span>
                  {achievement.requirement.current} / {achievement.requirement.target}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                <motion.div
                  className={`h-1.5 sm:h-2 rounded-full ${
                    getRarityBarColor(achievement.rarity)
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}

          {/* Recompensas */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <span className="text-purple-400">⭐</span>
              <span className="text-purple-400 font-bold">
                {achievement.xpReward} XP
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">💰</span>
              <span className="text-yellow-400 font-bold">
                ${achievement.coinReward}
              </span>
            </div>
            {achievement.unlockedAt && (
              <div className="text-[10px] sm:text-xs text-gray-400 w-full sm:w-auto">
                {achievement.unlockedAt.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Efectos visuales para logros recién desbloqueados */}
      {achievement.unlocked && isNew && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: 3 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent rounded-lg" />
        </motion.div>
      )}
    </motion.div>
  );
};