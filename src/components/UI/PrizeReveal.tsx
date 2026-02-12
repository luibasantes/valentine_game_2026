import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { triggerConfetti } from '../Effects/Confetti';

type Phase = 'hidden' | 'glow' | 'heart' | 'confetti' | 'text' | 'cards' | 'done';

const TIMINGS = {
  glow: 0,
  heart: 1200,
  confetti: 2800,
  text: 3600,
  cards: 5600,
  done: 7200,
};

export default function PrizeReveal() {
  const { gameWon } = useGameStore();
  const [phase, setPhase] = useState<Phase>('hidden');

  useEffect(() => {
    if (!gameWon) {
      setPhase('hidden');
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (p: Phase, ms: number) =>
      timers.push(setTimeout(() => setPhase(p), ms));

    schedule('glow', TIMINGS.glow);
    schedule('heart', TIMINGS.heart);
    schedule('confetti', TIMINGS.confetti);
    schedule('text', TIMINGS.text);
    schedule('cards', TIMINGS.cards);
    schedule('done', TIMINGS.done);

    return () => timers.forEach(clearTimeout);
  }, [gameWon]);

  useEffect(() => {
    if (phase === 'confetti') triggerConfetti();
  }, [phase]);

  if (!gameWon || phase === 'hidden') return null;

  const past = (p: Phase) => {
    const order: Phase[] = ['hidden', 'glow', 'heart', 'confetti', 'text', 'cards', 'done'];
    return order.indexOf(phase) >= order.indexOf(p);
  };

  return (
    <>
      <style>{`
        @keyframes goldenFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes heartDescend {
          from { transform: translateY(-120vh) scale(0.3) rotate(-15deg); }
          to { transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes heartOpen {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.4); filter: brightness(2); }
          100% { transform: scale(0.9); filter: brightness(1); opacity: 0.6; }
        }
        @keyframes textReveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardSlideLeft {
          from { opacity: 0; transform: translateX(-100vw) rotate(-10deg); }
          to { opacity: 1; transform: translateX(0) rotate(-2deg); }
        }
        @keyframes cardSlideRight {
          from { opacity: 0; transform: translateX(100vw) rotate(10deg); }
          to { opacity: 1; transform: translateX(0) rotate(2deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(ellipse at center, rgba(255,215,0,0.15) 0%, rgba(45,31,61,0.97) 70%)`,
          animation: 'goldenFade 1.2s ease forwards',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 30%, rgba(255,215,0,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {past('heart') && (
          <div
            style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              animation: past('confetti')
                ? 'heartOpen 0.8s ease forwards'
                : 'heartDescend 1.2s cubic-bezier(0.23,1,0.32,1) forwards, heartPulse 1.5s ease-in-out 1.2s infinite',
              zIndex: 1,
              filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.6))',
            }}
          >
            💛
          </div>
        )}

        {past('text') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              animation: 'textReveal 1s ease forwards',
              zIndex: 2,
              marginTop: past('confetti') ? '-20px' : '0',
            }}
          >
            <h1
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 'clamp(2rem, 6vw, 3.8rem)',
                color: '#ffd700',
                textShadow: '0 0 30px rgba(255,215,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
                textAlign: 'center',
                margin: 0,
              }}
            >
              You Did It, Alix!
            </h1>

            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                color: '#f8a5c2',
                textAlign: 'center',
                maxWidth: '540px',
                lineHeight: 1.8,
                padding: '0 20px',
                textShadow: '0 1px 8px rgba(0,0,0,0.4)',
              }}
            >
              From a mattress on the floor to building our world together,
              <br />
              every moment with you is my favorite adventure.
              <br />
              <br />
              Happy Valentine's Day, mi amor.
              <br />
              <span style={{ color: '#ffd700' }}>— Luigi</span>
            </p>
          </div>
        )}

        {past('cards') && (
          <div
            style={{
              display: 'flex',
              gap: 'clamp(16px, 4vw, 40px)',
              marginTop: '32px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              zIndex: 3,
              padding: '0 16px',
            }}
          >
            <PrizeCard
              emoji="🧖‍♀️"
              title="Full Day SPA"
              subtitle="A complete day of relaxation — you deserve it"
              direction="left"
            />
            <PrizeCard
              emoji="📸"
              title="Photography Session"
              subtitle="A professional photo session — capturing our moments"
              direction="right"
            />
          </div>
        )}

        {past('done') && (
          <p
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '1rem',
              color: 'rgba(255,215,0,0.6)',
              marginTop: '28px',
              animation: 'textReveal 0.8s ease forwards, floatSoft 3s ease-in-out infinite',
              zIndex: 3,
            }}
          >
            Screenshot this!
          </p>
        )}
      </div>
    </>
  );
}

function PrizeCard({
  emoji,
  title,
  subtitle,
  direction,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  direction: 'left' | 'right';
}) {
  return (
    <div
      style={{
        width: 'clamp(200px, 40vw, 280px)',
        background: 'linear-gradient(145deg, rgba(255,215,0,0.12) 0%, rgba(45,31,61,0.9) 100%)',
        border: '2px solid rgba(255,215,0,0.35)',
        borderRadius: '20px',
        padding: '28px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        animation: `${direction === 'left' ? 'cardSlideLeft' : 'cardSlideRight'} 0.8s cubic-bezier(0.23,1,0.32,1) forwards`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(255,215,0,0.1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(110deg, transparent 30%, rgba(255,215,0,0.08) 45%, rgba(255,215,0,0.15) 50%, rgba(255,215,0,0.08) 55%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite',
          pointerEvents: 'none',
          borderRadius: '20px',
        }}
      />

      <span style={{ fontSize: '3rem' }}>{emoji}</span>

      <h3
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: '1.6rem',
          color: '#ffd700',
          textShadow: '0 0 12px rgba(255,215,0,0.4)',
          margin: 0,
          textAlign: 'center',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: '0.9rem',
          color: 'rgba(248,165,194,0.8)',
          textAlign: 'center',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {subtitle}
      </p>

      <div
        style={{
          marginTop: '8px',
          borderTop: '1px dashed rgba(255,215,0,0.25)',
          paddingTop: '10px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: '0.75rem',
            color: 'rgba(255,215,0,0.5)',
            letterSpacing: '1px',
          }}
        >
          VOUCHER
        </span>
      </div>
    </div>
  );
}
