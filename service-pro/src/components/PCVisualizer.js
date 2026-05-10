import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const PCVisualizer = ({ isDark }) => {
  const mountRef = useRef(null);
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const ambLight = new THREE.AmbientLight(isDark ? 0x404040 : 0xcccccc, 2);
    scene.add(ambLight);
    const pLight = new THREE.PointLight(0x00f2ff, 10, 100);
    pLight.position.set(5, 5, 5);
    scene.add(pLight);

    const caseGeo = new THREE.BoxGeometry(2, 2.5, 1);
    const caseMat = new THREE.MeshPhongMaterial({ color: isDark ? 0x111111 : 0xdddddd, transparent: true, opacity: 0.5, wireframe: true });
    const pcCase = new THREE.Mesh(caseGeo, caseMat);
    scene.add(pcCase);

    camera.position.z = 4;
    const animate = () => {
      requestAnimationFrame(animate);
      pcCase.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) container.innerHTML = '';
    };
  }, [isDark]);
  return <div ref={mountRef} className="w-full h-full min-h-[300px]" />;
};

export default PCVisualizer;