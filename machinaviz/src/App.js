import './App.css';
import React, { useState } from 'react';
import ClonalTree from './ClonalTree';
import DirectoryMenu from './DirectoryMenu.js';
import PatientMenu from './PatientMenu.js';
import Treant from 'treant';
import { v4 as uuidv4 } from 'uuid';
import Migration from './Migration';

function App() {
  const [subdirectory, setSubdirectory] = useState("");
  const [patient, setPatient] = useState("");

  function handleSubdirSelect(directoryName) {
    setSubdirectory(directoryName);
  }

  function handlePatient(patient) {
    setPatient(patient);
  }

  return (
    <div className="App">
      <header className="App-header">
        MACHINA Visualizer
      </header>
      <div className="container"> 
          <div className="box-cell directory-box" >
              <DirectoryMenu handleSubdirSelect={handleSubdirSelect} handlePatientSelect={handlePatient} />
          </div>
          <div className="box-cell patient-box" >
              <PatientMenu subdirectory={subdirectory} handlePatientSelect={handlePatient} />
          </div>
          <div className="box-cell tree-box" >
            { subdirectory !== "" && patient != "" && <h1>Patient Report</h1> }
            { subdirectory !== "" && patient != "" &&<ClonalTree subdirectory={subdirectory} patient={patient} /> }
            { subdirectory !== "" && patient !== "" && <Migration subdirectory={subdirectory} patient={patient} /> }
          </div>
        </div> 
    </div>
  );
}

export default App;
