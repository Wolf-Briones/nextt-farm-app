import React from 'react';
import { InfoPanel } from '@/components/game/research/InfoPanel';
import { LayerPopup } from '@/components/game/research/LayerPopup';
import { formatDate } from '@/lib/utils/imageUtils';
import { LayerInfo } from '@/lib/types/layer.types';
import { Loader } from 'lucide-react';

interface MainViewProps {
  imageUrl: string;
  coastlineUrl: string;
  layerOpacity: number;
  showBase: boolean;
  showInfo: boolean;
  selectedDate: string;
  imageKey: number;
  layerName: string;
  onImageError: () => void;
  onCloseInfo: () => void;
  isLoading: boolean;
  showLayerPopup: boolean;
  activeLayerInfo: LayerInfo | undefined;
}

export const MainView: React.FC<MainViewProps> = ({
  imageUrl,
  coastlineUrl,
  layerOpacity,
  showBase,
  showInfo,
  selectedDate,
  imageKey,
  layerName,
  onImageError,
  onCloseInfo,
  isLoading,
  showLayerPopup,
  activeLayerInfo
}) => {
  return (
    <main className="flex-1 relative bg-gray-950 overflow-hidden">
      <div className="w-full h-full relative flex items-center justify-center">
        {/* Base Coastline Layer */}
        {showBase && (
          <div className="absolute inset-0" style={{ opacity: 0.3 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coastlineUrl}
              alt="Coastlines"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Main Satellite Layer */}
        <div 
          className="relative w-full h-full flex items-center justify-center transition-opacity duration-300" 
          style={{ opacity: layerOpacity / 100 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={imageKey}
            src={imageUrl}
            alt={layerName}
            className="max-w-full max-h-full object-contain"
            onError={onImageError}
          />
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-30">
            <div className="text-center">
              <div className="relative">
                <Loader className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-30 animate-pulse" />
              </div>
              <p className="text-white text-lg font-semibold mb-2">Cargando datos de NASA...</p>
              <p className="text-blue-300 text-sm">Procesando imágenes satelitales</p>
              <div className="mt-4 w-48 mx-auto bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        {showInfo && <InfoPanel onClose={onCloseInfo} />}

        {/* Layer Activation Popup */}
        {showLayerPopup && activeLayerInfo && (
          <LayerPopup layerInfo={activeLayerInfo} />
        )}

        {/* Date Display */}
        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm text-white rounded-xl shadow-2xl z-10 px-5 py-4 border border-blue-500/30">
          <div className="text-xs text-gray-300 mb-1">Vista 2D - Fecha</div>
          <div className="text-xl font-bold">
            {formatDate(selectedDate)}
          </div>
          <div className="text-xs text-blue-300 mt-2">Proyección: EPSG:4326</div>
        </div>
      </div>
    </main>
  );
};