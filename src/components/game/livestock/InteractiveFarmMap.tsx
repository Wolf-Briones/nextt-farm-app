"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Animal {
  id: string;
  name: string;
  type: 'cow' | 'pig' | 'chicken' | 'sheep';
  health: number;
  stress: number;
  hunger: number;
  thirst: number;
  position: { x: number; y: number };
  target?: { x: number; y: number };
  activity: 'grazing' | 'resting' | 'drinking' | 'moving' | 'feeding' | 'seeking_shade';  // Added 'seeking_shade'
  selected: boolean;
}

interface Building {
  id: string;
  type: 'barn' | 'water' | 'feeder' | 'shade' | 'clinic';
  position: { x: number; y: number };
  size: { width: number; height: number };
  capacity?: number;
  active: boolean;
}

interface InteractiveFarmMapProps {
  animals: Animal[];
  onAnimalCommand: (animalId: string, command: string, target?: { x: number; y: number }) => void;
  onAnimalSelect: (animalId: string) => void;
}

const BUILDINGS: Building[] = [
  { id: 'barn1', type: 'barn', position: { x: 50, y: 50 }, size: { width: 120, height: 80 }, capacity: 20, active: true },
  { id: 'water1', type: 'water', position: { x: 300, y: 200 }, size: { width: 80, height: 60 }, active: true },
  { id: 'feeder1', type: 'feeder', position: { x: 200, y: 300 }, size: { width: 60, height: 40 }, active: true },
  { id: 'shade1', type: 'shade', position: { x: 400, y: 100 }, size: { width: 100, height: 60 }, active: true },
  { id: 'clinic1', type: 'clinic', position: { x: 500, y: 300 }, size: { width: 80, height: 60 }, active: true }
];

