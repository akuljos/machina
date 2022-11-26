import React from 'react';
import './Directory.css';
import file_add from "./file_add.svg";

function Directory() {
    return (
        <div className="Directory">
            <label className="file-add" >
                <input type="file" alt="file" />
                <img className="file-add-image" src={file_add} />
            </label>
        </div>
    );
}

export default Directory;