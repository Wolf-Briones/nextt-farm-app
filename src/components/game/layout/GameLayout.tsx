"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Game functionality types
type GameMode = 'cultivate' | 'care' | 'research' | 'ai';
type SectionKey = 'understanding' | 'gameplay' | 'livestock' | 'decisions';

// Tutorial step types
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

// Tutorial data organized by sections
const TUTORIAL_DATA = {
  understanding: {
    title: "📊 Understanding Values",
    subtitle: "Learn to interpret agricultural indicators",
    color: "from-blue-600 to-cyan-500",
    steps: [
      {
        id: "ndvi",
        title: "NDVI - Vegetation Index",
        description: "Measures plant health and vigor using NASA satellite data",
        icon: "🌿",
        details: [
          "Range: 0.200 - 0.900 (normal values)",
          "Green (>0.7): Excellent plant health",
          "Yellow (0.5-0.7): Moderate health",
          "Red (<0.5): Critical plant stress",
          "Each crop has its specific optimal NDVI"
        ],
        tips: [
          "Corn optimal: 0.650 NDVI",
          "Wheat optimal: 0.580 NDVI",
          "Tomato optimal: 0.720 NDVI"
        ],
        example: "If your corn shows NDVI 0.620 vs optimal 0.650, it needs nutrients"
      },
      {
        id: "water",
        title: "Water Level",
        description: "Percentage of moisture available for the crop",
        icon: "💧",
        details: [
          "0-30%: Critical - Urgent irrigation",
          "30-60%: Low - Schedule irrigation",
          "60-80%: Optimal - Monitor",
          "80-100%: Excellent - No action needed",
          "Each crop has different water needs"
        ],
        tips: [
          "Tomato needs 90% water",
          "Wheat is more resistant (50%)",
          "Potato requires constant moisture"
        ],
        example: "Tomato with 40% water = severe water stress"
      },
      {
        id: "health",
        title: "Crop Health",
        description: "Overall plant condition (0-100%)",
        icon: "❤️",
        details: [
          "80-100%: Excellent condition",
          "60-80%: Good health",
          "40-60%: Attention required",
          "0-40%: Critical state",
          "Affected by water, pests and nutrients"
        ],
        tips: [
          "Low health reduces yield",
          "Monitor daily changes",
          "Act before reaching 40%"
        ],
        example: "Health 30% = significant harvest losses"
      }
    ]
  },
  gameplay: {
    title: "🎮 How to Play",
    subtitle: "Interactions and simulator mechanics",
    color: "from-green-600 to-emerald-500",
    steps: [
      {
        id: "selection",
        title: "Plot Selection",
        description: "Choose crops and manage 12 available plots",
        icon: "🗺️",
        details: [
          "Click on crop to select",
          "Click on free plot to plant",
          "Cost: $50 per planted plot",
          "Each crop has different timing",
          "Monitor multiple plots simultaneously"
        ],
        tips: [
          "Diversify crops to reduce risk",
          "Plant according to season and resources",
          "Yellow plots need attention"
        ],
        example: "Select tomato → Click plot → Pay $50 → Plant immediately",
        actions: ["Select", "Plant", "Monitor"]
      },
      {
        id: "watering",
        title: "Irrigation System",
        description: "Two options: free manual or smart automatic",
        icon: "💧",
        details: [
          "Manual Irrigation: Free, +10 water, immediate",
          "Automatic Irrigation: $5, +25 water, 10 seconds",
          "Blue button appears when needed",
          "IoT system optimizes application",
          "Prevents critical water stress"
        ],
        tips: [
          "Manual for direct control",
          "Automatic for efficiency",
          "Use manual if low on money"
        ],
        example: "Corn 30% water → Blue button active → Choose manual or automatic",
        actions: ["Manual Irrigation", "Auto Irrigation", "Schedule"]
      }
    ]
  },
  livestock: {
    title: "🐄 Smart Livestock",
    subtitle: "Cattle management and care with technology",
    color: "from-orange-600 to-amber-500",
    steps: [
      {
        id: "health-monitoring",
        title: "Health Monitoring",
        description: "IoT system for continuous livestock surveillance",
        icon: "🩺",
        details: [
          "Real-time body temperature sensors",
          "Activity and movement monitoring",
          "Early disease detection",
          "Automatic anomaly behavior alerts",
          "Digital medical history per animal"
        ],
        tips: [
          "Normal temperature: 38.5-39°C",
          "Low activity may indicate illness",
          "Check alerts every 2 hours"
        ],
        example: "Cow #12 temperature 40.1°C → Fever alert → Call veterinarian",
        actions: ["Check Vitals", "View History", "Generate Report"]
      },
      {
        id: "feeding-system",
        title: "Feeding System",
        description: "Drag and drop feed according to nutritional needs",
        icon: "🌾",
        details: [
          "Drag & Drop: Drag hay, feed or supplements",
          "Automatic ration calculation by weight/age",
          "Different types: Forage, concentrate, minerals",
          "Scheduled feeding times",
          "Weight and growth control"
        ],
        tips: [
          "Adult cows: 2-3% body weight in feed",
          "Calves: Feed every 6-8 hours",
          "Vary diet according to season"
        ],
        example: "Drag 🌾 over young cow → System calculates 15kg → Satisfied animal",
        actions: ["Drag Hay", "Drag Feed", "Schedule Times"]
      },
      {
        id: "water-management",
        title: "Water Management",
        description: "Automated hydration and stress detection system",
        icon: "💧",
        details: [
          "Automatic drinkers with sensors",
          "Water stress detection by behavior",
          "Monitored water quality (pH, temperature)",
          "Daily consumption per animal recorded",
          "Early dehydration alerts"
        ],
        tips: [
          "Adult cow needs 30-50L/day",
          "Warm water in winter improves consumption",
          "Clean drinkers weekly"
        ],
        example: "Sensor detects 8 hours without drinking → Water stress alert → Check drinker",
        actions: ["Check Consumption", "Fill Tank", "Analyze Quality"]
      },
      {
        id: "veterinary-care",
        title: "Veterinary Care",
        description: "Veterinary diagnosis and treatment system",
        icon: "🏥",
        details: [
          "Drag & Drop sick animals to clinic",
          "Automatic diagnosis by symptoms",
          "Available treatments: Medication, surgery",
          "Variable recovery time per disease",
          "Treatment cost according to severity"
        ],
        tips: [
          "Prevention is cheaper than cure",
          "Isolate sick animals from herd",
          "Annual vaccination mandatory"
        ],
        example: "Cow limping → Drag to clinic → Diagnosis: Mastitis → Treatment $150",
        actions: ["Take to Clinic", "Apply Treatment", "Schedule Checkup"]
      },
      {
        id: "breeding-management",
        title: "Reproductive Management",
        description: "Mating and birth control",
        icon: "👶",
        details: [
          "Estrous cycle monitored by sensors",
          "Artificial insemination scheduling",
          "Gestation tracking with ultrasound",
          "Delivery preparation with alerts",
          "Genealogical record and genetic improvement"
        ],
        tips: [
          "Bovine gestation: 280-285 days",
          "First insemination: 15-18 months",
          "Separate aggressive bulls from herd"
        ],
        example: "Cow in heat → Schedule insemination → 9 months → Healthy calf born",
        actions: ["Detect Heat", "Inseminate", "Monitor Gestation"]
      },
      {
        id: "production-tracking",
        title: "Production Tracking",
        description: "Monitoring milk, meat and other products",
        icon: "🥛",
        details: [
          "Automated milking with per-cow recording",
          "Milk quality analysis (fat, protein)",
          "Cattle weight for slaughter",
          "Economic yield per animal",
          "AI production prediction"
        ],
        tips: [
          "Milking 2-3 times daily",
          "Dairy cow produces 20-40L/day",
          "Quality affects sale price"
        ],
        example: "Dairy cow produces 35L/day → Analysis: 4.2% fat → Premium price",
        actions: ["Start Milking", "Analyze Quality", "Calculate Income"]
      }
    ]
  },
  decisions: {
    title: "🎯 Making Decisions",
    subtitle: "Strategies and actions to maximize yield",
    color: "from-purple-600 to-pink-500",
    steps: [
      {
        id: "emergency",
        title: "Emergency Decisions",
        description: "Act fast in critical situations",
        icon: "🚨",
        details: [
          "Water <30%: Immediate irrigation required",
          "Health <40%: Evaluate all causes",
          "Pests >70%: Urgent control needed",
          "Temperature >35°C: Thermal protection",
          "RED cards = immediate action"
        ],
        tips: [
          "Emergencies cost more later",
          "Prevention is 3x cheaper",
          "Prioritize most valuable crops"
        ],
        example: "Tomato 25% water + health 35% = urgent irrigation + nutrient analysis",
        actions: ["Urgent Irrigation", "Pest Control", "Thermal Protection"]
      },
      {
        id: "optimization",
        title: "Advanced Optimization",
        description: "Maximize yields and profits",
        icon: "⚡",
        details: [
          "Synchronize harvests for cash flow",
          "Use automatic irrigation for efficiency",
          "Specialize in profitable crops",
          "Interpret NASA data for timing",
          "GREEN cards = opportunities"
        ],
        tips: [
          "Tomato: $220/ton but difficult",
          "Wheat: $150/ton but stable",
          "Soybean: $200/ton + fixes nitrogen"
        ],
        example: "Plant tomato when temperature <25°C and humidity >60%",
        actions: ["Plan", "Automate", "Optimize"]
      }
    ]
  }
};

