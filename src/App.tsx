import { Canvas } from '@react-three/fiber';
import { useGameStore } from './store/gameStore';
import Garden from './components/World/Garden';
import Zones from './components/World/Zones';
import PlayerController from './components/Player/PlayerController';
import FloatingHearts from './components/Effects/FloatingHearts';
import StartScreen from './components/UI/StartScreen';
import HUD from './components/UI/HUD';
import FailScreen from './components/UI/FailScreen';
import DialogBox from './components/UI/DialogBox';
import PrizeReveal from './components/UI/PrizeReveal';
import TriviaPuzzle from './components/Puzzles/TriviaPuzzle';
import DrivingPuzzle from './components/Puzzles/DrivingPuzzle';
import MemoryPuzzle from './components/Puzzles/MemoryPuzzle';
import SortingPuzzle from './components/Puzzles/SortingPuzzle';

function PuzzleOverlay() {
  const activePuzzle = useGameStore((s) => s.activePuzzle);
  switch (activePuzzle) {
    case 'trivia': return <TriviaPuzzle />;
    case 'driving': return <DrivingPuzzle />;
    case 'memory': return <MemoryPuzzle />;
    case 'sorting': return <SortingPuzzle />;
    default: return null;
  }
}

export default function App() {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const showFail = useGameStore((s) => s.showFail);
  const gameWon = useGameStore((s) => s.gameWon);
  const resetToStart = useGameStore((s) => s.resetToStart);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {!gameStarted && <StartScreen />}

      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 60 }}
        style={{ background: '#1a0a2e' }}
      >
        <fog attach="fog" args={['#2d1f3d', 30, 80]} />
        <ambientLight intensity={0.4} color="#ffd6e0" />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
          color="#fff0f5"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[0, 5, -30]} intensity={0.6} color="#ff6b9d" distance={40} />
        <pointLight position={[0, 5, -90]} intensity={0.6} color="#f8a5c2" distance={40} />
        <pointLight position={[0, 5, -150]} intensity={0.8} color="#ffd700" distance={40} />

        <Garden />
        <Zones />
        <FloatingHearts />
        <PlayerController />
      </Canvas>

      {gameStarted && <HUD />}
      {gameStarted && <DialogBox />}
      <PuzzleOverlay />
      {showFail && <FailScreen />}
      {gameWon && <PrizeReveal />}

      {gameStarted && (
        <button
          onClick={resetToStart}
          title="Restart"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 500,
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
          ↺
        </button>
      )}
    </div>
  );
}
