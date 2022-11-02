import React from 'react';
import './App.css';
import { DefaultAudio } from './DefaultAudio';
import { AutoTunedAudio } from './AutoTunedAudio';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Default</h2>
        <DefaultAudio />
        <h2>Auto-Tuned</h2>
        <AutoTunedAudio />
      </header>
    </div>
  );
}

export default App;
