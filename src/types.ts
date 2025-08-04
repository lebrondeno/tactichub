// types.ts - Shared type definitions for TacticHub
export interface Match {
  id: number;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  possession1: number;
  possession2: number;
  formation: string;
  date: string;
  result: 'win' | 'loss' | 'draw';
}

export interface Team {
  id: number;
  name: string;
}

export interface Player {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
  winRate: number;
}
