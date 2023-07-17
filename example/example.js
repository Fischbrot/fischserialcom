const fischcom = require('../index.js');
//const fischcom = require('serialcomport');

// Set the baud rate and path
let config = {
  baudrate: 9600,
  path: '/dev/ttyUSB0',
  debug: false
}

fischcom.setSerialConfig(config)
  .then(() => {
    console.log('Serial configuration set');

    // Read from the serial port
    fischcom.readSerialData(config, onDataReceived);

    // Write to the serial port
    fischcom.writeSerialData(config, '1\r')
      .then(() => {
        console.log('Data written to serial port');
      })
      .catch(error => {
        console.error('Error writing to serial port:', error);
      });

      // ask every second for data
      setInterval(() => {
        fischcom.writeSerialData(config, '1\r')
        .then(() => {
          console.log('Data written to serial port');
        })
        .catch(error => {
          console.error('Error writing to serial port:', error);
        });
      }, 1000)
      // -- ask every second for data --
  })
  .catch(error => {
    console.error('Error setting serial configuration:', error);
  });

// Function to handle received data from the serial port
function onDataReceived(data) {
  console.log('Received data:', data);
}

// Function to gracefully stop the cat process when needed
process.on('SIGINT', () => {
  fischcom.stopCatProcess();
  process.exit();
});
