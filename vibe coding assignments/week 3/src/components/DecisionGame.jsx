import React, { useState } from 'react';

const CUSTOMER_TYPES = ['Pirate', 'Marine', 'Civilian'];
const STARVING_OPTIONS = ['Yes', 'No'];
const DAY_OPTIONS = ['Weekday', 'Weekend'];
const LOYALTY_OPTIONS = ['Yes', 'No'];

// ─── EXPECTED (correct) bill logic ───────────────────────────────────────────
function getExpectedBill(ct, starving, day, loyalty) {
  if (ct === 'Pirate' && starving === 'Yes') return 0;
  if (ct === 'Pirate' && starving === 'No' && loyalty === 'Yes') return 700;
  if (ct === 'Pirate' && starving === 'No' && loyalty === 'No') return 1000;
  if (ct === 'Marine' && day === 'Weekend') return 2000;
  if (ct === 'Marine' && day === 'Weekday' && loyalty === 'Yes') return 900;
  if (ct === 'Marine' && day === 'Weekday' && loyalty === 'No') return 1000;
  if (ct === 'Civilian' && starving === 'Yes') return 500;
  if (ct === 'Civilian' && starving === 'No' && loyalty === 'Yes') return 800;
  if (ct === 'Civilian' && starving === 'No' && loyalty === 'No' && day === 'Weekend') return 1200;
  if (ct === 'Civilian' && starving === 'No' && loyalty === 'No' && day === 'Weekday') return 1000;
  return 1000;
}

// ─── BUGGY bill logic — 4 hidden bugs ────────────────────────────────────────
function getActualBill(ct, starving, day, loyalty) {
  if (ct === 'Pirate' && starving === 'Yes') return 0;
  // BUG 1: Forgets 30% loyalty discount for Pirates
  if (ct === 'Pirate' && starving === 'No' && loyalty === 'Yes') return 1000;
  if (ct === 'Pirate' && starving === 'No' && loyalty === 'No') return 1000;
  // BUG 2: Forgets to double-charge Marines on weekends
  if (ct === 'Marine' && day === 'Weekend') return 1000;
  // BUG 3: Forgets 10% loyalty discount for Marines on weekdays
  if (ct === 'Marine' && day === 'Weekday' && loyalty === 'Yes') return 1000;
  if (ct === 'Marine' && day === 'Weekday' && loyalty === 'No') return 1000;
  if (ct === 'Civilian' && starving === 'Yes') return 500;
  if (ct === 'Civilian' && starving === 'No' && loyalty === 'Yes') return 800;
  // BUG 4: Forgets 20% weekend surcharge for Civilians with no loyalty
  if (ct === 'Civilian' && starving === 'No' && loyalty === 'No' && day === 'Weekend') return 1000;
  if (ct === 'Civilian' && starving === 'No' && loyalty === 'No' && day === 'Weekday') return 1000;
  return 1000;
}

const TOTAL_BUGS = 4;
const MAX_ATTEMPTS = 12;

function formatBill(amount) {
  if (amount === 0) return 'FREE 🍖';
  return `${amount.toLocaleString()} ฿`;
}

function comboKey(ct, starving, day, loyalty) {
  return `${ct}|${starving}|${day}|${loyalty}`;
}

function comboLabel(key) {
  const [ct, st, dw, lc] = key.split('|');
  const icons = { Pirate: '🏴‍☠️', Marine: '⚓', Civilian: '👤' };
  return `${icons[ct]} ${ct} · ${st === 'Yes' ? 'Starving' : 'Not Starving'} · ${dw} · Loyalty: ${lc}`;
}

const SANJI_QUOTES = [
  "Mellorine! A bug in my kitchen?!",
  "All-Blue Bug Detected!",
  "This ain't right, love cook style!",
  "Mon Dieu! The system lied!",
  "Diable Jambe! Found it!",
];

