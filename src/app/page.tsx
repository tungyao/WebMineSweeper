import MinesweeperGame from '@/components/game/MinesweeperGame';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 bg-background text-foreground min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Web Minesweeper</h1>
        <p className="text-muted-foreground mt-2">Clear the field without hitting a mine. Good luck!</p>
      </div>
      <MinesweeperGame />
    </main>
  );
}
