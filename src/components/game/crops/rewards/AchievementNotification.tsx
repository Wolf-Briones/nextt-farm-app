"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/lib/types/rewards';

type AchievementNotificationProps = {
  achievement: Achievement | null;
};

export const AchievementNotification = ({ 
  achievement 
}: AchievementNotificationProps) => {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-3 sm:p-4 rounded-lg shadow-lg z-50 max-w-[90vw] sm:max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="text-2xl sm:text-3xl flex-shrink-0"
              animate={{ 
                rotate: [0, 10, -10, 0], 
                scale: [1, 1.2, 1] 
              }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              🏆
            </motion.div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm sm:text-lg">
                ¡Logro Desbloqueado!
              </h4>
              <p className="text-xs sm:text-sm opacity-80 truncate">
                {achievement.name}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};