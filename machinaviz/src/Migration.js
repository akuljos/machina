import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import { v4 as uuidv4 } from 'uuid';

// Hex colors for the graph and legend
const colors = [
    "#000000",
    "#ff3333",
    "#33ff33",
    "#3333ff",
    "#ffff33",
    "#33ffff",
    "#ff33ff",
    "#333333",
    "#affc8f",
    "#cc43c1"
]

async function getPMHs(subdirectory, patient) {
    const response = await fetch(`/extract-pmh-names?subdirectory=${subdirectory}&patient=${patient}`);
    const data = await response.json();
    
    return data;
}

function Migration(props) {
    const [pmhs, setPMHs] = useState([]);
    const [pmh, setPMH] = useState("");

    if (props.subdirectory !== "" && props.patient !== "") {
        getPMHs(props.subdirectory, props.patient)
            .then((data) => setPMHs(data.message));

        // Event handler for labelfile selection
        let handleChange = (e) => {
            setPMH(e.target.value)
        }

        return (
            <div className="phylogeny">
                <h3>Migration Graph</h3>
                <span>Select PMH File: <select onChange={handleChange}> 
                    <option value="⬇️ Select labeling ⬇️"><p>-- Select PMH -- </p></option>
                    {pmhs.map((pmh) => <option value={pmh}>{pmh}</option>)}
                </select></span>
            </div>);
    }
}

export default Migration;