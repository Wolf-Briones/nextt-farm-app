import React from 'react';
import { Eye } from 'lucide-react';

interface OpacityControlProps {
  layerOpacity: number;
  showBase: boolean;
  onOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowBaseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OpacityControl: React.FC<OpacityControlProps> = ({
  layerOpacity,
  showBase,
  onOpacityChange,
  onShowBaseChange
}) => {
  return (
    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 shadow-lg">
      <label 
        htmlFor="opacity-slider" 
        className="flex items-center gap-2 text-sm font-semibold mb-3"
      >
        <Eye size={16} />
        Opacidad: <span className="text-blue-400">{layerOpacity}%</span>
      </label>
      <input
        id="opacity-slider"
        type="range"
        min="0"
        max="100"
        value={layerOpacity}
        onChange={onOpacityChange}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        aria-label="Layer opacity"
      />
      
      <label className="flex items-center gap-2 text-sm mt-4 cursor-pointer hover:text-blue-300 transition-colors">
        <input
          type="checkbox"
          checked={showBase}
          onChange={onShowBaseChange}
          className="rounded w-4 h-4 accent-blue-500 cursor-pointer"
          aria-label="Show base map"
        />
        Mostrar Líneas Costeras
      </label>
    </div>
  );
};