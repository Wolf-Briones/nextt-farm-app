import { useState, useEffect, useCallback } from "react";
import type { NASAData } from "@/lib/types/crops";

import {
  fetchNASAPowerData,
  processNASAData,
  calculateSoilMoisture,
  calculateHeatStress,
  calculateDroughtRisk,
  calculatePestAlert,
  estimateGlobalNDVI,
} from "@/lib/utils/nasa-api";

type UserLocation = {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
};

type UseNASADataOptions = {
  enableGeolocation?: boolean;
};

/**
 * Hook para obtener y actualizar datos de NASA en tiempo real
 */
export function useNASAData(options: UseNASADataOptions = {}) {
  const { enableGeolocation = false } = options;

  const [nasaData, setNasaData] = useState<NASAData>({
    globalNDVI: 0.620,
    soilMoisture: 45,
    temperature: 24.0,
    precipitation: 12.0,
    evapotranspiration: 3.2,
    heatStress: false,
    droughtRisk: "bajo",
    pestAlert: false,
    lastUpdate: new Date(),
  });

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (enableGeolocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Intentar obtener nombre de la ciudad usando API de geocodificación
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
            );
            const data = await response.json();

            setUserLocation({
              latitude,
              longitude,
              city: data.city || data.locality,
              country: data.countryName,
            });
          } catch (err) {
            console.error("Error fetching location name:", err);
            // Si falla, guardar solo lat/lon
            setUserLocation({ latitude, longitude });
          }
        },
          (err) => {
            console.error("Error getting user location:", err);
            setUserLocation(null);
          }
        );
    }
  }, [enableGeolocation]);

  // Cargar datos reales de NASA
  const loadNASAData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Determinar qué ubicación usar
      const lat = userLocation?.latitude;
      const lon = userLocation?.longitude;

      console.log('NASA API: Fetching data for location:', {
        latitude: lat,
        longitude: lon,
        hasGeolocation: !!userLocation,
        city: userLocation?.city
      });

      // Usar ubicación del usuario si está disponible
      const rawData = await fetchNASAPowerData(lat, lon);
      const processed = processNASAData(rawData);

      console.log('NASA API: Data received and processed:', {
        temperature: processed.temperature,
        precipitation: processed.precipitation,
        humidity: processed.humidity,
        location: userLocation?.city || 'Default location'
      });

      // Calcular humedad del suelo basada en balance hídrico
      const newSoilMoisture = calculateSoilMoisture(
        processed.precipitation,
        processed.evapotranspiration,
        nasaData.soilMoisture
      );

      // Calcular estrés térmico
      const heatStress = calculateHeatStress(
        processed.temperature,
        processed.temperatureMax
      );

      // Calcular riesgo de sequía
      const droughtRisk = calculateDroughtRisk(
        processed.precipitation,
        processed.humidity,
        newSoilMoisture
      );

      // Calcular alerta de plagas
      const pestAlert = calculatePestAlert(
        processed.temperature,
        processed.humidity
      );

      // Estimar NDVI global
      const globalNDVI = estimateGlobalNDVI(
        processed.temperature,
        processed.precipitation,
        newSoilMoisture
      );

      setNasaData({
        globalNDVI,
        soilMoisture: newSoilMoisture,
        temperature: processed.temperature,
        precipitation: processed.precipitation,
        evapotranspiration: processed.evapotranspiration,
        heatStress,
        droughtRisk,
        pestAlert,
        lastUpdate: new Date(),
      });

      setIsLoading(false);
    } catch (err) {
      console.error("Error loading NASA data:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setIsLoading(false);

      // Usar datos simulados si falla la carga
      setNasaData((prev) => ({
        ...prev,
        lastUpdate: new Date(),
      }));
    }
  }, [nasaData.soilMoisture, userLocation]);

  // Cargar datos iniciales
  useEffect(() => {
    // Solo cargar cuando la ubicación esté lista (si geolocalización está habilitada)
    if (!enableGeolocation || userLocation !== null) {
      loadNASAData();
    }
  }, [loadNASAData, enableGeolocation, userLocation]);

  // Actualizar datos cada 5 minutos (las APIs de NASA se actualizan diariamente)
  useEffect(() => {
    const interval = setInterval(() => {
      loadNASAData();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [loadNASAData]);

  // Simular cambios sutiles en los datos entre actualizaciones reales
  useEffect(() => {
    const interval = setInterval(() => {
      setNasaData((prev) => ({
        ...prev,
        globalNDVI: Math.max(0.3, Math.min(0.9, prev.globalNDVI + (Math.random() - 0.5) * 0.01)),
        soilMoisture: Math.max(20, Math.min(80, prev.soilMoisture + (Math.random() - 0.5) * 2)),
        temperature: Math.max(15.0, Math.min(35.0, prev.temperature + (Math.random() - 0.5) * 0.5)),
        lastUpdate: new Date(),
      }));
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  return {
    nasaData,
    userLocation,
    isLoading,
    error,
    refresh: loadNASAData,
  } as const;
}

// Exportar tipo para uso externo
export type UseNASADataReturn = ReturnType<typeof useNASAData>;