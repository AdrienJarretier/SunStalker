
const express = require('express');
const serialport = require("serialport");
const Readline = require('@serialport/parser-readline');


let app = express();


const port = new serialport('/dev/ttyACM0', {

    autoOpen: false

    ,baudRate: 9600

 });

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
})


let data;


const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', (d) => {

    d = d.split(',');

    console.log(d);
    data = d;

})


app.get('/', function(req, res) {

    res.json(data);

})

let server = require('http').Server(app);

// le serveur attend les connexions sur le port 'config.port'
server.listen(8090, function() {

  console.log('listening on *:' + 8090);

});
