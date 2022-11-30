import React from 'react';
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";

function MigrationS() {
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
    const graph = {
        nodes: [
            { id: 1, label: "right_rib_7", title: "right_rib_7" },
            { id: 2, label: "right_subdural", title: "right_subdural" },
            { id: 3, label: "right_inguinal_lymph_node", title: "right_inguinal_lymph_node" },
            { id: 4, label: "prostate", title: "prostate" },
            { id: 5, label: "left_adrenal_gland", title: "left_adrenal_gland" }
        ],
        edges: [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 1, to: 3 },
            { from: 4, to: 1 },
            { from: 4, to: 5 },
            { from: 4, to: 1 },
            { from: 4, to: 5 },
            { from: 4, to: 5 }
        ]
        };

        const options = {
        /*layout: {
            hierarchical: true
        },*/
        edges: {
            color: "#000000"
        },
        height: "500px"
        };

        const events = {
        select: function(event) {
            var { nodes, edges } = event;
        }
    };

    return (
        <Graph
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