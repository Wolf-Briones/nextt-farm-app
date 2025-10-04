/**
 * 🛠️ Utilidades para el Sistema de Minijuegos
 */

import type { 
  GameResult, 
  NASARealtimeData, 
  DroughtRisk,
  CropParcel,
  HeatStressedCrop,
  InfestedPlant,
  DroughtCrop,
  PlantType
} from '../types/minigames';
import { 
  STAR_THRESHOLDS, 
  PLANT_TYPES,
  HEALTH_COLORS 
} from '../const/minigames';

// 🎯 Calcula estrellas basadas en puntuación
export function calculateStars(score: number): number {
  if (score >= STAR_THRESHOLDS.THREE_STARS) return 3;
  if (score >= STAR_THRESHOLDS.TWO_STARS) return 2;
  if (score >= STAR_THRESHOLDS.ONE_STAR) return 1;
  return 0;
}

// 🎨 Obtiene color basado en salud
export function getHealthColor(health: number): string {
  if (health >= 90) return HEALTH_COLORS.excellent;
  if (health >= 70) return HEALTH_COLORS.good;
  if (health >= 50) return HEALTH_COLORS.fair;
  if (health >= 30) return HEALTH_COLORS.poor;
  return HEALTH_COLORS.critical;
}

// 🌱 Genera tipo de planta aleatorio
export function getRandomPlantType(): PlantType {
  return PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)];
}

// 💧 Calcula nivel óptimo de agua para una planta
export function calculateOptimalWater(
  plantType: PlantType,
  soilMoisture: number,
  evapotranspiration: number
): number {
  const baseOptimal = 70;
  const moistureAdjustment = (60 - soilMoisture) * 0.5;
  const evapAdjustment = evapotranspiration * 2;
  
  return Math.max(50, Math.min(95, baseOptimal + moistureAdjustment + evapAdjustment));
}

// 🌡️ Calcula resistencia al calor de una planta
export function calculateHeatResistance(plantType: PlantType): number {
  const resistanceMap: Record<PlantType, number> = {
    '🌽': 35, // Maíz - resistencia media
    '🌾': 40, // Trigo - más resistente
    '🍅': 30, // Tomate - sensible
    '🥔': 32, // Papa - sensible
    '🥕': 38, // Zanahoria - resistente
    '🌶️': 42  // Chile - muy resistente
  };
  
  return resistanceMap[plantType] + (Math.random() * 10 - 5);
}

// 🐛 Determina susceptibilidad a plagas
export function getPestSusceptibility(
  temperature: number,
  humidity: number
): number {
  // Plagas prosperan entre 20-30°C con humedad alta
  let susceptibility = 0;
  
  if (temperature >= 20 && temperature <= 30) {
    susceptibility += 30;
  }
  
  if (humidity > 60) {
    susceptibility += humidity * 0.5;
  }
  
  return Math.min(100, susceptibility);
}

// 🌵 Calcula probabilidad de supervivencia en sequía
export function calculateSurvivalChance(
  waterReserve: number,
  hasMultch: boolean,
  hasDeepRoot: boolean,
  priority: number
): number {
  let chance = waterReserve * 0.5;
  
  if (hasMultch) chance *= 1.3;
  if (hasDeepRoot) chance *= 1.4;
  chance += priority * 2;
  
  return Math.max(0, Math.min(100, chance));
}

// 📊 Procesa datos NASA en formato de juego
export function processNASADataForGame(nasaRaw: {
  temperature: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  humidity: number;
  evapotranspiration: number;
}): NASARealtimeData {
  // Calcular humedad del suelo estimada
  const waterBalance = nasaRaw.precipitation - nasaRaw.evapotranspiration;
  const soilMoisture = Math.max(20, Math.min(80, 50 + (waterBalance * 3)));
  
  // Determinar estrés térmico
  const heatStress = nasaRaw.temperature > 30 || nasaRaw.temperatureMax > 35;
  
  // Calcular riesgo de sequía
  const droughtScore = 
    (100 - nasaRaw.humidity) * 0.3 + 
    (100 - soilMoisture) * 0.4 + 
    (nasaRaw.precipitation < 5 ? 30 : 0);
  
  let droughtRisk: DroughtRisk = 'bajo';
  if (droughtScore > 60) droughtRisk = 'alto';
  else if (droughtScore > 35) droughtRisk = 'medio';
  
  // Alerta de plagas
  const pestAlert = 
    nasaRaw.temperature >= 20 && 
    nasaRaw.temperature <= 30 && 
    nasaRaw.humidity > 60;
  
  // Estimar NDVI
  let ndvi = 0.55;
  if (nasaRaw.temperature >= 20 && nasaRaw.temperature <= 25) ndvi += 0.05;
  else if (nasaRaw.temperature < 15 || nasaRaw.temperature > 30) ndvi -= 0.1;
  
  if (nasaRaw.precipitation > 10) ndvi += 0.05;
  else if (nasaRaw.precipitation < 2) ndvi -= 0.08;
  
  if (soilMoisture > 50) ndvi += 0.03;
  else if (soilMoisture < 30) ndvi -= 0.07;
  
  ndvi = Math.max(0.3, Math.min(0.9, ndvi));
  
  return {
    ...nasaRaw,
    soilMoisture,
    heatStress,
    droughtRisk,
    pestAlert,
    ndvi
  };
}

