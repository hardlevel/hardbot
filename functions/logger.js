const fs = require('fs');
const util = require('util');
const path = require('path');

const logsDir = path.join(baseDir + '/logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log('Directory created:', logsDir);
}
    else {
    console.log("Directory exists!")
}

const fileLog = fs.createWriteStream(logsDir + '/server.log', {flags : 'w'});
const ErrorLog = fs.createWriteStream(logsDir + '/error.log', {flags : 'w'});
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