export default function InteractiveFarmMap({ animals, onAnimalCommand, onAnimalSelect }: InteractiveFarmMapProps) {
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [isDragging] = useState(false);
  const [dragStart] = useState<{ x: number; y: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; animalId: string } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const getBuildingIcon = (type: string) => {
    const icons = {
      barn: '🏠',
      water: '💧',
      feeder: '🌾',
      shade: '🌳',
      clinic: '🏥'
    };
    return icons[type as keyof typeof icons] || '🏢';
  };

  const getAnimalIcon = (type: string, activity: string) => {
    const baseIcons = { cow: '🐄', pig: '🐷', chicken: '🐔', sheep: '🐑' };
    const activityModifiers = {
      drinking: '💧',
      feeding: '🌾',
      resting: '😴'
    };
    
    return activity in activityModifiers ? 
      `${baseIcons[type as keyof typeof baseIcons]}${activityModifiers[activity as keyof typeof activityModifiers]}` : 
      baseIcons[type as keyof typeof baseIcons];
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return '#22c55e'; // green
    if (health >= 70) return '#eab308'; // yellow
    if (health >= 50) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const handleAnimalClick = (animal: Animal, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      // Multi-selección
      setSelectedAnimals(prev => 
        prev.includes(animal.id) 
          ? prev.filter(id => id !== animal.id)
          : [...prev, animal.id]
      );
    } else {
      setSelectedAnimals([animal.id]);
      onAnimalSelect(animal.id);
    }
  };

  const handleAnimalRightClick = (animal: Animal, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      animalId: animal.id
    });
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Si hay animales seleccionados, moverlos al punto clickeado
    if (selectedAnimals.length > 0) {
      selectedAnimals.forEach(animalId => {
        onAnimalCommand(animalId, 'move', { x, y });
      });
    } else {
      setSelectedAnimals([]);
    }
    setContextMenu(null);
  };

  const handleCommand = (command: string) => {
    if (contextMenu) {
      onAnimalCommand(contextMenu.animalId, command);
      setContextMenu(null);
    }
  };

  const handleBuildingClick = (building: Building) => {
    if (selectedAnimals.length > 0) {
      const command = building.type === 'water' ? 'drink' :
                    building.type === 'feeder' ? 'feed' :
                    building.type === 'shade' ? 'rest' :
                    building.type === 'clinic' ? 'heal' : 'move';
      
      selectedAnimals.forEach(animalId => {
        onAnimalCommand(animalId, command, building.position);
      });
    }
  };

  // Cerrar menú contextual al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Mapa principal */}
      <div 
        ref={mapRef}
        className="relative w-full h-96 bg-gradient-to-br from-green-800 via-green-600 to-green-700 rounded-lg overflow-hidden border-2 border-green-500 cursor-pointer"
        onClick={handleMapClick}
        style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 180, 83, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)' }}
      >
        {/* Grid del terreno */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Edificios fijos */}
        {BUILDINGS.map(building => (
          <motion.div
            key={building.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              building.active ? 'opacity-100' : 'opacity-50'
            }`}
            style={{
              left: building.position.x,
              top: building.position.y,
            }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              handleBuildingClick(building);
            }}
          >
            <div className="relative">
              <div 
                className="flex items-center justify-center bg-gray-800/80 rounded-lg border-2 border-gray-600 shadow-lg"
                style={{
                  width: building.size.width,
                  height: building.size.height
                }}
              >
                <span className="text-3xl">{getBuildingIcon(building.type)}</span>
              </div>
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {building.type.charAt(0).toUpperCase() + building.type.slice(1)}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Animales */}
        {animals.map(animal => (
          <motion.div
            key={animal.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedAnimals.includes(animal.id) ? 'z-20' : 'z-10'
            }`}
            style={{
              left: animal.position.x,
              top: animal.position.y,
            }}
            animate={animal.target ? {
              x: [0, animal.target.x - animal.position.x],
              y: [0, animal.target.y - animal.position.y]
            } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
            onClick={(e) => handleAnimalClick(animal, e)}
            onContextMenu={(e) => handleAnimalRightClick(animal, e)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              {/* Selección circular */}
              {selectedAnimals.includes(animal.id) && (
                <motion.div
                  className="absolute inset-0 w-12 h-12 border-3 border-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              
              {/* Icono del animal */}
              <div className="relative">
                <span className="text-2xl select-none">
                  {getAnimalIcon(animal.type, animal.activity)}
                </span>
                
                {/* Barra de vida */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${animal.health}%`,
                      backgroundColor: getHealthColor(animal.health)
                    }}
                  />
                </div>

                {/* Indicadores de estado */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {animal.hunger > 70 && <span className="text-xs">🌾</span>}
                  {animal.thirst > 70 && <span className="text-xs">💧</span>}
                  {animal.stress > 70 && <span className="text-xs">⚠️</span>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Área de selección múltiple (drag) */}
        {isDragging && dragStart && (
          <div
            className="absolute border-2 border-cyan-400 bg-cyan-400/20 pointer-events-none"
            style={{
              left: Math.min(dragStart.x, 0),
              top: Math.min(dragStart.y, 0),
              width: Math.abs(0 - dragStart.x),
              height: Math.abs(0 - dragStart.y)
            }}
          />
        )}
      </div>

      {/* Menú contextual */}
      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2 z-50"
          style={{
            left: contextMenu.x,
            top: contextMenu.y
          }}
        >
          <div className="space-y-1">
            <button
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center space-x-2"
              onClick={() => handleCommand('drink')}
            >
              <span>💧</span><span>Beber agua</span>
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center space-x-2"
              onClick={() => handleCommand('feed')}
            >
              <span>🌾</span><span>Alimentar</span>
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center space-x-2"
              onClick={() => handleCommand('rest')}
            >
              <span>😴</span><span>Descansar</span>
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center space-x-2"
              onClick={() => handleCommand('heal')}
            >
              <span>🏥</span><span>Curar</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Panel de controles */}
      <div className="mt-4 bg-gray-800 rounded-lg p-3 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Seleccionados: {selectedAnimals.length}
            </span>
            {selectedAnimals.length > 0 && (
              <button
                onClick={() => setSelectedAnimals([])}
                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
              >
                Deseleccionar
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Clic: Seleccionar • Clic derecho: Comandos • Ctrl+Clic: Múltiple
          </div>
        </div>
      </div>
    </div>
  );
}