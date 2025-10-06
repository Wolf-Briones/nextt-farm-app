"use client";

import { motion } from "framer-motion";
import type { LivestockRiskPrediction } from "@/lib/types/prediction.types";

interface LivestockMonitorProps {
  livestockRisk: LivestockRiskPrediction;
}

export function LivestockMonitor({ livestockRisk }: LivestockMonitorProps) {
  const getRiskLevel = (risk: number): { level: string; color: string; bg: string } => {
    if (risk >= 75) return { level: 'CRÍTICO', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (risk >= 50) return { level: 'ALTO', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (risk >= 25) return { level: 'MEDIO', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'BAJO', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const risks = [
    {
      name: 'Estrés Térmico',
      value: livestockRisk.heatStressRisk,
      icon: '🌡️',
      description: 'Riesgo de golpe de calor en ganado'
    },
    {
      name: 'Enfermedades',
      value: livestockRisk.diseaseRisk,
      icon: '🦠',
      description: 'Probabilidad de brotes infecciosos'
    },
    {
      name: 'Estrés Hídrico',
      value: livestockRisk.waterStressRisk,
      icon: '💧',
      description: 'Riesgo de deshidratación'
    }
  ];

  const maxRisk = Math.max(livestockRisk.heatStressRisk, livestockRisk.diseaseRisk, livestockRisk.waterStressRisk);
  const overallRisk = getRiskLevel(maxRisk);

  return (
    <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          🐄 Monitor Ganadero
        </h2>
        <div className={`${overallRisk.bg} border border-${overallRisk.color.split('-')[1]}-500/50 px-3 py-1 rounded-lg`}>
          <span className={`${overallRisk.color} font-semibold text-sm`}>
            {overallRisk.level}
          </span>
        </div>
      </div>

      {/* Overall Status */}
      <div className="mb-6 bg-gray-900/50 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">Nivel de Riesgo General</div>
          <motion.div
            className={`text-4xl ${overallRisk.color} font-bold`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            {maxRisk.toFixed(0)}%
          </motion.div>
        </div>
        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              maxRisk >= 75 ? 'bg-gradient-to-r from-red-500 to-red-600' :
              maxRisk >= 50 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              maxRisk >= 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-green-500 to-emerald-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${maxRisk}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        
        {livestockRisk.affectedAnimals > 0 && (
          <div className="mt-3 text-sm text-gray-400">
            Animales potencialmente afectados: 
            <span className={`${overallRisk.color} font-semibold ml-2`}>
              ~{livestockRisk.affectedAnimals}
            </span>
          </div>
        )}
      </div>

      {/* Individual Risks */}
      <div className="space-y-4 mb-6">
        {risks.map((risk, index) => {
          const riskInfo = getRiskLevel(risk.value);
          
          return (
            <motion.div
              key={index}
              className="bg-gray-900/50 border border-green-500/20 rounded-lg p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.4)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{risk.icon}</div>
                  <div>
                    <div className="text-white font-semibold">{risk.name}</div>
                    <div className="text-xs text-gray-500">{risk.description}</div>
                  </div>
                </div>
                <div className={`text-xl font-bold ${riskInfo.color}`}>
                  {risk.value.toFixed(0)}%
                </div>
              </div>

              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    risk.value >= 75 ? 'bg-red-500' :
                    risk.value >= 50 ? 'bg-orange-500' :
                    risk.value >= 25 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${risk.value}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="border-t border-gray-700 pt-4">
        <div className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
          💡 Recomendaciones Veterinarias IA
        </div>
        
        {livestockRisk.recommendations.length > 0 ? (
          <div className="space-y-2">
            {livestockRisk.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                className="bg-green-900/20 border border-green-500/30 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.01, borderColor: "rgba(34, 197, 94, 0.6)" }}
              >
                <div className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 text-lg">▸</span>
                  <span>{rec}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400 text-sm">
            No hay recomendaciones en este momento
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        Análisis predictivo basado en NASA POWER + Modelos veterinarios IA
      </div>
    </div>
  );
}