/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum GameMode {
  MISSION = 'MISSION',
  ENDLESS = 'ENDLESS'
}

export enum ObjectType {
  OBSTACLE = 'OBSTACLE',
  GEM = 'GEM',
  LETTER = 'LETTER',
  SHOP_PORTAL = 'SHOP_PORTAL',
  ALIEN = 'ALIEN',
  MISSILE = 'MISSILE',
  BUILDING = 'BUILDING',
  HOUSE = 'HOUSE'
}

export interface GameObject {
  id: string;
  type: ObjectType;
  position: [number, number, number]; // x, y, z
  active: boolean;
  value?: string; // For letters (G, E, M...)
  color?: string;
  targetIndex?: number; // Index in the GEMINI target word
  points?: number; // Score value for gems
  hasFired?: boolean; // For Aliens
  rotation?: [number, number, number]; // Custom rotation
  scale?: [number, number, number]; // Custom scale
}

export const LANE_WIDTH = 2.2;
export const JUMP_HEIGHT = 2.5;
export const JUMP_DURATION = 0.6; // seconds
export const RUN_SPEED_BASE = 22.5;
export const SPAWN_DISTANCE = 120;
export const REMOVE_DISTANCE = 20; // Behind player

// Eco-friendly colors: Various shades of Green
export const GEMINI_COLORS = [
  '#00e676', // Bright Green
  '#1b5e20', // Forest Green
  '#4ade80', // Emerald Green
  '#86efac', // Light Green
  '#22c55e', // Success Green
  '#166534', // Dark Green
  '#4ade80', // Emerald
  '#00e676', // Repeat colors for length
  '#1b5e20',
  '#86efac',
  '#22c55e',
  '#166534',
];

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: any; // Lucide icon component
  oneTime?: boolean; // If true, remove from pool after buying
}
