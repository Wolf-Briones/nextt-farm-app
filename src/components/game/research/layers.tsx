import React from 'react';
import { 
  Globe, 
  Flame, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  Cloud, 
  Moon 
} from 'lucide-react';
import { LayerCategory, LayerCategoryKey } from '@/lib/types/layer.types';

export const LAYER_CATEGORIES: Record<LayerCategoryKey, LayerCategory> = {
  satellite: {
    name: 'Imágenes Satelitales',
    icon: <Globe size={18} />,
    color: 'blue',
    layers: [
      {
        id: 'true_color',
        name: 'Terra MODIS - Color Verdadero',
        layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        description: 'Vista natural de la Tierra con luz solar reflejada, capturando océanos, continentes y nubes en color real',
        format: 'jpeg'
      },
      {
        id: 'aqua_true_color',
        name: 'Aqua MODIS - Color Verdadero',
        layer: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
        description: 'Imágenes del satélite Aqua optimizadas para observación oceánica y ciclos de agua',
        format: 'jpeg'
      },
      {
        id: 'viirs_true_color',
        name: 'VIIRS SNPP - Color Verdadero',
        layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
        description: 'Alta resolución de 375m para detalles precisos de superficie terrestre',
        format: 'jpeg'
      }
    ]
  },
  fire: {
    name: 'Mapa de Incendios',
    icon: <Flame size={18} />,
    color: 'red',
    layers: [
      {
        id: 'terra_fires',
        name: 'Incendios Activos (Terra)',
        layer: 'MODIS_Terra_Thermal_Anomalies_All',
        description: 'Detección de anomalías térmicas y fuegos activos mediante análisis infrarrojo térmico en tiempo real',
        format: 'png'
      },
      {
        id: 'aqua_fires',
        name: 'Incendios Activos (Aqua)',
        layer: 'MODIS_Aqua_Thermal_Anomalies_All',
        description: 'Sistema complementario de detección térmica para cobertura global continua',
        format: 'png'
      },
      {
        id: 'viirs_fires',
        name: 'Incendios HD (VIIRS 375m)',
        layer: 'VIIRS_SNPP_Thermal_Anomalies_375m_All',
        description: 'Resolución ultra-alta para detección precisa de incendios pequeños y focos activos',
        format: 'png'
      }
    ]
  },
  precipitation: {
    name: 'Mapa de Lluvias',
    icon: <Droplets size={18} />,
    color: 'cyan',
    layers: [
      {
        id: 'precipitation_rate',
        name: 'Precipitación en Tiempo Real',
        layer: 'IMERG_Precipitation_Rate',
        description: 'Tasa de lluvia actual medida en mm/hora por satélites GPM (Global Precipitation Measurement)',
        format: 'png'
      }
    ]
  },
  temperature: {
    name: 'Mapa de Calor',
    icon: <Thermometer size={18} />,
    color: 'orange',
    layers: [
      {
        id: 'lst_day',
        name: 'Temperatura Superficial - Día',
        layer: 'MODIS_Terra_Land_Surface_Temp_Day',
        description: 'Temperatura de la superficie terrestre durante el día, indicador clave de calor urbano y sequía',
        format: 'png'
      },
      {
        id: 'lst_night',
        name: 'Temperatura Superficial - Noche',
        layer: 'MODIS_Terra_Land_Surface_Temp_Night',
        description: 'Temperatura nocturna de superficie para análisis de retención térmica',
        format: 'png'
      },
      {
        id: 'sea_temp',
        name: 'Temperatura del Mar',
        layer: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
        description: 'Temperatura oceánica superficial con resolución de 1km para monitoreo climático',
        format: 'png'
      }
    ]
  },
  drought: {
    name: 'Mapa de Sequía',
    icon: <AlertTriangle size={18} />,
    color: 'yellow',
    layers: [
      {
        id: 'ndvi',
        name: 'Índice de Vegetación (NDVI)',
        layer: 'MODIS_Terra_NDVI_8Day',
        description: 'Indicador de salud vegetal y detección temprana de sequía mediante reflectancia infrarroja',
        format: 'png'
      },
      {
        id: 'snow_cover',
        name: 'Cobertura de Nieve',
        layer: 'MODIS_Terra_Snow_Cover',
        description: 'Monitoreo de cobertura nivosa para recursos hídricos y análisis estacional',
        format: 'png'
      }
    ]
  },
  weather: {
    name: 'Clima y Atmósfera',
    icon: <Cloud size={18} />,
    color: 'purple',
    layers: [
      {
        id: 'cloud_top',
        name: 'Temperatura de Nubes',
        layer: 'MODIS_Terra_Cloud_Top_Temp_Day',
        description: 'Altura y temperatura de topes nubosos para predicción meteorológica',
        format: 'png'
      },
      {
        id: 'water_vapor',
        name: 'Vapor de Agua',
        layer: 'MODIS_Terra_Water_Vapor_5km_Day',
        description: 'Contenido de humedad atmosférica para análisis de precipitación',
        format: 'png'
      }
    ]
  },
  night: {
    name: 'Luces Nocturnas',
    icon: <Moon size={18} />,
    color: 'indigo',
    layers: [
      {
        id: 'black_marble',
        name: 'Black Marble',
        layer: 'VIIRS_Black_Marble',
        description: 'Luces artificiales y actividad humana nocturna, indicador de urbanización',
        format: 'png'
      }
    ]
  }
};