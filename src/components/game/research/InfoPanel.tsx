import React from 'react';
import { X } from 'lucide-react';

interface InfoPanelProps {
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ onClose }) => {
  return (
    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-5 max-w-md z-10 border border-blue-200 animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">NASA Earth Monitor 3D</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close information"
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-3 text-sm text-gray-700">
        <p>
          <strong className="text-blue-600">Sistema de Visualización Avanzado:</strong> Plataforma dual que combina mapas 2D de alta resolución con un globo 3D interactivo en tiempo real.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-bold text-blue-800 mb-2">Capacidades del Sistema:</p>
          <ul className="text-xs text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-red-500">🔥</span>
              <span><strong>Incendios:</strong> Detección térmica en tiempo real con resolución de 375m usando VIIRS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">💧</span>
              <span><strong>Precipitación:</strong> Medición GPM cada 30 minutos a escala global</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">🌡️</span>
              <span><strong>Temperatura:</strong> Mapas térmicos diurnos y nocturnos de superficie terrestre</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">⚠️</span>
              <span><strong>Sequía:</strong> Índice NDVI para monitoreo de salud vegetal y detección temprana</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">☁️</span>
              <span><strong>Atmósfera:</strong> Análisis de vapor de agua y temperatura de nubes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">🌙</span>
              <span><strong>Nocturno:</strong> Visualización de luces urbanas y actividad humana (Black Marble)</span>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-1">Controles Interactivos:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Globo 3D:</strong> Arrastra para rotar manualmente, scroll para hacer zoom</li>
            <li>• <strong>Animación temporal:</strong> Visualiza evolución histórica de datos</li>
            <li>• <strong>Regiones:</strong> 8 áreas predefinidas de interés global</li>
            <li>• <strong>Control de opacidad:</strong> Ajusta transparencia de capas superpuestas</li>
            <li>• <strong>Múltiples capas:</strong> 17 productos satelitales diferentes disponibles</li>
          </ul>
        </div>
        <p className="text-xs text-gray-600 pt-3 border-t border-gray-200">
          <strong>Fuente de datos:</strong> NASA GIBS (Global Imagery Browse Services) / ESDIS
        </p>
        <p className="text-xs text-gray-500">
          Actualizaciones diarias desde satélites Terra, Aqua y VIIRS SNPP. Datos históricos disponibles desde el año 2000.
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};