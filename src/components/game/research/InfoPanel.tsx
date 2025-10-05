import React from 'react';
import { X } from 'lucide-react';

interface InfoPanelProps {
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ onClose }) => {
  return (
    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 max-w-sm z-10">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800">NASA Earth Monitor</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close information"
        >
          <X size={18} />
        </button>
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Visualización Satelital:</strong> Sistema simplificado usando WMS de NASA GIBS.
        </p>
        <div className="bg-blue-50 p-2 rounded mt-2">
          <p className="text-xs font-semibold text-blue-800">Capas:</p>
          <ul className="text-xs text-blue-700 mt-1 space-y-1">
            <li>🔥 Incendios en tiempo real</li>
            <li>💧 Precipitación y lluvia</li>
            <li>🌡️ Mapas de calor</li>
            <li>⚠️ Sequía y vegetación</li>
          </ul>
        </div>
        <p className="text-xs text-gray-600 pt-2 border-t">
          Datos de NASA GIBS/ESDIS
        </p>
      </div>
    </div>
  );
};