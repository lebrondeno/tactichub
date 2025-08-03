import React, { useState } from "react";
import type { Match, PlayerStats } from "../types";

interface MatchesProps {
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  leagueTable: PlayerStats[];
  setLeagueTable: (table: PlayerStats[]) => void;
}

const Matches: React.FC<MatchesProps> = ({
  matches,
  setMatches,
  leagueTable,
  setLeagueTable,
}) => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [possession1, setPossession1] = useState("");
  const [possession2, setPossession2] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    const p1 = parseFloat(possession1);
    const p2 = parseFloat(possession2);

    if (!player1 || !player2 || isNaN(s1) || isNaN(s2)) {
      alert("Please enter valid player names and scores.");
      return;
    }

    const newMatch: Match = {
      player1,
      player2,
      score1: s1,
      score2: s2,
      possession1: p1 || 0,
      possession2: p2 || 0,
      date: new Date().toISOString(),
      screenshot: screenshot || undefined,
    };

    setMatches([newMatch, ...matches]);

    // [Same logic as before for updating league table]
    // ...

    setPlayer1("");
    setPlayer2("");
    setScore1("");
    setScore2("");
    setPossession1("");
    setPossession2("");
    setScreenshot(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">📝 Add Match</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
        <input className="border p-2" placeholder="Player 1" value={player1} onChange={(e) => setPlayer1(e.target.value)} />
        <input className="border p-2" placeholder="Player 2" value={player2} onChange={(e) => setPlayer2(e.target.value)} />
        <input className="border p-2" type="number" placeholder="Score 1" value={score1} onChange={(e) => setScore1(e.target.value)} />
        <input className="border p-2" type="number" placeholder="Score 2" value={score2} onChange={(e) => setScore2(e.target.value)} />
        <input className="border p-2" type="number" placeholder="Possession 1 (%)" value={possession1} onChange={(e) => setPossession1(e.target.value)} />
        <input className="border p-2" type="number" placeholder="Possession 2 (%)" value={possession2} onChange={(e) => setPossession2(e.target.value)} />
        
        <input
          className="col-span-2 border p-2"
          type="file"
          accept="image/*"
          onChange={handleScreenshotChange}
        />
        {screenshot && (
          <img src={screenshot} alt="Screenshot preview" className="col-span-2 max-h-48 object-contain border rounded" />
        )}
        <button
          type="submit"
          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Submit Match
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2 text-gray-700">Recent Matches</h2>
      <ul className="space-y-4">
        {matches.length === 0 && <li className="text-gray-400">No matches recorded yet.</li>}
        {matches.map((match, index) => (
          <li key={index} className="bg-white shadow px-4 py-2 rounded border">
            <div>
              <span className="font-bold">{match.player1}</span> {match.score1} - {match.score2}{" "}
              <span className="font-bold">{match.player2}</span>{" "}
              <span className="text-sm text-gray-500">({new Date(match.date).toLocaleString()})</span>
            </div>
            {match.screenshot && (
              <img src={match.screenshot} alt="Match Screenshot" className="mt-2 max-h-40 border rounded" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Matches;
