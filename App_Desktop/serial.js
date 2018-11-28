
const serialport = require("serialport");
const Readline = require('@serialport/parser-readline');


let data;
exports.data = data;


const port = new serialport('/dev/ttyACM0', {

    autoOpen: false

    ,baudRate: 9600

 });

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
})





const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', (d) => {

    d = d.split(',');

    console.log(d);
    data = d;

})