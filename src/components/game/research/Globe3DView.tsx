'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Info, Loader, RotateCcw, Play, Pause, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import * as THREE from 'three';
import { LayerInfo } from '@/lib/types/layer.types';

interface Globe3DViewProps {
  imageUrl: string;
  activeLayerInfo: LayerInfo | undefined;
  isLoading: boolean;
}

export const Globe3DView: React.FC<Globe3DViewProps> = ({
  imageUrl,
  activeLayerInfo,
  isLoading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const baseGlobeRef = useRef<THREE.Mesh | null>(null);
  const dataLayerRef = useRef<THREE.Mesh | null>(null);
  const locationMarkerRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [zoom, setZoom] = useState(3);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => console.log('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Convert lat/lon to 3D sphere coordinates
  const latLonToVector3 = (lat: number, lon: number, radius: number = 1.01) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  // Initialize Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = zoom;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // BASE EARTH
    const baseGeometry = new THREE.SphereGeometry(1, 256, 256);
    const textureLoader = new THREE.TextureLoader();
    
    const earthTexture = textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    );
    
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpScale: 0.015,
      specular: new THREE.Color(0x222222),
      shininess: 10,
    });

    const earth = new THREE.Mesh(baseGeometry, earthMaterial);
    scene.add(earth);
    baseGlobeRef.current = earth;

    // DATA OVERLAY LAYER (slightly larger sphere)
    const overlayGeometry = new THREE.SphereGeometry(1.005, 256, 256);
    const overlayMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.7,
      side: THREE.FrontSide,
      depthWrite: false,
      depthTest: true,
    });

    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    scene.add(overlay);
    dataLayerRef.current = overlay;

    // Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(1.12, 128, 128);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.015,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 20000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 100 + Math.random() * 900;
      starsVertices.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (baseGlobeRef.current && isRotating) {
        baseGlobeRef.current.rotation.y += 0.001;
        if (dataLayerRef.current) {
          dataLayerRef.current.rotation.copy(baseGlobeRef.current.rotation);
        }
        if (locationMarkerRef.current) {
          locationMarkerRef.current.rotation.y = baseGlobeRef.current.rotation.y;
          locationMarkerRef.current.rotation.x = baseGlobeRef.current.rotation.x;
        }
      }

      stars.rotation.y += 0.00005;
      atmosphere.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };
    animate();

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsRotating(false);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !baseGlobeRef.current) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      baseGlobeRef.current.rotation.y += deltaX * 0.005;
      baseGlobeRef.current.rotation.x += deltaY * 0.005;

      if (dataLayerRef.current) {
        dataLayerRef.current.rotation.copy(baseGlobeRef.current.rotation);
      }
      if (locationMarkerRef.current) {
        locationMarkerRef.current.rotation.y = baseGlobeRef.current.rotation.y;
        locationMarkerRef.current.rotation.x = baseGlobeRef.current.rotation.x;
      }

      baseGlobeRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, baseGlobeRef.current.rotation.x));
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => setIsRotating(true), 2000);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!camera) return;
      const delta = e.deltaY * 0.001;
      const newZoom = Math.max(1.5, Math.min(5, camera.position.z + delta));
      camera.position.z = newZoom;
      setZoom(newZoom);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, zoom]);

  // Update location marker
  useEffect(() => {
    if (!userLocation || !sceneRef.current) return;

    if (locationMarkerRef.current) {
      sceneRef.current.remove(locationMarkerRef.current);
    }

    const markerGroup = new THREE.Group();
    
    const markerGeom = new THREE.SphereGeometry(0.015, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeom, markerMat);
    
    const position = latLonToVector3(userLocation.lat, userLocation.lon);
    marker.position.copy(position);
    markerGroup.add(marker);
    
    const ringGeom = new THREE.RingGeometry(0.02, 0.03, 32);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0xff3333, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.copy(position);
    ring.lookAt(0, 0, 0);
    markerGroup.add(ring);
    
    sceneRef.current.add(markerGroup);
    locationMarkerRef.current = markerGroup;
  }, [userLocation]);

  // Load texture with PROPER UV mapping for spherical projection
  useEffect(() => {
    if (!dataLayerRef.current || !imageUrl) return;

    setTextureLoaded(false);
    
    const loadTexture = setTimeout(() => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log(`Image loaded: ${img.width}x${img.height}`);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // ALWAYS use 2:1 ratio for equirectangular projection
        const width = 2048;
        const height = 1024;
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          // Clear with transparent background
          ctx.clearRect(0, 0, width, height);
          
          // Draw image stretched to fill entire canvas (equirectangular)
          // The image MUST cover the full 360° longitude x 180° latitude
          ctx.drawImage(img, 0, 0, width, height);
          
          // Make black/very dark pixels transparent
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Transparent if almost black (no data regions)
            if (r < 5 && g < 5 && b < 5) {
              data[i + 3] = 0;
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          // Create texture with correct mapping
          const texture = new THREE.CanvasTexture(canvas);
          
          // CRITICAL: UV mapping for sphere
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearMipMapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          texture.needsUpdate = true;
          
          const material = dataLayerRef.current?.material as THREE.MeshBasicMaterial;
          if (material) {
            if (material.map) material.map.dispose();
            material.map = texture;
            material.transparent = true;
            material.opacity = 0.7;
            material.needsUpdate = true;
          }
          
          console.log('Texture applied successfully');
          setTextureLoaded(true);
        }
      };
      
      img.onerror = (err) => {
        console.error('Failed to load texture:', imageUrl, err);
        setTextureLoaded(true);
      };
      
      img.src = imageUrl;
    }, 1000);
    
    return () => clearTimeout(loadTexture);
  }, [imageUrl]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = direction === 'in' ? -0.3 : 0.3;
    const newZoom = Math.max(1.5, Math.min(5, cameraRef.current.position.z + delta));
    cameraRef.current.position.z = newZoom;
    setZoom(newZoom);
  };

  const goToLocation = () => {
    if (!userLocation || !baseGlobeRef.current) return;
    
    const targetLon = -userLocation.lon * (Math.PI / 180);
    const targetLat = userLocation.lat * (Math.PI / 180);
    
    baseGlobeRef.current.rotation.y = targetLon;
    baseGlobeRef.current.rotation.x = targetLat;
    
    if (dataLayerRef.current) {
      dataLayerRef.current.rotation.copy(baseGlobeRef.current.rotation);
    }
    
    setIsRotating(false);
  };

  const resetView = () => {
    if (cameraRef.current) cameraRef.current.position.z = 3;
    if (baseGlobeRef.current) {
      baseGlobeRef.current.rotation.set(0, 0, 0);
      if (dataLayerRef.current) dataLayerRef.current.rotation.set(0, 0, 0);
    }
    setZoom(3);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950">
      <div ref={containerRef} className="w-full h-full" />

      {(isLoading || !textureLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-20 pointer-events-none">
          <div className="text-center">
            <Loader className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-white text-lg font-semibold">Cargando capa de datos...</p>
            <p className="text-blue-300 text-sm">Aplicando proyección esférica</p>
          </div>
        </div>
      )}

      {activeLayerInfo && !isLoading && textureLoaded && (
        <div className="absolute bottom-6 left-6 bg-gradient-to-br from-black/90 to-blue-900/90 backdrop-blur-md text-white rounded-2xl shadow-2xl px-6 py-5 max-w-md border-2 border-blue-400/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Info size={20} className="text-blue-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-blue-300 mb-1">CAPA ACTIVA</h3>
              <p className="font-bold text-lg mb-2">{activeLayerInfo.name}</p>
              <p className="text-sm text-gray-300 leading-relaxed">{activeLayerInfo.description}</p>
              {userLocation && (
                <div className="mt-3 flex items-center gap-2">
                  <MapPin size={14} className="text-red-400" />
                  <span className="text-xs text-gray-300">
                    Lat: {userLocation.lat.toFixed(4)}°, Lon: {userLocation.lon.toFixed(4)}°
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-6 right-6 bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-md text-white rounded-2xl shadow-2xl px-5 py-4 border-2 border-purple-400/40">
        <p className="text-xs text-purple-200 mb-1 font-semibold">GLOBO 3D INTERACTIVO</p>
        <p className="text-lg font-bold mb-2">Zoom: {((5 - zoom) / 3.5 * 100).toFixed(0)}%</p>
        <div className="space-y-1 text-xs text-gray-300">
          <p>Arrastra: Rotar</p>
          <p>Scroll: Zoom</p>
          <p>Capa con transparencia 70%</p>
        </div>
      </div>

      <div className="absolute top-6 left-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <button onClick={resetView} className="p-3 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-xl transition-all border border-white/20 group" title="Resetear">
            <RotateCcw size={18} className="text-white group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button onClick={() => setIsRotating(!isRotating)} className={`p-3 backdrop-blur-sm rounded-xl transition-all border ${isRotating ? 'bg-green-500/70 hover:bg-green-500/90 border-green-300/50' : 'bg-red-500/70 hover:bg-red-500/90 border-red-300/50'}`}>
            {isRotating ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleZoom('in')} className="p-3 bg-blue-500/70 hover:bg-blue-500/90 backdrop-blur-sm rounded-xl transition-all border border-blue-300/50" title="Acercar">
            <ZoomIn size={18} className="text-white" />
          </button>
          <button onClick={() => handleZoom('out')} className="p-3 bg-blue-500/70 hover:bg-blue-500/90 backdrop-blur-sm rounded-xl transition-all border border-blue-300/50" title="Alejar">
            <ZoomOut size={18} className="text-white" />
          </button>
        </div>
        {userLocation && (
          <button onClick={goToLocation} className="p-3 bg-red-500/70 hover:bg-red-500/90 backdrop-blur-sm rounded-xl transition-all border border-red-300/50" title="Mi ubicación">
            <MapPin size={18} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};