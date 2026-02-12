import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh, Group } from 'three';
import HeartGate from './HeartGate.tsx';
import { useGameStore } from '../../store/gameStore.ts';
import { useT } from '../../store/langStore.ts';

interface TriggerObjectProps {
  position: [number, number, number];
  puzzleId: string;
  label: string;
  children: React.ReactNode;
}

function TriggerObject({ position, puzzleId, label, children }: TriggerObjectProps) {
  const glowRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const activePuzzle = useGameStore((s) => s.activePuzzle);
  const t = useT();
  const isActive = activePuzzle === puzzleId;

  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group>
      <group ref={groupRef} position={position}>
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.4}
            transparent
            opacity={0.2}
          />
        </mesh>
        {children}
        <Sparkles count={10} scale={2} size={2} speed={0.3} color="#FFD700" />
      </group>

      <Text
        position={[position[0], position[1] + 1.5, position[2]]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {isActive ? t.zoneLabels.active : label}
      </Text>
    </group>
  );
}

// Zone 0: Park bench at origin
function Zone0Start() {
  const t = useT();
  return (
    <group position={[0, 0, 0]}>
      {/* Park bench */}
      <group position={[2, 0, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 0.1, 0.6]} />
          <meshStandardMaterial color="#8B5E3C" />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.9, -0.25]} castShadow>
          <boxGeometry args={[2, 0.7, 0.08]} />
          <meshStandardMaterial color="#8B5E3C" />
        </mesh>
        {/* Legs */}
        {[-0.8, 0.8].map((x) => (
          <mesh key={x} position={[x, 0.25, 0]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.5]} />
            <meshStandardMaterial color="#5C3A1E" />
          </mesh>
        ))}
      </group>

      {/* Welcome sign */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text
          position={[0, 3, 2]}
          fontSize={0.6}
          color="#FF4D6D"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#FFFFFF"
        >
          {t.zoneLabels.welcomeSign}
        </Text>
      </Float>

      {/* Decorative lamp post */}
      <group position={[-2, 0, 1]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 3, 6]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#FFEECC" emissive="#FFDD88" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, 3.2, 0]} intensity={0.4} color="#FFDD88" distance={8} />
      </group>
    </group>
  );
}

// Zone 1: University courtyard
function Zone1University() {
  const t = useT();
  return (
    <group position={[0, 0, -30]}>
      {/* Fountain base */}
      <mesh position={[3, 0.4, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.8, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[3, 1.2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 8]} />
        <meshStandardMaterial color="#B0B0B0" metalness={0.5} />
      </mesh>
      {/* Water surface */}
      <mesh position={[3, 0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 16]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
      </mesh>

      {/* Benches around fountain */}
      {[[5, 0, 2], [-1, 0, -2]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.5, 0.1, 0.5]} />
            <meshStandardMaterial color="#8B5E3C" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.08, 0.4, 0.4]} />
            <meshStandardMaterial color="#5C3A1E" />
          </mesh>
        </group>
      ))}

      {/* Books scattered */}
      {[[-2, 0.1, 1], [4, 0.1, -2], [-1, 0.1, 3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, Math.random() * Math.PI, 0]} castShadow>
          <boxGeometry args={[0.4, 0.08, 0.3]} />
          <meshStandardMaterial color={['#8B0000', '#1B4F72', '#2E4053'][i]} />
        </mesh>
      ))}

      {/* Trigger: Floating love letter */}
      <TriggerObject position={[0, 1.5, 0]} puzzleId="trivia" label={t.zoneLabels.triggerLabels[0]}>
        <mesh rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.5, 0.35, 0.03]} />
          <meshStandardMaterial color="#FFF0E6" emissive="#FFB3C6" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0.08, 0.02]}>
          <coneGeometry args={[0.18, 0.15, 3]} />
          <meshStandardMaterial color="#FF6B8A" />
        </mesh>
      </TriggerObject>

      <pointLight position={[3, 3, 0]} intensity={0.4} color="#E8D5B7" distance={12} />
    </group>
  );
}

