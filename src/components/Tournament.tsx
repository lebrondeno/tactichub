import React, { useState } from "react";

interface Team {
  id: number;
  name: string;
}

interface Match {
  round: number;
  player1: string;
  player2: string;
  winner?: string;
}

const Tournament: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");
  const [matches, setMatches] = useState<Match[][]>([]); // rounds of matches

  const handleAddTeam = () => {
    if (!teamName.trim()) return;
    setTeams([...teams, { id: teams.length + 1, name: teamName.trim() }]);
    setTeamName("");
  };

  const generateBracket = () => {
    if (teams.length < 2 || (teams.length & (teams.length - 1)) !== 0) {
      alert("Number of teams must be a power of 2 (e.g. 4, 8, 16)");
      return;
    }

    const firstRound: Match[] = [];
    for (let i = 0; i < teams.length; i += 2) {
      firstRound.push({
        round: 1,
        player1: teams[i].name,
        player2: teams[i + 1].name,
      });
    }

    setMatches([firstRound]);
  };

  const handleScoreInput = (roundIndex: number, matchIndex: number, winner: string) => {
    const updatedMatches = [...matches];
    updatedMatches[roundIndex][matchIndex].winner = winner;

    // If last match of round filled, generate next round
    if (updatedMatches[roundIndex].every((m) => m.winner)) {
      const nextRound = [];
      for (let i = 0; i < updatedMatches[roundIndex].length; i += 2) {
        nextRound.push({
          round: roundIndex + 2,
          player1: updatedMatches[roundIndex][i].winner!,
          player2: updatedMatches[roundIndex][i + 1].winner!,
        });
      }
      updatedMatches.push(nextRound);
    }

    setMatches(updatedMatches);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">🏆 Tournament Bracket</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Enter team/player name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <button onClick={handleAddTeam} className="bg-purple-600 text-white px-4 rounded">Add</button>
      </div>

      <div className="mb-4">
        <button onClick={generateBracket} className="bg-green-600 text-white px-6 py-2 rounded font-semibold">
          Generate Bracket
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-10">
          {matches.map((round, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-center mb-2">Round {i + 1}</h2>
              {round.map((match, j) => (
                <div key={j} className="mb-4 p-4 border rounded bg-white shadow w-48 text-center">
                  <div>{match.player1}</div>
                  <div className="my-2">vs</div>
                  <div>{match.player2}</div>
                  {!match.winner && (
                    <div className="mt-2">
                      <button
                        className="text-sm bg-blue-500 text-white px-2 py-1 rounded m-1"
                        onClick={() => handleScoreInput(i, j, match.player1)}
                      >
                        {match.player1} wins
                      </button>
                      <button
                        className="text-sm bg-blue-500 text-white px-2 py-1 rounded m-1"
                        onClick={() => handleScoreInput(i, j, match.player2)}
                      >
                        {match.player2} wins
                      </button>
                    </div>
                  )}
                  {match.winner && (
                    <div className="text-green-600 mt-2 font-semibold">✅ {match.winner}</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tournament;
