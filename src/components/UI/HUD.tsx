import { useGameStore } from '../../store/gameStore';

const ZONE_NAMES = [
  'Start',
  'University Garden',
  'Parking Lot',
  'Cozy Apartment',
  'Movie Theater',
  'Prize Gazebo',
];

export default function HUD() {
  const { gameStarted, gameWon, showFail, currentZone, zonesCompleted } = useGameStore();

  if (!gameStarted || gameWon || showFail) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(45,31,61,0.75)',
          backdropFilter: 'blur(8px)',
          borderRadius: '40px',
          padding: '8px 24px',
          border: '1px solid rgba(255,107,157,0.2)',
        }}
      >
        {zonesCompleted.map((done, i) => (
          <span
            key={i}
            style={{
              fontSize: '20px',
              transition: 'transform 0.3s ease, filter 0.3s ease',
              transform: done ? 'scale(1.15)' : 'scale(1)',
              filter: done ? 'drop-shadow(0 0 6px rgba(255,107,157,0.8))' : 'none',
            }}
          >
            {done ? '❤️' : '🤍'}
          </span>
        ))}
      </div>

      <span
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: '0.85rem',
          color: 'rgba(248,165,194,0.7)',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}
      >
        {ZONE_NAMES[currentZone]}
      </span>
    </div>
  );
}
