# Minesweeper API Documentation

This document outlines the standardized API for interacting with the game's backend services, implemented using Genkit flows.

## Base URL

All API calls are made through server actions, so there is no base URL to configure on the client.

## Authentication

There is no authentication required for the current API endpoints.

## Endpoints

### 1. Get Leaderboard Scores

Retrieves the top scores for a given difficulty.

- **Flow:** `getLeaderboard(input: GetLeaderboardInput): Promise<GetLeaderboardOutput>`
- **Method:** `POST` (via Server Action)

**Input (`GetLeaderboardInput`)**

| Field      | Type                                     | Description                    |
| ---------- | ---------------------------------------- | ------------------------------ |
| `difficulty` | `'Beginner' \| 'Intermediate' \| 'Expert'` | The difficulty level to fetch scores for. |

**Output (`GetLeaderboardOutput`)**

An array of score objects.

| Field      | Type                                     | Description                          |
| ---------- | ---------------------------------------- | ------------------------------------ |
| `nickname`   | `string`                                 | The player's nickname.               |
| `time`       | `number`                                 | The player's time in seconds.        |
| `difficulty` | `'Beginner' \| 'Intermediate' \| 'Expert'` | The difficulty level of the score.   |

**Example Usage (Client-side)**

```typescript
import { getLeaderboard } from '@/ai/flows/leaderboardFlow';
import type { Difficulty } from '@/types';

async function fetchScores(difficulty: Difficulty) {
  const scores = await getLeaderboard({ difficulty });
  console.log(scores);
}
```

### 2. Add a Score to the Leaderboard

Adds a new score to the leaderboard.

- **Flow:** `addLeaderboardScore(input: AddLeaderboardScoreInput): Promise<AddLeaderboardScoreOutput>`
- **Method:** `POST` (via Server Action)

**Input (`AddLeaderboardScoreInput`)**

| Field      | Type                                     | Description                          |
| ---------- | ---------------------------------------- | ------------------------------------ |
| `nickname`   | `string`                                 | The player's nickname.               |
| `time`       | `number`                                 | The player's time in seconds.        |
| `difficulty` | `'Beginner' \| 'Intermediate' \| 'Expert'` | The difficulty level of the score.   |

**Output (`AddLeaderboardScoreOutput`)**

The newly created score object, or an error object if the nickname is already taken for that difficulty.

| Field      | Type                                     | Description                          |
| ---------- | ---------------------------------------- | ------------------------------------ |
| `score`    | `Score` (optional)                       | The newly created score object.      |
| `error`      | `string` (optional)                    | An error message if one occurred.    |

**Example Usage (Client-side)**

```typescript
import { addLeaderboardScore } from '@/ai/flows/leaderboardFlow';
import type { Score } from '@/types';

async function saveScore(score: Score) {
  const result = await addLeaderboardScore(score);
  if (result.error) {
    console.error(result.error);
  } else {
    console.log("Score saved:", result.score);
  }
}
```
