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

async function getPMHs(subdirectory, patient) {
    const response = await fetch(`/extract-pmh-names?subdirectory=${subdirectory}&patient=${patient}`);
    const data = await response.json();
    
    return data;
}

async function getPMH(subdirectory, patient, pmh) {
    const response = await fetch(`/extract-pmh?subdirectory=${subdirectory}&patient=${patient}&pmh=${pmh}`);
    const data = await response.json();
    
    return data;
}

function Migration(props) {
    var built_nodes = [];
    var built_relationships = [];

    const [graph, setGraph] = useState({
        nodes: [],
        edges: []
    });

    // Style up the graph
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

    // Event handler for the graph? (Not actually sure what this is...)
    const events = {
        select: function(event) {
            var { nodes, edges } = event;
        }
    };

    const [pmhs, setPMHs] = useState([]);
    const [pmh, setPMH] = useState("");

    useEffect(() => {
        getPMHs(props.subdirectory, props.patient)
            .then((data) => setPMHs(data.message));
    });

    useEffect(() => {
        if (pmh !== "") {
            getPMH(props.subdirectory, props.patient, pmh)
                .then((data) => { 
                    // Extract nodes and labels
                    for (var i = 0; i < data.nodes.length; i++) {
                        built_nodes.push({ id: "graph_node_" + data.nodes[i].node, name: data.nodes[i].node, title: data.nodes[i].node, color: colors[data.nodes[i].color] });
                    }

                    // Extract edges
                    for (var i = 0; i < data.relationships.length; i++) {
                        built_relationships.push({ from: "graph_node_" + data.relationships[i][0], to: "graph_node_" + data.relationships[i][1] })
                    }
                })
                // Set states
                .then(() => setGraph({
                    nodes: built_nodes,
                    edges: built_relationships
                }));
        } else {
            setGraph({
                nodes: [],
                edges: []
            })
        }
    }, [pmh]);

    // Event handler for labelfile selection
    let handleChange = (e) => {
        setPMH(e.target.value)
    }

    return (
        <div className="phylogeny">
            <h3>Migration Graph</h3>
            <span>Select PMH File: <select onChange={handleChange}> 
                <option key="default" value="">-- Select PMH --</option>
                {pmhs.map((pmh) => <option key={pmh} value={pmh}>{pmh}</option>)}
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
        </div>);
}

export default Migration;