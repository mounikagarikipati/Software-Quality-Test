import React, { useState } from 'react';

const BASE_PRICE = 1000;

const CUSTOMER_TYPES = ['Pirate', 'Marine', 'Civilian'];
const STARVING_OPTIONS = ['Yes', 'No'];
const DAY_OPTIONS = ['Weekday', 'Weekend'];

// Expected (correct) bill logic
function getExpectedBill(customerType, isStarving, dayOfWeek) {
  if (customerType === 'Pirate' && isStarving === 'Yes') return 0;
  if (customerType === 'Pirate' && isStarving === 'No') return 800;
  if (customerType === 'Marine' && dayOfWeek === 'Weekend') return 2000;
  if (customerType === 'Marine' && dayOfWeek === 'Weekday') return 1000;
  if (customerType === 'Civilian' && isStarving === 'Yes') return 500;
  if (customerType === 'Civilian' && isStarving === 'No') return 1000;
  return 1000;
}

// Buggy bill logic — has 2 hidden bugs
function getActualBill(customerType, isStarving, dayOfWeek) {
  if (customerType === 'Pirate' && isStarving === 'Yes') return 0;
  // BUG 1: Forgets 20% pirate discount when not starving
  if (customerType === 'Pirate' && isStarving === 'No') return 1000;
  // BUG 2: Forgets to double-charge Marines on weekends
  if (customerType === 'Marine' && dayOfWeek === 'Weekend') return 1000;
  if (customerType === 'Marine' && dayOfWeek === 'Weekday') return 1000;
  if (customerType === 'Civilian' && isStarving === 'Yes') return 500;
  if (customerType === 'Civilian' && isStarving === 'No') return 1000;
  return 1000;
}

const TOTAL_BUGS = 2;

function formatBill(amount) {
  if (amount === 0) return 'FREE 🍖';
  return `${amount.toLocaleString()} berries`;
}

const SANJI_QUOTES = [
  "Mellorine! A bug in my kitchen?!",
  "All-Blue Bug Detected!",
  "This ain't right, love cook style!",
  "Mon Dieu! The system lied!",
];

