const http = require('http');
const https = require('https');
const fs = require('fs');


const writeFile = (fileName, string) => {
    const callback = (err) => {
        if (err) {
            console.log('file write error, ', err);
        }
        console.log('The file has been saved!');
    };

    fs.writeFile(fileName, string, 'utf8', callback);
};

const httpCallback = () => {

};

const downloadFileHttps = (url) => {
    https.get(url);
};


const downloadFile = (url) => {


};


const output = {
    downloadFile,
};

export default output;


