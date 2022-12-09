import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import { v4 as uuidv4 } from 'uuid';

function MigrationS(props) {
    /*
    right_rib_7 right_subdural
    right_rib_7 right_inguinal_lymph_node
    right_rib_7 right_subdural
    right_rib_7 right_inguinal_lymph_node
    right_rib_7 right_inguinal_lymph_node
    prostate right_rib_7
    prostate left_adrenal_gland
    prostate right_rib_7
    prostate left_adrenal_gland
    prostate left_adrenal_gland
    */

    var built_nodes = [];
    var built_relationships = [];

    const [graph,setGraph] = useState({
        nodes: [],
        edges: []
    });

    if (props.subdirectory !== "" && props.patient !== "") {
        fetch(`/extract-patient-data?subdirectory=${props.subdirectory}&patient=${props.patient}`)
        .then((res) => res.json())
        .then((data) => { 
            for (var i = 0; i < data.nodes.length; i++) {
                built_nodes.push({ id: "graph_node_" + data.nodes[i], name: data.nodes[i], title: data.nodes[i] });
            }

            for (var i = 0; i < data.relationships.length; i++) {
                built_relationships.push({ from: "graph_node_" + data.relationships[i][0], to: "graph_node_" + data.relationships[i][1] })
            }

        })
        .then(() => setGraph({
            nodes: built_nodes,
            edges: built_relationships
        }));
    }

    const options = {
        layout: {
            hierarchical: true
        },
        edges: {
            color: "#000000"
        },
        height: "500px",
        physics: {
            enabled: false
        }
    };

    const events = {
        select: function(event) {
            var { nodes, edges } = event;
        }
    };

    return (
        <Graph
            key={uuidv4()}
            graph={graph}
            options={options}
            events={events}
            getNetwork={network => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
        />
    );
}

export default MigrationS;