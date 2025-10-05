import React from 'react';
import { Globe, Info, Download } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
        <header className="bg-gradient-to-r from-green-600 via-green-700 to-cyan-600 text-white p-3 shadow-lg z-20">
            <div className="mx-auto flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <Globe className="w-7 h-7" />
                    <div>
                        <h1 className="text-xl font-bold">NASA Earth Monitor</h1>
                        <p className="text-xs text-blue-100">Sistema de Monitoreo Satelital Global</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleInfo}
                        className={`px-3 py-2 rounded-lg transition-all ${showInfo ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
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
                    <Link
                        href="/game"
                        className="group flex items-center justify-center gap-2 px-4 py-2
                       bg-gradient-to-r from-emerald-800 via-green-900 to-cyan-500
                       text-white rounded-xl shadow-[0_0_15px_#00ff99]
                       hover:shadow-[0_0_30px_#00ffaa] transition-all duration-300
                       ease-out border border-emerald-400/30"
                    >
                        <ArrowLeft
                            className="w-5 h-5 text-white transition-transform duration-300 ease-out group-hover:-translate-x-1"
                        />
                        <span
                            className="opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[100px]
                         overflow-hidden transition-all duration-500 ease-out"
                        >
                            Regresar
                        </span>
                    </Link>
                </div>

            </div>

        </header>
    );
};