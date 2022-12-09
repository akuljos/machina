const { application } = require('express');
const express = require('express');
const fs = require('fs');

const DATA_CONTAINER = "../data/";
const DIRECTORY_CONTAINER = "../result/";
const PATIENT_CONTAINER = "../patient_lists/";

const PORT = process.env.PORT || 3001;

const app = express();

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

app.get("/extract-patient-data", (req, res) => {
    var subdirectory = req.query.subdirectory;
    var patient = req.query.patient;

    var nodeSet = new Set();
    var relationshipSet = new Set();

    let treeStr = fs.readFileSync(DATA_CONTAINER + subdirectory + "/" + patient + "/" + patient + ".tree", 'utf-8').split('\n');
    

    for (let i = 0; i < treeStr.length; i++) {
        if (treeStr[i].length > 0) {
            nodeSet.add(treeStr[i].split(" ")[0])
            nodeSet.add(treeStr[i].split(" ")[1]);
            relationshipSet.add([treeStr[i].split(" ")[0], treeStr[i].split(" ")[1]]);
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