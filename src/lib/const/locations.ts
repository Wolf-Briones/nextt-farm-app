import { LocationPreset } from '@/lib/types/layer.types';

export const LOCATION_PRESETS: LocationPreset[] = [
  { name: 'Global', bbox: '-180,-90,180,90' },
  { name: 'América del Norte', bbox: '-130,15,-60,55' },
  { name: 'Amazonas', bbox: '-75,-15,-45,5' },
  { name: 'Europa', bbox: '-10,35,40,70' },
  { name: 'África', bbox: '-20,-35,55,37' },
  { name: 'Asia', bbox: '60,5,150,55' },
  { name: 'Oceanía', bbox: '110,-45,180,-10' }
];

export const DEFAULT_BBOX = '-180,-90,180,90';
export const DEFAULT_DATE = '2024-03-16';
export const DEFAULT_LAYER = 'true_color';