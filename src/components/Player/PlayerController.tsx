import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';
import { useGameStore } from '../../store/gameStore.ts';
import { useT } from '../../store/langStore.ts';
import { mobileInput } from '../../utils/mobileInput.ts';

const MOVE_SPEED = 8;
const MOUSE_SENSITIVITY = 0.003;
const CAMERA_DISTANCE = 10;
const CAMERA_HEIGHT = 6;
const CAMERA_LERP = 0.08;
const MIN_POLAR = 0.3;
const MAX_POLAR = 1.2;
const JUMP_FORCE = 8;
const GRAVITY = -20;
const GROUND_Y = 0.6;

const WORLD_BOUNDS = { minX: -18, maxX: 18, minZ: -158, maxZ: 8 };

interface TriggerZone {
  position: THREE.Vector3;
  radius: number;
  puzzleId: string;
  zoneIndex: number;
  labelIndex: number;
}

const TRIGGER_ZONES: TriggerZone[] = [
  { position: new THREE.Vector3(0, 0, -30), radius: 4, puzzleId: 'trivia', zoneIndex: 1, labelIndex: 0 },
  { position: new THREE.Vector3(0, 0, -57), radius: 4, puzzleId: 'driving', zoneIndex: 2, labelIndex: 1 },
  { position: new THREE.Vector3(3, 0, -88), radius: 4, puzzleId: 'memory', zoneIndex: 3, labelIndex: 2 },
  { position: new THREE.Vector3(0.5, 0, -120), radius: 4, puzzleId: 'sorting', zoneIndex: 4, labelIndex: 3 },
];

interface GateBarrier {
  z: number;
  zoneRequired: number;
}

const GATE_BARRIERS: GateBarrier[] = [
  { z: -45, zoneRequired: 0 },
  { z: -75, zoneRequired: 1 },
  { z: -105, zoneRequired: 2 },
  { z: -135, zoneRequired: 3 },
];

