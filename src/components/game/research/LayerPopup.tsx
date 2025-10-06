import React from 'react';
import { Info } from 'lucide-react';
import { LayerInfo } from '@/lib/types/layer.types';

interface LayerPopupProps {
  layerInfo: LayerInfo;
}

export const LayerPopup: React.FC<LayerPopupProps> = ({ layerInfo }) => {
  return (
    <div className="absolute top-6 right-6 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl shadow-2xl p-5 max-w-sm z-20 border-2 border-white/30 animate-slideIn">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Info size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            Capa Activada
          </h3>
          <p className="font-bold text-base mb-2">{layerInfo.name}</p>
          <p className="text-xs opacity-90 leading-relaxed">{layerInfo.description}</p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span>Datos satelitales en tiempo real</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};