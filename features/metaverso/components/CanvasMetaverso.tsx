'use client';

import { Canvas } from '@react-three/fiber';
import { Grid, PointerLockControls, Sky, Text } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

import { useMetaversoStore } from '../hooks/useMetaversoStore';
import type { StandData } from '../types';

function Stand3D({ stand }: { stand: StandData }) {
  const activeStand = useMetaversoStore((state) => state.activeStand);
  const setActiveStand = useMetaversoStore((state) => state.setActiveStand);
  const isActive = activeStand?.id === stand.id;

  return (
    <group position={stand.position}>
      <mesh
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          setActiveStand(stand);
        }}
      >
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial
          color={isActive ? '#1e3a8a' : '#0f172a'}
          metalness={0.1}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 1.8, 1.51]}>
        <planeGeometry args={[3.4, 0.7]} />
        <meshBasicMaterial color="#0284c7" side={THREE.DoubleSide} />
      </mesh>

      <Text
        position={[0, 1.82, 1.54]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {stand.title}
      </Text>

      {isActive && (
        <mesh position={[0, 2.45, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.25, 0.6, 4]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      )}
    </group>
  );
}

export default function CanvasMetaverso() {
  const stands = useMetaversoStore((state) => state.stands);
  const activeStand = useMetaversoStore((state) => state.activeStand);
  const setActiveStand = useMetaversoStore((state) => state.setActiveStand);
  const setIsModalOpen = useMetaversoStore((state) => state.setIsModalOpen);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'e' && activeStand) {
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStand, setIsModalOpen]);

  return (
    <Canvas
      camera={{ position: [0, 3, 12], fov: 60 }}
      shadows={{ type: THREE.PCFShadowMap }}
      onPointerMissed={() => setActiveStand(null)}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />

      <Sky sunPosition={[100, 10, 100]} />
      <Grid
        args={[100, 100]}
        cellColor="#334155"
        sectionColor="#0284c7"
        position={[0, -0.01, 0]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 100]} />
        <meshStandardMaterial color="#1d4ed8" emissive="#1e40af" emissiveIntensity={0.2} />
      </mesh>

      {stands.map((stand) => (
        <Stand3D key={stand.id} stand={stand} />
      ))}

      <PointerLockControls makeDefault />
    </Canvas>
  );
}
