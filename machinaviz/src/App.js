import './App.css';
import React, { useState } from 'react';
import DirectoryMenu from './DirectoryMenu.js';
import PatientMenu from './PatientMenu.js';

function App() {
  const [subdirectory, setSubdirectory] = useState("");

  function handleSubdirSelect(directoryName) {
    setSubdirectory(directoryName);
  }

  return (
    <div className="App">
      <header className="App-header">
        MACHINA Visualizer
      </header>
      <div className="container"> 
          <div className="box-cell directory-box" >
              <DirectoryMenu handleSubdirSelect={handleSubdirSelect} />
          </div>
          <div className="box-cell patient-box" >
              <PatientMenu subdirectory={subdirectory} />
          </div>
        </div> 
    </div>
  );
}

export default App;
