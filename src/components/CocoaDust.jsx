import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { reducedMotion } from '../lib/gsap';

/**
 * CocoaDust — a lightweight Three.js particle field of drifting cocoa motes.
 * Pauses off-screen, caps DPR, and never mounts under reduced motion.
 */
export default function CocoaDust({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 90 : 260;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.z = 9;

    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i] = 0.08 + Math.random() * 0.3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft round sprite drawn on a canvas — no texture fetch needed
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const ctx = sprite.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,235,200,1)');
    grad.addColorStop(0.4, 'rgba(228,177,91,0.55)');
    grad.addColorStop(1, 'rgba(228,177,91,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(sprite);

    const mat = new THREE.PointsMaterial({
      size: 0.32,
      map: texture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xe4b15b,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let running = true;
    let raf = 0;
    const mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) loop();
    });
    io.observe(mount);

    const clock = new THREE.Clock();
    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      const pos = geo.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        let y = pos.getY(i) + speeds[i] * 0.008;
        if (y > 6.2) y = -6.2;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.5 + i) * 0.0012);
      }
      pos.needsUpdate = true;
      camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      texture.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`cocoa-dust ${className}`} aria-hidden="true" />;
}
