import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export default function Earth3D({ showAtmosphere = true, dayNightCycle = true }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const earthRef = useRef(null);
  const atmosphereRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.z = 2.5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Earth
    const geometryEarth = new THREE.SphereGeometry(1, 64, 64);
    
    // Create canvas texture for Earth
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Gradient background (space blue)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a3a52');
    gradient.addColorStop(0.5, '#0f1e2e');
    gradient.addColorStop(1, '#1a3a52');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ocean color
    ctx.fillStyle = '#1e90ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Land masses (simplified)
    ctx.fillStyle = '#2d5a1e';
    const landMasses = [
      { x: 400, y: 300, w: 250, h: 200 }, // North America
      { x: 800, y: 350, w: 300, h: 180 }, // Europe/Africa
      { x: 1200, y: 300, w: 280, h: 220 }, // Asia
      { x: 1600, y: 400, w: 150, h: 120 }, // Australia
      { x: 150, y: 500, w: 100, h: 150 }, // South America
    ];
    landMasses.forEach(land => {
      ctx.fillRect(land.x, land.y, land.w, land.h);
    });

    // Add cloud texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 50 + 20, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    const materialEarth = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 5,
      emissive: 0x112244,
    });
    
    const earth = new THREE.Mesh(geometryEarth, materialEarth);
    earthRef.current = earth;
    scene.add(earth);

    // Create atmosphere glow
    if (showAtmosphere) {
      const geometryAtmosphere = new THREE.SphereGeometry(1.05, 64, 64);
      const materialAtmosphere = new THREE.MeshBasicMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(geometryAtmosphere, materialAtmosphere);
      atmosphereRef.current = atmosphere;
      scene.add(atmosphere);

      // Atmosphere glow effect
      const glowGeometry = new THREE.SphereGeometry(1.1, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      scene.add(glow);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starsVertices), 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    setIsLoading(false);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging && earth) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        earth.rotation.y += deltaX * 0.01;
        earth.rotation.x += deltaY * 0.01;
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });

    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.001;
      camera.position.z = Math.max(1, Math.min(5, camera.position.z));
    });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (earth && !isDragging) {
        earth.rotation.y += 0.0002;
      }

      // Day/night cycle
      if (dayNightCycle && pointLight) {
        pointLight.position.x = Math.cos(Date.now() * 0.0001) * 5;
        pointLight.position.z = Math.sin(Date.now() * 0.0001) * 5;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [showAtmosphere, dayNightCycle]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
      className="relative w-full h-full bg-slate-900"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
          <div className="text-white text-lg font-semibold">Loading 3D Earth...</div>
        </div>
      )}
    </motion.div>
  );
}
