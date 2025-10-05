"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";

// 🌍 Tierra con imagen
function Earth() {
  const RADIUS = 2;
  const earthRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/earth/earthmap.jpg");

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <mesh ref={earthRef} rotation={[0, 0, 0]}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// ☄️ Cometas animados
function Comets() {
  const cometCount = 10;
  const comets = Array.from({ length: cometCount }, (_, i) => i);
  const cometRefs = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    cometRefs.current.forEach((comet) => {
      if (comet) {
        comet.position.x += 0.05;
        comet.position.y -= 0.02;

        if (comet.position.x > 50 || comet.position.y < -50) {
          comet.position.x = -50 + Math.random() * 20;
          comet.position.y = 30 + Math.random() * 20;
        }
      }
    });
  });

  return (
    <>
      {comets.map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) cometRefs.current[i] = el;
          }}
          position={[-50 + Math.random() * 20, 30 + Math.random() * 20, -10]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </>
  );
}

// ⏳ Barra de carga futurista
function LoadingBar({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      onFinish();
    }
  }, [progress, onFinish]);

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 z-50 pointer-events-none">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-emerald-400 text-sm font-semibold">
          Inicializando Sistema Agrícola
        </span>
        <span className="text-cyan-300 text-sm font-mono">{progress}%</span>
      </div>

      <div className="h-4 bg-gray-800 rounded-full border border-emerald-500/30 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-cyan-500 rounded-full transition-all duration-300 shadow-lg shadow-emerald-500/50"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-gray-400 text-xs text-center mt-2">
        Conectando con sistemas de monitoreo global...
      </p>
    </div>
  );
}

interface LocationData {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
}

const defaultLocation: LocationData = {
  lat: -7.1638,
  lon: -78.5034,
  city: "Cajamarca",
  country: "Perú",
};

// 🎴 Cards de módulos
interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  borderColor: string;
  href: string;
  delay: number;
}

