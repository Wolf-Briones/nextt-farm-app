"use client";

import { motion } from 'framer-motion';
import { PlayerStats } from '@/lib/types/rewards';

type PlayerStatsPanelProps = {
  stats: PlayerStats;
};

export const PlayerStatsPanel = ({ stats }: PlayerStatsPanelProps) => {
  const levelProgress = (stats.xp / stats.xpToNext) * 100;

  const statsGrid = [
    { 
      icon: '🌱', 
      value: stats.cropsPlanted, 
      label: 'Plantas', 
      color: 'text-green-400' 
    },
    { 
      icon: '🚜', 
      value: stats.cropsHarvested, 
      label: 'Cosechas', 
      color: 'text-yellow-400' 
    },
    { 
      icon: '♻️', 
      value: stats.sustainabilityPoints, 
      label: 'Sostenibilidad', 
      color: 'text-cyan-400' 
    },
    { 
      icon: '📈', 
      value: stats.marketTransactions, 
      label: 'Transacciones', 
      color: 'text-purple-400' 
    },
    { 
      icon: '💧', 
      value: `${stats.waterSaved}%`, 
      label: 'Agua', 
      color: 'text-blue-400' 
    },
    { 
      icon: '🌍', 
      value: `${stats.co2Reduced}kg`, 
      label: 'CO₂', 
      color: 'text-green-400' 
    },
    { 
      icon: '🛡️', 
      value: stats.plaguesDefeated, 
      label: 'Plagas', 
      color: 'text-orange-400' 
    },
    { 
      icon: '⏰', 
      value: stats.daysPlayed, 
      label: 'Días', 
      color: 'text-purple-400' 
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      {/* Header del perfil */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-6">
        {/* Avatar del jugador */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl sm:text-2xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            👨‍🚀
          </motion.div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
            {stats.level}
          </div>
        </div>

        {/* Información del nivel y XP */}
        <div className="flex-1 w-full sm:w-auto min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            Granjero Espacial
          </h3>
          <div className="text-gray-400 text-xs sm:text-sm mb-2">
            Nivel {stats.level}
          </div>
          
          {/* Barra de experiencia */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>XP</span>
              <span>{stats.xp} / {stats.xpToNext}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 sm:h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Dinero */}
        <div className="text-left sm:text-right w-full sm:w-auto">
          <div className="text-yellow-400 font-bold text-base sm:text-lg">
            ${stats.money.toLocaleString()}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Dinero</div>
        </div>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
        {statsGrid.map((stat, index) => (
          <div 
            key={index} 
            className="bg-gray-700 rounded-lg p-2 sm:p-3 text-center"
          >
            <div className="text-lg sm:text-2xl mb-1">{stat.icon}</div>
            <div className={`${stat.color} font-bold text-sm sm:text-lg`}>
              {stat.value}
            </div>
            <div className="text-gray-400 text-[10px] sm:text-xs truncate">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};