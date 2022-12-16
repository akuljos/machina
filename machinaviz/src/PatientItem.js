import React from 'react';
import './PatientItem.css';

var patient_clickable = true;

export function setPatientClickable(pc) {
    patient_clickable = pc;
}

function PatientItem(props) {

    var panelId = 'patient-panel-' + props.name;
    var identId = 'patient-ident-' + props.name;

    function onPanelClicked() {
        var curr_class = document.getElementById(panelId).getAttribute('class');

        if (curr_class === 'PatientItem-panel' && patient_clickable) {
            document.getElementById(panelId).setAttribute('class', 'PatientItem-panel-clicked');
            document.getElementById(identId).setAttribute('class', 'PatientItem-ident-clicked');
            setPatientClickable(false);
            props.handlePatientSelect(props.name)
        } else if (curr_class === 'PatientItem-panel-clicked') {
            document.getElementById(panelId).setAttribute('class', 'PatientItem-panel');
            document.getElementById(identId).setAttribute('class', 'PatientItem-ident');
            setPatientClickable(true);
            props.handlePatientSelect("");
        }
    }

    return (
        <div className="PatientItem-panel" id={panelId} onClick={onPanelClicked} >
            <p className="PatientItem-ident" id={identId} >{props.name}</p>
        </div>
    );
}

export default PatientItem;