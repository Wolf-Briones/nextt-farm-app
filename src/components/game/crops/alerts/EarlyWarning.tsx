// src/components/game/crops/alerts/EarlyWarning.tsx
"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import RealTimeDataUpdater from "./RealTimeDataUpdater";

export type ClimateZone = 'coast' | 'highlands' | 'jungle' | 'desert';

export interface RegionConfig {
  name: string;
  climateZone: ClimateZone;
  lat: number;
  lon: number;
  altitude: number;
  floodRisk: boolean;
  frostRisk: boolean;
  droughtProne: boolean;
}

export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  rainfall7d: number;
  rainfall30d: number;
  tempMax: number;
  tempMin: number;
}

const REGIONS: RegionConfig[] = [
  {
    name: "Cajamarca",
    lat: -7.1607,
    lon: -78.5137,
    altitude: 2750,
    climateZone: 'highlands',
    floodRisk: false,
    frostRisk: true,
    droughtProne: true
  },
  {
    name: "Lima",
    lat: -12.0464,
    lon: -77.0428,
    altitude: 154,
    climateZone: 'coast',
    floodRisk: true,
    frostRisk: false,
    droughtProne: false
  },
  {
    name: "Cusco",
    lat: -13.5319,
    lon: -71.9675,
    altitude: 3399,
    climateZone: 'highlands',
    floodRisk: false,
    frostRisk: true,
    droughtProne: false
  },
  {
    name: "Arequipa",
    lat: -16.4090,
    lon: -71.5375,
    altitude: 2335,
    climateZone: 'highlands',
    floodRisk: false,
    frostRisk: true,
    droughtProne: true
  },
  {
    name: "La Merced, Junín",
    lat: -11.0547,
    lon: -75.3222,
    altitude: 751,
    climateZone: 'jungle',
    floodRisk: true,
    frostRisk: false,
    droughtProne: false
  },
  {
    name: "Piura",
    lat: -5.1945,
    lon: -80.6328,
    altitude: 29,
    climateZone: 'coast',
    floodRisk: true,
    frostRisk: false,
    droughtProne: true
  },
  {
    name: "Iquitos",
    lat: -3.7491,
    lon: -73.2534,
    altitude: 106,
    climateZone: 'jungle',
    floodRisk: true,
    frostRisk: false,
    droughtProne: false
  },
  {
    name: "Puno",
    lat: -15.8402,
    lon: -70.0219,
    altitude: 3827,
    climateZone: 'highlands',
    floodRisk: false,
    frostRisk: true,
    droughtProne: false
  }
];

interface EarlyWarningProps {
  onRegionChange?: (region: RegionConfig, weather: WeatherData) => void;
}

