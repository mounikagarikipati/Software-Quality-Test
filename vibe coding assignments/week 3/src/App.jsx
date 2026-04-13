import React, { useState } from 'react';
import './index.css';
import MainMenu from './components/MainMenu';
import PasswordGame from './components/PasswordGame';
import DecisionGame from './components/DecisionGame';

export default function App() {
  const [screen, setScreen] = useState('menu');

  if (screen === 'password') return <PasswordGame onBack={() => setScreen('menu')} />;
  if (screen === 'decision') return <DecisionGame onBack={() => setScreen('menu')} />;
  return <MainMenu onSelectLevel={setScreen} />;
}
