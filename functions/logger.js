const fs = require('fs');
const util = require('util');

const fileLog = fs.createWriteStream(baseDir + '/logs/server.log', {flags : 'w'});
const ErrorLog = fs.createWriteStream(baseDir + '/logs/error.log', {flags : 'w'});
const logOutput = process.stdout;


// the flag 'a' will update the stream log at every launch
console.log  = (e) => { 
    fileLog.write(util.format(e) + '\n');
    logOutput.write(util.format(e) + '\n');
};


console.error = (e) => {
    ErrorLog.write(util.format(e) + '\n');
}


module.exports = {console}