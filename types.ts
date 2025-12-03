/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import 'react';
import { ThreeElements } from '@react-three/fiber';

// Augment the global JSX namespace to include Three.js elements
// This ensures TypeScript recognizes <mesh>, <group>, etc.
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum ObjectType {
  OBSTACLE = 'OBSTACLE',
  GEM = 'GEM',
  LETTER = 'LETTER',
  SHOP_PORTAL = 'SHOP_PORTAL',
  ALIEN = 'ALIEN',
  MISSILE = 'MISSILE'
}

export interface GameObject {
  id: string;
  type: ObjectType;
  position: [number, number, number]; // x, y, z
  active: boolean;
  value?: string; // For letters
  color?: string;
  targetIndex?: number; // Index in the target word
  points?: number; // Score value
  hasFired?: boolean; // For Aliens
}

export const LANE_WIDTH = 2.2;
export const JUMP_HEIGHT = 2.5;
export const JUMP_DURATION = 0.6; // seconds
export const RUN_SPEED_BASE = 22.5;
export const SPAWN_DISTANCE = 120;
export const REMOVE_DISTANCE = 20; // Behind player

// Expanded Desert Sci-Fi Palette
export const COLORS = {
    background: '#200b01', // Deep Coffee
    text: '#e7cbc5',       // Rose Gold/Cream
    structure: '#553e36',  // Mocha
    gold: '#e9c46a',       // Sand Gold
    teal: '#2a9d8f',       // Muted Teal
    danger: '#e76f51',     // Terracotta
    accent: '#f4a261',     // Burnt Orange
    violet: '#c77dff',     // Bright Violet
    plasma: '#e63946'      // Intense Plasma Red
};

export const THEME_COLORS = [
    COLORS.teal,    // G
    COLORS.gold,    // E
    COLORS.plasma,  // N
    COLORS.violet,  // S
    COLORS.accent,  // Y
    COLORS.danger,  // N
];

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: any; // Lucide icon component
    oneTime?: boolean; // If true, remove from pool after buying
    color?: string;
}