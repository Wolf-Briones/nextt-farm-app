"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";

// 🌍 Tierra con video
function Earth({ playing }: { playing: boolean }) {
  const RADIUS = 2;
  const earthRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/videos/earth.mp4"; // archivo en /public/videos
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    if (playing) video.play();

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    setTexture(videoTexture);
  }, [playing]);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group>
      {/* Globo principal con el video */}
      <mesh ref={earthRef} rotation={[0, 0, 0]}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        {texture && <meshStandardMaterial map={texture} />}
      </mesh>

      {/* 🌐 Círculo límite visible */}
      <mesh>
        <sphereGeometry args={[RADIUS + 0.01, 64, 64]} />
        <meshBasicMaterial color="cyan" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// 📍 Marcador dinámico
function Marker({ lat, lon, isUserLocation = false }: { lat: number; lon: number; isUserLocation?: boolean }) {
  const RADIUS = 2.01;
  const latitude = lat * (Math.PI / 180);
  const longitude = lon * (Math.PI / 180);

  const x = RADIUS * Math.cos(latitude) * Math.cos(longitude);
  const y = RADIUS * Math.sin(latitude);
  const z = RADIUS * Math.cos(latitude) * Math.sin(longitude);

  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial
        color={isUserLocation ? "aquamarine" : "red"}
        emissive={isUserLocation ? "aquamarine" : "red"}
        emissiveIntensity={isUserLocation ? 1.5 : 1.0}
      />
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
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
    </>
  );
}

// ⏳ Barra de carga
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
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 bg-gray-700 rounded">
      <div className="h-3 bg-cyan-400 rounded" style={{ width: `${progress}%` }} />
    </div>
  );
}

interface LocationData {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
}

// Default location constant outside component to avoid re-renders
const defaultLocation: LocationData = {
  lat: -7.1638,
  lon: -78.5034,
  city: "Cajamarca",
  country: "Perú",
};

export default function Globe() {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<"loading" | "success" | "error">("loading");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lon: longitude, city: "Tu ubicación", country: "Detectado" });
          setLocationStatus("success");
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

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {!ready && <LoadingBar onFinish={() => setReady(true)} />}

      {ready && (
        <>
          <h1 className="absolute top-6 left-1/2 -translate-x-1/2 text-4xl font-bold text-white z-10 animate-pulse drop-shadow-lg">
            🌌 Explorando <span className="text-cyan-300">SPACE FARM</span>
          </h1>
          {userLocation && (
            <div className="absolute top-20 left-6 z-10 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
              <p className="text-white text-sm">
                📍 {userLocation.city}, {userLocation.country}
              </p>
              <p className="text-cyan-300 text-xs">
                {userLocation.lat.toFixed(4)}°, {userLocation.lon.toFixed(4)}°
              </p>
            </div>
          )}
          <motion.a
            href="/game"
            whileHover={{ scale: 1.1, boxShadow: "0px 0px 25px rgba(127, 255, 212, 0.9)" }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 
                       text-lg font-bold text-white rounded-full shadow-xl 
                       bg-gradient-to-r from-aquamarine to-cyan-600 
                       hover:opacity-90 transition duration-300 z-10"
          >
            Explorar 🚀 Challenge NASA 2025
          </motion.a>
        </>
      )}

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Stars radius={200} depth={80} count={20000} factor={6} fade speed={2} />
        <Comets />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />

        <Suspense fallback={null}>
          {/* 🎥 El video comienza junto con el loading */}
          <Earth playing={true} />

          {/* Marcadores */}
          <Marker lat={defaultLocation.lat} lon={defaultLocation.lon} />
          {userLocation && locationStatus === "success" && (
            <Marker lat={userLocation.lat} lon={userLocation.lon} isUserLocation={true} />
          )}
        </Suspense>

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
