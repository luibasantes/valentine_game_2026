import { useEffect, useRef, useState } from 'react';
import { mobileInput } from '../../utils/mobileInput';
import { useGameStore } from '../../store/gameStore';

const JOYSTICK_SIZE = 130;
const KNOB_SIZE = 54;
const JOYSTICK_RADIUS = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);
  const baseCenter = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (e.pointerId !== activeTouch.current) return;
      e.preventDefault();

      let dx = e.clientX - baseCenter.current.x;
      let dy = e.clientY - baseCenter.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > JOYSTICK_RADIUS) {
        dx = (dx / dist) * JOYSTICK_RADIUS;
        dy = (dy / dist) * JOYSTICK_RADIUS;
      }

      mobileInput.moveX = dx / JOYSTICK_RADIUS;
      mobileInput.moveY = -dy / JOYSTICK_RADIUS;

      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    };

    const handleEnd = (e: PointerEvent) => {
      if (e.pointerId !== activeTouch.current) return;
      activeTouch.current = null;
      mobileInput.moveX = 0;
      mobileInput.moveY = 0;
      if (knobRef.current) {
        knobRef.current.style.transform = 'translate(0, 0)';
      }
    };

    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('pointercancel', handleEnd);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('pointercancel', handleEnd);
    };
  }, []);

  const handleStart = (e: React.PointerEvent) => {
    if (activeTouch.current !== null) return;
    activeTouch.current = e.pointerId;
    const rect = baseRef.current!.getBoundingClientRect();
    baseCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handleStart}
      style={{
        position: 'fixed',
        bottom: 28,
        left: 24,
        width: JOYSTICK_SIZE,
        height: JOYSTICK_SIZE,
        borderRadius: '50%',
        background: 'rgba(255, 107, 157, 0.12)',
        border: '2px solid rgba(255, 107, 157, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 600,
        touchAction: 'none',
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: '50%',
          background: 'rgba(255, 107, 157, 0.45)',
          border: '2px solid rgba(255, 107, 157, 0.55)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function CameraTouch() {
  const activeTouch = useRef<number | null>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (e.pointerId !== activeTouch.current) return;
      e.preventDefault();

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      mobileInput.cameraDX += dx;
      mobileInput.cameraDY += dy;
    };

    const handleEnd = (e: PointerEvent) => {
      if (e.pointerId !== activeTouch.current) return;
      activeTouch.current = null;
    };

    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('pointercancel', handleEnd);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('pointercancel', handleEnd);
    };
  }, []);

  const handleStart = (e: React.PointerEvent) => {
    if (activeTouch.current !== null) return;
    activeTouch.current = e.pointerId;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      onPointerDown={handleStart}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        zIndex: 590,
        touchAction: 'none',
      }}
    />
  );
}

function ActionButtons() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        zIndex: 600,
      }}
    >
      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          mobileInput.interact = true;
        }}
        style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'rgba(255, 77, 109, 0.35)',
          border: '2px solid rgba(255, 77, 109, 0.5)',
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          cursor: 'pointer',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        E
      </button>

      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          mobileInput.jump = true;
        }}
        style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'rgba(255, 143, 171, 0.35)',
          border: '2px solid rgba(255, 143, 171, 0.5)',
          color: '#fff',
          fontSize: 22,
          cursor: 'pointer',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ^
      </button>
    </div>
  );
}

export default function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);
  const gameStarted = useGameStore((s) => s.gameStarted);
  const activePuzzle = useGameStore((s) => s.activePuzzle);
  const showFail = useGameStore((s) => s.showFail);
  const gameWon = useGameStore((s) => s.gameWon);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    document.body.style.touchAction = 'none';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.touchAction = '';
      document.body.style.overflow = '';
    };
  }, [isMobile]);

  if (!isMobile || !gameStarted || activePuzzle || showFail || gameWon) return null;

  return (
    <>
      <Joystick />
      <CameraTouch />
      <ActionButtons />
    </>
  );
}
