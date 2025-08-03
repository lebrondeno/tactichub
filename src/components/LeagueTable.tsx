import React from "react";
import type { PlayerStats } from "../types";

interface LeagueTableProps {
  leagueTable: PlayerStats[];
}

const LeagueTable: React.FC<LeagueTableProps> = ({ leagueTable }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🏆 League Table</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">MP</th>
              <th className="px-4 py-3">W</th>
              <th className="px-4 py-3">D</th>
              <th className="px-4 py-3">L</th>
              <th className="px-4 py-3">GF</th>
              <th className="px-4 py-3">GA</th>
              <th className="px-4 py-3">GD</th>
              <th className="px-4 py-3">Pts</th>
              <th className="px-4 py-3">Win %</th>
              <th className="px-4 py-3">Poss %</th>
            </tr>
          </thead>
          <tbody>
            {leagueTable.map((player, index) => (
              <tr
                key={player.name}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}
              >
                <td className="px-4 py-2 font-bold text-gray-600">{index + 1}</td>
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2">{player.matches}</td>
                <td className="px-4 py-2">{player.wins}</td>
                <td className="px-4 py-2">{player.draws}</td>
                <td className="px-4 py-2">{player.losses}</td>
                <td className="px-4 py-2">{player.goalsFor}</td>
                <td className="px-4 py-2">{player.goalsAgainst}</td>
                <td className="px-4 py-2">{player.goalDifference}</td>
                <td className="px-4 py-2 font-semibold text-blue-700">{player.points}</td>
                <td className="px-4 py-2">{player.winRate.toFixed(1)}%</td>
                <td className="px-4 py-2">{player.avgPossession.toFixed(1)}%</td>
              </tr>
            ))}
            {leagueTable.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center py-4 text-gray-400">
                  No players in the league table yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeagueTable;
