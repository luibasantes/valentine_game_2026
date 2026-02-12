import confetti from 'canvas-confetti';

const COLORS = ['#ff6b9d', '#f8a5c2', '#ffd700', '#ff4757', '#ff6348'];

export function triggerConfetti() {
  const end = Date.now() + 3000;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: COLORS,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: COLORS,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();

  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: COLORS,
      scalar: 1.2,
    });
  }, 500);

  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 120,
      origin: { x: 0.3, y: 0.5 },
      colors: COLORS,
    });
    confetti({
      particleCount: 80,
      spread: 120,
      origin: { x: 0.7, y: 0.5 },
      colors: COLORS,
    });
  }, 1200);
}
