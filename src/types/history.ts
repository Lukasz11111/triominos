export interface HistoryEntry {
  id: string;
  playerId: string;
  roundNumber: number;
  timestamp: number;
  type: 'add' | 'subtract' | 'manual_edit' | 'victory' | 'round_end' | 'penalty';
  points: number;
  description: string;
  previousTotal: number;
  newTotal: number;
}

