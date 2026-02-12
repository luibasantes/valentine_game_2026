# Agent Prompt: Valentine's Day 3D Web Game — "Alix's Valentine Adventure"

## Overview
Build a web-based 3D Valentine's Day game where the player (Alix) explores a low-poly enchanted garden world, solving 4 personalized challenges to unlock a final prize reveal. The game is a gift from Yuki to Alix.

## Tech Stack
- **React Three Fiber (R3F)** + **@react-three/drei** for 3D rendering and helpers
- **Vite** as bundler
- **Zustand** for global game state (current zone, lives, progress, fail/reset)
- **react-three-rapier** for basic physics and collisions
- **canvas-confetti** for the final prize reveal animation
- **TypeScript** preferred but not required
- Low-poly free assets from Kenney.nl, Poly Pizza, or Sketchfab (CC0/CC-BY)
- Deploy target: Vercel or Netlify (static build)

## World Design

### Visual Style
- Low-poly aesthetic with soft Valentine's palette: pinks, reds, warm whites, soft purples
- Floating heart particles in the air
- Soft ambient lighting (warm point lights + subtle fog)
- Lo-fi or soft romantic ambient background music (optional, royalty-free)
- The world is a small enchanted garden/path — not open-world, but freely walkable within bounds

### Layout (Linear Path with Free Exploration per Zone)
```
[Start: Park Bench] → [Zone 1: University Garden] → [Zone 2: Parking Lot]
→ [Zone 3: Cozy Apartment] → [Zone 4: Movie Theater] → [🏆 Prize Gazebo]
```

Each zone is connected by a winding garden trail with low-poly trees, flowers, and decorations. Each zone has a **glowing heart gate** that is locked until the puzzle is solved. The player can walk freely within each zone but cannot pass to the next until the challenge is complete.

### Player Controller
- Third-person or first-person camera (third-person preferred with a simple character model)
- WASD / arrow keys to move, mouse to look around
- Interaction with puzzle triggers via proximity + press E or click
- Mobile: virtual joystick + tap to interact (stretch goal)

## Game State

```ts
interface GameState {
  currentZone: 0 | 1 | 2 | 3 | 4 | 5; // 0=start, 1-4=zones, 5=prize
  zonesCompleted: boolean[];
  activePuzzle: string | null;
  gameStarted: boolean;
  gameWon: boolean;
}
```

### Fail Mechanic
- Any puzzle failure → screen fades to black with a message: **"Love is about trying again 💕"**
- Player is teleported back to the **start bench (Zone 0)**
- **All zone progress resets** — they must redo every puzzle from Zone 1
- This should feel gentle, not punishing — soft animations, sweet messages

## The 4 Challenges

### Zone 1 — "How It All Began" (Trivia)
**Setting:** A low-poly university courtyard with benches, books, and a fountain.
**Trigger:** A glowing floating love letter in the center of the courtyard. Player walks up and interacts.
**Puzzle:** An overlay/modal UI appears with 3 sequential multiple-choice questions:

1. "When is our anniversary?" → Options: A) February 14, B) December 15 ✅, C) January 1, D) November 25
2. "Where did Yuki and Alix meet?" → Options: A) A coffee shop, B) Online, C) University ✅, D) Through friends
3. "What is Alix's favorite food?" → Options: A) Pizza, B) Sushi, C) Fried potatoes with bacon ✅, D) Pasta

**Pass:** All 3 correct → heart gate opens with particle effect + chime sound
**Fail:** Any wrong answer → fail sequence → back to start

### Zone 2 — "Alix's Driving School" (Mini-game)
**Setting:** A cute low-poly parking lot with several parked cars, cones, and a designated parking spot highlighted in green.
**Trigger:** A little car with a bow on it. Player interacts to "get in."
**Puzzle:** Top-down or third-person camera switches. Player controls a small car with arrow keys. They must navigate to the green parking spot WITHOUT hitting any other car or obstacle.
- Simple collision detection
- Maybe 3-4 parked cars as obstacles and a slightly tricky path
- On collision → funny message: **"Not again, Alix! 😅"** → fail sequence → back to start
- On successful park → success animation + message: **"Perfect parking! Yuki is impressed 😏"**

**Pass:** Park in the green spot without collisions
**Fail:** Any collision → back to start

### Zone 3 — "Our First Home" (Memory Match)
**Setting:** A tiny low-poly apartment — a mattress on the floor, a small monitor on a box, warm string lights, minimal furniture. Cozy and intimate.
**Trigger:** The small monitor/screen in the apartment. Player interacts with it.
**Puzzle:** A classic memory card-matching game rendered on the in-world monitor (or as a UI overlay). 6 pairs (12 cards) with Valentine's/relationship-themed images:

Card pairs (use emoji or simple icons):
1. 🥔 Fried Potatoes
2. 📺 Friends TV Show logo
3. 🎵 Ophelia (music note)
4. 📅 Dec 15
5. 💕 Heart (Yuki + Alix)
6. 🏠 Little apartment

- Cards flip with animation
- Player clicks two cards at a time
- If match → cards stay revealed
- If no match → cards flip back
- **Max allowed mismatches: 6** — if exceeded → fail → back to start
- On all matched → success: **"This is where our story began 🏠💕"**

