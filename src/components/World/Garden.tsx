import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Mesh, InstancedMesh } from 'three';

function createHeartShape(scale = 1): THREE.Shape {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x, y + 0.5 * scale);
  shape.bezierCurveTo(x, y + 0.5 * scale, x - 0.05 * scale, y + 0.35 * scale, x - 0.25 * scale, y + 0.35 * scale);
  shape.bezierCurveTo(x - 0.55 * scale, y + 0.35 * scale, x - 0.55 * scale, y + 0.725 * scale, x - 0.55 * scale, y + 0.725 * scale);
  shape.bezierCurveTo(x - 0.55 * scale, y + 0.85 * scale, x - 0.45 * scale, y + 0.975 * scale, x - 0.25 * scale, y + 1.1 * scale);
  shape.bezierCurveTo(x - 0.1 * scale, y + 1.2 * scale, x, y + 1.3 * scale, x, y + 1.45 * scale);
  shape.bezierCurveTo(x, y + 1.3 * scale, x + 0.1 * scale, y + 1.2 * scale, x + 0.25 * scale, y + 1.1 * scale);
  shape.bezierCurveTo(x + 0.45 * scale, y + 0.975 * scale, x + 0.55 * scale, y + 0.85 * scale, x + 0.55 * scale, y + 0.725 * scale);
  shape.bezierCurveTo(x + 0.55 * scale, y + 0.725 * scale, x + 0.55 * scale, y + 0.35 * scale, x + 0.25 * scale, y + 0.35 * scale);
  shape.bezierCurveTo(x + 0.05 * scale, y + 0.35 * scale, x, y + 0.5 * scale, x, y + 0.5 * scale);
  return shape;
}

function Tree({ position }: { position: [number, number, number] }) {
  const trunkHeight = 1.2 + Math.random() * 0.6;
  const foliageHeight = 1.8 + Math.random() * 0.8;
  const foliageRadius = 1 + Math.random() * 0.5;

  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, trunkHeight, 6]} />
        <meshStandardMaterial color="#8B6F47" />
      </mesh>
      <mesh position={[0, trunkHeight + foliageHeight / 2 - 0.3, 0]} castShadow>
        <coneGeometry args={[foliageRadius, foliageHeight, 6]} />
        <meshStandardMaterial color="#4A7C59" flatShading />
      </mesh>
    </group>
  );
}

function PinkTree({ position }: { position: [number, number, number] }) {
  const trunkHeight = 1.0 + Math.random() * 0.4;
  const foliageRadius = 1.2 + Math.random() * 0.4;

  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, trunkHeight, 6]} />
        <meshStandardMaterial color="#A0785A" />
      </mesh>
      <mesh position={[0, trunkHeight + foliageRadius * 0.7, 0]} castShadow>
        <sphereGeometry args={[foliageRadius, 6, 6]} />
        <meshStandardMaterial color="#FF9EBB" flatShading />
      </mesh>
    </group>
  );
}

function Flowers({ count = 80 }: { count?: number }) {
  const meshRef = useRef<InstancedMesh>(null);

  const { matrices, colors } = useMemo(() => {
    const m: THREE.Matrix4[] = [];
    const c: THREE.Color[] = [];
    const flowerColors = ['#FF6B8A', '#FF8FAB', '#FFB3C6', '#E8A0BF', '#FFC4D6', '#FF4D6D', '#FFDD44'];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = -Math.random() * 160;
      const distFromCenter = Math.abs(x);
      if (distFromCenter < 2.5) continue;

      const mat = new THREE.Matrix4();
      const scale = 0.08 + Math.random() * 0.12;
      mat.makeScale(scale, scale, scale);
      mat.setPosition(x, scale * 0.5, z);
      m.push(mat);
      c.push(new THREE.Color(flowerColors[Math.floor(Math.random() * flowerColors.length)]));
    }
    return { matrices: m, colors: c };
  }, [count]);

  useMemo(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    matrices.forEach((mat, i) => {
      mesh.setMatrixAt(i, mat);
      mesh.setColorAt(i, colors[i]);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [matrices, colors]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, matrices.length]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}

function FlowerStems({ count = 40 }: { count?: number }) {
  const positions = useMemo(() => {
    const p: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 36;
      const z = -Math.random() * 155;
      if (Math.abs(x) < 3) continue;
      p.push([x, 0.35, z]);
    }
    return p;
  }, [count]);

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 4]} />
            <meshStandardMaterial color="#5A8C3F" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.12, 0.18, 5]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#FF6B8A' : i % 3 === 1 ? '#FFB3C6' : '#E8A0BF'} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function HeartDecoration({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<Mesh>(null);
  const heartShape = useMemo(() => createHeartShape(scale), [scale]);
  const extrudeSettings = useMemo(() => ({ depth: 0.15 * scale, bevelEnabled: true, bevelThickness: 0.05 * scale, bevelSize: 0.05 * scale, bevelSegments: 2 }), [scale]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[Math.PI, 0, 0]}>
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshStandardMaterial color="#FF4D6D" emissive="#FF4D6D" emissiveIntensity={0.3} />
    </mesh>
  );
}

