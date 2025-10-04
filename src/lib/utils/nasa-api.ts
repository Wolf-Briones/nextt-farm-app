import type { NASAPowerResponse } from "@/lib/types/crops";
import { LOCATION } from "@/lib/const/crops";

/**
 * Cliente para la API de NASA POWER
 * Proporciona datos meteorológicos y agrícolas en tiempo real
 */

// API Key de NASA desde variable de entorno
// Obtén tu API key gratuita en: https://api.nasa.gov/
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

/**
 * Obtiene datos meteorológicos de NASA POWER para una ubicación específica
 * Si no se proporcionan coordenadas, usa la ubicación por defecto (Cajamarca)
 */
export async function fetchNASAPowerData(
  latitude?: number,
  longitude?: number
): Promise<NASAPowerResponse> {
  const { lat, lon } = latitude && longitude 
    ? { lat: latitude, lon: longitude }
    : LOCATION;
  
  // Obtener fecha actual y hace 7 días (más rango para encontrar datos válidos)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // Últimos 7 días en vez de 1
  
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  };

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  // Parámetros a solicitar
  const parameters = [
    'T2M',          // Temperatura a 2 metros (°C)
    'T2M_MAX',      // Temperatura máxima
    'T2M_MIN',      // Temperatura mínima
    'PRECTOTCORR',  // Precipitación corregida (mm/día)
    'RH2M',         // Humedad relativa a 2 metros (%)
    'EVPTRNS',      // Evapotranspiración (mm/día)
  ].join(',');

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${parameters}&community=AG&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON&api_key=${NASA_API_KEY}`;

  console.log(`🛰️ Fetching NASA data for: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json() as NASAPowerResponse;
    console.log('✅ NASA API response received');
    return data;
  } catch (error) {
    console.error("❌ Error fetching NASA POWER data:", error);
    throw error;
  }
}

/**
 * Procesa los datos de NASA POWER y extrae valores recientes
 * Maneja valores inválidos (-999) que indica datos faltantes
 */
export function processNASAData(data: NASAPowerResponse): {
  temperature: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  humidity: number;
  evapotranspiration: number;
} {
  const { parameter } = data.properties;

  // Obtener el último valor VÁLIDO de cada parámetro (más reciente)
  const getLatestValidValue = (param: Record<string, number>, defaultValue: number, paramName: string): number => {
    const keys = Object.keys(param).sort(); // Ordenar por fecha
    
    console.log(`📊 Analyzing ${paramName}: ${keys.length} data points`);
    
    // Buscar el último valor válido (no -999)
    for (let i = keys.length - 1; i >= 0; i--) {
      const value = param[keys[i]];
      const date = keys[i];
      
      if (value !== -999 && value !== null && value !== undefined && !isNaN(value)) {
        console.log(`✅ ${paramName}: ${value.toFixed(1)} (date: ${date})`);
        return value;
      } else {
        console.log(`❌ ${paramName}: Invalid value ${value} on ${date}`);
      }
    }
    
    // Si no hay valores válidos, retornar default
    console.warn(`⚠️ No valid data found for ${paramName}, using default: ${defaultValue}`);
    return defaultValue;
  };

  // Obtener valores procesados con manejo de datos faltantes
  const temperature = getLatestValidValue(parameter.T2M, 15.0, 'Temperature');
  const temperatureMax = parameter.T2M_MAX 
    ? getLatestValidValue(parameter.T2M_MAX, temperature + 5, 'Temp Max') 
    : temperature + 5;
  const temperatureMin = parameter.T2M_MIN 
    ? getLatestValidValue(parameter.T2M_MIN, temperature - 5, 'Temp Min') 
    : temperature - 5;
  const precipitation = getLatestValidValue(parameter.PRECTOTCORR, 2.0, 'Precipitation');
  const humidity = getLatestValidValue(parameter.RH2M, 60.0, 'Humidity');
  const evapotranspiration = parameter.EVPTRNS 
    ? getLatestValidValue(parameter.EVPTRNS, 3.5, 'Evapotranspiration') 
    : 3.5;

  // Resumen final
  console.log('📈 NASA Data Summary:', {
    temperature: `${temperature.toFixed(1)}°C`,
    temperatureMax: `${temperatureMax.toFixed(1)}°C`,
    temperatureMin: `${temperatureMin.toFixed(1)}°C`,
    precipitation: `${precipitation.toFixed(1)}mm`,
    humidity: `${humidity.toFixed(1)}%`,
    evapotranspiration: `${evapotranspiration.toFixed(2)}mm`,
    dataPoints: Object.keys(parameter.T2M).length,
    hasValidData: temperature !== 15.0 // Si es diferente del default, hay datos reales
  });

  return {
    temperature,
    temperatureMax,
    temperatureMin,
    precipitation,
    humidity,
    evapotranspiration,
  };
}

/**
 * Calcula humedad del suelo basada en datos NASA
 * Estimación simplificada basada en precipitación y evapotranspiración
 */
export function calculateSoilMoisture(
  precipitation: number,
  evapotranspiration: number,
  currentMoisture: number
): number {
  // Balance hídrico simple
  const waterBalance = precipitation - evapotranspiration;
  
  // Actualizar humedad del suelo
  let newMoisture = currentMoisture + (waterBalance * 2); // Factor de 2 para escalar
  
  // Limitar entre 20% y 80%
  newMoisture = Math.max(20, Math.min(80, newMoisture));
  
  return newMoisture;
}

/**
 * Determina si hay estrés térmico basado en temperatura
 */
export function calculateHeatStress(temperature: number, temperatureMax: number): boolean {
  return temperature > 30 || temperatureMax > 35;
}

/**
 * Calcula riesgo de sequía basado en precipitación y humedad
 */
export function calculateDroughtRisk(
  precipitation: number,
  humidity: number,
  soilMoisture: number
): "bajo" | "medio" | "alto" {
  const droughtScore = (100 - humidity) * 0.3 + 
                       (100 - soilMoisture) * 0.4 + 
                       (precipitation < 5 ? 30 : 0);

  if (droughtScore > 60) return "alto";
  if (droughtScore > 35) return "medio";
  return "bajo";
}

/**
 * Determina alerta de plagas basada en condiciones climáticas
 */
export function calculatePestAlert(
  temperature: number,
  humidity: number
): boolean {
  // Plagas prosperan con temperatura entre 20-30°C y humedad > 60%
  return temperature >= 20 && temperature <= 30 && humidity > 60;
}

/**
 * Estima NDVI global basado en condiciones climáticas
 * (Simplificación - idealmente vendría de MODIS/Sentinel)
 */
export function estimateGlobalNDVI(
  temperature: number,
  precipitation: number,
  soilMoisture: number
): number {
  // NDVI base
  let ndvi = 0.55;
  
  // Ajustar por temperatura (óptimo 20-25°C)
  if (temperature >= 20 && temperature <= 25) {
    ndvi += 0.05;
  } else if (temperature < 15 || temperature > 30) {
    ndvi -= 0.1;
  }
  
  // Ajustar por precipitación
  if (precipitation > 10) {
    ndvi += 0.05;
  } else if (precipitation < 2) {
    ndvi -= 0.08;
  }
  
  // Ajustar por humedad del suelo
  if (soilMoisture > 50) {
    ndvi += 0.03;
  } else if (soilMoisture < 30) {
    ndvi -= 0.07;
  }
  
  // Limitar entre 0.3 y 0.9
  return Math.max(0.3, Math.min(0.9, ndvi));
}