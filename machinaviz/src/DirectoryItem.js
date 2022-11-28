import React from 'react';
import './DirectoryItem.css';

function DirectoryItem(props) {

    var panelId = 'panel-' + props.name;
    var identId = 'ident-' + props.name;

    function onPanelClicked() {
        var curr_class = document.getElementById(panelId).getAttribute('class');

        if (curr_class === 'DictionaryItem-panel') {
            document.getElementById(panelId).setAttribute('class', 'DictionaryItem-panel-clicked');
            document.getElementById(identId).setAttribute('class', 'DictionaryItem-ident-clicked');
        } else {
            document.getElementById(panelId).setAttribute('class', 'DictionaryItem-panel');
            document.getElementById(identId).setAttribute('class', 'DictionaryItem-ident');
        }
    }

    return (
        <div className="DictionaryItem-panel" id={panelId} onClick={onPanelClicked} >
            <p className="DictionaryItem-ident" id={identId} >{props.name}</p>
        </div>
    );
}

export default DirectoryItem;