# **App Name**: WebMineSweeper

## Core Features:

- Difficulty Selection: Configurable difficulty levels (Beginner, Intermediate, Expert) with corresponding mine counts and grid sizes.
- Minefield UI: Interactive minefield display using HTML/CSS, showing revealed cells, flags, and question marks.
- Game Logic: Core game logic: random mine placement, neighbor cell counting, cell reveal, win/loss condition checks.
- Nickname Input: Modal popup after a successful game, prompting the user to enter their nickname.
- Nickname Validation: Basic server-side nickname validation (uniqueness) before saving the score. SQLite database implementation will be ommitted for the MVP
- Leaderboard Display: Real-time leaderboard display on the left side, showing the fastest completion times.

## Style Guidelines:

- Primary color: Soft blue (#A8D0E6) to represent clarity and focus.
- Background color: Light gray (#F0F0F0) for a clean, neutral interface.
- Accent color: Muted orange (#F77F00) for interactive elements and highlights.
- Body and headline font: 'Inter' (sans-serif) for readability and a modern feel.
- Simple, geometric icons for mines, flags, and numbers. SVG icons preferred for scalability.
- Left sidebar for leaderboard; main area for the minefield.
- Subtle animations on cell reveal and game over events for visual feedback.