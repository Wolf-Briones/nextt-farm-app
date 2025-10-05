import React from 'react';
import { Globe, Info, Download } from 'lucide-react';

interface HeaderProps {
  showInfo: boolean;
  onToggleInfo: () => void;
  onDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  showInfo, 
  onToggleInfo, 
  onDownload 
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-3 shadow-lg z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Globe className="w-7 h-7" />
          <div>
            <h1 className="text-xl font-bold">NASA Earth Monitor</h1>
            <p className="text-xs text-blue-100">Sistema de Monitoreo Satelital Global</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleInfo}
            className={`px-3 py-2 rounded-lg transition-all ${
              showInfo ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label="Toggle information"
          >
            <Info size={16} />
          </button>
          <button
            onClick={onDownload}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            aria-label="Download current view"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};