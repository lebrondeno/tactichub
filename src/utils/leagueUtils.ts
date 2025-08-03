import { Match, PlayerStats } from '../types';

export function calculateLeagueTable(matches: Match[]): PlayerStats[] {
  const playerMap = new Map<string, PlayerStats>();

  matches.forEach(match => {
    const p1 = match.player1;
    const p2 = match.player2;

    if (!playerMap.has(p1)) {
      playerMap.set(p1, createEmptyStats(p1));
    }
    if (!playerMap.has(p2)) {
      playerMap.set(p2, createEmptyStats(p2));
    }

    const p1Stats = playerMap.get(p1)!;
    const p2Stats = playerMap.get(p2)!;

    p1Stats.matches++;
    p2Stats.matches++;

    p1Stats.goalsFor += match.score1;
    p1Stats.goalsAgainst += match.score2;

    p2Stats.goalsFor += match.score2;
    p2Stats.goalsAgainst += match.score1;

    if (match.result === 'win') {
      p1Stats.wins++;
      p2Stats.losses++;
      p1Stats.points += 3;
    } else if (match.result === 'loss') {
      p2Stats.wins++;
      p1Stats.losses++;
      p2Stats.points += 3;
    } else {
      p1Stats.draws++;
      p2Stats.draws++;
      p1Stats.points++;
      p2Stats.points++;
    }
  });

  return Array.from(playerMap.values()).map(player => ({
    ...player,
    goalDifference: player.goalsFor - player.goalsAgainst,
    winRate: player.matches > 0 ? (player.wins / player.matches) * 100 : 0,
    avgPossession: matches
      .filter(m => m.player1 === player.name || m.player2 === player.name)
      .reduce((acc, m) => acc + (m.player1 === player.name ? m.possession1 : m.possession2), 0) /
      (player.matches || 1)
  })).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

function createEmptyStats(name: string): PlayerStats {
  return {
    name,
    matches: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    winRate: 0,
    avgPossession: 0,
  };
}
