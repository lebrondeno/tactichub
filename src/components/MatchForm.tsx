import React from "react";
import type { Match } from "../types";

interface MatchFormProps {
  matchForm: Omit<Match, "id" | "date" | "result">;
  setMatchForm: (form: Omit<Match, "id" | "date" | "result">) => void;
  formations: string[];
  handleAddMatch: () => void;
}

const MatchForm: React.FC<MatchFormProps> = ({
  matchForm,
  setMatchForm,
  formations,
  handleAddMatch
}) => (
  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">⚽ Record New Match</h2>
    <div className="space-y-6">
      {/* Player Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player 1</label>
          <input
            type="text"
            value={matchForm.player1}
            onChange={(e) =>
              setMatchForm({ ...matchForm, player1: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter player name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player 2</label>
          <input
            type="text"
            value={matchForm.player2}
            onChange={(e) =>
              setMatchForm({ ...matchForm, player2: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter player name"
            required
          />
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player 1 Score</label>
          <input
            type="number"
            min="0"
            max="20"
            value={matchForm.score1}
            onChange={(e) =>
              setMatchForm({
                ...matchForm,
                score1: parseInt(e.target.value) || 0
              })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player 2 Score</label>
          <input
            type="number"
            min="0"
            max="20"
            value={matchForm.score2}
            onChange={(e) =>
              setMatchForm({
                ...matchForm,
                score2: parseInt(e.target.value) || 0
              })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Possession */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player 1 Possession (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={matchForm.possession1}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setMatchForm({
                ...matchForm,
                possession1: val,
                possession2: 100 - val
              });
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player 2 Possession (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={matchForm.possession2}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setMatchForm({
                ...matchForm,
                possession2: val,
                possession1: 100 - val
              });
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Formation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
        <select
          value={matchForm.formation}
          onChange={(e) =>
            setMatchForm({ ...matchForm, formation: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {formations.map((formation) => (
            <option key={formation} value={formation}>
              {formation}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleAddMatch}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
      >
        ⚽ Record Match
      </button>
    </div>
  </div>
);

export default MatchForm;
