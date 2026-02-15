import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useT } from '../../store/langStore';

const COLORS = {
  pink: '#ff6b9d',
  darkPink: '#c44569',
  lightPink: '#f8a5c2',
  white: '#fff',
  darkBg: '#2d1f3d',
};

const LOT_W = 600;
const LOT_H = 500;
const CAR_W = 32;
const CAR_H = 52;
const SPEED = 3;

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'car' | 'cone';
  color?: string;
}

const OBSTACLES: Obstacle[] = [
  { x: 70, y: 30, w: 42, h: 72, type: 'car', color: '#7888a0' },
  { x: 170, y: 30, w: 42, h: 72, type: 'car', color: '#6a9b78' },
  { x: 270, y: 30, w: 42, h: 72, type: 'car', color: '#a07888' },
  { x: 370, y: 30, w: 42, h: 72, type: 'car', color: '#8888a0' },
  { x: 470, y: 30, w: 42, h: 72, type: 'car', color: '#88a078' },
  { x: 70, y: 390, w: 42, h: 72, type: 'car', color: '#a09070' },
  { x: 170, y: 390, w: 42, h: 72, type: 'car', color: '#7090a0' },
  { x: 470, y: 390, w: 42, h: 72, type: 'car', color: '#9078a0' },
  { x: 130, y: 190, w: 42, h: 72, type: 'car', color: '#7a7090' },
  { x: 350, y: 170, w: 42, h: 72, type: 'car', color: '#708a7a' },
  { x: 250, y: 280, w: 42, h: 72, type: 'car', color: '#8a7078' },
  { x: 90, y: 150, w: 16, h: 16, type: 'cone' },
  { x: 210, y: 140, w: 16, h: 16, type: 'cone' },
  { x: 300, y: 180, w: 16, h: 16, type: 'cone' },
  { x: 440, y: 160, w: 16, h: 16, type: 'cone' },
  { x: 190, y: 260, w: 16, h: 16, type: 'cone' },
  { x: 400, y: 280, w: 16, h: 16, type: 'cone' },
  { x: 330, y: 330, w: 16, h: 16, type: 'cone' },
  { x: 480, y: 250, w: 16, h: 16, type: 'cone' },
  { x: 50, y: 300, w: 16, h: 16, type: 'cone' },
  { x: 150, y: 340, w: 16, h: 16, type: 'cone' },
];

const TARGET = { x: 268, y: 392, w: 48, h: 76 };

