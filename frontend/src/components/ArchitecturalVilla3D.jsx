import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Sun, Moon, Compass, Sparkles, Layers } from 'lucide-react';

export default function ArchitecturalVilla3D({ isDark = false, className = '' }) {
  const mountRef = useRef(null);
  const [viewMode, setViewMode] = useState('perspective'); // 'perspective' | 'skyline' | 'twilight'
  const [isHovered, setIsHovered] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x121214 : 0xf4f0e8, 0.035);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(11, 7, 13);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.1 : 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(isDark ? 0x4a443b : 0xfffaed, isDark ? 1.4 : 1.8);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(isDark ? 0xd4b996 : 0xfff4dc, isDark ? 2.2 : 2.8);
    mainSun.position.set(12, 18, 10);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    mainSun.shadow.bias = -0.0005;
    scene.add(mainSun);

    // Warm Architectural Interior & Accent Point Lights (Champagne / Amber Glow)
    const interiorGlow1 = new THREE.PointLight(0xb58d59, isDark ? 3.5 : 2.0, 14);
    interiorGlow1.position.set(0, 2.2, 0);
    scene.add(interiorGlow1);

    const interiorGlow2 = new THREE.PointLight(0xd4b996, isDark ? 2.8 : 1.5, 10);
    interiorGlow2.position.set(-2.5, 1.2, 1.5);
    scene.add(interiorGlow2);

    const poolGlow = new THREE.PointLight(isDark ? 0xc5a880 : 0xe8d5be, isDark ? 2.0 : 1.2, 8);
    poolGlow.position.set(2.5, 0.4, 3.2);
    scene.add(poolGlow);

    // 3. Materials System (Warm Champagne, Charcoal, Travertine Marble & Architectural Glass)
    const concreteMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x222226 : 0xece6dc,
      roughness: 0.45,
      metalness: 0.1,
    });

    const warmWoodMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x6e5234 : 0xa67c52,
      roughness: 0.55,
      metalness: 0.05,
    });

    const champagneMetal = new THREE.MeshStandardMaterial({
      color: 0xb58d59,
      roughness: 0.25,
      metalness: 0.85,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x333338 : 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.5,
    });

    const waterMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1f2326 : 0xd8e2dc,
      roughness: 0.1,
      metalness: 0.8,
    });

    // 4. Architectural Villa Model Construction
    const villaGroup = new THREE.Group();

    // Ground Platform (Travertine Terrace)
    const terraceGeo = new THREE.BoxGeometry(14, 0.4, 12);
    const terraceMesh = new THREE.Mesh(terraceGeo, concreteMaterial);
    terraceMesh.position.y = -0.2;
    terraceMesh.receiveShadow = true;
    villaGroup.add(terraceMesh);

    // Infinity Reflection Pool
    const poolGeo = new THREE.BoxGeometry(5.5, 0.35, 4.5);
    const poolMesh = new THREE.Mesh(poolGeo, waterMaterial);
    poolMesh.position.set(3.2, -0.05, 3);
    villaGroup.add(poolMesh);

    // Pool Champagne Border
    const poolBorderGeo = new THREE.BoxGeometry(5.8, 0.1, 4.8);
    const poolBorder = new THREE.Mesh(poolBorderGeo, champagneMetal);
    poolBorder.position.set(3.2, 0.02, 3);
    villaGroup.add(poolBorder);

    // Ground Floor Living Pavilion (Cantilevered Structure)
    const groundFloorGeo = new THREE.BoxGeometry(7, 2.4, 5.5);
    const groundFloor = new THREE.Mesh(groundFloorGeo, concreteMaterial);
    groundFloor.position.set(-1.5, 1.2, 0);
    groundFloor.castShadow = true;
    groundFloor.receiveShadow = true;
    villaGroup.add(groundFloor);

    // Floor-to-Ceiling Glass Facades (Living Area)
    const glassFacadeGeo = new THREE.BoxGeometry(6.6, 2.2, 0.1);
    const glassFront = new THREE.Mesh(glassFacadeGeo, glassMaterial);
    glassFront.position.set(-1.5, 1.2, 2.76);
    villaGroup.add(glassFront);

    // Upper Cantilevered Master Suite (Offset Luxury Box)
    const upperFloorGeo = new THREE.BoxGeometry(6.2, 2.2, 5.8);
    const upperFloor = new THREE.Mesh(upperFloorGeo, concreteMaterial);
    upperFloor.position.set(0.5, 3.4, 0.5);
    upperFloor.castShadow = true;
    upperFloor.receiveShadow = true;
    villaGroup.add(upperFloor);

    // Master Bedroom Glass Wall & Balcony Railing
    const upperGlassGeo = new THREE.BoxGeometry(5.8, 1.9, 0.1);
    const upperGlass = new THREE.Mesh(upperGlassGeo, glassMaterial);
    upperGlass.position.set(0.5, 3.4, 3.41);
    villaGroup.add(upperGlass);

    // Architectural Timber Slats & Screen Accents
    for (let i = 0; i < 9; i++) {
      const slatGeo = new THREE.BoxGeometry(0.08, 2.1, 0.2);
      const slat = new THREE.Mesh(slatGeo, warmWoodMaterial);
      slat.position.set(-4.5 + i * 0.4, 3.4, 2.9);
      slat.castShadow = true;
      villaGroup.add(slat);
    }

    // Cantilevered Roof Canopy (Slim Minimalist Slab)
    const roofGeo = new THREE.BoxGeometry(8.2, 0.25, 7.2);
    const roofMesh = new THREE.Mesh(roofGeo, concreteMaterial);
    roofMesh.position.set(0.2, 4.6, 0.5);
    roofMesh.castShadow = true;
    villaGroup.add(roofMesh);

    // Slender Champagne Architectural Columns
    const colGeo = new THREE.CylinderGeometry(0.07, 0.07, 4.4, 16);
    const col1 = new THREE.Mesh(colGeo, champagneMetal);
    col1.position.set(3.8, 2.2, 3.6);
    col1.castShadow = true;
    villaGroup.add(col1);

    const col2 = new THREE.Mesh(colGeo, champagneMetal);
    col2.position.set(3.8, 2.2, -2.6);
    col2.castShadow = true;
    villaGroup.add(col2);

    // Warm Patio Furniture / Loungers by the Pool
    const loungerGeo = new THREE.BoxGeometry(0.8, 0.2, 1.8);
    const lounger1 = new THREE.Mesh(loungerGeo, warmWoodMaterial);
    lounger1.position.set(1.6, 0.1, 2.2);
    lounger1.rotation.y = 0.2;
    villaGroup.add(lounger1);

    const lounger2 = new THREE.Mesh(loungerGeo, warmWoodMaterial);
    lounger2.position.set(1.2, 0.1, 3.8);
    lounger2.rotation.y = 0.15;
    villaGroup.add(lounger2);

    // Floating Ambient Light Particles (Champagne dust in sunlight)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = Math.random() * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0xd4b996 : 0xb58d59,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    villaGroup.add(particleSystem);

    scene.add(villaGroup);

    // 5. Interactive Mouse Parallax & Smooth Interpolation
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop (60 FPS Damped Lerp)
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation based on target mouse coordinates
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Gentle floating oscillation
      villaGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.08;
      villaGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.04 + mouseX * 0.25;

      // Particle subtle floating drift
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.003;
        if (positions[i] > 8) positions[i] = 0.5;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Adjust camera positioning based on active view mode
      if (viewMode === 'skyline') {
        camera.position.x += (6 + mouseX * 2 - camera.position.x) * 0.04;
        camera.position.y += (12 + mouseY * 2 - camera.position.y) * 0.04;
        camera.position.z += (15 - camera.position.z) * 0.04;
      } else if (viewMode === 'twilight') {
        camera.position.x += (13 + mouseX * 2 - camera.position.x) * 0.04;
        camera.position.y += (4 + mouseY * 2 - camera.position.y) * 0.04;
        camera.position.z += (11 - camera.position.z) * 0.04;
      } else {
        camera.position.x += (11 + mouseX * 2.5 - camera.position.x) * 0.04;
        camera.position.y += (7 + mouseY * 2.5 - camera.position.y) * 0.04;
        camera.position.z += (13 - camera.position.z) * 0.04;
      }

      camera.lookAt(0, 1.5, 0);
      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials to avoid memory leaks
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [isDark, viewMode]);

  return (
    <div
      className={`relative w-full h-full rounded-[2.5rem] overflow-hidden border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial-lg bg-gradient-to-br from-[#f4f0e8]/80 to-[#fbfbf9]/95 dark:from-[#18181b]/90 dark:to-[#121214]/95 backdrop-blur-md ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Mount Container */}
      {webglSupported ? (
        <div ref={mountRef} className="w-full h-full min-h-[380px] sm:min-h-[440px] cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="w-full h-full min-h-[380px] flex items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')" }}>
          <div className="p-6 rounded-2xl bg-[#18181b]/80 backdrop-blur-md text-white text-center">
            <h3 className="font-editorial text-2xl font-bold">Architectural Villa Model</h3>
            <p className="text-xs text-[#d4b996] mt-1">Interactive 3D preview active</p>
          </div>
        </div>
      )}

      {/* Floating 3D Spatial Controls Bar */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 dark:bg-[#1c1c20]/80 backdrop-blur-md border border-[#e5e0d8] dark:border-[#3f3f46] shadow-sm z-10 text-xs">
        <button
          type="button"
          onClick={() => setViewMode('perspective')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
            viewMode === 'perspective'
              ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b] shadow-sm'
              : 'text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white'
          }`}
          title="Perspective View"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Perspective</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('skyline')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
            viewMode === 'skyline'
              ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b] shadow-sm'
              : 'text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white'
          }`}
          title="Skyline Aerial View"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Skyline</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('twilight')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
            viewMode === 'twilight'
              ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b] shadow-sm'
              : 'text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white'
          }`}
          title="Twilight Evening View"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Twilight</span>
        </button>
      </div>

      {/* Subtle Bottom Architectural Badge */}
      <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-3 p-3.5 rounded-2xl bg-white/85 dark:bg-[#18181b]/85 backdrop-blur-md border border-[#e5e0d8] dark:border-[#2e2e34] shadow-md z-10 pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b58d59] dark:text-[#d4b996]">
              Real-Time 3D Engine
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#f4f0e8] dark:bg-[#27272a] text-[#71717a] dark:text-[#a1a1aa] font-semibold">
              60 FPS
            </span>
          </div>
          <p className="text-xs font-bold text-[#18181b] dark:text-[#f4f0e8] mt-0.5">
            Interactive Villa Pavilion • Move cursor to explore
          </p>
        </div>
      </div>
    </div>
  );
}
