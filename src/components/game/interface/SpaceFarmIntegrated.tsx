// SpaceFarmIntegrated.tsx - VERSIÓN COMPLETA INTEGRADA
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParcelMap } from "@/components/game/crops/sowing/ParcelMap";
import { CropSelector } from "@/components/game/crops/sowing/CropSelector";
import { DecisionCards } from "@/components/game/crops/sowing/DecisionCards";
import MiniGame from "@/components/game/crops/minigames/MinigamesSystem";
import RewardsSystem from "@/components/game/crops/rewards/RewardsSystem";
import UpdateTime from "@/components/game/crops/UpdateTime";
import { useNASAData, type UseNASADataReturn } from "@/hooks/useNASAData";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useAutoWatering } from "@/hooks/useAutoWatering";
import type { ParcelState, CropType } from "@/lib/types/crops";
import EarlyWarning, { type RegionConfig, type WeatherData } from "@/components/game/crops/alerts/EarlyWarning";
import ActiveAlerts from "@/components/game/crops/alerts/ActiveAlerts";

type GameMode = 'cultivar' | 'minijuegos' | 'logros' | 'alertas';

type NotificationAlert = {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: Date;
};

type NotificationSystem = {
    alerts: NotificationAlert[];
};

const createInitialParcels = (): ParcelState[] =>
    Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        crop: null,
        plantedDate: null,
        growthStage: 0,
        health: 100,
        waterLevel: 80,
        fertilizerLevel: 50,
        pestLevel: Math.random() * 20,
        ndviValue: 0.45,
        soilMoisture: 45,
        temperature: 22.0,
        isSelected: i === 0,
        lastAction: "Ninguna",
        daysToHarvest: 0,
        hasPestsAppeared: false,
    }));

