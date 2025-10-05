import type { CropType, CropDecisionConfig } from "@/lib/types/crops";

/**
 * Cultivos disponibles con datos NASA
 */
export const AVAILABLE_CROPS: CropType[] = [
  {
    id: "corn",
    name: "Maíz",
    icon: "🌽",
    growthDays: 60, // Reducido para completar en ~1 minuto
    waterNeeds: 75,
    resistance: 60,
    marketPrice: 180,
    nasaOptimalNDVI: 0.650,
    difficulty: "Medio",
  },
  {
    id: "wheat",
    name: "Trigo",
    icon: "🌾",
    growthDays: 60,
    waterNeeds: 50,
    resistance: 80,
    marketPrice: 150,
    nasaOptimalNDVI: 0.580,
    difficulty: "Fácil",
  },
  {
    id: "tomato",
    name: "Tomate",
    icon: "🍅",
    growthDays: 50,
    waterNeeds: 90,
    resistance: 40,
    marketPrice: 220,
    nasaOptimalNDVI: 0.720,
    difficulty: "Difícil",
  },
  {
    id: "potato",
    name: "Papa",
    icon: "🥔",
    growthDays: 55,
    waterNeeds: 65,
    resistance: 70,
    marketPrice: 120,
    nasaOptimalNDVI: 0.550,
    difficulty: "Fácil",
  },
  {
    id: "soybean",
    name: "Soya",
    icon: "🫛",
    growthDays: 58,
    waterNeeds: 55,
    resistance: 75,
    marketPrice: 200,
    nasaOptimalNDVI: 0.680,
    difficulty: "Medio",
  },
];

/**
 * Configuración de decisiones por cultivo
 */
