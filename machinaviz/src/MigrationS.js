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

/** It's basically the zip(arr1, arr2) function from Python
 * 
 * @param {*} arrays arrays to zip
 * @returns Ex. [1, 2, 3], [a, b, c] -> [[1, a], [2, b], [3, c]]
 */
function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

/** Async API call to get .labeling files for unreported datasets (PMH Sakoff outputs)
 * 
 * @param {*} subdirectory dataset
 * @param {*} patient patient ID
 * @returns list of PMH Sankoff output files
 */
async function getPotentialLabelings(subdirectory, patient) {
    const response = await fetch(`/get-potential-labelings?subdirectory=${subdirectory}&patient=${patient}`);
    const data = await response.json();

    return data;
}

/** Async API call to get patient clonal graph data
 * 
 * @param {*} subdirectory dataset
 * @param {*} patient patient ID
 * @param {*} labelfile .labeling file if labeling is not reported (none otherwise)
 * @returns patient clonal graph edge list
 */
async function extractPatientData(subdirectory, patient, labelfile) {
    const response = await fetch(`/extract-patient-data?subdirectory=${subdirectory}&patient=${patient}&labelfile=${labelfile}`);
    const data = await response.json();

    return data;
}

/** HTML Clonal graph object
 * 
 * @param {*} props HTML props (subdirectory, patient)
 * @returns HTML tag components
 */
function MigrationS(props) {
    var built_nodes = [];
    var built_relationships = [];
    var label2color = {};

    const [graph,setGraph] = useState({
        nodes: [],
        edges: []
    });

    const [msg, setMsg] = useState("");
    const [labels, setLabels] = useState([]);
    const [label, setLabel] = useState("");
    const [map, setMap] = useState({});
    const [legend, setLegend] = useState("");

    if (props.subdirectory !== "" && props.patient !== "") {
        getPotentialLabelings(props.subdirectory, props.patient).then((data) => setLabels(data.labels));

        if (labels.length == 0) {
            extractPatientData(props.subdirectory, props.patient, 'none').then((data) => { 
                for (var i = 0; i < data.nodes.length; i++) {
                    built_nodes.push({ id: "graph_node_" + data.nodes[i].node, name: data.nodes[i].node, title: data.nodes[i].node, color: colors[data.nodes[i].color] });
                    label2color[data.nodes[i].label] = colors[data.nodes[i].color]
                }

                for (var i = 0; i < data.relationships.length; i++) {
                    built_relationships.push({ from: "graph_node_" + data.relationships[i][0], to: "graph_node_" + data.relationships[i][1] })
                }
            })
            .then(() => setGraph({
                nodes: built_nodes,
                edges: built_relationships
            }))
            .then(() => setMsg("Clone Tree"))
            .then(() => setMap(label2color))
            .then(() => setLegend("Legend"));
        } else {
            if (label != "") {
                extractPatientData(props.subdirectory, props.patient, label).then((data) => { 
                    for (var i = 0; i < data.nodes.length; i++) {
                        built_nodes.push({ id: "graph_node_" + data.nodes[i].node, name: data.nodes[i].node, title: data.nodes[i].node, color: colors[data.nodes[i].color] });
                        label2color[data.nodes[i].label] = colors[data.nodes[i].color]
                    }

                    for (var i = 0; i < data.relationships.length; i++) {
                        built_relationships.push({ from: "graph_node_" + data.relationships[i][0], to: "graph_node_" + data.relationships[i][1] })
                    }
                })
                .then(() => setGraph({
                    nodes: built_nodes,
                    edges: built_relationships
                }))
                .then(() => setMsg("Clone Tree"))
                .then(() => setMap(label2color))
                .then(() => setLegend("Legend"));
            }
        }
    }
    const options = {
        layout: {
            hierarchical: true
        },
        height: "250px",
        width: "100%",
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
                <div className="clonalcontain">
                    <div className='clonalchild'>
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
                    <div className="clonalchild">
                        <h3>{legend}</h3>
                        <ul>
                            {zip([Object.keys(map), Object.values(map)]).map((l) => <li style={{color: l[1], liststyle: "circle"}}><p style={{color: "black"}}>{l[0]}</p></li>)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    } else {
        let handleChange = (e) => {
            setLabel(e.target.value)
        }

        return (
            <div align="left" className="phylogeny">
                <div className="clonalcontain">
                    <div className="clonalchild">
                        <h3>{msg}</h3>
                        <span>Select Label File: <select onChange={handleChange}> 
                            <option value="⬇️ Select labeling ⬇️"><p>-- Select labeling -- </p></option>
                            {labels.map((label) => <option value={label}>{label}</option>)}
                        </select></span>
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
                    <div className="clonalchild">
                        <h3>{legend}</h3>
                        <ul>
                            {zip([Object.keys(map), Object.values(map)]).map((l) => <li style={{color: l[1], liststyle: "circle"}}><p style={{color: "black"}}>{l[0]}</p></li>)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default MigrationS;