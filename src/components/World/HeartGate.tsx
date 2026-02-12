import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';

interface HeartGateProps {
  position: [number, number, number];
  isLocked: boolean;
  zoneIndex: number;
}

function createHeartGateShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const s = 2.5;
  shape.moveTo(0, 0);
  shape.lineTo(-s, 0);
  shape.lineTo(-s, s * 1.2);
  shape.bezierCurveTo(-s, s * 1.8, -s * 0.5, s * 2.2, 0, s * 1.7);
  shape.bezierCurveTo(s * 0.5, s * 2.2, s, s * 1.8, s, s * 1.2);
  shape.lineTo(s, 0);
  shape.lineTo(s - 0.3, 0);
  shape.lineTo(s - 0.3, s * 1.1);
  shape.bezierCurveTo(s - 0.3, s * 1.65, s * 0.4, s * 1.95, 0, s * 1.5);
  shape.bezierCurveTo(-s * 0.4, s * 1.95, -(s - 0.3), s * 1.65, -(s - 0.3), s * 1.1);
  shape.lineTo(-(s - 0.3), 0);
  shape.lineTo(0, 0);
  return shape;
}

export default function HeartGate({ position, isLocked, zoneIndex }: HeartGateProps) {
  const groupRef = useRef<Group>(null);
  const barrierRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  const heartShape = useMemo(() => createHeartGateShape(), []);
  const extrudeSettings = useMemo(() => ({
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 2,
  }), []);

  const gateColor = isLocked ? '#FF4D6D' : '#FFD700';
  const emissiveColor = isLocked ? '#FF2040' : '#FFB800';

  useFrame((state) => {
    if (barrierRef.current) {
      const mat = barrierRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = isLocked ? 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Heart arch */}
      <mesh ref={glowRef} position={[0, 0, -0.2]} castShadow>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshStandardMaterial
          color={gateColor}
          emissive={emissiveColor}
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Barrier when locked */}
      <mesh ref={barrierRef} position={[0, 2.5, 0]}>
        <planeGeometry args={[4.4, 5]} />
        <meshStandardMaterial
          color={isLocked ? '#FF4D6D' : '#FFD700'}
          transparent
          opacity={isLocked ? 0.3 : 0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Zone label */}
      <Text
        position={[0, 5.5, 0]}
        fontSize={0.5}
        color={isLocked ? '#FF6B8A' : '#FFD700'}
        anchorX="center"
        anchorY="middle"
      >
        {isLocked ? `Zone ${zoneIndex} - Locked` : `Zone ${zoneIndex} - Open`}
      </Text>

      {/* Sparkles on unlock */}
      {!isLocked && (
        <Sparkles
          count={40}
          scale={[5, 6, 2]}
          position={[0, 2.5, 0]}
          size={3}
          speed={0.4}
          color="#FFD700"
        />
      )}

      {isLocked && (
        <Sparkles
          count={15}
          scale={[4, 5, 1]}
          position={[0, 2.5, 0]}
          size={2}
          speed={0.2}
          color="#FF6B8A"
        />
      )}

      <pointLight
        position={[0, 3, 1]}
        intensity={isLocked ? 0.5 : 1}
        color={isLocked ? '#FF4D6D' : '#FFD700'}
        distance={8}
      />
    </group>
  );
}
