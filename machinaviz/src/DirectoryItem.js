import React from 'react';
import './DirectoryItem.css';
import { setPatientClickable } from './PatientItem';

var directory_clickable = true;

function DirectoryItem(props) {

    var panelId = 'directory-panel-' + props.name;
    var identId = 'directory-ident-' + props.name;

    function onPanelClicked() {
        var curr_class = document.getElementById(panelId).getAttribute('class');

        if (curr_class === 'DirectoryItem-panel' && directory_clickable) {
            document.getElementById(panelId).setAttribute('class', 'DirectoryItem-panel-clicked');
            document.getElementById(identId).setAttribute('class', 'DirectoryItem-ident-clicked');
            directory_clickable = false;
            props.handleSubdirSelect(props.name);
        } else if (curr_class === 'DirectoryItem-panel-clicked') {
            document.getElementById(panelId).setAttribute('class', 'DirectoryItem-panel');
            document.getElementById(identId).setAttribute('class', 'DirectoryItem-ident');
            directory_clickable = true;
            setPatientClickable(true);
            props.handlePatientSelect("");
            props.handleSubdirSelect("");
        }
    }

    return (
        <div className="DirectoryItem-panel" id={panelId} onClick={onPanelClicked} >
            <p className="DirectoryItem-ident" id={identId} >{props.name}</p>
        </div>
    );
}

export default DirectoryItem;