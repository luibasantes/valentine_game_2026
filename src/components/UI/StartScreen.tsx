import { useState, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useT } from '../../store/langStore';

const PIN = '1011';

const floatingHeart = (i: number) => ({
  position: 'absolute' as const,
  fontSize: `${14 + Math.random() * 18}px`,
  opacity: 0.5 + Math.random() * 0.3,
  left: `${10 + i * 18}%`,
  animation: `floatHeart ${3 + Math.random() * 3}s ease-in-out infinite`,
  animationDelay: `${i * 0.6}s`,
});

export default function StartScreen() {
  const { gameStarted, startGame } = useGameStore();
  const t = useT();
  const [leaving, setLeaving] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (gameStarted) return null;

  const handleStart = () => {
    setShowPin(true);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every((d) => d !== '')) {
      const entered = newPin.join('');
      if (entered === PIN) {
        setLeaving(true);
        setTimeout(() => startGame(), 600);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin(['', '', '', '']);
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <style>{`
        @keyframes floatHeart {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-18px) rotate(5deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
          75% { transform: translateY(-22px) rotate(4deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,107,157,0.4), 0 0 60px rgba(255,107,157,0.15); }
          50% { box-shadow: 0 0 35px rgba(255,107,157,0.7), 0 0 90px rgba(255,107,157,0.3); }
        }
        @keyframes fadeOutScreen {
          to { opacity: 0; }
        }
        @keyframes shakePin {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-12px); }
          40% { transform: translateX(12px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        @keyframes pinFadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
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
          background: 'linear-gradient(135deg, #2d1f3d 0%, #4a1942 40%, #ff6b9d 100%)',
          animation: leaving ? 'fadeOutScreen 0.6s ease forwards' : 'none',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '60px', marginBottom: '20px' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={floatingHeart(i)}>
              {['💕', '💗', '💖', '💝', '💘'][i]}
            </span>
          ))}
        </div>

        <h1
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 0 40px rgba(255,107,157,0.6), 0 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'center',
            margin: '0 20px 12px',
            animation: 'slideDown 1s ease-out',
          }}
        >
          {t.start.title}
        </h1>

        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: '#f8a5c2',
            marginBottom: '50px',
            animation: 'fadeInUp 1.2s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ animation: 'floatHeart 2s ease-in-out infinite' }}>💕</span>
          {t.start.subtitle}
          <span style={{ animation: 'floatHeart 2s ease-in-out infinite 0.5s' }}>💕</span>
        </p>

        {!showPin ? (
          <button
            onClick={handleStart}
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(1.3rem, 3vw, 2rem)',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
              border: 'none',
              borderRadius: '50px',
              padding: '16px 64px',
              cursor: 'pointer',
              animation: 'fadeInUp 1.5s ease-out, pulseGlow 2.5s ease-in-out infinite',
              transition: 'transform 0.2s ease, filter 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.filter = 'brightness(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            {t.start.button}
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              animation: 'pinFadeIn 0.4s ease-out',
            }}
          >
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.3rem',
                color: '#f8a5c2',
              }}
            >
              {t.start.pinPrompt}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '14px',
                animation: shake ? 'shakePin 0.4s ease' : 'none',
              }}
            >
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  style={{
                    width: 56,
                    height: 68,
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontFamily: "'Dancing Script', cursive",
                    fontWeight: 700,
                    color: '#fff',
                    background: 'rgba(255,255,255,0.08)',
                    border: `2px solid ${digit ? '#ff6b9d' : 'rgba(255,255,255,0.2)'}`,
                    borderRadius: 16,
                    outline: 'none',
                    caretColor: '#ff6b9d',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: digit ? '0 0 16px rgba(255,107,157,0.3)' : 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#ff6b9d';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255,107,157,0.4)';
                  }}
                  onBlur={(e) => {
                    if (!digit) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                />
              ))}
            </div>
            {shake && (
              <p style={{ color: '#e74c3c', fontSize: '0.9rem', fontFamily: "'Dancing Script', cursive" }}>
                {t.start.pinError}
              </p>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: '24px',
            animation: 'fadeInUp 1.8s ease-out',
            display: 'flex',
            gap: '8px',
            opacity: 0.5,
          }}
        >
          {t.startZoneNames.map((_, i) => (
            <span key={i} style={{ fontSize: '14px' }}>🤍</span>
          ))}
        </div>

        <p
          style={{
            position: 'absolute',
            bottom: '24px',
            fontFamily: "'Dancing Script', cursive",
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.45)',
            animation: 'fadeInUp 2.2s ease-out',
          }}
        >
          {t.start.footer}
        </p>
      </div>
    </>
  );
}
