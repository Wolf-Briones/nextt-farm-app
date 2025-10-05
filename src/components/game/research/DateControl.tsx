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
    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-3">
      <label 
        htmlFor="date-picker" 
        className="flex items-center gap-2 text-xs font-semibold mb-2 text-blue-300"
      >
        <Calendar size={14} />
        Fecha de Observación
      </label>
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={onDateChange}
        max={new Date().toISOString().split('T')[0]}
        min="2000-01-01"
        className="w-full px-2 py-1.5 text-sm bg-gray-700 rounded border border-gray-600 focus:border-blue-400 focus:outline-none text-white"
      />
      
      <div className="flex gap-2 mt-2">
        <button
          onClick={onTogglePlay}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded transition-all ${
            isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pausar' : 'Animar'}
        </button>
        <button
          onClick={onSetToday}
          className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-all"
          aria-label="Set to today"
        >
          Hoy
        </button>
      </div>
    </div>
  );
};