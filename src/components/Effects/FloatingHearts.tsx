import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InstancedMesh } from 'three';

interface HeartParticle {
  position: THREE.Vector3;
  speed: number;
  rotSpeed: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  scale: number;
  resetY: number;
  maxY: number;
}

const HEART_COUNT = 50;

function createHeartGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const s = 1;
  shape.moveTo(0, s * 0.5);
  shape.bezierCurveTo(0, s * 0.5, -s * 0.05, s * 0.35, -s * 0.25, s * 0.35);
  shape.bezierCurveTo(-s * 0.55, s * 0.35, -s * 0.55, s * 0.725, -s * 0.55, s * 0.725);
  shape.bezierCurveTo(-s * 0.55, s * 0.85, -s * 0.45, s * 0.975, -s * 0.25, s * 1.1);
  shape.bezierCurveTo(-s * 0.1, s * 1.2, 0, s * 1.3, 0, s * 1.45);
  shape.bezierCurveTo(0, s * 1.3, s * 0.1, s * 1.2, s * 0.25, s * 1.1);
  shape.bezierCurveTo(s * 0.45, s * 0.975, s * 0.55, s * 0.85, s * 0.55, s * 0.725);
  shape.bezierCurveTo(s * 0.55, s * 0.725, s * 0.55, s * 0.35, s * 0.25, s * 0.35);
  shape.bezierCurveTo(s * 0.05, s * 0.35, 0, s * 0.5, 0, s * 0.5);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 1,
  });
  geometry.center();
  return geometry;
}

export default function FloatingHearts() {
  const meshRef = useRef<InstancedMesh>(null);

  const heartGeometry = useMemo(() => createHeartGeometry(), []);

  const particles = useMemo<HeartParticle[]>(() => {
    return Array.from({ length: HEART_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        Math.random() * 8 + 1,
        -Math.random() * 160
      ),
      speed: 0.2 + Math.random() * 0.4,
      rotSpeed: (Math.random() - 0.5) * 2,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random() * 1,
      scale: 0.15 + Math.random() * 0.2,
      resetY: -1 + Math.random() * 2,
      maxY: 10 + Math.random() * 4,
    }));
  }, []);

  const colors = useMemo(() => {
    const palette = ['#FF6B8A', '#FF4D6D', '#FFB3C6', '#E8A0BF', '#FF8FAB'];
    return particles.map(() => new THREE.Color(palette[Math.floor(Math.random() * palette.length)]));
  }, [particles]);

  // Set initial colors
  useMemo(() => {
    if (!meshRef.current) return;
    colors.forEach((color, i) => {
      meshRef.current!.setColorAt(i, color);
    });
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [colors]);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < HEART_COUNT; i++) {
      const p = particles[i];

      p.position.y += p.speed * 0.016;
      const wobbleX = Math.sin(t * p.wobbleSpeed + p.wobbleOffset) * 0.3;

      if (p.position.y > p.maxY) {
        p.position.y = p.resetY;
        p.position.x = (Math.random() - 0.5) * 40;
        p.position.z = -Math.random() * 160;
      }

      tempEuler.set(
        Math.sin(t * p.rotSpeed * 0.5) * 0.3,
        t * p.rotSpeed,
        Math.PI
      );
      tempQuat.setFromEuler(tempEuler);
      tempScale.set(p.scale, p.scale, p.scale);

      tempMatrix.compose(
        new THREE.Vector3(p.position.x + wobbleX, p.position.y, p.position.z),
        tempQuat,
        tempScale
      );

      meshRef.current.setMatrixAt(i, tempMatrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[heartGeometry, undefined, HEART_COUNT]}>
      <meshStandardMaterial
        color="#FF6B8A"
        emissive="#FF4D6D"
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
