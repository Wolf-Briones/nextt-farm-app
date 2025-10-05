"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Satellite, Database, CheckCircle, AlertCircle } from "lucide-react";

interface DataSource {
  name: string;
  status: 'loading' | 'success' | 'error';
  lastUpdate: Date | null;
  icon: string;
}

interface SourceData {
  source: string;
  timestamp: Date;
  data: {
    temperature: number;
    precipitation: number;
    humidity: number;
  };
}

interface RealTimeDataUpdaterProps {
  onDataUpdate: (data: SourceData) => void;
  regionLat: number;
  regionLon: number;
  updateInterval?: number;
}

export default function RealTimeDataUpdater({ 
  onDataUpdate, 
  regionLat, 
  regionLon,
  updateInterval = 1 // Cambiado a 1 minuto
}: RealTimeDataUpdaterProps) {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { name: 'NASA POWER', status: 'loading', lastUpdate: null, icon: '🛰️' },
    { name: 'OpenWeather', status: 'loading', lastUpdate: null, icon: '☁️' },
    { name: 'Análisis Local', status: 'loading', lastUpdate: null, icon: '📊' }
  ]);
  
  const [progress, setProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<number>(updateInterval * 60);

  // Usar useRef para mantener la función de callback sin recrearla
  const onDataUpdateRef = useRef(onDataUpdate);
  
  useEffect(() => {
    onDataUpdateRef.current = onDataUpdate;
  }, [onDataUpdate]);

  // Usar useRef para evitar recreaciones de la función
  const prevRegionRef = useRef({ lat: regionLat, lon: regionLon });

  const fetchDataFromSource = async (sourceName: string): Promise<SourceData> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (Math.random() > 0.95) {
      throw new Error(`Error temporal en ${sourceName}`);
    }
    
    return {
      source: sourceName,
      timestamp: new Date(),
      data: {
        temperature: 15 + Math.random() * 15,
        precipitation: Math.random() * 20,
        humidity: 40 + Math.random() * 40
      }
    };
  };

  const updateAllSources = useCallback(async () => {
    setIsUpdating(true);
    setProgress(0);

    const sources = ['NASA POWER', 'OpenWeather', 'Análisis Local'];
    const totalSteps = sources.length;

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      
      setDataSources(prev => prev.map(s => 
        s.name === source ? { ...s, status: 'loading' } : s
      ));

      try {
        const data = await fetchDataFromSource(source);
        
        setDataSources(prev => prev.map(s => 
          s.name === source 
            ? { ...s, status: 'success', lastUpdate: data.timestamp }
            : s
        ));

        if (source === 'Análisis Local') {
          onDataUpdateRef.current(data);
        }

      } catch (err) {
        console.error(`Error fetching data from ${source}:`, err);
        setDataSources(prev => prev.map(s => 
          s.name === source ? { ...s, status: 'error' } : s
        ));
      }

      setProgress(((i + 1) / totalSteps) * 100);
    }

    setIsUpdating(false);
    setNextUpdate(new Date(Date.now() + updateInterval * 60 * 1000));
    setCountdown(updateInterval * 60);
  }, [updateInterval]);

  // Efecto separado para la primera carga y cambios de región
  useEffect(() => {
    const regionChanged = 
      prevRegionRef.current.lat !== regionLat || 
      prevRegionRef.current.lon !== regionLon;

    if (regionChanged) {
      console.log('Región cambiada, actualizando datos...');
      prevRegionRef.current = { lat: regionLat, lon: regionLon };
      updateAllSources();
    }
  }, [regionLat, regionLon, updateAllSources]);

  // Efecto para primera carga (solo una vez)
  useEffect(() => {
    updateAllSources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta al montar

  // Efecto para el countdown automático
  useEffect(() => {
    if (!isUpdating && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            updateAllSources();
            return updateInterval * 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isUpdating, countdown, updateAllSources, updateInterval]);

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatLastUpdate = (date: Date | null): string => {
    if (!date) return 'Nunca';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `Hace ${diff}s`;
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
    return `Hace ${Math.floor(diff / 3600)}h`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <Satellite className="w-4 h-4" />
          Actualización en Tiempo Real
        </h3>
        <button
          onClick={updateAllSources}
          disabled={isUpdating}
          className="p-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-white ${isUpdating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isUpdating && (
        <div className="mb-4">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-xs text-cyan-400 mt-1 text-center">
            Actualizando... {Math.round(progress)}%
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {dataSources.map((source) => (
          <div
            key={source.name}
            className="flex items-center justify-between p-2 bg-gray-700/50 rounded"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{source.icon}</span>
              <div>
                <div className="text-xs font-medium text-white">{source.name}</div>
                <div className="text-xs text-gray-400">
                  {formatLastUpdate(source.lastUpdate)}
                </div>
              </div>
            </div>
            
            <div>
              {source.status === 'loading' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Database className="w-4 h-4 text-yellow-400" />
                </motion.div>
              )}
              {source.status === 'success' && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
              {source.status === 'error' && (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      {!isUpdating && nextUpdate && (
        <div className="text-center p-2 bg-gray-900 rounded border border-gray-600">
          <div className="text-xs text-gray-400 mb-1">Próxima actualización</div>
          <div className="text-lg font-bold text-cyan-400 font-mono">
            {formatCountdown(countdown)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Intervalo: {updateInterval} min
          </div>
        </div>
      )}

      {regionLat !== undefined && regionLon !== undefined && (
        <div className="mt-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
          <div className="text-xs text-blue-400">
            Monitoreando: {regionLat.toFixed(4)}°, {regionLon.toFixed(4)}°
          </div>
        </div>
      )}
    </div>
  );
}