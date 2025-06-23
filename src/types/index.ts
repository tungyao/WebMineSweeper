export interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  adjacentMines: number;
  x: number;
  y: number;
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

export type GameStatus = 'playing' | 'won' | 'lost' | 'ready';

export interface Score {
  nickname: string;
  time: number;
  difficulty: Difficulty;
}

export const DIFFICULTIES: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
  'Beginner': { rows: 9, cols: 9, mines: 10 },
  'Intermediate': { rows: 16, cols: 16, mines: 40 },
  'Expert': { rows: 30, cols: 16, mines: 99 },
};