const DynamicRightPanel = ({
    mode,
    nasaData,
    parcels,
    onApplyAction,
    onAutoWatering,
    currentMoney,
    selectedAlertRegion,
    selectedAlertWeather,
}: {
    mode: GameMode;
    nasaData: UseNASADataReturn['nasaData'];
    parcels: ParcelState[];
    onApplyAction: (parcelId: number, action: string, cost: number) => void;
    onAutoWatering: (parcelId: number) => void;
    currentMoney: number;
    selectedAlertRegion: RegionConfig | null;
    selectedAlertWeather: WeatherData | null;
}) => {
    const getRightPanelContent = () => {
        switch (mode) {
            case 'cultivar':
                return {
                    title: '🎯 Panel de Decisiones NASA',
                    content: (
                        <DecisionCards
                            parcels={parcels}
                            nasaData={nasaData}
                            onApplyAction={onApplyAction}
                            onAutoWatering={onAutoWatering}
                        />
                    )
                };

            case 'alertas':
                if (selectedAlertRegion && selectedAlertWeather) {
                    return {
                        title: '🚨 Alertas y Decisiones',
                        content: (
                            <ActiveAlerts
                                weatherData={selectedAlertWeather}
                                regionConfig={selectedAlertRegion}
                                isLoading={false}
                            />
                        )
                    };
                }
                

            default:
                return {
                    title: '📊 Estado del Sistema',
                    content: (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-lg font-bold text-white mb-2">Panel de Control</h3>
                            <p className="text-gray-400 text-sm">Selecciona un modo para ver información</p>
                        </div>
                    )
                };
        }
    };

    const panelContent = getRightPanelContent();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={mode}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    {panelContent.title}
                </h3>
                <div className="h-[calc(100%-60px)] overflow-y-auto">
                    {panelContent.content}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

const EnhancedSatelliteView = ({
    nasaData,
    userLocation
}: {
    nasaData: UseNASADataReturn['nasaData'];
    userLocation: UseNASADataReturn['userLocation'];
}) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                    🛰️ Vista Satelital NASA
                </h3>
                <div className="flex items-center gap-2">
                    <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-green-400 text-xs">LIVE</span>
                </div>
            </div>

            {userLocation && (
                <div className="mb-4 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
                    <div className="text-xs text-blue-400">
                        📍 {userLocation.city || 'Ubicación Actual'}{userLocation.country ? `, ${userLocation.country}` : ''}
                    </div>
                    <div className="text-xs text-gray-400">
                        Lat: {userLocation.latitude.toFixed(4)}, Lon: {userLocation.longitude.toFixed(4)}
                    </div>
                </div>
            )}

            <div className="relative h-48 bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden mb-4">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="border border-green-500/10"
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 3, delay: i * 0.05, repeat: Infinity }}
                        />
                    ))}
                </div>

                <motion.div
                    className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-full h-full border-2 border-cyan-400/30 rounded-full relative">
                        <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-cyan-400 via-cyan-300 to-transparent -translate-x-1/2" />
                    </div>
                </motion.div>
            </div>

            {nasaData && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-400">💧</span>
                            <span className="text-white text-sm font-medium">SMAP</span>
                        </div>
                        <div className="text-blue-400 font-bold text-center">
                            {nasaData.soilMoisture.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400 text-center">Humedad Suelo</div>
                    </div>

                    <div className="bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-green-400">🌿</span>
                            <span className="text-white text-sm font-medium">MODIS</span>
                        </div>
                        <div className="text-green-400 font-bold text-center">
                            {nasaData.globalNDVI.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-400 text-center">NDVI</div>
                    </div>

                    <div className="bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-orange-400">🌡️</span>
                            <span className="text-white text-sm font-medium">POWER</span>
                        </div>
                        <div className="text-orange-400 font-bold text-center">
                            {nasaData.temperature.toFixed(1)}°C
                        </div>
                        <div className="text-xs text-gray-400 text-center">Temperatura</div>
                    </div>

                    <div className="bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-purple-400">☔</span>
                            <span className="text-white text-sm font-medium">GPM</span>
                        </div>
                        <div className="text-purple-400 font-bold text-center">
                            {nasaData.precipitation.toFixed(1)}mm
                        </div>
                        <div className="text-xs text-gray-400 text-center">Precipitación</div>
                    </div>
                </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-700">
                <UpdateTime nasaData={{ lastUpdate: nasaData.lastUpdate }} />
            </div>
        </div>
    );
};

const DynamicContentPanel = ({
    mode,
    parcels,
    selectedCrop,
    onSelectCrop,
    onSelectParcel,
    autoWateringParcels,
    onManualWatering,
    playerMoney,
    onRegionChange,
}: {
    mode: GameMode;
    parcels: ParcelState[];
    selectedCrop: CropType | null;
    onSelectCrop: (crop: CropType) => void;
    onSelectParcel: (parcelId: number) => void;
    autoWateringParcels: Set<number>;
    onManualWatering: (parcelId: number, event: React.MouseEvent) => void;
    playerMoney: number;
    onRegionChange: (region: RegionConfig, weather: WeatherData) => void;
}) => {
    const getModeContent = () => {
        switch (mode) {
            case "cultivar":
                return {
                    title: "🌱 Gestión de Cultivos NASA",
                    content: (
                        <div className="h-full space-y-4">
                            <CropSelector
                                selectedCrop={selectedCrop}
                                onSelectCrop={onSelectCrop}
                                playerMoney={playerMoney}
                            />
                            <div className="flex-1">
                                <ParcelMap
                                    parcels={parcels}
                                    onSelectParcel={onSelectParcel}
                                    selectedCrop={selectedCrop}
                                    autoWateringParcels={autoWateringParcels}
                                    onManualWatering={onManualWatering}
                                />
                            </div>
                        </div>
                    ),
                };

            case 'minijuegos':
                return {
                    title: '🎮 Minijuegos Educativos',
                    content: <MiniGame />
                };
            case 'logros':
                return {
                    title: '🏆 Logros y Recompensas',
                    content: <RewardsSystem />
                };
            case 'alertas':
                return {
                    title: '🚨 Sistema de Alertas',
                    content: <EarlyWarning onRegionChange={onRegionChange} />
                };
            default:
                return {
                    title: '🚀 SpaceFarm',
                    content: (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-6">🚀</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Agricultura Inteligente</h3>
                        </div>
                    )
                };
        }
    };

    const content = getModeContent();

    return (
        <motion.div
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-xl font-bold text-white mb-6">{content.title}</h2>
            <div className="h-[calc(100%-60px)] overflow-y-auto">
                {content.content}
            </div>
        </motion.div>
    );
};

const NotificationSystem = ({ notifications }: { notifications: NotificationSystem }) => {
    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            <AnimatePresence>
                {notifications.alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 max-w-sm shadow-lg ${alert.type === 'success' ? 'bg-green-900/90 border-green-500' :
                                alert.type === 'warning' ? 'bg-yellow-900/90 border-yellow-500' :
                                    alert.type === 'error' ? 'bg-red-900/90 border-red-500' :
                                        'bg-blue-900/90 border-blue-500'
                            }`}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h4 className="font-bold text-white mb-1">{alert.title}</h4>
                        <p className="text-gray-300 text-sm">{alert.message}</p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default function SpaceFarmIntegrated() {
    const [selectedMode, setSelectedMode] = useState<GameMode>('cultivar');
    const [notifications, setNotifications] = useState<NotificationSystem>({ alerts: [] });
    const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);

    // ESTADOS PARA SISTEMA DE ALERTAS
    const [selectedAlertRegion, setSelectedAlertRegion] = useState<RegionConfig | null>(null);
    const [selectedAlertWeather, setSelectedAlertWeather] = useState<WeatherData | null>(null);

    const { nasaData, isLoading: nasaLoading, userLocation } = useNASAData({ enableGeolocation: true });

    const [localParcels] = useState<ParcelState[]>(createInitialParcels);
    const [localMoney, setLocalMoney] = useState(1000);
    const [localXP, setLocalXP] = useState(0);
    const [previousMoney, setPreviousMoney] = useState(1000);
    const [hasAnyPlantedCrop, setHasAnyPlantedCrop] = useState(false);

    const updateMoney = setLocalMoney;
    const updateXP = (_xp: number, _currentXP: number) => setLocalXP(_xp);

    const { parcels, gameDay, setParcels, handleSelectParcel, applyAction } = useGameLogic(
        localParcels,
        nasaData.temperature,
        nasaData.soilMoisture
    );

    const { autoWateringParcels, activateAutoWatering, registerManualAction } = useAutoWatering(
        parcels,
        setParcels,
        setLocalMoney,
        localMoney
    );

    // CALLBACK PARA MANEJAR CAMBIO DE REGIÓN
    const handleRegionChange = (region: RegionConfig, weather: WeatherData) => {
        setSelectedAlertRegion(region);
        setSelectedAlertWeather(weather);
    };

    useEffect(() => {
        const hasCrops = parcels.some(p => p.crop !== null);
        setHasAnyPlantedCrop(hasCrops);
    }, [parcels]);

    const addNotification = (notification: Omit<NotificationAlert, 'id' | 'timestamp'>) => {
        const newNotification: NotificationAlert = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date()
        };

        setNotifications(prev => ({
            alerts: [newNotification, ...prev.alerts.slice(0, 4)]
        }));

        setTimeout(() => {
            setNotifications(prev => ({
                alerts: prev.alerts.filter(alert => alert.id !== newNotification.id)
            }));
        }, 5000);
    };

    useEffect(() => {
        if (localMoney < previousMoney && (previousMoney - localMoney) === 5) {
            const parcelRegada = parcels.find(p =>
                p.lastAction.includes('IoT') &&
                autoWateringParcels.has(p.id)
            );

            if (parcelRegada) {
                addNotification({
                    type: 'info',
                    title: '🤖 Riego IoT Ejecutado',
                    message: `Sistema IoT regó parcela ${parcelRegada.id}. Cobro: -$5 (Balance: $${localMoney})`
                });
            }
        }
        setPreviousMoney(localMoney);
    }, [localMoney, previousMoney, parcels, autoWateringParcels]);

    useEffect(() => {
        if (localMoney === 19 && previousMoney >= 20) {
            addNotification({
                type: 'warning',
                title: '⚠️ IoT Desactivándose',
                message: `Dinero: $${localMoney}. Con menos de $20, solo riego manual disponible (GRATIS).`
            });
        }

        if (localMoney < 20 && localMoney > 0 && previousMoney >= 20) {
            addNotification({
                type: 'error',
                title: '🔴 IoT Desactivado',
                message: 'Dinero < $20. Usa riego manual GRATIS hasta que coseches y obtengas más dinero.'
            });
        }
    }, [localMoney, previousMoney]);

    const handleParcelSelect = (parcelId: number) => {
        handleSelectParcel(
            parcelId,
            selectedCrop,
            localMoney,
            updateMoney,
            updateXP,
            localXP
        );

        if (selectedCrop) {
            addNotification({
                type: 'success',
                title: '🌱 Cultivo Plantado',
                message: `${selectedCrop.name} plantado en parcela ${parcelId}. IoT se activará en 3s si agua < 50%.`
            });
            setSelectedCrop(null);
        }
    };

    const handleManualWatering = (parcelId: number, event: React.MouseEvent) => {
        event.stopPropagation();

        const parcel = parcels.find(p => p.id === parcelId);

        if (!parcel || !parcel.crop) {
            console.warn(`No se puede regar parcela ${parcelId}: sin cultivo`);
            return;
        }

        const waterNeeded = parcel.crop.waterNeeds;
        const waterToAdd = waterNeeded + 20;

        const updatedParcels = parcels.map((p) => {
            if (p.id === parcelId && p.crop) {
                const newWaterLevel = Math.min(100, p.waterLevel + waterToAdd);
                const healthBoost = p.waterLevel < 30 ? 15 : 10;

                return {
                    ...p,
                    waterLevel: newWaterLevel,
                    health: Math.min(100, p.health + healthBoost),
                    lastAction: `💧 Riego manual - ${waterToAdd}% aplicado (GRATIS)`,
                };
            }
            return p;
        });

        setParcels(updatedParcels);
        updateXP(localXP + 10, localXP);

        registerManualAction(parcelId);

        const wasWaterCritical = parcel.waterLevel < 30;
        const newWaterLevel = Math.min(100, parcel.waterLevel + waterToAdd);
        addNotification({
            type: wasWaterCritical ? 'success' : 'info',
            title: wasWaterCritical ? '💧 ¡Rescate Exitoso!' : '💧 Riego Manual',
            message: wasWaterCritical
                ? `¡Salvaste la parcela ${parcelId}! Agua: ${parcel.waterLevel.toFixed(1)}% → ${newWaterLevel.toFixed(1)}% (GRATIS). Parcela recuperada.`
                : `Parcela ${parcelId} regada manualmente +${waterToAdd}% (GRATIS). IoT se reactivará en 3s.`
        });
    };

    const modes = [
        { id: 'cultivar' as GameMode, icon: '🌱', title: 'Cultivos', desc: 'NASA + Siembra', color: 'border-green-500' },
        { id: 'minijuegos' as GameMode, icon: '🎮', title: 'Minijuegos', desc: 'Desafíos', color: 'border-purple-500' },
        { id: 'logros' as GameMode, icon: '🏆', title: 'Logros', desc: 'Recompensas', color: 'border-orange-500' },
        { id: 'alertas' as GameMode, icon: '🚨', title: 'Alertas', desc: 'Advertencias', color: 'border-red-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <NotificationSystem notifications={notifications} />

            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="text-4xl"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            🚀
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">SPACEFARM NASA</h1>
                            <p className="text-gray-400">
                                {userLocation
                                    ? `${userLocation.city || 'Tu ubicación'}, ${userLocation.country || ''}`
                                    : 'Agricultura Inteligente con Datos Espaciales'
                                } - Día {gameDay}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-xl">👨‍🚀</span>
                                </div>
                                <div>
                                    <div className="text-white font-semibold">Granjero Espacial</div>
                                    <div className="text-gray-400 text-sm">Nivel {Math.floor(localXP / 100) + 1}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <div className={`font-bold ${localMoney < 20 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                                        ${localMoney}
                                    </div>
                                    <div className="text-gray-400">Dinero</div>
                                    {localMoney < 20 && hasAnyPlantedCrop && (
                                        <div className="text-xs text-red-400 mt-1">
                                            ⚠️ IoT OFF
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="text-purple-400 font-bold">{localXP}</div>
                                    <div className="text-gray-400">XP</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-green-400 font-bold">
                                        {parcels.filter(p => p.crop).length}/{parcels.length}
                                    </div>
                                    <div className="text-gray-400">Parcelas</div>
                                </div>
                                <div className="text-center">
                                    <div className={`font-bold ${localMoney >= 20 ? 'text-cyan-400' : 'text-gray-500'}`}>
                                        {localMoney >= 20 ? autoWateringParcels.size : 'OFF'}
                                    </div>
                                    <div className="text-gray-400">
                                        IoT {localMoney >= 20 ? 'Activo' : 'Inactivo'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                <div className="col-span-3">
                    <EnhancedSatelliteView nasaData={nasaData} userLocation={userLocation} />
                </div>

                <div className="col-span-6">
                    <DynamicContentPanel
                        mode={selectedMode}
                        parcels={parcels}
                        selectedCrop={selectedCrop}
                        onSelectCrop={setSelectedCrop}
                        onSelectParcel={handleParcelSelect}
                        autoWateringParcels={autoWateringParcels}
                        onManualWatering={handleManualWatering}
                        playerMoney={localMoney}
                        onRegionChange={handleRegionChange}
                    />
                </div>

                <div className="col-span-3">
                    <DynamicRightPanel
                        mode={selectedMode}
                        nasaData={nasaData}
                        parcels={parcels}
                        currentMoney={localMoney}
                        selectedAlertRegion={selectedAlertRegion}
                        selectedAlertWeather={selectedAlertWeather}
                        onApplyAction={(parcelId, action, cost) => {
                            const parcel = parcels.find(p => p.id === parcelId);

                            if (action === 'harvest' && parcel && parcel.crop && parcel.growthStage >= 100) {
                                applyAction(parcelId, action, cost, localMoney, updateMoney, updateXP, localXP);
                                updateXP(localXP + 10, localXP);

                                addNotification({
                                    type: 'success',
                                    title: '🌟 ¡Cosecha Perfecta!',
                                    message: `¡Fuiste muy responsable! Parcela ${parcelId} completada al 100%. Bonus: +10 XP extra`
                                });
                            } else {
                                applyAction(parcelId, action, cost, localMoney, updateMoney, updateXP, localXP);

                                if (action !== 'harvest' && cost > 0) {
                                    addNotification({
                                        type: 'success',
                                        title: '✅ Acción Aplicada',
                                        message: `"${action}" aplicada en parcela ${parcelId} (-$${cost})`
                                    });
                                } else if (action === 'harvest') {
                                    addNotification({
                                        type: 'success',
                                        title: '🚜 Cosecha Exitosa',
                                        message: `Parcela ${parcelId} cosechada. ¡Dinero aumentado!`
                                    });
                                }
                            }
                        }}
                        onAutoWatering={(parcelId) => {
                            if (localMoney < 20) {
                                addNotification({
                                    type: 'error',
                                    title: '❌ IoT No Disponible',
                                    message: `Se requieren >= $20 para activar IoT. Actual: $${localMoney}. Usa riego manual (GRATIS).`
                                });
                                return;
                            }
                            activateAutoWatering(parcelId);
                            addNotification({
                                type: 'info',
                                title: '🤖 IoT Activado Manualmente',
                                message: `Sistema IoT activado para parcela ${parcelId}. Se cobrará $5 al regar.`
                            });
                        }}
                    />
                </div>
            </div>

            <motion.div
                className="fixed bottom-4 left-4 right-4 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="grid grid-cols-4 gap-3">
                    {modes.map((mode) => (
                        <motion.button
                            key={mode.id}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${selectedMode === mode.id
                                    ? `${mode.color} bg-gray-800 shadow-lg`
                                    : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                                }`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedMode(mode.id)}
                        >
                            <div className="text-2xl mb-1">{mode.icon}</div>
                            <div className="text-white text-xs font-semibold">{mode.title}</div>
                            
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}