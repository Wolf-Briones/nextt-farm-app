import React from 'react';
import { MapPin } from 'lucide-react';
import { LocationPreset } from '@/lib/types/layer.types';
import { LOCATION_PRESETS } from '@/lib/const/locations';

interface RegionSelectorProps {
  onSelectRegion: (bbox: string) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelectRegion }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-3">
      <label className="flex items-center gap-2 text-xs font-semibold mb-2">
        <MapPin size={14} />
        Regiones
      </label>
      <div className="space-y-1">
        {LOCATION_PRESETS.map((preset: LocationPreset) => (
          <button
            key={preset.name}
            onClick={() => onSelectRegion(preset.bbox)}
            className="w-full text-left px-2 py-1.5 bg-gray-600 hover:bg-gray-500 rounded text-xs transition-all"
            aria-label={`Set region to ${preset.name}`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};