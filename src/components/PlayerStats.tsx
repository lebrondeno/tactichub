import React from "react";
import type { PlayerStats } from "../types";

interface PlayerStatsProps {
  leagueTable: PlayerStats[];
}

const PlayerStatsComponent: React.FC<PlayerStatsProps> = ({ leagueTable }) => {
  const downloadCSV = () => {
    const header = [
      "Player",
      "Matches",
      "Wins",
      "Draws",
      "Losses",
      "Goals For",
      "Goals Against",
      "Goal Difference",
      "Win Rate (%)",
      "Avg. Possession (%)",
    ];

    const rows = leagueTable.map((p) => [
      p.name,
      p.matches,
      p.wins,
      p.draws,
      p.losses,
      p.goalsFor,
      p.goalsAgainst,
      p.goalDifference,
      p.winRate.toFixed(2),
      p.avgPossession.toFixed(1),
    ]);

    const csvContent = [header, ...rows]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "player_stats.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">📈 Player Stats</h1>
        <button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Matches</th>
              <th className="px-4 py-3">Wins</th>
              <th className="px-4 py-3">Draws</th>
              <th className="px-4 py-3">Losses</th>
              <th className="px-4 py-3">Goals For</th>
              <th className="px-4 py-3">Goals Against</th>
              <th className="px-4 py-3">Goal Diff</th>
              <th className="px-4 py-3">Win Rate</th>
              <th className="px-4 py-3">Avg. Possession</th>
            </tr>
          </thead>
          <tbody>
            {leagueTable.map((player) => (
              <tr key={player.name} className="border-t">
                <td className="px-4 py-2 font-medium text-blue-700">{player.name}</td>
                <td className="px-4 py-2">{player.matches}</td>
                <td className="px-4 py-2">{player.wins}</td>
                <td className="px-4 py-2">{player.draws}</td>
                <td className="px-4 py-2">{player.losses}</td>
                <td className="px-4 py-2">{player.goalsFor}</td>
                <td className="px-4 py-2">{player.goalsAgainst}</td>
                <td className="px-4 py-2">{player.goalDifference}</td>
                <td className="px-4 py-2">{player.winRate.toFixed(1)}%</td>
                <td className="px-4 py-2">{player.avgPossession.toFixed(1)}%</td>
              </tr>
            ))}
            {leagueTable.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-400">
                  No player stats available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStatsComponent;
