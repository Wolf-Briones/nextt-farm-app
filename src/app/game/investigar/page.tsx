'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Calendar, Info, Play, Pause, Download, Globe, Flame, Cloud, Thermometer, Moon, Eye, MapPin, X, Droplets, AlertTriangle } from 'lucide-react';

interface LayerInfo {
  id: string;
  name: string;
  layer: string;
  description: string;
  format: 'jpeg' | 'png';
}

interface LayerCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
  layers: LayerInfo[];
}

interface LocationPreset {
  name: string;
  bbox: string;
}

type LayerCategoryKey = 'satellite' | 'fire' | 'precipitation' | 'temperature' | 'drought' | 'weather' | 'night';

const NASAGIBSExplorer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2024-03-16');
  const [activeLayer, setActiveLayer] = useState<string>('true_color');
  const [layerOpacity, setLayerOpacity] = useState<number>(100);
  const [showBase, setShowBase] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<LayerCategoryKey | null>('satellite');
  const [bbox, setBbox] = useState<string>('-180,-90,180,90');
  const [imageKey, setImageKey] = useState<number>(0);

  const layerCategories: Record<LayerCategoryKey, LayerCategory> = {
    satellite: {
      name: 'Imágenes Satelitales',
      icon: <Globe size={18} />,
      color: 'blue',
      layers: [
        {
          id: 'true_color',
          name: 'Terra MODIS - Color Verdadero',
          layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
          description: 'Vista natural de la Tierra',
          format: 'jpeg'
        },
        {
          id: 'aqua_true_color',
          name: 'Aqua MODIS - Color Verdadero',
          layer: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
          description: 'Vista desde Aqua',
          format: 'jpeg'
        },
        {
          id: 'viirs_true_color',
          name: 'VIIRS SNPP - Color Verdadero',
          layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
          description: 'Alta resolución VIIRS',
          format: 'jpeg'
        }
      ]
    },
    fire: {
      name: 'Mapa de Incendios',
      icon: <Flame size={18} />,
      color: 'red',
      layers: [
        {
          id: 'terra_fires',
          name: 'Incendios Activos (Terra)',
          layer: 'MODIS_Terra_Thermal_Anomalies_All',
          description: 'Puntos calientes y fuegos',
          format: 'png'
        },
        {
          id: 'aqua_fires',
          name: 'Incendios Activos (Aqua)',
          layer: 'MODIS_Aqua_Thermal_Anomalies_All',
          description: 'Detección térmica Aqua',
          format: 'png'
        },
        {
          id: 'viirs_fires',
          name: 'Incendios HD (VIIRS 375m)',
          layer: 'VIIRS_SNPP_Thermal_Anomalies_375m_All',
          description: 'Alta resolución',
          format: 'png'
        }
      ]
    },
    precipitation: {
      name: 'Mapa de Lluvias',
      icon: <Droplets size={18} />,
      color: 'cyan',
      layers: [
        {
          id: 'precipitation_rate',
          name: 'Precipitación en Tiempo Real',
          layer: 'IMERG_Precipitation_Rate',
          description: 'Lluvia actual (mm/hr)',
          format: 'png'
        }
      ]
    },
    temperature: {
      name: 'Mapa de Calor',
      icon: <Thermometer size={18} />,
      color: 'orange',
      layers: [
        {
          id: 'lst_day',
          name: 'Temperatura Superficial - Día',
          layer: 'MODIS_Terra_Land_Surface_Temp_Day',
          description: 'Calor terrestre diurno',
          format: 'png'
        },
        {
          id: 'lst_night',
          name: 'Temperatura Superficial - Noche',
          layer: 'MODIS_Terra_Land_Surface_Temp_Night',
          description: 'Calor terrestre nocturno',
          format: 'png'
        },
        {
          id: 'sea_temp',
          name: 'Temperatura del Mar',
          layer: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
          description: 'Temperatura oceánica',
          format: 'png'
        }
      ]
    },
    drought: {
      name: 'Mapa de Sequía',
      icon: <AlertTriangle size={18} />,
      color: 'yellow',
      layers: [
        {
          id: 'ndvi',
          name: 'Índice de Vegetación (NDVI)',
          layer: 'MODIS_Terra_NDVI_8Day',
          description: 'Salud vegetal - detecta sequía',
          format: 'png'
        },
        {
          id: 'snow_cover',
          name: 'Cobertura de Nieve',
          layer: 'MODIS_Terra_Snow_Cover',
          description: 'Monitoreo de nieve',
          format: 'png'
        }
      ]
    },
    weather: {
      name: 'Clima y Atmósfera',
      icon: <Cloud size={18} />,
      color: 'purple',
      layers: [
        {
          id: 'cloud_top',
          name: 'Temperatura de Nubes',
          layer: 'MODIS_Terra_Cloud_Top_Temp_Day',
          description: 'Altura de nubes',
          format: 'png'
        },
        {
          id: 'water_vapor',
          name: 'Vapor de Agua',
          layer: 'MODIS_Terra_Water_Vapor_5km_Day',
          description: 'Humedad atmosférica',
          format: 'png'
        }
      ]
    },
    night: {
      name: 'Luces Nocturnas',
      icon: <Moon size={18} />,
      color: 'indigo',
      layers: [
        {
          id: 'black_marble',
          name: 'Black Marble',
          layer: 'VIIRS_Black_Marble',
          description: 'Luces de ciudades',
          format: 'png'
        }
      ]
    }
  };

  const getLayerInfo = (layerId: string): LayerInfo | undefined => {
    return Object.values(layerCategories)
      .flatMap((cat: LayerCategory) => cat.layers)
      .find((l: LayerInfo) => l.id === layerId);
  };

  const getImageUrl = (layerId: string): string => {
    const layer: LayerInfo | undefined = getLayerInfo(layerId);
    if (!layer) return '';
    
    return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=${layer.layer}&TIME=${selectedDate}&CRS=EPSG:4326&BBOX=${bbox}&WIDTH=1200&HEIGHT=800&FORMAT=image/${layer.format}`;
  };

  useEffect(() => {
    setImageKey((prev: number) => prev + 1);
  }, [selectedDate, activeLayer, bbox]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedDate((prevDate: string) => {
          const date: Date = new Date(prevDate);
          date.setDate(date.getDate() - 1);
          
          const minDate: Date = new Date();
          minDate.setDate(minDate.getDate() - 30);
          
          if (date < minDate) {
            const maxDate: Date = new Date();
            maxDate.setDate(maxDate.getDate() - 1);
            return maxDate.toISOString().split('T')[0];
          }
          
          return date.toISOString().split('T')[0];
        });
      }, 1500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const locationPresets: LocationPreset[] = [
    { name: 'Global', bbox: '-180,-90,180,90' },
    { name: 'América del Norte', bbox: '-130,15,-60,55' },
    { name: 'Amazonas', bbox: '-75,-15,-45,5' },
    { name: 'Europa', bbox: '-10,35,40,70' },
    { name: 'África', bbox: '-20,-35,55,37' },
    { name: 'Asia', bbox: '60,5,150,55' },
    { name: 'Oceanía', bbox: '110,-45,180,-10' }
  ];

  const downloadCurrentView = (): void => {
    const url: string = getImageUrl(activeLayer);
    window.open(url, '_blank');
  };

  const handleImageError = (): void => {
    console.error('Error loading image:', getImageUrl(activeLayer));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedDate(e.target.value);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLayerOpacity(Number(e.target.value));
  };

  const handleShowBaseChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowBase(e.target.checked);
  };

  const toggleCategory = (key: LayerCategoryKey): void => {
    setActiveCategory(activeCategory === key ? null : key);
  };

  const selectLayer = (layerId: string): void => {
    setActiveLayer(layerId);
  };

  const setTodayDate = (): void => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-3 shadow-lg z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Globe className="w-7 h-7" />
            <div>
              <h1 className="text-xl font-bold">NASA Earth Monitor</h1>
              <p className="text-xs text-blue-100">Sistema de Monitoreo Satelital Global</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`px-3 py-2 rounded-lg transition-all ${showInfo ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
              aria-label="Toggle information"
            >
              <Info size={16} />
            </button>
            <button
              onClick={downloadCurrentView}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              aria-label="Download current view"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-gray-800 text-white overflow-y-auto shadow-xl">
          <div className="p-3 space-y-3">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-3">
              <label htmlFor="date-picker" className="flex items-center gap-2 text-xs font-semibold mb-2 text-blue-300">
                <Calendar size={14} />
                Fecha de Observación
              </label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                min="2000-01-01"
                className="w-full px-2 py-1.5 text-sm bg-gray-700 rounded border border-gray-600 focus:border-blue-400 focus:outline-none text-white"
              />
              
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded transition-all ${
                    isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {isPlaying ? 'Pausar' : 'Animar'}
                </button>
                <button
                  onClick={setTodayDate}
                  className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-all"
                  aria-label="Set to today"
                >
                  Hoy
                </button>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <label htmlFor="opacity-slider" className="flex items-center gap-2 text-xs font-semibold mb-2">
                <Eye size={14} />
                Opacidad: {layerOpacity}%
              </label>
              <input
                id="opacity-slider"
                type="range"
                min="0"
                max="100"
                value={layerOpacity}
                onChange={handleOpacityChange}
                className="w-full"
                aria-label="Layer opacity"
              />
              
              <label className="flex items-center gap-2 text-xs mt-3">
                <input
                  type="checkbox"
                  checked={showBase}
                  onChange={handleShowBaseChange}
                  className="rounded"
                  aria-label="Show base map"
                />
                Mostrar Mapa Base
              </label>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <label className="flex items-center gap-2 text-xs font-semibold mb-2">
                <MapPin size={14} />
                Regiones
              </label>
              <div className="space-y-1">
                {locationPresets.map((preset: LocationPreset) => (
                  <button
                    key={preset.name}
                    onClick={() => setBbox(preset.bbox)}
                    className="w-full text-left px-2 py-1.5 bg-gray-600 hover:bg-gray-500 rounded text-xs transition-all"
                    aria-label={`Set region to ${preset.name}`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <label className="flex items-center gap-2 text-xs font-semibold mb-2">
                <Layers size={14} />
                Capas Disponibles
              </label>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(Object.entries(layerCategories) as [LayerCategoryKey, LayerCategory][]).map(([key, category]) => (
                  <div key={key}>
                    <button
                      onClick={() => toggleCategory(key)}
                      className={`w-full flex items-center justify-between p-2 rounded text-xs transition-all ${
                        activeCategory === key ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      aria-expanded={activeCategory === key}
                      aria-label={`Toggle ${category.name} category`}
                    >
                      <span className="flex items-center gap-2">
                        {category.icon}
                        {category.name}
                      </span>
                      <span>{activeCategory === key ? '▼' : '▶'}</span>
                    </button>
                    
                    {activeCategory === key && (
                      <div className="mt-1 space-y-1 pl-1">
                        {category.layers.map((layer: LayerInfo) => (
                          <button
                            key={layer.id}
                            onClick={() => selectLayer(layer.id)}
                            className={`w-full text-left p-2 rounded text-xs transition-all ${
                              activeLayer === layer.id
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                            aria-pressed={activeLayer === layer.id}
                            aria-label={`Select ${layer.name}`}
                          >
                            <div className="font-medium flex items-center justify-between">
                              {layer.name}
                              {activeLayer === layer.id && <span>✓</span>}
                            </div>
                            <div className="text-xs opacity-75 mt-0.5">{layer.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3">
              <h3 className="text-xs font-bold mb-1 text-blue-300">Capa Activa</h3>
              <div className="text-xs text-gray-300">
                <p className="font-medium">{getLayerInfo(activeLayer)?.name || 'No layer selected'}</p>
                <p className="text-xs opacity-75 mt-1">{getLayerInfo(activeLayer)?.description || ''}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 relative bg-gray-950 overflow-hidden">
          <div className="w-full h-full relative flex items-center justify-center">
            {showBase && (
              <div className="absolute inset-0" style={{ opacity: 0.3 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=Coastlines&CRS=EPSG:4326&BBOX=${bbox}&WIDTH=1200&HEIGHT=800&FORMAT=image/png`}
                  alt="Coastlines"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="relative w-full h-full flex items-center justify-center" style={{ opacity: layerOpacity / 100 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={imageKey}
                src={getImageUrl(activeLayer)}
                alt={getLayerInfo(activeLayer)?.name || 'Satellite layer'}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />
            </div>

            {showInfo && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 max-w-sm z-10">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-800">NASA Earth Monitor</h2>
                  <button
                    onClick={() => setShowInfo(false)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close information"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Visualización Satelital:</strong> Sistema simplificado usando WMS de NASA GIBS.
                  </p>
                  <div className="bg-blue-50 p-2 rounded mt-2">
                    <p className="text-xs font-semibold text-blue-800">Capas:</p>
                    <ul className="text-xs text-blue-700 mt-1 space-y-1">
                      <li>🔥 Incendios en tiempo real</li>
                      <li>💧 Precipitación y lluvia</li>
                      <li>🌡️ Mapas de calor</li>
                      <li>⚠️ Sequía y vegetación</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-600 pt-2 border-t">
                    Datos de NASA GIBS/ESDIS
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white rounded-lg shadow-xl z-10 px-4 py-3">
              <div className="text-xs text-gray-300">Fecha</div>
              <div className="text-lg font-bold">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NASAGIBSExplorer;