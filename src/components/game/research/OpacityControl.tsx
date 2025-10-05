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
    <div className="bg-gray-700 rounded-lg p-3">
      <label 
        htmlFor="opacity-slider" 
        className="flex items-center gap-2 text-xs font-semibold mb-2"
      >
        <Eye size={14} />
        Opacidad: {layerOpacity}%
      </label>
      <input
        id="opacity-slider"
        type="range"
        min="0"
        max="100"
        value={layerOpacity}
        onChange={onOpacityChange}
        className="w-full"
        aria-label="Layer opacity"
      />
      
      <label className="flex items-center gap-2 text-xs mt-3">
        <input
          type="checkbox"
          checked={showBase}
          onChange={onShowBaseChange}
          className="rounded"
          aria-label="Show base map"
        />
        Mostrar Mapa Base
      </label>
    </div>
  );
};