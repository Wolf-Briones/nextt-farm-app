// translations.ts

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
        title: "Minijuegos",
        description: "Desafíos espaciales",
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
  },
  en: {
    // Componente LoadingBar
    loading: {
      title: "Initializing Agricultural System",
      message: "Connecting to global monitoring systems...",
    },
    // Componente Globe (Texto principal)
    header: {
      subtitle: "Global Intelligent Agriculture System",
    },
    locationPanel: {
      title: "Your Location",
      status: "GPS Active",
      city: "City",
      country: "Country",
      coords: "GPS Coordinates",
      detected: "Detected",
      genericCity: "Location detected",
      genericCountry: "Detected",
    },
    slogan: ["Play,", "learn", "and", "transform", "the", "planet"],
    // Módulos (Cards)
    modules: {
      cultivos: {
        title: "Crops",
        description: "Sowing management",
      },
      ganaderia: {
        title: "Livestock",
        description: "Cattle monitoring",
      },
      investigacion: {
        title: "Research",
        description: "Agricultural laboratory",
      },
      minijuegos: {
        title: "Minigames",
        description: "Spatial challenges",
      },
      explore: "🤖Explore🚀",
    },
    // Panel de Estadísticas
    stats: {
      title: "Real-Time Data",
      areas: "Monitored areas:",
      crops: "Active crops:",
      efficiency: "Water efficiency:",
    },
    // Botón CTA
    cta: "Start NASA 2025 Challenge",
  },
};

export type Language = keyof typeof translations;