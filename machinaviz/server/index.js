const { application } = require('express');
const express = require('express');
const fs = require('fs');

const DATA_CONTAINER = "../data/";
const DIRECTORY_CONTAINER = "../data/";
const PATIENT_CONTAINER = "../patient_lists/";

const PORT = process.env.PORT || 3001;

const app = express();

function myIndexOf(arr, elem) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes(elem)) {
            return i;
        }
    }
    return -1;
}

app.get("/extract-dir-names", (req, res) => {
    let fileArr = [];
    fs.readdirSync(DIRECTORY_CONTAINER).forEach(file => {
        if (file != "sims" && file != "sanborn_2015" && fs.lstatSync(DIRECTORY_CONTAINER + file).isDirectory()) {
            fileArr.push(file);
        }
    });
    res.json({ message: fileArr });
});

app.get("/extract-pmh-names", (req, res) => {
    var subdirectory = req.query.subdirectory;
    var patient = req.query.patient;

    let fileArr = [];

    fs.readdirSync(DATA_CONTAINER + subdirectory + "/" + patient + "/pmh").forEach(file => {
        var gname = file.split('.')[0]
        if (!fileArr.includes(gname)) {
            fileArr.push(gname);
        }
    });
    res.json({message: fileArr});
});

app.get("/extract-file-names", (req, res) => {
    var name = req.query.name;
    let patientArr = [];
    if (name !== "") {
        patientArr = fs.readFileSync(PATIENT_CONTAINER + name + ".csv", 'utf-8').split(",");
    }
    res.json({ message: patientArr });
});

app.get("/get-potential-labelings", (req, res) => {
    var subdirectory = req.query.subdirectory;
    var patient = req.query.patient;

    if (fs.existsSync(DATA_CONTAINER + subdirectory + "/" + patient + "/" + patient + ".reported.labeling", 'utf-8')) {
        fs.readFileSync(DATA_CONTAINER + subdirectory + "/" + patient + "/" + patient + ".reported.labeling", 'utf-8').split('\n');
        res.json({ labels: [] });
    } else {
        fs.readdir(DATA_CONTAINER + subdirectory + "/" + patient + "/potential_labelings", function(err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } else {
                res.json({ labels: files });
            }
        });
    }
});

app.get("/extract-patient-data", (req, res) => {
    var subdirectory = req.query.subdirectory;
    var patient = req.query.patient;
    var labelfile = req.query.labelfile;

    var nodeSet = new Set();
    var relationshipSet = new Set();
    var colorSet = Array.from(Array(40), () => []);

    // Load tree topology
    let treeStr = fs.readFileSync(DATA_CONTAINER + subdirectory + "/" + patient + "/" + patient + ".tree", 'utf-8').split('\n');
    
    // Load coloring
    let colorStr = fs.readFileSync(DATA_CONTAINER + subdirectory + "/coloring.txt", 'utf-8').split('\n');

    // Load labeling
    labelStr = "";
    if (labelfile == 'none') {
        labelStr = fs.readFileSync(DATA_CONTAINER + subdirectory + "/" + patient + "/" + patient + ".reported.labeling", 'utf-8').split('\n');
    } else {
        labelStr = fs.readFileSync(DATA_CONTAINER + subdirectory + "/" + patient + "/potential_labelings/" + labelfile, 'utf-8').split('\n');
    }

    for (let i = 0; i < treeStr.length; i++) {
        if (treeStr[i].length > 0) {
            //nodeSet.add(treeStr[i].split(" ")[0]);
            //nodeSet.add(treeStr[i].split(" ")[1]);
            relationshipSet.add([treeStr[i].split(" ")[0], treeStr[i].split(" ")[1]]);
        }
    }

    // Assign colors to labelling
    let ind = 0;
    for (let i = 0; i < colorStr.length; i++) {
        if (colorStr[i].length > 0) {
            ind = parseInt(colorStr[i].split(" ")[1])
            colorSet[ind].push(colorStr[i].split(" ")[0])
        }
    }

    for (let i = 0; i < labelStr.length; i++) {
        if (labelStr[i].length > 0) {
            nodeSet.add({
                node: labelStr[i].split(" ")[0],
                label: labelStr[i].split(" ")[1],
                color: myIndexOf(colorSet, labelStr[i].split(" ")[1])
            })
        }
    }

    var nodeArr = [];
    nodeSet.forEach((item) => nodeArr.push(item));

    var relationshipArr = [];
    relationshipSet.forEach((item) => relationshipArr.push(item));

    res.json({ nodes: nodeArr, relationships: relationshipArr });
})

app.get("/extract-pmh", (req, res) => {
    var subdirectory = req.query.subdirectory;
    var patient = req.query.patient;
    var pmh = req.query.pmh;

    var nodeSet = new Set();
    var relationshipSet = new Set();
    var colorSet = Array.from(Array(40), () => []);

    // Load coloring
    let colorStr = fs.readFileSync(DATA_CONTAINER + subdirectory + "/coloring.txt", 'utf-8').split('\n');

    // Load tree topology
    let edges = []
    let vertices = []
    let treeStr = fs.readFileSync(DATA_CONTAINER + subdirectory + "/" + patient + "/pmh/" + pmh + ".tree", 'utf-8').split('\n');

    treeStr.forEach((edge) => {edges.push(edge.split(" "))});

    if (fs.existsSync(DATA_CONTAINER + subdirectory + "/" + patient + "/pmh/" + pmh + ".labeling")) {
        // Load labeling
        let labelStr = fs.readFileSync(DATA_CONTAINER + subdirectory + "/" + patient + "/pmh/" + pmh + ".labeling", 'utf-8').split('\n');

        labelStr.forEach((label) => {
            var v = label.split(" ")[0]
            var l = label.split(" ")[1]

            for (let i = 0; i < edges.length; i++) {
                if (edges[i][0] == v) {
                    edges[i][0] = l;
                }
                if (edges[i][1] == v) {
                    edges[i][1] = l;
                }
            }
        })
    }

    edges.forEach((edge) => {
        if (!vertices.includes(edge[0])) {
            vertices.push(edge[0])
        }
        if (!vertices.includes(edge[1])) {
            vertices.push(edge[1])
        }
    });

    // Assign colors to labelling
    let ind = 0;
    for (let i = 0; i < colorStr.length; i++) {
        if (colorStr[i].length > 0) {
            ind = parseInt(colorStr[i].split(" ")[1])
            colorSet[ind].push(colorStr[i].split(" ")[0])
        }
    }

    edges.forEach((edge) => {relationshipSet.add(edge)})

    vertices.forEach((vertex) => {
        nodeSet.add({
            node: vertex,
            label: vertex,
            color: myIndexOf(colorSet, vertex)
        });
    })

    var nodeArr = [];
    nodeSet.forEach((item) => {if (item.color != -1) {nodeArr.push(item)}});

    var relationshipArr = [];
    relationshipSet.forEach((item) => {if (item != [''] && item != [undefined]) {relationshipArr.push(item)}});

    res.json({ nodes: nodeArr, relationships: relationshipArr });
});

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});