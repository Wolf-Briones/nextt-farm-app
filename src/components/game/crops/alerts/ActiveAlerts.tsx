
"use client";

import { useState, type ElementType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Sprout, Beef, Droplets, DollarSign, ChevronDown, ChevronUp } from "lucide-react";

type AlertLevel = 'normal' | 'warning' | 'critical';
type AlertType = 'rainfall' | 'drought' | 'temperature' | 'flood' | 'general' | 'wind' | 'humidity';

export interface Alert {
  id: string;
  type: AlertType;
  level: AlertLevel;
  title: string;
  message: string;
  recommendation: string;
  icon: string;
}

export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  rainfall7d: number;
  rainfall30d: number;
  tempMax: number;
  tempMin: number;
}

export type ClimateZone = 'coast' | 'highlands' | 'jungle' | 'desert';

export interface RegionConfig {
  name: string;
  climateZone: ClimateZone;
  lat: number;
  lon: number;
  altitude: number;
  floodRisk: boolean;
  frostRisk: boolean;
  droughtProne: boolean;
}

interface SectorDecision {
  sector: string;
  icon: ElementType;
  color: string;
  bgColor: string;
  decisions: string[];
}

const AlertCard = ({ alert }: { alert: Alert }) => {
  const levelColors = {
    normal: 'border-green-500 bg-green-900/20',
    warning: 'border-yellow-500 bg-yellow-900/20',
    critical: 'border-red-500 bg-red-900/20'    
  };

  const levelIcons = {
    normal: '✅',
    warning: '⚠️',
    critical: '🚨'
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border-2 ${levelColors[alert.level]} backdrop-blur-sm`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{alert.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{levelIcons[alert.level]}</span>
            <h4 className="font-bold text-white">{alert.title}</h4>
          </div>
          <p className="text-gray-300 text-sm mb-3">{alert.message}</p>
          <div className="bg-gray-800/50 p-3 rounded border border-gray-600">
            <p className="text-cyan-400 text-sm font-medium">💡 Recomendación:</p>
            <p className="text-gray-300 text-sm mt-1">{alert.recommendation}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DecisionPanel = ({ decisions }: { decisions: SectorDecision[] }) => {
  const [expandedSectors, setExpandedSectors] = useState<string[]>([]);

  const toggleSector = (sector: string) => {
    setExpandedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
      <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
        🎯 Decisiones para {decisions[0]?.sector.includes('Costa') ? 'Zona Costera' : 
                           decisions[0]?.sector.includes('Sierra') ? 'Zona Andina' : 
                           decisions[0]?.sector.includes('Selva') ? 'Zona Selvática' : 'esta Zona'}
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {decisions.map((decision) => {
          const Icon = decision.icon;
          const isExpanded = expandedSectors.includes(decision.sector);
          
          return (
            <div key={decision.sector} className={`rounded-lg border-2 ${decision.bgColor} border-gray-600`}>
              <button
                onClick={() => toggleSector(decision.sector)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors rounded-t-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">{decision.sector}</span>
                  <span className="text-xs text-gray-400">({decision.decisions.length})</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-2 border-t border-gray-600">
                      {decision.decisions.map((dec, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className={`text-xs mt-0.5 ${decision.color}`}>▶</span>
                          <p className="text-sm text-gray-300 flex-1">{dec}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ActiveAlertsProps {
  weatherData: WeatherData;
  regionConfig: RegionConfig;
  isLoading?: boolean;
}

export default function ActiveAlerts({ weatherData, regionConfig, isLoading = false }: ActiveAlertsProps) {
  
  if (!weatherData || !regionConfig) {
    return (
      <div className="text-center py-12">
        <motion.div
          className="text-4xl mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🛰️
        </motion.div>
        <p className="text-gray-400">Cargando datos...</p>
      </div>
    );
  }

  const generateDecisionsByClimate = (): SectorDecision[] => {
    const { climateZone } = regionConfig;
    const { precipitation, humidity, rainfall7d, rainfall30d, tempMin, tempMax } = weatherData;
    const decisions: SectorDecision[] = [];

    // ===== COSTA (Lima, Piura) =====
    if (climateZone === 'coast') {
      const agricultureCoast: string[] = [];
      
      // En costa normalmente es seco
      if (precipitation < 1 && rainfall30d < 10) {
        agricultureCoast.push("Riego tecnificado obligatorio (la costa es árida)");
        agricultureCoast.push("Sembrar cultivos de bajo consumo hídrico (espárrago, algodón)");
      }
      
      if (tempMax > 28) {
        agricultureCoast.push("Regar en la tarde-noche (evitar evaporación)");
        agricultureCoast.push("Proteger cultivos sensibles al calor");
      } else if (tempMax < 18) {
        agricultureCoast.push("Clima fresco en costa - ideal para hortalizas");
      }
      
      // Lluvia en costa es ANORMAL
      if (precipitation > 5) {
        agricultureCoast.push("⚠️ Lluvia inusual - verificar drenaje urgente");
        agricultureCoast.push("Fenómeno climático atípico - monitorear El Niño");
      }
      
      if (agricultureCoast.length === 0) {
        agricultureCoast.push("Clima típico de costa - mantener riego constante");
      }

      const livestockCoast: string[] = [];
      if (tempMax > 28) {
        livestockCoast.push("Aumentar sombra para ganado");
        livestockCoast.push("Triplicar agua disponible");
      } else {
        livestockCoast.push("Temperatura adecuada para ganadería costera");
      }

      const waterCoast: string[] = [];
      if (rainfall30d < 5) {
        waterCoast.push("Depender de reservorios y pozos (no llueve en costa)");
        waterCoast.push("Optimizar uso de agua - cada gota cuenta");
      }
      if (precipitation > 10) {
        waterCoast.push("⚠️ CRÍTICO: Capturar agua de lluvia (es raro en costa)");
      }

      decisions.push(
        { sector: "Agricultura Costa", icon: Sprout, color: "text-green-400", bgColor: "bg-green-900/10", decisions: agricultureCoast },
        { sector: "Ganadería Costa", icon: Beef, color: "text-orange-400", bgColor: "bg-orange-900/10", decisions: livestockCoast },
        { sector: "Agua Costa", icon: Droplets, color: "text-blue-400", bgColor: "bg-blue-900/10", decisions: waterCoast }
      );
    }

    // ===== SIERRA (Cajamarca, Cusco, Puno, Arequipa) =====
    if (climateZone === 'highlands') {
      const agricultureHighlands: string[] = [];
      
      // Heladas son el principal riesgo
      if (tempMin < 5) {
        agricultureHighlands.push("🥶 HELADAS - Proteger papa, quinua, habas con paja");
        agricultureHighlands.push("Riego ligero al atardecer (protección térmica)");
        agricultureHighlands.push("No sembrar cultivos sensibles al frío");
      } else if (tempMin < 10) {
        agricultureHighlands.push("Riesgo de heladas - preparar coberturas");
      }
      
      // Granizo en altura
      if (tempMax < 15 && precipitation > 10 && regionConfig.altitude > 3000) {
        agricultureHighlands.push("⚠️ Condiciones para granizo - proteger cultivos");
      }
      
      // Lluvias en sierra
      if (rainfall7d > 100) {
        agricultureHighlands.push("Lluvias intensas - revisar terrazas andinas");
        agricultureHighlands.push("Limpiar canales de drenaje en laderas");
      } else if (rainfall7d < 20 && rainfall30d < 80) {
        agricultureHighlands.push("Sequía en sierra - aumentar riego");
        agricultureHighlands.push("Sembrar cultivos resistentes (cebada, tarwi)");
      }
      
      if (agricultureHighlands.length === 0) {
        agricultureHighlands.push("Clima típico de sierra - cultivar tubérculos andinos");
      }

      const livestockHighlands: string[] = [];
      if (tempMin < 5) {
        livestockHighlands.push("Refugios cerrados para alpacas/llamas");
        livestockHighlands.push("Aumentar forraje energético");
      } else {
        livestockHighlands.push("Pastoreo normal de altura");
      }

      const waterHighlands: string[] = [];
      if (rainfall7d > 80) {
        waterHighlands.push("Capturar agua de lluvia para época seca");
      } else if (rainfall30d < 50) {
        waterHighlands.push("Racionar agua - depender de manantiales");
      }

      decisions.push(
        { sector: "Agricultura Sierra", icon: Sprout, color: "text-purple-400", bgColor: "bg-purple-900/10", decisions: agricultureHighlands },
        { sector: "Ganadería Sierra", icon: Beef, color: "text-orange-400", bgColor: "bg-orange-900/10", decisions: livestockHighlands },
        { sector: "Agua Sierra", icon: Droplets, color: "text-blue-400", bgColor: "bg-blue-900/10", decisions: waterHighlands }
      );
    }

    // ===== SELVA (Iquitos, La Merced) =====
    if (climateZone === 'jungle') {
      const agricultureJungle: string[] = [];
      
      // Selva = mucha humedad y lluvia
      if (humidity > 85) {
        agricultureJungle.push("Humedad extrema - aplicar fungicidas preventivos");
        agricultureJungle.push("Espaciar plantas para ventilación");
      }
      
      if (rainfall7d > 150) {
        agricultureJungle.push("🌊 Lluvias torrenciales - riesgo de pudrición");
        agricultureJungle.push("Suspender riego artificial completamente");
      } else if (rainfall7d > 100) {
        agricultureJungle.push("Lluvia normal de selva - monitorear hongos");
      }
      
      // Sequía en selva es ANORMAL
      if (rainfall30d < 150) {
        agricultureJungle.push("⚠️ Sequía atípica en selva - fenómeno climático");
        agricultureJungle.push("Activar riego de emergencia");
      }
      
      // Temperatura constante en selva
      if (tempMax > 32) {
        agricultureJungle.push("Calor intenso - proteger cultivos tropicales");
      }
      
      if (agricultureJungle.length === 0) {
        agricultureJungle.push("Clima típico de selva - cultivar yuca, plátano, cacao");
      }

      const livestockJungle: string[] = [];
      livestockJungle.push("Prevenir enfermedades tropicales en ganado");
      if (humidity > 80) {
        livestockJungle.push("Tratamiento antiparasitario frecuente");
      }

      const waterJungle: string[] = [];
      if (rainfall7d > 150) {
        waterJungle.push("Exceso de agua - preparar drenajes");
      } else {
        waterJungle.push("Agua abundante de ríos y lluvia");
      }

      decisions.push(
        { sector: "Agricultura Selva", icon: Sprout, color: "text-green-400", bgColor: "bg-green-900/10", decisions: agricultureJungle },
        { sector: "Ganadería Selva", icon: Beef, color: "text-orange-400", bgColor: "bg-orange-900/10", decisions: livestockJungle },
        { sector: "Agua Selva", icon: Droplets, color: "text-blue-400", bgColor: "bg-blue-900/10", decisions: waterJungle }
      );
    }

    // DECISIONES ECONÓMICAS (común pero contextual)
    const economy: string[] = [];
    if (climateZone === 'coast' && tempMax > 28) {
      economy.push("Invertir en cultivos de exportación (espárrago)");
    } else if (climateZone === 'highlands' && tempMin < 5) {
      economy.push("Evaluar pérdidas por heladas");
    } else if (climateZone === 'jungle' && rainfall7d > 150) {
      economy.push("Diversificar ingresos ante lluvias");
    } else {
      economy.push("Condiciones favorables para producción");
    }

    decisions.push({
      sector: "Economía",
      icon: DollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/10",
      decisions: economy
    });

    return decisions;
  };

  const analyzeWeather = (): Alert[] => {
    const alerts: Alert[] = [];
    const { climateZone, frostRisk, altitude, floodRisk } = regionConfig;

    // ALERTAS ESPECÍFICAS POR CLIMA
    if (climateZone === 'coast') {
      // Costa: calor/frío, NO heladas normalmente
      if (weatherData.tempMax > 30) {
        alerts.push({
          id: 'coast-heat',
          type: 'temperature',
          level: 'warning',
          title: 'Calor Intenso en Costa',
          message: `Temperatura: ${weatherData.tempMax.toFixed(1)}°C`,
          recommendation: 'Aumentar riego nocturno, proteger cultivos',
          icon: '🌡️'
        });
      }
      
      if (weatherData.tempMin < 12) {
        alerts.push({
          id: 'coast-cold',
          type: 'temperature',
          level: 'warning',
          title: 'Frío Inusual en Costa',
          message: `Temperatura mínima: ${weatherData.tempMin.toFixed(1)}°C`,
          recommendation: 'Proteger cultivos sensibles al frío',
          icon: '🌬️'
        });
      }

      // Lluvia en costa = ANORMAL y peligroso
      if (weatherData.precipitation > 10) {
        alerts.push({
          id: 'coast-rain-critical',
          type: 'flood',
          level: 'critical',
          title: 'Lluvia Excepcional en Costa',
          message: `${weatherData.precipitation.toFixed(1)}mm - infraestructura no preparada`,
          recommendation: 'URGENTE: Revisar drenaje, capturar agua, alerta El Niño',
          icon: '🌊'
        });
      } else if (weatherData.precipitation > 5) {
        alerts.push({
          id: 'coast-rain',
          type: 'rainfall',
          level: 'warning',
          title: 'Lluvia Inusual en Costa',
          message: `${weatherData.precipitation.toFixed(1)}mm detectado`,
          recommendation: 'Verificar sistemas de drenaje urbano',
          icon: '🌧️'
        });
      }
    }

    if (climateZone === 'highlands') {
      // Sierra: heladas son el principal peligro
      if (weatherData.tempMin < 0) {
        alerts.push({
          id: 'frost-severe',
          type: 'temperature',
          level: 'critical',
          title: 'Helada Severa',
          message: `${weatherData.tempMin.toFixed(1)}°C a ${altitude}m - daño a cultivos`,
          recommendation: 'URGENTE: Proteger papa, quinua con coberturas',
          icon: '❄️'
        });
      } else if (weatherData.tempMin < 5) {
        alerts.push({
          id: 'frost-risk',
          type: 'temperature',
          level: 'warning',
          title: 'Riesgo de Heladas',
          message: `Temperatura: ${weatherData.tempMin.toFixed(1)}°C`,
          recommendation: 'Preparar coberturas térmicas para la noche',
          icon: '🌬️'
        });
      }

      if (weatherData.rainfall7d > 100) {
        alerts.push({
          id: 'highland-rain',
          type: 'rainfall',
          level: 'warning',
          title: 'Lluvias Intensas en Sierra',
          message: `${weatherData.rainfall7d.toFixed(0)}mm acumulado`,
          recommendation: 'Revisar terrazas, riesgo de deslizamientos',
          icon: '⛰️'
        });
      }
    }

    if (climateZone === 'jungle') {
      // Selva: lluvias y humedad
      if (weatherData.rainfall7d > 200) {
        alerts.push({
          id: 'jungle-flood',
          type: 'flood',
          level: 'critical',
          title: 'Lluvias Torrenciales',
          message: `${weatherData.rainfall7d.toFixed(0)}mm - riesgo de huaycos`,
          recommendation: 'Evacuar zonas bajas, alto riesgo de desborde',
          icon: '🌊'
        });
      }

      if (weatherData.humidity > 90) {
        alerts.push({
          id: 'jungle-humidity',
          type: 'humidity',
          level: 'warning',
          title: 'Humedad Extrema',
          message: `${weatherData.humidity.toFixed(0)}% - riesgo de hongos`,
          recommendation: 'Aplicar fungicidas, mejorar ventilación',
          icon: '💧'
        });
      }

      // Sequía en selva = ANORMAL
      if (weatherData.rainfall30d < 150) {
        alerts.push({
          id: 'jungle-drought',
          type: 'drought',
          level: 'critical',
          title: 'Sequía Atípica en Selva',
          message: `Solo ${weatherData.rainfall30d.toFixed(0)}mm en 30 días`,
          recommendation: 'Fenómeno anómalo - activar riego de emergencia',
          icon: '🏜️'
        });
      }
    }

    if (alerts.length === 0) {
      alerts.push({
        id: 'normal',
        type: 'general',
        level: 'normal',
        title: `Condiciones Normales para ${climateZone === 'coast' ? 'Costa' : climateZone === 'highlands' ? 'Sierra' : 'Selva'}`,
        message: 'Parámetros dentro de rangos típicos de la región',
        recommendation: 'Mantener prácticas agrícolas habituales de la zona',
        icon: '✅'
      });
    }

    return alerts.sort((a, b) => {
      const priority = { critical: 3, warning: 2, normal: 1 };
      return priority[b.level] - priority[a.level];
    });
  };

  const alerts = analyzeWeather();
  const decisions = generateDecisionsByClimate();

  return (
    <div className="space-y-4">
      <DecisionPanel decisions={decisions} />

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Alertas para {regionConfig.name}
        </h3>
        <div className="text-sm text-gray-400">
          {alerts.length} alerta{alerts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <motion.div className="text-4xl mb-4" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            🛰️
          </motion.div>
          <p className="text-gray-400">Analizando...</p>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
          <AnimatePresence>
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}