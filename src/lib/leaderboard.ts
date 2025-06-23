import fs from 'fs/promises';
import path from 'path';
import type { Score, Difficulty } from '@/types';

type LeaderboardData = Record<Difficulty, Score[]>;

const leaderboardPath = path.resolve(process.cwd(), 'src/data/leaderboard.json');

async function readData(): Promise<LeaderboardData> {
  try {
    const data = await fs.readFile(leaderboardPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const defaultData: LeaderboardData = { 'Beginner': [], 'Intermediate': [], 'Expert': [] };
      await writeData(defaultData);
      return defaultData;
    }
    console.error('Failed to read leaderboard data:', error);
    throw new Error('Could not read leaderboard data.');
  }
}

async function writeData(data: LeaderboardData): Promise<void> {
  try {
    // ensure directory exists
    await fs.mkdir(path.dirname(leaderboardPath), { recursive: true });
    await fs.writeFile(leaderboardPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write leaderboard data:', error);
    throw new Error('Could not write leaderboard data.');
  }
}

export async function getScores(difficulty: Difficulty): Promise<Score[]> {
  const data = await readData();
  const scores = data[difficulty] || [];
  return scores.sort((a, b) => a.time - b.time);
}

export async function addScore(newScore: Score): Promise<{ score?: Score; error?: string }> {
  const data = await readData();
  const scores = data[newScore.difficulty] || [];

  const isDuplicate = scores.some(score => score.nickname.toLowerCase() === newScore.nickname.toLowerCase());
  if (isDuplicate) {
    return { error: `Nickname "${newScore.nickname}" already exists for ${newScore.difficulty} difficulty.` };
  }
  
  scores.push(newScore);
  data[newScore.difficulty] = scores.sort((a, b) => a.time - b.time);

  await writeData(data);
  return { score: newScore };
}
