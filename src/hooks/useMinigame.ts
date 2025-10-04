/**
 * 🎣 Custom Hooks para el Sistema de Minijuegos
 */

import { useState, useEffect, useCallback } from 'react';
import type { 
  GameState, 
  MinigameType, 
  GameResult,
  NASARealtimeData 
} from '@/lib/types/minigames';
import { GAME_LEVELS } from '@/lib/const/minigames';
import { processNASADataForGame } from '@/lib/utils/minigames';

// 🎮 Hook principal para gestionar el estado del juego
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    level: 1,
    score: 0,
    timeLeft: 0,
    isPlaying: false,
    isPaused: false,
    showTutorial: true
  });

  const startGame = useCallback((gameType: MinigameType) => {
    const levelConfig = GAME_LEVELS[1];
    setGameState({
      currentGame: gameType,
      level: 1,
      score: 0,
      timeLeft: levelConfig.timeLimit,
      isPlaying: true,
      isPaused: false,
      showTutorial: true
    });
  }, []);

  const completeGame = useCallback((result: GameResult) => {
    setGameState(prev => ({
      ...prev,
      score: result.score,
      isPlaying: false
    }));

    // Si tiene éxito y no está en el nivel máximo, avanzar
    if (result.success && gameState.level < 3) {
      setTimeout(() => {
        const nextLevel = gameState.level + 1;
        const levelConfig = GAME_LEVELS[nextLevel];
        setGameState(prev => ({
          ...prev,
          level: nextLevel,
          timeLeft: levelConfig.timeLimit,
          isPlaying: true,
          showTutorial: false
        }));
      }, 3000);
    } else {
      // Volver al selector después de 3 segundos
      setTimeout(() => {
        setGameState({
          currentGame: null,
          level: 1,
          score: result.score,
          timeLeft: 0,
          isPlaying: false,
          isPaused: false,
          showTutorial: true
        });
      }, 3000);
    }
  }, [gameState.level]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const exitGame = useCallback(() => {
    setGameState({
      currentGame: null,
      level: 1,
      score: 0,
      timeLeft: 0,
      isPlaying: false,
      isPaused: false,
      showTutorial: true
    });
  }, []);

  const closeTutorial = useCallback(() => {
    setGameState(prev => ({ ...prev, showTutorial: false }));
  }, []);

  return {
    gameState,
    startGame,
    completeGame,
    pauseGame,
    exitGame,
    closeTutorial
  };
}

// ⏱️ Hook para el temporizador del juego
export function useGameTimer(
  initialTime: number,
  isPlaying: boolean,
  isPaused: boolean,
  onTimeUp: () => void
) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, onTimeUp]);

  return timeLeft;
}

// 🛰️ Hook para obtener y procesar datos NASA
export function useNASAData() {
  const [nasaData, setNasaData] = useState<NASARealtimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Importar funciones desde el cliente NASA existente
        const { fetchNASAPowerData, processNASAData } = await import('@/lib/utils/nasa-api');
        
        // Obtener datos de NASA POWER
        const rawData = await fetchNASAPowerData();
        const processedData = processNASAData(rawData);
        
        // Convertir a formato de juego
        const gameData = processNASADataForGame(processedData);
        
        setNasaData(gameData);
        setError(null);
      } catch (err) {
        console.error('Error fetching NASA data:', err);
        setError('No se pudieron cargar los datos NASA');
        
        // Usar datos de fallback para el juego
        setNasaData({
          temperature: 24,
          temperatureMax: 29,
          temperatureMin: 18,
          precipitation: 3.5,
          humidity: 65,
          evapotranspiration: 4.2,
          soilMoisture: 55,
          heatStress: false,
          droughtRisk: 'medio',
          pestAlert: false,
          ndvi: 0.65
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Actualizar datos cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { nasaData, isLoading, error };
}

// 📊 Hook para tracking de puntuación
export function useScore(initialScore: number = 0) {
  const [score, setScore] = useState(initialScore);

  const addPoints = useCallback((points: number) => {
    setScore(prev => Math.max(0, prev + points));
  }, []);

  const resetScore = useCallback(() => {
    setScore(0);
  }, []);

  const setScoreValue = useCallback((value: number) => {
    setScore(Math.max(0, Math.min(100, value)));
  }, []);

  return { score, addPoints, resetScore, setScoreValue };
}

// 🎯 Hook para gestionar acciones limitadas
export function useActions(initialActions: number) {
  const [actions, setActions] = useState(initialActions);

  const doAction = useCallback(() => {
    setActions(prev => Math.max(0, prev - 1));
  }, []);

  const resetActions = useCallback(() => {
    setActions(initialActions);
  }, [initialActions]);

  const hasActionsLeft = actions > 0;

  return { actions, doAction, resetActions, hasActionsLeft };
}


// 📱 Hook para simular sensores IoT en tiempo real
export function useIoTSensors(nasaData: NASARealtimeData | null) {
  const [sensorReadings, setSensorReadings] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!nasaData) return;

    // Actualizar lecturas de sensores cada 2 segundos
    const interval = setInterval(() => {
      setSensorReadings({
        temperature: nasaData.temperature + (Math.random() * 2 - 1),
        humidity: nasaData.humidity + (Math.random() * 5 - 2.5),
        soilMoisture: nasaData.soilMoisture + (Math.random() * 3 - 1.5),
        light: Math.random() * 100,
        waterLevel: Math.random() * 100
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [nasaData]);

  return sensorReadings;
}