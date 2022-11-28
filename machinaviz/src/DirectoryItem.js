import React from 'react';
import './DirectoryItem.css';

function DirectoryItem(props) {
    return (
        <p>{props.name}</p>
    );
}

export default DirectoryItem;