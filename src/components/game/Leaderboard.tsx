"use client";

import type { Score } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface LeaderboardProps {
  scores: Score[];
}

export function Leaderboard({ scores }: LeaderboardProps) {
  const sortedScores = [...scores].sort((a, b) => a.time - b.time);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-accent" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedScores.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Nickname</TableHead>
                <TableHead className="text-right">Time (s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedScores.map((score, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{score.nickname}</TableCell>
                  <TableCell className="text-right">{score.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No scores yet. Be the first to win!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
