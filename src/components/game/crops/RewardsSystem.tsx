"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🏆 Tipos para el sistema de recompensas
type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'farming' | 'business' | 'sustainability' | 'exploration';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  coinReward: number;
  requirement: {
    type: string;
    target: number;
    current: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
};

type PlayerStats = {
  level: number;
  xp: number;
  xpToNext: number;
  totalXP: number;
  money: number;
  sustainabilityPoints: number;
  cropsPlanted: number;
  cropsHarvested: number;
  waterSaved: number;
  co2Reduced: number;
  daysPlayed: number;
  perfectHarvests: number;
  marketTransactions: number;
  totalEarnings: number;
  plaguesDefeated: number;
  droughtsWeathered: number;
};

// 🎯 Logros disponibles
const ACHIEVEMENTS: Achievement[] = [
  // Farming
  {
    id: 'first_plant',
    name: 'Primer Brote',
    description: 'Planta tu primer cultivo',
    icon: '🌱',
    category: 'farming',
    rarity: 'common',
    xpReward: 50,
    coinReward: 100,
    requirement: { type: 'cropsPlanted', target: 1, current: 0 },
    unlocked: false
  },
  {
    id: 'green_thumb',
    name: 'Pulgar Verde',
    description: 'Planta 25 cultivos',
    icon: '🌿',
    category: 'farming',
    rarity: 'rare',
    xpReward: 150,
    coinReward: 300,
    requirement: { type: 'cropsPlanted', target: 25, current: 0 },
    unlocked: false
  },
  {
    id: 'harvest_master',
    name: 'Maestro de la Cosecha',
    description: 'Realiza 50 cosechas perfectas',
    icon: '👑',
    category: 'farming',
    rarity: 'epic',
    xpReward: 400,
    coinReward: 1000,
    requirement: { type: 'perfectHarvests', target: 50, current: 0 },
    unlocked: false
  },
  {
    id: 'crop_whisperer',
    name: 'Susurrador de Cultivos',
    description: 'Logra 100% de salud en 10 cultivos simultáneamente',
    icon: '🧙‍♂️',
    category: 'farming',
    rarity: 'legendary',
    xpReward: 800,
    coinReward: 2500,
    requirement: { type: 'perfectHealth', target: 10, current: 0 },
    unlocked: false
  },

  // Business
  {
    id: 'first_sale',
    name: 'Primera Venta',
    description: 'Realiza tu primera transacción en el mercado',
    icon: '💰',
    category: 'business',
    rarity: 'common',
    xpReward: 75,
    coinReward: 150,
    requirement: { type: 'marketTransactions', target: 1, current: 0 },
    unlocked: false
  },
  {
    id: 'market_trader',
    name: 'Comerciante Experto',
    description: 'Realiza 100 transacciones de mercado',
    icon: '📈',
    category: 'business',
    rarity: 'rare',
    xpReward: 200,
    coinReward: 500,
    requirement: { type: 'marketTransactions', target: 100, current: 0 },
    unlocked: false
  },
  {
    id: 'millionaire',
    name: 'Millonario Agrícola',
    description: 'Acumula $1,000,000 en ganancias',
    icon: '💎',
    category: 'business',
    rarity: 'epic',
    xpReward: 500,
    coinReward: 5000,
    requirement: { type: 'totalEarnings', target: 1000000, current: 0 },
    unlocked: false
  },

  // Sustainability
  {
    id: 'water_hero',
    name: 'Héroe del Agua',
    description: 'Ahorra 30% de agua en tus cultivos',
    icon: '💧',
    category: 'sustainability',
    rarity: 'rare',
    xpReward: 250,
    coinReward: 400,
    requirement: { type: 'waterSaved', target: 30, current: 0 },
    unlocked: false
  },
  {
    id: 'carbon_crusher',
    name: 'Triturador de Carbono',
    description: 'Reduce 500kg de CO₂',
    icon: '🌍',
    category: 'sustainability',
    rarity: 'epic',
    xpReward: 350,
    coinReward: 800,
    requirement: { type: 'co2Reduced', target: 500, current: 0 },
    unlocked: false
  },
  {
    id: 'eco_champion',
    name: 'Campeón Ecológico',
    description: 'Alcanza 1000 puntos de sostenibilidad',
    icon: '🏆',
    category: 'sustainability',
    rarity: 'legendary',
    xpReward: 600,
    coinReward: 2000,
    requirement: { type: 'sustainabilityPoints', target: 1000, current: 0 },
    unlocked: false
  },

  // Exploration/Challenges
  {
    id: 'pest_controller',
    name: 'Controlador de Plagas',
    description: 'Derrota 20 infestaciones de plagas',
    icon: '🛡️',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 180,
    coinReward: 350,
    requirement: { type: 'plaguesDefeated', target: 20, current: 0 },
    unlocked: false
  },
  {
    id: 'drought_survivor',
    name: 'Superviviente de Sequía',
    description: 'Supera 5 períodos de sequía',
    icon: '🌵',
    category: 'exploration',
    rarity: 'epic',
    xpReward: 300,
    coinReward: 600,
    requirement: { type: 'droughtsWeathered', target: 5, current: 0 },
    unlocked: false
  },
  {
    id: 'nasa_partner',
    name: 'Socio de la NASA',
    description: 'Utiliza datos de la NASA durante 30 días consecutivos',
    icon: '🚀',
    category: 'exploration',
    rarity: 'legendary',
    xpReward: 750,
    coinReward: 3000,
    requirement: { type: 'daysPlayed', target: 30, current: 0 },
    unlocked: false
  }
];