function ModuleCard({ title, description, icon, gradient, borderColor, href, delay }: ModuleCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="block group"
    >
      <div className={`relative bg-gradient-to-br ${gradient} backdrop-blur-md rounded-2xl p-4 border ${borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">{icon}</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <p className="text-white/70 text-xs">{description}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between bg-black/20 rounded-lg p-2 border border-white/10">
            <span className="text-white/80 text-sm font-medium">🤖Explorar🚀</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function Globe() {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<"loading" | "success" | "error">("loading");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
              {
                headers: {
                  'Accept-Language': 'es'
                }
              }
            );

            const data = await response.json();

            const city = data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.municipality ||
              data.address?.county ||
              "Ubicación detectada";

            const country = data.address?.country || "Detectado";

            setUserLocation({
              lat: latitude,
              lon: longitude,
              city: city,
              country: country
            });
            setLocationStatus("success");
          } catch (error) {
            console.error("Error obteniendo ubicación:", error);
            setUserLocation({
              lat: latitude,
              lon: longitude,
              city: "Tu ubicación",
              country: "Detectado"
            });
            setLocationStatus("success");
          }
        },
        () => {
          setLocationStatus("error");
          setUserLocation(defaultLocation);
        }
      );
    } else {
      setLocationStatus("error");
      setUserLocation(defaultLocation);
    }
  }, []);

  const modules = [
    {
      title: "Cultivos",
      description: "Gestión de siembra",
      icon: "🌾",
      gradient: "from-emerald-900/90 to-green-900/90",
      borderColor: "border-emerald-500/40",
      href: "/game/cultivos"
    },
    {
      title: "Ganadería",
      description: "Monitoreo de ganado",
      icon: "🐄",
      gradient: "from-amber-900/90 to-orange-900/90",
      borderColor: "border-amber-500/40",
      href: "/game/ganaderia"
    },
    {
      title: "Investigación",
      description: "Laboratorio agrícola",
      icon: "🔬",
      gradient: "from-blue-900/90 to-cyan-900/90",
      borderColor: "border-cyan-500/40",
      href: "/game/investigar"
    },
    {
      title: "IA",
      description: "Inteligencia Artificial",
      icon: "🤖",
      gradient: "from-purple-900/90 to-pink-900/90",
      borderColor: "border-purple-500/40",
      href: "/game/ia"
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-emerald-950 overflow-hidden">
      {!ready && <LoadingBar onFinish={() => setReady(true)} />}

      {ready && (
        <>
          {/* Header futurista */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 drop-shadow-2xl"
            >
              🌱 SPACE FARM
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-emerald-300/80 text-sm mt-2 font-light tracking-wide"
            >
              Sistema de Agricultura Inteligente Global
            </motion.p>
          </div>

          {/* Panel de información de ubicación */}
          {userLocation && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-28 left-6 z-10 bg-gradient-to-br from-emerald-900/90 to-gray-900/90 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 max-w-xs"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Tu Ubicación</h3>
                    <p className="text-emerald-300 text-xs">GPS Activo</p>
                  </div>
                </div>

                <div className="space-y-2 bg-black/30 rounded-lg p-3 border border-emerald-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Ciudad:</span>
                    <span className="text-white text-sm font-semibold">{userLocation.city}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">País:</span>
                    <span className="text-emerald-300 text-sm">{userLocation.country}</span>
                  </div>
                  <div className="border-t border-emerald-500/20 pt-2 mt-2">
                    <div className="text-xs text-gray-400 mb-1">Coordenadas GPS</div>
                    <div className="font-mono text-cyan-400 text-xs">
                      LAT: {userLocation.lat.toFixed(4)}°
                    </div>
                    <div className="font-mono text-cyan-400 text-xs">
                      LON: {userLocation.lon.toFixed(4)}°
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="absolute top-[340px] left-6 z-20 flex gap-1 text-emerald-400 text-2xl font-semibold tracking-wide drop-shadow-[0_0_8px_#00ff99]">
                {["Juega,", "aprende", "y", "transforma", "el", "planeta"].map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 1 + index * 0.3, 
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </>
          )}

          {/* Grid de módulos - Lado derecho */}
          <div className="absolute top-28 right-6 z-10 grid grid-cols-2 gap-3 max-w-2xl">
            {modules.map((module, index) => (
              <ModuleCard
                key={module.title}
                {...module}
                delay={0.6 + index * 0.1}
              />
            ))}
          </div>

          {/* Stats en tiempo real - Abajo a la derecha */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="absolute bottom-32 right-6 z-10 bg-gradient-to-br from-gray-900/90 to-emerald-900/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20"
          >
            <h4 className="text-emerald-300 font-bold text-sm mb-3 flex items-center gap-2">
              <span>🌾</span> Datos en Tiempo Real
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Áreas monitoreadas:</span>
                <span className="text-white font-bold">2,847 ha</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Cultivos activos:</span>
                <span className="text-emerald-400 font-bold">156</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Eficiencia hídrica:</span>
                <span className="text-cyan-400 font-bold">94%</span>
              </div>
            </div>
          </motion.div>

          {/* Botón CTA mejorado */}
          <motion.a
            href="/game"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 40px rgba(16, 185, 129, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 group"
          >
            <div className="relative px-10 py-4 text-lg font-bold text-white rounded-full shadow-2xl 
                           bg-gradient-to-r from-emerald-600 via-green-500 to-cyan-500 
                           hover:from-emerald-500 hover:to-cyan-400 transition-all duration-300
                           border-2 border-emerald-400/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <span>Iniciar Challenge NASA 2025</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:bg-white/30 transition-all duration-300 -z-10"></div>
            </div>
          </motion.a>
        </>
      )}

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Stars radius={200} depth={80} count={20000} factor={6} fade speed={2} />
        <Comets />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#10b981" />

        <Suspense fallback={null}>
          <Earth />
        </Suspense>

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}