'use strict';


const common = require('../common.js')
const config = common.centralServerConfig

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ----------------------------------------------------------

var appObjects = {}
var objectsMap = {}

// -------------------------------

function generateToken() {
  let timestamp = new Date().getTime()
  let token = '_'+timestamp+'_SunStalker'
  return token
}

function getFullOrient() {

  let orients = []
  for(let token in appObjects) {
    if(appObjects[token].Sensor != null)
      orients.push(objectsMap[appObjects[token].Sensor].data.photoCellValues)
  }

  return orients

}

function getAppSpace(appToken) {

  if(!appObjects.hasOwnProperty(appToken))
    appObjects[appToken] = {'Heliot':null,'Sensor':null}
  return appObjects[appToken]
}

function getObjectSpace(objid) {

  if(!objectsMap.hasOwnProperty(objid))
    objectsMap[objid] = {'object':null,'data':null}
  return objectsMap[objid]
}

function setObject(appToken, objType, object) {
  let appSpace = getAppSpace(appToken)
  let objectSpace = getObjectSpace(object.id)

  appSpace[objType] = object.id
  objectSpace.object = object
}

function removeObject(appToken, objType) {
  let appSpace = getAppSpace(appToken)
  if(appSpace[objType] != null) {
    let old_object_id = appSpace[objType]
    appSpace[objType] = null
    delete objectsMap[old_object_id]
  }
}

function setData(appToken, objType, data) {
  let appSpace = getAppSpace(appToken)

  if(appSpace[objType] == null)
    return false

  let objectSpace = getObjectSpace(appSpace[objType])
  objectSpace.data = data
  return true
}

function createRes(res,code, message, useHtml = false) {
  res.status(code);
  if(useHtml === true)
    message = '<h1><b><u>Code: '+code+'</u></b>: '+message+'</h1>'
  else
    message = code+' - '+message+'\n\r'
  console.log(message)
  res.send(message);
  return res
}

function createJSONresponse(res,jsonData) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(jsonData));
  return res
}
// ----------------------------------------------------------

app.post("/setMyData", (req, res, next) => {
  
  let appToken = req.body.token;
  let objectType = req.body.objectType;
  let objectData = req.body.objectData;

  console.log(appToken,'trys to set its data for object',objectType,objectData)

  if(!setData(appToken, objectType, objectData))
    return createRes(res,401, 'error while updating data, object is not uploaded')

  return createRes(res,200, 'data updated')

});

app.post("/setMyObject", (req, res, next) => {
  
  let appToken = req.body.token;
  let objectType = req.body.objectType;
  let object = req.body.object;

  console.log(appToken,'set its representation for object',objectType)

  if(object == null) {
    removeObject(appToken, objectType)
    return createRes(res,200, 'object removed')
  }
  else {
    setObject(appToken, objectType, object)
    return createRes(res,200, 'object updated')
  }

});

// ----------------------

app.get("/getObjects/:apptoken", (req, res, next) => {
  
  let apptoken = req.params.apptoken;

  console.log('someone trys to get all objects from',apptoken)

  if(!appObjects.hasOwnProperty(apptoken)) {
    return createRes(res,401, 'apptoken cannot be found')
  }

  let heliotId = appObjects[apptoken].Heliot
  let sensorId = appObjects[apptoken].Sensor

  let objs = {}

  if(heliotId == null)
    objs['Heliot'] = null
  else
    objs['Heliot'] = objectsMap[heliotId]

  if(sensorId == null)
    objs['Sensor'] = null
  else
    objs['Sensor'] = objectsMap[sensorId]

  return createJSONresponse(res,objs)

});

app.get("/objects/:objid/:property", (req, res, next) => {
  
  let objid = req.params.objid;
  let property = req.params.property;

  console.log('someone trys to get data',property,'from object',objid)

  if(!objectsMap.hasOwnProperty(objid)) {
    return createRes(res,401, 'object cannot be found')
  }
  if(objectsMap[objid].data == null || !objectsMap[objid].data.hasOwnProperty(property)) {
    return createRes(res,401, 'object has no property '+property)
  }

  return createJSONresponse(res,objectsMap[objid].data[property])
});

// ----------------------

app.get("/requireToken", (req, res, next) => {
  return createJSONresponse(res,generateToken())
});

app.get("/getFullOrient", (req, res, next) => {
  console.log('someone trys to get fullOrient data')
  return createJSONresponse(res,getFullOrient())
});

// ----------------------------------------------------------

app.listen(config.port, () => {
  console.log("SunStalker central server listening on " + config.port);
});