export default function EarlyWarning({ onRegionChange }: EarlyWarningProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig>(REGIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const generateWeatherForClimate = (region: RegionConfig): WeatherData => {
    let baseData: WeatherData;

    switch (region.climateZone) {
      case 'coast':
        baseData = {
          temperature: 20 + Math.random() * 8,
          precipitation: Math.random() * 2,
          humidity: 70 + Math.random() * 15,
          rainfall7d: Math.random() * 5,
          rainfall30d: Math.random() * 15,
          tempMax: 24 + Math.random() * 6,
          tempMin: 16 + Math.random() * 4
        };
        break;

      case 'highlands':
        baseData = {
          temperature: 10 + Math.random() * 12,
          precipitation: Math.random() * 15,
          humidity: 50 + Math.random() * 30,
          rainfall7d: Math.random() * 100,
          rainfall30d: Math.random() * 250,
          tempMax: 15 + Math.random() * 10,
          tempMin: Math.random() * 8 - 2
        };
        break;

      case 'jungle':
        baseData = {
          temperature: 24 + Math.random() * 8,
          precipitation: 5 + Math.random() * 20,
          humidity: 75 + Math.random() * 20,
          rainfall7d: 50 + Math.random() * 150,
          rainfall30d: 200 + Math.random() * 200,
          tempMax: 28 + Math.random() * 8,
          tempMin: 20 + Math.random() * 4
        };
        break;

      case 'desert':
        baseData = {
          temperature: 22 + Math.random() * 15,
          precipitation: Math.random() * 0.5,
          humidity: 20 + Math.random() * 20,
          rainfall7d: Math.random() * 1,
          rainfall30d: Math.random() * 3,
          tempMax: 30 + Math.random() * 10,
          tempMin: 12 + Math.random() * 8
        };
        break;
    }

    return baseData;
  };

  const handleRegionSelect = (region: RegionConfig) => {
    setSelectedRegion(region);
    const newWeather = generateWeatherForClimate(region);
    setWeatherData(newWeather);
    
    if (onRegionChange) {
      onRegionChange(region, newWeather);
    }
  };

  const handleDataUpdate = () => {
    const newWeather = generateWeatherForClimate(selectedRegion);
    setWeatherData(newWeather);
    
    if (onRegionChange) {
      onRegionChange(selectedRegion, newWeather);
    }
  };

  useEffect(() => {
    const data = generateWeatherForClimate(selectedRegion);
    setWeatherData(data);
    
    if (onRegionChange) {
      onRegionChange(selectedRegion, data);
    }
  }, [selectedRegion]);

  const getClimateZoneInfo = () => {
    switch (selectedRegion.climateZone) {
      case 'coast':
        return {
          name: 'Zona Costera',
          icon: '🏖️',
          description: 'Clima seco, pocas lluvias',
          color: 'text-blue-400',
          risks: ['Lluvias inusuales', 'Inundaciones urbanas']
        };
      case 'highlands':
        return {
          name: 'Zona Andina',
          icon: '⛰️',
          description: 'Riesgo de heladas, lluvias estacionales',
          color: 'text-purple-400',
          risks: ['Heladas', 'Granizo', 'Sequías']
        };
      case 'jungle':
        return {
          name: 'Zona Selvática',
          icon: '🌴',
          description: 'Lluvias frecuentes, alta humedad',
          color: 'text-green-400',
          risks: ['Inundaciones', 'Enfermedades tropicales']
        };
      case 'desert':
        return {
          name: 'Zona Desértica',
          icon: '🏜️',
          description: 'Extremadamente seco',
          color: 'text-orange-400',
          risks: ['Sequía extrema', 'Calor intenso']
        };
    }
  };

  const filteredRegions = REGIONS.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const zoneInfo = getClimateZoneInfo();

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Selector de región */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Seleccionar Región de Perú</h3>
        </div>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar región..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 text-white px-10 py-2 rounded border border-gray-600 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
          {filteredRegions.map((region) => {
            const zoneEmoji = region.climateZone === 'coast' ? '🏖️' : 
                            region.climateZone === 'highlands' ? '⛰️' : 
                            region.climateZone === 'jungle' ? '🌴' : '🏜️';
            
            return (
              <button
                key={region.name}
                onClick={() => handleRegionSelect(region)}
                className={`p-2 rounded border-2 transition-all ${
                  selectedRegion.name === region.name
                    ? 'border-cyan-400 bg-cyan-900/20 text-white scale-105'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-600 hover:scale-102'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{zoneEmoji}</span>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium truncate">{region.name}</div>
                    <div className="text-xs text-gray-400">{region.altitude}m</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actualizador en Tiempo Real - AHORA ARRIBA */}
      <RealTimeDataUpdater
        onDataUpdate={handleDataUpdate}
        regionLat={selectedRegion.lat}
        regionLon={selectedRegion.lon}
        updateInterval={5}
      />

      {/* Información de la región */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Información de la Región
        </h3>

        <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-700 mb-3">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{zoneInfo.icon}</span>
            <div>
              <div className={`font-bold ${zoneInfo.color} text-lg`}>{zoneInfo.name}</div>
              <div className="text-xs text-gray-400">{zoneInfo.description}</div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-2">Riesgos Principales:</div>
            <div className="flex flex-wrap gap-2">
              {zoneInfo.risks.map((risk, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-900/30 text-red-400 rounded text-xs">
                  {risk}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
          <div className="text-xs font-semibold text-white mb-2">Análisis de Riesgo:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`p-2 rounded text-center ${selectedRegion.floodRisk ? 'bg-blue-900/30 text-blue-400 font-bold' : 'bg-gray-800 text-gray-500'}`}>
              <div className="mb-1">🌊</div>
              <div>Inundación</div>
              <div className="text-xs">{selectedRegion.floodRisk ? 'ALTO' : 'BAJO'}</div>
            </div>
            <div className={`p-2 rounded text-center ${selectedRegion.frostRisk ? 'bg-cyan-900/30 text-cyan-400 font-bold' : 'bg-gray-800 text-gray-500'}`}>
              <div className="mb-1">❄️</div>
              <div>Heladas</div>
              <div className="text-xs">{selectedRegion.frostRisk ? 'ALTO' : 'BAJO'}</div>
            </div>
            <div className={`p-2 rounded text-center ${selectedRegion.droughtProne ? 'bg-orange-900/30 text-orange-400 font-bold' : 'bg-gray-800 text-gray-500'}`}>
              <div className="mb-1">☀️</div>
              <div>Sequía</div>
              <div className="text-xs">{selectedRegion.droughtProne ? 'ALTO' : 'BAJO'}</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-900 rounded">
          <div>📍 Coordenadas: {selectedRegion.lat.toFixed(4)}°, {selectedRegion.lon.toFixed(4)}°</div>
          <div>⛰️ Altitud: {selectedRegion.altitude}m sobre el nivel del mar</div>
        </div>
      </div>

      {/* Condiciones meteorológicas actuales */}
      {weatherData && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Condiciones Actuales
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-white text-xs">Temperatura</span>
              </div>
              <div className="text-orange-400 font-bold text-lg">{weatherData.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-gray-400 mt-1">
                Min: {weatherData.tempMin.toFixed(1)}°C
              </div>
              <div className="text-xs text-gray-400">
                Max: {weatherData.tempMax.toFixed(1)}°C
              </div>
            </div>

            <div className="bg-gray-700 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-white text-xs">Precipitación</span>
              </div>
              <div className="text-blue-400 font-bold text-lg">{weatherData.precipitation.toFixed(1)}mm</div>
              <div className="text-xs text-gray-400 mt-1">
                Hoy
              </div>
              <div className="text-xs text-cyan-400">
                7d: {weatherData.rainfall7d.toFixed(1)}mm
              </div>
            </div>

            <div className="bg-gray-700 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-4 h-4 text-purple-400" />
                <span className="text-white text-xs">Humedad</span>
              </div>
              <div className="text-purple-400 font-bold text-lg">{weatherData.humidity.toFixed(0)}%</div>
              <div className="text-xs text-gray-400 mt-1">
                {weatherData.humidity > 80 ? 'Muy Alto' : 
                 weatherData.humidity > 60 ? 'Alto' : 
                 weatherData.humidity > 40 ? 'Moderado' : 'Bajo'}
              </div>
            </div>

            <div className="bg-gray-700 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span className="text-white text-xs">Acumulado 30d</span>
              </div>
              <div className="text-cyan-400 font-bold text-lg">{weatherData.rainfall30d.toFixed(0)}mm</div>
              <div className="text-xs text-gray-400 mt-1">
                {weatherData.rainfall30d > 200 ? 'Muy Húmedo' : 
                 weatherData.rainfall30d > 100 ? 'Húmedo' : 
                 weatherData.rainfall30d > 50 ? 'Normal' : 'Seco'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}