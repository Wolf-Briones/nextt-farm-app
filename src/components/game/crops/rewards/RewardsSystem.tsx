"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, PlayerStats } from '@/lib/types/rewards';
import { ACHIEVEMENTS, CATEGORIES } from '@/lib/const/rewards';
import { AchievementCard } from './AchievementCard';
import { PlayerStatsPanel } from './PlayerStatsPanel';
import { CategoryFilters } from './CategoryFilters';
import { AchievementNotification } from './AchievementNotification';

export default function RewardsSystem() {
  // Estado de las estadísticas del jugador
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

  // Estado de los logros
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    // Inicializar con algunos logros desbloqueados
    return ACHIEVEMENTS.map((achievement, index) => {
      const shouldUnlock = index < 4; // Desbloquear los primeros 4
      return {
        ...achievement,
        requirement: {
          ...achievement.requirement,
          current: shouldUnlock 
            ? achievement.requirement.target 
            : Math.floor(Math.random() * achievement.requirement.target * 0.8)
        },
        unlocked: shouldUnlock,
        unlockedAt: shouldUnlock 
          ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) 
          : undefined
      };
    });
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Simulación de progreso y desbloqueo de logros
  useEffect(() => {
    const interval = setInterval(() => {
      // Actualizar estadísticas aleatoriamente
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
            
            // Agregar a la lista de logros nuevos
            setNewAchievements(old => [...old, newAchievements[unlockedIndex].id]);
            
            // Remover de la lista después de 5 segundos
            setTimeout(() => {
              setNewAchievements(old => 
                old.filter(id => id !== newAchievements[unlockedIndex].id)
              );
            }, 5000);
            
            return newAchievements;
          }
          return prev;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Filtrar logros por categoría
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  // Calcular estadísticas de progreso
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = (unlockedCount / totalCount) * 100;

  // Obtener el logro actual para la notificación
  const currentNotification = newAchievements.length > 0 
    ? achievements.find(a => a.id === newAchievements[0]) || null
    : null;

  return (
    <div className="min-h-screen bg-gray-900 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Panel de estadísticas del jugador */}
        <PlayerStatsPanel stats={playerStats} />

        {/* Resumen de progreso de logros */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🏆</span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Logros Desbloqueados
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {unlockedCount} de {totalCount} completados
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                {Math.round(completionPercent)}%
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Completado</div>
            </div>
          </div>

          {/* Barra de progreso global */}
          <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 sm:h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 2 }}
            />
          </div>
        </div>

        {/* Filtros de categorías */}
        <CategoryFilters 
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Grid de logros */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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
        <AchievementNotification achievement={currentNotification} />
      </div>
    </div>
  );
}