import React from 'react';

export default function MainMenu({ onSelectLevel }) {
  return (
    <div className="game-container menu-bg">
      <div className="game-overlay"></div>
      <div className="content-wrapper">
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '8px' }}>QA Arcade</h1>
        <p style={{ color: '#ffcc00cc', marginBottom: '40px', fontSize: '1.1rem', letterSpacing: '1px' }}>
          Choose your testing challenge
        </p>

        <div className="menu-grid">
          <div className="menu-card" onClick={() => onSelectLevel('password')}>
            <div className="menu-card-icon">🏴‍☠️</div>
            <div className="menu-card-badge">Level 1</div>
            <h2 className="menu-card-title">Password Bug Hunt</h2>
            <p className="menu-card-desc">
              Test a buggy password validator and expose hidden flaws.<br />
              Concepts: <strong>Boundary Value Analysis</strong> &amp; <strong>Equivalence Classes</strong>
            </p>
            <button className="menu-play-btn">Play →</button>
          </div>

          <div className="menu-card" onClick={() => onSelectLevel('decision')}>
            <div className="menu-card-icon">🍽️</div>
            <div className="menu-card-badge" style={{ background: '#f97316' }}>Level 2</div>
            <h2 className="menu-card-title">Sanji's Restaurant</h2>
            <p className="menu-card-desc">
              Find combinations where the restaurant bill is calculated wrong.<br />
              Concepts: <strong>Decision Table Testing</strong>
            </p>
            <button className="menu-play-btn" style={{ background: 'linear-gradient(135deg, #f97316, #c2410c)' }}>Play →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
