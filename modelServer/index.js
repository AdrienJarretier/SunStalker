'use strict';

const express = require('express');

const common = require('../common.js')

const config = common.modelServerConfig

const dataModel = require('./dataModel.js')


let app = express();


let apiIRIS = ['getLocalPhotoValue', 'getSunPosition']




app.get('/getLocalPhotoValue', function (req, res) {

  let pr = dataModel.getLocalPhotoValue()

  pr.then((v) => {

    res.json(v)

  })

})


app.get('/getSunPosition', function (req, res) {

  let pr = dataModel.getLocalPhotoValue()

  pr.then((v) => {

    if (v)
      res.json(Math.max(...v) == v[0] ? 0 : Math.max(...v) == v[1] ? 0.5 : 1)


  })

})


app.get('/getConnectedDevice', function (req, res) {

  let returnObject = {

    connectedDevice: dataModel.getConnectedDevice()

  };

  res.json(returnObject);

});


app.get('/getSunRiseSunSet', function (req, res) {

  let pr = dataModel.getSunRiseSunSet();

  pr.then((v) => {

    res.json(v);

  })

});


app.get('/getHeliotPower', function (req, res) {

  let pr = dataModel.getHeliotPower();

  pr.then((v) => {

    res.json(v);

  })

});

let getsList = '<ul>';

for (let layer of app._router.stack) {

  if (layer.route) {

    // paths.push(layer.route.path)

    getsList += '<li><a href="' + layer.route.path + '">' + layer.route.path + '</a></li>';

    // res.send(
    //   '<ul>'
    //   + '<li><a href="getLocalPhotoValue">getLocalPhotoValue</a></li>'
    //   + '<li><a href="getSunPosition">getSunPosition</a></li>'
    //   + '</ul>'
    // )


  }

}

getsList += '</ul>';

app.get('/', function (req, res) {
  res.send(getsList);
})



let server = require('http').Server(app);

// le serveur attend les connexions sur le port 'config.port'
server.listen(config.port, function () {

  console.log('listening on *:' + config.port);

});
