'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/game/research/Header';
import { Sidebar } from '@/components/game/research/Sidebar';
import { MainView } from '@/components/game/research/MainView';
import { useAnimation } from '@/hooks/useAnimation';
import { getLayerInfo, getImageUrl, getCoastlineUrl } from '@/lib/utils/imageUtils';
import { DEFAULT_DATE, DEFAULT_LAYER, DEFAULT_BBOX } from '@/lib/const/locations';
import { LayerCategoryKey } from '@/lib/types/layer.types';

const NASAGIBSExplorer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(DEFAULT_DATE);
  const [activeLayer, setActiveLayer] = useState<string>(DEFAULT_LAYER);
  const [layerOpacity, setLayerOpacity] = useState<number>(100);
  const [showBase, setShowBase] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<LayerCategoryKey | null>('satellite');
  const [bbox, setBbox] = useState<string>(DEFAULT_BBOX);
  const [imageKey, setImageKey] = useState<number>(0);

  // Custom hook for animation
  useAnimation({ isPlaying, setSelectedDate });

  // Update image key when dependencies change
  useEffect(() => {
    setImageKey((prev) => prev + 1);
  }, [selectedDate, activeLayer, bbox]);

  // Handlers
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedDate(e.target.value);
  };

  const handleTogglePlay = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleSetToday = (): void => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLayerOpacity(Number(e.target.value));
  };

  const handleShowBaseChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowBase(e.target.checked);
  };

  const handleSelectRegion = (newBbox: string): void => {
    setBbox(newBbox);
  };

  const handleToggleCategory = (key: LayerCategoryKey): void => {
    setActiveCategory(activeCategory === key ? null : key);
  };

  const handleSelectLayer = (layerId: string): void => {
    setActiveLayer(layerId);
  };

  const handleToggleInfo = (): void => {
    setShowInfo(!showInfo);
  };

  const handleDownload = (): void => {
    const url = getImageUrl(activeLayer, selectedDate, bbox);
    window.open(url, '_blank');
  };

  const handleImageError = (): void => {
    console.error('Error loading image:', getImageUrl(activeLayer, selectedDate, bbox));
  };

  // Get current layer info
  const activeLayerInfo = getLayerInfo(activeLayer);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header
        showInfo={showInfo}
        onToggleInfo={handleToggleInfo}
        onDownload={handleDownload}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedDate={selectedDate}
          isPlaying={isPlaying}
          layerOpacity={layerOpacity}
          showBase={showBase}
          activeCategory={activeCategory}
          activeLayer={activeLayer}
          activeLayerInfo={activeLayerInfo}
          onDateChange={handleDateChange}
          onTogglePlay={handleTogglePlay}
          onSetToday={handleSetToday}
          onOpacityChange={handleOpacityChange}
          onShowBaseChange={handleShowBaseChange}
          onSelectRegion={handleSelectRegion}
          onToggleCategory={handleToggleCategory}
          onSelectLayer={handleSelectLayer}
        />

        <MainView
          imageUrl={getImageUrl(activeLayer, selectedDate, bbox)}
          coastlineUrl={getCoastlineUrl(bbox)}
          layerOpacity={layerOpacity}
          showBase={showBase}
          showInfo={showInfo}
          selectedDate={selectedDate}
          imageKey={imageKey}
          layerName={activeLayerInfo?.name || 'Satellite layer'}
          onImageError={handleImageError}
          onCloseInfo={() => setShowInfo(false)}
        />
      </div>
    </div>
  );
};

export default NASAGIBSExplorer;