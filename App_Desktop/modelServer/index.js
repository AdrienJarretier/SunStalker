
const express = require('express');

const common = require('../common.js')

const config = common.modelServerConfig

const dataModel = require('./dataModel.js')


let app = express();


let apiIRIS = ['getLocalPhotoValue', 'getSunPosition']


app.get('/', function (req, res) {

  res.send(
    '<ul>'
    + '<li><a href="getLocalPhotoValue">getLocalPhotoValue</a></li>'
    + '<li><a href="getSunPosition">getSunPosition</a></li>'
    + '</ul>'
  )

})



app.get('/getLocalPhotoValue', function (req, res) {

  let pr = dataModel.getLocalPhotoValue()

  pr.then((v) => {

    res.json(v)

  })

})


app.get('/getSunPosition', function (req, res) {

  let pr = dataModel.getLocalPhotoValue()

  pr.then((v) => {


    res.json(Math.max(...v) == v[0] ? 0 : Math.max(...v) == v[1] ? 0.5 : 1)

  })

})

let server = require('http').Server(app);

// le serveur attend les connexions sur le port 'config.port'
server.listen(config.port, function () {

  console.log('listening on *:' + config.port);

});
