// src/components/Matches.tsx
import React, { useState } from 'react';

interface Match {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  date: string;
}

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState<Match>({
    teamA: '',
    teamB: '',
    scoreA: 0,
    scoreB: 0,
    date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name.includes("score") ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMatches([...matches, form]);
    setForm({ teamA: '', teamB: '', scoreA: 0, scoreB: 0, date: '' });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Match Records</h2>
      <form onSubmit={handleSubmit} className="mb-6 grid gap-4 grid-cols-2 md:grid-cols-3">
        <input type="text" name="teamA" value={form.teamA} onChange={handleChange} placeholder="Team A" required className="border p-2 rounded" />
        <input type="number" name="scoreA" value={form.scoreA} onChange={handleChange} placeholder="Score A" required className="border p-2 rounded" />
        <input type="text" name="teamB" value={form.teamB} onChange={handleChange} placeholder="Team B" required className="border p-2 rounded" />
        <input type="number" name="scoreB" value={form.scoreB} onChange={handleChange} placeholder="Score B" required className="border p-2 rounded" />
        <input type="date" name="date" value={form.date} onChange={handleChange} required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Add Match</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Team A</th>
              <th className="border px-4 py-2">Score</th>
              <th className="border px-4 py-2">Team B</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{match.date}</td>
                <td className="border px-4 py-2">{match.teamA}</td>
                <td className="border px-4 py-2">{match.scoreA} - {match.scoreB}</td>
                <td className="border px-4 py-2">{match.teamB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Matches;
