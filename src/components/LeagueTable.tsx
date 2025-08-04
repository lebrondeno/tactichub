import React from 'react';

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

interface LeagueEntry {
  player: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface LeagueTableProps {
  matches: Match[];
}

const LeagueTable: React.FC<LeagueTableProps> = ({ matches }) => {
  // Calculate league table from matches
  const leagueTable = React.useMemo(() => {
    const playerStats = new Map<string, LeagueEntry>();
    
    matches.forEach(match => {
      [match.player1, match.player2].forEach((playerName, index) => {
        if (!playerStats.has(playerName)) {
          playerStats.set(playerName, {
            player: playerName,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0
          });
        }
        
        const player = playerStats.get(playerName)!;
        player.played++;
        
        if (index === 0) { // player1 perspective
          player.goalsFor += match.score1;
          player.goalsAgainst += match.score2;
          if (match.result === 'win') {
            player.won++;
            player.points += 3;
          } else if (match.result === 'loss') {
            player.lost++;
          } else {
            player.drawn++;
            player.points += 1;
          }
        } else { // player2 perspective (reverse result)
          player.goalsFor += match.score2;
          player.goalsAgainst += match.score1;
          if (match.result === 'win') {
            player.lost++;
          } else if (match.result === 'loss') {
            player.won++;
            player.points += 3;
          } else {
            player.drawn++;
            player.points += 1;
          }
        }
        
        player.goalDifference = player.goalsFor - player.goalsAgainst;
      });
    });
    
    return Array.from(playerStats.values())
      .sort((a, b) => {
        // Sort by points (descending)
        if (b.points !== a.points) return b.points - a.points;
        // Then by goal difference (descending)
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        // Then by goals scored (descending)
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        // Finally by player name (alphabetical)
        return a.player.localeCompare(b.player);
      });
  }, [matches]);

  if (leagueTable.length === 0) {
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
          No league data available
        </div>
        <div>
          Add matches to see the league table and rankings
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
        🏆 League Table
      </h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #dee2e6'
            }}>
              <th style={{
                padding: '12px 8px',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                Pos
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                Player
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                P
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                W
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                D
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                L
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                GF
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                GA
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                GD
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#495057',
                borderBottom: '2px solid #dee2e6'
              }}>
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {leagueTable.map((entry, index) => (
              <tr
                key={entry.player}
                style={{
                  borderBottom: '1px solid #e9ecef',
                  backgroundColor: index === 0 ? '#fff3cd' : 
                                 index === 1 ? '#e3f2fd' : 
                                 index === 2 ? '#f3e5f5' : 'transparent'
                }}
              >
                <td style={{
                  padding: '12px 8px',
                  fontWeight: 'bold',
                  color: index === 0 ? '#ffc107' : 
                         index === 1 ? '#2196f3' : 
                         index === 2 ? '#9c27b0' : '#495057'
                }}>
                  {index + 1}
                </td>
                <td style={{
                  padding: '12px 8px',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {entry.player}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  {entry.played}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#28a745',
                  fontWeight: 'bold'
                }}>
                  {entry.won}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#ffc107',
                  fontWeight: 'bold'
                }}>
                  {entry.drawn}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {entry.lost}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  {entry.goalsFor}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  {entry.goalsAgainst}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: entry.goalDifference > 0 ? '#28a745' : 
                         entry.goalDifference < 0 ? '#dc3545' : '#666'
                }}>
                  {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#007bff'
                }}>
                  {entry.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* League Legend */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Legend:</div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#fff3cd',
              borderRadius: '2px'
            }}></div>
            <span>🥇 Champion</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#e3f2fd',
              borderRadius: '2px'
            }}></div>
            <span>🥈 Runner-up</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#f3e5f5',
              borderRadius: '2px'
            }}></div>
            <span>🥉 Third Place</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueTable;