export default function DecisionGame({ onBack }) {
  const [customerType, setCustomerType] = useState('Pirate');
  const [isStarving, setIsStarving] = useState('Yes');
  const [dayOfWeek, setDayOfWeek] = useState('Weekday');
  const [hasLoyalty, setHasLoyalty] = useState('No');

  const [lastResult, setLastResult] = useState(null);
  const [bugsFound, setBugsFound] = useState(new Set());
  const [testedLog, setTestedLog] = useState([]);
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [gameState, setGameState] = useState('playing');
  const [floatText, setFloatText] = useState(null);
  const [sanjiBounce, setSanjiBounce] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const showFloat = (text) => {
    setFloatText(text);
    setTimeout(() => setFloatText(null), 2000);
  };

  const handleTest = () => {
    if (gameState !== 'playing') return;

    const expected = getExpectedBill(customerType, isStarving, dayOfWeek, hasLoyalty);
    const actual = getActualBill(customerType, isStarving, dayOfWeek, hasLoyalty);
    const key = comboKey(customerType, isStarving, dayOfWeek, hasLoyalty);
    const isMismatch = expected !== actual;
    const isNewBug = isMismatch && !bugsFound.has(key);

    const result = { customerType, isStarving, dayOfWeek, hasLoyalty, expected, actual, isMismatch, key };
    setLastResult(result);

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    setTestedLog(prev => {
      const exists = prev.find(r => r.key === key);
      if (exists) return prev;
      return [result, ...prev].slice(0, 20);
    });

    if (isNewBug) {
      setSanjiBounce(true);
      setTimeout(() => setSanjiBounce(false), 800);
      showFloat(SANJI_QUOTES[Math.floor(Math.random() * SANJI_QUOTES.length)]);

      const newBugs = new Set(bugsFound);
      newBugs.add(key);
      setBugsFound(newBugs);

      if (newBugs.size >= TOTAL_BUGS) {
        setTimeout(() => setGameState('won'), 1000);
      }
    } else if (newAttempts <= 0 && bugsFound.size < TOTAL_BUGS) {
      setGameState('lost');
    }
  };

  const restart = () => {
    setCustomerType('Pirate');
    setIsStarving('Yes');
    setDayOfWeek('Weekday');
    setHasLoyalty('No');
    setLastResult(null);
    setBugsFound(new Set());
    setTestedLog([]);
    setAttempts(MAX_ATTEMPTS);
    setGameState('playing');
    setFloatText(null);
    setRulesOpen(false);
  };

  const currentKey = comboKey(customerType, isStarving, dayOfWeek, hasLoyalty);
  const alreadyTested = testedLog.some(r => r.key === currentKey);
  const alreadyFoundBug = bugsFound.has(currentKey);

  return (
    <div className="game-container sanji-bg">
      <div className="game-overlay"></div>

      {floatText && <div className="anime-text sanji-float" key={Date.now()}>{floatText}</div>}

      <button className="back-btn" onClick={onBack}>← Menu</button>

      <div className={`sanji-container ${sanjiBounce ? 'luffy-bounce' : ''}`}>
        <div className="sanji-silhouette">👨‍🍳</div>
      </div>

      {/* Win/Lose Modal */}
      {gameState !== 'playing' && (
        <div className="modal-overlay">
          <div className="modal-content">
            {gameState === 'won' ? (
              <>
                <h2 className="modal-title">🍖 KITCHEN CLEAN!</h2>
                <div className="modal-desc">
                  All 4 bugs squashed!<br />
                  You mastered Decision Table Testing!<br />
                  <br />
                  <strong style={{ color: '#ffcc00' }}>Bugs exposed:</strong>
                  <ul style={{ textAlign: 'left', marginTop: '10px', paddingLeft: '20px', fontSize: '0.9rem' }}>
                    {[...bugsFound].map(k => <li key={k} style={{ marginBottom: '6px' }}>{comboLabel(k)}</li>)}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title" style={{ color: '#f87171' }}>GAME OVER</h2>
                <div className="modal-desc">
                  Ran out of attempts!<br />
                  Bugs found: <strong style={{ color: '#ffcc00' }}>{bugsFound.size} / {TOTAL_BUGS}</strong><br />
                  <br />
                  <span style={{ fontSize: '0.9rem', color: '#aaa' }}>
                    Hint: Think about how loyalty cards and weekend pricing interact with each customer type.
                  </span>
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              <button className="modal-btn" onClick={restart}>Try Again</button>
              <button className="modal-btn" style={{ background: '#334155', color: 'white' }} onClick={onBack}>Main Menu</button>
            </div>
          </div>
        </div>
      )}

      <div className="content-wrapper" style={{ maxWidth: '960px' }}>
        <h1 className="title">Sanji's Restaurant</h1>
        <p style={{ color: '#ffcc00', marginBottom: '12px', fontSize: '1rem', opacity: 0.9, textAlign: 'center' }}>
          Find all <strong style={{ color: 'white' }}>4 combinations</strong> where the system charges the wrong amount!
        </p>

        <div className="panel">
          <div className="level-indicator" style={{ color: '#f97316' }}>
            Level 2: The Buggy Bill Calculator
          </div>

          {/* Collapsible rules */}
          <div style={{ marginBottom: '18px' }}>
            <button
              className="rules-toggle-btn"
              onClick={() => setRulesOpen(o => !o)}
            >
              📋 {rulesOpen ? 'Hide' : 'Show'} Pricing Rules (Cheat Sheet)
            </button>
            {rulesOpen && (
              <div className="rules-container" style={{ marginTop: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
                  <div className="rule-item valid"><span className="rule-icon">🏴‍☠️</span> Pirate + Starving → <strong>FREE</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">🏴‍☠️</span> Pirate + Not Starving + Loyalty → <strong>700 ฿ (30% off)</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">🏴‍☠️</span> Pirate + Not Starving, No Loyalty → <strong>1000 ฿</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">⚓</span> Marine + Weekend → <strong>2000 ฿ (2× price)</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">⚓</span> Marine + Weekday + Loyalty → <strong>900 ฿ (10% off)</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">⚓</span> Marine + Weekday, No Loyalty → <strong>1000 ฿</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">👤</span> Civilian + Starving → <strong>500 ฿ (50% off)</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">👤</span> Civilian + Not Starving + Loyalty → <strong>800 ฿ (20% off)</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">👤</span> Civilian + Not Starving, No Loyalty + Weekend → <strong>1200 ฿ (+20%)</strong></div>
                  <div className="rule-item valid"><span className="rule-icon">👤</span> Civilian + Not Starving, No Loyalty + Weekday → <strong>1000 ฿</strong></div>
                </div>
              </div>
            )}
          </div>

          <div className="decision-layout">
            {/* Left: inputs */}
            <div className="decision-inputs-col">
              <div className="decision-inputs">
                <div className="decision-group">
                  <label>Customer Type</label>
                  <div className="toggle-group">
                    {CUSTOMER_TYPES.map(ct => (
                      <button key={ct} className={`toggle-btn ${customerType === ct ? 'active' : ''}`} onClick={() => setCustomerType(ct)}>
                        {ct === 'Pirate' ? '🏴‍☠️' : ct === 'Marine' ? '⚓' : '👤'} {ct}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="decision-group">
                  <label>Is Starving?</label>
                  <div className="toggle-group">
                    {STARVING_OPTIONS.map(s => (
                      <button key={s} className={`toggle-btn ${isStarving === s ? 'active' : ''}`} onClick={() => setIsStarving(s)}>
                        {s === 'Yes' ? '😩' : '😊'} {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="decision-group">
                  <label>Day of Week</label>
                  <div className="toggle-group">
                    {DAY_OPTIONS.map(d => (
                      <button key={d} className={`toggle-btn ${dayOfWeek === d ? 'active' : ''}`} onClick={() => setDayOfWeek(d)}>
                        {d === 'Weekday' ? '📅' : '🎉'} {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="decision-group">
                  <label>Has Loyalty Card?</label>
                  <div className="toggle-group">
                    {LOYALTY_OPTIONS.map(l => (
                      <button key={l} className={`toggle-btn ${hasLoyalty === l ? 'active' : ''}`} onClick={() => setHasLoyalty(l)}>
                        {l === 'Yes' ? '🎫' : '🚫'} {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {alreadyTested && !alreadyFoundBug && (
                <div style={{ marginTop: '10px', color: '#facc15', fontSize: '0.85rem', textAlign: 'center', opacity: 0.8 }}>
                  ⚠ Already tested — no new result
                </div>
              )}
              {alreadyFoundBug && (
                <div style={{ marginTop: '10px', color: '#4ade80', fontSize: '0.85rem', textAlign: 'center' }}>
                  ✔ Bug already found for this combo
                </div>
              )}

              <button
                className="submit-btn"
                style={{ width: '100%', padding: '14px', marginTop: '14px', fontSize: '1.05rem' }}
                onClick={handleTest}
                disabled={gameState !== 'playing'}
              >
                🍽️ Submit Order & Check Bill
              </button>

              {lastResult && (
                <div style={{ marginTop: '16px' }}>
                  <div className="feedback-section">
                    <div className="feedback-card">
                      <h4>Expected Bill</h4>
                      <div className={`result-badge ${lastResult.expected <= 1000 ? 'pass' : 'fail'}`}>
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
                    <div className="bug-found-badge" style={{ marginTop: '12px', textAlign: 'center' }}>
                      🚨 BUG DETECTED! Expected {formatBill(lastResult.expected)} — System charged {formatBill(lastResult.actual)}!
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', marginTop: '12px', color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>
                      ✔ Bills match — no bug here. Keep testing!
                    </div>
                  )}
                </div>
              )}

              <div className="stats-bar" style={{ marginTop: '16px' }}>
                <span>Bugs: <span style={{ color: '#4ade80' }}>{bugsFound.size}/{TOTAL_BUGS}</span></span>
                <span className="attempts-left">Attempts: {attempts}/{MAX_ATTEMPTS}</span>
              </div>
            </div>

            {/* Right: tested combos log */}
            <div className="tested-log-col">
              <div className="tested-log-header">🧪 Tested Combos ({testedLog.length})</div>
              <div className="tested-log-list">
                {testedLog.length === 0 && (
                  <div style={{ color: '#555', fontSize: '0.85rem', textAlign: 'center', paddingTop: '12px' }}>
                    No combos tested yet
                  </div>
                )}
                {testedLog.map((r, i) => (
                  <div key={r.key + i} className={`tested-log-item ${r.isMismatch ? 'log-bug' : 'log-ok'}`}>
                    <span className="log-combo">
                      {r.customerType === 'Pirate' ? '🏴‍☠️' : r.customerType === 'Marine' ? '⚓' : '👤'}{' '}
                      {r.customerType} · {r.isStarving === 'Yes' ? 'Starving' : 'Full'} · {r.dayOfWeek} · {r.hasLoyalty === 'Yes' ? '🎫' : '🚫'}
                    </span>
                    <span className="log-result">
                      {r.isMismatch ? `🚨 ${formatBill(r.expected)} vs ${formatBill(r.actual)}` : `✔ ${formatBill(r.actual)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