// Enhanced individual card component
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
              <h5 className="text-cyan-400 font-semibold mb-2 text-sm">📋 Details:</h5>
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
                <h5 className="text-blue-400 font-semibold text-sm mb-2">💡 Tips:</h5>
                {step.tips.map((tip, index) => (
                  <div key={index} className="text-blue-300 text-xs mb-1">• {tip}</div>
                ))}
              </div>
            )}

            {/* Example */}
            {step.example && (
              <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                <h5 className="text-green-400 font-semibold text-sm mb-2">🎯 Example:</h5>
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
        className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl blur-sm pointer-events-none"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      />
    )}
  </motion.div>
);

// Cards grid component
const CardsGrid = ({ data, activeStep, onStepChange }: {
  data: typeof TUTORIAL_DATA.understanding;
  activeStep: string | null;
  onStepChange: (stepId: string | null) => void;
}) => (
  <div className="h-full">
    {/* Section header */}
    <div className="text-center mb-8">
      <motion.div
        className={`inline-block p-4 rounded-xl bg-gradient-to-r ${data.color} mb-4`}
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-2xl font-bold text-white">{data.title}</h3>
      </motion.div>
      <p className="text-gray-400 text-lg">{data.subtitle}</p>
    </div>

    {/* Cards grid */}
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

// StepsGame component
function StepsGame() {
  const [activeSection, setActiveSection] = useState<SectionKey>('understanding');
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  const handleSectionChange = (section: SectionKey) => {
    setActiveSection(section);
    setActiveStep(null);
  };

  // Enhanced rotating tips
  const rotatingTips = [
    "🌱 Each crop has specific water and nutrient needs",
    "📡 NASA data updates in real-time every 5 seconds",
    "💰 Manual irrigation is free, automatic costs $5 but is more efficient",
    "🐄 Drag feed over animals to automatically feed them",
    "🩺 IoT sensors detect diseases before visible symptoms",
    "🎯 Red cards require immediate action to prevent losses"
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
            NASA Agricultural Simulator
          </h1>
          <h2 className="text-xl text-cyan-400 mb-6">
            Complete Interactive Tutorial
          </h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Learn to manage crops and livestock using real satellite data.
            Master precision agriculture, animal care and intelligent decision-making
            to maximize your production.
          </p>

          {/* Features showcase */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-blue-400 font-semibold">NASA MODIS/SMAP Data</div>
              <div className="text-gray-400 text-sm">Real-time satellite information</div>
            </div>
            <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
              <div className="text-2xl mb-2">🌱</div>
              <div className="text-green-400 font-semibold">5 Different Crops</div>
              <div className="text-gray-400 text-sm">Unique characteristics per crop</div>
            </div>
            <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30">
              <div className="text-2xl mb-2">🐄</div>
              <div className="text-orange-400 font-semibold">Smart Livestock</div>
              <div className="text-gray-400 text-sm">Comprehensive cattle management</div>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-purple-400 font-semibold">Predictive AI</div>
              <div className="text-gray-400 text-sm">Smart decisions</div>
            </div>
          </div>

          <motion.button
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWelcome(false)}
          >
            🎮 Start Interactive Tutorial
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Enhanced header */}
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
              <h2 className="text-2xl font-bold text-white">Interactive Tutorial</h2>
              <p className="text-gray-400">Master smart agriculture and livestock</p>
            </div>
          </div>

          {/* Enhanced rotating tip */}
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
            ← Home
          </motion.button>
        </div>
      </div>

      {/* Enhanced tab navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex space-x-2">
          {[
            { key: 'understanding', label: '📊 Values', color: 'from-blue-600 to-cyan-500' },
            { key: 'gameplay', label: '🎮 Play', color: 'from-green-600 to-emerald-500' },
            { key: 'livestock', label: '🐄 Livestock', color: 'from-orange-600 to-amber-500' },
            { key: 'decisions', label: '🎯 Decisions', color: 'from-purple-600 to-pink-500' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeSection === tab.key
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionChange(tab.key as SectionKey)}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main content */}
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

      {/* Footer with statistics */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="text-gray-400">
              Section: <span className="text-white font-semibold">{TUTORIAL_DATA[activeSection].title}</span>
            </div>
            <div className="text-gray-400">
              Cards: <span className="text-cyan-400 font-semibold">{TUTORIAL_DATA[activeSection].steps.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-400">
              Active: <span className="text-white font-semibold">
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

// Main component
export default function GameLayout() {
  const [selectedMode, setSelectedMode] = useState<GameMode>('cultivate');

  const modes = [
    { id: 'cultivate' as GameMode, icon: '🌿🛰️', title: 'NASA Crops', color: 'border-green-500', desc: 'Smart agriculture with AI' },
    { id: 'care' as GameMode, icon: '🐄', title: 'Animal World', color: 'border-orange-500', desc: 'Animal welfare and health' },
    { id: 'research' as GameMode, icon: '🔬', title: 'Satellite Research', color: 'border-purple-500', desc: 'Analysis and experimentation' },
    { id: 'ai' as GameMode, icon: '🤖', title: 'Predictive AI', color: 'border-cyan-500', desc: 'Smart forecasts' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pb-32">
      {/* Minimalist header */}
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

      {/* Main area with StepsGame */}
      <div className="h-[calc(100vh-200px)]">
        <StepsGame />
      </div>

      {/* Enhanced footer with 4 buttons */}
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
            onClick={() => setSelectedMode(mode.id)}
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

            {/* Enhanced active indicator */}
            {(mode.id === 'cultivate' || mode.id === 'care') && selectedMode === mode.id && (
              <motion.div
                className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-gray-900 ${mode.id === 'cultivate' ? 'bg-green-500' : 'bg-orange-500'
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