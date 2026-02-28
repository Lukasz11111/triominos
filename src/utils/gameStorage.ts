import type { GameState } from '../types/game';

const STORAGE_KEY = 'triominos-game-state';

export function saveGameState(gameState: GameState | null): void {
  if (gameState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as GameState;
    }
  } catch (error) {
    console.error('Error loading game state:', error);
  }
  return null;
}

