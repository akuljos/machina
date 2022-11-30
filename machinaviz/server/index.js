const express = require('express');
const fs = require('fs');

const DIRECTORY_CONTAINER = "../result/";
const PATIENT_CONTAINER = "../patient_lists/";

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/extract-dir-names", (req, res) => {
    let fileArr = [];
    fs.readdirSync(DIRECTORY_CONTAINER).forEach(file => {
        if (fs.lstatSync(DIRECTORY_CONTAINER + file).isDirectory()) {
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

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});