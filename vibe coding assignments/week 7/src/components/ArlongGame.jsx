import React, { useState } from 'react';
const STATES = ['Calm', 'Attacking', 'Retreating', 'Defeated'];
const VALID_TRANSITIONS = { 'Calm': ['Attacking'], 'Attacking': ['Retreating', 'Defeated'], 'Retreating': ['Attacking', 'Calm'], 'Defeated': [] };
function isExpectedValid(from, to) { return VALID_TRANSITIONS[from]?.includes(to) ?? false; }
function isActualValid_buggy(from, to) {
  if (from === 'Calm' && to === 'Defeated') return true;
  if (from === 'Retreating' && to === 'Attacking') return false;
  if (from === 'Defeated' && to === 'Attacking') return true;
  return isExpectedValid(from, to);
}
const TOTAL_BUGS = 3; const MAX_ATTEMPTS = 10;
const ARLONG_QUOTES = ["Fishman Karate - glitch detected!", "My state machine is broken!", "Arlong Park system failure!", "You found a gap in my logic!", "Impossible... a loophole!"];
const STATE_COLORS = { Calm: 'state-calm', Attacking: 'state-attacking', Retreating: 'state-retreating', Defeated: 'state-defeated' };
export default function ArlongGame({ onBack }) {
  const [fromState, setFromState] = useState('Calm');
  const [toState, setToState] = useState('Attacking');
  const [lastResult, setLastResult] = useState(null);
  const [bugsFound, setBugsFound] = useState(new Set());
  const [testedLog, setTestedLog] = useState([]);
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [gameState, setGameState] = useState('playing');
  const [floatText, setFloatText] = useState(null);
  const [bossBounce, setBossBounce] = useState(false);
  const [luffyBounce, setLuffyBounce] = useState(false);
  const showFloat = (text) => { setFloatText(text); setTimeout(() => setFloatText(null), 2000); };
  const bugKey = (f, t) => f + '→' + t;
  const handleTest = () => {
    if (gameState !== 'playing') return;
    const expected = isExpectedValid(fromState, toState);
    const actual = isActualValid_buggy(fromState, toState);
    const key = bugKey(fromState, toState);
    const isMismatch = expected !== actual;
    const isNewBug = isMismatch && !bugsFound.has(key);
    const result = { from: fromState, to: toState, expected, actual, isMismatch, key };
    setLastResult(result);
    const newAttempts = attempts - 1; setAttempts(newAttempts);
    setTestedLog(prev => { if (prev.find(r => r.key === key)) return prev; return [result, ...prev].slice(0, 20); });
    if (isNewBug) {
      setBossBounce(true); setLuffyBounce(true);
      setTimeout(() => { setBossBounce(false); setLuffyBounce(false); }, 800);
      showFloat(ARLONG_QUOTES[Math.floor(Math.random() * ARLONG_QUOTES.length)]);
      const newBugs = new Set(bugsFound); newBugs.add(key); setBugsFound(newBugs);
      if (newBugs.size >= TOTAL_BUGS) setTimeout(() => setGameState('won'), 1000);
    } else if (newAttempts <= 0 && bugsFound.size < TOTAL_BUGS) setGameState('lost');
  };
  const restart = () => { setFromState('Calm'); setToState('Attacking'); setLastResult(null); setBugsFound(new Set()); setTestedLog([]); setAttempts(MAX_ATTEMPTS); setGameState('playing'); setFloatText(null); };
  const currentKey = bugKey(fromState, toState);
  const alreadyTested = testedLog.some(r => r.key === currentKey);
  const alreadyFoundBug = bugsFound.has(currentKey);
  return (
    <div className="game-container arlong-bg">
      <div className="game-overlay"></div>
      {floatText && <div className="anime-text arlong-float" key={Date.now()}>{floatText}</div>}
      <button className="back-btn" onClick={onBack}>← Menu</button>
      <div className={`luffy-container ${luffyBounce ? 'luffy-bounce' : ''}`}><img src={`${import.meta.env.BASE_URL}luffy_3.png`} alt="Luffy" className="luffy-img" /></div>
      <div className={`arlong-container ${bossBounce ? 'kaido-shake' : ''}`}><div className="arlong-silhouette">🦈</div></div>
      {gameState !== 'playing' && (
        <div className="modal-overlay"><div className="modal-content">
          {gameState === 'won' ? (<><h2 className="modal-title">🦈 ARLONG DEFEATED!</h2><div className="modal-desc">You exposed all 3 illegal state transitions!<br />You mastered <strong style={{color:'#ffcc00'}}>State Transition Testing!</strong><ul style={{textAlign:'left',marginTop:'12px',paddingLeft:'20px',fontSize:'0.9rem'}}>{[...bugsFound].map(k=><li key={k} style={{marginBottom:'6px'}}>{k}</li>)}</ul></div></>) : (<><h2 className="modal-title" style={{color:'#f87171'}}>GAME OVER</h2><div className="modal-desc">Arlong's system survived!<br />Bugs found: <strong style={{color:'#ffcc00'}}>{bugsFound.size} / {TOTAL_BUGS}</strong><br /><span style={{fontSize:'0.9rem',color:'#aaa'}}>Hint: Try transitions involving Defeated and Calm → Defeated.</span></div></>)}
          <div style={{display:'flex',gap:'15px',justifyContent:'center',flexWrap:'wrap',marginTop:'20px'}}><button className="modal-btn" onClick={restart}>Try Again</button><button className="modal-btn" style={{background:'#334155',color:'white'}} onClick={onBack}>Main Menu</button></div>
        </div></div>
      )}
      <div className="content-wrapper" style={{maxWidth:'960px'}}>
        <h1 className="title">Arlong Park</h1>
        <p style={{color:'#38bdf8',marginBottom:'12px',fontSize:'1rem',opacity:0.9,textAlign:'center'}}>Find all <strong style={{color:'white'}}>3 illegal transitions</strong> in Arlong's combat state machine!</p>
        <div className="panel">
          <div className="level-indicator" style={{color:'#38bdf8'}}>Level 3: State Transition Testing</div>
          <div className="rules-container" style={{marginBottom:'18px'}}>
            <h3>Valid State Machine (Specification):</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px',alignItems:'center',justifyContent:'center',padding:'8px 0'}}>
              <span className="state-node state-calm">Calm</span><span className="transition-arrow">→</span><span className="state-node state-attacking">Attacking</span><span className="transition-arrow">⇄</span><span className="state-node state-retreating">Retreating</span><span className="transition-arrow">→</span><span className="state-node state-calm">Calm</span>
            </div>
            <div style={{textAlign:'center',marginTop:'6px',color:'#aaa',fontSize:'0.85rem'}}>Attacking → Defeated | Retreating → Attacking | Defeated = terminal (no exits)</div>
          </div>
          <div className="decision-layout">
            <div className="decision-inputs-col">
              <div className="w7-input-block"><div className="w7-group-label">FROM State</div><div className="w7-toggle-group">{STATES.map(s=><button key={s} className={`w7-toggle-btn ${fromState===s?'active':''}`} onClick={()=>setFromState(s)}><span className={`state-node ${STATE_COLORS[s]}`} style={{border:'none',background:'transparent',padding:'2px 4px',fontSize:'0.85rem'}}>{s}</span></button>)}</div></div>
              <div className="w7-input-block"><div className="w7-group-label">TO State</div><div className="w7-toggle-group">{STATES.map(s=><button key={s} className={`w7-toggle-btn ${toState===s?'active':''}`} onClick={()=>setToState(s)}><span className={`state-node ${STATE_COLORS[s]}`} style={{border:'none',background:'transparent',padding:'2px 4px',fontSize:'0.85rem'}}>{s}</span></button>)}</div></div>
              <div style={{textAlign:'center',margin:'10px 0',fontSize:'0.95rem',color:'#ccc'}}>Testing: <span className={`state-node ${STATE_COLORS[fromState]}`}>{fromState}</span> → <span className={`state-node ${STATE_COLORS[toState]}`}>{toState}</span></div>
              {alreadyTested && !alreadyFoundBug && <div style={{color:'#facc15',fontSize:'0.85rem',textAlign:'center',opacity:0.8,marginBottom:'6px'}}>⚠ Already tested</div>}
              {alreadyFoundBug && <div style={{color:'#4ade80',fontSize:'0.85rem',textAlign:'center',marginBottom:'6px'}}>✔ Bug already found</div>}
              <button className="submit-btn" style={{width:'100%',padding:'14px',marginTop:'6px',fontSize:'1.05rem'}} onClick={handleTest} disabled={gameState!=='playing'}>🦈 Test Transition</button>
              {lastResult && (<div style={{marginTop:'16px'}}><div className="feedback-section"><div className="feedback-card"><h4>Expected (Spec)</h4><div className={`result-badge ${lastResult.expected?'pass':'fail'}`}>{lastResult.expected?'VALID ✔':'INVALID ✖'}</div></div><div className="feedback-card"><h4>Actual (System)</h4><div className={`result-badge ${lastResult.actual===lastResult.expected?'pass':'fail'}`}>{lastResult.actual?'VALID ✔':'INVALID ✖'}</div></div></div>{lastResult.isMismatch?<div className="bug-found-badge" style={{marginTop:'12px',textAlign:'center'}}>🚨 BUG! Expected {lastResult.expected?'VALID':'INVALID'} but system says {lastResult.actual?'VALID':'INVALID'}!</div>:<div style={{textAlign:'center',marginTop:'12px',color:'#4ade80',fontWeight:700,fontSize:'0.95rem'}}>✔ System agrees — no bug here!</div>}</div>)}
              <div className="stats-bar" style={{marginTop:'16px'}}><span>Bugs: <span style={{color:'#4ade80'}}>{bugsFound.size}/{TOTAL_BUGS}</span></span><span className="attempts-left">Attempts: {attempts}/{MAX_ATTEMPTS}</span></div>
            </div>
            <div className="tested-log-col"><div className="tested-log-header">🧪 Tested Transitions ({testedLog.length})</div><div className="tested-log-list">{testedLog.length===0&&<div style={{color:'#555',fontSize:'0.85rem',textAlign:'center',paddingTop:'12px'}}>No transitions tested yet</div>}{testedLog.map((r,i)=><div key={r.key+i} className={`tested-log-item ${r.isMismatch?'log-bug':'log-ok'}`}><span className="log-combo">{r.from} → {r.to}</span><span className="log-result">{r.isMismatch?`🚨 Spec: ${r.expected?'VALID':'INVALID'} | System: ${r.actual?'VALID':'INVALID'}`:`✔ Both: ${r.actual?'VALID':'INVALID'}`}</span></div>)}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}