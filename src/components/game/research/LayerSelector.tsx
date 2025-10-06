import React from 'react';
import { Layers } from 'lucide-react';
import { LayerCategory, LayerCategoryKey, LayerInfo } from '@/lib/types/layer.types';
import { LAYER_CATEGORIES } from '@/components/game/research/layers';

interface LayerSelectorProps {
  activeCategory: LayerCategoryKey | null;
  activeLayer: string;
  onToggleCategory: (key: LayerCategoryKey) => void;
  onSelectLayer: (layerId: string) => void;
}

export const LayerSelector: React.FC<LayerSelectorProps> = ({
  activeCategory,
  activeLayer,
  onToggleCategory,
  onSelectLayer
}) => {
  return (
    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 shadow-lg">
      <label className="flex items-center gap-2 text-sm font-semibold mb-3">
        <Layers size={16} />
        Capas Disponibles
      </label>
      
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
        {(Object.entries(LAYER_CATEGORIES) as [LayerCategoryKey, LayerCategory][]).map(
          ([key, category]) => (
            <div key={key}>
              <button
                onClick={() => onToggleCategory(key)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all font-semibold shadow-md hover:shadow-lg ${
                  activeCategory === key 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/30' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-expanded={activeCategory === key}
                aria-label={`Toggle ${category.name} category`}
              >
                <span className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </span>
                <span className="text-xs transform transition-transform duration-200" 
                      style={{ transform: activeCategory === key ? 'rotate(90deg)' : 'rotate(0)' }}>
                  ▶
                </span>
              </button>
              
              {activeCategory === key && (
                <div className="mt-2 space-y-1 pl-2 animate-fadeIn">
                  {category.layers.map((layer: LayerInfo) => (
                    <button
                      key={layer.id}
                      onClick={() => onSelectLayer(layer.id)}
                      className={`w-full text-left p-3 rounded-lg text-xs transition-all ${
                        activeLayer === layer.id
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                      aria-pressed={activeLayer === layer.id}
                      aria-label={`Select ${layer.name}`}
                    >
                      <div className="font-semibold flex items-center justify-between mb-1">
                        {layer.name}
                        {activeLayer === layer.id && <span className="text-sm">✓</span>}
                      </div>
                      <div className="text-xs opacity-90 leading-relaxed">{layer.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        )}
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