function RoseFence({ side }: { side: 1 | -1 }) {
  const PATH_HALF_WIDTH = 2.2;

  const fencePosts = useMemo(() => {
    const posts: { pos: [number, number, number]; hasRose: boolean }[] = [];
    for (let z = 6; z > -158; z -= 3) {
      const wobble = Math.sin(z * 0.05) * 1.5;
      const x = wobble + PATH_HALF_WIDTH * side;
      posts.push({ pos: [x, 0, z], hasRose: Math.random() > 0.3 });
    }
    return posts;
  }, [side]);

  return (
    <group>
      {fencePosts.map((post, i) => {
        const nextPost = fencePosts[i + 1];
        return (
          <group key={i}>
            <mesh position={[post.pos[0], 0.4, post.pos[2]]} castShadow>
              <boxGeometry args={[0.12, 0.8, 0.12]} />
              <meshStandardMaterial color="#8B6844" />
            </mesh>
            <mesh position={[post.pos[0], 0.75, post.pos[2]]}>
              <sphereGeometry args={[0.08, 5, 5]} />
              <meshStandardMaterial color="#A07850" />
            </mesh>

            {nextPost && (
              <mesh
                position={[
                  (post.pos[0] + nextPost.pos[0]) / 2,
                  0.45,
                  (post.pos[2] + nextPost.pos[2]) / 2,
                ]}
                rotation={[
                  0,
                  Math.atan2(nextPost.pos[0] - post.pos[0], nextPost.pos[2] - post.pos[2]),
                  0,
                ]}
              >
                <boxGeometry args={[0.06, 0.06, 3.1]} />
                <meshStandardMaterial color="#9B7B5A" />
              </mesh>
            )}
            {nextPost && (
              <mesh
                position={[
                  (post.pos[0] + nextPost.pos[0]) / 2,
                  0.25,
                  (post.pos[2] + nextPost.pos[2]) / 2,
                ]}
                rotation={[
                  0,
                  Math.atan2(nextPost.pos[0] - post.pos[0], nextPost.pos[2] - post.pos[2]),
                  0,
                ]}
              >
                <boxGeometry args={[0.06, 0.06, 3.1]} />
                <meshStandardMaterial color="#9B7B5A" />
              </mesh>
            )}

            {post.hasRose && (
              <group position={[post.pos[0] + side * 0.15, 0.15, post.pos[2]]}>
                <mesh>
                  <sphereGeometry args={[0.25, 5, 5]} />
                  <meshStandardMaterial color="#3A6B35" flatShading />
                </mesh>
                {[0, 1, 2].map((r) => (
                  <mesh
                    key={r}
                    position={[
                      Math.sin(r * 2.1 + i) * 0.18,
                      0.12 + Math.cos(r * 1.3) * 0.08,
                      Math.cos(r * 2.1 + i) * 0.18,
                    ]}
                  >
                    <sphereGeometry args={[0.08, 5, 5]} />
                    <meshStandardMaterial
                      color={r === 0 ? '#FF3366' : r === 1 ? '#FF6B8A' : '#FF1744'}
                      emissive={r === 0 ? '#FF3366' : '#FF1744'}
                      emissiveIntensity={0.15}
                    />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

function GardenPath() {
  const pathSegments = useMemo(() => {
    const segments: { pos: [number, number, number]; width: number; length: number; rotation: number }[] = [];
    for (let z = 5; z > -160; z -= 4) {
      const wobble = Math.sin(z * 0.05) * 1.5;
      segments.push({
        pos: [wobble, 0.01, z],
        width: 4,
        length: 5,
        rotation: Math.atan2(Math.sin((z - 2) * 0.05) * 1.5 - Math.sin((z + 2) * 0.05) * 1.5, 4) * 0.3,
      });
    }
    return segments;
  }, []);

  return (
    <group>
      {pathSegments.map((seg, i) => (
        <mesh key={i} position={seg.pos} rotation={[-Math.PI / 2, 0, seg.rotation]} receiveShadow>
          <planeGeometry args={[seg.width, seg.length]} />
          <meshStandardMaterial color="#D4B896" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function Garden() {
  const treePositions = useMemo<[number, number, number][]>(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 30; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = (5 + Math.random() * 12) * side;
      const z = -Math.random() * 155;
      positions.push([x, 0, z]);
    }
    return positions;
  }, []);

  const pinkTreePositions = useMemo<[number, number, number][]>(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 15; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = (4 + Math.random() * 8) * side;
      const z = -Math.random() * 155;
      positions.push([x, 0, z]);
    }
    return positions;
  }, []);

  const heartDecoPositions = useMemo<[number, number, number][]>(() => [
    [6, 4, -10],
    [-7, 3.5, -40],
    [8, 4.5, -75],
    [-6, 3, -105],
    [7, 4, -135],
  ], []);

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -75]} receiveShadow>
        <planeGeometry args={[60, 180]} />
        <meshStandardMaterial color="#7EC87E" side={THREE.DoubleSide} />
      </mesh>

      <GardenPath />
      <RoseFence side={1} />
      <RoseFence side={-1} />

      {treePositions.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
      ))}
      {pinkTreePositions.map((pos, i) => (
        <PinkTree key={`ptree-${i}`} position={pos} />
      ))}

      <Flowers count={100} />
      <FlowerStems count={50} />

      {heartDecoPositions.map((pos, i) => (
        <HeartDecoration key={`heart-${i}`} position={pos} scale={0.6} />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.5} color="#FFF0E6" />
      <directionalLight position={[10, 15, 5]} intensity={0.8} color="#FFF5EE" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 5, -75]} intensity={0.3} color="#FFB3C6" distance={100} />

      <fog attach="fog" args={['#FFE8F0', 30, 80]} />
    </group>
  );
}
