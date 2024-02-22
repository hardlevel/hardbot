const fs = require('fs');
const util = require('util');
const path = require('path');

const logsDir = path.join(baseDir + '/logs');

try {
  if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      //console.log('Directory created:', logsDir);
  }
} catch (error) {
  let date = new Date();
  console.error(date, error.message);
}

const fileLog = fs.createWriteStream(logsDir + '/server.log', {flags : 'w'});
const ErrorLog = fs.createWriteStream(logsDir + '/error.log', {flags : 'w'});
const logOutput = process.stdout;


// the flag 'a' will update the stream log at every launch
console.log  = (e) => {
  let date = new Date();
  fileLog.write(util.format(date + ' | log: ' + e) + '\n');
  logOutput.write(util.format(date + ' | log: ' + e) + '\n');
};


console.error = (e) => {
  let date = new Date();
  ErrorLog.write(util.format(date + ' | error: ' + e) + '\n');
}


module.exports = {console}