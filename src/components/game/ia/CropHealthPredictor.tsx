"use client";

import { motion } from "framer-motion";
import type { CropHealthPrediction } from "@/lib/types/prediction.types";

interface CropHealthPredictorProps {
  cropHealth: CropHealthPrediction;
  cropType: string;
}

export function CropHealthPredictor({ cropHealth, cropType }: CropHealthPredictorProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 border-green-500/50';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'high': return 'bg-orange-500/20 border-orange-500/50';
      case 'critical': return 'bg-red-500/20 border-red-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const getCropIcon = (crop: string) => {
    const icons: Record<string, string> = {
      'maíz': '🌽',
      'trigo': '🌾',
      'tomate': '🍅',
      'papa': '🥔',
      'soya': '🫛'
    };
    return icons[crop.toLowerCase()] || '🌱';
  };

  return (
    <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          🌿 Salud del Cultivo
        </h2>
        <div className="text-3xl">{getCropIcon(cropType)}</div>
      </div>

      {/* Health Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">Puntuación de Salud</span>
          <motion.span
            className={`text-3xl font-bold ${
              cropHealth.healthScore >= 80 ? 'text-green-400' :
              cropHealth.healthScore >= 60 ? 'text-yellow-400' :
              cropHealth.healthScore >= 40 ? 'text-orange-400' : 'text-red-400'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            {cropHealth.healthScore}%
          </motion.span>
        </div>
        
        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              cropHealth.healthScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
              cropHealth.healthScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
              cropHealth.healthScore >= 40 ? 'bg-gradient-to-r from-orange-500 to-red-400' :
              'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${cropHealth.healthScore}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* NDVI Current vs Predicted */}
      <div className="mb-6 bg-gray-900/50 border border-green-500/20 rounded-lg p-4">
        <div className="text-sm text-gray-400 mb-3">NDVI - Índice de Vegetación</div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Actual</div>
            <div className="text-2xl font-bold text-green-400">
              {cropHealth.currentNDVI.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Predicción 7d</div>
            <div className="text-2xl font-bold text-emerald-400">
              {cropHealth.predictedNDVI[cropHealth.predictedNDVI.length - 1].toFixed(3)}
            </div>
          </div>
        </div>

        {/* NDVI Trend Chart */}
        <div className="relative h-24 bg-gray-800/50 rounded-lg p-2">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="ndviGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            {/* Draw NDVI line */}
            <motion.polyline
              points={cropHealth.predictedNDVI.map((ndvi, i) => {
                const x = (i / (cropHealth.predictedNDVI.length - 1)) * 100;
                const y = 100 - ((ndvi - 0.2) / 0.7) * 100;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="url(#ndviGradient)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{
                vectorEffect: "non-scaling-stroke",
                transform: "scale(0.9) translateX(5%) translateY(5%)"
              }}
            />
          </svg>
          <div className="absolute bottom-1 left-2 text-xs text-gray-500">Hoy</div>
          <div className="absolute bottom-1 right-2 text-xs text-gray-500">+7d</div>
        </div>
      </div>

      {/* Risk Level */}
      <div className={`mb-6 border rounded-lg p-4 ${getRiskBg(cropHealth.riskLevel)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Nivel de Riesgo</div>
            <div className={`text-xl font-bold uppercase ${getRiskColor(cropHealth.riskLevel)}`}>
              {cropHealth.riskLevel === 'low' ? '✅ BAJO' :
               cropHealth.riskLevel === 'medium' ? '⚠️ MEDIO' :
               cropHealth.riskLevel === 'high' ? '⚠️ ALTO' : '🚨 CRÍTICO'}
            </div>
          </div>
          <motion.div
            className="text-4xl"
            animate={{ 
              scale: cropHealth.riskLevel === 'critical' ? [1, 1.2, 1] : 1 
            }}
            transition={{ duration: 1, repeat: cropHealth.riskLevel === 'critical' ? Infinity : 0 }}
          >
            {cropHealth.riskLevel === 'low' ? '🌱' :
             cropHealth.riskLevel === 'medium' ? '🌿' :
             cropHealth.riskLevel === 'high' ? '⚠️' : '🚨'}
          </motion.div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
          💡 Recomendaciones IA
        </div>
        <div className="space-y-2">
          {cropHealth.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-sm text-gray-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.6)" }}
            >
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg">▸</span>
                <span>{rec}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        Predicción a {cropHealth.daysAhead} días • Modelo NASA MODIS + ML
      </div>
    </div>
  );
}