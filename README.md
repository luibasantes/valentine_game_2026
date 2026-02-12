# Alix's Valentine Adventure

A 3D Valentine's Day web game where the player walks through an enchanted garden, solving puzzles across four themed zones to unlock a final prize reveal.

**Live:** [valentine2026.luigi-basantes.com](https://valentine2026.luigi-basantes.com)

## Tech Stack

- **React + TypeScript** with Vite
- **React Three Fiber** (@react-three/fiber) + **Drei** for 3D rendering
- **Zustand** for state management
- **canvas-confetti** for celebration effects
- Hosted on **Cloudflare Pages**

## Game Flow

1. **Start Screen** - Enter a 4-digit PIN to begin
2. **Zone 1: University Garden** - Trivia quiz about the couple's history
3. **Zone 2: Parking Lot** - Top-down driving/parking mini-game
4. **Zone 3: Cozy Apartment** - Memory card matching game
5. **Zone 4: Movie Theater** - Timeline sorting puzzle
6. **Prize Reveal** - Confetti celebration with gift vouchers

Failing any puzzle resets all progress. Heart gates block the path until each zone's puzzle is completed.

## Controls

- **WASD / Arrow Keys** - Move
- **Space** - Jump
- **Mouse Drag** - Orbit camera
- **E** - Interact with puzzle triggers

## Development

```bash
npm install
npm run dev       # Start dev server
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Deployment

```bash
npx vite build
npx wrangler pages deploy dist --project-name=alix-valentine-adventure --commit-dirty=true
```
