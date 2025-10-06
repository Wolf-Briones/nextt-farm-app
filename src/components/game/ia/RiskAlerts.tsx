"use client";

import { motion } from "framer-motion";
import type { ClimateRisk } from "@/lib/types/prediction.types";

interface RiskAlertsProps {
  risks: ClimateRisk[];
}

export function RiskAlerts({ risks }: RiskAlertsProps) {
  const getRiskIcon = (type: string) => {
    const icons: Record<string, string> = {
      drought: '🏜️',
      flood: '🌊',
      frost: '❄️',
      heatwave: '🔥',
      heavyrain: '⛈️'
    };
    return icons[type] || '⚠️';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return { text: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' };
      case 'moderate': return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' };
      case 'high': return { text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50' };
      case 'extreme': return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' };
      default: return { text: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/50' };
    }
  };

  const getRiskTitle = (type: string) => {
    const titles: Record<string, string> = {
      drought: 'Sequía',
      flood: 'Inundación',
      frost: 'Helada',
      heatwave: 'Ola de Calor',
      heavyrain: 'Lluvia Intensa'
    };
    return titles[type] || type;
  };

  if (risks.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-green-400 mb-6">🛡️ Alertas Climáticas</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <div className="text-green-400 font-semibold text-lg mb-2">
            Sin Riesgos Detectados
          </div>
          <div className="text-gray-400 text-sm">
            Las condiciones climáticas son favorables
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-400">🛡️ Alertas Climáticas</h2>
        <div className="bg-red-500/20 border border-red-500/50 px-3 py-1 rounded-lg">
          <span className="text-red-400 font-semibold text-sm">
            {risks.length} Riesgo{risks.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {risks.map((risk, index) => {
          const colors = getSeverityColor(risk.severity);
          
          return (
            <motion.div
              key={index}
              className={`border rounded-lg p-4 ${colors.bg} ${colors.border}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="text-3xl"
                    animate={risk.severity === 'extreme' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: risk.severity === 'extreme' ? Infinity : 0 }}
                  >
                    {getRiskIcon(risk.type)}
                  </motion.div>
                  <div>
                    <div className={`font-bold ${colors.text}`}>
                      {getRiskTitle(risk.type)}
                    </div>
                    <div className="text-sm text-gray-400">
                      Severidad: <span className={`font-semibold uppercase ${colors.text}`}>
                        {risk.severity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Probability */}
                <div className="text-center">
                  <div className={`text-2xl font-bold ${colors.text}`}>
                    {risk.probability}%
                  </div>
                  <div className="text-xs text-gray-500">Probabilidad</div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                <div className="bg-gray-900/50 rounded p-2">
                  <div className="text-gray-500 text-xs">Inicio</div>
                  <div className="text-white font-semibold">
                    {risk.startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded p-2">
                  <div className="text-gray-500 text-xs">Duración</div>
                  <div className="text-white font-semibold">{risk.duration} días</div>
                </div>
                <div className="bg-gray-900/50 rounded p-2">
                  <div className="text-gray-500 text-xs">Área</div>
                  <div className="text-white font-semibold">{risk.affectedArea}%</div>
                </div>
              </div>

              {/* Mitigation Actions */}
              <div className="border-t border-gray-700 pt-3">
                <div className="text-xs font-semibold text-gray-400 mb-2">
                  🛠️ Acciones de Mitigación:
                </div>
                <div className="space-y-1">
                  {risk.mitigationActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className={colors.text}>▸</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency Indicator */}
              {risk.severity === 'extreme' && (
                <motion.div
                  className="mt-3 bg-red-500/30 border border-red-500 rounded-lg p-2 text-center"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-red-400 font-bold text-sm">
                    ⚠️ ACCIÓN INMEDIATA REQUERIDA
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            Riesgos extremos: <span className="text-red-400 font-semibold">
              {risks.filter(r => r.severity === 'extreme').length}
            </span>
          </div>
          <div className="text-gray-400">
            Riesgos altos: <span className="text-orange-400 font-semibold">
              {risks.filter(r => r.severity === 'high').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}