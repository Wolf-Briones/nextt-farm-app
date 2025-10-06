import React from 'react';
import { Calendar, Play, Pause } from 'lucide-react';

interface DateControlProps {
  selectedDate: string;
  isPlaying: boolean;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePlay: () => void;
  onSetToday: () => void;
}

export const DateControl: React.FC<DateControlProps> = ({
  selectedDate,
  isPlaying,
  onDateChange,
  onTogglePlay,
  onSetToday
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-4 shadow-lg">
      <label 
        htmlFor="date-picker" 
        className="flex items-center gap-2 text-sm font-semibold mb-3 text-blue-300"
      >
        <Calendar size={16} />
        Fecha de Observación
      </label>
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={onDateChange}
        max={new Date().toISOString().split('T')[0]}
        min="2000-01-01"
        className="w-full px-3 py-2 text-sm bg-gray-700/80 rounded-lg border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none text-white transition-all"
      />
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={onTogglePlay}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all font-semibold shadow-lg ${
            isPlaying 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/50' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/50'
          }`}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pausar' : 'Animar'}
        </button>
        <button
          onClick={onSetToday}
          className="px-4 py-2.5 text-sm bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all font-semibold shadow-lg"
          aria-label="Set to today"
        >
          Hoy
        </button>
      </div>
    </div>
  );
};