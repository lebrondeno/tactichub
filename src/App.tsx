// App.tsx - Full TacticHub application with navigation
import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import LeagueTable from './components/LeagueTable';
import Tournament from './components/Tournament';

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
  goals?: Goal[];
}

interface Goal {
  id: number;
  player: string;
  minute: number;
  type: 'goal' | 'penalty' | 'own_goal';
}

interface PlayerStats {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
  winRate: number;
}

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-match' | 'analytics' | 'players' | 'league-table' | 'tournament'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'result' | 'score'>('date');
  const [filterResult, setFilterResult] = useState<'all' | 'win' | 'loss' | 'draw'>('all');
  
  const [matchForm, setMatchForm] = useState({
    player1: '',
    player2: '',
    score1: 0,
    score2: 0,
    possession1: 50,
    possession2: 50,
    formation: '4-3-3',
    duration: 90,
    venue: 'Online',
    notes: ''
  });

  const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2', '3-4-3', '4-1-4-1', '3-4-2-1'];
  const venues = ['Online', 'Home', 'Away', 'Tournament', 'Friendly'];

  // Load matches from localStorage
  useEffect(() => {
    const savedMatches = localStorage.getItem('tactichub-matches');
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
  }, []);

  // Save matches to localStorage
  useEffect(() => {
    localStorage.setItem('tactichub-matches', JSON.stringify(matches));
  }, [matches]);

  const handleAddMatch = () => {
    if (!matchForm.player1.trim() || !matchForm.player2.trim()) {
      alert('Please enter both player names');
      return;
    }

    if (matchForm.possession1 + matchForm.possession2 !== 100) {
      alert('Possession percentages must add up to 100%');
      return;
    }

    const newMatch: Match = {
      id: Date.now(),
      ...matchForm,
      player1: matchForm.player1.trim(),
      player2: matchForm.player2.trim(),
      date: new Date().toISOString().split('T')[0],
      result: matchForm.score1 > matchForm.score2 ? 'win' : 
              matchForm.score1 < matchForm.score2 ? 'loss' : 'draw'
    };

    setMatches([newMatch, ...matches]);
    setMatchForm({
      player1: '',
      player2: '',
      score1: 0,
      score2: 0,
      possession1: 50,
      possession2: 50,
      formation: '4-3-3',
      duration: 90,
      venue: 'Online',
      notes: ''
    });
    setActiveTab('dashboard');
  };

  const deleteMatch = (id: number) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      setMatches(matches.filter(m => m.id !== id));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(matches, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `tactichub-matches-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Enhanced statistics
  const stats = useMemo(() => {
    const total = matches.length;
    const wins = matches.filter(m => m.result === 'win').length;
    const losses = matches.filter(m => m.result === 'loss').length;
    const draws = matches.filter(m => m.result === 'draw').length;
    const totalGoalsFor = matches.reduce((acc, m) => acc + m.score1, 0);
    const totalGoalsAgainst = matches.reduce((acc, m) => acc + m.score2, 0);
    const avgGoalsFor = total > 0 ? (totalGoalsFor / total).toFixed(1) : '0';
    const avgGoalsAgainst = total > 0 ? (totalGoalsAgainst / total).toFixed(1) : '0';
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0';
    
    return {
      total,
      wins,
      losses,
      draws,
      totalGoalsFor,
      totalGoalsAgainst,
      avgGoalsFor,
      avgGoalsAgainst,
      winRate,
      currentStreak: getCurrentStreak(matches),
      favoriteFormation: getFavoriteFormation(matches)
    };
  }, [matches]);

  // Player statistics
  const playerStats = useMemo(() => {
    const playerMap = new Map<string, PlayerStats>();
    
    matches.forEach(match => {
      [match.player1, match.player2].forEach((playerName, index) => {
        if (!playerMap.has(playerName)) {
          playerMap.set(playerName, {
            name: playerName,
            matches: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            winRate: 0
          });
        }
        
        const player = playerMap.get(playerName)!;
        player.matches++;
        
        if (index === 0) { // player1 perspective
          player.goalsFor += match.score1;
          player.goalsAgainst += match.score2;
          if (match.result === 'win') player.wins++;
          else if (match.result === 'loss') player.losses++;
          else player.draws++;
        } else { // player2 perspective (reverse result)
          player.goalsFor += match.score2;
          player.goalsAgainst += match.score1;
          if (match.result === 'win') player.losses++;
          else if (match.result === 'loss') player.wins++;
          else player.draws++;
        }
        
        player.winRate = player.matches > 0 ? (player.wins / player.matches) * 100 : 0;
      });
    });
    
    return Array.from(playerMap.values()).sort((a, b) => b.winRate - a.winRate);
  }, [matches]);

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    let filtered = matches.filter(match => {
      const matchesSearch = searchTerm === '' || 
        match.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.player2.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterResult === 'all' || match.result === filterResult;
      
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'result':
          return a.result.localeCompare(b.result);
        case 'score':
          return (b.score1 + b.score2) - (a.score1 + a.score2);
        default:
          return 0;
      }
    });
  }, [matches, searchTerm, filterResult, sortBy]);

  function getCurrentStreak(matches: Match[]): { type: string; count: number } {
    if (matches.length === 0) return { type: 'none', count: 0 };
    
    const sortedMatches = [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const currentResult = sortedMatches[0].result;
    let count = 0;
    
    for (const match of sortedMatches) {
      if (match.result === currentResult) count++;
      else break;
    }
    
    return { type: currentResult, count };
  }

  function getFavoriteFormation(matches: Match[]): string {
    if (matches.length === 0) return 'N/A';
    
    const formationCount = matches.reduce((acc, match) => {
      acc[match.formation] = (acc[match.formation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(formationCount).reduce((a, b) => 
      formationCount[a[0]] > formationCount[b[0]] ? a : b
    )[0];
  }

  const TabButton = ({ id, children, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      style={{
        padding: '12px 24px',
        border: 'none',
        borderRadius: '25px',
        backgroundColor: isActive ? '#007bff' : '#e9ecef',
        color: isActive ? 'white' : '#495057',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px'
      }}
    >
      {children}
    </button>
  );

  const StatCard = ({ title, value, subtitle, color, icon }: any) => (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      textAlign: 'center',
      border: `3px solid ${color}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        fontSize: '4rem',
        opacity: '0.1',
        color: color
      }}>
        {icon}
      </div>
      <div style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        color: color,
        marginBottom: '8px'
      }}>
        {value}
      </div>
      <div style={{ 
        color: '#666',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '4px'
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ 
          color: '#999',
          fontSize: '12px'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          margin: '0',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          ⚽ TacticHub Pro
        </h1>
        <p style={{
          color: '#6c757d',
          fontSize: '1.2rem',
          margin: '10px 0 30px 0'
        }}>
          Advanced eFootball Performance Analytics
        </p>
        
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <TabButton id="dashboard" isActive={activeTab === 'dashboard'} onClick={setActiveTab}>
            📊 Dashboard
          </TabButton>
          <TabButton id="add-match" isActive={activeTab === 'add-match'} onClick={setActiveTab}>
            ➕ Add Match
          </TabButton>
          <TabButton id="analytics" isActive={activeTab === 'analytics'} onClick={setActiveTab}>
            📈 Analytics
          </TabButton>
          <TabButton id="players" isActive={activeTab === 'players'} onClick={setActiveTab}>
            👥 Players
          </TabButton>
          <TabButton id="league-table" isActive={activeTab === 'league-table'} onClick={setActiveTab}>
            🏆 League Table
          </TabButton>
          <TabButton id="tournament" isActive={activeTab === 'tournament'} onClick={setActiveTab}>
            🏆 Tournament
          </TabButton>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <StatCard 
              title="Total Matches" 
              value={stats.total} 
              color="#6c757d"
              icon="🎮"
            />
            <StatCard 
              title="Win Rate" 
              value={`${stats.winRate}%`} 
              subtitle={`${stats.wins}W - ${stats.losses}L - ${stats.draws}D`}
              color="#28a745"
              icon="🏆"
            />
            <StatCard 
              title="Goals Per Game" 
              value={stats.avgGoalsFor} 
              subtitle={`${stats.totalGoalsFor} total goals`}
              color="#fd7e14"
              icon="⚽"
            />
            <StatCard 
              title="Current Streak" 
              value={stats.currentStreak.count} 
              subtitle={stats.currentStreak.type === 'win' ? 'Wins' : 
                       stats.currentStreak.type === 'loss' ? 'Losses' : 'Draws'}
              color={stats.currentStreak.type === 'win' ? '#28a745' : 
                    stats.currentStreak.type === 'loss' ? '#dc3545' : '#ffc107'}
              icon="🔥"
            />
          </div>

          {/* Match History with Filters */}
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <h2 style={{ margin: '0', color: '#333', fontSize: '1.8rem' }}>
                📋 Match History
              </h2>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '8px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '20px',
                    fontSize: '14px',
                    width: '200px'
                  }}
                />
                
                <select
                  value={filterResult}
                  onChange={(e) => setFilterResult(e.target.value as any)}
                  style={{
                    padding: '8px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}
                >
                  <option value="all">All Results</option>
                  <option value="win">Wins Only</option>
                  <option value="loss">Losses Only</option>
                  <option value="draw">Draws Only</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: '8px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}
                >
                  <option value="date">Sort by Date</option>
                  <option value="result">Sort by Result</option>
                  <option value="score">Sort by Goals</option>
                </select>

                <button
                  onClick={exportData}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  📤 Export
                </button>
              </div>
            </div>

            {filteredMatches.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                backgroundColor: '#f8f9fa',
                borderRadius: '15px',
                color: '#6c757d'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                  {matches.length === 0 ? '🎮' : '🔍'}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  {matches.length === 0 ? 'No matches found' : 'No matches match your filters'}
                </div>
                <div>
                  {matches.length === 0 
                    ? 'Start by logging your first eFootball match!'
                    : 'Try adjusting your search or filters'
                  }
                </div>
              </div>
            ) : (
              filteredMatches.map((match) => (
                <div
                  key={match.id}
                  style={{
                    background: match.result === 'win' 
                      ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                      : match.result === 'loss'
                      ? 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)'
                      : 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                    border: `2px solid ${match.result === 'win' ? '#28a745' : 
                                       match.result === 'loss' ? '#dc3545' : '#ffc107'}`,
                    borderRadius: '15px',
                    padding: '25px',
                    marginBottom: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '15px'
                  }}>
                    <button
                      onClick={() => deleteMatch(match.id)}
                      style={{
                        background: 'rgba(220, 53, 69, 0.1)',
                        border: '1px solid #dc3545',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        color: '#dc3545',
                        fontSize: '14px'
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333' }}>
                        {match.player1}
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                        {match.score1}
                      </div>
                    </div>

                    <div style={{
                      textAlign: 'center',
                      padding: '10px 20px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: '25px',
                      border: '2px solid rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                        {match.result === 'win' ? '🏆 WIN' : 
                         match.result === 'loss' ? '❌ LOSS' : '🤝 DRAW'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {match.date}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333' }}>
                        {match.player2}
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                        {match.score2}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    fontSize: '14px',
                    color: '#555'
                  }}>
                    <div>
                      <strong>Formation:</strong> {match.formation}
                    </div>
                    <div>
                      <strong>Possession:</strong> {match.possession1}% - {match.possession2}%
                    </div>
                    <div>
                      <strong>Duration:</strong> {match.duration} min
                    </div>
                    <div>
                      <strong>Venue:</strong> {match.venue}
                    </div>
                  </div>

                  {match.notes && (
                    <div style={{
                      marginTop: '15px',
                      padding: '10px',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      <strong>Notes:</strong> {match.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Match Tab */}
      {activeTab === 'add-match' && (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '2rem' }}>
            ➕ Add New Match
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Player 1 (You)
                </label>
                <input
                  type="text"
                  value={matchForm.player1}
                  onChange={(e) => setMatchForm({...matchForm, player1: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Your username"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Player 2 (Opponent)
                </label>
                <input
                  type="text"
                  value={matchForm.player2}
                  onChange={(e) => setMatchForm({...matchForm, player2: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Opponent username"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Your Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={matchForm.score1}
                  onChange={(e) => setMatchForm({...matchForm, score1: parseInt(e.target.value) || 0})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Opponent Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={matchForm.score2}
                  onChange={(e) => setMatchForm({...matchForm, score2: parseInt(e.target.value) || 0})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Your Possession %
                </label>
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
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Opponent Possession %
                </label>
                <input
                  type="number"
                  value={matchForm.possession2}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    backgroundColor: '#f8f9fa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Formation
                </label>
                <select
                  value={matchForm.formation}
                  onChange={(e) => setMatchForm({...matchForm, formation: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  {formations.map(formation => (
                    <option key={formation} value={formation}>
                      {formation}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Duration (min)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={matchForm.duration}
                  onChange={(e) => setMatchForm({...matchForm, duration: parseInt(e.target.value) || 90})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                  Venue
                </label>
                <select
                  value={matchForm.venue}
                  onChange={(e) => setMatchForm({...matchForm, venue: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  {venues.map(venue => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
                Match Notes (Optional)
              </label>
              <textarea
                value={matchForm.notes}
                onChange={(e) => setMatchForm({...matchForm, notes: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '16px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                placeholder="Add any notes about the match..."
              />
            </div>

            <button
              onClick={handleAddMatch}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '20px',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              📊 Add Match
            </button>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gap: '30px' }}>
          {/* Performance Overview */}
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginBottom: '25px', color: '#333', fontSize: '1.8rem' }}>
              📈 Performance Analytics
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Goal Statistics</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                  {stats.totalGoalsFor} : {stats.totalGoalsAgainst}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                  Average: {stats.avgGoalsFor} - {stats.avgGoalsAgainst} per match
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                  Goal Difference: {stats.totalGoalsFor - stats.totalGoalsAgainst > 0 ? '+' : ''}{stats.totalGoalsFor - stats.totalGoalsAgainst}
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Form Guide</h4>
                <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                  {matches.slice(0, 5).map((match, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-block',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: match.result === 'win' ? '#28a745' : 
                                       match.result === 'loss' ? '#dc3545' : '#ffc107',
                        color: 'white',
                        lineHeight: '30px',
                        margin: '0 3px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Last 5 matches (most recent first)
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Favorite Formation</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                  {stats.favoriteFormation}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                  Most used tactical setup
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Performance Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>📅 Monthly Performance</h3>
            {matches.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '15px',
                textAlign: 'center'
              }}>
                {Object.entries(
                  matches.reduce((acc, match) => {
                    const month = new Date(match.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    if (!acc[month]) acc[month] = { wins: 0, total: 0 };
                    acc[month].total++;
                    if (match.result === 'win') acc[month].wins++;
                    return acc;
                  }, {} as Record<string, { wins: number; total: number }>)
                ).slice(-6).map(([month, data]) => (
                  <div key={month} style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                      {month}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff', marginBottom: '4px' }}>
                      {((data.wins / data.total) * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {data.wins}/{data.total}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Play more matches to see monthly performance trends
              </div>
            )}
          </div>
        </div>
      )}

      {/* Players Tab */}
      {activeTab === 'players' && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ marginBottom: '25px', color: '#333', fontSize: '1.8rem' }}>
            👥 Player Statistics
          </h2>
          
          {playerStats.length > 0 ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {playerStats.map((player, index) => (
                <div
                  key={player.name}
                  style={{
                    padding: '20px',
                    backgroundColor: index === 0 ? '#fff3cd' : '#f8f9fa',
                    border: index === 0 ? '2px solid #ffc107' : '1px solid #e9ecef',
                    borderRadius: '15px',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: index === 0 ? '#ffc107' : '#007bff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>
                    {index === 0 ? '👑' : `#${index + 1}`}
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                      {player.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {player.matches} matches • {player.wins}W {player.losses}L {player.draws}D
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Goals: {player.goalsFor} scored, {player.goalsAgainst} conceded
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: player.winRate >= 60 ? '#28a745' : 
                             player.winRate >= 40 ? '#ffc107' : '#dc3545'
                    }}>
                      {player.winRate.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Win Rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              backgroundColor: '#f8f9fa',
              borderRadius: '15px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👥</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}>
                No player data available
              </div>
              <div>
                Add matches to see detailed player statistics and rankings
              </div>
            </div>
          )}
        </div>
      )}

      {/* League Table Tab */}
      {activeTab === 'league-table' && (
        <LeagueTable matches={matches} />
      )}

      {/* Tournament Tab */}
      {activeTab === 'tournament' && (
        <Tournament matches={matches} />
      )}
    </div>
  );
};

export default App; 