import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Architectural3DBackground
 * Premium architectural 3D background layer with minimalist geometric structures,
 * subtle floating motion, gentle mouse parallax, and luxury champagne lighting.
 * Sits purely in the background (pointer-events-none) without interfering with content.
 */
export default function Architectural3DBackground({
  isDark = false,
  variant = 'hero', // 'hero' | 'ambient' | 'subtle'
  className = '',
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || (variant === 'hero' ? 800 : 500);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 2, variant === 'hero' ? 14 : 18);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Optimized pixel ratio
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 0.95 : 1.05;

    container.appendChild(renderer.domElement);

    // Palettes (Zero Blue Guarantee)
    const palette = isDark
      ? {
          slab: 0x1f1f23,
          slabAccent: 0x27272a,
          frame: 0xb58d59,
          glass: 0x323238,
          pool: 0x18181b,
          lightMain: 0xf4f0e8,
          lightWarm: 0xd4b996,
          ambient: 0x222226,
          particles: 0xd4b996,
        }
      : {
          slab: 0xf4efe6,
          slabAccent: 0xe8e1d5,
          frame: 0xb58d59,
          glass: 0xeae4d8,
          pool: 0xded5c4,
          lightMain: 0xfffaf0,
          lightWarm: 0xb58d59,
          ambient: 0xefeae1,
          particles: 0xb58d59,
        };

    // Lights
    const ambientLight = new THREE.AmbientLight(palette.ambient, isDark ? 1.4 : 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(palette.lightMain, isDark ? 2.2 : 2.0);
    dirLight.position.set(12, 18, 14);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(palette.lightWarm, isDark ? 2.0 : 1.5, 30);
    rimLight.position.set(-10, 6, -5);
    scene.add(rimLight);

    // Architectural Root Group
    const archGroup = new THREE.Group();
    scene.add(archGroup);

    // Materials
    const slabMat = new THREE.MeshStandardMaterial({
      color: palette.slab,
      roughness: 0.5,
      metalness: 0.1,
    });

    const slabAccentMat = new THREE.MeshStandardMaterial({
      color: palette.slabAccent,
      roughness: 0.4,
      metalness: 0.15,
    });

    const champagneWireMat = new THREE.MeshStandardMaterial({
      color: palette.frame,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: false,
    });

    const translucentGlassMat = new THREE.MeshPhysicalMaterial({
      color: palette.glass,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.4,
      thickness: 0.5,
    });

    // 1. Central Modern Architectural Pavilion (Minimalist Villa Form)
    const pavilionGroup = new THREE.Group();

    // Slabs (Cantilevered Foundation, Main Floor, Roof)
    const baseSlabGeo = new THREE.BoxGeometry(8, 0.25, 6);
    const baseSlab = new THREE.Mesh(baseSlabGeo, slabMat);
    baseSlab.position.set(0, -1.8, 0);
    pavilionGroup.add(baseSlab);

    const midSlabGeo = new THREE.BoxGeometry(6.8, 0.2, 5.2);
    const midSlab = new THREE.Mesh(midSlabGeo, slabAccentMat);
    midSlab.position.set(0.6, 0.1, 0.4);
    pavilionGroup.add(midSlab);

    const roofSlabGeo = new THREE.BoxGeometry(7.5, 0.22, 5.8);
    const roofSlab = new THREE.Mesh(roofSlabGeo, slabMat);
    roofSlab.position.set(-0.3, 2.1, -0.2);
    pavilionGroup.add(roofSlab);

    // Glass Facade Planes
    const glassPlane1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 0.08), translucentGlassMat);
    glassPlane1.position.set(-0.8, 1.0, 1.6);
    pavilionGroup.add(glassPlane1);

    const glassPlane2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 3.2), translucentGlassMat);
    glassPlane2.position.set(1.4, 1.0, 0.2);
    pavilionGroup.add(glassPlane2);

    // Architectural Champagne Column Framing & Mullions
    const columnGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.8, 16);
    const colPositions = [
      [-3.4, 0.1, 2.4],
      [3.2, 0.1, 2.4],
      [-3.4, 0.1, -2.4],
      [3.2, 0.1, -2.4],
      [0.2, 0.1, 2.4],
    ];
    colPositions.forEach(([x, y, z]) => {
      const col = new THREE.Mesh(columnGeo, champagneWireMat);
      col.position.set(x, y, z);
      pavilionGroup.add(col);
    });

    // Minimalist Cantilevered Louver Beams (Upper Shade)
    for (let i = 0; i < 5; i++) {
      const beamGeo = new THREE.BoxGeometry(2.8, 0.06, 0.18);
      const beam = new THREE.Mesh(beamGeo, champagneWireMat);
      beam.position.set(-1.2, 2.28, 1.8 - i * 0.8);
      pavilionGroup.add(beam);
    }

    // Reflective Terrace / Reflection Water Line
    const poolGeo = new THREE.BoxGeometry(6.5, 0.08, 2.6);
    const poolMat = new THREE.MeshStandardMaterial({
      color: palette.pool,
      roughness: 0.1,
      metalness: 0.6,
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(1.6, -1.7, 3.2);
    pavilionGroup.add(pool);

    archGroup.add(pavilionGroup);

    // 2. Floating Abstract Geometric Architectural Elements (Depth Accents)
    const floatGroup = new THREE.Group();

    // Floating Frame 1 (Left background)
    const frame1Geo = new THREE.TorusGeometry(2.2, 0.04, 16, 4); // Square torus
    const frame1 = new THREE.Mesh(frame1Geo, champagneWireMat);
    frame1.position.set(-7.5, 2.5, -4);
    frame1.rotation.set(0.6, 0.8, 0.2);
    floatGroup.add(frame1);

    // Floating Slab 2 (Right background)
    const floatSlabGeo = new THREE.BoxGeometry(4.5, 0.15, 2.8);
    const floatSlab = new THREE.Mesh(floatSlabGeo, slabAccentMat);
    floatSlab.position.set(8.2, 1.2, -5);
    floatSlab.rotation.set(-0.3, -0.6, 0.2);
    floatGroup.add(floatSlab);

    // Floating Frame 2 (Right lower)
    const frame2Geo = new THREE.TorusGeometry(1.6, 0.03, 16, 4);
    const frame2 = new THREE.Mesh(frame2Geo, champagneWireMat);
    frame2.position.set(6.8, -2.2, -2);
    frame2.rotation.set(0.4, -0.5, 0.7);
    floatGroup.add(frame2);

    archGroup.add(floatGroup);

    // 3. Subtle Ambient Champagne Particles (Gentle Atmospheric Depth)
    const particleCount = variant === 'hero' ? 65 : 35;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 26;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: palette.particles,
      size: 0.09,
      transparent: true,
      opacity: isDark ? 0.6 : 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || (variant === 'hero' ? 800 : 500);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Visibility Check via IntersectionObserver (Pauses loop when offscreen for 0 lag)
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Pause rendering when user scrolls away

      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for mouse parallax
      targetX += (mouseX * 1.5 - targetX) * 0.03;
      targetY += (-mouseY * 1.0 - targetY) * 0.03;

      if (!prefersReducedMotion) {
        // Subtle majestic architectural rotation & floating wave
        archGroup.rotation.y = Math.sin(elapsedTime * 0.12) * 0.18 + targetX * 0.25;
        archGroup.rotation.x = Math.cos(elapsedTime * 0.09) * 0.06 + targetY * 0.15;
        archGroup.position.y = Math.sin(elapsedTime * 0.25) * 0.2;

        // Floating geometric accents slow independent drift
        floatGroup.rotation.y = elapsedTime * 0.04;
        floatGroup.rotation.x = Math.sin(elapsedTime * 0.08) * 0.1;

        // Particles slow drift
        particles.rotation.y = elapsedTime * 0.015;
      } else {
        // Reduced motion: subtle static composition with minimal mouse tracking
        archGroup.rotation.y = targetX * 0.08;
        archGroup.rotation.x = targetY * 0.05;
      }

      camera.position.x = targetX * 0.6;
      camera.position.y = 2 + targetY * 0.4;
      camera.lookAt(0, 0.2, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      renderer.dispose();
    };
  }, [isDark, variant]);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
