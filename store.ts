/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { create } from 'zustand';
import { GameStatus, GameMode, RUN_SPEED_BASE } from './types';

interface GameState {
  status: GameStatus;
  gameMode: GameMode;
  score: number;
  lives: number;
  maxLives: number;
  speed: number;
  collectedLetters: number[];
  level: number;
  laneCount: number;
  gemsCollected: number;
  distance: number;

  // Inventory / Abilities
  hasDoubleJump: boolean;
  hasImmortality: boolean;
  isImmortalityActive: boolean;

  // Actions
  startGame: (mode: GameMode) => void;
  restartGame: () => void;
  takeDamage: () => void;
  addScore: (amount: number) => void;
  collectGem: (value: number) => void;
  collectLetter: (index: number) => void;
  setStatus: (status: GameStatus) => void;
  setDistance: (dist: number) => void;

  // Shop / Abilities
  buyItem: (type: 'DOUBLE_JUMP' | 'MAX_LIFE' | 'HEAL' | 'IMMORTAL', cost: number) => boolean;
  advanceLevel: () => void;
  openShop: () => void;
  closeShop: () => void;
  activateImmortality: () => void;
}

const GEMINI_TARGET = ['V', 'E', 'R', 'D', 'E'];
const MAX_LEVEL = 3;

export const useStore = create<GameState>((set, get) => ({
  status: GameStatus.MENU,
  gameMode: GameMode.MISSION,
  score: 0,
  lives: 3,
  maxLives: 3,
  speed: 0,
  collectedLetters: [],
  level: 1,
  laneCount: 3,
  gemsCollected: 0,
  distance: 0,

  hasDoubleJump: false,
  hasImmortality: false,
  isImmortalityActive: false,

  startGame: (mode: GameMode) => set({
    status: GameStatus.PLAYING,
    gameMode: mode,
    score: 0,
    lives: 3,
    maxLives: 3,
    speed: RUN_SPEED_BASE,
    collectedLetters: [],
    level: 1,
    laneCount: 3,
    gemsCollected: 0,
    distance: 0,
    hasDoubleJump: false,
    hasImmortality: false,
    isImmortalityActive: false
  }),

  restartGame: () => set((state) => ({
    status: GameStatus.PLAYING,
    score: 0,
    lives: 3,
    maxLives: 3,
    speed: RUN_SPEED_BASE,
    collectedLetters: [],
    level: 1,
    laneCount: 3,
    gemsCollected: 0,
    distance: 0,
    hasDoubleJump: false,
    hasImmortality: false,
    isImmortalityActive: false
  })),

  takeDamage: () => {
    const { lives, isImmortalityActive } = get();
    if (isImmortalityActive) return; // No damage if skill is active

    if (lives > 1) {
      set({ lives: lives - 1 });
    } else {
      set({ lives: 0, status: GameStatus.GAME_OVER, speed: 0 });
    }
  },

  addScore: (amount) => set((state) => ({ score: state.score + amount })),

  collectGem: (value) => set((state) => ({
    score: state.score + value,
    gemsCollected: state.gemsCollected + 1
  })),

  setDistance: (dist) => set({ distance: dist }),

  collectLetter: (index) => {
    const { collectedLetters, level, speed } = get();

    if (!collectedLetters.includes(index)) {
      const newLetters = [...collectedLetters, index];

      // LINEAR SPEED INCREASE: Add 10% of BASE speed per letter
      // This ensures 110% -> 120% -> 130% consistent steps
      const speedIncrease = RUN_SPEED_BASE * 0.10;
      const nextSpeed = speed + speedIncrease;

      set({
        collectedLetters: newLetters,
        speed: nextSpeed
      });

      // Check if full word collected (ignoring spaces)
      const targetLetters = GEMINI_TARGET.filter(char => char !== ' ');
      if (newLetters.length === targetLetters.length) {
        if (level < MAX_LEVEL) {
          // Immediately advance level
          // The Shop Portal will be spawned by LevelManager at the start of the new level
          get().advanceLevel();
        } else {
          // Victory Condition
          set({
            status: GameStatus.VICTORY,
            score: get().score + 5000
          });
        }
      }
    }
  },

  advanceLevel: () => {
    const { level, laneCount, speed } = get();
    const nextLevel = level + 1;

    // LINEAR LEVEL INCREASE: Add 40% of BASE speed per level
    // Combined with the 6 letters (60%), this totals +100% speed per full level cycle
    const speedIncrease = RUN_SPEED_BASE * 0.40;
    const newSpeed = speed + speedIncrease;

    set({
      level: nextLevel,
      laneCount: Math.min(laneCount + 2, 9), // Expand lanes
      status: GameStatus.PLAYING, // Keep playing, user runs into shop
      speed: newSpeed,
      collectedLetters: [] // Reset letters
    });
  },

  openShop: () => set({ status: GameStatus.SHOP }),

  closeShop: () => set({ status: GameStatus.PLAYING }),

  buyItem: (type, cost) => {
    const { score, maxLives, lives } = get();

    if (score >= cost) {
      set({ score: score - cost });

      switch (type) {
        case 'DOUBLE_JUMP':
          set({ hasDoubleJump: true });
          break;
        case 'MAX_LIFE':
          set({ maxLives: maxLives + 1, lives: lives + 1 });
          break;
        case 'HEAL':
          set({ lives: Math.min(lives + 1, maxLives) });
          break;
        case 'IMMORTAL':
          set({ hasImmortality: true });
          break;
      }
      return true;
    }
    return false;
  },

  activateImmortality: () => {
    const { hasImmortality, isImmortalityActive } = get();
    if (hasImmortality && !isImmortalityActive) {
      set({ isImmortalityActive: true });

      // Lasts 5 seconds
      setTimeout(() => {
        set({ isImmortalityActive: false });
      }, 5000);
    }
  },

  setStatus: (status) => set({ status }),
}));
