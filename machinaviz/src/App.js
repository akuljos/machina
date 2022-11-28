import './App.css';
import React from 'react';
import DirectoryMenu from './DirectoryMenu.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        MACHINA Visualizer
      </header>
      <div className="container"> 
          <div className="box-cell directory-box" >
              <DirectoryMenu />
          </div>
          <div className="box-cell patient-box" >
              <DirectoryMenu />
          </div>
        </div> 
    </div>
  );
}

export default App;
