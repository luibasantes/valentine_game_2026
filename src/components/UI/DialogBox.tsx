import { useEffect, useState, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';

const CHAR_INTERVAL = 35;
const AUTO_DISMISS_MS = 5000;

export default function DialogBox() {
  const { dialogMessage, setDialog } = useGameStore();
  const [displayed, setDisplayed] = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const autoRef = useRef<ReturnType<typeof setTimeout>>();
  const fullTextRef = useRef('');

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => setDialog(null), 300);
  }, [setDialog]);

  useEffect(() => {
    if (!dialogMessage) {
      setVisible(false);
      setDisplayed('');
      return;
    }

    fullTextRef.current = dialogMessage;
    setDisplayed('');
    setVisible(true);

    let idx = 0;
    clearInterval(timerRef.current);
    clearTimeout(autoRef.current);

    timerRef.current = setInterval(() => {
      idx++;
      setDisplayed(fullTextRef.current.slice(0, idx));
      if (idx >= fullTextRef.current.length) {
        clearInterval(timerRef.current);
        autoRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
      }
    }, CHAR_INTERVAL);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(autoRef.current);
    };
  }, [dialogMessage, dismiss]);

  const handleClick = () => {
    if (displayed.length < (fullTextRef.current?.length ?? 0)) {
      clearInterval(timerRef.current);
      setDisplayed(fullTextRef.current);
      clearTimeout(autoRef.current);
      autoRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    } else {
      dismiss();
    }
  };

  if (!dialogMessage) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
        zIndex: 200,
        width: 'min(90vw, 700px)',
        background: 'rgba(30, 15, 35, 0.88)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,107,157,0.25)',
        padding: '20px 28px',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(255,107,157,0.1)',
      }}
    >
      <p
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          color: '#f8a5c2',
          lineHeight: 1.6,
          margin: 0,
          minHeight: '1.6em',
        }}
      >
        {displayed}
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1.1em',
            background: '#ff6b9d',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: displayed.length < (fullTextRef.current?.length ?? 0)
              ? 'none'
              : 'blink 1s step-end infinite',
          }}
        />
      </p>

      <span
        style={{
          position: 'absolute',
          bottom: '6px',
          right: '14px',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.25)',
        }}
      >
        click to continue
      </span>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
