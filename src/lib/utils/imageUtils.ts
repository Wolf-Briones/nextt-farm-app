import { LayerInfo } from '@/lib/types/layer.types';
import { LAYER_CATEGORIES } from '@/components/game/research/layers';

export const getLayerInfo = (layerId: string): LayerInfo | undefined => {
  return Object.values(LAYER_CATEGORIES)
    .flatMap((cat) => cat.layers)
    .find((l) => l.id === layerId);
};

export const getImageUrl = (
  layerId: string, 
  date: string, 
  bbox: string
): string => {
  const layer = getLayerInfo(layerId);
  if (!layer) return '';
  
  const baseUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    REQUEST: 'GetMap',
    VERSION: '1.3.0',
    LAYERS: layer.layer,
    TIME: date,
    CRS: 'EPSG:4326',
    BBOX: bbox,
    WIDTH: '1200',
    HEIGHT: '800',
    FORMAT: `image/${layer.format}`
  });
  
  return `${baseUrl}?${params.toString()}`;
};

export const getCoastlineUrl = (bbox: string): string => {
  const baseUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    REQUEST: 'GetMap',
    VERSION: '1.3.0',
    LAYERS: 'Coastlines',
    CRS: 'EPSG:4326',
    BBOX: bbox,
    WIDTH: '1200',
    HEIGHT: '800',
    FORMAT: 'image/png'
  });
  
  return `${baseUrl}?${params.toString()}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};