export const CROP_DECISION_CONFIG: Record<string, CropDecisionConfig> = {
  corn: {
    name: "Maíz",
    icon: "🌽",
    thresholds: {
      waterCritical: 25,
      waterLow: 45,
      fertilizerLow: 35,
      pestHigh: 55,
      temperatureHigh: 32,
      harvestReady: 88,
    },
    decisions: {
      water: {
        title: "💧 Riego para Maíz",
        descriptions: {
          critical: "¡CRÍTICO! El maíz se está secando. Necesita riego inmediato para evitar marchitez",
          low: "Tu maíz muestra signos de estrés hídrico. Las hojas comienzan a curvarse",
          preventive: "Riego preventivo recomendado. El maíz necesita agua constante para desarrollo",
        },
        benefits: ["+30 Agua", "+10 Salud", "Previene marchitez", "Mejor desarrollo mazorca"],
        nasaContext: "El maíz requiere 600-700mm de agua durante su ciclo completo",
      },
      fertilizer: {
        title: "🌿 Nutrición para Maíz",
        descriptions: {
          low: "El maíz necesita nitrógeno para desarrollar mazorcas grandes y granos llenos",
          growth: "Fase crítica de crecimiento. El maíz demanda altos niveles de nutrientes",
        },
        benefits: ["+40 Fertilizante", "+15 Crecimiento", "Mazorcas más grandes", "Mejor NDVI"],
        nasaContext: "NDVI óptimo para maíz indica absorción eficiente de nitrógeno",
      },
      pest: {
        title: "🐛 Control Plagas Maíz",
        descriptions: {
          high: "Detectado gusano cogollero o barrenador. Amenaza para el rendimiento",
          alert: "Condiciones favorables para plagas del maíz. Intervención preventiva",
        },
        benefits: ["-50 Plagas", "+20 Salud", "Protege mazorcas", "Previene pérdidas"],
        nasaContext: "Monitoreo satelital detecta estrés por insectos en cultivos de maíz",
      },
    },
  },
  wheat: {
    name: "Trigo",
    icon: "🌾",
    thresholds: {
      waterCritical: 20,
      waterLow: 35,
      fertilizerLow: 30,
      pestHigh: 50,
      temperatureHigh: 30,
      harvestReady: 92,
    },
    decisions: {
      water: {
        title: "💧 Riego para Trigo",
        descriptions: {
          critical: "¡ALERTA! El trigo entra en dormancia por falta de agua. Riego urgente",
          low: "Las espigas del trigo necesitan agua para llenado de grano",
          preventive: "Riego moderado. El trigo es resistente pero necesita agua en floración",
        },
        benefits: ["+25 Agua", "+12 Salud", "Mejor llenado grano", "Previene dormancia"],
        nasaContext: "El trigo requiere menos agua que maíz, 450-500mm por ciclo",
      },
      fertilizer: {
        title: "🌿 Nutrición para Trigo",
        descriptions: {
          low: "El trigo necesita fósforo para desarrollo radicular y formación de espigas",
          growth: "Etapa de macollaje. Nutrientes esenciales para multiplicación de tallos",
        },
        benefits: ["+35 Fertilizante", "+10 Crecimiento", "Más espigas por planta", "Granos más pesados"],
        nasaContext: "NDVI del trigo indica estado nutricional y potencial rendimiento",
      },
      pest: {
        title: "🐛 Control Roya del Trigo",
        descriptions: {
          high: "Detectada roya amarilla o parda. Enfermedad crítica para el trigo",
          alert: "Condiciones húmedas favorecen enfermedades fúngicas en trigo",
        },
        benefits: ["-45 Plagas", "+18 Salud", "Previene roya", "Protege espigas"],
        nasaContext: "Sensores remotos detectan estrés por enfermedades en trigales",
      },
    },
  },
  tomato: {
    name: "Tomate",
    icon: "🍅",
    thresholds: {
      waterCritical: 35,
      waterLow: 55,
      fertilizerLow: 45,
      pestHigh: 40,
      temperatureHigh: 28,
      harvestReady: 85,
    },
    decisions: {
      water: {
        title: "💧 Riego para Tomate",
        descriptions: {
          critical: "¡CRÍTICO! Los tomates se agrietan por estrés hídrico. Riego inmediato",
          low: "Tomates necesitan riego constante. Frutos pequeños indican sed",
          preventive: "Los tomates necesitan riego diario. Son muy sensibles a la sequía",
        },
        benefits: ["+35 Agua", "+15 Salud", "Previene agrietamiento", "Frutos más jugosos"],
        nasaContext: "Tomates requieren 400-600mm agua, distribución uniforme es clave",
      },
      fertilizer: {
        title: "🌿 Nutrición para Tomate",
        descriptions: {
          low: "Tomates necesitan potasio para frutos grandes y sabrosos",
          growth: "Fase de floración y cuajado. Demanda alta de nutrientes balanceados",
        },
        benefits: ["+45 Fertilizante", "+20 Crecimiento", "Tomates más grandes", "Mejor sabor"],
        nasaContext: "NDVI alto en tomates indica plantas vigorosas y productivas",
      },
      pest: {
        title: "🐛 Control Plagas Tomate",
        descriptions: {
          high: "Detectada mosca blanca o minador. Vectores de virus en tomate",
          alert: "Condiciones cálidas favorecen plagas del tomate. Control preventivo",
        },
        benefits: ["-60 Plagas", "+25 Salud", "Previene virus", "Protege frutos"],
        nasaContext: "Monitoreo satelital identifica estrés biótico en cultivos de tomate",
      },
    },
  },
  potato: {
    name: "Papa",
    icon: "🥔",
    thresholds: {
      waterCritical: 22,
      waterLow: 40,
      fertilizerLow: 32,
      pestHigh: 45,
      temperatureHigh: 26,
      harvestReady: 90,
    },
    decisions: {
      water: {
        title: "💧 Riego para Papa",
        descriptions: {
          critical: "¡URGENTE! Las papas se están deshidratando bajo tierra. Riego profundo",
          low: "Tubérculos pequeños por falta de agua. Las papas necesitan humedad constante",
          preventive: "Riego preventivo para papas. Tubérculos en formación requieren agua",
        },
        benefits: ["+28 Agua", "+12 Salud", "Tubérculos más grandes", "Previene grietas"],
        nasaContext: "Papas requieren 500-700mm agua, crítico durante tuberización",
      },
      fertilizer: {
        title: "🌿 Nutrición para Papa",
        descriptions: {
          low: "Papas necesitan potasio para tubérculos de calidad y resistencia",
          growth: "Fase de tuberización. Nutrientes determinan tamaño y calidad de papas",
        },
        benefits: ["+38 Fertilizante", "+14 Crecimiento", "Papas más pesadas", "Mejor almidón"],
        nasaContext: "NDVI en papas correlaciona con biomasa foliar y rendimiento tubérculos",
      },
      pest: {
        title: "🐛 Control Tizón Papa",
        descriptions: {
          high: "Detectado tizón tardío o temprano. Enfermedad devastadora para papas",
          alert: "Humedad alta favorece enfermedades fúngicas en papa. Prevenir tizón",
        },
        benefits: ["-55 Plagas", "+22 Salud", "Previene tizón", "Protege tubérculos"],
        nasaContext: "Imágenes satelitales detectan síntomas tempranos de tizón en papa",
      },
    },
  },
  soybean: {
    name: "Soja",
    icon: "🫛",
    thresholds: {
      waterCritical: 28,
      waterLow: 42,
      fertilizerLow: 25,
      pestHigh: 50,
      temperatureHigh: 35,
      harvestReady: 94,
    },
    decisions: {
      water: {
        title: "💧 Riego para Soja",
        descriptions: {
          critical: "¡CRÍTICO! Soja en estrés hídrico severo. Vainas vacías sin riego",
          low: "Floración de soja necesita agua. Período crítico para formación de vainas",
          preventive: "Soja resistente pero necesita agua en R3-R5. Llenado de granos",
        },
        benefits: ["+30 Agua", "+13 Salud", "Más vainas por planta", "Granos más pesados"],
        nasaContext: "Soja requiere 450-600mm agua, crítico en floración y llenado",
      },
      fertilizer: {
        title: "🌿 Inoculación Soja",
        descriptions: {
          low: "Soja necesita inoculante con rhizobium para fijar nitrógeno del aire",
          growth: "Nódulos poco activos. Refuerzo de inoculante mejora fijación de N",
        },
        benefits: ["+30 Fertilizante", "+18 Crecimiento", "Fijación N mejorada", "Ahorro fertilizante"],
        nasaContext: "NDVI de soja indica eficiencia de fijación biológica de nitrógeno",
      },
      pest: {
        title: "🐛 Control Plagas Soja",
        descriptions: {
          high: "Detectada roya asiática o chinche. Plagas clave en soja",
          alert: "Condiciones favorables para plagas de soja. Monitoreo intensivo",
        },
        benefits: ["-50 Plagas", "+20 Salud", "Previene roya asiática", "Protege vainas"],
        nasaContext: "Teledetección identifica estrés por plagas en cultivos de soja",
      },
    },
  },
};

/**
 * Coordenadas de Cajamarca, Perú
 */
export const LOCATION = {
  lat: -7.16,
  lon: -78.52,
  name: "Cajamarca, Perú",
};

/**
 * Tiempos del juego (en milisegundos)
 * 1 segundo real = 1 día del juego
 * 60 segundos = todo el ciclo de crecimiento
 */
export const GAME_TIMING = {
  DAY_DURATION: 1000, // 1 segundo = 1 día
  AUTO_WATERING_DELAY: 10000, // 10 segundos para riego automático
  GAME_UPDATE_INTERVAL: 1000, // Actualizar cada segundo
};

/**
 * Umbrales para riego automático
 */
export const AUTO_WATERING_THRESHOLDS = {
  CRITICAL: 30, // Activar riego urgente
  LOW: 50, // Activar riego preventivo
  OPTIMAL: 70, // Nivel óptimo de agua
};