import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion, webglConfig } from '../config/experienceConfig';

function RoadLines() {
  const group = useRef();
  const reduced = prefersReducedMotion();
  const lines = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    x: (i % 2 === 0 ? -1 : 1) * (0.42 + (i % 5) * 0.18),
    z: -i * 0.42,
    scale: 0.28 + (i % 4) * 0.06,
  })), []);

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    group.current.children.forEach((line) => {
      line.position.z += delta * 1.7;
      if (line.position.z > 1.6) line.position.z = -10;
    });
  });

  return (
    <group ref={group} position={[0, -1.08, 0.8]} rotation={[-0.82, 0, 0]}>
      {lines.map((line, index) => (
        <mesh key={`${line.x}-${index}`} position={[line.x, 0, line.z]} scale={[line.scale, 0.018, 1]}>
          <boxGeometry args={[0.06, 0.025, 0.52]} />
          <meshBasicMaterial color={index % 3 === 0 ? '#ed1111' : '#f5f5f5'} transparent opacity={index % 3 === 0 ? 0.62 : 0.36} />
        </mesh>
      ))}
    </group>
  );
}

function CrescentArc() {
  const mesh = useRef();
  const reduced = prefersReducedMotion();

  useFrame((state) => {
    if (!mesh.current || reduced) return;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.28) * 0.08;
    mesh.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <mesh ref={mesh} position={[1.38, 0.34, -0.35]} rotation={[0.12, 0.1, -0.48]}>
      <torusGeometry args={[1.05, 0.035, 18, 96, Math.PI * 1.42]} />
      <meshBasicMaterial color="#ed1111" transparent opacity={0.22} side={THREE.DoubleSide} />
    </mesh>
  );
}

function LightSweep() {
  const mesh = useRef();
  const reduced = prefersReducedMotion();

  useFrame((state) => {
    if (!mesh.current || reduced) return;
    mesh.current.position.x = Math.sin(state.clock.elapsedTime * 0.55) * 0.72;
  });

  return (
    <mesh ref={mesh} position={[0.2, -0.52, 0]}>
      <planeGeometry args={[2.8, 0.08]} />
      <meshBasicMaterial color="#ed1111" transparent opacity={0.32} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.65} />
      <CrescentArc />
      <RoadLines />
      <LightSweep />
    </>
  );
}

export default function WebGLHeroScene() {
  return (
    <div className="webgl-hero-scene" aria-hidden="true">
      <Canvas camera={webglConfig.camera} dpr={webglConfig.dpr} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
