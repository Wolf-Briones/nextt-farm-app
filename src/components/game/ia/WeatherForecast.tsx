"use client";

import { motion } from "framer-motion";
import type { WeatherPrediction } from "@/lib/types/prediction.types";

interface WeatherForecastProps {
  predictions: WeatherPrediction[];
}

export function WeatherForecast({ predictions }: WeatherForecastProps) {
  const getWeatherIcon = (temp: number, precip: number) => {
    if (precip > 50) return "🌧️";
    if (precip > 20) return "⛅";
    if (temp > 30) return "☀️";
    return "🌤️";
  };

  const getTempColor = (temp: number) => {
    if (temp > 30) return "text-red-400";
    if (temp > 20) return "text-yellow-400";
    return "text-blue-400";
  };

  return (
    <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          ☁️ Pronóstico NASA POWER
        </h2>
        <div className="bg-green-500/10 px-3 py-1 rounded-lg">
          <span className="text-green-400 text-sm font-semibold">
            7 días
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {predictions.map((pred, index) => (
          <motion.div
            key={index}
            className="bg-gray-900/50 border border-green-500/20 rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.5)" }}
          >
            <div className="flex items-center justify-between">
              {/* Date and Icon */}
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {getWeatherIcon(pred.temperature.avg, pred.precipitation.amount)}
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {pred.date.toLocaleDateString('es-ES', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Día {index + 1}
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${getTempColor(pred.temperature.avg)}`}>
                  {pred.temperature.avg.toFixed(1)}°C
                </div>
                <div className="text-gray-400 text-xs">
                  {pred.temperature.min.toFixed(0)}° / {pred.temperature.max.toFixed(0)}°
                </div>
              </div>

              {/* Precipitation */}
              <div className="text-center">
                <div className="text-blue-400 font-semibold">
                  💧 {pred.precipitation.amount.toFixed(1)}mm
                </div>
                <div className="text-gray-400 text-xs">
                  {pred.precipitation.probability.toFixed(0)}% prob.
                </div>
              </div>

              {/* Confidence */}
              <div>
                <div className="w-20 bg-gray-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${pred.confidence}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="text-green-400 text-xs mt-1 text-center">
                  {pred.confidence}% IA
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-sm">
              <div className="text-gray-400">
                💨 Viento: <span className="text-white">{pred.windSpeed.toFixed(1)} km/h</span>
              </div>
              <div className="text-gray-400">
                💧 Humedad: <span className="text-white">{pred.humidity.toFixed(0)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
        <div className="text-green-400 font-semibold mb-2">📊 Resumen Semanal</div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Temp. Media</div>
            <div className="text-white font-semibold">
              {(predictions.reduce((s, p) => s + p.temperature.avg, 0) / predictions.length).toFixed(1)}°C
            </div>
          </div>
          <div>
            <div className="text-gray-400">Lluvia Total</div>
            <div className="text-white font-semibold">
              {predictions.reduce((s, p) => s + p.precipitation.amount, 0).toFixed(1)}mm
            </div>
          </div>
          <div>
            <div className="text-gray-400">Días lluvia</div>
            <div className="text-white font-semibold">
              {predictions.filter(p => p.precipitation.probability > 50).length} días
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}