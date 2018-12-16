'use strict';

const common = require('../common.js')
const request = require('request-promise-native');
const fs = require('fs-promise')

// ------------------------------------------------------

let SunStalkerServerUrl = common.centralServerConfig.fulladdress

let tokenPath = common.modelServerConfig.tokenFilePath
let myToken = null

async function getToken() {

  if (myToken != null) {
    return myToken
  }

  console.log(await fs.exists(tokenPath))

  if (await fs.exists(tokenPath)) {
    console.log('TOKEN ALREADY EXISTS')
    myToken = await fs.readFile(tokenPath,'utf8')
    return myToken
  }

  let options = {
    uri: SunStalkerServerUrl + '/requireToken',
    method: 'GET',
    json: true
  }

  try {
    console.log('ASK FOR TOKEN')
    myToken = await request(options)
    await fs.writeFile(tokenPath,myToken)
  }
  catch (error) {
    return null
  }

  return myToken
}
// -----------------------------
async function sendData(objectType, objectData) {

  let token = await getToken()

  let options = {
    uri: SunStalkerServerUrl + '/setMyData',
    method: 'POST',
    json: true,
    body: { 'token': token, 'objectType': objectType, 'objectData': objectData }
  }

  try {
    return await request(options)
  }
  catch (error) {
    return null
  }
}
// -----------------------------
async function sendObject(type, object) {

  let token = await getToken()

  let options = {
    uri: SunStalkerServerUrl + '/setMyObject',
    method: 'POST',
    json: true,
    body: { 'token': token, 'objectType': type, 'object': object }
  }

  try {
    return await request(options)
  }
  catch (error) {
    return null
  }
}
// -----------------------------
async function getObjectData(objid, property) {

  let options = {
    uri: SunStalkerServerUrl + '/objects/' + objid + '/' + property,
    method: 'GET',
    json: true,
  }

  try {
    return await request(options)
  }
  catch (error) {
    return null
  }
}
// -----------------------------
async function retrieveAllObject(token) {

  let options = {
    uri: SunStalkerServerUrl + '/getObjects/' + token,
    method: 'GET',
    json: true,
  }

  try {
    return await request(options)
  }
  catch (error) {
    return null
  }
}

async function getOnlinePhotoValues() {

  let options = {
    uri: SunStalkerServerUrl + '/getFullOrient',
    method: 'GET',
    json: true,
  }

  let positions = await request(options)

  return positions
}

// -------------------------------------------------------

async function main() {
  let resp = null

  let token = await getToken()

  // ----- add objects
  resp = await sendObject('Heliot', { 'id': 'heliotid'+token, 'desc': 'je suis un heliot' })
  console.log(resp)
  resp = await retrieveAllObject(await getToken())
  console.log(resp)
  resp = await sendObject('Sensor', { 'id': 'sensorid'+token, 'desc': 'je suis un sensor' })
  console.log(resp)
  resp = await retrieveAllObject(await getToken())
  console.log(resp)


  // ----- set object data
  resp = await sendData('Heliot', { 'myData': [0, 1, 2, 3] })
  console.log(resp)
  resp = await getObjectData('heliotid'+token, 'myData')
  console.log(resp)
  resp = await getObjectData('sensorid'+token, 'myData')
  console.log(resp)

  // ----- remove objects
  resp = await sendObject('Heliot', null)
  console.log(resp)
  resp = await sendData('Heliot', { 'myData': [0, 1, 2, 3] })
  console.log(resp)
  resp = await getObjectData('heliotid'+token, 'myData')
  console.log(resp)

  // ----- retrive orientations
  resp = await sendData('Sensor', { 'photoCellValues': [Math.random(), Math.random(), Math.random()] })
  console.log(resp)
  resp = await getOnlinePhotoValues()
  console.log(resp)
}

console.log('trying ...')
main().then(function () {
  console.log('done')
})
