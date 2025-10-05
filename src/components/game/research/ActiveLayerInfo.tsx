import React from 'react';
import { LayerInfo } from '@/lib/types/layer.types';

interface ActiveLayerInfoProps {
  layerInfo: LayerInfo | undefined;
}

export const ActiveLayerInfo: React.FC<ActiveLayerInfoProps> = ({ layerInfo }) => {
  return (
    <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3">
      <h3 className="text-xs font-bold mb-1 text-blue-300">Capa Activa</h3>
      <div className="text-xs text-gray-300">
        <p className="font-medium">{layerInfo?.name || 'No layer selected'}</p>
        <p className="text-xs opacity-75 mt-1">{layerInfo?.description || ''}</p>
      </div>
    </div>
  );
};