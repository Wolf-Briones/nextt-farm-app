/**
 * Tipos de cultivos disponibles en el juego
 */
export type CropType = {
  id: string;
  name: string;
  icon: string;
  growthDays: number;
  waterNeeds: number;
  resistance: number;
  marketPrice: number;
  nasaOptimalNDVI: number;
  difficulty: "Fácil" | "Medio" | "Difícil";
};

/**
 * Estado de una parcela individual
 */
export type ParcelState = {
  id: number;
  crop: CropType | null;
  plantedDate: Date | null;
  growthStage: number; // 0-100%
  health: number; // 0-100%
  waterLevel: number; // 0-100%
  fertilizerLevel: number; // 0-100%
  pestLevel: number; // 0-100 (más alto = más plagas)
  ndviValue: number;
  soilMoisture: number;
  temperature: number;
  isSelected: boolean;
  lastAction: string;
  daysToHarvest: number;
  hasPestsAppeared: boolean;
};

/**
 * Datos de NASA en tiempo real
 */
export type NASAData = {
  globalNDVI: number;
  soilMoisture: number;
  temperature: number;
  precipitation: number;
  evapotranspiration: number;
  heatStress: boolean;
  droughtRisk: "bajo" | "medio" | "alto";
  pestAlert: boolean;
  lastUpdate: Date;
};

/**
 * Respuesta de la API de NASA POWER
 */
export type NASAPowerResponse = {
  properties: {
    parameter: {
      T2M: Record<string, number>;
      T2M_MAX?: Record<string, number>;
      T2M_MIN?: Record<string, number>;
      PRECTOTCORR: Record<string, number>;
      RH2M: Record<string, number>;
      EVPTRNS?: Record<string, number>;
    };
  };
};

/**
 * Configuración de decisiones por cultivo
 */
export type CropDecisionConfig = {
  name: string;
  icon: string;
  thresholds: {
    waterCritical: number;
    waterLow: number;
    fertilizerLow: number;
    pestHigh: number;
    temperatureHigh: number;
    harvestReady: number;
  };
  decisions: {
    water: {
      title: string;
      descriptions: {
        critical: string;
        low: string;
        preventive: string;
      };
      benefits: readonly string[];
      nasaContext: string;
    };
    fertilizer: {
      title: string;
      descriptions: {
        low: string;
        growth: string;
      };
      benefits: readonly string[];
      nasaContext: string;
    };
    pest: {
      title: string;
      descriptions: {
        high: string;
        alert: string;
      };
      benefits: readonly string[];
      nasaContext: string;
    };
  };
};

/**
 * Carta de decisión
 */
export type DecisionCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  urgency: 'low' | 'medium' | 'high';
  cost: number;
  benefits: readonly string[];
  nasaData: string;
  action: () => void;
};

/**
 * Props del componente principal
 */
export interface CultivosGameProps {
  parcels?: ParcelState[];
  onParcelsChange?: (parcels: ParcelState[]) => void;
  playerMoney?: number;
  onMoneyChange?: (money: number) => void;
  playerXP?: number;
  onXPChange?: (xp: number) => void;
  onAutoWatering?: (parcelId: number) => void;
}

/**
 * Props del mapa de parcelas
 */
export interface ParcelMapProps {
  parcels: ParcelState[];
  onSelectParcel: (id: number | null) => void;
  selectedCrop: CropType | null;
  autoWateringParcels: Set<number>;
  onManualWatering: (parcelId: number, event: React.MouseEvent) => void;
  onHarvestParcel: (parcelId: number) => void;
}

/**
 * Props del selector de cultivos
 */
export interface CropSelectorProps {
  selectedCrop: CropType | null;
  onSelectCrop: (crop: CropType) => void;
  playerMoney: number;
}

/**
 * Props de las cartas de decisión
 */
export interface DecisionCardsProps {
  parcels: ParcelState[];
  nasaData: NASAData;
  onApplyAction: (parcelId: number, action: string, cost: number) => void;
  onAutoWatering?: (parcelId: number) => void;
}