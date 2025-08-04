// src/components/PlayerStats.tsx
// React import removed as it's not used in this component

interface Player {
  name: string;
  team: string;
  goals: number;
  assists: number;
  appearances: number;
}

const players: Player[] = [
  { name: 'Player X', team: 'Team A', goals: 10, assists: 5, appearances: 5 },
  { name: 'Player Y', team: 'Team B', goals: 7, assists: 3, appearances: 5 },
  { name: 'Player Z', team: 'Team C', goals: 5, assists: 4, appearances: 5 },
];

const PlayerStats = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Player Stats</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Player</th>
              <th className="border px-4 py-2">Team</th>
              <th className="border px-4 py-2">Goals</th>
              <th className="border px-4 py-2">Assists</th>
              <th className="border px-4 py-2">Appearances</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{player.name}</td>
                <td className="border px-4 py-2">{player.team}</td>
                <td className="border px-4 py-2">{player.goals}</td>
                <td className="border px-4 py-2">{player.assists}</td>
                <td className="border px-4 py-2">{player.appearances}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStats;