import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { memoryCards } from '../../utils/puzzleData';
import type { MemoryCard } from '../../utils/puzzleData';

const COLORS = {
  pink: '#ff6b9d',
  darkPink: '#c44569',
  lightPink: '#f8a5c2',
  white: '#fff',
  darkBg: '#2d1f3d',
};

const MAX_MISMATCHES = 6;

interface CardState {
  card: MemoryCard;
  uniqueId: number;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryPuzzle() {
  const { completeZone, triggerFail } = useGameStore();
  const [fadingIn, setFadingIn] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mismatches, setMismatches] = useState(0);
  const [locked, setLocked] = useState(false);

  const initialCards = useMemo(() => {
    const pairs: CardState[] = memoryCards.flatMap((card, _i) => [
      { card, uniqueId: card.id * 2, flipped: false, matched: false },
      { card, uniqueId: card.id * 2 + 1, flipped: false, matched: false },
    ]);
    return shuffle(pairs);
  }, []);

  const [cards, setCards] = useState<CardState[]>(initialCards);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setFadingIn(false), 50);
    return () => clearTimeout(t);
  }, []);

  const handleClick = useCallback(
    (idx: number) => {
      if (locked || cards[idx].flipped || cards[idx].matched) return;

      const newCards = [...cards];
      newCards[idx] = { ...newCards[idx], flipped: true };
      const newSelected = [...selected, idx];
      setCards(newCards);
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setLocked(true);
        const [a, b] = newSelected;
        const isMatch = newCards[a].card.id === newCards[b].card.id;

        if (isMatch) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)),
            );
            setSelected([]);
            setLocked(false);

            const matchedCount = newCards.filter((c) => c.matched).length + 2;
            if (matchedCount === newCards.length) {
              setShowSuccess(true);
              setTimeout(() => completeZone(3), 2000);
            }
          }, 500);
        } else {
          const newMismatchCount = mismatches + 1;
          setMismatches(newMismatchCount);

          if (newMismatchCount >= MAX_MISMATCHES) {
            setTimeout(() => {
              triggerFail('Too many mismatches! Our memories are tricky...');
            }, 800);
            return;
          }

          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) =>
                i === a || i === b ? { ...c, flipped: false } : c,
              ),
            );
            setSelected([]);
            setLocked(false);
          }, 1000);
        }
      }
    },
    [cards, selected, locked, mismatches, completeZone, triggerFail],
  );

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(45, 31, 61, 0.94)',
    opacity: fadingIn ? 0 : 1,
    transition: 'opacity 0.5s ease',
    fontFamily: "'Georgia', serif",
  };

  const monitorStyle: React.CSSProperties = {
    background: '#1a1225',
    borderRadius: 20,
    padding: '32px 36px',
    maxWidth: 520,
    width: '92%',
    boxShadow: `0 0 60px rgba(0,0,0,0.6), inset 0 0 80px rgba(0,0,0,0.3), 0 0 20px ${COLORS.pink}22`,
    border: `3px solid #3a2a50`,
    position: 'relative',
  };

  const screenGlow: React.CSSProperties = {
    position: 'absolute',
    inset: -2,
    borderRadius: 22,
    background: `linear-gradient(135deg, ${COLORS.pink}11, transparent, ${COLORS.darkPink}11)`,
    pointerEvents: 'none',
  };

  if (showSuccess) {
    return (
      <div style={overlayStyle}>
        <div style={monitorStyle}>
          <div style={screenGlow} />
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>💻💕</div>
            <h2 style={{ color: COLORS.pink, fontSize: 26 }}>
              This is where our story began
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes matchGlow {
          0%, 100% { box-shadow: 0 0 10px ${COLORS.pink}44; }
          50% { box-shadow: 0 0 25px ${COLORS.pink}88; }
        }
        .memory-card-inner {
          transition: transform 0.5s;
          transform-style: preserve-3d;
          position: relative;
          width: 100%;
          height: 100%;
        }
        .memory-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .memory-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div style={monitorStyle}>
        <div style={screenGlow} />

        <div style={{ position: 'relative' }}>
          <h2 style={{ color: COLORS.pink, textAlign: 'center', margin: '0 0 6px', fontSize: 20 }}>
            Match Our Memories
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              padding: '0 4px',
            }}
          >
            <span style={{ color: COLORS.lightPink, fontSize: 13 }}>
              Pairs: {Math.floor(cards.filter((c) => c.matched).length / 2)}/{memoryCards.length}
            </span>
            <span
              style={{
                color: mismatches >= MAX_MISMATCHES - 2 ? '#e74c3c' : '#aaa',
                fontSize: 13,
                transition: 'color 0.3s',
              }}
            >
              Mismatches: {mismatches}/{MAX_MISMATCHES}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
            }}
          >
            {cards.map((c, i) => {
              const isRevealed = c.flipped || c.matched;
              return (
                <div
                  key={c.uniqueId}
                  onClick={() => handleClick(i)}
                  style={{
                    perspective: 600,
                    cursor: isRevealed || locked ? 'default' : 'pointer',
                    aspectRatio: '3 / 4',
                    animation: c.matched ? 'matchGlow 2s ease-in-out infinite' : 'none',
                  }}
                >
                  <div className={`memory-card-inner ${isRevealed ? 'flipped' : ''}`}>
                    {/* Front (hidden side) */}
                    <div
                      className="memory-card-face"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.darkPink}, ${COLORS.pink})`,
                        border: `2px solid ${COLORS.lightPink}55`,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>💌</span>
                    </div>

                    {/* Back (revealed side) */}
                    <div
                      className="memory-card-face"
                      style={{
                        transform: 'rotateY(180deg)',
                        background: c.matched
                          ? `linear-gradient(135deg, ${COLORS.darkBg}, #3d2a54)`
                          : '#2a1e3d',
                        border: `2px solid ${c.matched ? COLORS.pink : COLORS.lightPink}55`,
                      }}
                    >
                      <span style={{ fontSize: 30, marginBottom: 4 }}>{c.card.emoji}</span>
                      <span
                        style={{
                          color: COLORS.lightPink,
                          fontSize: 11,
                          textAlign: 'center',
                          padding: '0 4px',
                        }}
                      >
                        {c.card.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