// 🏅 Componente de logro individual
const AchievementCard = ({ achievement, isNew }: { achievement: Achievement; isNew?: boolean }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-800/50';
      case 'rare': return 'border-blue-500 bg-blue-800/20';
      case 'epic': return 'border-purple-500 bg-purple-800/20';
      case 'legendary': return 'border-yellow-500 bg-yellow-800/20';
      default: return 'border-gray-500 bg-gray-800/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'farming': return '🌾';
      case 'business': return '💼';
      case 'sustainability': return '♻️';
      case 'exploration': return '🔍';
      default: return '⭐';
    }
  };

  const progressPercent = Math.min(100, (achievement.requirement.current / achievement.requirement.target) * 100);

  return (
    <motion.div
      className={`relative rounded-lg border-2 p-4 transition-all duration-300 ${
        achievement.unlocked ? getRarityColor(achievement.rarity) : 'border-gray-700 bg-gray-800/30'
      } ${achievement.unlocked ? '' : 'opacity-60'}`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Indicador de nuevo logro */}
      {isNew && (
        <motion.div
          className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          !
        </motion.div>
      )}

      {/* Badge de rareza */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <span className="text-xs">{getCategoryIcon(achievement.category)}</span>
        <div className={`px-2 py-1 rounded text-xs font-bold ${
          achievement.rarity === 'common' ? 'bg-gray-600 text-gray-200' :
          achievement.rarity === 'rare' ? 'bg-blue-600 text-blue-200' :
          achievement.rarity === 'epic' ? 'bg-purple-600 text-purple-200' :
          'bg-yellow-600 text-yellow-200'
        }`}>
          {achievement.rarity.toUpperCase()}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <motion.div
          className="text-3xl"
          animate={achievement.unlocked ? { 
            scale: [1, 1.1, 1], 
            rotate: [0, 5, -5, 0] 
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {achievement.unlocked ? achievement.icon : '🔒'}
        </motion.div>

        <div className="flex-1">
          <h4 className={`font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
            {achievement.name}
          </h4>
          <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>

          {/* Barra de progreso */}
          {!achievement.unlocked && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progreso</span>
                <span>{achievement.requirement.current} / {achievement.requirement.target}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    achievement.rarity === 'common' ? 'bg-gray-400' :
                    achievement.rarity === 'rare' ? 'bg-blue-400' :
                    achievement.rarity === 'epic' ? 'bg-purple-400' :
                    'bg-yellow-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}

          {/* Recompensas */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-purple-400">⭐</span>
              <span className="text-purple-400 font-bold">{achievement.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">💰</span>
              <span className="text-yellow-400 font-bold">${achievement.coinReward}</span>
            </div>
            {achievement.unlockedAt && (
              <div className="text-xs text-gray-400">
                Desbloqueado: {achievement.unlockedAt.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Efectos visuales para logros desbloqueados */}
      {achievement.unlocked && isNew && (
        <motion.div
          className="absolute inset-0 rounded-lg"
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

// 📊 Panel de estadísticas del jugador
const PlayerStatsPanel = ({ stats }: { stats: PlayerStats }) => {
  const levelProgress = (stats.xp / stats.xpToNext) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            👨‍🚀
          </motion.div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {stats.level}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">Granjero Espacial</h3>
          <div className="text-gray-400 text-sm">Nivel {stats.level}</div>
          
          {/* Barra de experiencia */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>XP</span>
              <span>{stats.xp} / {stats.xpToNext}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-yellow-400 font-bold text-lg">${stats.money}</div>
          <div className="text-gray-400 text-sm">Dinero</div>
        </div>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🌱</div>
          <div className="text-green-400 font-bold text-lg">{stats.cropsPlanted}</div>
          <div className="text-gray-400 text-xs">Plantas Sembradas</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🚜</div>
          <div className="text-yellow-400 font-bold text-lg">{stats.cropsHarvested}</div>
          <div className="text-gray-400 text-xs">Cosechas</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">♻️</div>
          <div className="text-cyan-400 font-bold text-lg">{stats.sustainabilityPoints}</div>
          <div className="text-gray-400 text-xs">Sostenibilidad</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">📈</div>
          <div className="text-purple-400 font-bold text-lg">{stats.marketTransactions}</div>
          <div className="text-gray-400 text-xs">Transacciones</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">💧</div>
          <div className="text-blue-400 font-bold text-lg">{stats.waterSaved}%</div>
          <div className="text-gray-400 text-xs">Agua Ahorrada</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🌍</div>
          <div className="text-green-400 font-bold text-lg">{stats.co2Reduced}kg</div>
          <div className="text-gray-400 text-xs">CO₂ Reducido</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🛡️</div>
          <div className="text-orange-400 font-bold text-lg">{stats.plaguesDefeated}</div>
          <div className="text-gray-400 text-xs">Plagas Derrotadas</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">⏰</div>
          <div className="text-purple-400 font-bold text-lg">{stats.daysPlayed}</div>
          <div className="text-gray-400 text-xs">Días Jugados</div>
        </div>
      </div>
    </div>
  );
};

// 🎮 Componente principal del sistema de recompensas
export default function RewardsSystem() {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 5,
    xp: 750,
    xpToNext: 1000,
    totalXP: 4750,
    money: 15000,
    sustainabilityPoints: 450,
    cropsPlanted: 43,
    cropsHarvested: 28,
    waterSaved: 25,
    co2Reduced: 180,
    daysPlayed: 12,
    perfectHarvests: 15,
    marketTransactions: 67,
    totalEarnings: 45000,
    plaguesDefeated: 8,
    droughtsWeathered: 2
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    // Simular algunos logros desbloqueados
    return ACHIEVEMENTS.map((achievement, index) => {
      const shouldUnlock = index < 4; // Desbloquear los primeros 4
      return {
        ...achievement,
        requirement: {
          ...achievement.requirement,
          current: shouldUnlock ? achievement.requirement.target : 
                  Math.floor(Math.random() * achievement.requirement.target * 0.8)
        },
        unlocked: shouldUnlock,
        unlockedAt: shouldUnlock ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
      };
    });
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Simular progreso y desbloqueo de logros
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerStats(prev => ({
        ...prev,
        xp: Math.min(prev.xpToNext, prev.xp + Math.floor(Math.random() * 20)),
        sustainabilityPoints: prev.sustainabilityPoints + Math.floor(Math.random() * 3),
        co2Reduced: prev.co2Reduced + Math.floor(Math.random() * 2)
      }));

      // Simular desbloqueo ocasional de logros
      if (Math.random() > 0.95) {
        setAchievements(prev => {
          const unlockedIndex = prev.findIndex(a => !a.unlocked);
          if (unlockedIndex !== -1) {
            const newAchievements = [...prev];
            newAchievements[unlockedIndex] = {
              ...newAchievements[unlockedIndex],
              unlocked: true,
              unlockedAt: new Date()
            };
            
            setNewAchievements(old => [...old, newAchievements[unlockedIndex].id]);
            setTimeout(() => {
              setNewAchievements(old => old.filter(id => id !== newAchievements[unlockedIndex].id));
            }, 5000);
            
            return newAchievements;
          }
          return prev;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏆' },
    { id: 'farming', name: 'Agricultura', icon: '🌾' },
    { id: 'business', name: 'Negocios', icon: '💼' },
    { id: 'sustainability', name: 'Sostenibilidad', icon: '♻️' },
    { id: 'exploration', name: 'Exploración', icon: '🔍' }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="h-full space-y-6">
      {/* Panel de estadísticas del jugador */}
      <PlayerStatsPanel stats={playerStats} />

      {/* Resumen de logros */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="text-lg font-bold text-white">Logros Desbloqueados</h3>
              <p className="text-gray-400 text-sm">{unlockedCount} de {totalCount} completados</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">{Math.round(completionPercent)}%</div>
            <div className="text-gray-400 text-sm">Completado</div>
          </div>
        </div>

        {/* Barra de progreso global */}
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 2 }}
          />
        </div>
      </div>

      {/* Filtros de categorías */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              selectedCategory === category.id 
                ? 'border-cyan-400 bg-cyan-900/20 text-cyan-400' 
                : 'border-gray-600 text-gray-400 hover:border-gray-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Grid de logros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAchievements.map((achievement) => (
            <AchievementCard 
              key={achievement.id}
              achievement={achievement}
              isNew={newAchievements.includes(achievement.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Notificación de logro nuevo */}
      <AnimatePresence>
        {newAchievements.length > 0 && (
          <motion.div
            className="fixed top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-4 rounded-lg shadow-lg z-50 max-w-sm"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🏆
              </motion.div>
              <div>
                <h4 className="font-bold text-lg">¡Logro Desbloqueado!</h4>
                <p className="text-sm opacity-80">
                  {achievements.find(a => a.id === newAchievements[0])?.name}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}