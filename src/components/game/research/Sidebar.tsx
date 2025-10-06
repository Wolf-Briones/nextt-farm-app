import React from 'react';
import { LayerCategoryKey, LayerInfo } from '@/lib/types/layer.types';
import { DateControl } from '@/components/game/research/DateControl';
import { OpacityControl } from '@/components/game/research/OpacityControl';
import { RegionSelector } from '@/components/game/research/RegionSelector';
import { LayerSelector } from '@/components/game/research/LayerSelector';
import { ActiveLayerInfo } from '@/components/game/research/ActiveLayerInfo';

interface SidebarProps {
  selectedDate: string;
  isPlaying: boolean;
  layerOpacity: number;
  showBase: boolean;
  activeCategory: LayerCategoryKey | null;
  activeLayer: string;
  activeLayerInfo: LayerInfo | undefined;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePlay: () => void;
  onSetToday: () => void;
  onOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowBaseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRegion: (bbox: string) => void;
  onToggleCategory: (key: LayerCategoryKey) => void;
  onSelectLayer: (layerId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedDate,
  isPlaying,
  layerOpacity,
  showBase,
  activeCategory,
  activeLayer,
  activeLayerInfo,
  onDateChange,
  onTogglePlay,
  onSetToday,
  onOpacityChange,
  onShowBaseChange,
  onSelectRegion,
  onToggleCategory,
  onSelectLayer
}) => {
  return (
    <aside className="w-80 bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 text-white overflow-y-auto shadow-2xl border-r border-blue-500/20 custom-scrollbar">
      <div className="p-4 space-y-4">
        <DateControl
          selectedDate={selectedDate}
          isPlaying={isPlaying}
          onDateChange={onDateChange}
          onTogglePlay={onTogglePlay}
          onSetToday={onSetToday}
        />

        <OpacityControl
          layerOpacity={layerOpacity}
          showBase={showBase}
          onOpacityChange={onOpacityChange}
          onShowBaseChange={onShowBaseChange}
        />

        <RegionSelector onSelectRegion={onSelectRegion} />

        <LayerSelector
          activeCategory={activeCategory}
          activeLayer={activeLayer}
          onToggleCategory={onToggleCategory}
          onSelectLayer={onSelectLayer}
        />

        <ActiveLayerInfo layerInfo={activeLayerInfo} />
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </aside>
  );
};