"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useEffect, Suspense, useMemo } from "react";
// 💡 CORRECCIÓN 1: Importamos el tipo 'Variants' de framer-motion
import { motion, Variants } from "framer-motion"; 
import { Language, translations } from "@/lib/languages/translations.languages";

// 🌍 Tierra con imagen (No necesita cambios)
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

// ☄️ Cometas animados (No necesita cambios)
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

// ⏳ Barra de carga futurista (t: Objeto de traducción para carga)
function LoadingBar({ onFinish, t }: { onFinish: () => void, t: typeof translations['es']['loading'] }) {
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
          {t.title}
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
        {t.message}
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

// 🎴 Cards de módulos (MODIFICADA el padding interno)
interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  borderColor: string;
  href: string;
  delay: number;
  exploreText: string;
}

function ModuleCard({ title, description, icon, gradient, borderColor, href, delay, exploreText }: ModuleCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, x: 20 }} // Animación de entrada por la derecha
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, x: 5 }} // Efecto al pasar el mouse
      whileTap={{ scale: 0.95 }}
      className="block group min-w-[280px]"
    >
      {/* Aumento de padding a p-5 */}
      <div className={`relative bg-gradient-to-br ${gradient} backdrop-blur-md rounded-2xl p-5 border ${borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3"> {/* Aumento de gap a 4 */}
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"> {/* Aumento de tamaño del icono */}
              <span className="text-3xl">{icon}</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">{title}</h3> {/* Aumento de tamaño del título */}
              <p className="text-white/70 text-sm">{description}</p> {/* Aumento de tamaño de la descripción */}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between bg-black/20 rounded-lg p-3 border border-white/10"> {/* Aumento de padding a p-3 */}
            <span className="text-white/80 text-sm font-medium">{exploreText}</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

// ✍️ Componente de Animación de Escritura
function TypewriterText({ text, delayStart }: { text: string[], delayStart: number }) {
    const defaultDelay = 0.08; // Tiempo por caracter
    const wordDelay = 0.5; // Tiempo entre palabras

    // 💡 CORRECCIÓN 2: Tipado con 'Variants' y ajuste de la lógica de retardo
    const variants: Variants = {
        hidden: { opacity: 0, width: 0 },
        // La función 'visible' recibe el índice (i) de la palabra a través de la prop 'custom'
        visible: (i: number) => {
            const word = text[i];
            const duration = word.length * defaultDelay;

            // Calcular el retraso total hasta esta palabra
            let currentDelay = delayStart;
            for (let k = 0; k < i; k++) {
                currentDelay += (text[k].length * defaultDelay) + wordDelay;
            }
            const start = currentDelay;

            return {
                opacity: 1,
                width: 'auto',
                transition: {
                    delay: start,
                    duration: duration,
                    // 💡 CORRECCIÓN 3: Reemplazamos "linear" por su equivalente en array
                    ease: [0, 0, 1, 1] 
                }
            };
        },
    };

    return (
        <div className="absolute top-[340px] left-6 z-20 text-emerald-400 text-3xl font-semibold tracking-wide drop-shadow-[0_0_8px_#00ff99] flex flex-wrap gap-2 max-w-lg">
            {text.map((word, index) => (
                <motion.span
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }} // Oculta el texto hasta que se 'escribe'
                    className="inline-block"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
}


export default function Globe() {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<"loading" | "success" | "error">("loading");
  const [ready, setReady] = useState(false);
  const [language, setLanguage] = useState<Language>('es'); 
  
  const t = useMemo(() => translations[language], [language]);

  // Manejo de Geolocalización
  useEffect(() => {
    const langCode = language === 'es' ? 'es' : 'en';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
              {
                headers: {
                  'Accept-Language': langCode
                }
              }
            );

            const data = await response.json();

            const city = data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.municipality ||
              data.address?.county ||
              t.locationPanel.genericCity;

            const country = data.address?.country || t.locationPanel.genericCountry;

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
              city: t.locationPanel.genericCity,
              country: t.locationPanel.genericCountry
            });
            setLocationStatus("success");
          }
        },
        () => {
          setLocationStatus("error");
          setUserLocation({
            lat: defaultLocation.lat,
            lon: defaultLocation.lon,
            city: t.locationPanel.genericCity, 
            country: t.locationPanel.genericCountry,
          });
        }
      );
    } else {
      setLocationStatus("error");
      setUserLocation({
        lat: defaultLocation.lat,
        lon: defaultLocation.lon,
        city: t.locationPanel.genericCity, 
        country: t.locationPanel.genericCountry,
      });
    }
  }, [language, t.locationPanel.genericCity, t.locationPanel.genericCountry]);

  // Datos de los módulos
  const modules = useMemo(() => [
    {
      title: t.modules.cultivos.title,
      description: t.modules.cultivos.description,
      icon: "🌾",
      gradient: "from-emerald-900/90 to-green-900/90",
      borderColor: "border-emerald-500/40",
      href: "/game/cultivos"
    },
    {
      title: t.modules.ganaderia.title,
      description: t.modules.ganaderia.description,
      icon: "🐄",
      gradient: "from-amber-900/90 to-orange-900/90",
      borderColor: "border-amber-500/40",
      href: "/game/ganaderia"
    },
    {
      title: t.modules.investigacion.title,
      description: t.modules.investigacion.description,
      icon: "🔬",
      gradient: "from-blue-900/90 to-cyan-900/90",
      borderColor: "border-cyan-500/40",
      href: "/game/investigar"
    },
    {
      title: t.modules.minijuegos.title,
      description: t.modules.minijuegos.description,
      icon: "🎮",
      gradient: "from-purple-900/90 to-pink-900/90",
      borderColor: "border-purple-500/40",
      href: "/game/intelligence"
    }
  ], [t.modules]);


  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-emerald-950 overflow-hidden">
      
      {/* Selector de idioma */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
        className="absolute top-6 right-6 z-50"
      >
        <div className="flex gap-1 bg-gray-800/80 backdrop-blur-md rounded-full p-1.5 shadow-2xl border border-gray-700/50">
          <button
            onClick={() => setLanguage('es')}
            className={`group relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              language === 'es' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" fill="#AA151B"/>
                <rect x="1" y="11" width="30" height="10" fill="#F1BF00"/>
              </svg>
              ES
            </span>
            {language === 'es' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`group relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              language === 'en' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                <rect x="1" y="1" width="30" height="30" rx="15" fill="white"/>
                <mask id="circleMask" maskUnits="userSpaceOnUse">
                  <circle cx="16" cy="16" r="15" fill="white"/>
                </mask>
                <g mask="url(#circleMask)">
                  <rect y="1" width="32" height="10" fill="#012169"/>
                  <rect y="11" width="32" height="10" fill="white"/>
                  <rect y="21" width="32" height="10" fill="#012169"/>
                  <path d="M1 1 L31 31 M31 1 L1 31" stroke="#C8102E" strokeWidth="6"/>
                  <path d="M1 1 L31 31 M31 1 L1 31" stroke="white" strokeWidth="4"/>
                  <path d="M16 1 V31 M1 16 H31" stroke="white" strokeWidth="10"/>
                  <path d="M16 1 V31 M1 16 H31" stroke="#C8102E" strokeWidth="6"/>
                </g>
              </svg>
              EN
            </span>
            {language === 'en' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </div>
      </motion.div>


      {!ready && <LoadingBar onFinish={() => setReady(true)} t={t.loading} />}

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
              {t.header.subtitle}
            </motion.p>
          </div>

          {/* Panel de información de ubicación (Alineado a la IZQUIERDA) */}
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
                    <h3 className="text-white font-bold text-lg">{t.locationPanel.title}</h3>
                    <p className="text-emerald-300 text-xs">{t.locationPanel.status}</p>
                  </div>
                </div>

                <div className="space-y-2 bg-black/30 rounded-lg p-3 border border-emerald-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{t.locationPanel.city}:</span>
                    <span className="text-white text-sm font-semibold">{userLocation.city}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{t.locationPanel.country}:</span>
                    <span className="text-emerald-300 text-sm">{userLocation.country}</span>
                  </div>
                  <div className="border-t border-emerald-500/20 pt-2 mt-2">
                    <div className="text-xs text-gray-400 mb-1">{t.locationPanel.coords}</div>
                    <div className="font-mono text-cyan-400 text-xs">
                      LAT: {userLocation.lat.toFixed(4)}°
                    </div>
                    <div className="font-mono text-cyan-400 text-xs">
                      LON: {userLocation.lon.toFixed(4)}°
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SLOGAN con animación de escritura (TypewriterText) */}
              <TypewriterText text={t.slogan} delayStart={1} />
              
            </>
          )}

          {/* Grid de módulos (Alineado a la DERECHA y más ancho) */}
          <div className="absolute top-28 right-6 z-10 grid grid-cols-2 gap-6"> {/* Aumento de gap a 6 */}
            {modules.map((module, index) => (
              <ModuleCard
                key={module.title}
                {...module}
                delay={0.6 + index * 0.1}
                exploreText={t.modules.explore}
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
              <span>🌾</span> {t.stats.title}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">{t.stats.areas}</span>
                <span className="text-white font-bold">2,847 ha</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">{t.stats.crops}</span>
                <span className="text-emerald-400 font-bold">156</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">{t.stats.efficiency}</span>
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
                <span>{t.cta}</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:bg-white/30 transition-all duration-300 -z-10"></div>
            </div>
          </motion.a>
        </>
      )}

      {/* Canvas - El planeta sigue centrado por defecto */}
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