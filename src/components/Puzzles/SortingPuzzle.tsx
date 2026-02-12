import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { sortingScenarios } from '../../utils/puzzleData';

const COLORS = {
  pink: '#ff6b9d',
  darkPink: '#c44569',
  lightPink: '#f8a5c2',
  white: '#fff',
  darkBg: '#2d1f3d',
};

const TIMER_MS = 5000;
const REQUIRED_SCORE = 8;

export default function SortingPuzzle() {
  const { completeZone, triggerFail } = useGameStore();
  const [fadingIn, setFadingIn] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [slideIn, setSlideIn] = useState(true);
  const [timerProgress, setTimerProgress] = useState(1);

  const timerRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const answeredRef = useRef(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setFadingIn(false), 50);
    return () => clearTimeout(t);
  }, []);

  const advance = useCallback(
    (wasCorrect: boolean) => {
      if (doneRef.current) return;
      const newScore = wasCorrect ? score + 1 : score;
      if (wasCorrect) setScore(newScore);

      setFeedback(wasCorrect ? 'correct' : 'wrong');

      setTimeout(() => {
        setFeedback(null);
        const nextIdx = currentIdx + 1;

        if (nextIdx >= sortingScenarios.length) {
          doneRef.current = true;
          setShowResult(true);
          if (newScore >= REQUIRED_SCORE) {
            setTimeout(() => completeZone(4), 2500);
          } else {
            setTimeout(() => triggerFail('Alix is unpredictable... Try again!'), 2500);
          }
          return;
        }

        setCurrentIdx(nextIdx);
        setSlideIn(true);
        answeredRef.current = false;
      }, 700);
    },
    [currentIdx, score, completeZone, triggerFail],
  );

  const handleAnswer = useCallback(
    (choice: 'angry' | 'sleeping') => {
      if (answeredRef.current || doneRef.current) return;
      answeredRef.current = true;
      cancelAnimationFrame(timerRef.current);

      const correct = sortingScenarios[currentIdx].answer === choice;
      advance(correct);
    },
    [currentIdx, advance],
  );

  useEffect(() => {
    if (showResult || doneRef.current) return;

    answeredRef.current = false;
    startTimeRef.current = performance.now();
    setTimerProgress(1);

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, 1 - elapsed / TIMER_MS);
      setTimerProgress(remaining);

      if (remaining <= 0 && !answeredRef.current) {
        answeredRef.current = true;
        advance(false);
        return;
      }

      if (!answeredRef.current) {
        timerRef.current = requestAnimationFrame(tick);
      }
    };

    timerRef.current = requestAnimationFrame(tick);
    const slideT = setTimeout(() => setSlideIn(false), 50);

    return () => {
      cancelAnimationFrame(timerRef.current);
      clearTimeout(slideT);
    };
  }, [currentIdx, showResult, advance]);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(20, 12, 28, 0.96)',
    opacity: fadingIn ? 0 : 1,
    transition: 'opacity 0.5s ease',
    fontFamily: "'Georgia', serif",
  };

  const screenStyle: React.CSSProperties = {
    background: '#0d0815',
    borderRadius: 16,
    padding: '36px 40px',
    maxWidth: 560,
    width: '90%',
    boxShadow: '0 20px 80px rgba(0,0,0,0.7)',
    border: '3px solid #2a1e3d',
    position: 'relative',
    overflow: 'hidden',
  };

  // Curtain accents
  const curtainLeft: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    background: `linear-gradient(180deg, ${COLORS.darkPink}, ${COLORS.darkPink}88)`,
    opacity: 0.5,
  };
  const curtainRight: React.CSSProperties = {
    ...curtainLeft,
    left: 'auto',
    right: 0,
  };

  if (showResult) {
    const passed = score >= REQUIRED_SCORE;
    return (
      <div style={overlayStyle}>
        <div style={screenStyle}>
          <div style={curtainLeft} />
          <div style={curtainRight} />
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{passed ? '🎬💕' : '😢'}</div>
            <h2 style={{ color: passed ? COLORS.pink : '#e74c3c', fontSize: 26, margin: '0 0 12px' }}>
              {passed ? 'Luigi knows you too well' : 'Not quite...'}
            </h2>
            <p style={{ color: '#aaa', fontSize: 16 }}>
              Score: {score}/{sortingScenarios.length}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scenario = sortingScenarios[currentIdx];

  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes feedbackPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div style={screenStyle}>
        <div style={curtainLeft} />
        <div style={curtainRight} />

        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
              alignItems: 'center',
            }}
          >
            <span style={{ color: COLORS.pink, fontSize: 18, fontWeight: 'bold' }}>
              Is Alix...
            </span>
            <span style={{ color: '#888', fontSize: 14 }}>
              {currentIdx + 1}/{sortingScenarios.length}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <span style={{ color: COLORS.lightPink, fontSize: 13 }}>
              Score: {score}
            </span>
            <span style={{ color: '#888', fontSize: 12 }}>
              Need {REQUIRED_SCORE} to pass
            </span>
          </div>

          {/* Timer bar */}
          <div
            style={{
              width: '100%',
              height: 6,
              background: '#1a1225',
              borderRadius: 3,
              marginBottom: 28,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${timerProgress * 100}%`,
                height: '100%',
                background:
                  timerProgress > 0.4
                    ? `linear-gradient(90deg, ${COLORS.pink}, ${COLORS.lightPink})`
                    : timerProgress > 0.2
                      ? '#f39c12'
                      : '#e74c3c',
                borderRadius: 3,
                transition: 'background 0.3s',
              }}
            />
          </div>

          {/* Scenario text */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 36,
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: slideIn ? 'none' : 'slideFromRight 0.4s ease-out',
              position: 'relative',
            }}
          >
            {feedback ? (
              <div
                style={{
                  fontSize: 48,
                  animation: 'feedbackPop 0.4s ease-out',
                }}
              >
                {feedback === 'correct' ? '✅' : '❌'}
              </div>
            ) : (
              <h2
                style={{
                  color: COLORS.white,
                  fontSize: 24,
                  fontWeight: 400,
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                "{scenario.text}"
              </h2>
            )}
          </div>

          {/* Answer buttons */}
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              onClick={() => handleAnswer('angry')}
              disabled={answeredRef.current}
              style={{
                flex: 1,
                padding: '20px 16px',
                background: 'linear-gradient(135deg, #e74c3c33, #c0392b22)',
                border: '2px solid #e74c3c55',
                borderRadius: 16,
                color: COLORS.white,
                fontSize: 16,
                cursor: answeredRef.current ? 'default' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #e74c3c55, #c0392b44)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #e74c3c33, #c0392b22)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <span style={{ fontSize: 36 }}>😤</span>
              <span>Angry</span>
            </button>

            <button
              onClick={() => handleAnswer('sleeping')}
              disabled={answeredRef.current}
              style={{
                flex: 1,
                padding: '20px 16px',
                background: 'linear-gradient(135deg, #3498db33, #2980b922)',
                border: '2px solid #3498db55',
                borderRadius: 16,
                color: COLORS.white,
                fontSize: 16,
                cursor: answeredRef.current ? 'default' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #3498db55, #2980b944)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #3498db33, #2980b922)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <span style={{ fontSize: 36 }}>😴</span>
              <span>Sleeping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
