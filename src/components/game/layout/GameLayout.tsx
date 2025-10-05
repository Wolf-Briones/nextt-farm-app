"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Tipos de funcionalidades del juego
type GameMode = 'cultivar' | 'cuidar' | 'investigar' | 'ia';
type SectionKey = 'understanding' | 'gameplay' | 'livestock' | 'decisions';


// Tipos para los pasos del tutorial
type TutorialStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
  tips?: string[];
  example?: string;
  actions?: string[];
};

// Datos del tutorial organizados por secciones
const TUTORIAL_DATA = {
  understanding: {
    title: "📊 Entendiendo los Valores",
    subtitle: "Aprende a interpretar los indicadores agrícolas",
    color: "from-blue-600 to-cyan-500",
    steps: [
      {
        id: "ndvi",
        title: "NDVI - Índice de Vegetación",
        description: "Mide la salud y vigor de las plantas usando datos satelitales NASA",
        icon: "🌿",
        details: [
          "Rango: 0.200 - 0.900 (valores normales)",
          "Verde (>0.7): Excelente salud vegetal",
          "Amarillo (0.5-0.7): Salud moderada",
          "Rojo (<0.5): Estrés vegetal crítico",
          "Cada cultivo tiene su NDVI óptimo específico"
        ],
        tips: [
          "Maíz óptimo: 0.650 NDVI",
          "Trigo óptimo: 0.580 NDVI",
          "Tomate óptimo: 0.720 NDVI"
        ],
        example: "Si tu maíz muestra NDVI 0.620 vs óptimo 0.650, necesita nutrientes"
      },
      {
        id: "water",
        title: "Nivel de Agua",
        description: "Porcentaje de humedad disponible para el cultivo",
        icon: "💧",
        details: [
          "0-30%: Crítico - Riego urgente",
          "30-60%: Bajo - Programar riego",
          "60-80%: Óptimo - Monitorear",
          "80-100%: Excelente - Sin acción",
          "Cada cultivo tiene necesidades hídricas diferentes"
        ],
        tips: [
          "Tomate necesita 90% de agua",
          "Trigo es más resistente (50%)",
          "Papa requiere humedad constante"
        ],
        example: "Tomate con 40% agua = estrés hídrico severo"
      },
      {
        id: "health",
        title: "Salud del Cultivo",
        description: "Estado general de la planta (0-100%)",
        icon: "❤️",
        details: [
          "80-100%: Excelente estado",
          "60-80%: Buena salud",
          "40-60%: Atención requerida",
          "0-40%: Estado crítico",
          "Afectado por agua, plagas y nutrientes"
        ],
        tips: [
          "Baja salud reduce el rendimiento",
          "Monitorea cambios diarios",
          "Actúa antes del 40%"
        ],
        example: "Salud 30% = pérdidas significativas en cosecha"
      }
    ]
  },
  gameplay: {
    title: "🎮 Cómo Jugar",
    subtitle: "Interacciones y mecánicas del simulador",
    color: "from-green-600 to-emerald-500",
    steps: [
      {
        id: "selection",
        title: "Selección de Parcelas",
        description: "Elige cultivos y administra 12 parcelas disponibles",
        icon: "🗺️",
        details: [
          "Haz clic en cultivo para seleccionar",
          "Clic en parcela libre para plantar",
          "Costo: $50 por parcela plantada",
          "Cada cultivo tiene tiempo diferente",
          "Monitorea múltiples parcelas simultáneamente"
        ],
        tips: [
          "Diversifica cultivos para reducir riesgo",
          "Planta según estación y recursos",
          "Parcelas amarillas necesitan atención"
        ],
        example: "Selecciona tomate → Clic parcela → Paga $50 → Planta inmediatamente",
        actions: ["Seleccionar", "Plantar", "Monitorear"]
      },
      {
        id: "watering",
        title: "Sistema de Riego",
        description: "Dos opciones: manual gratuito o automático inteligente",
        icon: "💧",
        details: [
          "Riego Manual: Gratuito, +10 agua, inmediato",
          "Riego Automático: $5, +25 agua, 10 segundos",
          "Botón azul aparece cuando se necesita",
          "Sistema IoT optimiza aplicación",
          "Previene estrés hídrico crítico"
        ],
        tips: [
          "Manual para control directo",
          "Automático para eficiencia",
          "Usa manual si tienes poco dinero"
        ],
        example: "Maíz 30% agua → Botón azul activo → Elige manual o automático",
        actions: ["Riego Manual", "Riego Automático", "Programar"]
      }
    ]
  },
  livestock: {
    title: "🐄 Ganadería Inteligente",
    subtitle: "Manejo y cuidado del ganado con tecnología",
    color: "from-orange-600 to-amber-500",
    steps: [
      {
        id: "health-monitoring",
        title: "Monitoreo de Salud",
        description: "Sistema IoT para vigilancia continua del ganado",
        icon: "🩺",
        details: [
          "Sensores de temperatura corporal en tiempo real",
          "Monitoreo de actividad y movimiento",
          "Detección temprana de enfermedades",
          "Alertas automáticas de comportamiento anómalo",
          "Historial médico digital por animal"
        ],
        tips: [
          "Temperatura normal: 38.5-39°C",
          "Actividad baja puede indicar enfermedad",
          "Revisa alertas cada 2 horas"
        ],
        example: "Vaca #12 temperatura 40.1°C → Alerta fiebre → Llamar veterinario",
        actions: ["Revisar Vitales", "Ver Historial", "Generar Reporte"]
      },
      {
        id: "feeding-system",
        title: "Sistema de Alimentación",
        description: "Arrastra y suelta alimento según necesidades nutricionales",
        icon: "🌾",
        details: [
          "Drag & Drop: Arrastra heno, pienso o suplementos",
          "Cálculo automático de raciones por peso/edad",
          "Diferentes tipos: Forraje, concentrado, minerales",
          "Horarios programados de alimentación",
          "Control de peso y crecimiento"
        ],
        tips: [
          "Vacas adultas: 2-3% peso corporal en alimento",
          "Terneros: Alimentar cada 6-8 horas",
          "Varía dieta según época del año"
        ],
        example: "Arrastra 🌾 sobre vaca joven → Sistema calcula 15kg → Animal satisfecho",
        actions: ["Arrastra Heno", "Arrastra Pienso", "Programar Horario"]
      },
      {
        id: "water-management",
        title: "Gestión Hídrica",
        description: "Sistema automatizado de hidratación y detección de estrés",
        icon: "💧",
        details: [
          "Bebederos automáticos con sensores",
          "Detección de estrés hídrico por comportamiento",
          "Calidad del agua monitoreada (pH, temperatura)",
          "Consumo diario por animal registrado",
          "Alertas de deshidratación temprana"
        ],
        tips: [
          "Vaca adulta necesita 30-50L/día",
          "Agua caliente en invierno mejora consumo",
          "Limpia bebederos semanalmente"
        ],
        example: "Sensor detecta 8 horas sin beber → Alerta estrés hídrico → Revisar bebedero",
        actions: ["Revisar Consumo", "Llenar Tanque", "Analizar Calidad"]
      },
      {
        id: "veterinary-care",
        title: "Atención Veterinaria",
        description: "Sistema de diagnóstico y tratamiento veterinario",
        icon: "🏥",
        details: [
          "Drag & Drop animales enfermos a la clínica",
          "Diagnóstico automático por síntomas",
          "Tratamientos disponibles: Medicamentos, cirugía",
          "Tiempo de recuperación variable por enfermedad",
          "Costo de tratamiento según gravedad"
        ],
        tips: [
          "Prevención es más barata que curar",
          "Aísla animales enfermos del rebaño",
          "Vacunación anual obligatoria"
        ],
        example: "Vaca cojea → Arrastra a clínica → Diagnóstico: Mastitis → Tratamiento $150",
        actions: ["Llevar a Clínica", "Aplicar Tratamiento", "Programar Revisión"]
      },
      {
        id: "breeding-management",
        title: "Gestión Reproductiva",
        description: "Control de apareamiento y nacimientos",
        icon: "👶",
        details: [
          "Ciclo estral monitoreado por sensores",
          "Programación de inseminación artificial",
          "Seguimiento de gestación con ultrasonido",
          "Preparación para parto con alertas",
          "Registro genealógico y mejoramiento genético"
        ],
        tips: [
          "Gestación bovina: 280-285 días",
          "Primera inseminación: 15-18 meses",
          "Separa toros agresivos del rebaño"
        ],
        example: "Vaca en celo → Programa inseminación → 9 meses → Nace ternero saludable",
        actions: ["Detectar Celo", "Inseminar", "Monitorear Gestación"]
      },
      {
        id: "production-tracking",
        title: "Seguimiento de Producción",
        description: "Monitoreo de leche, carne y otros productos",
        icon: "🥛",
        details: [
          "Ordeño automatizado con registro por vaca",
          "Análisis de calidad de leche (grasa, proteína)",
          "Peso de ganado para sacrificio",
          "Rendimiento económico por animal",
          "Predicción de producción con IA"
        ],
        tips: [
          "Ordeño 2-3 veces al día",
          "Vaca lechera produce 20-40L/día",
          "Calidad afecta precio de venta"
        ],
        example: "Vaca lechera produce 35L/día → Análisis: 4.2% grasa → Precio premium",
        actions: ["Iniciar Ordeño", "Analizar Calidad", "Calcular Ingresos"]
      }
    ]
  },
  decisions: {
    title: "🎯 Tomando Decisiones",
    subtitle: "Estrategias y acciones para maximizar rendimiento",
    color: "from-purple-600 to-pink-500",
    steps: [
      {
        id: "emergency",
        title: "Decisiones de Emergencia",
        description: "Actúa rápido ante situaciones críticas",
        icon: "🚨",
        details: [
          "Agua <30%: Riego inmediato obligatorio",
          "Salud <40%: Evalúa todas las causas",
          "Plagas >70%: Control urgente necesario",
          "Temperatura >35°C: Protección térmica",
          "Cartas ROJAS = acción inmediata"
        ],
        tips: [
          "Las emergencias cuestan más tarde",
          "Prevenir es 3x más barato",
          "Prioriza cultivos más valiosos"
        ],
        example: "Tomate 25% agua + salud 35% = riego + análisis nutrientes urgente",
        actions: ["Riego Urgente", "Control Plagas", "Protección Térmica"]
      },
      {
        id: "optimization",
        title: "Optimización Avanzada",
        description: "Maximiza rendimientos y ganancias",
        icon: "⚡",
        details: [
          "Sincroniza cosechas para flujo de caja",
          "Usa riego automático para eficiencia",
          "Especialízate en cultivos rentables",
          "Interpreta datos NASA para timing",
          "Cartas VERDES = oportunidades"
        ],
        tips: [
          "Tomate: $220/ton pero difícil",
          "Trigo: $150/ton pero estable",
          "Soja: $200/ton + fija nitrógeno"
        ],
        example: "Planta tomate cuando temperatura <25°C y humedad >60%",
        actions: ["Planificar", "Automatizar", "Optimizar"]
      }
    ]
  }
};

