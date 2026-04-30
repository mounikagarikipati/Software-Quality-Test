import React, { useState } from 'react';
import './index.css';
import MainMenu from './components/MainMenu';
import ArlongGame from './components/ArlongGame';
import CrocodileGame from './components/CrocodileGame';
import DoflamingoGame from './components/DoflamingoGame';

export default function App() {
  const [screen, setScreen] = useState('menu');
  if (screen === 'arlong')     return <ArlongGame     onBack={() => setScreen('menu')} />;
  if (screen === 'crocodile')  return <CrocodileGame  onBack={() => setScreen('menu')} />;
  if (screen === 'doflamingo') return <DoflamingoGame onBack={() => setScreen('menu')} />;
  return <MainMenu onSelectLevel={setScreen} />;
}