export default function DecisionGame({ onBack }) {
  const [customerType, setCustomerType] = useState('Pirate');
  const [isStarving, setIsStarving] = useState('Yes');
  const [dayOfWeek, setDayOfWeek] = useState('Weekday');
  const [lastResult, setLastResult] = useState(null);
  const [bugsFound, setBugsFound] = useState(new Set());
  const [attempts, setAttempts] = useState(15);
  const [gameState, setGameState] = useState('playing');
  const [floatText, setFloatText] = useState(null);
  const [sanjiBounce, setSanjiBounce] = useState(false);

  const showFloat = (text) => {
    setFloatText(text);
    setTimeout(() => setFloatText(null), 2000);
  };

  const handleTest = () => {
    if (gameState !== 'playing') return;

    const expected = getExpectedBill(customerType, isStarving, dayOfWeek);
    const actual = getActualBill(customerType, isStarving, dayOfWeek);
    const bugKey = `${customerType}|${isStarving}|${dayOfWeek}`;
    const isMismatch = expected !== actual;

    const result = { customerType, isStarving, dayOfWeek, expected, actual, isMismatch };
    setLastResult(result);

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    if (isMismatch && !bugsFound.has(bugKey)) {
      setSanjiBounce(true);
      setTimeout(() => setSanjiBounce(false), 800);
      showFloat(SANJI_QUOTES[Math.floor(Math.random() * SANJI_QUOTES.length)]);

      const newBugs = new Set(bugsFound);
      newBugs.add(bugKey);
      setBugsFound(newBugs);

      if (newBugs.size >= TOTAL_BUGS) {
        setTimeout(() => setGameState('won'), 1000);
      }
    } else {
      if (newAttempts <= 0) {
        setGameState('lost');
      }
    }
  };

  const restart = () => {
    setCustomerType('Pirate');
    setIsStarving('Yes');
    setDayOfWeek('Weekday');
    setLastResult(null);
    setBugsFound(new Set());
    setAttempts(15);
    setGameState('playing');
    setFloatText(null);
  };

  const bugLabel = (bugKey) => {
    const [ct, st, dw] = bugKey.split('|');
    return `${ct} + ${st === 'Yes' ? 'Starving' : 'Not Starving'} + ${dw}`;
  };

  return (
    <div className="game-container sanji-bg">
      <div className="game-overlay"></div>

      {floatText && <div className="anime-text sanji-float" key={Date.now()}>{floatText}</div>}

      <button className="back-btn" onClick={onBack}>← Menu</button>

      {/* Decorative Sanji silhouette */}
      <div className={`sanji-container ${sanjiBounce ? 'luffy-bounce' : ''}`}>
        <div className="sanji-silhouette">👨‍🍳</div>
      </div>

      {/* Win/Lose Modal */}
      {gameState !== 'playing' && (
        <div className="modal-overlay">
          <div className="modal-content">
            {gameState === 'won' ? (
              <>
                <h2 className="modal-title">🍖 ALL BUGS SERVED!</h2>
                <div className="modal-desc">
                  Sanji's kitchen is clean!<br />
                  You mastered Decision Table Testing!<br />
                  <br />
                  <strong style={{ color: '#ffcc00' }}>Bugs you found:</strong>
                  <ul style={{ textAlign: 'left', marginTop: '10px', paddingLeft: '20px' }}>
                    {[...bugsFound].map(k => <li key={k} style={{ marginBottom: '4px' }}>{bugLabel(k)}</li>)}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title" style={{ color: '#f87171' }}>GAME OVER</h2>
                <div className="modal-desc">
                  Ran out of attempts!<br />
                  The restaurant's bugs were too well hidden...<br />
                  Bugs found: {bugsFound.size} / {TOTAL_BUGS}
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
              <button className="modal-btn" onClick={restart}>Try Again</button>
              <button className="modal-btn" style={{ background: '#334155', color: 'white' }} onClick={onBack}>Main Menu</button>
            </div>
          </div>
        </div>
      )}

      <div className="content-wrapper">
        <h1 className="title">Sanji's Restaurant</h1>
        <p style={{ color: '#ffcc00', marginBottom: '16px', fontSize: '1rem', opacity: 0.9, textAlign: 'center' }}>
          Decision Table Testing — Find combos where the system charges the wrong amount!
        </p>

        <div className="panel">
          <div className="level-indicator" style={{ color: '#f97316' }}>
            Level 2: The Buggy Bill Calculator
          </div>

          {/* Hint box */}
          <div className="rules-container" style={{ marginBottom: '20px' }}>
            <h3>Pricing Rules (Expected):</h3>
            <div className="rule-item valid"><span className="rule-icon">🏴‍☠️</span> Pirate + Starving → <strong>FREE</strong></div>
            <div className="rule-item valid"><span className="rule-icon">🏴‍☠️</span> Pirate + Not Starving → <strong>800 berries (20% off)</strong></div>
            <div className="rule-item valid"><span className="rule-icon">⚓</span> Marine + Weekend → <strong>2000 berries (2x price)</strong></div>
            <div className="rule-item valid"><span className="rule-icon">⚓</span> Marine + Weekday → <strong>1000 berries (normal)</strong></div>
            <div className="rule-item valid"><span className="rule-icon">👤</span> Civilian + Starving → <strong>500 berries (50% off)</strong></div>
            <div className="rule-item valid"><span className="rule-icon">👤</span> Civilian + Not Starving → <strong>1000 berries (normal)</strong></div>
          </div>

          {/* Input selectors */}
          <div className="decision-inputs">
            <div className="decision-group">
              <label>Customer Type</label>
              <div className="toggle-group">
                {CUSTOMER_TYPES.map(ct => (
                  <button
                    key={ct}
                    className={`toggle-btn ${customerType === ct ? 'active' : ''}`}
                    onClick={() => setCustomerType(ct)}
                  >
                    {ct === 'Pirate' ? '🏴‍☠️' : ct === 'Marine' ? '⚓' : '👤'} {ct}
                  </button>
                ))}
              </div>
            </div>

            <div className="decision-group">
              <label>Is Starving?</label>
              <div className="toggle-group">
                {STARVING_OPTIONS.map(s => (
                  <button
                    key={s}
                    className={`toggle-btn ${isStarving === s ? 'active' : ''}`}
                    onClick={() => setIsStarving(s)}
                  >
                    {s === 'Yes' ? '😩' : '😊'} {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="decision-group">
              <label>Day of Week</label>
              <div className="toggle-group">
                {DAY_OPTIONS.map(d => (
                  <button
                    key={d}
                    className={`toggle-btn ${dayOfWeek === d ? 'active' : ''}`}
                    onClick={() => setDayOfWeek(d)}
                  >
                    {d === 'Weekday' ? '📅' : '🎉'} {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="submit-btn" style={{ width: '100%', padding: '15px', marginTop: '20px', fontSize: '1.1rem' }} onClick={handleTest} disabled={gameState !== 'playing'}>
            🍽️ Submit Order & Check Bill
          </button>

          {/* Result display */}
          {lastResult && (
            <div style={{ marginTop: '20px' }}>
              <div className="feedback-section">
                <div className="feedback-card">
                  <h4>Expected Bill</h4>
                  <div className={`result-badge ${lastResult.expected === 0 ? 'pass' : lastResult.expected <= 1000 ? 'pass' : 'fail'}`}>
                    {formatBill(lastResult.expected)}
                  </div>
                </div>
                <div className="feedback-card">
                  <h4>Actual Bill (System)</h4>
                  <div className={`result-badge ${lastResult.actual === lastResult.expected ? 'pass' : 'fail'}`}>
                    {formatBill(lastResult.actual)}
                  </div>
                </div>
              </div>

              {lastResult.isMismatch ? (
                <div className="bug-found-badge" style={{ marginTop: '15px', textAlign: 'center' }}>
                  🚨 BUG DETECTED! 🚨<br />
                  Expected {formatBill(lastResult.expected)} but system charged {formatBill(lastResult.actual)}!
                </div>
              ) : (
                <div style={{ textAlign: 'center', marginTop: '15px', color: '#4ade80', fontWeight: 700 }}>
                  ✔ Bills match — no bug here. Keep testing!
                </div>
              )}
            </div>
          )}

          {/* Progress and stats */}
          <div className="stats-bar" style={{ marginTop: '20px' }}>
            <span>
              Bugs Found:{' '}
              <span style={{ color: '#4ade80' }}>{bugsFound.size} / {TOTAL_BUGS}</span>
              {bugsFound.size > 0 && (
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#aaa' }}>
                  ({[...bugsFound].map(k => bugLabel(k)).join(', ')})
                </span>
              )}
            </span>
            <span className="attempts-left">Attempts Left: {attempts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
