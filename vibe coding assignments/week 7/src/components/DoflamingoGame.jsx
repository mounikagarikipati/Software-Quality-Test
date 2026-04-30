import React, { useState } from 'react';
const EMOTION_OPTS=['Calm','Angry','Injured']; const AWAKENED_OPTS=['Yes','No']; const DISTANCE_OPTS=[1,3,5,10];
const EMOTION_MULT={Calm:1.0,Angry:2.0,Injured:0.5}; const EMOTION_MULT_BUGGY={Calm:1.0,Angry:2.0,Injured:0.75};
function getExpectedPower(emotion,awakened,distance){let p=100;p=p*EMOTION_MULT[emotion];if(awakened==='Yes')p+=50;p-=distance*3;return Math.round(p);}
function getActualPower_buggy(emotion,awakened,distance){let p=100;if(awakened==='Yes')p+=50;p=p*EMOTION_MULT_BUGGY[emotion];p-=distance*5;return Math.round(p);}
const TOTAL_BUGS=3; const MAX_ATTEMPTS=12;
const DOFLA_QUOTES=["Fuffuffuffu... a calculation error!","My strings... miscalculated!","Heavenly Yaksha - data corrupted!","The pipeline broke! Impossible!","Corazon would have caught that..."];
function comboKey(e,a,d){return `${e}|Awake:${a}|Dist:${d}`;}
function comboLabel(key){const[e,a,d]=key.split('|');return `${e} · ${a} · ${d}m`;}
export default function DoflamingoGame({ onBack }) {
  const [emotion,setEmotion]=useState('Calm'); const [awakened,setAwakened]=useState('No'); const [distance,setDistance]=useState(1);
  const [lastResult,setLastResult]=useState(null); const [bugsFound,setBugsFound]=useState(new Set());
  const [testedLog,setTestedLog]=useState([]); const [attempts,setAttempts]=useState(MAX_ATTEMPTS);
  const [gameState,setGameState]=useState('playing'); const [floatText,setFloatText]=useState(null);
  const [bossBounce,setBossBounce]=useState(false); const [luffyBounce,setLuffyBounce]=useState(false); const [rulesOpen,setRulesOpen]=useState(false);
  const showFloat=(text)=>{setFloatText(text);setTimeout(()=>setFloatText(null),2000);};
  const handleTest=()=>{
    if(gameState!=='playing')return;
    const expected=getExpectedPower(emotion,awakened,distance); const actual=getActualPower_buggy(emotion,awakened,distance);
    const key=comboKey(emotion,awakened,distance); const isMismatch=expected!==actual; const isNewBug=isMismatch&&!bugsFound.has(key);
    const result={emotion,awakened,distance,expected,actual,isMismatch,key}; setLastResult(result);
    const newAttempts=attempts-1; setAttempts(newAttempts);
    setTestedLog(prev=>{if(prev.find(r=>r.key===key))return prev;return[result,...prev].slice(0,20);});
    if(isNewBug){setBossBounce(true);setLuffyBounce(true);setTimeout(()=>{setBossBounce(false);setLuffyBounce(false);},800);showFloat(DOFLA_QUOTES[Math.floor(Math.random()*DOFLA_QUOTES.length)]);const newBugs=new Set(bugsFound);newBugs.add(key);setBugsFound(newBugs);if(newBugs.size>=TOTAL_BUGS)setTimeout(()=>setGameState('won'),1000);}
    else if(newAttempts<=0&&bugsFound.size<TOTAL_BUGS)setGameState('lost');
  };
  const restart=()=>{setEmotion('Calm');setAwakened('No');setDistance(1);setLastResult(null);setBugsFound(new Set());setTestedLog([]);setAttempts(MAX_ATTEMPTS);setGameState('playing');setFloatText(null);setRulesOpen(false);};
  const currentKey=comboKey(emotion,awakened,distance); const alreadyTested=testedLog.some(r=>r.key===currentKey); const alreadyFoundBug=bugsFound.has(currentKey);
  const pb=100; const pae=pb*EMOTION_MULT[emotion]; const paa=awakened==='Yes'?pae+50:pae; const pf=paa-(distance*3);
  return (
    <div className="game-container dofla-bg">
      <div className="game-overlay"></div>
      {floatText&&<div className="anime-text dofla-float" key={Date.now()}>{floatText}</div>}
      <button className="back-btn" onClick={onBack}>← Menu</button>
      <div className={`luffy-container ${luffyBounce?'luffy-bounce':''}`}><img src={`${import.meta.env.BASE_URL}luffy_3.png`} alt="Luffy" className="luffy-img" /></div>
      <div className={`dofla-container ${bossBounce?'kaido-shake':''}`}><div className="dofla-silhouette">🕸️</div></div>
      {gameState!=='playing'&&(<div className="modal-overlay"><div className="modal-content">{gameState==='won'?(<><h2 className="modal-title">🕸️ DOFLAMINGO DEFEATED!</h2><div className="modal-desc">All 3 data flow bugs exposed!<br/>You mastered <strong style={{color:'#ffcc00'}}>Data Flow Testing!</strong><ul style={{textAlign:'left',marginTop:'12px',paddingLeft:'20px',fontSize:'0.9rem'}}>{[...bugsFound].map(k=><li key={k} style={{marginBottom:'6px'}}>{comboLabel(k)}</li>)}</ul></div></>):(<><h2 className="modal-title" style={{color:'#f87171'}}>GAME OVER</h2><div className="modal-desc">Doflamingo's strings held!<br/>Bugs found: <strong style={{color:'#ffcc00'}}>{bugsFound.size} / {TOTAL_BUGS}</strong><br/><span style={{fontSize:'0.9rem',color:'#aaa'}}>Hint: Try Angry+Awakened, Injured, and any distance.</span></div></>)}<div style={{display:'flex',gap:'15px',justifyContent:'center',flexWrap:'wrap',marginTop:'20px'}}><button className="modal-btn" onClick={restart}>Try Again</button><button className="modal-btn" style={{background:'#334155',color:'white'}} onClick={onBack}>Main Menu</button></div></div></div>)}
      <div className="content-wrapper" style={{maxWidth:'960px'}}>
        <h1 className="title">Doflamingo's Strings</h1>
        <p style={{color:'#e879f9',marginBottom:'12px',fontSize:'1rem',opacity:0.9,textAlign:'center'}}>Find the <strong style={{color:'white'}}>3 data flow errors</strong> in Doflamingo's power pipeline!</p>
        <div className="panel">
          <div className="level-indicator" style={{color:'#e879f9'}}>Level 5: Data Flow Testing</div>
          <div style={{marginBottom:'18px'}}><button className="rules-toggle-btn" style={{borderColor:'rgba(168,85,247,0.4)',color:'#e879f9',background:'rgba(168,85,247,0.1)'}} onClick={()=>setRulesOpen(o=>!o)}>📋 {rulesOpen?'Hide':'Show'} Power Pipeline (Spec)</button>{rulesOpen&&(<div className="rules-container" style={{marginTop:'10px'}}><div className="pipeline-step"><span className="step-label">Step 1</span> Base Power = <span className="step-val">100</span></div><div className="pipeline-arrow">↓</div><div className="pipeline-step"><span className="step-label">Step 2</span> × Emotion (Calm×1, Angry×2, Injured×0.5)</div><div className="pipeline-arrow">↓</div><div className="pipeline-step"><span className="step-label">Step 3</span> If Awakened: + 50</div><div className="pipeline-arrow">↓</div><div className="pipeline-step"><span className="step-label">Step 4</span> − Distance × 3</div></div>)}</div>
          <div className="decision-layout">
            <div className="decision-inputs-col">
              <div className="w7-input-block"><div className="w7-group-label">😤 Emotion</div><div className="w7-toggle-group">{EMOTION_OPTS.map(v=><button key={v} className={`w7-toggle-btn ${emotion===v?'active':''}`} onClick={()=>setEmotion(v)}>{v==='Calm'?'😐 Calm':v==='Angry'?'😡 Angry':'🤕 Injured'}</button>)}</div></div>
              <div className="w7-input-block"><div className="w7-group-label">🌸 Fruit Awakened?</div><div className="w7-toggle-group">{AWAKENED_OPTS.map(v=><button key={v} className={`w7-toggle-btn ${awakened===v?'active':''}`} onClick={()=>setAwakened(v)}>{v==='Yes'?'🌸 Yes':'❌ No'}</button>)}</div></div>
              <div className="w7-input-block"><div className="w7-group-label">📏 Distance (meters)</div><div className="w7-toggle-group">{DISTANCE_OPTS.map(v=><button key={v} className={`w7-toggle-btn ${distance===v?'active':''}`} onClick={()=>setDistance(v)}>{v}m</button>)}</div></div>
              <div style={{marginBottom:'14px',background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:'10px',padding:'12px'}}>
                <div style={{fontSize:'0.8rem',color:'#e879f9',fontWeight:700,marginBottom:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>Expected Pipeline Preview</div>
                <div className="pipeline-step"><span className="step-label">Base</span><span className="step-val">{pb}</span></div><div className="pipeline-arrow">↓</div>
                <div className="pipeline-step"><span className="step-label">×{EMOTION_MULT[emotion]}</span><span className="step-val">{pae}</span></div><div className="pipeline-arrow">↓</div>
                <div className="pipeline-step"><span className="step-label">{awakened==='Yes'?'+50':'+0'}</span><span className="step-val">{paa}</span></div><div className="pipeline-arrow">↓</div>
                <div className="pipeline-step"><span className="step-label">−{distance*3}</span><span className="step-val" style={{color:'#4ade80'}}>{Math.round(pf)}</span></div>
              </div>
              {alreadyTested&&!alreadyFoundBug&&<div style={{color:'#facc15',fontSize:'0.85rem',textAlign:'center',opacity:0.8,marginBottom:'6px'}}>⚠ Already tested</div>}
              {alreadyFoundBug&&<div style={{color:'#4ade80',fontSize:'0.85rem',textAlign:'center',marginBottom:'6px'}}>✔ Bug already found</div>}
              <button className="submit-btn" style={{width:'100%',padding:'14px',marginTop:'6px',fontSize:'1.05rem',background:'linear-gradient(135deg,#a855f7,#6b21a8)'}} onClick={handleTest} disabled={gameState!=='playing'}>🕸️ Test Power Calculation</button>
              {lastResult&&(<div style={{marginTop:'16px'}}><div className="feedback-section"><div className="feedback-card"><h4>Expected Power</h4><div className="result-badge pass" style={{fontSize:'1.3rem'}}>{lastResult.expected}</div></div><div className="feedback-card"><h4>Actual Power (System)</h4><div className={`result-badge ${lastResult.actual===lastResult.expected?'pass':'fail'}`} style={{fontSize:'1.3rem'}}>{lastResult.actual}</div></div></div>{lastResult.isMismatch?<div className="bug-found-badge" style={{marginTop:'12px',textAlign:'center'}}>🚨 BUG! Expected <strong>{lastResult.expected}</strong> but system outputs <strong>{lastResult.actual}</strong>!</div>:<div style={{textAlign:'center',marginTop:'12px',color:'#4ade80',fontWeight:700,fontSize:'0.95rem'}}>✔ Power matches — no bug here!</div>}</div>)}
              <div className="stats-bar" style={{marginTop:'16px'}}><span>Bugs: <span style={{color:'#4ade80'}}>{bugsFound.size}/{TOTAL_BUGS}</span></span><span className="attempts-left">Attempts: {attempts}/{MAX_ATTEMPTS}</span></div>
            </div>
            <div className="tested-log-col"><div className="tested-log-header">🧪 Tested Combos ({testedLog.length})</div><div className="tested-log-list">{testedLog.length===0&&<div style={{color:'#555',fontSize:'0.85rem',textAlign:'center',paddingTop:'12px'}}>No combos tested yet</div>}{testedLog.map((r,i)=><div key={r.key+i} className={`tested-log-item ${r.isMismatch?'log-bug':'log-ok'}`}><span className="log-combo">{r.emotion==='Angry'?'😡':r.emotion==='Injured'?'🤕':'😐'} {r.awakened==='Yes'?'🌸':'❌'} {r.distance}m</span><span className="log-result">{r.isMismatch?`🚨 Exp:${r.expected}|Got:${r.actual}`:`✔ ${r.actual}`}</span></div>)}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}