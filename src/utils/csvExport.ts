// utils/csvExport.ts
// utils/csvExport.ts
import type { Match } from '../types';

export const exportToCSV = (matches: Match[]): void => {
  if (matches.length === 0) {
    alert('No matches to export!');
    return;
  }

  const headers = [
    'Date',
    'Player1', 
    'Player2',
    'Score1',
    'Score2', 
    'Possession1',
    'Possession2',
    'Formation',
    'Result'
  ];

  const csvContent = [
    headers.join(','),
    ...matches.map(match => [
      `"${match.date}"`,
      `"${match.player1}"`,
      `"${match.player2}"`,
      match.score1,
      match.score2,
      match.possession1,
      match.possession2,
      `"${match.formation}"`,
      `"${match.result}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `tactichub_matches_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const calculateStats = (matches: Match[]) => {
  const stats = {
    total: matches.length,
    wins: matches.filter(m => m.result === 'win').length,
    losses: matches.filter(m => m.result === 'loss').length,
    draws: matches.filter(m => m.result === 'draw').length,
  };

  const winRate = matches.length > 0 ? ((stats.wins / matches.length) * 100).toFixed(1) : '0';
  
  return { stats, winRate };
};

export const createMatch = (
  player1: string,
  player2: string,
  score1: number,
  score2: number,
  possession1: number,
  possession2: number,
  formation: string
): Match => {
  return {
    id: Date.now(),
    player1,
    player2,
    score1,
    score2,
    possession1,
    possession2,
    formation,
    date: new Date().toLocaleDateString(),
    result: score1 > score2 ? 'win' : score1 < score2 ? 'loss' : 'draw'
  };
};