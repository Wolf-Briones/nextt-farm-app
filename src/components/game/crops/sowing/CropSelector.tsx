"use client";

import { motion } from "framer-motion";
import type { CropSelectorProps } from "@/lib/types/crops";
import { AVAILABLE_CROPS } from "@/lib/const/crops";

export function CropSelector({
  selectedCrop,
  onSelectCrop,
  playerMoney,
}: CropSelectorProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
        🌱 Seleccionar Cultivo
        <span className="text-sm text-gray-400 font-normal">
          (Costo: $50 por plantación)
        </span>
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {AVAILABLE_CROPS.map((crop) => (
          <motion.div
            key={crop.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
              selectedCrop?.id === crop.id
                ? "border-cyan-400 bg-cyan-900/20"
                : "border-gray-600 bg-gray-700"
            } ${playerMoney < 50 ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={playerMoney >= 50 ? { scale: 1.05, y: -2 } : {}}
            whileTap={playerMoney >= 50 ? { scale: 0.95 } : {}}
            onClick={() => playerMoney >= 50 && onSelectCrop(crop)}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{crop.icon}</div>
              <h4 className="font-semibold text-white text-sm mb-1">
                {crop.name}
              </h4>
              <div className="text-xs text-gray-400 space-y-1">
                <div>⏱️ {crop.growthDays} días (≈1 min)</div>
                <div>💧 Agua: {crop.waterNeeds}%</div>
                <div>💰 Precio: ${crop.marketPrice}</div>
                <div
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    crop.difficulty === "Fácil"
                      ? "bg-green-600/20 text-green-400"
                      : crop.difficulty === "Medio"
                      ? "bg-yellow-600/20 text-yellow-400"
                      : "bg-red-600/20 text-red-400"
                  }`}
                >
                  {crop.difficulty}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedCrop && (
        <motion.div
          className="mt-4 p-3 bg-gray-700 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold text-cyan-400 mb-2">
            Información del Cultivo: {selectedCrop.name}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <strong className="text-white">Tiempo de crecimiento:</strong>{" "}
              {selectedCrop.growthDays} días del juego (~1 minuto real)
            </div>
            <div>
              <strong className="text-white">Necesidades hídricas:</strong>{" "}
              {selectedCrop.waterNeeds}%
            </div>
            <div>
              <strong className="text-white">Resistencia:</strong>{" "}
              {selectedCrop.resistance}%
            </div>
            <div>
              <strong className="text-white">NDVI óptimo (NASA):</strong>{" "}
              {selectedCrop.nasaOptimalNDVI.toFixed(3)}
            </div>
          </div>
          <div className="mt-2 text-xs text-cyan-400">
            💡 Haz clic en una parcela libre para plantar este cultivo
          </div>
        </motion.div>
      )}

      {playerMoney < 50 && (
        <div className="mt-3 p-2 bg-red-900/20 border border-red-600/50 rounded text-red-400 text-sm">
          ⚠️ Dinero insuficiente. Necesitas $50 para plantar un cultivo.
        </div>
      )}
    </div>
  );
}