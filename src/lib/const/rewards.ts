import { Achievement, Category } from '@/lib/types/rewards';

export const ACHIEVEMENTS: Achievement[] = [
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

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos', icon: '🏆' },
  { id: 'farming', name: 'Agricultura', icon: '🌾' },
  { id: 'business', name: 'Negocios', icon: '💼' },
  { id: 'sustainability', name: 'Sostenibilidad', icon: '♻️' },
  { id: 'exploration', name: 'Exploración', icon: '🔍' }
];