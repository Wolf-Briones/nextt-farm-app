/**
 * 🎮 Constantes para el Sistema de Minijuegos
 */

import type { MinigameLevel, PlantType } from '@/lib/types/minigames';

// 🌱 Tipos de plantas disponibles
export const PLANT_TYPES: PlantType[] = ['🌽', '🌾', '🍅', '🥔', '🥕', '🌶️'];

// 🎯 Configuración de niveles
export const GAME_LEVELS: Record<number, MinigameLevel> = {
  1: { 
    id: 1, 
    difficulty: 'easy', 
    timeLimit: 20, 
    targetScore: 60 
  },
  2: { 
    id: 2, 
    difficulty: 'medium', 
    timeLimit: 40, 
    targetScore: 75 
  },
  3: { 
    id: 3, 
    difficulty: 'hard', 
    timeLimit: 50, 
    targetScore: 85 
  }
};

// 🎮 Información de cada minijuego
export const MINIGAME_INFO = {
  irrigation: {
    title: '💧 Riego Inteligente',
    shortTitle: 'Riego',
    icon: '💧',
    color: 'blue',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-900/20',
    description: 'Usa sensores IoT para regar perfectamente',
    steps: [
      '🔍 Mira los sensores de cada planta',
      '💧 Riega las que lo necesitan',
      '🎯 Ahorra agua y mantén felices a las plantas'
    ],
    nasaData: ['SMAP Soil Moisture', 'Evapotranspiration'],
    iotDevices: ['Sensor de Humedad', 'Válvula Automática']
  },
  heatwave: {
    title: '🌡️ Protección Solar',
    shortTitle: 'Calor',
    icon: '🌡️',
    color: 'red',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-900/20',
    description: '¡Protege tus plantas del sol extremo!',
    steps: [
      '🌡️ Revisa qué plantas tienen más calor',
      '🏖️ Ponles sombra, agua o enfriamiento',
      '💚 Mantén a todas saludables'
    ],
    nasaData: ['Temperature Max', 'Heat Index'],
    iotDevices: ['Termómetro IoT', 'Sistema de Enfriamiento']
  },
  pest: {
    title: '🐛 Detector de Plagas',
    shortTitle: 'Plagas',
    icon: '🐛',
    color: 'green',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-900/20',
    description: 'Encuentra y elimina plagas con sensores',
    steps: [
      '📡 Los sensores detectan plagas',
      '🎯 Elimínalas rápido antes que se expandan',
      '🌿 Protege el cultivo completo'
    ],
    nasaData: ['Temperature', 'Humidity'],
    iotDevices: ['Sensor de Plagas', 'Trampa Inteligente']
  },
  drought: {
    title: '🌵 Supervivencia en Sequía',
    shortTitle: 'Sequía',
    icon: '🌵',
    color: 'yellow',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-900/20',
    description: 'Gestiona el agua limitada sabiamente',
    steps: [
      '💧 Tienes poca agua disponible',
      '⚖️ Decide qué plantas salvar primero',
      '🏆 Maximiza la supervivencia'
    ],
    nasaData: ['Precipitation', 'Drought Risk'],
    iotDevices: ['Monitor de Agua', 'Sistema de Prioridades']
  }
} as const;

// 🎨 Colores para los estados de salud
export const HEALTH_COLORS = {
  excellent: 'bg-green-500',
  good: 'bg-lime-500',
  fair: 'bg-yellow-500',
  poor: 'bg-orange-500',
  critical: 'bg-red-500'
} as const;

// 💧 Configuración del juego de riego
export const IRRIGATION_CONFIG = {
  INITIAL_WATER_BUDGET: 300,
  PARCELS_COUNT: 12,
  MIN_WATER_LEVEL: 0,
  MAX_WATER_LEVEL: 100,
  MIN_SOIL_MOISTURE: 20,
  MAX_SOIL_MOISTURE: 80,
  WATER_AMOUNTS: [10, 25, 50],
  OPTIMAL_RANGE: { min: 60, max: 90 },
  POINTS_PER_ACTION: 10,
  EVAPORATION_RATE: 0.5
} as const;

