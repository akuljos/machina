import React, { useState, useEffect } from 'react';
import './PatientMenu.css';
import PatientItem from './PatientItem.js';

function PatientMenu(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`/extract-file-names?name=${props.subdirectory}`)
        .then((res) => res.json())
        .then((data) => setData(data.message));
    })

    return (
        <div>
            { data.map((filename) => (
                <PatientItem name={filename} key={filename} />
            )) }
        </div>
    );
}

export default PatientMenu;