**Pass:** Match all 6 pairs within 6 mismatches
**Fail:** More than 6 mismatches → back to start

### Zone 4 — "The Two Moods of Alix" (Reaction/Sorting)
**Setting:** A cozy low-poly movie theater with red seats, popcorn, and a big screen.
**Trigger:** Sit in the center seat to start.
**Puzzle:** A fast-paced sorting game on the theater screen. Scenarios/images appear one at a time and the player must classify each as either **"😠 Angry"** or **"😴 Sleeping"** — the inside joke being that Alix only has these two states.

10 scenarios (examples — adjust for humor):
1. "It's Monday morning" → 😴
2. "Someone ate the last fried potato" → 😠
3. "Netflix is still asking 'Are you still watching?'" → 😴
4. "Yuki forgot to reply to a text" → 😠
5. "After a big lunch" → 😴
6. "Someone spoiled the Friends finale" → 😠
7. "Sunday afternoon on the couch" → 😴
8. "The car in front is driving too slow" → 😠
9. "Rainy day, warm blanket" → 😴
10. "Yuki said 'we need to talk'" → 😠

- Each scenario appears for ~5 seconds, player clicks Angry or Sleeping
- Timer bar visible
- If time runs out on one → counts as wrong
- **Must get 8/10 correct to pass**

**Pass:** 8+ correct → **"Yuki knows you too well 😂"**
**Fail:** Less than 8 → back to start

## Prize Reveal (Zone 5)

After Zone 4, the final heart gate opens to a **beautiful gazebo** with:
- Floating hearts, candles, fairy lights
- Soft romantic music fades in
- Player walks to the center

**Reveal sequence (automated cinematic):**
1. Camera slowly zooms in / orbits the gazebo
2. A big golden heart descends from above
3. Heart opens with a **confetti explosion** (canvas-confetti)
4. Text appears in elegant typography:

```
🎉 You Did It, Alix! 🎉

"From a mattress on the floor to building our world together,
every moment with you is my favorite adventure.

Happy Valentine's Day, mi amor.
— Yuki 💕"
```

5. Then two prize cards animate in:
   - 🧖‍♀️ **Full Day SPA** — a styled coupon/voucher card
   - 📸 **Photography Session** — a styled coupon/voucher card
6. Both cards should look like elegant gift vouchers with a subtle shimmer/glow effect
7. Optional: "Screenshot this!" or a download button to save the coupons as an image

## UI/UX Notes
- **Start screen:** Title "Alix's Valentine Adventure 💕" with a "Start" button and soft background music
- **HUD:** Minimal — current zone indicator (hearts: ❤️❤️🤍🤍 = 2/4 complete)
- **Zone transitions:** Soft fade or particle whoosh when passing through heart gates
- **Dialogue/messages:** Use a styled text box at bottom of screen (visual novel style)
- **Responsive:** Should work on desktop. Mobile is a stretch goal.
- **No backend needed** — everything runs client-side

## File Structure Suggestion
```
src/
├── App.tsx
├── main.tsx
├── store/
│   └── gameStore.ts          # Zustand store
├── components/
│   ├── World/
│   │   ├── Garden.tsx         # Trees, flowers, path, decorations
│   │   ├── HeartGate.tsx      # Locked/unlocked gate component
│   │   └── Zones.tsx          # Zone layout and positioning
│   ├── Player/
│   │   ├── PlayerController.tsx
│   │   └── Camera.tsx
│   ├── Puzzles/
│   │   ├── TriviaPuzzle.tsx   # Zone 1
│   │   ├── DrivingPuzzle.tsx  # Zone 2
│   │   ├── MemoryPuzzle.tsx   # Zone 3
│   │   └── SortingPuzzle.tsx  # Zone 4
│   ├── UI/
│   │   ├── HUD.tsx
│   │   ├── StartScreen.tsx
│   │   ├── FailScreen.tsx
│   │   ├── DialogBox.tsx
│   │   └── PrizeReveal.tsx
│   └── Effects/
│       ├── FloatingHearts.tsx
│       └── Confetti.tsx
├── assets/
│   ├── models/               # .glb low-poly models
│   ├── textures/
│   └── sounds/
└── utils/
    └── puzzleData.ts          # Questions, scenarios, card data
```

## Key Implementation Notes
- Use `@react-three/drei`'s `KeyboardControls` + `PointerLockControls` or a custom third-person controller
- Each zone can be a group (`<group position={[x, 0, z]}>`) placed along a path
- Puzzles can switch between 3D world and 2D overlay UI — use React portals or conditional rendering
- Heart gates use a simple `<mesh>` with emissive material that changes color/opacity when unlocked
- For the driving mini-game, switch to a top-down camera and use simple 2D-style controls within the 3D scene
- The memory match and sorting games can be HTML/CSS overlays on top of the canvas for easier implementation
- Use Zustand's `persist` middleware if you want progress saving (optional given the reset mechanic)

## Tone & Feel
This is a love letter disguised as a game. Every element should feel warm, playful, and personal. The humor (driving crash, two moods) should make Alix laugh. The apartment scene should make her feel nostalgic. The final reveal should make her feel loved. Keep it lighthearted — this is fun, not stressful.