
const express = require('express');

const serial = require('./serial.js');


let app = express();





app.get('/', function(req, res) {

    res.json(serial.data);

})

let server = require('http').Server(app);

// le serveur attend les connexions sur le port 'config.port'
server.listen(8090, function() {

  console.log('listening on *:' + 8090);

});
