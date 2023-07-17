const { spawn, exec } = require('child_process');

let catProcess; // Store reference to the cat process

function logger(data, debug=false) {
  if(debug) {
    console.log(data)
  }
}

// Function to set the baud rate and path
function setSerialConfig(config) {
  return new Promise((resolve, reject) => {
    let {baudrate, path, debug} = config
    const command = `stty ${baudrate} -F ${path}`;
    logger("--------", debug);
    logger(`EXECUTE: ${command}`, debug);
    logger("========", debug);
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
    process.on('close', () => {
      resolve();
    });
  });
}

// Function to read from the serial port
function readSerialData(config, onData) {  
  return new Promise((resolve, reject) => {
    let {path, debug} = config
    const command = `cat ${path}`;
    logger("--------", debug);
    logger(`EXECUTE: ${command}`, debug);
    logger("========", debug);
    catProcess = spawn('sh', ['-c', command]);

    catProcess.stdout.on('data', (data) => {
      onData(data.toString());
    });

    catProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    catProcess.on('error', (error) => {
      reject(error);
    });

    catProcess.on('close', () => {
      resolve();
    });
  });
}

// Function to write to the serial port
function writeSerialData(config, data) {
  return new Promise((resolve, reject) => {
    let {path, debug} = config
    const command = `echo -e "${data}" > ${path}`;
    logger("--------", debug);
    logger(`EXECUTE: ${command}`, debug);
    logger("========", debug);
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
    process.on('close', () => {
      resolve();
    });
  });
}

// Function to stop the cat process and clean up resources
function stopCatProcess() {
  if (catProcess) {
    catProcess.kill();
    catProcess = null;
  }
}

module.exports = {
  setSerialConfig,
  readSerialData,
  writeSerialData,
  stopCatProcess,
};
