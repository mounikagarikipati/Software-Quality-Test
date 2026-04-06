import React, { useState, useEffect } from 'react';
import './index.css';

const MAX_ATTEMPTS = 10;
const MAX_LEVELS = 5;

// Bug descriptions for UI
const BUG_NAMES = [
  "Level 1: Boundary Value Error (>8 and <15 instead of inclusive)",
  "Level 2: Number Range Limit Regex Mistake",
  "Level 3: Missing Special Characters Check",
  "Level 4: Logical Mistake (OR operator instead of AND)",
  "Level 5: Allowed Unsupported Boundary Characters"
];

const LUFFY_IMAGES = [
  'luffy_0.png',
  'luffy_1.png',
  'luffy_2.png',
  'luffy_3.png',
  'luffy_3.png' // We will use CSS filter for Gear 5
];

export default function App() {
  const [level, setLevel] = useState(1);
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [password, setPassword] = useState("");
  
  const [lastResult, setLastResult] = useState(null);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost

  // Animation triggers
  const [kaidoShake, setKaidoShake] = useState(false);
  const [kaidoScale, setKaidoScale] = useState(1);
  const [luffyBounce, setLuffyBounce] = useState(false);
  const [animeText, setAnimeText] = useState(null);

  // Live Validation Rules checking
  const isLenValid = password.length >= 8 && password.length <= 15;
  const isNumValid = /[0-9]/.test(password);
  const isSpecValid = /[!@#$%^&*()?><]/.test(password);

  // Core business logic: The Expected correct outcome
  const getExpectedValidation = (pwd) => {
    const len = pwd.length >= 8 && pwd.length <= 15;
    const num = /[0-9]/.test(pwd);
    // Strict match so we know they ONLY used valid specials, or at least HAS one.
    // Spec says: "Must contain at least 1 special character from !@#$%^&*()?><"
    const spec = /[!@#$%^&*()?><]/.test(pwd); 
    // And actually, ideally no unsupported characters but let's assume standard rule is just "has one of these".
    
    return len && num && spec;
  };

  // The actual BUGGY logic that changes per level
  const getActualValidation = (pwd, currentLevel) => {
    // We intentionally introduce bugs based on level
    switch (currentLevel) {
      case 1:
        // Bug: Excludes boundaries 8 and 15
        const len1 = pwd.length > 8 && pwd.length < 15;
        return len1 && /[0-9]/.test(pwd) && /[!@#$%^&*()?><]/.test(pwd);
      case 2:
        // Bug: Incorrect number regex limit
        const len2 = pwd.length >= 8 && pwd.length <= 15;
        const num2 = /[1-8]/.test(pwd); // Misses 0 and 9
        return len2 && num2 && /[!@#$%^&*()?><]/.test(pwd);
      case 3:
        // Bug: Missing special characters check entirely
        const len3 = pwd.length >= 8 && pwd.length <= 15;
        const num3 = /[0-9]/.test(pwd);
        return len3 && num3; // Always passes special char
      case 4:
        // Bug: Logical OR mistake
        const len4 = pwd.length >= 8 && pwd.length <= 15;
        const num4 = /[0-9]/.test(pwd);
        const spec4 = /[!@#$%^&*()?><]/.test(pwd);
        return len4 || num4 || spec4; // If one is true, it passes!
      case 5:
        // Bug: Allows unsupported characters as special chars, e.g. space or ~
        const len5 = pwd.length >= 8 && pwd.length <= 15;
        const num5 = /[0-9]/.test(pwd);
        const spec5 = /[^a-zA-Z0-9]/.test(pwd); // Accepts ANY special char including spaces
        return len5 && num5 && spec5;
      default:
        return getExpectedValidation(pwd);
    }
  };

  const handleFloatingText = (text) => {
    setAnimeText(text);
    setTimeout(() => setAnimeText(null), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    if (gameState !== 'playing') return;

    const expected = getExpectedValidation(password);
    const actual = getActualValidation(password, level);
    
    const bugFound = expected !== actual;

    setLastResult({ expected, actual, bugFound });

    if (bugFound) {
      // Bug found! Level up
      setLuffyBounce(true);
      setTimeout(() => setLuffyBounce(false), 800);
      
      const praises = ["Gear Up!", "Gum Gum Pistol!", "Jet Gatling!", "Haki Burst!"];
      handleFloatingText(praises[Math.floor(Math.random() * praises.length)]);

      if (level === MAX_LEVELS) {
        setGameState('won');
      } else {
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setAttempts(MAX_ATTEMPTS); // Reset attempts for next level
          setPassword("");
          setLastResult(null);
          setKaidoScale(1); // Reset Kaido
        }, 1500); // Small delay to let them see results
      }
    } else {
      // Wrong detection
      setKaidoShake(true);
      setKaidoScale(prev => prev + 0.1); 
      setTimeout(() => setKaidoShake(false), 500);

      const newAttempts = attempts - 1;
      setAttempts(newAttempts);

      if (newAttempts <= 0) {
        setGameState('lost');
      }
    }
  };

  const restartGame = () => {
    setLevel(1);
    setAttempts(MAX_ATTEMPTS);
    setPassword("");
    setLastResult(null);
    setGameState('playing');
    setKaidoScale(1);
  };

  return (
    <div className="game-container" style={{ backgroundImage: `url('${import.meta.env.BASE_URL}bg.png')` }}>
      <div className="game-overlay"></div>
      
      {animeText && <div className="anime-text" key={Date.now()}>{animeText}</div>}

      {/* Kaido Element */}
      <div className={`kaido-container ${kaidoShake ? 'kaido-shake' : ''}`}>
        <img 
          src={`${import.meta.env.BASE_URL}kaido.png`} 
          alt="Kaido" 
          className="kaido-img" 
          style={{ transform: `scale(${kaidoScale})`, transformOrigin: 'bottom right' }}
        />
      </div>

      {/* Luffy Element */}
      <div className={`luffy-container ${luffyBounce ? 'luffy-bounce' : ''}`}>
        <img 
          src={`${import.meta.env.BASE_URL}${LUFFY_IMAGES[level - 1]}`} 
          alt={`Luffy Gear ${level}`} 
          className={`luffy-img luffy-form-${level - 1}`} 
        />
      </div>

      {/* Modal overlays */}
      {gameState !== 'playing' && (
        <div className="modal-overlay">
          <div className="modal-content">
            {gameState === 'won' ? (
              <>
                <h2 className="modal-title">🎉 VICTORY!</h2>
                <div className="modal-desc">
                  You exposed all the bugs!<br/>
                  Kaido has been defeated!<br/>
                  You mastered Equivalence Class Testing & Boundary Value Analysis!
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title" style={{color: '#f87171'}}>GAME OVER</h2>
                <div className="modal-desc">
                  Kaido grew too powerful...<br/>
                  You ran out of attempts on {BUG_NAMES[level - 1].split(':')[0]}.
                </div>
              </>
            )}
            <button className="modal-btn" onClick={restartGame}>Play Again</button>
          </div>
        </div>
      )}

      {/* Main Game Card */}
      <div className="content-wrapper">
        <h1 className="title">Bug Hunt: QA Tester</h1>

        <div className="panel">
          <div className="level-indicator">
            {BUG_NAMES[level - 1]}
          </div>

          <div className="rules-container">
             <h3>Password Rules Check:</h3>
             <div className={`rule-item ${isLenValid ? 'valid' : 'invalid'}`}>
               <span className="rule-icon">{isLenValid ? '✔' : '✖'}</span>
               8–15 characters (inclusive)
             </div>
             <div className={`rule-item ${isNumValid ? 'valid' : 'invalid'}`}>
               <span className="rule-icon">{isNumValid ? '✔' : '✖'}</span>
               At least 1 number (0–9)
             </div>
             <div className={`rule-item ${isSpecValid ? 'valid' : 'invalid'}`}>
               <span className="rule-icon">{isSpecValid ? '✔' : '✖'}</span>
               At least 1 special char: !@#$%^&*()?&gt;&lt;
             </div>
          </div>

          <form onSubmit={handleSubmit} className="input-section">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Test your password here..." 
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="submit-btn">Submit Test</button>
          </form>

          <div className="feedback-section">
            <div className="feedback-card">
              <h4>Expected Output</h4>
              {lastResult ? (
                <div className={`result-badge ${lastResult.expected ? 'pass' : 'fail'}`}>
                  {lastResult.expected ? 'Valid ✔' : 'Invalid ✖'}
                </div>
              ) : <div style={{opacity: 0.5}}>Waiting...</div>}
            </div>
            
            <div className="feedback-card">
              <h4>Actual Output (System)</h4>
              {lastResult ? (
                <div className={`result-badge ${lastResult.actual ? 'pass' : 'fail'}`}>
                  {lastResult.actual ? 'Valid ✔' : 'Invalid ✖'}
                </div>
              ) : <div style={{opacity: 0.5}}>Waiting...</div>}
            </div>
          </div>

          {lastResult && lastResult.bugFound && (
            <div className="bug-found-badge text-center">
              🚨 BUG EXPOSED! 🚨<br/>
              Expected: {lastResult.expected ? 'Valid' : 'Invalid'} BUT Actual: {lastResult.actual ? 'Valid' : 'Invalid'}
            </div>
          )}

          <div className="stats-bar">
            <span>Score: <span style={{color: '#4ade80'}}>{level - 1} / 5</span> Bugs Found</span>
            <span className="attempts-left">Attempts Left: {attempts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
