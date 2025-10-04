"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InteractiveFarmMap from "@/components/game/livestock/InteractiveFarmMap";

interface Animal {
    id: string;
    name: string;
    type: 'cow' | 'pig' | 'chicken' | 'sheep';
    health: number;
    temperature: number;
    stress: number;
    hunger: number;
    thirst: number;
    activity: 'grazing' | 'resting' | 'feeding' | 'seeking_shade' | 'drinking' | 'moving';
    position: { x: number; y: number };
    target?: { x: number; y: number };
    productivity: number;
    age: number;
    selected: boolean;
}

interface GameTime {
    hour: number;
    day: number;
    season: 'spring' | 'summer' | 'fall' | 'winter';
}

interface NASAEnvironmentData {
    temperature: number;
    soilMoisture: number;
    ndvi: number;
    humidity: number;
    uvIndex: number;
    windSpeed: number;
    heatStress: 'low' | 'medium' | 'high' | 'extreme';
}

// Sistema de tiempo acelerado del juego
const useGameTime = () => {
    const [gameTime, setGameTime] = useState<GameTime>({
        hour: 6,
        day: 1,
        season: 'spring'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setGameTime(prev => {
                const newHour = (prev.hour + 1) % 24;
                const newDay = newHour === 0 ? prev.day + 1 : prev.day;

                return {
                    hour: newHour,
                    day: newDay,
                    season: prev.season
                };
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return gameTime;
};

// Simulación de datos NASA
const useNASAData = (gameTime: GameTime) => {
    const [nasaData, setNasaData] = useState<NASAEnvironmentData>({
        temperature: 22,
        soilMoisture: 45,
        ndvi: 0.72,
        humidity: 65,
        uvIndex: 3,
        windSpeed: 12,
        heatStress: 'low'
    });

    useEffect(() => {
        const baseTemp = 22;
        const tempVariation = Math.sin((gameTime.hour - 6) * Math.PI / 12) * 12;
        const currentTemp = baseTemp + tempVariation + Math.random() * 2;

        const tempStress = currentTemp > 35 ? -0.1 : 0;
        const moistureBonus = nasaData.soilMoisture > 40 ? 0.05 : -0.05;

        setNasaData(prev => ({
            temperature: Math.max(15, Math.min(45, currentTemp)),
            soilMoisture: Math.max(20, Math.min(80, prev.soilMoisture + (Math.random() - 0.5) * 3)),
            ndvi: Math.max(0.3, Math.min(0.9, 0.72 + tempStress + moistureBonus + (Math.random() - 0.5) * 0.1)),
            humidity: Math.max(30, Math.min(90, 65 + (Math.random() - 0.5) * 10)),
            uvIndex: gameTime.hour >= 6 && gameTime.hour <= 18 ?
                Math.max(0, Math.sin((gameTime.hour - 6) * Math.PI / 12) * 10) : 0,
            windSpeed: Math.max(5, Math.min(25, prev.windSpeed + (Math.random() - 0.5) * 3)),
            heatStress: currentTemp > 38 ? 'extreme' :
                currentTemp > 35 ? 'high' :
                    currentTemp > 30 ? 'medium' : 'low'
        }));
    }, [gameTime.hour]);

    return nasaData;
};

// Simulación de animales con posiciones
const useAnimalSimulation = (gameTime: GameTime, nasaData: NASAEnvironmentData) => {
    const [animals, setAnimals] = useState<Animal[]>([
        {
            id: 'cow_001', name: 'Bella', type: 'cow', health: 95, temperature: 38.5,
            stress: 20, hunger: 30, thirst: 25, activity: 'grazing',
            position: { x: 150, y: 250 }, productivity: 85, age: 120, selected: false
        },
        {
            id: 'cow_002', name: 'Luna', type: 'cow', health: 88, temperature: 38.8,
            stress: 35, hunger: 45, thirst: 40, activity: 'resting',
            position: { x: 420, y: 130 }, productivity: 78, age: 90, selected: false
        },
        {
            id: 'pig_001', name: 'Porky', type: 'pig', health: 92, temperature: 39.0,
            stress: 15, hunger: 20, thirst: 30, activity: 'feeding',
            position: { x: 230, y: 320 }, productivity: 90, age: 60, selected: false
        },
        {
            id: 'sheep_001', name: 'Woolly', type: 'sheep', health: 96, temperature: 38.3,
            stress: 10, hunger: 25, thirst: 20, activity: 'grazing',
            position: { x: 350, y: 280 }, productivity: 88, age: 150, selected: false
        }
    ]);

    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

    // Actualizar comportamiento de animales
    useEffect(() => {
        setAnimals(prev => prev.map(animal => {
            const newAnimal = { ...animal };

            // Comportamiento automático basado en NASA data
            if (nasaData.heatStress === 'extreme' || nasaData.heatStress === 'high') {
                newAnimal.stress = Math.min(100, newAnimal.stress + 5);
                if (newAnimal.activity !== 'moving') {
                    newAnimal.activity = 'seeking_shade';
                }
                newAnimal.temperature = Math.min(41, newAnimal.temperature + 0.2);
            }

            if (nasaData.temperature > 30) {
                newAnimal.thirst = Math.min(100, newAnimal.thirst + 3);
            }

            if (nasaData.ndvi < 0.5) {
                newAnimal.hunger = Math.min(100, newAnimal.hunger + 4);
            } else if (nasaData.ndvi > 0.7) {
                newAnimal.hunger = Math.max(0, newAnimal.hunger - 2);
            }

            // Salud general
            const stressImpact = newAnimal.stress > 70 ? -1 : 0;
            const nutritionImpact = newAnimal.hunger > 80 ? -2 : newAnimal.hunger < 30 ? 1 : 0;
            newAnimal.health = Math.max(50, Math.min(100, newAnimal.health + stressImpact + nutritionImpact + (Math.random() - 0.5)));

            newAnimal.productivity = Math.max(40, Math.min(100,
                newAnimal.health * 0.7 + (100 - newAnimal.stress) * 0.3
            ));

            return newAnimal;
        }));
    }, [gameTime.hour, nasaData]);

    // Manejar comandos de animales
    const handleAnimalCommand = (animalId: string, command: string, target?: { x: number; y: number }) => {
        setAnimals(prev => prev.map(animal => {
            if (animal.id !== animalId) return animal;

            const updatedAnimal = { ...animal };

            switch (command) {
                case 'move':
                    if (target) {
                        updatedAnimal.target = target;
                        updatedAnimal.activity = 'moving';
                        // Simular movimiento actualizar posición después de un tiempo
                        setTimeout(() => {
                            setAnimals(current => current.map(a =>
                                a.id === animalId ? { ...a, position: target, target: undefined, activity: 'grazing' } : a
                            ));
                        }, 2000);
                    }
                    break;
                case 'drink':
                    updatedAnimal.activity = 'drinking';
                    updatedAnimal.thirst = Math.max(0, updatedAnimal.thirst - 30);
                    updatedAnimal.stress = Math.max(0, updatedAnimal.stress - 10);
                    setTimeout(() => {
                        setAnimals(current => current.map(a =>
                            a.id === animalId ? { ...a, activity: 'grazing' } : a
                        ));
                    }, 3000);
                    break;
                case 'feed':
                    updatedAnimal.activity = 'feeding';
                    updatedAnimal.hunger = Math.max(0, updatedAnimal.hunger - 40);
                    updatedAnimal.stress = Math.max(0, updatedAnimal.stress - 5);
                    setTimeout(() => {
                        setAnimals(current => current.map(a =>
                            a.id === animalId ? { ...a, activity: 'grazing' } : a
                        ));
                    }, 4000);
                    break;
                case 'rest':
                    updatedAnimal.activity = 'resting';
                    updatedAnimal.stress = Math.max(0, updatedAnimal.stress - 20);
                    setTimeout(() => {
                        setAnimals(current => current.map(a =>
                            a.id === animalId ? { ...a, activity: 'grazing' } : a
                        ));
                    }, 5000);
                    break;
                case 'heal':
                    updatedAnimal.health = Math.min(100, updatedAnimal.health + 15);
                    updatedAnimal.stress = Math.max(0, updatedAnimal.stress - 15);
                    break;
            }

            return updatedAnimal;
        }));
    };

    const handleAnimalSelect = (animalId: string) => {
        const animal = animals.find(a => a.id === animalId);
        setSelectedAnimal(animal || null);
    };

    return {
        animals,
        selectedAnimal,
        handleAnimalCommand,
        handleAnimalSelect
    };
};

// Componentes auxiliares
const GameClock = ({ gameTime }: { gameTime: GameTime }) => {
    const getTimeOfDay = () => {
        if (gameTime.hour >= 6 && gameTime.hour < 12) return { period: 'Mañana', icon: '🌅' };
        if (gameTime.hour >= 12 && gameTime.hour < 18) return { period: 'Tarde', icon: '☀️' };
        if (gameTime.hour >= 18 && gameTime.hour < 22) return { period: 'Noche', icon: '🌇' };
        return { period: 'Madrugada', icon: '🌙' };
    };

    const timeInfo = getTimeOfDay();

    return (
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">{timeInfo.icon}</span>
                    <div>
                        <div className="text-lg font-bold text-cyan-400">
                            {String(gameTime.hour).padStart(2, '0')}:00
                        </div>
                        <div className="text-xs text-gray-400">{timeInfo.period}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-white">Día {gameTime.day}</div>
                    <div className="text-xs text-gray-400 capitalize">{gameTime.season}</div>
                </div>
            </div>
        </div>
    );
};

const NASADataPanel = ({ data }: { data: NASAEnvironmentData }) => {
    const getHeatStressColor = (level: string) => {
        const colors = {
            low: 'text-green-400',
            medium: 'text-yellow-400',
            high: 'text-orange-400',
            extreme: 'text-red-400'
        };
        return colors[level as keyof typeof colors];
    };

    return (
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">🛰️</span>
                <h3 className="text-lg font-semibold text-cyan-400">Datos NASA</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-600 p-3 rounded">
                    <div className="text-blue-400 text-lg font-bold">{data.soilMoisture.toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">Humedad Suelo</div>
                </div>

                <div className="bg-gray-600 p-3 rounded">
                    <div className="text-green-400 text-lg font-bold">{data.ndvi.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">NDVI Pasto</div>
                </div>

                <div className="bg-gray-600 p-3 rounded">
                    <div className={`text-lg font-bold ${getHeatStressColor(data.heatStress)}`}>
                        {data.heatStress.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">Estrés Térmico</div>
                </div>
            </div>

            <div className="mt-3 text-xs text-gray-400 space-y-1">
                <div>• SMAP: Humedad del suelo</div>
                <div>• MODIS: Vegetación (NDVI)</div>
                <div>• Weather: Condiciones climáticas</div>
            </div>
        </div>
    );
};

const AnimalDetailsPanel = ({ animal }: { animal: Animal | null }) => {
    if (!animal) {
        return (
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="text-center py-8">
                    <span className="text-4xl mb-2 block">🐄</span>
                    <p className="text-gray-400">Selecciona un animal en el mapa</p>
                    <p className="text-gray-500 text-xs">Clic para ver detalles</p>
                </div>
            </div>
        );
    }

    const getHealthColor = (value: number) => {
        if (value >= 90) return 'text-green-400';
        if (value >= 70) return 'text-yellow-400';
        if (value >= 50) return 'text-orange-400';
        return 'text-red-400';
    };

    const getAnimalIcon = () => {
        const icons = { cow: '🐄', pig: '🐷', chicken: '🐔', sheep: '🐑' };
        return icons[animal.type];
    };

    return (
        <motion.div
            key={animal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
        >
            <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{getAnimalIcon()}</span>
                <div>
                    <h3 className="text-lg font-bold text-white">{animal.name}</h3>
                    <p className="text-sm text-gray-400">ID: {animal.id}</p>
                </div>
            </div>

            {/* Barras de estado */}
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Salud</span>
                        <span className={`font-bold ${getHealthColor(animal.health)}`}>
                            {animal.health.toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${animal.health >= 90 ? 'bg-green-500' :
                                animal.health >= 70 ? 'bg-yellow-500' :
                                    animal.health >= 50 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${animal.health}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Estrés</span>
                        <span className="text-red-400 font-bold">{animal.stress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                            className="bg-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${animal.stress}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Productividad</span>
                        <span className="text-blue-400 font-bold">{animal.productivity.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${animal.productivity}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Estado actual */}
            <div className="mt-4 bg-gray-600 p-3 rounded">
                <div className="text-sm text-gray-300 mb-2">Estado Actual</div>
                <div className="flex items-center justify-between">
                    <span className="text-white capitalize">{animal.activity}</span>
                    <span className="text-gray-400">{animal.temperature.toFixed(1)}°C</span>
                </div>

                <div className="mt-2 flex space-x-2">
                    {animal.hunger > 70 && (
                        <span className="text-xs bg-yellow-900 text-yellow-400 px-2 py-1 rounded">
                            Hambriento
                        </span>
                    )}
                    {animal.thirst > 70 && (
                        <span className="text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded">
                            Sediento
                        </span>
                    )}
                    {animal.stress > 70 && (
                        <span className="text-xs bg-red-900 text-red-400 px-2 py-1 rounded">
                            Estresado
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default function AnimalInterface() {
    const gameTime = useGameTime();
    const nasaData = useNASAData(gameTime);
    const { animals, selectedAnimal, handleAnimalCommand, handleAnimalSelect } = useAnimalSimulation(gameTime, nasaData);

    // Estadísticas generales
    const avgHealth = animals.reduce((sum, animal) => sum + animal.health, 0) / animals.length;
    const avgProductivity = animals.reduce((sum, animal) => sum + animal.productivity, 0) / animals.length;
    const highStressAnimals = animals.filter(animal => animal.stress > 70).length;

    return (
        <div className="h-full space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">🐄</span>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Mundo Animal</h2>
                        <p className="text-gray-400">Sistema integrado NASA • Tiempo real acelerado</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="bg-gray-800 px-3 py-1 rounded border border-gray-600">
                        <span className="text-green-400 text-sm">Salud: {avgHealth.toFixed(0)}%</span>
                    </div>
                    <div className="bg-gray-800 px-3 py-1 rounded border border-gray-600">
                        <span className="text-blue-400 text-sm">Productividad: {avgProductivity.toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            {/* Alertas rápidas */}
            {(highStressAnimals > 0 || nasaData.heatStress === 'extreme') && (
                <motion.div
                    className="bg-red-900/50 border border-red-500 rounded-lg p-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-red-400 text-xl animate-pulse">⚠️</span>
                        <div className="text-red-300">
                            {nasaData.heatStress === 'extreme' && "¡Estrés térmico extremo detectado! "}
                            {highStressAnimals > 0 && `${highStressAnimals} animal(es) con alto estrés`}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Área principal con mapa y paneles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Mapa interactivo - ocupa 2 columnas */}
                <div className="lg:col-span-2">
                    <InteractiveFarmMap
                        animals={animals}
                        onAnimalCommand={handleAnimalCommand}
                        onAnimalSelect={handleAnimalSelect}
                    />
                </div>

                {/* Paneles laterales */}
                <div className="space-y-4">
                    <GameClock gameTime={gameTime} />
                    <NASADataPanel data={nasaData} />
                    <AnimalDetailsPanel animal={selectedAnimal} />
                </div>
            </div>

            {/* Footer con información del sistema */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <div>Sistema temporal: 2 seg = 1 hora • Día {gameTime.day} • Hora {gameTime.hour}:00</div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>NASA Data Live</span>
                    </div>
                </div>
            </div>
        </div>
    );
}