'use server';
/**
 * @fileOverview Leaderboard API flows.
 *
 * - getLeaderboard: A function to retrieve scores for a difficulty.
 * - addLeaderboardScore: A function to add a new score.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getScores, addScore } from '@/lib/leaderboard';

const ScoreSchema = z.object({
  nickname: z.string(),
  time: z.number(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Expert']),
});

const GetLeaderboardInputSchema = z.object({
  difficulty: z.enum(['Beginner', 'Intermediate', 'Expert']),
});
export type GetLeaderboardInput = z.infer<typeof GetLeaderboardInputSchema>;

const GetLeaderboardOutputSchema = z.array(ScoreSchema);
export type GetLeaderboardOutput = z.infer<typeof GetLeaderboardOutputSchema>;

const AddLeaderboardScoreInputSchema = ScoreSchema;
export type AddLeaderboardScoreInput = z.infer<typeof AddLeaderboardScoreInputSchema>;

const AddLeaderboardScoreOutputSchema = z.object({
  score: ScoreSchema.optional(),
  error: z.string().optional(),
});
export type AddLeaderboardScoreOutput = z.infer<typeof AddLeaderboardScoreOutputSchema>;

export async function getLeaderboard(input: GetLeaderboardInput): Promise<GetLeaderboardOutput> {
  return getLeaderboardFlow(input);
}

export async function addLeaderboardScore(input: AddLeaderboardScoreInput): Promise<AddLeaderboardScoreOutput> {
  return addLeaderboardScoreFlow(input);
}

const getLeaderboardFlow = ai.defineFlow(
  {
    name: 'getLeaderboardFlow',
    inputSchema: GetLeaderboardInputSchema,
    outputSchema: GetLeaderboardOutputSchema,
  },
  async (input) => {
    return await getScores(input.difficulty);
  }
);

const addLeaderboardScoreFlow = ai.defineFlow(
  {
    name: 'addLeaderboardScoreFlow',
    inputSchema: AddLeaderboardScoreInputSchema,
    outputSchema: AddLeaderboardScoreOutputSchema,
  },
  async (input) => {
    return await addScore(input);
  }
);
