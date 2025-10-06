// types/prediction.types.ts

export interface NASAPowerData {
  date: Date;
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  solarRadiation: number;
  pressure: number;
}

export interface NDVIData {
  value: number;
  quality: 'excellent' | 'good' | 'moderate' | 'poor';
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdate: Date;
}

export interface SoilMoistureData {
  surfaceMoisture: number;
  rootZoneMoisture: number;
  saturationLevel: number;
  droughtIndex: number;
}

export interface WeatherPrediction {
  date: Date;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  precipitation: {
    probability: number;
    amount: number;
  };
  humidity: number;
  windSpeed: number;
  confidence: number;
}

export interface CropHealthPrediction {
  cropType: string;
  currentNDVI: number;
  predictedNDVI: number[];
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  daysAhead: number;
}

export interface LivestockRiskPrediction {
  heatStressRisk: number;
  diseaseRisk: number;
  waterStressRisk: number;
  recommendations: string[];
  affectedAnimals: number;
}

export interface ClimateRisk {
  type: 'drought' | 'flood' | 'frost' | 'heatwave' | 'heavyrain';
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  probability: number;
  startDate: Date;
  duration: number;
  affectedArea: number;
  mitigationActions: string[];
}

export interface PredictionResponse {
  weather: WeatherPrediction[];
  cropHealth: CropHealthPrediction[];
  livestockRisk: LivestockRiskPrediction;
  climateRisks: ClimateRisk[];
  generatedAt: Date;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

export interface HistoricalPattern {
  month: number;
  avgTemperature: number;
  avgPrecipitation: number;
  avgNDVI: number;
  droughtFrequency: number;
  floodFrequency: number;
}

export interface AIModelMetrics {
  accuracy: number;
  confidence: number;
  dataPoints: number;
  lastTraining: Date;
  modelVersion: string;
  processingTime: number;
}