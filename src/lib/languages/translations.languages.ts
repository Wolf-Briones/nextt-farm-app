export const translations = {
  es: {
    // Componente LoadingBar
    loading: {
      title: "Inicializando Sistema Agrícola",
      message: "Conectando con sistemas de monitoreo global...",
    },
    // Componente Globe (Texto principal)
    header: {
      subtitle: "Sistema de Agricultura Inteligente Global",
    },
    locationPanel: {
      title: "Tu Ubicación",
      status: "GPS Activo",
      city: "Ciudad",
      country: "País",
      coords: "Coordenadas GPS",
      detected: "Detectado",
      genericCity: "Ubicación detectada",
      genericCountry: "Detectado",
    },
    slogan: ["Juega,", "aprende", "y", "transforma", "el", "planeta"],
    // Módulos (Cards)
    modules: {
      cultivos: {
        title: "Cultivos",
        description: "Gestión de siembra",
      },
      ganaderia: {
        title: "Ganadería",
        description: "Monitoreo de ganado",
      },
      investigacion: {
        title: "Investigación",
        description: "Laboratorio agrícola",
      },
      minijuegos: {
        title: "IA predictiva",
        description: "Pronosticos inteligentes",
      },
      explore: "🤖Explorar🚀",
    },
    // Panel de Estadísticas
    stats: {
      title: "Datos en Tiempo Real",
      areas: "Áreas monitoreadas:",
      crops: "Cultivos activos:",
      efficiency: "Eficiencia hídrica:",
    },
    // Botón CTA
    cta: "Iniciar Challenge NASA 2025",

    // ========== NUEVAS TRADUCCIONES PARA GameLayout ==========

    // Header principal
    gameHeader: {
      title: "SPACEFARM NASA",
      nasaStatus: "NASA APIs: Activo",
      sensors: "MODIS • SMAP",
    },

    // Modos de juego (Footer)
    gameModes: {
      cultivar: {
        title: "Cultivos NASA",
        description: "Agricultura inteligente con IA",
      },
      cuidar: {
        title: "Mundo Animal",
        description: "Bienestar y salud animal",
      },
      investigar: {
        title: "Investigación satelital",
        description: "Análisis y experimentación",
      },
      ia: {
        title: "IA Predictiva",
        description: "Pronósticos inteligentes",
      },
    },

    // Tutorial - Bienvenida
    tutorial: {
      welcome: {
        title: "Simulador Agrícola NASA",
        subtitle: "Tutorial Interactivo Completo",
        description:
          "Aprende a gestionar cultivos y ganado usando datos satelitales reales. Domina la agricultura de precisión, el cuidado animal y la toma de decisiones inteligentes para maximizar tu producción.",
        startButton: "🎮 Comenzar Tutorial Interactivo",
        features: {
          nasaData: {
            title: "Datos NASA MODIS/SMAP",
            description: "Información satelital en tiempo real",
          },
          crops: {
            title: "5 Cultivos Diferentes",
            description: "Características únicas por cultivo",
          },
          livestock: {
            title: "Ganadería Inteligente",
            description: "Manejo integral del ganado",
          },
          ai: {
            title: "IA Predictiva",
            description: "Decisiones inteligentes",
          },
        },
      },

      // Header del tutorial
      header: {
        title: "Tutorial Interactivo",
        subtitle: "Domina la agricultura y ganadería inteligente",
        backButton: "← Inicio",
      },

      // Tips rotativos
      tips: [
        "🌱 Cada cultivo tiene necesidades específicas de agua y nutrientes",
        "📡 Los datos NASA se actualizan en tiempo real cada 5 segundos",
        "💰 El riego manual es gratuito, el automático cuesta $5 pero es más eficiente",
        "🐄 Arrastra alimento sobre los animales para alimentarlos automáticamente",
        "🩺 Los sensores IoT detectan enfermedades antes que síntomas visibles",
        "🎯 Las cartas rojas requieren acción inmediata para evitar pérdidas",
      ],

      // Pestañas de secciones
      sections: {
        understanding: "📊 Valores",
        gameplay: "🎮 Jugar",
        livestock: "🐄 Ganadería",
        decisions: "🎯 Decisiones",
      },

      // Footer del tutorial
      footer: {
        section: "Sección:",
        cards: "Cards:",
        active: "Activo:",
      },

      // Secciones del tutorial
      data: {
        understanding: {
          title: "📊 Entendiendo los Valores",
          subtitle: "Aprende a interpretar los indicadores agrícolas",
          steps: {
            ndvi: {
              title: "NDVI - Índice de Vegetación",
              description:
                "Mide la salud y vigor de las plantas usando datos satelitales NASA",
              details: [
                "Rango: 0.200 - 0.900 (valores normales)",
                "Verde (>0.7): Excelente salud vegetal",
                "Amarillo (0.5-0.7): Salud moderada",
                "Rojo (<0.5): Estrés vegetal crítico",
                "Cada cultivo tiene su NDVI óptimo específico",
              ],
              tips: [
                "Maíz óptimo: 0.650 NDVI",
                "Trigo óptimo: 0.580 NDVI",
                "Tomate óptimo: 0.720 NDVI",
              ],
              example:
                "Si tu maíz muestra NDVI 0.620 vs óptimo 0.650, necesita nutrientes",
            },
            water: {
              title: "Nivel de Agua",
              description: "Porcentaje de humedad disponible para el cultivo",
              details: [
                "0-30%: Crítico - Riego urgente",
                "30-60%: Bajo - Programar riego",
                "60-80%: Óptimo - Monitorear",
                "80-100%: Excelente - Sin acción",
                "Cada cultivo tiene necesidades hídricas diferentes",
              ],
              tips: [
                "Tomate necesita 90% de agua",
                "Trigo es más resistente (50%)",
                "Papa requiere humedad constante",
              ],
              example: "Tomate con 40% agua = estrés hídrico severo",
            },
            health: {
              title: "Salud del Cultivo",
              description: "Estado general de la planta (0-100%)",
              details: [
                "80-100%: Excelente estado",
                "60-80%: Buena salud",
                "40-60%: Atención requerida",
                "0-40%: Estado crítico",
                "Afectado por agua, plagas y nutrientes",
              ],
              tips: [
                "Baja salud reduce el rendimiento",
                "Monitorea cambios diarios",
                "Actúa antes del 40%",
              ],
              example: "Salud 30% = pérdidas significativas en cosecha",
            },
          },
        },
        gameplay: {
          title: "🎮 Cómo Jugar",
          subtitle: "Interacciones y mecánicas del simulador",
          steps: {
            selection: {
              title: "Selección de Parcelas",
              description:
                "Elige cultivos y administra 12 parcelas disponibles",
              details: [
                "Haz clic en cultivo para seleccionar",
                "Clic en parcela libre para plantar",
                "Costo: $50 por parcela plantada",
                "Cada cultivo tiene tiempo diferente",
                "Monitorea múltiples parcelas simultáneamente",
              ],
              tips: [
                "Diversifica cultivos para reducir riesgo",
                "Planta según estación y recursos",
                "Parcelas amarillas necesitan atención",
              ],
              example:
                "Selecciona tomate → Clic parcela → Paga $50 → Planta inmediatamente",
              actions: ["Seleccionar", "Plantar", "Monitorear"],
            },
            watering: {
              title: "Sistema de Riego",
              description:
                "Dos opciones: manual gratuito o automático inteligente",
              details: [
                "Riego Manual: Gratuito, +10 agua, inmediato",
                "Riego Automático: $5, +25 agua, 10 segundos",
                "Botón azul aparece cuando se necesita",
                "Sistema IoT optimiza aplicación",
                "Previene estrés hídrico crítico",
              ],
              tips: [
                "Manual para control directo",
                "Automático para eficiencia",
                "Usa manual si tienes poco dinero",
              ],
              example:
                "Maíz 30% agua → Botón azul activo → Elige manual o automático",
              actions: ["Riego Manual", "Riego Automático", "Programar"],
            },
          },
        },
        livestock: {
          title: "🐄 Ganadería Inteligente",
          subtitle: "Manejo y cuidado del ganado con tecnología",
          steps: {
            healthMonitoring: {
              title: "Monitoreo de Salud",
              description: "Sistema IoT para vigilancia continua del ganado",
              details: [
                "Sensores de temperatura corporal en tiempo real",
                "Monitoreo de actividad y movimiento",
                "Detección temprana de enfermedades",
                "Alertas automáticas de comportamiento anómalo",
                "Historial médico digital por animal",
              ],
              tips: [
                "Temperatura normal: 38.5-39°C",
                "Actividad baja puede indicar enfermedad",
                "Revisa alertas cada 2 horas",
              ],
              example:
                "Vaca #12 temperatura 40.1°C → Alerta fiebre → Llamar veterinario",
              actions: ["Revisar Vitales", "Ver Historial", "Generar Reporte"],
            },
            feedingSystem: {
              title: "Sistema de Alimentación",
              description:
                "Arrastra y suelta alimento según necesidades nutricionales",
              details: [
                "Drag & Drop: Arrastra heno, pienso o suplementos",
                "Cálculo automático de raciones por peso/edad",
                "Diferentes tipos: Forraje, concentrado, minerales",
                "Horarios programados de alimentación",
                "Control de peso y crecimiento",
              ],
              tips: [
                "Vacas adultas: 2-3% peso corporal en alimento",
                "Terneros: Alimentar cada 6-8 horas",
                "Varía dieta según época del año",
              ],
              example:
                "Arrastra 🌾 sobre vaca joven → Sistema calcula 15kg → Animal satisfecho",
              actions: [
                "Arrastra Heno",
                "Arrastra Pienso",
                "Programar Horario",
              ],
            },
            waterManagement: {
              title: "Gestión Hídrica",
              description:
                "Sistema automatizado de hidratación y detección de estrés",
              details: [
                "Bebederos automáticos con sensores",
                "Detección de estrés hídrico por comportamiento",
                "Calidad del agua monitoreada (pH, temperatura)",
                "Consumo diario por animal registrado",
                "Alertas de deshidratación temprana",
              ],
              tips: [
                "Vaca adulta necesita 30-50L/día",
                "Agua caliente en invierno mejora consumo",
                "Limpia bebederos semanalmente",
              ],
              example:
                "Sensor detecta 8 horas sin beber → Alerta estrés hídrico → Revisar bebedero",
              actions: ["Revisar Consumo", "Llenar Tanque", "Analizar Calidad"],
            },
            veterinaryCare: {
              title: "Atención Veterinaria",
              description: "Sistema de diagnóstico y tratamiento veterinario",
              details: [
                "Drag & Drop animales enfermos a la clínica",
                "Diagnóstico automático por síntomas",
                "Tratamientos disponibles: Medicamentos, cirugía",
                "Tiempo de recuperación variable por enfermedad",
                "Costo de tratamiento según gravedad",
              ],
              tips: [
                "Prevención es más barata que curar",
                "Aísla animales enfermos del rebaño",
                "Vacunación anual obligatoria",
              ],
              example:
                "Vaca cojea → Arrastra a clínica → Diagnóstico: Mastitis → Tratamiento $150",
              actions: [
                "Llevar a Clínica",
                "Aplicar Tratamiento",
                "Programar Revisión",
              ],
            },
            breedingManagement: {
              title: "Gestión Reproductiva",
              description: "Control de apareamiento y nacimientos",
              details: [
                "Ciclo estral monitoreado por sensores",
                "Programación de inseminación artificial",
                "Seguimiento de gestación con ultrasonido",
                "Preparación para parto con alertas",
                "Registro genealógico y mejoramiento genético",
              ],
              tips: [
                "Gestación bovina: 280-285 días",
                "Primera inseminación: 15-18 meses",
                "Separa toros agresivos del rebaño",
              ],
              example:
                "Vaca en celo → Programa inseminación → 9 meses → Nace ternero saludable",
              actions: ["Detectar Celo", "Inseminar", "Monitorear Gestación"],
            },
            productionTracking: {
              title: "Seguimiento de Producción",
              description: "Monitoreo de leche, carne y otros productos",
              details: [
                "Ordeño automatizado con registro por vaca",
                "Análisis de calidad de leche (grasa, proteína)",
                "Peso de ganado para sacrificio",
                "Rendimiento económico por animal",
                "Predicción de producción con IA",
              ],
              tips: [
                "Ordeño 2-3 veces al día",
                "Vaca lechera produce 20-40L/día",
                "Calidad afecta precio de venta",
              ],
              example:
                "Vaca lechera produce 35L/día → Análisis: 4.2% grasa → Precio premium",
              actions: [
                "Iniciar Ordeño",
                "Analizar Calidad",
                "Calcular Ingresos",
              ],
            },
          },
        },
        decisions: {
          title: "🎯 Tomando Decisiones",
          subtitle: "Estrategias y acciones para maximizar rendimiento",
          steps: {
            emergency: {
              title: "Decisiones de Emergencia",
              description: "Actúa rápido ante situaciones críticas",
              details: [
                "Agua <30%: Riego inmediato obligatorio",
                "Salud <40%: Evalúa todas las causas",
                "Plagas >70%: Control urgente necesario",
                "Temperatura >35°C: Protección térmica",
                "Cartas ROJAS = acción inmediata",
              ],
              tips: [
                "Las emergencias cuestan más tarde",
                "Prevenir es 3x más barato",
                "Prioriza cultivos más valiosos",
              ],
              example:
                "Tomate 25% agua + salud 35% = riego + análisis nutrientes urgente",
              actions: [
                "Riego Urgente",
                "Control Plagas",
                "Protección Térmica",
              ],
            },
            optimization: {
              title: "Optimización Avanzada",
              description: "Maximiza rendimientos y ganancias",
              details: [
                "Sincroniza cosechas para flujo de caja",
                "Usa riego automático para eficiencia",
                "Especialízate en cultivos rentables",
                "Interpreta datos NASA para timing",
                "Cartas VERDES = oportunidades",
              ],
              tips: [
                "Tomate: $220/ton pero difícil",
                "Trigo: $150/ton pero estable",
                "Soja: $200/ton + fija nitrógeno",
              ],
              example: "Planta tomate cuando temperatura <25°C y humedad >60%",
              actions: ["Planificar", "Automatizar", "Optimizar"],
            },
          },
        },
      },
    },
  },
  en: {
    // LoadingBar Component
    loading: {
      title: "Initializing Agricultural System",
      message: "Connecting to global monitoring systems...",
    },

    // Globe Component (Main Header)
    header: {
      subtitle: "Global Smart Agriculture System",
    },

    locationPanel: {
      title: "Your Location",
      status: "GPS Active",
      city: "City",
      country: "Country",
      coords: "GPS Coordinates",
      detected: "Detected",
      genericCity: "Detected Location",
      genericCountry: "Detected",
    },

    slogan: ["Play,", "learn", "and", "transform", "the", "planet"],

    // Modules (Cards)
    modules: {
      cultivos: {
        title: "Crops",
        description: "Seeding management",
      },
      ganaderia: {
        title: "Livestock",
        description: "Animal monitoring",
      },
      investigacion: {
        title: "Research",
        description: "Agricultural laboratory",
      },
      minijuegos: {
        title: "Predictive AI",
        description: "Smart Forecasts",
      },
      explore: "🤖Explore🚀",
    },

    // Stats Panel
    stats: {
      title: "Real-Time Data",
      areas: "Monitored areas:",
      crops: "Active crops:",
      efficiency: "Water efficiency:",
    },

    // CTA Button
    cta: "Start NASA Challenge 2025",

    // ========== NEW TRANSLATIONS FOR GameLayout ==========

    // Main Header
    gameHeader: {
      title: "SPACEFARM NASA",
      nasaStatus: "NASA APIs: Active",
      sensors: "MODIS • SMAP",
    },

    // Game Modes (Footer)
    gameModes: {
      cultivar: {
        title: "NASA Crops",
        description: "AI-powered smart farming",
      },
      cuidar: {
        title: "Animal World",
        description: "Animal welfare and health",
      },
      investigar: {
        title: "Satellite Research",
        description: "Analysis and experimentation",
      },
      ia: {
        title: "Predictive AI",
        description: "Smart forecasting",
      },
    },

    // Tutorial - Welcome
    tutorial: {
      welcome: {
        title: "NASA Agricultural Simulator",
        subtitle: "Full Interactive Tutorial",
        description:
          "Learn to manage crops and livestock using real satellite data. Master precision farming, animal care, and intelligent decision-making to maximize your productivity.",
        startButton: "🎮 Start Interactive Tutorial",
        features: {
          nasaData: {
            title: "NASA MODIS/SMAP Data",
            description: "Real-time satellite information",
          },
          crops: {
            title: "5 Different Crops",
            description: "Unique traits for each crop",
          },
          livestock: {
            title: "Smart Livestock",
            description: "Comprehensive herd management",
          },
          ai: {
            title: "Predictive AI",
            description: "Intelligent decisions",
          },
        },
      },

      // Tutorial Header
      header: {
        title: "Interactive Tutorial",
        subtitle: "Master smart farming and livestock care",
        backButton: "← Home",
      },

      // Rotating Tips
      tips: [
        "🌱 Each crop has specific water and nutrient needs",
        "📡 NASA data updates in real time every 5 seconds",
        "💰 Manual irrigation is free; automatic costs $5 but is more efficient",
        "🐄 Drag food over animals to feed them automatically",
        "🩺 IoT sensors detect diseases before visible symptoms appear",
        "🎯 Red cards require immediate action to avoid losses",
      ],

      // Section Tabs
      sections: {
        understanding: "📊 Values",
        gameplay: "🎮 Play",
        livestock: "🐄 Livestock",
        decisions: "🎯 Decisions",
      },

      // Tutorial Footer
      footer: {
        section: "Section:",
        cards: "Cards:",
        active: "Active:",
      },

      // Tutorial Sections
      data: {
        understanding: {
          title: "📊 Understanding the Values",
          subtitle: "Learn to interpret agricultural indicators",
          steps: {
            ndvi: {
              title: "NDVI - Vegetation Index",
              description:
                "Measures plant health and vigor using NASA satellite data",
              details: [
                "Range: 0.200 - 0.900 (normal values)",
                "Green (>0.7): Excellent plant health",
                "Yellow (0.5-0.7): Moderate health",
                "Red (<0.5): Critical stress",
                "Each crop has its own optimal NDVI range",
              ],
              tips: [
                "Corn optimal: 0.650 NDVI",
                "Wheat optimal: 0.580 NDVI",
                "Tomato optimal: 0.720 NDVI",
              ],
              example:
                "If your corn shows NDVI 0.620 vs 0.650 optimal, it needs nutrients",
            },
            water: {
              title: "Water Level",
              description: "Percentage of moisture available for the crop",
              details: [
                "0-30%: Critical - urgent irrigation",
                "30-60%: Low - schedule watering",
                "60-80%: Optimal - keep monitoring",
                "80-100%: Excellent - no action required",
                "Each crop has different water needs",
              ],
              tips: [
                "Tomatoes need 90% water",
                "Wheat is more resistant (50%)",
                "Potatoes need constant moisture",
              ],
              example: "Tomato with 40% water = severe water stress",
            },
            health: {
              title: "Crop Health",
              description: "Overall plant condition (0-100%)",
              details: [
                "80-100%: Excellent condition",
                "60-80%: Good health",
                "40-60%: Needs attention",
                "0-40%: Critical state",
                "Affected by water, pests, and nutrients",
              ],
              tips: [
                "Low health reduces yield",
                "Monitor daily changes",
                "Act before it drops below 40%",
              ],
              example: "Health 30% = significant harvest losses",
            },
          },
        },

        gameplay: {
          title: "🎮 How to Play",
          subtitle: "Interactions and simulator mechanics",
          steps: {
            selection: {
              title: "Plot Selection",
              description: "Choose crops and manage 12 available plots",
              details: [
                "Click on a crop to select it",
                "Click on an empty plot to plant",
                "Cost: $50 per planted plot",
                "Each crop has different growth time",
                "Monitor multiple plots simultaneously",
              ],
              tips: [
                "Diversify crops to reduce risk",
                "Plant based on season and resources",
                "Yellow plots need attention",
              ],
              example:
                "Select tomato → Click on plot → Pay $50 → Plant immediately",
              actions: ["Select", "Plant", "Monitor"],
            },
            watering: {
              title: "Irrigation System",
              description: "Two options: free manual or smart automatic",
              details: [
                "Manual watering: Free, +10 water, instant",
                "Automatic watering: $5, +25 water, 10 seconds",
                "Blue button appears when needed",
                "IoT system optimizes irrigation",
                "Prevents critical water stress",
              ],
              tips: [
                "Manual = direct control",
                "Automatic = efficiency",
                "Use manual when funds are low",
              ],
              example:
                "Corn 30% water → Blue button active → Choose manual or automatic",
              actions: ["Manual Watering", "Automatic Watering", "Schedule"],
            },
          },
        },

        livestock: {
          title: "🐄 Smart Livestock",
          subtitle: "Livestock management and care through technology",
          steps: {
            healthMonitoring: {
              title: "Health Monitoring",
              description: "IoT system for continuous animal health tracking",
              details: [
                "Real-time body temperature sensors",
                "Activity and movement tracking",
                "Early disease detection",
                "Automatic abnormal behavior alerts",
                "Digital medical history per animal",
              ],
              tips: [
                "Normal temperature: 38.5–39°C",
                "Low activity may indicate illness",
                "Check alerts every 2 hours",
              ],
              example:
                "Cow #12 temperature 40.1°C → Fever alert → Call veterinarian",
              actions: ["Check Vitals", "View History", "Generate Report"],
            },

            feedingSystem: {
              title: "Feeding System",
              description: "Drag and drop feed based on nutritional needs",
              details: [
                "Drag & Drop: Hay, feed, or supplements",
                "Automatic ration calculation by weight/age",
                "Types: Forage, concentrate, minerals",
                "Scheduled feeding times",
                "Weight and growth control",
              ],
              tips: [
                "Adult cows: 2–3% body weight in food",
                "Calves: Feed every 6–8 hours",
                "Adjust diet by season",
              ],
              example:
                "Drag 🌾 over young cow → System calculates 15kg → Animal satisfied",
              actions: ["Drag Hay", "Drag Feed", "Schedule Feeding"],
            },

            waterManagement: {
              title: "Water Management",
              description: "Automated hydration and stress detection system",
              details: [
                "Automatic waterers with sensors",
                "Detects water stress via behavior",
                "Monitors water quality (pH, temperature)",
                "Daily intake recorded per animal",
                "Early dehydration alerts",
              ],
              tips: [
                "Adult cow needs 30–50L/day",
                "Warm water in winter improves intake",
                "Clean troughs weekly",
              ],
              example:
                "Sensor detects 8 hours without drinking → Water stress alert → Check trough",
              actions: ["Check Intake", "Refill Tank", "Analyze Quality"],
            },

            veterinaryCare: {
              title: "Veterinary Care",
              description: "Diagnosis and treatment system for animals",
              details: [
                "Drag & Drop sick animals to the clinic",
                "Automatic diagnosis by symptoms",
                "Treatments: Medication, surgery",
                "Recovery time varies by illness",
                "Treatment cost based on severity",
              ],
              tips: [
                "Prevention is cheaper than cure",
                "Isolate sick animals",
                "Annual vaccination required",
              ],
              example:
                "Cow limping → Drag to clinic → Diagnosis: Mastitis → Treatment $150",
              actions: [
                "Send to Clinic",
                "Apply Treatment",
                "Schedule Checkup",
              ],
            },

            breedingManagement: {
              title: "Breeding Management",
              description: "Control of mating and births",
              details: [
                "Estrus cycle monitored by sensors",
                "Artificial insemination scheduling",
                "Pregnancy tracking via ultrasound",
                "Birth preparation alerts",
                "Genetic registry and improvement tracking",
              ],
              tips: [
                "Gestation: 280–285 days",
                "First insemination: 15–18 months",
                "Separate aggressive bulls",
              ],
              example:
                "Cow in heat → Schedule insemination → 9 months later → Healthy calf born",
              actions: ["Detect Heat", "Inseminate", "Monitor Pregnancy"],
            },

            productionTracking: {
              title: "Production Tracking",
              description: "Monitoring of milk, meat, and other outputs",
              details: [
                "Automated milking with per-cow tracking",
                "Milk quality analysis (fat, protein)",
                "Weight tracking for slaughter readiness",
                "Economic yield per animal",
                "AI-based production prediction",
              ],
              tips: [
                "Milk 2–3 times per day",
                "Dairy cow yields 20–40L/day",
                "Quality affects sale price",
              ],
              example:
                "Dairy cow produces 35L/day → Analysis: 4.2% fat → Premium price",
              actions: ["Start Milking", "Analyze Quality", "Calculate Income"],
            },
          },
        },

        decisions: {
          title: "🎯 Making Decisions",
          subtitle: "Strategies and actions to maximize yield",
          steps: {
            emergency: {
              title: "Emergency Decisions",
              description: "Act quickly in critical situations",
              details: [
                "Water <30%: Immediate irrigation required",
                "Health <40%: Check all causes",
                "Pests >70%: Urgent control needed",
                "Temperature >35°C: Thermal protection",
                "RED cards = immediate action",
              ],
              tips: [
                "Emergencies cost more later",
                "Prevention is 3x cheaper",
                "Prioritize high-value crops",
              ],
              example:
                "Tomato 25% water + 35% health = irrigation + urgent nutrient analysis",
              actions: [
                "Urgent Irrigation",
                "Pest Control",
                "Thermal Protection",
              ],
            },
            optimization: {
              title: "Advanced Optimization",
              description: "Maximize yields and profits",
              details: [
                "Sync harvests for steady cash flow",
                "Use automatic irrigation for efficiency",
                "Focus on profitable crops",
                "Use NASA data for timing decisions",
                "GREEN cards = opportunities",
              ],
              tips: [
                "Tomato: $220/ton but demanding",
                "Wheat: $150/ton but stable",
                "Soy: $200/ton + fixes nitrogen",
              ],
              example:
                "Plant tomatoes when temperature <25°C and humidity >60%",
              actions: ["Plan", "Automate", "Optimize"],
            },
          },
        },
      },
    },
  },
};

export type Language = keyof typeof translations;
