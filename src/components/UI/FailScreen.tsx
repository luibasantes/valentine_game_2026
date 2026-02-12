import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useT } from '../../store/langStore';

export default function FailScreen() {
  const { showFail, failMessage, dismissFail } = useGameStore();
  const t = useT();
  const [visible, setVisible] = useState(false);
  const [heartsArr] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 20,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 4,
      opacity: 0.08 + Math.random() * 0.15,
    }))
  );

  useEffect(() => {
    if (showFail) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [showFail]);

  if (!showFail) return null;

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => dismissFail(), 500);
  };

  return (
    <>
      <style>{`
        @keyframes driftUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20vh) rotate(25deg); opacity: 0; }
        }
        @keyframes fadeInContent {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(30, 10, 25, 0.92)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s ease',
          overflow: 'hidden',
        }}
      >
        {heartsArr.map((h) => (
          <span
            key={h.id}
            style={{
              position: 'absolute',
              left: `${h.left}%`,
              bottom: '-30px',
              fontSize: `${h.size}px`,
              opacity: h.opacity,
              animation: `driftUp ${h.duration}s linear infinite`,
              animationDelay: `${h.delay}s`,
              pointerEvents: 'none',
            }}
          >
            💗
          </span>
        ))}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            animation: visible ? 'fadeInContent 0.8s ease 0.3s both' : 'none',
          }}
        >
          <span style={{ fontSize: '56px' }}>💔</span>

          <p
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
              color: '#f8a5c2',
              textAlign: 'center',
              maxWidth: '500px',
              lineHeight: 1.6,
              textShadow: '0 0 20px rgba(255,107,157,0.3)',
              padding: '0 20px',
            }}
          >
            {failMessage || t.fail.defaultMessage}
          </p>

          <button
            onClick={handleDismiss}
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
              border: 'none',
              borderRadius: '40px',
              padding: '14px 48px',
              cursor: 'pointer',
              marginTop: '12px',
              boxShadow: '0 0 25px rgba(255,107,157,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(255,107,157,0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(255,107,157,0.35)';
            }}
          >
            {t.fail.button}
          </button>
        </div>
      </div>
    </>
  );
}
