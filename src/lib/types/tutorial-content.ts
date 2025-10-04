/**
 * 🎮 Constantes para el Sistema de Minijuegos
 */

import type { EducationalContent } from '@/lib/types/minigames';

// 🎓 Tutoriales de los minijuegos
export const MINIGAME_TUTORIALS: Record<string, EducationalContent> = {
  irrigation: {
    icon: '💧',
    title: 'Riego Inteligente con Datos NASA',
    description: 'Aprende a usar datos satelitales de humedad del suelo y precipitación para optimizar el riego de tus cultivos.',
    nasaSource: 'NASA SMAP (Soil Moisture Active Passive) y GPM (Global Precipitation Measurement)',
    whyItMatters: 'El riego eficiente es crucial para la agricultura sostenible. Los datos de la NASA nos ayudan a determinar cuándo y cuánto regar para ahorrar agua y maximizar el crecimiento.',
    realWorldExample: 'Los agricultores en California usan datos de SMAP para programar el riego, reduciendo el consumo de agua hasta en un 30% mientras mantienen la salud de los cultivos.',
  },
  heatwave: {
    icon: '🌡️',
    title: 'Control de Estrés Térmico',
    description: 'Utiliza datos térmicos satelitales para proteger tus cultivos durante las olas de calor.',
    nasaSource: 'NASA ECOSTRESS (Ecosystem Spaceborne Thermal Radiometer) y POWER (Prediction of Worldwide Energy Resources)',
    whyItMatters: 'El estrés térmico puede dañar severamente los cultivos. Los datos térmicos de la NASA permiten tomar acciones preventivas antes de que ocurran daños.',
    realWorldExample: 'Viñedos en España utilizan datos térmicos de la NASA para activar sistemas de enfriamiento y proteger las uvas durante las olas de calor.',
  },
  pest: {
    icon: '🐛',
    title: 'Detección Temprana de Plagas',
    description: 'Combina datos climáticos y de vegetación para predecir y prevenir infestaciones de plagas.',
    nasaSource: 'NASA MODIS (Moderate Resolution Imaging Spectroradiometer) y TRMM (Tropical Rainfall Measuring Mission)',
    whyItMatters: 'Las plagas causan pérdidas millonarias en la agricultura. La detección temprana basada en datos satelitales permite un control más efectivo y menos uso de pesticidas.',
    realWorldExample: 'Agricultores en Brasil usan datos de MODIS para detectar patrones que indican posibles infestaciones de langostas y actuar preventivamente.',
  },
  drought: {
    icon: '🌵',
    title: 'Gestión de Sequías',
    description: 'Analiza datos de precipitación y sequía para optimizar recursos hídricos limitados.',
    nasaSource: 'NASA GRACE (Gravity Recovery and Climate Experiment) y NLDAS (North American Land Data Assimilation System)',
    whyItMatters: 'Las sequías son cada vez más frecuentes debido al cambio climático. Los datos de la NASA ayudan a planificar y adaptar las prácticas agrícolas.',
    realWorldExample: 'Productores de trigo en Australia utilizan datos de GRACE para planificar cultivos resistentes a la sequía y sistemas de riego eficientes.',
  },
} as const;