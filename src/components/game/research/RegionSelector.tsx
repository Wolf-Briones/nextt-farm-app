import React from 'react';
import { MapPin } from 'lucide-react';
import { LocationPreset } from '@/lib/types/layer.types';
import { LOCATION_PRESETS } from '@/lib/const/locations';

interface RegionSelectorProps {
  onSelectRegion: (bbox: string) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelectRegion }) => {
  return (
    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 shadow-lg">
      <label className="flex items-center gap-2 text-sm font-semibold mb-3">
        <MapPin size={16} />
        Regiones Predefinidas
      </label>
      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
        {LOCATION_PRESETS.map((preset: LocationPreset) => (
          <button
            key={preset.name}
            onClick={() => onSelectRegion(preset.bbox)}
            className="w-full text-left px-3 py-2.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition-all font-medium hover:shadow-lg hover:scale-[1.02]"
            aria-label={`Set region to ${preset.name}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};