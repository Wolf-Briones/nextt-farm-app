'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/game/research/Header';
import { Sidebar } from '@/components/game/research/Sidebar';
import { MainView } from '@/components/game/research/MainView';
import { Globe3DView } from '@/components/game/research/Globe3DView';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLayerPopup, setShowLayerPopup] = useState<boolean>(false);

  // Custom hook for animation
  useAnimation({ isPlaying, setSelectedDate });

  // Update image key and loading state when dependencies change
  useEffect(() => {
    setImageKey((prev) => prev + 1);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
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
    setShowLayerPopup(true);
    setTimeout(() => setShowLayerPopup(false), 5000);
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
  const imageUrl = getImageUrl(activeLayer, selectedDate, bbox);
  const coastlineUrl = getCoastlineUrl(bbox);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950">
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

        {/* Split View: 2D Map + 3D Globe */}
        <div className="flex-1 flex">
          {/* 2D Map View */}
          <div className="flex-1 relative border-r border-blue-500/20">
            <MainView
              imageUrl={imageUrl}
              coastlineUrl={coastlineUrl}
              layerOpacity={layerOpacity}
              showBase={showBase}
              showInfo={showInfo}
              selectedDate={selectedDate}
              imageKey={imageKey}
              layerName={activeLayerInfo?.name || 'Satellite layer'}
              onImageError={handleImageError}
              onCloseInfo={() => setShowInfo(false)}
              isLoading={isLoading}
              showLayerPopup={showLayerPopup}
              activeLayerInfo={activeLayerInfo}
            />
          </div>

          {/* 3D Globe View */}
          <div className="flex-1 relative">
            <Globe3DView
              imageUrl={imageUrl}
              activeLayerInfo={activeLayerInfo}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 flex items-center justify-between text-xs border-t border-blue-500/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 font-semibold">Sistema Operativo</span>
          </div>
          <div className="text-gray-400">
            Resolución: 1024x512 | Formato: {activeLayerInfo?.format.toUpperCase()}
          </div>
          <div className="text-gray-400">
            Proyección: EPSG:4326
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <span>NASA GIBS API</span>
          <span>•</span>
          <span>Actualizado: {new Date().toLocaleDateString('es-ES')}</span>
        </div>
      </footer>
    </div>
  );
};

export default NASAGIBSExplorer;