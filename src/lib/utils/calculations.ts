import type { ParcelState } from "@/lib/types/crops";

/**
 * Calcula el NDVI basado en las condiciones del cultivo
 */
export function calculateNDVI(parcel: ParcelState): number {
  if (!parcel.crop) return 0.3;

  const { crop, growthStage, health, waterLevel, fertilizerLevel } = parcel;
  
  // Factor base del NDVI óptimo del cultivo
  const baseNDVI = crop.nasaOptimalNDVI;
  
  // Factor de crecimiento (0.5 - 1.0)
  const growthFactor = 0.5 + (growthStage / 100) * 0.5;
  
  // Factor de salud (0.6 - 1.0)
  const healthFactor = 0.6 + (health / 100) * 0.4;
  
  // Factor de agua (0.7 - 1.0)
  const waterFactor = 0.7 + Math.min(waterLevel / 100, 1) * 0.3;
  
  // Factor de fertilizante (0.8 - 1.0)
  const fertilizerFactor = 0.8 + (fertilizerLevel / 100) * 0.2;
  
  // Calcular NDVI final
  const calculatedNDVI = baseNDVI * growthFactor * healthFactor * waterFactor * fertilizerFactor;
  
  // Asegurar que esté en rango válido (0.2 - 0.9)
  return Math.max(0.2, Math.min(0.9, calculatedNDVI));
}

/**
 * Calcula la probabilidad de plagas
 */
export function calculatePestProbability(parcel: ParcelState): number {
  if (!parcel.crop) return 0;

  const { crop, growthStage, pestLevel, waterLevel, temperature } = parcel;
  
  // Factor base de resistencia del cultivo (0.0 - 1.0)
  const resistanceFactor = 1 - (crop.resistance / 100);
  
  // Factor de etapa de crecimiento (más vulnerable en etapas intermedias)
  let stageFactor = 0.3;
  if (growthStage >= 30 && growthStage <= 70) {
    stageFactor = 0.8; // Etapa más vulnerable
  } else if (growthStage > 70) {
    stageFactor = 0.5; // Menos vulnerable cuando está maduro
  }
  
  // Factor de condiciones ambientales
  const temperatureFactor = temperature > 25 ? 1.2 : temperature < 18 ? 0.8 : 1.0;
  const waterFactor = waterLevel < 40 ? 1.3 : waterLevel > 80 ? 1.1 : 1.0;
  
  // Factor actual de plagas
  const currentPestFactor = pestLevel / 100;
  
  // Calcular probabilidad final (0-100%)
  const probability = (resistanceFactor * stageFactor * temperatureFactor * waterFactor * currentPestFactor) * 100;
  
  return Math.max(0, Math.min(100, probability));
}

/**
 * Actualiza el estado de una parcela con el paso del tiempo
 */
export function updateParcelState(
  parcel: ParcelState,
  nasaTemperature: number,
  nasaSoilMoisture: number
): ParcelState {
  if (!parcel.crop) return parcel;
  
  const newParcel: ParcelState = { ...parcel };

  // Crecimiento natural más rápido (completar en ~60 segundos)
  if (newParcel.growthStage < 100) {
    const growthRate = Math.min(1.7, (newParcel.waterLevel / 100) * (newParcel.health / 100) * 1.7);
    newParcel.growthStage = Math.min(100, newParcel.growthStage + growthRate);
  }

  // Degradación de recursos
  newParcel.waterLevel = Math.max(0, newParcel.waterLevel - 1.5);
  newParcel.fertilizerLevel = Math.max(0, newParcel.fertilizerLevel - 1.0);
  newParcel.pestLevel = Math.min(100, newParcel.pestLevel + Math.random() * 2.0);

  // Marcar si han aparecido plagas significativas
  if (newParcel.pestLevel > 15 && !newParcel.hasPestsAppeared) {
    newParcel.hasPestsAppeared = true;
  }

  // Impacto en salud
  if (newParcel.waterLevel < 30 || newParcel.pestLevel > 60) {
    newParcel.health = Math.max(0, newParcel.health - 2.0);
  } else if (newParcel.waterLevel > 60 && newParcel.pestLevel < 30) {
    newParcel.health = Math.min(100, newParcel.health + 1.0);
  }

  // Actualizar temperatura y humedad del suelo desde NASA
  newParcel.temperature = nasaTemperature;
  newParcel.soilMoisture = nasaSoilMoisture;

  // Actualizar NDVI basado en las condiciones actuales
  newParcel.ndviValue = calculateNDVI(newParcel);

  // Calcular días para cosecha
  if (newParcel.crop) {
    newParcel.daysToHarvest = Math.max(
      0,
      newParcel.crop.growthDays - Math.floor((newParcel.growthStage / 100) * newParcel.crop.growthDays)
    );
  }

  return newParcel;
}

/**
 * Determina si una parcela necesita riego automático
 */
export function needsAutoWatering(parcel: ParcelState): boolean {
  if (!parcel.crop) return false;
  
  // Necesita riego si el nivel de agua está bajo
  return parcel.waterLevel <= 50 || parcel.health <= 60;
}

/**
 * Aplica riego a una parcela
 */
export function applyWatering(parcel: ParcelState, waterAmount: number): ParcelState {
  if (!parcel.crop) return parcel;

  return {
    ...parcel,
    waterLevel: Math.min(100, parcel.waterLevel + waterAmount),
    health: Math.min(100, parcel.health + 10),
    ndviValue: calculateNDVI({
      ...parcel,
      waterLevel: Math.min(100, parcel.waterLevel + waterAmount),
      health: Math.min(100, parcel.health + 10),
    }),
  };
}

/**
 * Aplica fertilizante a una parcela
 */
export function applyFertilizer(parcel: ParcelState, amount: number): ParcelState {
  if (!parcel.crop) return parcel;

  return {
    ...parcel,
    fertilizerLevel: Math.min(100, parcel.fertilizerLevel + amount),
    health: Math.min(100, parcel.health + 15),
    growthStage: Math.min(100, parcel.growthStage + 5),
    ndviValue: calculateNDVI({
      ...parcel,
      fertilizerLevel: Math.min(100, parcel.fertilizerLevel + amount),
      health: Math.min(100, parcel.health + 15),
    }),
  };
}

/**
 * Aplica control de plagas a una parcela
 */
export function applyPestControl(parcel: ParcelState, effectiveness: number): ParcelState {
  if (!parcel.crop) return parcel;

  return {
    ...parcel,
    pestLevel: Math.max(0, parcel.pestLevel - effectiveness),
    health: Math.min(100, parcel.health + 20),
    ndviValue: calculateNDVI({
      ...parcel,
      pestLevel: Math.max(0, parcel.pestLevel - effectiveness),
      health: Math.min(100, parcel.health + 20),
    }),
  };
}

/**
 * Calcula el rendimiento de cosecha basado en la salud
 */
export function calculateHarvestYield(parcel: ParcelState): number {
  if (!parcel.crop) return 0;
  return Math.round((parcel.health / 100) * parcel.crop.marketPrice);
}