// Zone 2: Parking lot
function Zone2ParkingLot() {
  const t = useT();
  const carColors = ['#3366CC', '#CC3333', '#33AA33', '#CCCC33'];

  return (
    <group position={[0, 0, -60]}>
      {/* Asphalt ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Parking lines */}
      {[-4, -1, 2, 5].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -2]} receiveShadow>
          <planeGeometry args={[0.08, 4]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}

      {/* Parked cars (simple box + roof) */}
      {carColors.map((color, i) => {
        const x = -3 + i * 3;
        return (
          <group key={i} position={[x, 0, -3]}>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[1.6, 0.6, 2.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.85, -0.1]} castShadow>
              <boxGeometry args={[1.4, 0.45, 1.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Wheels */}
            {[[-0.7, 0.15, 0.8], [0.7, 0.15, 0.8], [-0.7, 0.15, -0.8], [0.7, 0.15, -0.8]].map((wPos, wi) => (
              <mesh key={wi} position={wPos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
                <meshStandardMaterial color="#222222" />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Orange cones */}
      {[[2, 0, 2], [-2, 0, 3], [0, 0, 4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <coneGeometry args={[0.15, 0.5, 6]} />
          <meshStandardMaterial color="#FF6600" />
        </mesh>
      ))}

      {/* Trigger: Car with bow */}
      <TriggerObject position={[0, 1.5, 3]} puzzleId="driving" label={t.zoneLabels.triggerLabels[1]}>
        <group>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.8, 0.3, 1.2]} />
            <meshStandardMaterial color="#FF69B4" emissive="#FF69B4" emissiveIntensity={0.2} />
          </mesh>
          {/* Bow on top */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.2, 0.06, 6, 12]} />
            <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
          </mesh>
        </group>
      </TriggerObject>

      <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFFFEE" distance={15} />
    </group>
  );
}

// Zone 3: Cozy apartment
function Zone3Apartment() {
  const t = useT();
  return (
    <group position={[0, 0, -90]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#C4A882" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.5, -5]} castShadow>
        <boxGeometry args={[12, 3, 0.2]} />
        <meshStandardMaterial color="#F5E6D3" />
      </mesh>
      <mesh position={[-6, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 10]} />
        <meshStandardMaterial color="#F5E6D3" />
      </mesh>

      {/* Mattress on floor */}
      <mesh position={[-3, 0.15, -3]} castShadow>
        <boxGeometry args={[2.5, 0.3, 3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Pillow */}
      <mesh position={[-3, 0.35, -4]} castShadow>
        <boxGeometry args={[1.2, 0.15, 0.5]} />
        <meshStandardMaterial color="#FFB3C6" />
      </mesh>
      {/* Blanket */}
      <mesh position={[-3, 0.32, -2.5]} castShadow>
        <boxGeometry args={[2.3, 0.05, 1.5]} />
        <meshStandardMaterial color="#E8A0BF" />
      </mesh>

      {/* Monitor on box */}
      <group position={[3, 0, -3]}>
        {/* The box/crate */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.2, 0.6, 0.8]} />
          <meshStandardMaterial color="#B8860B" />
        </mesh>
        {/* Monitor */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[1, 0.7, 0.06]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 1, 0.04]}>
          <planeGeometry args={[0.85, 0.55]} />
          <meshStandardMaterial color="#4488FF" emissive="#4488FF" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* String lights along wall */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i}>
          <mesh position={[-5.8, 2.5, -4 + i * 1.2]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#FFD700' : '#FF6B8A'}
              emissive={i % 2 === 0 ? '#FFD700' : '#FF6B8A'}
              emissiveIntensity={0.8}
            />
          </mesh>
          <pointLight
            position={[-5.8, 2.5, -4 + i * 1.2]}
            intensity={0.1}
            color={i % 2 === 0 ? '#FFD700' : '#FF6B8A'}
            distance={3}
          />
        </group>
      ))}

      {/* Trigger: Monitor screen */}
      <TriggerObject position={[3, 2, -2]} puzzleId="memory" label={t.zoneLabels.triggerLabels[2]}>
        <mesh>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#4488FF" emissive="#4488FF" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      </TriggerObject>
    </group>
  );
}