// 🌡️ Configuración del juego de calor
export const HEATWAVE_CONFIG = {
  CROPS_COUNT: 8,
  INITIAL_HEALTH: 100,
  BASE_TEMPERATURE: 35,
  MAX_TEMPERATURE: 50,
  HEAT_INCREMENT_RATE: 0.3,
  DAMAGE_MULTIPLIER: 0.5,
  SHADE_REDUCTION: 5,
  COOLING_REDUCTION: 8,
  WATER_DAMAGE_REDUCTION: 0.6,
  INITIAL_ACTIONS: 12,
  HEAT_RESISTANCE_RANGE: { min: 30, max: 70 }
} as const;

// 🐛 Configuración del juego de plagas
export const PEST_CONFIG = {
  PLANTS_COUNT: 16,
  INITIAL_HEALTH: 100,
  PEST_SPAWN_RATE: 0.15,
  PEST_SPREAD_RATE: 0.2,
  PEST_DAMAGE_RATE: 1.5,
  MAX_PEST_LEVEL: 100,
  PESTICIDE_EFFECTIVENESS: 40,
  TRAP_EFFECTIVENESS: 25,
  BIOCONTROL_EFFECTIVENESS: 15,
  DETECTION_RANGE: 2,
  INITIAL_ACTIONS: 15
} as const;

// 🌵 Configuración del juego de sequía
export const DROUGHT_CONFIG = {
  CROPS_COUNT: 10,
  INITIAL_WATER_RESERVE: 200,
  CRITICAL_WATER_LEVEL: 50,
  WATER_CONSUMPTION_RATE: 5,
  MULCH_REDUCTION: 0.3,
  DEEP_ROOT_BONUS: 0.4,
  PRIORITY_BONUS: 20,
  MIN_SURVIVAL_CHANCE: 0,
  MAX_SURVIVAL_CHANCE: 100
} as const;

// 📊 Puntuaciones para estrellas
export const STAR_THRESHOLDS = {
  THREE_STARS: 90,
  TWO_STARS: 75,
  ONE_STAR: 60,
  ZERO_STARS: 0
} as const;

// 🏅 Mensajes de logros
export const ACHIEVEMENT_MESSAGES = {
  PERFECT_SCORE: '🏆 ¡Puntuación Perfecta!',
  WATER_SAVER: '💧 ¡Maestro del Ahorro!',
  HEAT_MASTER: '🌡️ ¡Experto en Calor!',
  PEST_HUNTER: '🐛 ¡Cazador de Plagas!',
  DROUGHT_SURVIVOR: '🌵 ¡Superviviente de Sequía!',
  NASA_EXPERT: '🛰️ ¡Experto NASA!',
  IOT_MASTER: '📱 ¡Maestro IoT!'
} as const;

// 📡 Nombres de sensores IoT
export const IOT_SENSORS = {
  SOIL_MOISTURE: 'Sensor de Humedad del Suelo',
  TEMPERATURE: 'Termómetro Digital',
  HUMIDITY: 'Sensor de Humedad Ambiental',
  LIGHT: 'Sensor de Luz',
  PEST_DETECTOR: 'Detector de Plagas',
  WATER_LEVEL: 'Medidor de Agua',
  AUTO_VALVE: 'Válvula Automática',
  COOLING_SYSTEM: 'Sistema de Enfriamiento',
  SMART_TRAP: 'Trampa Inteligente'
} as const;

// 🛰️ Fuentes de datos NASA
export const NASA_DATA_SOURCES = {
  SMAP: 'NASA SMAP - Humedad del Suelo',
  POWER: 'NASA POWER - Datos Meteorológicos',
  MODIS: 'NASA MODIS - Vegetación',
  OPENET: 'OpenET - Evapotranspiración'
} as const;