// 🎮 Genera parcelas para el juego de riego
export function generateIrrigationParcels(
  count: number,
  nasaData: NASARealtimeData
): CropParcel[] {
  return Array.from({ length: count }, (_, i) => {
    const plantType = getRandomPlantType();
    const soilMoisture = nasaData.soilMoisture + (Math.random() * 20 - 10);
    const evapotranspiration = nasaData.evapotranspiration + (Math.random() * 1 - 0.5);
    const optimalWater = calculateOptimalWater(plantType, soilMoisture, evapotranspiration);
    
    return {
      id: i,
      plantType,
      waterLevel: Math.random() * 100,
      soilMoisture: Math.max(20, Math.min(80, soilMoisture)),
      evapotranspiration,
      optimalWater,
      hasIoTSensor: true,
      sensorData: {
        temperature: nasaData.temperature + (Math.random() * 4 - 2),
        humidity: nasaData.humidity + (Math.random() * 10 - 5),
        lastReading: Date.now()
      }
    };
  });
}

// 🌡️ Genera cultivos para el juego de calor
export function generateHeatwaveCrops(
  count: number,
  nasaData: NASARealtimeData
): HeatStressedCrop[] {
  return Array.from({ length: count }, (_, i) => {
    const type = getRandomPlantType();
    const heatResistance = calculateHeatResistance(type);
    
    return {
      id: i,
      type,
      health: 100,
      temperature: nasaData.temperature + (Math.random() * 5),
      heatResistance,
      hasShade: false,
      hasCooling: false,
      hasWater: false,
      iotDevice: {
        thermometer: true,
        coolingSystem: false,
        autoIrrigation: false
      }
    };
  });
}

// 🐛 Genera plantas para el juego de plagas
export function generatePestPlants(
  count: number,
  nasaData: NASARealtimeData
): InfestedPlant[] {
  const susceptibility = getPestSusceptibility(nasaData.temperature, nasaData.humidity);
  
  return Array.from({ length: count }, (_, i) => {
    const initialPestLevel = Math.random() < (susceptibility / 100) ? 
      Math.random() * 30 : 0;
    
    const pestTypes: ('insects' | 'fungus' | 'bacteria')[] = ['insects', 'fungus', 'bacteria'];
    
    return {
      id: i,
      type: getRandomPlantType(),
      health: 100,
      pestLevel: initialPestLevel,
      hasPesticide: false,
      hasTrap: false,
      hasBioControl: false,
      iotSensor: {
        detected: initialPestLevel > 0,
        severity: Math.round(initialPestLevel),
        type: pestTypes[Math.floor(Math.random() * pestTypes.length)]
      }
    };
  });
}

// 🌵 Genera cultivos para el juego de sequía
export function generateDroughtCrops(
  count: number,
  nasaData: NASARealtimeData
): DroughtCrop[] {
  return Array.from({ length: count }, (_, i) => {
    const priority = Math.floor(Math.random() * 5) + 1;
    
    return {
      id: i,
      type: getRandomPlantType(),
      waterReserve: Math.random() * 50 + 30,
      survivalChance: 50,
      priority,
      hasMultch: false,
      hasDeepRoot: false,
      iotMonitor: {
        soilDepth: Math.random() * 100 + 50,
        moistureLevel: nasaData.soilMoisture + (Math.random() * 20 - 10),
        alert: nasaData.droughtRisk === 'alto'
      }
    };
  });
}

// 🏆 Crea resultado del juego
export function createGameResult(
  score: number,
  targetScore: number,
  nasaDataUsed: string[],
  iotDevicesUsed: string[]
): GameResult {
  const success = score >= targetScore;
  const stars = calculateStars(score);
  
  const lessonsLearned: string[] = [];
  
  if (nasaDataUsed.includes('SMAP')) {
    lessonsLearned.push('La humedad del suelo es clave para riego eficiente');
  }
  if (nasaDataUsed.includes('Temperature')) {
    lessonsLearned.push('Las plantas sufren con calor extremo');
  }
  if (iotDevicesUsed.length > 3) {
    lessonsLearned.push('Los sensores IoT ayudan a tomar mejores decisiones');
  }
  
  return {
    score,
    success,
    stars,
    nasaDataUsed,
    iotDevicesUsed,
    lessonsLearned
  };
}

// ⏱️ Formatea tiempo restante
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 📱 Simula lectura de sensor IoT
export function simulateIoTReading(
  baseValue: number,
  variance: number = 5
): number {
  const reading = baseValue + (Math.random() * variance * 2 - variance);
  return Math.round(reading * 10) / 10;
}