// Zone 4: Movie theater
function Zone4Theater() {
  const t = useT();
  return (
    <group position={[0, 0, -120]}>
      {/* Theater floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#2C1810" />
      </mesh>

      {/* Big screen */}
      <mesh position={[0, 3, -5.5]} castShadow>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0, 3, -5.38]}>
        <planeGeometry args={[9, 4.2]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#1a1a2e" emissiveIntensity={0.1} />
      </mesh>

      {/* Theater seats - 3 rows */}
      {[-2, 0, 2].map((z, row) => (
        <group key={row}>
          {[-4, -2.5, -1, 0.5, 2, 3.5].map((x, col) => (
            <group key={`${row}-${col}`} position={[x, row * 0.15, z]}>
              {/* Seat base */}
              <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[0.9, 0.08, 0.6]} />
                <meshStandardMaterial color="#8B0000" />
              </mesh>
              {/* Seat back */}
              <mesh position={[0, 0.65, -0.25]} castShadow>
                <boxGeometry args={[0.9, 0.55, 0.08]} />
                <meshStandardMaterial color="#8B0000" />
              </mesh>
              {/* Armrests */}
              {[-0.4, 0.4].map((ax) => (
                <mesh key={ax} position={[ax, 0.42, 0]} castShadow>
                  <boxGeometry args={[0.06, 0.06, 0.5]} />
                  <meshStandardMaterial color="#5C3A1E" />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* Popcorn bucket */}
      <group position={[5, 0.5, 1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.5, 8]} />
          <meshStandardMaterial color="#FF4444" />
        </mesh>
        {/* Popcorn kernels */}
        {[0, 0.8, 1.6, 2.4, 3.2, 4].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.12, 0.3, Math.sin(a) * 0.12]}>
            <sphereGeometry args={[0.06, 4, 4]} />
            <meshStandardMaterial color="#FFFACD" />
          </mesh>
        ))}
      </group>

      {/* Trigger: Center seat */}
      <TriggerObject position={[0.5, 1.2, 0]} puzzleId="sorting" label={t.zoneLabels.triggerLabels[3]}>
        <mesh>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.4} transparent opacity={0.5} />
        </mesh>
      </TriggerObject>

      {/* Dim theater lighting */}
      <pointLight position={[0, 5, -3]} intensity={0.2} color="#FFE4B5" distance={12} />
      <pointLight position={[0, 3, -5]} intensity={0.15} color="#4466AA" distance={8} />
    </group>
  );
}

// Zone 5: Prize gazebo
function Zone5Gazebo() {
  const gazeboRadius = 4;
  const pillarCount = 8;
  const gameWon = useGameStore((s) => s.gameWon);

  const pillars = useMemo(() => {
    const p: [number, number, number][] = [];
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      p.push([Math.cos(angle) * gazeboRadius, 0, Math.sin(angle) * gazeboRadius]);
    }
    return p;
  }, []);

  return (
    <group position={[0, 0, -150]}>
      {/* Gazebo floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <circleGeometry args={[gazeboRadius + 0.5, 16]} />
        <meshStandardMaterial color="#F5E6D3" />
      </mesh>

      {/* Pillars */}
      {pillars.map((pos, i) => (
        <group key={i}>
          <mesh position={[pos[0], 2, pos[2]]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 4, 6]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.3} />
          </mesh>
          {/* Fairy light on pillar */}
          <mesh position={[pos[0], 3.5, pos[2]]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} />
          </mesh>
          <pointLight position={[pos[0], 3.5, pos[2]]} intensity={0.15} color="#FFD700" distance={4} />
        </group>
      ))}

      {/* Roof */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[gazeboRadius + 0.8, 2, 8]} />
        <meshStandardMaterial color="#E8A0BF" flatShading />
      </mesh>

      {/* String lights across gazebo */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = gazeboRadius * 0.6;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 3.8, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#FF6B8A' : i % 3 === 1 ? '#FFD700' : '#FFB3C6'}
              emissive={i % 3 === 0 ? '#FF6B8A' : i % 3 === 1 ? '#FFD700' : '#FFB3C6'}
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}

      {/* Center candles */}
      {[[0, 0, 0], [0.5, 0, 0.3], [-0.3, 0, 0.4]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
            <meshStandardMaterial color="#FFF8DC" />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#FFAA00" emissive="#FF8800" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0, 0.6, 0]} intensity={0.2} color="#FFAA00" distance={3} />
        </group>
      ))}

      {gameWon && (
        <Sparkles count={80} scale={[8, 6, 8]} position={[0, 3, 0]} size={4} speed={0.5} color="#FFD700" />
      )}

      <pointLight position={[0, 4, 0]} intensity={0.6} color="#FFE4B5" distance={10} />
    </group>
  );
}

export default function Zones() {
  const zonesCompleted = useGameStore((s) => s.zonesCompleted);

  const gatePositions: [number, number, number][] = [
    [Math.sin(-15 * 0.05) * 1.5, 0, -15],
    [Math.sin(-45 * 0.05) * 1.5, 0, -45],
    [Math.sin(-75 * 0.05) * 1.5, 0, -75],
    [Math.sin(-105 * 0.05) * 1.5, 0, -105],
    [Math.sin(-135 * 0.05) * 1.5, 0, -135],
  ];

  return (
    <group>
      <Zone0Start />
      <Zone1University />
      <Zone2ParkingLot />
      <Zone3Apartment />
      <Zone4Theater />
      <Zone5Gazebo />

      {/* Heart gates between zones */}
      {gatePositions.map((pos, i) => {
        // Gate i is between zone i and zone i+1
        // Gate is unlocked if zone i+1's puzzle is completed (zonesCompleted[i])
        // Gate 0 between zone 0 and zone 1: unlocked when zonesCompleted[0] (zone 1 done)
        // But gate 0 should be open by default so player can reach zone 1
        const isLocked = i === 0 ? false : !zonesCompleted[i - 1];
        return (
          <HeartGate
            key={i}
            position={pos}
            isLocked={isLocked}
            zoneIndex={i + 1}
          />
        );
      })}
    </group>
  );
}
