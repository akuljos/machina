import React, { useState, useEffect } from 'react';
import './DirectoryMenu.css';
import DirectoryItem from './DirectoryItem';

function DirectoryMenu(props) {
    const [data,setData] = useState([]);

    useEffect(() => {
        fetch("/extract-dir-names")
        .then((res) => res.json())
        .then((data) => setData(data.message));
    });

    return (
        <div>
            { data.map((filename) => (
                <DirectoryItem name={filename} key={filename} handleSubdirSelect={props.handleSubdirSelect} handlePatientSelect={props.handlePatientSelect} />
            )) }
        </div>
    );
}

export default DirectoryMenu; 