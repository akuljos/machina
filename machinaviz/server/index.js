const express = require('express');
const fs = require('fs');

const DIRECTORY_CONTAINER = "../data/";

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

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});