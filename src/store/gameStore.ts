import { create } from 'zustand';

interface GameState {
  currentZone: 0 | 1 | 2 | 3 | 4 | 5;
  zonesCompleted: boolean[];
  activePuzzle: string | null;
  gameStarted: boolean;
  gameWon: boolean;
  showFail: boolean;
  failMessage: string;
  dialogMessage: string | null;

  startGame: () => void;
  setZone: (zone: 0 | 1 | 2 | 3 | 4 | 5) => void;
  completeZone: (zone: number) => void;
  setActivePuzzle: (puzzle: string | null) => void;
  triggerFail: (message?: string) => void;
  dismissFail: () => void;
  resetToStart: () => void;
  winGame: () => void;
  setDialog: (msg: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentZone: 0,
  zonesCompleted: [false, false, false, false],
  activePuzzle: null,
  gameStarted: false,
  gameWon: false,
  showFail: false,
  failMessage: '',
  dialogMessage: null,

  startGame: () => set({ gameStarted: true, currentZone: 0 }),

  setZone: (zone) => set({ currentZone: zone }),

  completeZone: (zone) =>
    set((state) => {
      const zonesCompleted = [...state.zonesCompleted];
      zonesCompleted[zone - 1] = true;
      const nextZone = Math.min(zone + 1, 5) as 0 | 1 | 2 | 3 | 4 | 5;
      const gameWon = zone === 4;
      return { zonesCompleted, activePuzzle: null, currentZone: nextZone, gameWon };
    }),

  setActivePuzzle: (puzzle) => set({ activePuzzle: puzzle }),

  triggerFail: (message) =>
    set({ showFail: true, failMessage: message ?? '', activePuzzle: null }),

  dismissFail: () =>
    set({
      showFail: false,
      failMessage: '',
      currentZone: 0,
      zonesCompleted: [false, false, false, false],
    }),

  resetToStart: () =>
    set({
      currentZone: 0,
      zonesCompleted: [false, false, false, false],
      activePuzzle: null,
      showFail: false,
      failMessage: '',
      gameStarted: false,
      gameWon: false,
      dialogMessage: null,
    }),

  winGame: () => set({ gameWon: true, activePuzzle: null, currentZone: 5 }),

  setDialog: (msg) => set({ dialogMessage: msg }),
}));
