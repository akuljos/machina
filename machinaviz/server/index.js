const { application } = require('express');
const express = require('express');
const fs = require('fs');

const DATA_CONTAINER = "../data/";
const DIRECTORY_CONTAINER = "../result/";
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
        if (file != "sims" && fs.lstatSync(DIRECTORY_CONTAINER + file).isDirectory()) {
            fileArr.push(file);
        }
    });
    res.json({ message: fileArr });
});

app.get("/extract-file-names", (req, res) => {
    var name = req.query.name;
    let patientArr = [];
    if (name !== "") {
        patientArr = fs.readFileSync(PATIENT_CONTAINER + name + ".csv", 'utf-8').split(",");
    }
    res.json({ message: patientArr });
})

app.get("/get-potential-labelings", (req, res) => {
    var subdirectory = req.query.subdirectory;
    var patient = req.query.patient;

    try {
        fs.readFileSync(DATA_CONTAINER + subdirectory + "/" + patient + "/" + patient + ".reported.labeling", 'utf-8').split('\n');
        res.json({ labels: [] });
    } catch (error) {
        fs.readdir(DATA_CONTAINER + subdirectory + "/" + patient + "/potential_labelings", function(err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } else {
                res.json({ labels: files });
            }
        });
    }
})

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

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});