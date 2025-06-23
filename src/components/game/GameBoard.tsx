"use client";

import type { CellState } from "@/types";
import { Cell } from "./Cell";

interface GameBoardProps {
  board: CellState[][];
  onCellClick: (x: number, y: number) => void;
  onCellContextMenu: (e: React.MouseEvent, x: number, y: number) => void;
  gameStatus: 'playing' | 'won' | 'lost' | 'ready';
}

export function GameBoard({ board, onCellClick, onCellContextMenu, gameStatus }: GameBoardProps) {
  if (board.length === 0) {
    return null;
  }
  
  const isLost = gameStatus === 'lost';

  return (
    <div className="bg-card p-2 sm:p-4 rounded-lg shadow-inner inline-block overflow-auto">
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              cell={cell}
              onClick={() => onCellClick(x, y)}
              onContextMenu={(e) => onCellContextMenu(e, x, y)}
              isLost={isLost}
            />
          ))
        )}
      </div>
    </div>
  );
}
