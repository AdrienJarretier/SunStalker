const serialport = require("serialport")
var port = new serialport('/dev/ttyACM1', { autoOpen: false });

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
})


port.on('data', function (data) {
  console.log('Datad:', data.toString());
});
 
// Read data that is available but keep the stream from entering "flowing mode"
port.on('readable', function () {
  console.log('Datar:', port.read());
});


