import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { triviaQuestions } from '../../utils/puzzleData';

function shuffleOptions(options: string[], correctIndex: number) {
  const indexed = options.map((opt, i) => ({ opt, isCorrect: i === correctIndex }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    options: indexed.map((o) => o.opt),
    correctIndex: indexed.findIndex((o) => o.isCorrect),
  };
}

const COLORS = {
  pink: '#ff6b9d',
  darkPink: '#c44569',
  lightPink: '#f8a5c2',
  white: '#fff',
  darkBg: '#2d1f3d',
};

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export default function TriviaPuzzle() {
  const { completeZone, triggerFail } = useGameStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [fadingIn, setFadingIn] = useState(true);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const shuffledQuestions = useMemo(
    () =>
      triviaQuestions.map((q) => {
        const { options, correctIndex } = shuffleOptions(q.options, q.correctIndex);
        return { ...q, options, correctIndex };
      }),
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => setFadingIn(false), 50);
    return () => clearTimeout(t);
  }, []);

  const spawnHearts = useCallback(() => {
    const newHearts: FloatingHeart[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 30 + 35,
    }));
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 1200);
  }, []);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);

    const question = shuffledQuestions[currentQ];
    const isCorrect = idx === question.correctIndex;

    setTimeout(() => {
      if (isCorrect) {
        spawnHearts();
        if (currentQ === shuffledQuestions.length - 1) {
          setShowSuccess(true);
          setTimeout(() => completeZone(1), 2000);
        } else {
          setTimeout(() => {
            setCurrentQ((q) => q + 1);
            setSelectedIdx(null);
            setAnswered(false);
          }, 800);
        }
      } else {
        triggerFail('That wasn\'t quite right... Try again with love!');
      }
    }, 600);
  };

  const question = shuffledQuestions[currentQ];

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(45, 31, 61, 0.92)',
    opacity: fadingIn ? 0 : 1,
    transition: 'opacity 0.5s ease',
    fontFamily: "'Georgia', 'Times New Roman', cursive, serif",
  };

  const cardStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${COLORS.darkBg} 0%, #3d2a54 100%)`,
    borderRadius: 24,
    padding: '40px 48px',
    maxWidth: 600,
    width: '90%',
    boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${COLORS.pink}33`,
    border: `2px solid ${COLORS.pink}44`,
    textAlign: 'center' as const,
  };

  const progressDots = shuffledQuestions.map((_, i) => (
    <span
      key={i}
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: i < currentQ ? COLORS.pink : i === currentQ ? COLORS.lightPink : '#555',
        display: 'inline-block',
        margin: '0 6px',
        transition: 'background 0.3s',
        boxShadow: i === currentQ ? `0 0 10px ${COLORS.pink}` : 'none',
      }}
    />
  ));

  if (showSuccess) {
    return (
      <div style={overlayStyle}>
        <div style={{ ...cardStyle, animation: 'none' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>💖</div>
          <h2 style={{ color: COLORS.pink, fontSize: 28, margin: '0 0 12px' }}>
            The heart gate opens!
          </h2>
          <p style={{ color: COLORS.lightPink, fontSize: 16 }}>You know us so well...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-120px) scale(1.5); }
        }
        @keyframes btnPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: 'fixed',
            left: `${h.x}%`,
            top: `${h.y}%`,
            fontSize: 28,
            animation: 'floatUp 1.2s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 1001,
          }}
        >
          💕
        </div>
      ))}

      <div style={cardStyle}>
        <div style={{ marginBottom: 24 }}>{progressDots}</div>

        <p style={{ color: '#aaa', fontSize: 13, margin: '0 0 8px' }}>
          Question {currentQ + 1} of {shuffledQuestions.length}
        </p>

        <h2
          style={{
            color: COLORS.white,
            fontSize: 22,
            fontWeight: 400,
            marginBottom: 32,
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          {question.question}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
          }}
        >
          {question.options.map((opt, i) => {
            const isSelected = selectedIdx === i;
            const isCorrect = i === question.correctIndex;
            let bg = `linear-gradient(135deg, ${COLORS.darkPink}88, ${COLORS.pink}44)`;
            let borderColor = `${COLORS.pink}55`;

            if (answered && isSelected) {
              bg = isCorrect
                ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                : 'linear-gradient(135deg, #e74c3c, #c0392b)';
              borderColor = isCorrect ? '#2ecc71' : '#e74c3c';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                style={{
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  borderRadius: 16,
                  padding: '16px 12px',
                  color: COLORS.white,
                  fontSize: 15,
                  cursor: answered ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  animation: !answered ? 'btnPulse 3s ease-in-out infinite' : 'none',
                  animationDelay: `${i * 0.2}s`,
                  opacity: answered && !isSelected ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!answered) {
                    (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                    (e.target as HTMLButtonElement).style.boxShadow = `0 6px 20px ${COLORS.pink}55`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!answered) {
                    (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.target as HTMLButtonElement).style.boxShadow = 'none';
                  }
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
