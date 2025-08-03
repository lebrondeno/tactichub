import React from "react";
import type { Match, PlayerStats } from "../types";

interface DashboardProps {
  matches: Match[];
  leagueTable: PlayerStats[];
}

const Dashboard: React.FC<DashboardProps> = ({ matches, leagueTable }) => {
  const topPlayers = [...leagueTable]
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference)
    .slice(0, 3);

  const latestMatches = matches.slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">📊 TacticHub Dashboard</h1>

      {/* Top Players */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🏅 Top Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPlayers.map((player, index) => (
            <div
              key={player.name}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-blue-700">{index + 1}. {player.name}</h3>
              <p>Points: {player.points}</p>
              <p>Wins: {player.wins}</p>
              <p>Win Rate: {player.winRate.toFixed(1)}%</p>
              <p>Goal Diff: {player.goalDifference}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Matches */}
      <section>
        <h2 className="text-xl font-semibold mb-2">🕒 Recent Matches</h2>
        <div className="bg-white shadow-md rounded-md overflow-x-auto">
          <table className="w-full table-auto text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2">Match</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Formation</th>
                <th className="px-4 py-2">Possession</th>
              </tr>
            </thead>
            <tbody>
              {latestMatches.map((match) => (
                <tr key={match.id} className="border-t">
                  <td className="px-4 py-2">{match.date}</td>
                  <td className="px-4 py-2">{match.player1} vs {match.player2}</td>
                  <td className="px-4 py-2">{match.score1} - {match.score2}</td>
                  <td className="px-4 py-2">{match.formation}</td>
                  <td className="px-4 py-2">
                    {match.possession1}% - {match.possession2}%
                  </td>
                </tr>
              ))}
              {latestMatches.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-center text-gray-400" colSpan={5}>
                    No matches recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
