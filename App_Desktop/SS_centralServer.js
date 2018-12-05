var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ----------------------------------------------------------

var dataMap = {}
var objectMap = {}

// -------------------------------

function generateToken() {
  let timestamp = new Date().getTime()
  let token = '_'+timestamp+'_SunStalker'
  return token
}

function getFullOrient() {

  let orients = []
  for(let token in dataMap) {
    orients.push(dataMap[token])
  }

  return orients

}

// ----------------------------------------------------------

app.post("/setMyOrientation", (req, res, next) => {
  
  let token = req.body.token;
  let orientData = req.body.orientData;

  console.log(token,'set its orientation to',orientData)

  dataMap[token] = orientData

});

// ----------------------

app.get("/requireToken", (req, res, next) => {
  res.json(generateToken())
});

app.get("/getFullOrient", (req, res, next) => {
  res.json(getFullOrient())
});

// ----------------------------------------------------------

app.listen(8080, () => {
  console.log("SunStalker central server listening on 8080");
});