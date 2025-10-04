"use client";

import { motion } from "framer-motion";
import type { DecisionCardsProps, DecisionCard, ParcelState } from "@/lib/types/crops";
import { CROP_DECISION_CONFIG } from "@/lib/const/crops";

// Type guard para asegurar que la parcela tiene cultivo
type ParcelWithCrop = ParcelState & {
  crop: NonNullable<ParcelState['crop']>;
};

export function DecisionCards({
  parcels,
  nasaData,
  onApplyAction,
  onAutoWatering,
}: DecisionCardsProps) {
  const selectedParcel = parcels.find((p) => p.isSelected);

  if (!selectedParcel || !selectedParcel.crop) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Selecciona una Parcela</h3>
          <p className="text-sm">
            Elige una parcela con cultivo para ver decisiones específicas
          </p>
        </div>
      </div>
    );
  }

  const parcelWithCrop = selectedParcel as ParcelWithCrop;

  // Verificar que existe configuración para este cultivo
  const cropConfig = CROP_DECISION_CONFIG[parcelWithCrop.crop.id];
  if (!cropConfig) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">
            Cultivo No Reconocido
          </h3>
          <p className="text-sm">
            No hay configuración disponible para este tipo de cultivo
          </p>
        </div>
      </div>
    );
  }

  const generateDecisionCards = (): DecisionCard[] => {
    const cards: DecisionCard[] = [];

    // 💧 Carta de riego
    if (
      parcelWithCrop.waterLevel <= 70 ||
      (parcelWithCrop.health <= 80 && parcelWithCrop.health > 40)
    ) {
      let waterUrgency: 'low' | 'medium' | 'high' = 'low';
      let waterDescription = '';

      if (parcelWithCrop.waterLevel <= cropConfig.thresholds.waterCritical) {
        waterUrgency = 'high';
        waterDescription = cropConfig.decisions.water.descriptions.critical;
      } else if (parcelWithCrop.waterLevel <= cropConfig.thresholds.waterLow) {
        waterUrgency = 'medium';
        waterDescription = cropConfig.decisions.water.descriptions.low;
      } else {
        waterUrgency = 'low';
        waterDescription = cropConfig.decisions.water.descriptions.preventive;
      }

      // Riego automático
      if (onAutoWatering) {
        cards.push({
          id: 'auto-water',
          title: `🤖 Riego Automático ${cropConfig.name}`,
          description: `Sistema IoT aplicará riego optimizado en 10 segundos. Nivel actual: ${parcelWithCrop.waterLevel.toFixed(
            1
          )}%. ${cropConfig.name} necesita ${parcelWithCrop.crop.waterNeeds}%`,
          icon: '🔄',
          urgency: waterUrgency,
          cost: 5,
          benefits: [
            `+${parcelWithCrop.crop.waterNeeds + 15} Agua`,
            '+10 Salud',
            'Riego optimizado',
            'Sistema automático',
          ],
          nasaData: `${cropConfig.decisions.water.nasaContext} | Sistema IoT: Activación en 10s`,
          action: () => onAutoWatering(parcelWithCrop.id),
        });
      }

      // Riego manual
      cards.push({
        id: 'water',
        title: cropConfig.decisions.water.title,
        description: `${waterDescription}. Humedad actual: ${parcelWithCrop.waterLevel.toFixed(
          1
        )}%`,
        icon: '💧',
        urgency: waterUrgency,
        cost: 25,
        benefits: cropConfig.decisions.water.benefits as readonly string[],
        nasaData: `${cropConfig.decisions.water.nasaContext} | SMAP: ${nasaData.soilMoisture.toFixed(
          1
        )}%`,
        action: () => onApplyAction(parcelWithCrop.id, 'water', 25),
      });
    }

    // 🌿 Carta de fertilizante
    if (parcelWithCrop.fertilizerLevel < cropConfig.thresholds.fertilizerLow) {
      const fertilizerDescription =
        parcelWithCrop.fertilizerLevel < 20
          ? cropConfig.decisions.fertilizer.descriptions.growth
          : cropConfig.decisions.fertilizer.descriptions.low;

      cards.push({
        id: 'fertilizer',
        title: cropConfig.decisions.fertilizer.title,
        description: `${fertilizerDescription}. NDVI: ${nasaData.globalNDVI.toFixed(
          3
        )} vs óptimo ${parcelWithCrop.crop.nasaOptimalNDVI.toFixed(3)}`,
        icon: '🧪',
        urgency: parcelWithCrop.fertilizerLevel < 20 ? 'high' : 'medium',
        cost: 35,
        benefits: cropConfig.decisions.fertilizer.benefits as readonly string[],
        nasaData: `${cropConfig.decisions.fertilizer.nasaContext} | Actual: ${nasaData.globalNDVI.toFixed(
          3
        )}`,
        action: () => onApplyAction(parcelWithCrop.id, 'fertilizer', 35),
      });
    }

    // 🐛 Carta de plagas
    const shouldShowPests =
      parcelWithCrop.pestLevel > cropConfig.thresholds.pestHigh ||
      nasaData.pestAlert ||
      (parcelWithCrop.hasPestsAppeared && parcelWithCrop.pestLevel > 15);

    if (shouldShowPests) {
      const pestDescription =
        parcelWithCrop.pestLevel > 70
          ? cropConfig.decisions.pest.descriptions.high
          : cropConfig.decisions.pest.descriptions.alert;

      cards.push({
        id: 'pest',
        title: cropConfig.decisions.pest.title,
        description: `${pestDescription}. Nivel actual: ${parcelWithCrop.pestLevel.toFixed(
          1
        )}%`,
        icon: '🛡️',
        urgency: parcelWithCrop.pestLevel > 70 ? 'high' : 'medium',
        cost: 40,
        benefits: cropConfig.decisions.pest.benefits as readonly string[],
        nasaData: `${cropConfig.decisions.pest.nasaContext} | Alerta: ${
          nasaData.pestAlert ? 'ACTIVA' : 'Normal'
        }`,
        action: () => onApplyAction(parcelWithCrop.id, 'pest', 40),
      });
    }

    // 🌡️ Carta de estrés térmico
    if (
      nasaData.heatStress ||
      nasaData.temperature > cropConfig.thresholds.temperatureHigh
    ) {
      cards.push({
        id: 'heat',
        title: `🌡️ Protección Térmica ${cropConfig.name}`,
        description: `${cropConfig.name} sufre estrés térmico a ${nasaData.temperature.toFixed(
          1
        )}°C. Umbral crítico: ${cropConfig.thresholds.temperatureHigh}°C`,
        icon: '🏖️',
        urgency:
          nasaData.temperature > cropConfig.thresholds.temperatureHigh + 5
            ? 'high'
            : 'medium',
        cost: 50,
        benefits: [
          'Reduce estrés térmico',
          `+25 Resistencia ${cropConfig.name}`,
          'Protección UV',
          'Mejora calidad',
        ],
        nasaData: `${cropConfig.name} óptimo < ${cropConfig.thresholds.temperatureHigh}°C | Actual: ${nasaData.temperature.toFixed(1)}°C`,
        action: () => onApplyAction(parcelWithCrop.id, 'heat', 50),
      });
    }

    // 🚜 Carta de cosecha
    if (
      parcelWithCrop.growthStage >= cropConfig.thresholds.harvestReady &&
      parcelWithCrop.daysToHarvest <= 7
    ) {
      const yieldEstimate = (parcelWithCrop.health * 0.8).toFixed(1);
      const expectedPrice = Math.round(
        parcelWithCrop.crop.marketPrice * (parcelWithCrop.health / 100)
      );

      cards.push({
        id: 'harvest',
        title: `🚜 Cosecha de ${cropConfig.name}`,
        description: `${cropConfig.name} listo para cosecha. Rendimiento estimado: ${yieldEstimate}% del potencial. Precio: $${expectedPrice}/ton`,
        icon: cropConfig.icon,
        urgency: parcelWithCrop.daysToHarvest <= 3 ? 'high' : 'medium',
        cost: 0,
        benefits: [
          `Ingresos $${expectedPrice}`,
          'Libera parcela',
          `XP cosecha ${cropConfig.name}`,
          'Calidad óptima',
        ],
        nasaData: `Madurez ${cropConfig.name}: ${parcelWithCrop.growthStage.toFixed(
          1
        )}% | Ventana cosecha: ${parcelWithCrop.daysToHarvest} días`,
        action: () => onApplyAction(parcelWithCrop.id, 'harvest', 0),
      });
    }

    return cards;
  };

  const decisionCards = generateDecisionCards();

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Decisiones para {cropConfig.name}
        </h3>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <span>{cropConfig.icon}</span>
          <span>
            Parcela {parcelWithCrop.id} - {parcelWithCrop.crop.name}
          </span>
        </div>
      </div>

      {/* Estado de la parcela */}
      <div className="bg-gray-700 rounded-lg p-3 mb-4">
        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
          {cropConfig.icon} Estado del {cropConfig.name}
        </h4>

        {/* Mensaje de control manual */}
        {(parcelWithCrop.lastAction.includes('Riego manual') ||
          parcelWithCrop.lastAction.includes('Riego automático') ||
          parcelWithCrop.lastAction.includes('Sistema automático')) && (
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
              <span>🎮</span>
              <span>¡Tomaste control de tu parcela!</span>
            </div>
            <div className="text-blue-300 text-xs mt-1">
              Control detectado: {parcelWithCrop.lastAction}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Agua:</span>
              <span
                className={`font-semibold ${
                  parcelWithCrop.waterLevel <= cropConfig.thresholds.waterCritical
                    ? 'text-red-400'
                    : parcelWithCrop.waterLevel <= cropConfig.thresholds.waterLow
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}
              >
                {parcelWithCrop.waterLevel.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Salud:</span>
              <span
                className={`font-semibold ${
                  parcelWithCrop.health > 70
                    ? 'text-green-400'
                    : parcelWithCrop.health > 40
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {parcelWithCrop.health.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Fertilizante:</span>
              <span
                className={`font-semibold ${
                  parcelWithCrop.fertilizerLevel <
                  cropConfig.thresholds.fertilizerLow
                    ? 'text-red-400'
                    : parcelWithCrop.fertilizerLevel < 50
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}
              >
                {parcelWithCrop.fertilizerLevel.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">NDVI:</span>
              <span
                className={`font-semibold ${
                  Math.abs(
                    parcelWithCrop.ndviValue - parcelWithCrop.crop.nasaOptimalNDVI
                  ) < 0.05
                    ? 'text-green-400'
                    : Math.abs(
                        parcelWithCrop.ndviValue -
                          parcelWithCrop.crop.nasaOptimalNDVI
                      ) < 0.1
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {parcelWithCrop.ndviValue.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-600 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Crecimiento:</span>
            <span className="text-cyan-400 font-semibold">
              {parcelWithCrop.growthStage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Cartas de decisión */}
      <div className="space-y-3 h-[calc(100%-200px)] overflow-y-auto">
        {decisionCards.map((card) => (
          <motion.div
            key={card.id}
            className={`bg-gray-700 rounded-lg p-4 border-l-4 cursor-pointer transition-all duration-300 ${
              card.urgency === 'high'
                ? 'border-red-500 hover:bg-red-900/20'
                : card.urgency === 'medium'
                ? 'border-yellow-500 hover:bg-yellow-900/20'
                : 'border-green-500 hover:bg-green-900/20'
            }`}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={card.action}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{card.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{card.title}</h4>
                  <div className="flex items-center gap-2">
                    {card.urgency === 'high' && (
                      <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        URGENTE
                      </div>
                    )}
                    {card.cost > 0 && (
                      <div className="bg-gray-800 px-2 py-1 rounded text-yellow-400 text-sm font-bold">
                        ${card.cost}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{card.description}</p>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {card.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                    📡 {card.nasaData}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {decisionCards.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <div className="text-3xl mb-2">✅</div>
            <h4 className="font-semibold mb-1">
              {cropConfig.name} está en excelentes condiciones
            </h4>
            <p className="text-sm">
              No hay decisiones urgentes para este cultivo
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Continúa monitoreando el desarrollo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}