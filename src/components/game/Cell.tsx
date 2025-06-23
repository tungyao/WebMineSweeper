"use client";

import React from 'react';
import { Flag, HelpCircle } from "lucide-react";
import MineIcon from '@/components/icons/MineIcon';
import { cn } from "@/lib/utils";
import type { CellState } from "@/types";

interface CellProps {
  cell: CellState;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  isLost: boolean;
}

const numberColors = [
  "",
  "text-blue-600",
  "text-green-600",
  "text-red-600",
  "text-purple-800",
  "text-maroon-800",
  "text-teal-600",
  "text-black",
  "text-gray-500",
];

export function Cell({ cell, onClick, onContextMenu, isLost }: CellProps) {
  const renderContent = () => {
    if ((isLost || cell.isRevealed) && cell.isMine) {
      return <MineIcon className="w-5 h-5 text-destructive" />;
    }
    if (cell.isRevealed) {
      if (cell.adjacentMines > 0) {
        return <span className={cn("font-bold text-lg", numberColors[cell.adjacentMines])}>{cell.adjacentMines}</span>;
      }
      return null;
    }
    if (cell.isFlagged) {
      return <Flag className="w-5 h-5 text-accent" />;
    }
    if (cell.isQuestion) {
      return <HelpCircle className="w-5 h-5 text-primary" />;
    }
    return null;
  };

  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      disabled={cell.isRevealed}
      className={cn(
        "w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-sm transition-colors duration-150 font-mono",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:z-10",
        {
          "bg-muted border border-gray-300": cell.isRevealed && !cell.isMine,
          "bg-secondary hover:bg-muted shadow-sm": !cell.isRevealed,
          "bg-red-200 border-red-400": isLost && cell.isMine,
          "cursor-default": cell.isRevealed,
        }
      )}
      aria-label={`Cell at ${cell.x}, ${cell.y}`}
    >
      {renderContent()}
    </button>
  );
}
