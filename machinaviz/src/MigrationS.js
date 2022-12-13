import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import { v4 as uuidv4 } from 'uuid';

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

async function getPotentialLabelings(subdirectory, patient) {
    const response = await fetch(`/get-potential-labelings?subdirectory=${subdirectory}&patient=${patient}`);
    const data = await response.json();

    return data;
}

async function extractPatientData(subdirectory, patient, labelfile) {
    const response = await fetch(`/extract-patient-data?subdirectory=${subdirectory}&patient=${patient}&labelfile=${labelfile}`);
    const data = await response.json();

    return data;
}

function MigrationS(props) {
    var built_nodes = [];
    var built_relationships = [];

    const [graph,setGraph] = useState({
        nodes: [],
        edges: []
    });

    const [msg,setMsg] = useState("");
    const [labels, setLabels] = useState([]);
    const [label, setLabel] = useState("");

    if (props.subdirectory !== "" && props.patient !== "") {
        getPotentialLabelings(props.subdirectory, props.patient).then((data) => setLabels(data.labels));

        if (labels.length == 0) {
            extractPatientData(props.subdirectory, props.patient, 'none').then((data) => { 
                for (var i = 0; i < data.nodes.length; i++) {
                    built_nodes.push({ id: "graph_node_" + data.nodes[i].node, name: data.nodes[i].node, title: data.nodes[i].node, color: colors[data.nodes[i].color] });
                }

                for (var i = 0; i < data.relationships.length; i++) {
                    built_relationships.push({ from: "graph_node_" + data.relationships[i][0], to: "graph_node_" + data.relationships[i][1] })
                }
            })
            .then(() => setGraph({
                nodes: built_nodes,
                edges: built_relationships
            }))
            .then(() => setMsg("Clone Tree"));
        } else {
            if (label != "") {
                extractPatientData(props.subdirectory, props.patient, label).then((data) => { 
                    for (var i = 0; i < data.nodes.length; i++) {
                        built_nodes.push({ id: "graph_node_" + data.nodes[i].node, name: data.nodes[i].node, title: data.nodes[i].node, color: colors[data.nodes[i].color] });
                    }

                    for (var i = 0; i < data.relationships.length; i++) {
                        built_relationships.push({ from: "graph_node_" + data.relationships[i][0], to: "graph_node_" + data.relationships[i][1] })
                    }
                })
                .then(() => setGraph({
                    nodes: built_nodes,
                    edges: built_relationships
                }))
                .then(() => setMsg("Clone Tree"));
            }
        }
    }

    const options = {
        layout: {
            hierarchical: true
        },
        height: "250px",
        width: "50%",
        physics: {
            enabled: false
        }
    };

    const events = {
        select: function(event) {
            var { nodes, edges } = event;
        }
    };

    if (labels.length == 0) {
        return (
            <div align="left" className="phylogeny">
            <h3>{msg}</h3>
            <Graph
                key={uuidv4()}
                graph={graph}
                options={options}
                events={events}
                getNetwork={network => {
                //  if you want access to vis.js network api you can set the state in a parent component using this property
                }}
            />
            </div>
        );
    } else {
        let handleChange = (e) => {
            setLabel(e.target.value)
        }

        return (
            <div align="left" className="phylogeny">
                <h3>{msg}</h3>
                <select onChange={handleChange}> 
                    <option value="⬇️ Select labeling ⬇️"><p>-- Select labeling -- </p></option>
                    {labels.map((label) => <option value={label}>{label}</option>)}
                </select>
                <Graph
                    key={uuidv4()}
                    graph={graph}
                    options={options}
                    events={events}
                    getNetwork={network => {
                    //  if you want access to vis.js network api you can set the state in a parent component using this property
                    }}
                />
            </div>
        );
    }
}

export default MigrationS;