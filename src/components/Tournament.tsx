import React, { useState } from 'react';

interface Match {
  id: number;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  possession1: number;
  possession2: number;
  formation: string;
  date: string;
  result: 'win' | 'loss' | 'draw';
  duration?: number;
  venue?: string;
  notes?: string;
}

interface TournamentMatch {
  id: number;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  round: string;
  winner: string | null;
  isPlayed: boolean;
}

interface TournamentProps {
  matches: Match[];
}

const Tournament: React.FC<TournamentProps> = ({ matches }) => {
  const [tournamentType, setTournamentType] = useState<'knockout' | 'group'>('knockout');
  const [players, setPlayers] = useState<string[]>([]);
  const [tournamentMatches, setTournamentMatches] = useState<TournamentMatch[]>([]);
  const [isTournamentStarted, setIsTournamentStarted] = useState(false);

  // Get unique players from matches
  React.useEffect(() => {
    const uniquePlayers = new Set<string>();
    matches.forEach(match => {
      uniquePlayers.add(match.player1);
      uniquePlayers.add(match.player2);
    });
    setPlayers(Array.from(uniquePlayers));
  }, [matches]);

  const generateKnockoutTournament = () => {
    if (players.length < 2) {
      alert('Need at least 2 players to start a tournament');
      return;
    }

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const matches: TournamentMatch[] = [];
    
    // Generate first round matches
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        matches.push({
          id: Date.now() + i,
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          score1: 0,
          score2: 0,
          round: 'Round 1',
          winner: null,
          isPlayed: false
        });
      } else {
        // Handle odd number of players with a bye
        matches.push({
          id: Date.now() + i,
          player1: shuffledPlayers[i],
          player2: 'BYE',
          score1: 3,
          score2: 0,
          round: 'Round 1',
          winner: shuffledPlayers[i],
          isPlayed: true
        });
      }
    }

    setTournamentMatches(matches);
    setIsTournamentStarted(true);
  };

  const generateGroupTournament = () => {
    if (players.length < 4) {
      alert('Need at least 4 players for a group tournament');
      return;
    }

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const matches: TournamentMatch[] = [];
    
    // Create groups (2 groups for simplicity)
    const groupSize = Math.ceil(shuffledPlayers.length / 2);
    const group1 = shuffledPlayers.slice(0, groupSize);
    const group2 = shuffledPlayers.slice(groupSize);

    // Generate group matches
    [group1, group2].forEach((group, groupIndex) => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          matches.push({
            id: Date.now() + matches.length,
            player1: group[i],
            player2: group[j],
            score1: 0,
            score2: 0,
            round: `Group ${groupIndex + 1}`,
            winner: null,
            isPlayed: false
          });
        }
      }
    });

    setTournamentMatches(matches);
    setIsTournamentStarted(true);
  };

  const updateMatchResult = (matchId: number, score1: number, score2: number) => {
    setTournamentMatches(prev => prev.map(match => {
      if (match.id === matchId) {
        const winner = score1 > score2 ? match.player1 : 
                     score2 > score1 ? match.player2 : null;
        return {
          ...match,
          score1,
          score2,
          winner,
          isPlayed: true
        };
      }
      return match;
    }));
  };

  const getTournamentProgress = () => {
    const totalMatches = tournamentMatches.length;
    const playedMatches = tournamentMatches.filter(m => m.isPlayed).length;
    return Math.round((playedMatches / totalMatches) * 100);
  };

  const getWinners = () => {
    const winners = new Set<string>();
    tournamentMatches.forEach(match => {
      if (match.isPlayed && match.winner && match.winner !== 'BYE') {
        winners.add(match.winner);
      }
    });
    return Array.from(winners);
  };

  const resetTournament = () => {
    setTournamentMatches([]);
    setIsTournamentStarted(false);
  };

  if (players.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px',
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        color: '#6c757d'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏆</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}>
          No players available
        </div>
        <div>
          Add matches to see available players for tournaments
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{ marginBottom: '25px', color: '#333', fontSize: '1.8rem' }}>
        🏆 Tournament Manager
      </h2>

      {!isTournamentStarted ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Available Players ({players.length})</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px'
            }}>
              {players.map((player, index) => (
                <div
                  key={player}
                  style={{
                    padding: '10px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#333'
                  }}
                >
                  {player}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#e3f2fd',
              borderRadius: '15px',
              border: '2px solid #2196f3'
            }}>
              <h4 style={{ marginBottom: '15px', color: '#333' }}>Knockout Tournament</h4>
              <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                Single elimination tournament. Players are randomly paired and winners advance.
              </p>
              <button
                onClick={generateKnockoutTournament}
                disabled={players.length < 2}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: players.length >= 2 ? 'pointer' : 'not-allowed',
                  opacity: players.length >= 2 ? 1 : 0.6
                }}
              >
                Start Knockout Tournament
              </button>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f3e5f5',
              borderRadius: '15px',
              border: '2px solid #9c27b0'
            }}>
              <h4 style={{ marginBottom: '15px', color: '#333' }}>Group Tournament</h4>
              <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                Group stage tournament. Players are divided into groups and play round-robin.
              </p>
              <button
                onClick={generateGroupTournament}
                disabled={players.length < 4}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#9c27b0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: players.length >= 4 ? 'pointer' : 'not-allowed',
                  opacity: players.length >= 4 ? 1 : 0.6
                }}
              >
                Start Group Tournament
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Tournament Progress */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h3 style={{ margin: '0', color: '#333' }}>Tournament Progress</h3>
              <button
                onClick={resetTournament}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reset Tournament
              </button>
            </div>
            
            <div style={{
              width: '100%',
              height: '20px',
              backgroundColor: '#e9ecef',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                width: `${getTournamentProgress()}%`,
                height: '100%',
                backgroundColor: '#28a745',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <div style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
              {getTournamentProgress()}% Complete
            </div>
          </div>

          {/* Tournament Matches */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Tournament Matches</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {tournamentMatches.map((match) => (
                <div
                  key={match.id}
                  style={{
                    padding: '20px',
                    backgroundColor: match.isPlayed ? '#d4edda' : '#f8f9fa',
                    borderRadius: '15px',
                    border: `2px solid ${match.isPlayed ? '#28a745' : '#e9ecef'}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      padding: '5px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {match.round}
                    </div>
                    {match.isPlayed && (
                      <div style={{
                        padding: '5px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        COMPLETED
                      </div>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                        {match.player1}
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                        {match.score1}
                      </div>
                    </div>

                    <div style={{
                      textAlign: 'center',
                      padding: '10px 15px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: '20px',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
                        vs
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                        {match.player2}
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                        {match.score2}
                      </div>
                    </div>
                  </div>

                  {!match.isPlayed && match.player2 !== 'BYE' && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      marginTop: '15px'
                    }}>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="Score 1"
                        value={match.score1}
                        onChange={(e) => updateMatchResult(match.id, parseInt(e.target.value) || 0, match.score2)}
                        style={{
                          padding: '8px 12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="Score 2"
                        value={match.score2}
                        onChange={(e) => updateMatchResult(match.id, match.score1, parseInt(e.target.value) || 0)}
                        style={{
                          padding: '8px 12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  )}

                  {match.isPlayed && match.winner && (
                    <div style={{
                      marginTop: '15px',
                      padding: '10px',
                      backgroundColor: '#fff3cd',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#856404'
                    }}>
                      🏆 Winner: {match.winner}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tournament Winners */}
          {getWinners().length > 0 && (
            <div style={{
              padding: '20px',
              backgroundColor: '#fff3cd',
              borderRadius: '15px',
              border: '2px solid #ffc107'
            }}>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>🏆 Tournament Winners</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px'
              }}>
                {getWinners().map((winner, index) => (
                  <div
                    key={winner}
                    style={{
                      padding: '15px',
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#333',
                      border: '2px solid #ffc107'
                    }}
                  >
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {winner}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tournament;