export default function PlayerController() {
  const playerRef = useRef<Group>(null);
  const { camera } = useThree();
  const t = useT();

  const playerPos = useRef(new THREE.Vector3(0, 0.6, 4));
  const velocityY = useRef(0);
  const cameraAngle = useRef({ azimuth: 0, polar: 0.6 });
  const keysPressed = useRef<Set<string>>(new Set());
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const [nearTrigger, setNearTrigger] = useState<TriggerZone | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const activePuzzle = useGameStore((s) => s.activePuzzle);
  const zonesCompleted = useGameStore((s) => s.zonesCompleted);
  const setActivePuzzle = useGameStore((s) => s.setActivePuzzle);
  const setZone = useGameStore((s) => s.setZone);
  const gameStarted = useGameStore((s) => s.gameStarted);
  const showFail = useGameStore((s) => s.showFail);

  const getMaxZ = useCallback(() => {
    let maxNegZ = WORLD_BOUNDS.minZ;
    for (const barrier of GATE_BARRIERS) {
      if (!zonesCompleted[barrier.zoneRequired]) {
        maxNegZ = Math.max(maxNegZ, barrier.z + 2);
        break;
      }
    }
    return maxNegZ;
  }, [zonesCompleted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);

      if (e.code === 'KeyE' && nearTrigger && !activePuzzle) {
        const zoneIdx = nearTrigger.zoneIndex;
        const canActivate = zoneIdx === 1 || zonesCompleted[zoneIdx - 2];
        if (canActivate && !zonesCompleted[zoneIdx - 1]) {
          setActivePuzzle(nearTrigger.puzzleId);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearTrigger, activePuzzle, zonesCompleted, setActivePuzzle]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };

      cameraAngle.current.azimuth -= dx * MOUSE_SENSITIVITY;
      cameraAngle.current.polar = THREE.MathUtils.clamp(
        cameraAngle.current.polar + dy * MOUSE_SENSITIVITY,
        MIN_POLAR,
        MAX_POLAR
      );
    };
    const handleContextMenu = (e: Event) => e.preventDefault();

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('contextmenu', handleContextMenu);
    }
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('contextmenu', handleContextMenu);
      }
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const currentZone = useGameStore((s) => s.currentZone);
  useEffect(() => {
    if (currentZone === 0 && !showFail) {
      playerPos.current.set(0, 0.6, 4);
    }
  }, [currentZone, showFail]);

  useFrame((_, delta) => {
    if (!gameStarted || activePuzzle || showFail) return;
    if (!playerRef.current) return;

    const dt = Math.min(delta, 0.05);
    const keys = keysPressed.current;

    const forward = new THREE.Vector3(
      -Math.sin(cameraAngle.current.azimuth),
      0,
      -Math.cos(cameraAngle.current.azimuth)
    );
    const right = new THREE.Vector3(-forward.z, 0, forward.x);

    if (mobileInput.cameraDX !== 0 || mobileInput.cameraDY !== 0) {
      cameraAngle.current.azimuth -= mobileInput.cameraDX * MOUSE_SENSITIVITY;
      cameraAngle.current.polar = THREE.MathUtils.clamp(
        cameraAngle.current.polar + mobileInput.cameraDY * MOUSE_SENSITIVITY,
        MIN_POLAR,
        MAX_POLAR
      );
      mobileInput.cameraDX = 0;
      mobileInput.cameraDY = 0;
    }

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keys.has('KeyW') || keys.has('ArrowUp')) moveDir.add(forward);
    if (keys.has('KeyS') || keys.has('ArrowDown')) moveDir.sub(forward);
    if (keys.has('KeyA') || keys.has('ArrowLeft')) moveDir.sub(right);
    if (keys.has('KeyD') || keys.has('ArrowRight')) moveDir.add(right);

    if (Math.abs(mobileInput.moveX) > 0.05 || Math.abs(mobileInput.moveY) > 0.05) {
      moveDir.add(right.clone().multiplyScalar(mobileInput.moveX));
      moveDir.add(forward.clone().multiplyScalar(mobileInput.moveY));
    }

    if ((keys.has('Space') || mobileInput.jump) && playerPos.current.y <= GROUND_Y) {
      velocityY.current = JUMP_FORCE;
      mobileInput.jump = false;
    }

    velocityY.current += GRAVITY * dt;
    playerPos.current.y += velocityY.current * dt;
    if (playerPos.current.y <= GROUND_Y) {
      playerPos.current.y = GROUND_Y;
      velocityY.current = 0;
    }

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize().multiplyScalar(MOVE_SPEED * dt);
      playerPos.current.add(moveDir);

      const minZ = getMaxZ();
      playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, minZ, WORLD_BOUNDS.maxZ);

      const pathCenter = Math.sin(playerPos.current.z * 0.05) * 1.5;
      const PATH_HALF_WIDTH = 2.0;
      playerPos.current.x = THREE.MathUtils.clamp(
        playerPos.current.x,
        pathCenter - PATH_HALF_WIDTH,
        pathCenter + PATH_HALF_WIDTH
      );

      const angle = Math.atan2(moveDir.x, moveDir.z);
      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y,
        angle,
        0.15
      );
    }

    playerRef.current.position.copy(playerPos.current);

    const camOffset = new THREE.Vector3(
      Math.sin(cameraAngle.current.azimuth) * Math.cos(cameraAngle.current.polar) * CAMERA_DISTANCE,
      Math.sin(cameraAngle.current.polar) * CAMERA_HEIGHT,
      Math.cos(cameraAngle.current.azimuth) * Math.cos(cameraAngle.current.polar) * CAMERA_DISTANCE
    );
    const targetCamPos = playerPos.current.clone().add(camOffset);
    camera.position.lerp(targetCamPos, CAMERA_LERP);
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1, playerPos.current.z);

    const z = playerPos.current.z;
    let zone: 0 | 1 | 2 | 3 | 4 | 5 = 0;
    if (z < -135) zone = 5;
    else if (z < -105) zone = 4;
    else if (z < -75) zone = 3;
    else if (z < -45) zone = 2;
    else if (z < -15) zone = 1;
    setZone(zone);

    let closestTrigger: TriggerZone | null = null;
    let closestDist = Infinity;
    for (const trigger of TRIGGER_ZONES) {
      const dist = playerPos.current.distanceTo(trigger.position);
      if (dist < trigger.radius && dist < closestDist) {
        closestDist = dist;
        closestTrigger = trigger;
      }
    }
    setNearTrigger(closestTrigger);
    setShowPrompt(closestTrigger !== null && !activePuzzle);

    if (mobileInput.interact && closestTrigger && !activePuzzle) {
      mobileInput.interact = false;
      const zoneIdx = closestTrigger.zoneIndex;
      const canActivate = zoneIdx === 1 || zonesCompleted[zoneIdx - 2];
      if (canActivate && !zonesCompleted[zoneIdx - 1]) {
        setActivePuzzle(closestTrigger.puzzleId);
      }
    } else if (mobileInput.interact) {
      mobileInput.interact = false;
    }
  });

  if (!gameStarted) return null;

  return (
    <group>
      <group ref={playerRef} position={[0, 0.6, 4]}>
        {/* Head */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#FDDCBD" />
        </mesh>

        {/* Hair back volume */}
        <mesh position={[0, 0.48, -0.06]} castShadow>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#5C3317" />
        </mesh>
        {/* Hair bangs */}
        <mesh position={[0, 0.56, 0.1]}>
          <boxGeometry args={[0.38, 0.1, 0.14]} />
          <meshStandardMaterial color="#5C3317" />
        </mesh>
        {/* Pigtail left */}
        <mesh position={[-0.25, 0.42, -0.04]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#5C3317" />
        </mesh>
        <mesh position={[-0.25, 0.3, -0.04]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#5C3317" />
        </mesh>
        {/* Pigtail right */}
        <mesh position={[0.25, 0.42, -0.04]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#5C3317" />
        </mesh>
        <mesh position={[0.25, 0.3, -0.04]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#5C3317" />
        </mesh>
        {/* Hair ribbons */}
        <mesh position={[-0.25, 0.52, -0.04]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#FF4D6D" />
        </mesh>
        <mesh position={[0.25, 0.52, -0.04]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#FF4D6D" />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.08, 0.44, 0.19]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#2C1810" />
        </mesh>
        <mesh position={[-0.08, 0.44, 0.19]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#2C1810" />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[0.07, 0.455, 0.22]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.07, 0.455, 0.22]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>

        {/* Blush cheeks */}
        <mesh position={[0.14, 0.39, 0.15]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#FF9EAF" transparent opacity={0.5} />
        </mesh>
        <mesh position={[-0.14, 0.39, 0.15]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#FF9EAF" transparent opacity={0.5} />
        </mesh>

        {/* Smile */}
        <mesh position={[0, 0.37, 0.2]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.04, 0.008, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#D4736A" />
        </mesh>

        {/* Body / dress top */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 0.3, 10]} />
          <meshStandardMaterial color="#FF8FAB" />
        </mesh>
        {/* Dress skirt */}
        <mesh position={[0, -0.08, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.25, 0.22, 10]} />
          <meshStandardMaterial color="#FF6B9D" />
        </mesh>
        {/* Dress collar */}
        <mesh position={[0, 0.26, 0.04]}>
          <boxGeometry args={[0.14, 0.04, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>

        {/* Arms */}
        <mesh position={[0.2, 0.12, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.035, 0.2, 4, 6]} />
          <meshStandardMaterial color="#FDDCBD" />
        </mesh>
        <mesh position={[-0.2, 0.12, 0]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.035, 0.2, 4, 6]} />
          <meshStandardMaterial color="#FDDCBD" />
        </mesh>

        {/* Legs */}
        <mesh position={[0.08, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.16, 4, 6]} />
          <meshStandardMaterial color="#FDDCBD" />
        </mesh>
        <mesh position={[-0.08, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.16, 4, 6]} />
          <meshStandardMaterial color="#FDDCBD" />
        </mesh>

        {/* Shoes */}
        <mesh position={[0.08, -0.44, 0.02]}>
          <boxGeometry args={[0.09, 0.06, 0.12]} />
          <meshStandardMaterial color="#FF4D6D" />
        </mesh>
        <mesh position={[-0.08, -0.44, 0.02]}>
          <boxGeometry args={[0.09, 0.06, 0.12]} />
          <meshStandardMaterial color="#FF4D6D" />
        </mesh>
      </group>

      {showPrompt && nearTrigger && (
        <Billboard
          position={[
            playerPos.current.x,
            playerPos.current.y + 2,
            playerPos.current.z,
          ]}
        >
          <Text
            fontSize={0.35}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.06}
            outlineColor="#000000"
          >
            {(() => {
              const zoneIdx = nearTrigger.zoneIndex;
              const canActivate = zoneIdx === 1 || zonesCompleted[zoneIdx - 2];
              if (zonesCompleted[zoneIdx - 1]) return t.player.completed;
              if (!canActivate) return t.player.completePrevious;
              return t.player.triggerLabels[nearTrigger.labelIndex];
            })()}
          </Text>
        </Billboard>
      )}
    </group>
  );
}
