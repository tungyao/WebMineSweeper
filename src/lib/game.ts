import type { CellState, Difficulty } from '@/types';
import { DIFFICULTIES } from '@/types';

export const createBoard = (difficulty: Difficulty, safeCell?: { x: number, y: number }): CellState[][] => {
  const { rows, cols, mines } = DIFFICULTIES[difficulty];
  
  const board: CellState[][] = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => ({
      x,
      y,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      isQuestion: false,
      adjacentMines: 0,
    }))
  );

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const y = Math.floor(Math.random() * rows);
    const x = Math.floor(Math.random() * cols);

    if (!board[y][x].isMine && !(safeCell && safeCell.x === x && safeCell.y === y)) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mines
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x].isMine) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && board[ny][nx].isMine) {
            count++;
          }
        }
      }
      board[y][x].adjacentMines = count;
    }
  }

  return board;
};

export const revealCellRecursive = (board: CellState[][], x: number, y: number): CellState[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const { rows, cols } = { rows: newBoard.length, cols: newBoard[0].length };
  
  const stack: [number, number][] = [[x, y]];

  while (stack.length > 0) {
    const [curX, curY] = stack.pop()!;
    
    if (curY < 0 || curY >= rows || curX < 0 || curX >= cols) continue;

    const cell = newBoard[curY][curX];

    if (cell.isRevealed || cell.isFlagged) continue;

    cell.isRevealed = true;

    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          stack.push([curX + dx, curY + dy]);
        }
      }
    }
  }
  
  return newBoard;
};
