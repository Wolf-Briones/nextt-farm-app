/**
 * 🎯 Tipos para el Sistema de Minijuegos de Agricultura Inteligente
 */

export type MinigameType = 'irrigation' | 'heatwave' | 'pest' | 'drought';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type PlantType = '🌽' | '🌾' | '🍅' | '🥔' | '🥕' | '🌶️';

export type ProtectionType = 'shade' | 'cooling' | 'water' | 'pesticide';

export type DroughtRisk = 'bajo' | 'medio' | 'alto';

// 📊 Datos NASA en tiempo real
export interface NASARealtimeData {
  temperature: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  humidity: number;
  evapotranspiration: number;
  soilMoisture: number;
  heatStress: boolean;
  droughtRisk: DroughtRisk;
  pestAlert: boolean;
  ndvi: number;
}

// 🎮 Configuración de nivel
export interface MinigameLevel {
  id: number;
  difficulty: Difficulty;
  timeLimit: number;
  targetScore: number;
}

// 🌱 Parcela de cultivo (Irrigation Game)
export interface CropParcel {
  id: number;
  plantType: PlantType;
  waterLevel: number;
  soilMoisture: number;
  evapotranspiration: number;
  optimalWater: number;
  hasIoTSensor: boolean;
  sensorData: {
    temperature: number;
    humidity: number;
    lastReading: number;
  };
}

// 🌡️ Cultivo con estrés térmico (Heatwave Game)
export interface HeatStressedCrop {
  id: number;
  type: PlantType;
  health: number;
  temperature: number;
  heatResistance: number;
  hasShade: boolean;
  hasCooling: boolean;
  hasWater: boolean;
  iotDevice: {
    thermometer: boolean;
    coolingSystem: boolean;
    autoIrrigation: boolean;
  };
}

// 🐛 Planta con plaga (Pest Control Game)
export interface InfestedPlant {
  id: number;
  type: PlantType;
  health: number;
  pestLevel: number;
  hasPesticide: boolean;
  hasTrap: boolean;
  hasBioControl: boolean;
  iotSensor: {
    detected: boolean;
    severity: number;
    type: 'insects' | 'fungus' | 'bacteria';
  };
}

// 🌵 Cultivo en sequía (Drought Game)
export interface DroughtCrop {
  id: number;
  type: PlantType;
  waterReserve: number;
  survivalChance: number;
  priority: number;
  hasMultch: boolean;
  hasDeepRoot: boolean;
  iotMonitor: {
    soilDepth: number;
    moistureLevel: number;
    alert: boolean;
  };
}

// 🎮 Estado global del juego
export interface GameState {
  currentGame: MinigameType | null;
  level: number;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  isPaused: boolean;
  showTutorial: boolean;
}

// 🏆 Resultado del juego
export interface GameResult {
  score: number;
  success: boolean;
  stars: number;
  nasaDataUsed: string[];
  iotDevicesUsed: string[];
  lessonsLearned: string[];
}

// 📱 Datos de sensor IoT
export interface IoTSensorData {
  id: string;
  type: 'temperature' | 'humidity' | 'soil' | 'light' | 'pest';
  value: number;
  unit: string;
  timestamp: number;
  status: 'active' | 'warning' | 'critical';
  batteryLevel: number;
}

// 🎯 Props comunes para minijuegos
export interface MinigameProps {
  level: MinigameLevel;
  nasaData: NASARealtimeData;
  onComplete: (result: GameResult) => void;
  onPause?: () => void;
}

// 📊 Estadísticas del juego
export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
  favoriteGame: MinigameType | null;
  totalStars: number;
  achievements: Achievement[];
}

// 🏅 Logro
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: Date;
}

export interface EducationalContent {
  icon: string;
  title: string;
  description: string;
  nasaSource: string;
  whyItMatters: string;
  realWorldExample: string;
}