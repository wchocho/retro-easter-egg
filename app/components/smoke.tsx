'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Smoke() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = mountRef.current;
    if (!current) return;

    let width = current.clientWidth;
    let height = current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    current.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 1);

    const smoke : THREE.Mesh[] = [];

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "";
    const texture = loader.load('/smoke.webp', () => {
        const smokeGeometry = new THREE.PlaneGeometry(6, 6);
        const smokeMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.01,
        });
        const NUM_SMOKES = 100
        for (let i = 0; i < NUM_SMOKES; i++) {
        const particle = new THREE.Mesh(smokeGeometry, smokeMaterial);
        particle.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
        particle.rotation.z = Math.random() * Math.PI;
        particle.material.opacity = Math.random() * 0.02 + 0.02;
        smoke.push(particle);
        scene.add(particle);
      }
    });

    camera.position.z = 5;

    function resize(){
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }


    const animate = function () {
      requestAnimationFrame(animate);

      smoke.forEach((particle) => {
        if(particle.position.y < -10 || particle.position.y > 10) {
          particle.position.y = 0;
        }
        if(particle.position.x < -10 || particle.position.x > 10) {
            particle.position.x = 0;
          }
        particle.rotation.z += 0.001;
        particle.position.y -= 0.001;
      });

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', resize, false);
    return () => {
      current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}