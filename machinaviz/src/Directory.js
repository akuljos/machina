import React, { useState, useEffect } from 'react';
import './Directory.css';
import file_add from "./file_add.svg";
import DirectoryItem from './DirectoryItem';

function Directory() {
    const [data,setData] = useState([]);

    useEffect(() => {
        fetch("/extract-dir-names")
        .then((res) => res.json())
        .then((data) => setData(data.message));
    });

    return (
        <div className="Directory">
            { data.map((filename) => (
                <DirectoryItem name={filename} key={filename} />
            )) }
            <label className="file-add" >
                <input type="file" alt="file" />
                <img className="file-add-image" src={file_add} alt="file-add-img" />
            </label>
        </div>
    );
}

export default Directory; 