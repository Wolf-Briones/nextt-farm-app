"use client";

import { motion } from "framer-motion";

interface ProductionData {
  dailyMilk: number;
  eggCount: number;
  meatProjection: number;
  feedEfficiency: number;
  carbonFootprint: number;
  nasaOptimization: number;
}

interface ProductionPanelProps {
  data: ProductionData;
}

export default function ProductionPanel({ data }: ProductionPanelProps) {
  const productionMetrics = [
    {
      title: "Leche Diaria",
      value: `${data.dailyMilk}L`,
      icon: "🥛",
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      trend: data.dailyMilk > 40 ? "up" : "down"
    },
    {
      title: "Huevos",
      value: `${data.eggCount}`,
      icon: "🥚", 
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
      trend: data.eggCount > 20 ? "up" : "down"
    },
    {
      title: "Eficiencia",
      value: `${data.feedEfficiency}%`,
      icon: "🌾",
      color: "text-green-400", 
      bgColor: "bg-green-900/20",
      trend: data.feedEfficiency > 80 ? "up" : "down"
    },
    {
      title: "Carbono",
      value: `${data.carbonFootprint}%`,
      icon: "🌱",
      color: "text-cyan-400",
      bgColor: "bg-cyan-900/20", 
      trend: data.carbonFootprint < -5 ? "up" : "down"
    }
  ];

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📊
          </motion.span>
          <h3 className="text-lg font-bold text-green-400">Producción Ganadera</h3>
        </div>
        <div className="text-sm text-gray-400">
          Tiempo real
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {productionMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg ${metric.bgColor} border border-gray-600`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{metric.icon}</span>
              <motion.span
                className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {metric.trend === 'up' ? '↗️' : '↘️'}
              </motion.span>
            </div>
            <div className={`text-lg font-bold ${metric.color} mb-1`}>
              {metric.value}
            </div>
            <div className="text-xs text-gray-400">{metric.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Optimización NASA */}
      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg">🛰️</span>
          <h4 className="text-sm font-semibold text-cyan-400">Optimización NASA</h4>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Eficiencia General</span>
            <span className="text-cyan-400 font-bold">{data.nasaOptimization}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${data.nasaOptimization}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>• MODIS: Calidad de pastizales</div>
            <div>• SMAP: Gestión hídrica optimizada</div>
            <div>• Weather: Predicción de condiciones</div>
          </div>
        </div>
      </div>

      {/* Proyecciones */}
      <div className="mt-4 bg-gray-700 p-3 rounded-lg border border-gray-600">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">🔮</span>
          <h4 className="text-sm font-semibold text-yellow-400">Proyecciones</h4>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-sm font-bold text-green-400">{(data.dailyMilk * 30).toFixed(0)}L</div>
            <div className="text-gray-400">Leche/mes</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-orange-400">{data.meatProjection}kg</div>
            <div className="text-gray-400">Carne/mes</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-purple-400">+{Math.round(data.nasaOptimization * 0.2)}%</div>
            <div className="text-gray-400">Mejora</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Sistema Activo</span>
        </div>
        <span className="text-xs text-gray-500">NASA + IA</span>
      </div>
    </motion.div>
  );
}