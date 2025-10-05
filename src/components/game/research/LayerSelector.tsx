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
    <div className="bg-gray-700 rounded-lg p-3">
      <label className="flex items-center gap-2 text-xs font-semibold mb-2">
        <Layers size={14} />
        Capas Disponibles
      </label>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {(Object.entries(LAYER_CATEGORIES) as [LayerCategoryKey, LayerCategory][]).map(
          ([key, category]) => (
            <div key={key}>
              <button
                onClick={() => onToggleCategory(key)}
                className={`w-full flex items-center justify-between p-2 rounded text-xs transition-all ${
                  activeCategory === key ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-expanded={activeCategory === key}
                aria-label={`Toggle ${category.name} category`}
              >
                <span className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </span>
                <span>{activeCategory === key ? '▼' : '▶'}</span>
              </button>
              
              {activeCategory === key && (
                <div className="mt-1 space-y-1 pl-1">
                  {category.layers.map((layer: LayerInfo) => (
                    <button
                      key={layer.id}
                      onClick={() => onSelectLayer(layer.id)}
                      className={`w-full text-left p-2 rounded text-xs transition-all ${
                        activeLayer === layer.id
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                      aria-pressed={activeLayer === layer.id}
                      aria-label={`Select ${layer.name}`}
                    >
                      <div className="font-medium flex items-center justify-between">
                        {layer.name}
                        {activeLayer === layer.id && <span>✓</span>}
                      </div>
                      <div className="text-xs opacity-75 mt-0.5">{layer.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};