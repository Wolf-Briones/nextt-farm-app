import React from 'react';
import { Globe, Info, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 shadow-2xl z-20 border-b border-blue-400/30 relative overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      
      <div className="relative mx-auto flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Globe className="w-10 h-10 animate-pulse" />
            <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-50 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              NASA Earth Monitor 3D
              <span className="px-2 py-0.5 bg-green-500 text-xs rounded-full animate-pulse">LIVE</span>
            </h1>
            <p className="text-xs text-blue-100">Sistema Avanzado de Monitoreo Satelital Global</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleInfo}
            className={`px-4 py-2 rounded-xl transition-all shadow-lg hover:scale-105 ${
              showInfo ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label="Toggle information"
            title="Información del sistema"
          >
            <Info size={18} />
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all shadow-lg hover:scale-105 flex items-center gap-2"
            aria-label="Download current view"
            title="Descargar imagen actual"
          >
            <Download size={18} />
            <span className="text-sm hidden md:inline">Descargar</span>
          </button>
          <Link
            href="/game"
            className="group flex items-center justify-center gap-2 px-4 py-2
                   bg-gradient-to-r from-emerald-800 via-green-900 to-cyan-500
                   text-white rounded-xl shadow-[0_0_15px_#00ff99]
                   hover:shadow-[0_0_30px_#00ffaa] transition-all duration-300
                   ease-out border border-emerald-400/30 hover:scale-105"
            title="Volver al juego"
          >
            <ArrowLeft
              className="w-5 h-5 text-white transition-transform duration-300 ease-out group-hover:-translate-x-1"
            />
            <span
              className="opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[100px]
                     overflow-hidden transition-all duration-500 ease-out"
            >
              Ir Atrás
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};