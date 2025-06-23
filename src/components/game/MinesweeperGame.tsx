"use client";

import { useState, useEffect, useCallback } from "react";
import type { CellState, Difficulty, GameStatus, Score } from "@/types";
import { DIFFICULTIES } from "@/types";
import { createBoard, revealCellRecursive } from "@/lib/game";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";
import { Leaderboard } from "./Leaderboard";
import { WinDialog } from "./WinDialog";
import { useToast } from "@/hooks/use-toast";

export default function MinesweeperGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [board, setBoard] = useState<CellState[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [time, setTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [allScores, setAllScores] = useState<Score[]>([]);
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getGameSettings = () => DIFFICULTIES[difficulty];

  const startNewGame = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setBoard(createBoard(newDifficulty));
    setGameStatus('ready');
    setTime(0);
    setFirstClick(true);
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filter scores for the current difficulty
    setLeaderboard(allScores.filter(score => score.difficulty === difficulty));
  }, [allScores, difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStatus === 'playing') {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const revealedCount = board.flat().filter(cell => cell.isRevealed).length;
    const mineCount = getGameSettings().mines;
    const totalCells = getGameSettings().rows * getGameSettings().cols;

    if (revealedCount === totalCells - mineCount) {
      setGameStatus('won');
    }
  }, [board, gameStatus, getGameSettings]);

  const handleCellClick = (x: number, y: number) => {
    if (gameStatus !== 'playing' && gameStatus !== 'ready') return;
    
    let currentBoard = board;

    if (firstClick) {
      currentBoard = createBoard(difficulty, { x, y });
      setFirstClick(false);
      setGameStatus('playing');
    }

    const cell = currentBoard[y][x];
    if (cell.isRevealed || cell.isFlagged) return;

    if (cell.isMine) {
      setGameStatus('lost');
      const revealedBoard = currentBoard.map(row => row.map(c => ({...c, isRevealed: true})));
      setBoard(revealedBoard);
      return;
    }

    const newBoard = revealCellRecursive(currentBoard, x, y);
    setBoard(newBoard);
  };

  const handleCellContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameStatus !== 'playing' && gameStatus !== 'ready') return;

    if(gameStatus === 'ready'){
      setGameStatus('playing');
    }

    const newBoard = board.map(row => [...row]);
    const cell = newBoard[y][x];

    if (cell.isRevealed) return;

    if (!cell.isFlagged && !cell.isQuestion) {
      cell.isFlagged = true;
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      cell.isQuestion = true;
    } else {
      cell.isQuestion = false;
    }

    setBoard(newBoard);
  };
  
  const handleSaveScore = (nickname: string) => {
    setIsSubmitting(true);
    const newScore: Score = { nickname, time, difficulty };
    
    setAllScores(prevScores => [...prevScores, newScore]);

    toast({
        title: "Score Saved!",
        description: "Your score has been added to the leaderboard for this session.",
    });

    startNewGame(difficulty);
    setIsSubmitting(false);
  };

  const flagsUsed = board.flat().filter(c => c.isFlagged).length;
  const flagsLeft = getGameSettings().mines - flagsUsed;

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      <aside className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0">
        <Leaderboard scores={leaderboard} />
      </aside>
      <div className="flex-1 flex flex-col items-center">
        <GameControls
          difficulty={difficulty}
          onDifficultyChange={startNewGame}
          onNewGame={() => startNewGame(difficulty)}
          time={time}
          flagsLeft={flagsLeft}
        />
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          onCellContextMenu={handleCellContextMenu}
          gameStatus={gameStatus}
        />
      </div>
      <WinDialog
        open={gameStatus === 'won'}
        onOpenChange={(isOpen) => {
          if (!isOpen && gameStatus === 'won') {
            startNewGame(difficulty);
          }
        }}
        time={time}
        onSubmit={handleSaveScore}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
