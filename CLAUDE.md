# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

- `npm run dev` — Start Vite dev server (HMR)
- `npm run build` — TypeScript check + Vite production build (outputs to `dist/`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build locally
- `npx tsc --noEmit` — Type-check only (no build)

## Deployment

Hosted on Cloudflare Pages as `alix-valentine-adventure`. Deploy with:
```
npx wrangler pages deploy dist --project-name=alix-valentine-adventure --commit-dirty=true
```
Custom domain: `valentine2026.luigi-basantes.com`

## Architecture

This is a Valentine's Day 3D web game built with React Three Fiber (R3F). The player walks through an enchanted garden path, solving 4 puzzles across themed zones to unlock a final prize reveal.

### State Management

`src/store/gameStore.ts` — Single Zustand store managing all game state: current zone (0-5), puzzle activation, win/fail states, zone completion tracking. All puzzles and UI components read/write through this store.

### Rendering Layers

Two rendering layers coexist:
1. **3D Canvas** (`<Canvas>` in App.tsx) — Garden world, player, zones, floating effects via R3F
2. **HTML Overlays** (position: fixed, above canvas) — All puzzles, HUD, dialogs, start/fail/prize screens are pure React/CSS components overlaid on top

### Game Flow

StartScreen (PIN: 1011) → Walk garden path → Zone 1 Trivia → Zone 2 Driving/Parking → Zone 3 Memory Match → Zone 4 Sorting → PrizeReveal with confetti

Each zone has a HeartGate barrier. Gates block forward movement (enforced in PlayerController via `GATE_BARRIERS`) until the previous zone's puzzle is completed. Failing any puzzle resets all progress to zone 0.

### Path System

The garden path follows a sine-wave wobble: `centerX = Math.sin(z * 0.05) * 1.5`, width = 4 units, running from z=5 to z=-160. Rose fences line both sides. PlayerController constrains the player to path bounds using the same formula.

### Key Patterns

- **Puzzles** are full-screen HTML overlays (z-index 1000) that capture keyboard input. DrivingPuzzle uses `capture: true` + `stopPropagation` on key listeners to prevent conflict with the 3D PlayerController.
- **Trivia answers** are Fisher-Yates shuffled on mount via `useMemo` to randomize option order.
- **3D objects** are all procedural geometry (no external .glb models). Trees, cars, furniture built from primitives.
- **Camera** is third-person orbit: WASD moves player relative to camera direction, mouse drag rotates camera around player.
- All puzzle data lives in `src/utils/puzzleData.ts` — trivia questions, memory card pairs, sorting scenarios.
