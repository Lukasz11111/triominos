import type { GameRules } from '../types/game';

export const defaultRules: GameRules = {
  tripleStartBonus: false,
  zeroStartBonus: false,
  bridgeBonus: 40,
  hexagonBonus: 50,
  doubleHexagonBonus: 60,
  tripleHexagonBonus: 70,
  drawPenalty: 5,
  maxDraws: 3,
  finalDrawPenalty: 10,
  winBonus: 25,
  winLimit: 400,
};

