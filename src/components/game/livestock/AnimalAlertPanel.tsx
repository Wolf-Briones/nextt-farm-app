"use client";

import { motion } from "framer-motion";

interface AnimalAlert {
  id: string;
  type: 'health' | 'heat' | 'hunger' | 'thirst' | 'stress';
  severity: 'low' | 'medium' | 'high' | 'critical';
  animalName: string;
  message: string;
  timestamp: string;
  nasaData?: {
    temperature?: number;
    ndvi?: number;
    heatStress?: string;
  };
}

interface AlertPanelProps {
  alerts: AnimalAlert[];
}

const getAlertIcon = (type: string) => {
  const icons = {
    health: '🏥',
    heat: '🌡️', 
    hunger: '🌾',
    thirst: '💧',
    stress: '⚠️'
  };
  return icons[type as keyof typeof icons] || '📋';
};

const getSeverityColor = (severity: string) => {
  const colors = {
    low: 'border-blue-500 bg-blue-900/20 text-blue-400',
    medium: 'border-yellow-500 bg-yellow-900/20 text-yellow-400',
    high: 'border-orange-500 bg-orange-900/20 text-orange-400',
    critical: 'border-red-500 bg-red-900/20 text-red-400'
  };
  return colors[severity as keyof typeof colors] || colors.low;
};

export default function AnimalAlertPanel({ alerts }: AlertPanelProps) {
  // Contar alertas por severidad
  const alertCounts = alerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚨
          </motion.span>
          <h3 className="text-lg font-bold text-red-400">Alertas Sistema</h3>
        </div>
        <div className="text-sm text-gray-400">
          {alerts.length} activas
        </div>
      </div>

      {/* Contador por severidad */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {['critical', 'high', 'medium', 'low'].map(severity => (
          <div 
            key={severity}
            className={`p-2 rounded text-center ${getSeverityColor(severity)}`}
          >
            <div className="font-bold text-lg">{alertCounts[severity] || 0}</div>
            <div className="text-xs opacity-80 capitalize">{severity}</div>
          </div>
        ))}
      </div>

      {/* Lista de alertas */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-2 block">✅</span>
            <p className="text-gray-400 text-sm">Sin alertas activas</p>
            <p className="text-gray-500 text-xs">Sistema funcionando normalmente</p>
          </div>
        ) : (
          alerts.slice(0, 5).map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">{getAlertIcon(alert.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{alert.animalName}</span>
                    <span className="text-xs opacity-70">{alert.timestamp}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{alert.message}</p>
                  
                  {alert.nasaData && (
                    <div className="bg-gray-800/50 p-2 rounded text-xs space-y-1">
                      <div className="text-cyan-400 font-medium">📡 Resultado:</div>
                      {alert.nasaData.heatStress && (
                        <div>Estrés Térmico: {alert.nasaData.heatStress}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400 text-center">
        Monitoreo continuo • Datos NASA integrados
      </div>
    </motion.div>
  );
}