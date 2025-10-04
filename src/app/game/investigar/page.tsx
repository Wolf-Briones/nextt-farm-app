"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Layers, Calendar, Info, Play, Pause, Download, Globe, Flame, Cloud, Thermometer, Moon, Eye, MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const NASAGIBSExplorer = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Ayer, porque hoy podría no estar disponible
    return today.toISOString().split('T')[0];
  });
  const [selectedLayers, setSelectedLayers] = useState(['true_color']);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeCategory, setActiveCategory] = useState('satellite');
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const layerCategories = {
    satellite: {
      name: 'Imágenes Satelitales',
      icon: <Globe size={18} />,
      layers: [
        {
          id: 'true_color',
          name: 'Color Verdadero (Terra/MODIS)',
          layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
          description: 'Vista natural de la Tierra como se vería desde el espacio',
          format: 'jpeg'
        },
        {
          id: 'aqua_true_color',
          name: 'Color Verdadero (Aqua/MODIS)',
          layer: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
          description: 'Vista desde el satélite Aqua de la NASA',
          format: 'jpeg'
        },
        {
          id: 'viirs_true_color',
          name: 'VIIRS Color Verdadero',
          layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
          description: 'Alta resolución desde Suomi-NPP',
          format: 'jpeg'
        }
      ]
    },
    fire: {
      name: 'Detección de Incendios',
      icon: <Flame size={18} />,
      layers: [
        {
          id: 'terra_fires',
          name: 'Anomalías Térmicas (Terra)',
          layer: 'MODIS_Terra_Thermal_Anomalies_All',
          description: 'Puntos calientes y fuegos activos detectados',
          format: 'png'
        },
        {
          id: 'viirs_fires',
          name: 'VIIRS Incendios (375m)',
          layer: 'VIIRS_SNPP_Thermal_Anomalies_375m_All',
          description: 'Alta resolución para detección de incendios',
          format: 'png'
        }
      ]
    },
    weather: {
      name: 'Clima y Atmósfera',
      icon: <Cloud size={18} />,
      layers: [
        {
          id: 'precipitation',
          name: 'Precipitación (GPM)',
          layer: 'IMERG_Precipitation_Rate',
          description: 'Tasa de precipitación global',
          format: 'png'
        },
        {
          id: 'aerosol',
          name: 'Aerosoles (MODIS)',
          layer: 'MODIS_Terra_Aerosol',
          description: 'Profundidad óptica de aerosoles',
          format: 'png'
        }
      ]
    },
    temperature: {
      name: 'Temperatura',
      icon: <Thermometer size={18} />,
      layers: [
        {
          id: 'lst_day',
          name: 'Temperatura Superficial Día',
          layer: 'MODIS_Terra_Land_Surface_Temp_Day',
          description: 'Temperatura terrestre diurna',
          format: 'png'
        }
      ]
    },
    night: {
      name: 'Luces Nocturnas',
      icon: <Moon size={18} />,
      layers: [
        {
          id: 'black_marble',
          name: 'Black Marble',
          layer: 'VIIRS_Black_Marble',
          description: 'Iluminación nocturna de la Tierra',
          format: 'jpeg'
        }
      ]
    }
  };

  const getActiveLayer = () => {
    for (const category of Object.values(layerCategories)) {
      const layer = category.layers.find(l => selectedLayers.includes(l.id));
      if (layer) return layer;
    }
    return layerCategories.satellite.layers[0];
  };

  const activeLayer = getActiveLayer();

  const getWMSImageUrl = (layerName: string, format: string, bbox: string) => {
    return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=${layerName}&TIME=${selectedDate}&CRS=EPSG:4326&BBOX=${bbox}&WIDTH=1200&HEIGHT=800&FORMAT=image/${format}`;
  };

  const calculateBBox = () => {
    const latRange = 180 / Math.pow(2, mapZoom - 1);
    const lngRange = 360 / Math.pow(2, mapZoom - 1);
    
    const minLng = Math.max(-180, mapCenter.lng - lngRange / 2);
    const maxLng = Math.min(180, mapCenter.lng + lngRange / 2);
    const minLat = Math.max(-90, mapCenter.lat - latRange / 2);
    const maxLat = Math.min(90, mapCenter.lat + latRange / 2);
    
    return `${minLat},${minLng},${maxLat},${maxLng}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedDate(prevDate => {
          const date = new Date(prevDate);
          date.setDate(date.getDate() - 1);
          
          const minDate = new Date();
          minDate.setDate(minDate.getDate() - 30);
          
          if (date < minDate) {
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() - 1);
            return maxDate.toISOString().split('T')[0];
          }
          
          return date.toISOString().split('T')[0];
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleLayer = (layerId: string) => {
    setSelectedLayers([layerId]);
    setIsLoading(true);
  };

  const downloadImage = () => {
    const bbox = calculateBBox();
    const url = getWMSImageUrl(activeLayer.layer, activeLayer.format, bbox);
    window.open(url, '_blank');
  };

  const locationPresets = [
    { name: 'Global', center: { lat: 0, lng: 0 }, zoom: 2 },
    { name: 'Amazonas', center: { lat: -3, lng: -60 }, zoom: 4 },
    { name: 'Sahara', center: { lat: 23, lng: 10 }, zoom: 4 },
    { name: 'Himalaya', center: { lat: 28, lng: 85 }, zoom: 5 },
    { name: 'Australia', center: { lat: -25, lng: 135 }, zoom: 4 },
    { name: 'Groenlandia', center: { lat: 72, lng: -40 }, zoom: 3 },
    { name: 'California', center: { lat: 37, lng: -120 }, zoom: 5 },
    { name: 'Madagascar', center: { lat: -19, lng: 46 }, zoom: 5 }
  ];

  const flyToLocation = (preset: typeof locationPresets[0]) => {
    setMapCenter(preset.center);
    setMapZoom(preset.zoom);
    setIsLoading(true);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 8));
    setIsLoading(true);
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 1));
    setIsLoading(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    const moveFactor = 0.3 / Math.pow(2, mapZoom - 1);
    
    setMapCenter(prev => ({
      lng: Math.max(-180, Math.min(180, prev.lng - dx * moveFactor)),
      lat: Math.max(-90, Math.min(90, prev.lat + dy * moveFactor))
    }));
    
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const bbox = calculateBBox();
  const imageUrl = getWMSImageUrl(activeLayer.layer, activeLayer.format, bbox);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">NASA GIBS Explorer</h1>
              <p className="text-xs text-blue-100">Global Imagery Browse Services</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`px-4 py-2 rounded-lg transition-all ${showInfo ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Info size={18} />
            </button>
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              title="Descargar imagen actual"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 text-white overflow-y-auto shadow-xl">
          <div className="p-4 space-y-4">
            {/* Selector de fecha */}
            <div className="bg-gray-700 rounded-lg p-4">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Calendar size={16} />
                Fecha de Observación
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setIsLoading(true);
                }}
                max={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                min="2000-01-01"
                className="w-full px-3 py-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-400 focus:outline-none text-white"
              />
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-all ${
                    isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {isPlaying ? 'Pausar' : 'Animar'}
                </button>
                <button
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setSelectedDate(yesterday.toISOString().split('T')[0]);
                    setIsLoading(true);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-all"
                >
                  Hoy
                </button>
              </div>
            </div>

            {/* Control de opacidad */}
            <div className="bg-gray-700 rounded-lg p-4">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Eye size={16} />
                Opacidad: {layerOpacity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Ubicaciones rápidas */}
            <div className="bg-gray-700 rounded-lg p-4">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <MapPin size={16} />
                Ir a Ubicación
              </label>
              <div className="grid grid-cols-2 gap-2">
                {locationPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => flyToLocation(preset)}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-xs transition-all"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorías de capas */}
            <div className="bg-gray-700 rounded-lg p-4">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Layers size={16} />
                Capas Disponibles
              </label>
              
              <div className="space-y-3">
                {Object.entries(layerCategories).map(([key, category]) => (
                  <div key={key} className="space-y-2">
                    <button
                      onClick={() => setActiveCategory(activeCategory === key ? 'satellite' : key)}
                      className={`w-full flex items-center justify-between p-2 rounded transition-all ${
                        activeCategory === key ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        {category.icon}
                        {category.name}
                      </span>
                      <span className="text-xs">{activeCategory === key ? '▼' : '▶'}</span>
                    </button>
                    
                    {activeCategory === key && (
                      <div className="space-y-1 pl-2">
                        {category.layers.map(layer => (
                          <button
                            key={layer.id}
                            onClick={() => toggleLayer(layer.id)}
                            className={`w-full text-left p-2 rounded text-xs transition-all ${
                              selectedLayers.includes(layer.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            <div className="font-medium">{layer.name}</div>
                            <div className="text-xs opacity-75 mt-1">{layer.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Info de capa activa */}
            {activeLayer && (
              <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
                <h3 className="text-sm font-bold mb-2 text-blue-300">Capa Activa</h3>
                <p className="text-xs mb-1 font-medium">{activeLayer.name}</p>
                <p className="text-xs text-gray-300">{activeLayer.description}</p>
                <p className="text-xs text-gray-400 mt-2">Layer: {activeLayer.layer}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Mapa */}
        <main className="flex-1 relative bg-gray-900">
          <div 
            className="w-full h-full relative overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={mapRef}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <div className="bg-white/90 rounded-lg p-4 flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-800">Cargando imagen...</span>
                </div>
              </div>
            )}

            <img
              src={imageUrl}
              alt="NASA GIBS Satellite Imagery"
              className="w-full h-full object-cover"
              style={{ opacity: layerOpacity / 100 }}
              draggable={false}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />

            {/* Controles de zoom */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={handleZoomIn}
                className="bg-white/90 hover:bg-white p-3 rounded-lg shadow-lg transition-all"
                title="Acercar"
              >
                <ZoomIn size={20} className="text-gray-800" />
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-white/90 hover:bg-white p-3 rounded-lg shadow-lg transition-all"
                title="Alejar"
              >
                <ZoomOut size={20} className="text-gray-800" />
              </button>
              <button
                onClick={() => flyToLocation(locationPresets[0])}
                className="bg-white/90 hover:bg-white p-3 rounded-lg shadow-lg transition-all"
                title="Vista global"
              >
                <Maximize2 size={20} className="text-gray-800" />
              </button>
            </div>

            {/* Panel de información flotante */}
            {showInfo && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 max-w-md z-10">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Acerca de GIBS</h2>
                  <button
                    onClick={() => setShowInfo(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Global Imagery Browse Services (GIBS)</strong> de la NASA proporciona 
                    acceso rápido a más de 1,000 productos de imágenes satelitales.
                  </p>
                  <p>
                    Las imágenes se actualizan diariamente y están disponibles pocas horas después 
                    de la observación satelital.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-4">
                    <p className="text-xs font-semibold text-blue-800">Controles:</p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• Arrastra el mapa para mover</li>
                      <li>• Usa los botones + / - para zoom</li>
                      <li>• Selecciona ubicaciones rápidas</li>
                      <li>• Anima para ver cambios temporales</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-600 pt-2 border-t">
                    Reconocemos el uso de imágenes proporcionadas por los servicios de exploración 
                    de imágenes globales (GIBS) de la NASA.
                  </p>
                </div>
              </div>
            )}

            {/* Indicador de fecha y coordenadas */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white rounded-lg shadow-xl z-10">
              <div className="px-6 py-3 border-b border-white/10">
                <div className="text-xs text-gray-300">Fecha de Observación</div>
                <div className="text-xl font-bold">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
              <div className="px-6 py-2 text-xs">
                <div className="text-gray-300">
                  Centro: {mapCenter.lat.toFixed(2)}°, {mapCenter.lng.toFixed(2)}° | Zoom: {mapZoom}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NASAGIBSExplorer;