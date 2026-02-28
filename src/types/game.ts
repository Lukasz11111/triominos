export type Tile = [number, number, number];

export interface GameRules {
  tripleStartBonus: boolean;
  zeroStartBonus: boolean;
  bridgeBonus: number;
  hexagonBonus: number;
  doubleHexagonBonus: number;
  tripleHexagonBonus: number;
  drawPenalty: number;
  maxDraws: number;
  finalDrawPenalty: number;
  winBonus: number;
  winLimit: number;
}

export interface Player {
  id: string;
  name: string;
  currentPoints: number;
  totalPoints: number;
  hasPassed: boolean;
  isActive: boolean;
}

export interface GameState {
  rules: GameRules;
  players: Player[];
  currentPlayerIndex: number;
  roundNumber: number;
  drawCount: number;
  isRoundActive: boolean;
  showTileSelector: boolean;
  showVictoryInputs: boolean;
  showRoundSummary: boolean;
}

