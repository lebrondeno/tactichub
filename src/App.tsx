// App.tsx - Minimal working version
import React, { useState } from 'react';
import './App.css';
import MatchForm from './components/MatchForm';

// Local interfaces to avoid import issues
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
}

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchForm, setMatchForm] = useState({
    player1: '',
    player2: '',
    score1: 0,
    score2: 0,
    possession1: 50,
    possession2: 50,
    formation: '4-3-3'
  });

  const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2', '3-4-3'];

  const handleAddMatch = () => {
    if (!matchForm.player1 || !matchForm.player2) {
      alert('Please enter both player names');
      return;
    }

    const newMatch: Match = {
      id: Date.now(),
      ...matchForm,
      date: new Date().toLocaleDateString(),
      result: matchForm.score1 > matchForm.score2 ? 'win' : 
              matchForm.score1 < matchForm.score2 ? 'loss' : 'draw'
    };

    setMatches([newMatch, ...matches]);
    
    // Reset form
    setMatchForm({
      player1: '',
      player2: '',
      score1: 0,
      score2: 0,
      possession1: 50,
      possession2: 50,
      formation: '4-3-3'
    });
  };

  const stats = {
    total: matches.length,
    wins: matches.filter(m => m.result === 'win').length,
    losses: matches.filter(m => m.result === 'loss').length,
    draws: matches.filter(m => m.result === 'draw').length,
  };

  const winRate = matches.length > 0 ? ((stats.wins / matches.length) * 100).toFixed(1) : '0';

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#333', 
          fontSize: '2.5rem', 
          margin: '0'
        }}>
          ⚽ TacticHub
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          margin: '10px 0 0 0'
        }}>
          Your competitive eFootball match analysis platform
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{stats.total}</div>
          <div style={{ color: '#666' }}>Total Matches</div>
        </div>
        <div style={{ 
          backgroundColor: '#d4edda', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          border: '1px solid #c3e6cb'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>{stats.wins}</div>
          <div style={{ color: '#155724' }}>Wins</div>
        </div>
        <div style={{ 
          backgroundColor: '#f8d7da', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          border: '1px solid #f5c6cb'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#721c24' }}>{stats.losses}</div>
          <div style={{ color: '#721c24' }}>Losses</div>
        </div>
        <div style={{ 
          backgroundColor: '#cce5ff', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          border: '1px solid #99d6ff'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0056b3' }}>{winRate}%</div>
          <div style={{ color: '#0056b3' }}>Win Rate</div>
        </div>
      </div>

      {/* Match Entry Form */}
      <MatchForm 
        matchForm={matchForm}
        setMatchForm={setMatchForm}
        formations={formations}
        handleAddMatch={handleAddMatch}
      />

      {/* Match History */}
      <div style={{
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          marginBottom: '20px', 
          color: '#333'
        }}>
          📊 Match History
        </h2>
        
        {matches.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px',
            color: '#666'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🎮</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>
              No matches found
            </div>
            <div>
              Start by logging your first eFootball match!
            </div>
          </div>
        ) : (
          matches.map((match) => (
            <div 
              key={match.id} 
              style={{ 
                backgroundColor: match.result === 'win' ? '#d4edda' : 
                               match.result === 'loss' ? '#f8d7da' : '#fff3cd',
                border: `1px solid ${match.result === 'win' ? '#c3e6cb' : 
                                   match.result === 'loss' ? '#f5c6cb' : '#ffeaa7'}`,
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '15px'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {match.player1} {match.score1} - {match.score2} {match.player2}
                </div>
                <div style={{ 
                  padding: '4px 8px', 
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: match.result === 'win' ? '#155724' : 
                                 match.result === 'loss' ? '#721c24' : '#856404',
                  color: 'white'
                }}>
                  {match.result === 'win' ? '🏆 WIN' : 
                   match.result === 'loss' ? '❌ LOSS' : '🤝 DRAW'}
                </div>
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                <strong>Formation:</strong> {match.formation} • 
                <strong> Possession:</strong> {match.possession1}% - {match.possession2}% • 
                <strong> Date:</strong> {match.date}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;