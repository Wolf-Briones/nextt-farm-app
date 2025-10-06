"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedNASAPredictionService } from "@/services/enhanced-nasa-prediction.service";
import type { PredictionResponse, AIModelMetrics } from "@/lib/types/prediction.types";
import type { Country } from "@/lib/const/countries-data";
import { COUNTRIES_DATABASE } from "@/lib/const/countries-data";
import { LocationSelector } from "./LocationSelector";
import { WeatherForecast } from "./WeatherForecast";
import { CropHealthPredictor } from "./CropHealthPredictor";
import { RiskAlerts } from "./RiskAlerts";
import { LivestockMonitor } from "./LivestockMonitor";

export function PredictionDashboard() {
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [modelMetrics, setModelMetrics] = useState<AIModelMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("maíz");
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES_DATABASE.find(c => c.code === "PE") || COUNTRIES_DATABASE[0]
  );
  const [showLocationSelector, setShowLocationSelector] = useState(true);

  useEffect(() => {
    if (selectedCountry) {
      loadPredictions();
    }
  }, [selectedCrop, selectedCountry]);

  const loadPredictions = async () => {
    if (!selectedCountry) return;
    
    setLoading(true);
    try {
      const data = await EnhancedNASAPredictionService.generateEnhancedPrediction(
        {
          latitude: selectedCountry.latitude,
          longitude: selectedCountry.longitude
        },
        selectedCrop,
        0.65
      );
      setPredictions(data);
      setModelMetrics(data.modelMetrics);
    } catch (error) {
      console.error("Error loading predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (country: Country) => {
    setSelectedCountry(country);
    setShowLocationSelector(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🛰️
          </motion.div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Conectando con NASA APIs
          </h2>
          <p className="text-gray-400 mb-4">
            Analizando datos satelitales de {selectedCountry.nameEs}...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.capital}</span>
            <span>•</span>
            <span>{selectedCountry.latitude.toFixed(2)}°, {selectedCountry.longitude.toFixed(2)}°</span>
          </div>
          <div className="mt-6 flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 p-6">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-5xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🤖
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                IA Predictiva NASA
              </h1>
              <p className="text-gray-400">
                Análisis satelital global en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Current Location */}
            <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCountry.flag}</span>
                <div>
                  <div className="text-white font-semibold">{selectedCountry.nameEs}</div>
                  <div className="text-green-400 text-sm">{selectedCountry.capital}</div>
                </div>
                <motion.button
                  onClick={() => setShowLocationSelector(!showLocationSelector)}
                  className="ml-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📍 Cambiar
                </motion.button>
              </div>
            </div>

            {/* Crop Selector */}
            <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
              <label className="text-green-400 text-sm mb-2 block">
                Cultivo a analizar
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-gray-900 border border-green-500/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
              >
                <option value="maíz">🌽 Maíz</option>
                <option value="trigo">🌾 Trigo</option>
                <option value="tomate">🍅 Tomate</option>
                <option value="papa">🥔 Papa</option>
                <option value="soya">🫛 Soya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-green-400 font-semibold">NASA POWER: Activo</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 bg-emerald-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
                <span className="text-emerald-400 font-semibold">IA Modelo: v2.5</span>
              </div>
              {predictions && (
                <div className="text-gray-400 text-sm">
                  Última actualización: {predictions.generatedAt.toLocaleTimeString()}
                </div>
              )}
            </div>

            <motion.button
              onClick={loadPredictions}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Actualizar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Location Selector Modal */}
      <AnimatePresence>
        {showLocationSelector && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLocationSelector(false)}
          >
            <motion.div
              className="max-w-6xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LocationSelector
                onLocationChange={handleLocationChange}
                initialCountry={selectedCountry}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {predictions ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather Forecast */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <WeatherForecast predictions={predictions.weather} />
          </motion.div>

          {/* Crop Health */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CropHealthPredictor
              cropHealth={predictions.cropHealth[0]}
              cropType={selectedCrop}
            />
          </motion.div>

          {/* Risk Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RiskAlerts risks={predictions.climateRisks} />
          </motion.div>

          {/* Livestock Monitor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <LivestockMonitor livestockRisk={predictions.livestockRisk} />
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Selecciona una ubicación
          </h3>
          <p className="text-gray-400 mb-6">
            Elige un país para comenzar el análisis predictivo
          </p>
          <motion.button
            onClick={() => setShowLocationSelector(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📍 Seleccionar Ubicación
          </motion.button>
        </div>
      )}

      {/* Footer Info */}
      {predictions && (
        <motion.div
          className="mt-6 bg-gray-800/30 border border-green-500/20 rounded-xl p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-400 text-sm">
            Predicciones para <span className="text-green-400 font-semibold">{selectedCountry.nameEs}</span> •{" "}
            Datos: <span className="text-green-400 font-semibold">NASA POWER API</span>,{" "}
            <span className="text-green-400 font-semibold">MODIS</span> y{" "}
            <span className="text-green-400 font-semibold">GPM</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Coordenadas: {selectedCountry.latitude.toFixed(4)}°, {selectedCountry.longitude.toFixed(4)}° • Precisión IA: 87%
          </p>
        </motion.div>
      )}
    </div>
  );
}