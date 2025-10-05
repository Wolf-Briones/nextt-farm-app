export interface LayerInfo {
  id: string;
  name: string;
  layer: string;
  description: string;
  format: 'jpeg' | 'png';
}

export interface LayerCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
  layers: LayerInfo[];
}

export interface LocationPreset {
  name: string;
  bbox: string;
}

export type LayerCategoryKey = 
  | 'satellite' 
  | 'fire' 
  | 'precipitation' 
  | 'temperature' 
  | 'drought' 
  | 'weather' 
  | 'night';