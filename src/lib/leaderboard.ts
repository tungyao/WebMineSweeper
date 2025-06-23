import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs/promises';
import type { Score, Difficulty } from '@/types';

// The path to the SQLite database file.
const dbPath = path.resolve(process.cwd(), 'src/data/leaderboard.db');
const schemaPath = path.resolve(process.cwd(), 'src/data/schema.sql');

// A singleton promise for the database connection.
let dbPromise: Promise<Awaited<ReturnType<typeof open>>> | null = null;

/**
 * Gets the database connection, initializing it if necessary.
 * This includes creating the database file and running the schema setup.
 * @returns A promise that resolves to the database connection object.
 */
function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        // Ensure the directory for the database exists.
        await fs.mkdir(path.dirname(dbPath), { recursive: true });

        const db = await open({
          filename: dbPath,
          driver: sqlite3.Database,
        });

        const schema = await fs.readFile(schemaPath, 'utf-8');
        await db.exec(schema);
        console.log('Database initialized successfully.');
        return db;
      } catch (error) {
        console.error('Failed to initialize database:', error);
        // If initialization fails, reset the promise to allow for retries.
        dbPromise = null; 
        throw new Error('Could not initialize the database.');
      }
    })();
  }
  return dbPromise;
}

/**
 * Retrieves the top scores for a given difficulty from the database.
 * @param difficulty The difficulty level to fetch scores for.
 * @returns A promise that resolves to an array of scores, sorted by time.
 */
export async function getScores(difficulty: Difficulty): Promise<Score[]> {
  try {
    const db = await getDb();
    const scores = await db.all<Score[]>(
      'SELECT nickname, time, difficulty FROM scores WHERE difficulty = ? ORDER BY time ASC',
      difficulty
    );
    return scores;
  } catch (error) {
    console.error(`Failed to get scores for ${difficulty}:`, error);
    // Return an empty array on failure to prevent crashing the app.
    return [];
  }
}

/**
 * Adds a new score to the leaderboard in the database.
 * @param newScore The score object to add.
 * @returns A promise that resolves to an object containing either the new score or an error message.
 */
export async function addScore(newScore: Score): Promise<{ score?: Score; error?: string }> {
  try {
    const db = await getDb();
    // The UNIQUE constraint on (nickname, difficulty) will handle duplicate entries.
    await db.run(
      'INSERT INTO scores (nickname, time, difficulty) VALUES (?, ?, ?)',
      newScore.nickname,
      newScore.time,
      newScore.difficulty
    );
    return { score: newScore };
  } catch (error) {
    // The `sqlite` library uses an error object with a `code` property.
    // 'SQLITE_CONSTRAINT' is the code for a unique constraint violation.
    if ((error as any)?.code === 'SQLITE_CONSTRAINT') {
      return { error: `Nickname "${newScore.nickname}" already exists for ${newScore.difficulty} difficulty.` };
    }
    console.error('Failed to add score:', error);
    return { error: 'An unexpected error occurred while saving the score.' };
  }
}
