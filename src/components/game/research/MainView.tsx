import React from 'react';
import { InfoPanel } from '@/components/game/research/InfoPanel';
import { formatDate } from '@/lib/utils/imageUtils';

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
  onCloseInfo
}) => {
  return (
    <main className="flex-1 relative bg-gray-950 overflow-hidden">
      <div className="w-full h-full relative flex items-center justify-center">
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

        <div 
          className="relative w-full h-full flex items-center justify-center" 
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

        {showInfo && <InfoPanel onClose={onCloseInfo} />}

        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white rounded-lg shadow-xl z-10 px-4 py-3">
          <div className="text-xs text-gray-300">Fecha</div>
          <div className="text-lg font-bold">
            {formatDate(selectedDate)}
          </div>
        </div>
      </div>
    </main>
  );
};