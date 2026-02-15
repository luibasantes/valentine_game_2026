import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useLangStore } from '../../store/langStore';
import { useT } from '../../store/langStore';

export default function SettingsModal() {
  const [open, setOpen] = useState(false);
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const resetToStart = useGameStore((s) => s.resetToStart);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={t.settings.title}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 700,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,107,157,0.3)',
          background: 'rgba(45,31,61,0.6)',
          backdropFilter: 'blur(6px)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,107,157,0.25)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(45,31,61,0.6)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
        }}
      >
        ⚙
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(20, 10, 30, 0.8)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #2d1f3d 0%, #3d2a54 100%)',
              borderRadius: 20,
              padding: '32px 36px',
              minWidth: 280,
              border: '2px solid rgba(255,107,157,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,107,157,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: '1.6rem',
                  color: '#ff6b9d',
                  margin: 0,
                }}
              >
                {t.settings.title}
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 22,
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Language toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: '1.1rem',
                  color: '#f8a5c2',
                }}
              >
                {t.settings.language}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['en', 'es'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: 12,
                      border: `2px solid ${lang === l ? '#ff6b9d' : 'rgba(255,255,255,0.15)'}`,
                      background: lang === l
                        ? 'linear-gradient(135deg, #ff6b9d33, #c4456922)'
                        : 'rgba(255,255,255,0.05)',
                      color: lang === l ? '#fff' : 'rgba(255,255,255,0.5)',
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: '1rem',
                      fontWeight: lang === l ? 700 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {l === 'en' ? 'English' : 'Español'}
                  </button>
                ))}
              </div>
            </div>

            {/* Restart button */}
            <button
              onClick={() => {
                setOpen(false);
                resetToStart();
              }}
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                border: 'none',
                borderRadius: 14,
                padding: '12px 24px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 0 20px rgba(255,107,157,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255,107,157,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255,107,157,0.25)';
              }}
            >
              ↺ {t.settings.restart}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
