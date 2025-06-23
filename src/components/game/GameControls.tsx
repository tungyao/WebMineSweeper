"use client";

import type { Difficulty } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Flag, Timer, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  time: number;
  flagsLeft: number;
}

const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Expert'];

export function GameControls({ difficulty, onDifficultyChange, onNewGame, time, flagsLeft }: GameControlsProps) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md mb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {difficulties.map(d => (
            <Button
              key={d}
              variant={difficulty === d ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onDifficultyChange(d)}
              className={cn(difficulty === d && "bg-primary text-primary-foreground")}
            >
              {d}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-lg font-mono font-semibold">
          <div className="flex items-center gap-2 text-red-600">
            <Flag className="w-5 h-5" />
            <span>{String(flagsLeft).padStart(3, '0')}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Timer className="w-5 h-5" />
            <span>{String(time).padStart(3, '0')}</span>
          </div>
        </div>
        <Button onClick={onNewGame} variant="outline" size="sm">
          <RotateCw className="mr-2 h-4 w-4" />
          New Game
        </Button>
      </div>
    </div>
  );
}