function aabb(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export default function DrivingPuzzle() {
  const { completeZone, triggerFail } = useGameStore();
  const t = useT();
  const [fadingIn, setFadingIn] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobile] = useState(isTouchDevice);

  const carRef = useRef({ x: 540, y: 130, dir: 'down' as string });
  const keysRef = useRef<Set<string>>(new Set());
  const frameRef = useRef<number>(0);
  const carElRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setFadingIn(false), 50);
    return () => clearTimeout(t);
  }, []);

  const checkCollisions = useCallback((x: number, y: number) => {
    for (const obs of OBSTACLES) {
      if (aabb(x, y, CAR_W, CAR_H, obs.x, obs.y, obs.w, obs.h)) {
        return true;
      }
    }
    return x < 0 || y < 0 || x + CAR_W > LOT_W || y + CAR_H > LOT_H;
  }, []);

  const checkTarget = useCallback((x: number, y: number) => {
    const cx = x + CAR_W / 2;
    const cy = y + CAR_H / 2;
    const tx = TARGET.x + TARGET.w / 2;
    const ty = TARGET.y + TARGET.h / 2;
    return Math.abs(cx - tx) < 16 && Math.abs(cy - ty) < 20;
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        keysRef.current.add(key);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onDown, true);
    window.addEventListener('keyup', onUp, true);
    return () => {
      window.removeEventListener('keydown', onDown, true);
      window.removeEventListener('keyup', onUp, true);
    };
  }, []);

  useEffect(() => {
    const loop = () => {
      if (doneRef.current) return;
      const keys = keysRef.current;
      const car = carRef.current;

      let dx = 0;
      let dy = 0;

      if (keys.has('w') || keys.has('arrowup')) { dy = -SPEED; car.dir = 'up'; }
      if (keys.has('s') || keys.has('arrowdown')) { dy = SPEED; car.dir = 'down'; }
      if (keys.has('a') || keys.has('arrowleft')) { dx = -SPEED; car.dir = 'left'; }
      if (keys.has('d') || keys.has('arrowright')) { dx = SPEED; car.dir = 'right'; }

      if (dx !== 0 && dy !== 0) {
        const diag = SPEED / Math.SQRT2;
        dx = dx > 0 ? diag : -diag;
        dy = dy > 0 ? diag : -diag;
      }

      if (dx === 0 && dy === 0) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const newX = car.x + dx;
      const newY = car.y + dy;

      if (checkCollisions(newX, newY)) {
        doneRef.current = true;
        triggerFail(t.driving.failMessage);
        return;
      }

      car.x = newX;
      car.y = newY;

      if (checkTarget(newX, newY)) {
        doneRef.current = true;
        setShowSuccess(true);
        setTimeout(() => completeZone(2), 2000);
        return;
      }

      if (carElRef.current) {
        carElRef.current.style.left = `${car.x}px`;
        carElRef.current.style.top = `${car.y}px`;

        let rotation = 0;
        if (car.dir === 'up') rotation = 0;
        else if (car.dir === 'down') rotation = 180;
        else if (car.dir === 'left') rotation = -90;
        else if (car.dir === 'right') rotation = 90;
        carElRef.current.style.transform = `rotate(${rotation}deg)`;
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [checkCollisions, checkTarget, completeZone, triggerFail, t.driving.failMessage]);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(45, 31, 61, 0.94)',
    opacity: fadingIn ? 0 : 1,
    transition: 'opacity 0.5s ease',
    fontFamily: "'Georgia', serif",
  };

  if (showSuccess) {
    return (
      <div style={overlayStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🚗💕</div>
          <h2 style={{ color: COLORS.pink, fontSize: 28 }}>
            {t.driving.successMessage}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes coneWobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes targetPulse {
          0%, 100% { box-shadow: 0 0 12px #2ecc7166, inset 0 0 12px #2ecc7133; }
          50% { box-shadow: 0 0 28px #2ecc71aa, inset 0 0 20px #2ecc7155; }
        }
      `}</style>

      <h2 style={{ color: COLORS.pink, marginBottom: 8, fontSize: 22 }}>
        {t.driving.title}
      </h2>
      <p style={{ color: COLORS.lightPink, marginBottom: 20, fontSize: 14 }}>
        {t.driving.subtitle}
      </p>

      <div
        style={{
          position: 'relative',
          width: LOT_W,
          height: LOT_H,
          background: '#3a3a4a',
          borderRadius: 12,
          border: `2px solid ${COLORS.pink}55`,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`lt-${i}`}
            style={{
              position: 'absolute',
              left: 50 + i * 120,
              top: 0,
              width: 2,
              height: 115,
              background: '#666',
            }}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`lb-${i}`}
            style={{
              position: 'absolute',
              left: 50 + i * 120,
              bottom: 0,
              width: 2,
              height: 115,
              background: '#666',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: LOT_H / 2 - 1,
            right: 20,
            height: 2,
            borderTop: '2px dashed #55555577',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: TARGET.x,
            top: TARGET.y,
            width: TARGET.w,
            height: TARGET.h,
            background: 'rgba(46, 204, 113, 0.25)',
            border: '3px solid #2ecc71',
            borderRadius: 6,
            animation: 'targetPulse 1.5s ease-in-out infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#2ecc71',
            textShadow: '0 0 8px #2ecc71aa',
            fontFamily: 'sans-serif',
          }}>P</span>
        </div>

        {OBSTACLES.map((obs, i) => {
          if (obs.type === 'cone') {
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: obs.x,
                  top: obs.y,
                  width: obs.w,
                  height: obs.h,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'coneWobble 2s ease-in-out infinite',
                }}
              >
                🔶
              </div>
            );
          }
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: obs.x,
                top: obs.y,
                width: obs.w,
                height: obs.h,
                background: `linear-gradient(180deg, ${obs.color || '#888'}, ${obs.color ? obs.color + '99' : '#666'})`,
                borderRadius: 6,
                border: '1px solid #55555588',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  left: 4,
                  right: 4,
                  height: 12,
                  background: '#aaddee44',
                  borderRadius: 3,
                }}
              />
            </div>
          );
        })}

        <div
          ref={carElRef}
          style={{
            position: 'absolute',
            left: carRef.current.x,
            top: carRef.current.y,
            width: CAR_W,
            height: CAR_H,
            transformOrigin: 'center center',
            transform: 'rotate(0deg)',
            transition: 'transform 0.1s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(180deg, ${COLORS.pink}, ${COLORS.darkPink})`,
              borderRadius: 8,
              border: `2px solid ${COLORS.lightPink}`,
              boxShadow: `0 4px 12px ${COLORS.pink}55`,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 4,
                right: 4,
                height: 12,
                background: '#aaddff',
                borderRadius: 4,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 12,
                lineHeight: 1,
              }}
            >
              🎀
            </div>
          </div>
        </div>
      </div>

      {isMobile ? (
        <DPad keysRef={keysRef} />
      ) : (
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            gap: 12,
            color: '#999',
            fontSize: 13,
          }}
        >
          <span><b>W</b> {t.driving.up}</span>
          <span><b>A</b> {t.driving.left}</span>
          <span><b>S</b> {t.driving.down}</span>
          <span><b>D</b> {t.driving.right}</span>
        </div>
      )}
    </div>
  );
}

const DPAD_BTN: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 10,
  border: '2px solid rgba(255,107,157,0.4)',
  background: 'rgba(255,107,157,0.2)',
  color: '#fff',
  fontSize: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  touchAction: 'none',
  userSelect: 'none',
  cursor: 'pointer',
};

function DPad({ keysRef }: { keysRef: React.RefObject<Set<string>> }) {
  const press = (key: string) => keysRef.current?.add(key);
  const release = (key: string) => keysRef.current?.delete(key);

  const bind = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      press(key);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.stopPropagation();
      release(key);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      e.stopPropagation();
      release(key);
    },
    onPointerCancel: () => release(key),
  });

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button style={DPAD_BTN} {...bind('w')}>&#9650;</button>
      <div style={{ display: 'flex', gap: 6 }}>
        <button style={DPAD_BTN} {...bind('a')}>&#9664;</button>
        <button style={DPAD_BTN} {...bind('s')}>&#9660;</button>
        <button style={DPAD_BTN} {...bind('d')}>&#9654;</button>
      </div>
    </div>
  );
}