// Componente de tarjeta individual mejorada
const StepCard = ({ step, isActive, onClick, sectionColor }: {
  step: TutorialStep;
  isActive: boolean;
  onClick: () => void;
  sectionColor: string;
}) => (
  <motion.div
    className={`relative rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${isActive
      ? 'border-cyan-400 shadow-2xl shadow-cyan-500/20 scale-105'
      : 'border-gray-600 hover:border-gray-400 hover:scale-102'
      }`}
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    layout
  >
    {/* Header gradient */}
    <div className={`h-20 bg-gradient-to-r ${sectionColor} relative`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative flex items-center justify-center h-full">
        <motion.div
          className="text-4xl"
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {step.icon}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full" />
      <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/20 rounded-full" />
    </div>

    {/* Content */}
    <div className="p-6 bg-gray-800">
      <h4 className="font-bold text-white mb-2 text-lg">{step.title}</h4>
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{step.description}</p>

      {/* Actions buttons */}
      {step.actions && (
        <div className="flex flex-wrap gap-2 mb-4">
          {step.actions.map((action, index) => (
            <span key={index} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">
              {action}
            </span>
          ))}
        </div>
      )}

      {/* Expandable content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Details */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h5 className="text-cyan-400 font-semibold mb-2 text-sm">📋 Detalles:</h5>
              <div className="space-y-2">
                {step.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-2 text-xs text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-cyan-400 mt-1 text-xs">▶</span>
                    <span>{detail}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {step.tips && (
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                <h5 className="text-blue-400 font-semibold text-sm mb-2">💡 Consejos:</h5>
                {step.tips.map((tip, index) => (
                  <div key={index} className="text-blue-300 text-xs mb-1">• {tip}</div>
                ))}
              </div>
            )}

            {/* Example */}
            {step.example && (
              <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                <h5 className="text-green-400 font-semibold text-sm mb-2">🎯 Ejemplo:</h5>
                <div className="text-green-300 text-xs italic">{step.example}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Active indicator */}
    {isActive && (
      <motion.div
        className="absolute  border-2 border-cyan-400 pointer-events-noneabsolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl blur-sm"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      />
    )}
  </motion.div>
);

// Componente de grid de cards
const CardsGrid = ({ data, activeStep, onStepChange }: {
  data: typeof TUTORIAL_DATA.understanding;
  activeStep: string | null;
  onStepChange: (stepId: string | null) => void;
}) => (
  <div className="h-full">
    {/* Header de la sección */}
    <div className="text-center mb-8">
      <motion.div
        className={`inline-block p-4 rounded-xl bg-gradient-to-r ${data.color} mb-4`}
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-2xl font-bold text-white">{data.title}</h3>
      </motion.div>
      <p className="text-gray-400 text-lg">{data.subtitle}</p>
    </div>

    {/* Grid de cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[calc(100%-140px)] overflow-y-auto pb-8">
      {data.steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StepCard
            step={step}
            isActive={activeStep === step.id}
            onClick={() => onStepChange(activeStep === step.id ? null : step.id)}
            sectionColor={data.color}
          />
        </motion.div>
      ))}
    </div>
  </div>
);

// Componente StepsGame
function StepsGame() {
  const [activeSection, setActiveSection] = useState<SectionKey>('understanding');

  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  const handleSectionChange = (section: SectionKey) => {
    setActiveSection(section);
    setActiveStep(null);
  };

  // Tips rotativos mejorados
  const rotatingTips = [
    "🌱 Cada cultivo tiene necesidades específicas de agua y nutrientes",
    "📡 Los datos NASA se actualizan en tiempo real cada 5 segundos",
    "💰 El riego manual es gratuito, el automático cuesta $5 pero es más eficiente",
    "🐄 Arrastra alimento sobre los animales para alimentarlos automáticamente",
    "🩺 Los sensores IoT detectan enfermedades antes que síntomas visibles",
    "🎯 Las cartas rojas requieren acción inmediata para evitar pérdidas"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % rotatingTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingTips.length]);


  const handleStepChange = (stepId: string | null) => {
    setActiveStep(stepId);
  };

  if (showWelcome) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center p-8">
        <motion.div
          className="bg-gray-800 rounded-2xl p-8 max-w-3xl text-center border border-gray-700 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🚀
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Simulador Agrícola NASA
          </h1>
          <h2 className="text-xl text-cyan-400 mb-6">
            Tutorial Interactivo Completo
          </h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Aprende a gestionar cultivos y ganado usando datos satelitales reales.
            Domina la agricultura de precisión, el cuidado animal y la toma de decisiones
            inteligentes para maximizar tu producción.
          </p>

          {/* Features showcase */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-blue-400 font-semibold">Datos NASA MODIS/SMAP</div>
              <div className="text-gray-400 text-sm">Información satelital en tiempo real</div>
            </div>
            <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
              <div className="text-2xl mb-2">🌱</div>
              <div className="text-green-400 font-semibold">5 Cultivos Diferentes</div>
              <div className="text-gray-400 text-sm">Características únicas por cultivo</div>
            </div>
            <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30">
              <div className="text-2xl mb-2">🐄</div>
              <div className="text-orange-400 font-semibold">Ganadería Inteligente</div>
              <div className="text-gray-400 text-sm">Manejo integral del ganado</div>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-purple-400 font-semibold">IA Predictiva</div>
              <div className="text-gray-400 text-sm">Decisiones inteligentes</div>
            </div>
          </div>

          <motion.button
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWelcome(false)}
          >
            🎮 Comenzar Tutorial Interactivo
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎓
            </motion.span>
            <div>
              <h2 className="text-2xl font-bold text-white">Tutorial Interactivo</h2>
              <p className="text-gray-400">Domina la agricultura y ganadería inteligente</p>
            </div>
          </div>

          {/* Tip rotativo mejorado */}
          <div className="flex-1 mx-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTip}
                className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-4 text-center backdrop-blur-sm"
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-blue-400 font-semibold">
                  💡 {rotatingTips[currentTip]}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowWelcome(true)}
          >
            ← Inicio
          </motion.button>
        </div>
      </div>

      {/* Navegación por pestañas mejorada */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex space-x-2">
          {[
            { key: 'understanding', label: '📊 Valores', color: 'from-blue-600 to-cyan-500' },
            { key: 'gameplay', label: '🎮 Jugar', color: 'from-green-600 to-emerald-500' },
            { key: 'livestock', label: '🐄 Ganadería', color: 'from-orange-600 to-amber-500' },
            { key: 'decisions', label: '🎯 Decisiones', color: 'from-purple-600 to-pink-500' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeSection === tab.key
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionChange(tab.key as SectionKey)} // 👈 aquí ya no es any
            >
              {tab.label}
            </motion.button>
          ))}

        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 overflow-hidden">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <CardsGrid
            data={TUTORIAL_DATA[activeSection]}
            activeStep={activeStep}
            onStepChange={handleStepChange}
          />
        </motion.div>
      </div>

      {/* Footer con estadísticas */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="text-gray-400">
              Sección: <span className="text-white font-semibold">{TUTORIAL_DATA[activeSection].title}</span>
            </div>
            <div className="text-gray-400">
              Cards: <span className="text-cyan-400 font-semibold">{TUTORIAL_DATA[activeSection].steps.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-400">
              Activo: <span className="text-white font-semibold">
                {activeStep ?
                  TUTORIAL_DATA[activeSection].steps.findIndex(s => s.id === activeStep) + 1
                  : 0} / {TUTORIAL_DATA[activeSection].steps.length}
              </span>
            </div>
            <div className="flex gap-2">
              {TUTORIAL_DATA[activeSection].steps.map((step) => (
                <motion.div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${step.id === activeStep ? 'bg-cyan-400 scale-125' : 'bg-gray-600'
                    }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal
export default function GameLayout() {
  const [selectedMode, setSelectedMode] = useState<GameMode>('cultivar');
  const router = useRouter();

  const modes = [
    { id: 'cultivar' as GameMode, icon: '🌿🛰️', title: 'Cultivos NASA', color: 'border-green-500', desc: 'Agricultura inteligente con IA' },
    { id: 'cuidar' as GameMode, icon: '🐄', title: 'Mundo Animal', color: 'border-orange-500', desc: 'Bienestar y salud animal' },
    { id: 'investigar' as GameMode, icon: '🔬', title: 'Investigación satelital', color: 'border-purple-500', desc: 'Análisis y experimentación' },
    { id: 'ia' as GameMode, icon: '🤖', title: 'IA Predictiva', color: 'border-cyan-500', desc: 'Pronósticos inteligentes' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pb-32">
      {/* Header minimalista */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold text-white">SPACEFARM NASA</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
              <span className="text-green-400 font-semibold">NASA APIs: Active</span>
            </div>
            <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
              <span className="text-blue-400 font-semibold">MODIS • SMAP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal con StepsGame */}
      <div className="h-[calc(100vh-200px)]">
        <StepsGame />
      </div>

      {/* Footer con los 4 botones mejorado */}
      <motion.div
        className="fixed bottom-6 left-6 right-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-2xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {modes.map((mode) => (
          <motion.div
            key={mode.id}
            className={`relative rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer group ${selectedMode === mode.id
              ? `${mode.color} bg-gray-800 shadow-lg`
              : 'bg-gray-800 border-gray-700 hover:border-gray-500 hover:shadow-lg'
              }`}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (mode.id === "cultivar") {
                router.push("/game/cultivos");
              } else if (mode.id === "cuidar") {
                router.push("/game/ganaderia");
              } else if (mode.id === "investigar") {
                router.push("/game/investigar");
              }else if (mode.id === "ia") {
                router.push("/game/intelligence");
              }else {
                setSelectedMode(mode.id);
              }
            }}
          >
            <div className="flex flex-col items-center text-center">
              <motion.span
                className="text-4xl mb-3"
                animate={selectedMode === mode.id ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {mode.icon}
              </motion.span>
              <h3 className="text-white font-bold mb-2">{mode.title}</h3>
              <p className="text-gray-400 text-sm">{mode.desc}</p>

              <motion.div
                className={`h-1 w-10 mt-4 rounded-full transition-all duration-300 ${selectedMode === mode.id ? 'bg-cyan-400' : 'bg-gray-600 group-hover:bg-gray-500'
                  }`}
                animate={selectedMode === mode.id ? { width: ['0%', '100%', '80%'] } : {}}
                transition={{ duration: 1 }}
              />
            </div>

            {/* Indicador activo mejorado */}
            {(mode.id === 'cultivar' || mode.id === 'cuidar') && selectedMode === mode.id && (
              <motion.div
                className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-gray-900 ${mode.id === 'cultivar' ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}