import React from 'react';
export default function MainMenu({ onSelectLevel }) {
  return (
    <div className="game-container menu-bg">
      <div className="game-overlay"></div>
      <div className="content-wrapper">
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '8px' }}>QA Arcade</h1>
        <p style={{ color: '#ffcc00cc', marginBottom: '8px', fontSize: '1.1rem', letterSpacing: '1px' }}>Week 7 - Boss Battles</p>
        <p style={{ color: '#aaa', marginBottom: '40px', fontSize: '0.95rem' }}>Defeat each boss by exposing the bugs hidden in their systems!</p>
        <div className="menu-grid">
          <div className="menu-card" onClick={() => onSelectLevel('arlong')}>
            <div className="menu-card-icon">🦈</div>
            <div className="menu-card-badge" style={{ background: '#0ea5e9' }}>Level 3</div>
            <h2 className="menu-card-title">Arlong Park</h2>
            <p className="menu-card-desc">Arlong's combat system has illegal state jumps.<br />Concepts: <strong>State Transition Testing</strong></p>
            <button className="menu-play-btn" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>Fight Arlong →</button>
          </div>
          <div className="menu-card" onClick={() => onSelectLevel('crocodile')}>
            <div className="menu-card-icon">🦂</div>
            <div className="menu-card-badge" style={{ background: '#d97706' }}>Level 4</div>
            <h2 className="menu-card-title">Crocodile's Desert</h2>
            <p className="menu-card-desc">Crocodile's sand defense has broken logic conditions.<br />Concepts: <strong>Control Flow Testing</strong></p>
            <button className="menu-play-btn" style={{ background: 'linear-gradient(135deg, #d97706, #92400e)' }}>Fight Crocodile →</button>
          </div>
          <div className="menu-card" onClick={() => onSelectLevel('doflamingo')}>
            <div className="menu-card-icon">🕸️</div>
            <div className="menu-card-badge" style={{ background: '#a855f7' }}>Level 5</div>
            <h2 className="menu-card-title">Doflamingo's Strings</h2>
            <p className="menu-card-desc">Doflamingo's power pipeline has data propagation errors.<br />Concepts: <strong>Data Flow Testing</strong></p>
            <button className="menu-play-btn" style={{ background: 'linear-gradient(135deg, #a855f7, #6b21a8)' }}>Fight Doflamingo →</button>
          </div>
        </div>
      </div>
    </div>
  );
}