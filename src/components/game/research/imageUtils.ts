import { LAYER_CATEGORIES } from '@/components/game/research/layers';
import { LayerInfo } from '@/lib/types/layer.types';

const GIBS_BASE_URL = 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best';

/**
 * Gets layer information by ID
 */
export const getLayerInfo = (layerId: string): LayerInfo | undefined => {
  for (const category of Object.values(LAYER_CATEGORIES)) {
    const layer = category.layers.find((l) => l.id === layerId);
    if (layer) return layer;
  }
  return undefined;
};

/**
 * Formats date for display
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generates optimized image URL for NASA GIBS WMTS
 * Uses 4096x2048 (2:1 ratio) for high-resolution equirectangular projection
 */
export const getImageUrl = (
  layerId: string,
  date: string,
  bbox: string
): string => {
  const layerInfo = getLayerInfo(layerId);
  if (!layerInfo) return '';

  const format = layerInfo.format;
  
  // Use 4096x2048 (double height) for higher detail
  const width = 4096;
  const height = 2048;

  // WMTS endpoint - no bbox parameter needed
  return `${GIBS_BASE_URL}/${layerInfo.layer}/default/${date}/EPSG4326_250m/${width}x${height}.${format}`;
};

/**
 * Generates globe texture URL with global coverage
 */
export const getGlobeTextureUrl = (layerId: string, date: string): string => {
  const layerInfo = getLayerInfo(layerId);
  if (!layerInfo) return '';

  const format = layerInfo.format;
  
  // Use 2048x1024 for optimal globe texture (2:1 ratio)
  return `${GIBS_BASE_URL}/${layerInfo.layer}/default/${date}/EPSG4326_250m/2048x1024.${format}`;
};

/**
 * Gets coastline overlay URL
 */
export const getCoastlineUrl = (bbox: string): string => {
  // Use 2048x1024 for proper 2:1 ratio
  return `${GIBS_BASE_URL}/Coastlines/default/2012-02-22/EPSG4326_250m/2048x1024.png`;
};

/**
 * Normalizes bbox to ensure proper format
 */
export const normalizeBbox = (bbox: string): string => {
  const parts = bbox.split(',').map(parseFloat);
  if (parts.length !== 4) return bbox;
  
  // Ensure proper order: minLon, minLat, maxLon, maxLat
  return `${parts[0]},${parts[1]},${parts[2]},${parts[3]}`;
};

/**
 * Calculates optimal image dimensions based on bbox aspect ratio
 */
export const getOptimalDimensions = (bbox: string): { width: number; height: number } => {
  const parts = bbox.split(',').map(parseFloat);
  const [minLon, minLat, maxLon, maxLat] = parts;
  
  const lonDiff = maxLon - minLon;
  const latDiff = maxLat - minLat;
  const aspectRatio = lonDiff / latDiff;
  
  // Base width for high quality
  const baseWidth = 2048;
  
  // Calculate height maintaining aspect ratio
  let height = Math.round(baseWidth / aspectRatio);
  
  // Ensure dimensions are within reasonable bounds
  if (height > 2048) {
    height = 2048;
  }
  if (height < 512) {
    height = 512;
  }
  
  return { width: baseWidth, height };
};