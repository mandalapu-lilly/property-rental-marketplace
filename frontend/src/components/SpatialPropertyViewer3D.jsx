import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Sun, Moon, Maximize2, Compass, Sparkles, Box, ShieldCheck } from 'lucide-react';

export default function SpatialPropertyViewer3D({ property, isDark = false, className = '' }) {
  const mountRef = useRef(null);
  const [lightingMode, setLightingMode] = useState('goldenHour'); // 'daylight' | 'goldenHour' | 'twilight'
  const [wireframeMode, setWireframeMode] = useState(false);
  const [activeFloor, setActiveFloor] = useState('all'); // 'all' | 'ground' | 'upper'

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x121214 : 0xfbfbf9, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(10, 8, 12);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Lighting System
    const ambientLight = new THREE.AmbientLight(
      lightingMode === 'twilight' ? 0x3d3846 : lightingMode === 'goldenHour' ? 0xffecd1 : 0xffffff,
      lightingMode === 'twilight' ? 1.2 : 1.8
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      lightingMode === 'twilight' ? 0xb58d59 : lightingMode === 'goldenHour' ? 0xffcc77 : 0xfffaed,
      lightingMode === 'twilight' ? 1.5 : 2.5
    );
    sunLight.position.set(10, 16, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const interiorAccent = new THREE.PointLight(0xd4b996, lightingMode === 'twilight' ? 3.5 : 1.8, 12);
    interiorAccent.position.set(0, 2.0, 0);
    scene.add(interiorAccent);

    // 3. Materials
    const wallColor = isDark ? 0x27272a : 0xece6dc;
    const floorColor = isDark ? 0x1c1c20 : 0xd8d0c4;
    const accentColor = 0xb58d59;

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.4,
      metalness: 0.1,
      wireframe: wireframeMode,
    });

    const floorMat = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: 0.6,
      wireframe: wireframeMode,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.3,
      metalness: 0.7,
      wireframe: wireframeMode,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x3f3f46 : 0xffffff,
      transparent: true,
      opacity: wireframeMode ? 0.2 : 0.45,
      roughness: 0.1,
      metalness: 0.1,
      wireframe: wireframeMode,
    });

    // 4. Model Construction
    const modelGroup = new THREE.Group();

    // Ground Slab
    const groundSlab = new THREE.Mesh(new THREE.BoxGeometry(11, 0.3, 9), floorMat);
    groundSlab.position.y = -0.15;
    groundSlab.receiveShadow = true;
    modelGroup.add(groundSlab);

    // Lower Level Living Suite
    const groundGroup = new THREE.Group();
    const groundMain = new THREE.Mesh(new THREE.BoxGeometry(6, 2.2, 4.8), wallMat);
    groundMain.position.set(-1.2, 1.1, 0);
    groundMain.castShadow = true;
    groundMain.receiveShadow = true;
    groundGroup.add(groundMain);

    // Glass Panorama
    const groundGlass = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.0, 0.1), glassMat);
    groundGlass.position.set(-1.2, 1.1, 2.41);
    groundGroup.add(groundGlass);

    // Living Lounge Patio
    const patio = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.15, 3.2), accentMat);
    patio.position.set(3.0, 0.08, 1.8);
    groundGroup.add(patio);

    modelGroup.add(groundGroup);

    // Upper Level Master Suite
    const upperGroup = new THREE.Group();
    const upperMain = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.0, 4.4), wallMat);
    upperMain.position.set(0.6, 3.1, 0.4);
    upperMain.castShadow = true;
    upperMain.receiveShadow = true;
    upperGroup.add(upperMain);

    // Upper Glass Balcony
    const upperGlass = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.8, 0.1), glassMat);
    upperGlass.position.set(0.6, 3.1, 2.61);
    upperGroup.add(upperGlass);

    // Cantilever Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.2, 5.6), wallMat);
    canopy.position.set(0.4, 4.2, 0.4);
    canopy.castShadow = true;
    upperGroup.add(canopy);

    modelGroup.add(upperGroup);

    // Floor visibility control
    if (activeFloor === 'ground') {
      upperGroup.visible = false;
      groundGroup.visible = true;
    } else if (activeFloor === 'upper') {
      upperGroup.visible = true;
      groundGroup.visible = false;
    } else {
      upperGroup.visible = true;
      groundGroup.visible = true;
    }

    scene.add(modelGroup);

    // 5. Mouse Parallax Orbit
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.6;
      targetRotX = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      modelGroup.rotation.y = currentRotY + Math.sin(time * 0.3) * 0.05;
      modelGroup.rotation.x = currentRotX * 0.5;
      modelGroup.position.y = Math.sin(time * 0.7) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [isDark, lightingMode, wireframeMode, activeFloor]);

  return (
    <div className={`relative w-full rounded-[2.5rem] overflow-hidden border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial bg-gradient-to-b from-[#fbfbf9] to-[#f4f0e8] dark:from-[#18181b] dark:to-[#121214] ${className}`}>
      {/* 3D Model Header */}
      <div className="p-6 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-[#f4f0e8] dark:border-[#27272a]/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b]">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#fbfbf9]">
                Architectural 3D Spatial Model
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#b58d59]/20 text-[#b58d59] dark:text-[#d4b996] border border-[#b58d59]/30">
                Interactive
              </span>
            </div>
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
              {property?.area ? `${property.area} sq ft • ` : ''}{property?.bedrooms || 1} BHK Spatial Floorplan
            </p>
          </div>
        </div>

        {/* Spatial Toolbar Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f4f0e8] dark:bg-[#27272a] rounded-full border border-[#e5e0d8] dark:border-[#3f3f46] text-xs">
          <button
            type="button"
            onClick={() => setLightingMode('goldenHour')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              lightingMode === 'goldenHour'
                ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b] shadow-sm'
                : 'text-[#71717a] dark:text-[#a1a1aa]'
            }`}
          >
            Golden Hour
          </button>
          <button
            type="button"
            onClick={() => setLightingMode('twilight')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              lightingMode === 'twilight'
                ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b] shadow-sm'
                : 'text-[#71717a] dark:text-[#a1a1aa]'
            }`}
          >
            Twilight
          </button>
          <button
            type="button"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              wireframeMode
                ? 'bg-[#b58d59] text-white shadow-sm'
                : 'text-[#71717a] dark:text-[#a1a1aa]'
            }`}
          >
            Wireframe
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-[360px] sm:h-[400px] cursor-grab active:cursor-grabbing relative" />

      {/* Footer Architectural Specs */}
      <div className="p-4 sm:p-5 bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-md border-t border-[#f4f0e8] dark:border-[#27272a] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#2e2e34]">
          <span className="text-[10px] uppercase font-bold text-[#a1a1aa] block">Structure</span>
          <span className="text-xs font-bold text-[#18181b] dark:text-[#f4f0e8]">Reinforced Glass & Stone</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#2e2e34]">
          <span className="text-[10px] uppercase font-bold text-[#a1a1aa] block">Natural Light</span>
          <span className="text-xs font-bold text-[#18181b] dark:text-[#f4f0e8]">Floor-to-Ceiling 360°</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#2e2e34]">
          <span className="text-[10px] uppercase font-bold text-[#a1a1aa] block">Orientation</span>
          <span className="text-xs font-bold text-[#18181b] dark:text-[#f4f0e8]">Optimal Sunrise Vista</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#2e2e34]">
          <span className="text-[10px] uppercase font-bold text-[#a1a1aa] block">Verification</span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Architect-Audited</span>
        </div>
      </div>
    </div>
  );
}
