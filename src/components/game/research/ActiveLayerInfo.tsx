import React from 'react';
import { LayerInfo } from '@/lib/types/layer.types';

interface ActiveLayerInfoProps {
  layerInfo: LayerInfo | undefined;
}

export const ActiveLayerInfo: React.FC<ActiveLayerInfoProps> = ({ layerInfo }) => {
  return (
    <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-400/50 rounded-xl p-4 shadow-lg">
      <h3 className="text-sm font-bold mb-2 text-green-300 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        Capa Activa
      </h3>
      <div className="text-xs text-gray-300">
        <p className="font-semibold text-base mb-2 text-white">{layerInfo?.name || 'No layer selected'}</p>
        <p className="text-xs opacity-90 leading-relaxed">{layerInfo?.description || 'Selecciona una capa para ver información detallada'}</p>
      </div>
    </div>
  );
};