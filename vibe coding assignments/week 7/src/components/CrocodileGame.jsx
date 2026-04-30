import React, { useState } from 'react';
const RAIN_OPTS = ['Yes','No']; const HAKI_OPTS = ['Yes','No']; const STRENGTH_OPTS = ['Weak','Strong'];
function getExpectedDefense(rain,haki,strength) { if(rain==='Yes')return'OFF'; if(haki==='Yes')return'OFF'; if(strength==='Weak')return'FULL'; return'PARTIAL'; }
function getActualDefense_buggy(rain,haki,strength) { if(rain==='Yes'&&strength==='Weak')return'OFF'; if(haki==='Yes'&&strength==='Strong')return'OFF'; if(strength==='Weak')return'FULL'; return'PARTIAL'; }
const TOTAL_BUGS=2; const MAX_ATTEMPTS=10;
const CROC_QUOTES=["Sables! ...wait, that's wrong!","Impossible - my Logia has a flaw!","Desert Spada... miscalculated!","That condition broke my defense!","You found the logic error, brat!"];
function comboKey(rain,haki,str){return `Rain:${rain}|Haki:${haki}|Str:${str}`;}
function comboLabel(key){return key.replace(/\|/g,' · ');}
export default function CrocodileGame({ onBack }) {
  const [rain,setRain]=useState('No'); const [haki,setHaki]=useState('No'); const [strength,setStrength]=useState('Weak');
  const [lastResult,setLastResult]=useState(null); const [bugsFound,setBugsFound]=useState(new Set());
  const [testedLog,setTestedLog]=useState([]); const [attempts,setAttempts]=useState(MAX_ATTEMPTS);
  const [gameState,setGameState]=useState('playing'); const [floatText,setFloatText]=useState(null);
  const [bossBounce,setBossBounce]=useState(false); const [luffyBounce,setLuffyBounce]=useState(false); const [rulesOpen,setRulesOpen]=useState(false);
  const showFloat=(text)=>{setFloatText(text);setTimeout(()=>setFloatText(null),2000);};
  const handleTest=()=>{
    if(gameState!=='playing')return;
    const expected=getExpectedDefense(rain,haki,strength); const actual=getActualDefense_buggy(rain,haki,strength);
    const key=comboKey(rain,haki,strength); const isMismatch=expected!==actual; const isNewBug=isMismatch&&!bugsFound.has(key);
    const result={rain,haki,strength,expected,actual,isMismatch,key}; setLastResult(result);
    const newAttempts=attempts-1; setAttempts(newAttempts);
    setTestedLog(prev=>{if(prev.find(r=>r.key===key))return prev;return[result,...prev].slice(0,20);});
    if(isNewBug){setBossBounce(true);setLuffyBounce(true);setTimeout(()=>{setBossBounce(false);setLuffyBounce(false);},800);showFloat(CROC_QUOTES[Math.floor(Math.random()*CROC_QUOTES.length)]);const newBugs=new Set(bugsFound);newBugs.add(key);setBugsFound(newBugs);if(newBugs.size>=TOTAL_BUGS)setTimeout(()=>setGameState('won'),1000);}
    else if(newAttempts<=0&&bugsFound.size<TOTAL_BUGS)setGameState('lost');
  };
  const restart=()=>{setRain('No');setHaki('No');setStrength('Weak');setLastResult(null);setBugsFound(new Set());setTestedLog([]);setAttempts(MAX_ATTEMPTS);setGameState('playing');setFloatText(null);setRulesOpen(false);};
  const currentKey=comboKey(rain,haki,strength); const alreadyTested=testedLog.some(r=>r.key===currentKey); const alreadyFoundBug=bugsFound.has(currentKey);
  return (
    <div className="game-container croc-bg">
      <div className="game-overlay"></div>
      {floatText&&<div className="anime-text croc-float" key={Date.now()}>{floatText}</div>}
      <button className="back-btn" onClick={onBack}>← Menu</button>
      <div className={`luffy-container ${luffyBounce?'luffy-bounce':''}`}><img src={`${import.meta.env.BASE_URL}luffy_3.png`} alt="Luffy" className="luffy-img" /></div>
      <div className={`croc-container ${bossBounce?'kaido-shake':''}`}><div className="croc-silhouette">🦂</div></div>
      {gameState!=='playing'&&(<div className="modal-overlay"><div className="modal-content">{gameState==='won'?(<><h2 className="modal-title">🦂 CROCODILE DEFEATED!</h2><div className="modal-desc">You found both control flow bugs!<br/>You mastered <strong style={{color:'#ffcc00'}}>Control Flow Testing!</strong><ul style={{textAlign:'left',marginTop:'12px',paddingLeft:'20px',fontSize:'0.9rem'}}>{[...bugsFound].map(k=><li key={k} style={{marginBottom:'6px'}}>{comboLabel(k)}</li>)}</ul></div></>):(<><h2 className="modal-title" style={{color:'#f87171'}}>GAME OVER</h2><div className="modal-desc">Crocodile's defense held!<br/>Bugs found: <strong style={{color:'#ffcc00'}}>{bugsFound.size} / {TOTAL_BUGS}</strong><br/><span style={{fontSize:'0.9rem',color:'#aaa'}}>Hint: Try Rain=Yes with Strong, and Haki=Yes with Weak.</span></div></>)}<div style={{display:'flex',gap:'15px',justifyContent:'center',flexWrap:'wrap',marginTop:'20px'}}><button className="modal-btn" onClick={restart}>Try Again</button><button className="modal-btn" style={{background:'#334155',color:'white'}} onClick={onBack}>Main Menu</button></div></div></div>)}
      <div className="content-wrapper" style={{maxWidth:'960px'}}>
        <h1 className="title">Crocodile's Desert</h1>
        <p style={{color:'#d97706',marginBottom:'12px',fontSize:'1rem',opacity:0.9,textAlign:'center'}}>Find the <strong style={{color:'white'}}>2 conditions</strong> where his defense activates when it shouldn't!</p>
        <div className="panel">
          <div className="level-indicator" style={{color:'#d97706'}}>Level 4: Control Flow Testing</div>
          <div style={{marginBottom:'18px'}}><button className="rules-toggle-btn" style={{borderColor:'rgba(217,119,6,0.4)',color:'#d97706',background:'rgba(217,119,6,0.1)'}} onClick={()=>setRulesOpen(o=>!o)}>📋 {rulesOpen?'Hide':'Show'} Defense Rules (Spec)</button>{rulesOpen&&(<div className="rules-container" style={{marginTop:'10px'}}><div className="rule-item valid"><span className="rule-icon">🌧️</span> Rain = Yes → Defense <strong>OFF</strong> (always)</div><div className="rule-item valid"><span className="rule-icon">⚡</span> Haki = Yes → Defense <strong>OFF</strong> (always)</div><div className="rule-item invalid"><span className="rule-icon">💪</span> No Rain + No Haki + Weak → <strong>FULL</strong></div><div className="rule-item invalid"><span className="rule-icon">🦸</span> No Rain + No Haki + Strong → <strong>PARTIAL</strong></div></div>)}</div>
          <div className="decision-layout">
            <div className="decision-inputs-col">
              <div className="w7-input-block"><div className="w7-group-label">🌧️ Is it Raining?</div><div className="w7-toggle-group">{RAIN_OPTS.map(v=><button key={v} className={`w7-toggle-btn ${rain===v?'active':''}`} onClick={()=>setRain(v)}>{v==='Yes'?'🌧️ Yes':'☀️ No'}</button>)}</div></div>
              <div className="w7-input-block"><div className="w7-group-label">⚡ Attacker Uses Haki?</div><div className="w7-toggle-group">{HAKI_OPTS.map(v=><button key={v} className={`w7-toggle-btn ${haki===v?'active':''}`} onClick={()=>setHaki(v)}>{v==='Yes'?'⚡ Yes':'🚫 No'}</button>)}</div></div>
              <div className="w7-input-block"><div className="w7-group-label">💪 Attacker Strength</div><div className="w7-toggle-group">{STRENGTH_OPTS.map(v=><button key={v} className={`w7-toggle-btn ${strength===v?'active':''}`} onClick={()=>setStrength(v)}>{v==='Weak'?'🐣 Weak':'🦾 Strong'}</button>)}</div></div>
              {alreadyTested&&!alreadyFoundBug&&<div style={{color:'#facc15',fontSize:'0.85rem',textAlign:'center',opacity:0.8,marginBottom:'6px'}}>⚠ Already tested</div>}
              {alreadyFoundBug&&<div style={{color:'#4ade80',fontSize:'0.85rem',textAlign:'center',marginBottom:'6px'}}>✔ Bug already found</div>}
              <button className="submit-btn" style={{width:'100%',padding:'14px',marginTop:'6px',fontSize:'1.05rem',background:'linear-gradient(135deg,#d97706,#92400e)'}} onClick={handleTest} disabled={gameState!=='playing'}>🦂 Test Defense Conditions</button>
              {lastResult&&(<div style={{marginTop:'16px'}}><div className="feedback-section"><div className="feedback-card"><h4>Expected Defense</h4><div className={`result-badge ${lastResult.expected==='OFF'?'pass':'fail'}`}>{lastResult.expected}</div></div><div className="feedback-card"><h4>Actual Defense (System)</h4><div className={`result-badge ${lastResult.actual===lastResult.expected?'pass':'fail'}`}>{lastResult.actual}</div></div></div>{lastResult.isMismatch?<div className="bug-found-badge" style={{marginTop:'12px',textAlign:'center'}}>🚨 BUG! Should be <strong>{lastResult.expected}</strong> but system shows <strong>{lastResult.actual}</strong>!</div>:<div style={{textAlign:'center',marginTop:'12px',color:'#4ade80',fontWeight:700,fontSize:'0.95rem'}}>✔ Defense matches — no bug here!</div>}</div>)}
              <div className="stats-bar" style={{marginTop:'16px'}}><span>Bugs: <span style={{color:'#4ade80'}}>{bugsFound.size}/{TOTAL_BUGS}</span></span><span className="attempts-left">Attempts: {attempts}/{MAX_ATTEMPTS}</span></div>
            </div>
            <div className="tested-log-col"><div className="tested-log-header">🧪 Tested Combos ({testedLog.length})</div><div className="tested-log-list">{testedLog.length===0&&<div style={{color:'#555',fontSize:'0.85rem',textAlign:'center',paddingTop:'12px'}}>No combos tested yet</div>}{testedLog.map((r,i)=><div key={r.key+i} className={`tested-log-item ${r.isMismatch?'log-bug':'log-ok'}`}><span className="log-combo">{r.rain==='Yes'?'🌧️':'☀️'} {r.haki==='Yes'?'⚡':'🚫'} {r.strength==='Weak'?'🐣':'🦾'}</span><span className="log-result">{r.isMismatch?`🚨 Exp:${r.expected}|Got:${r.actual}`:`✔ ${r.actual}`}</span></div>)}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}