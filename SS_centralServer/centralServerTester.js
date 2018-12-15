'use strict'

const common = require('../common.js')
const request = require('request-promise-native');

// ------------------------------------------------------

let SunStalkerServerUrl = common.centralServerConfig.fulladdress
let myToken = null

async function getToken() {

  if(myToken != null) {
    return myToken
  }

  let options = {
    uri: SunStalkerServerUrl + '/requireToken',
    method: 'GET',
  }

  try {
    myToken = await request(options)
  }
  catch(error) {
    return null
  }

  return myToken
}
// -----------------------------
async function sendData(objectType, objectData) {

  let token = await getToken()

  let options = {
    uri: SunStalkerServerUrl+'/setMyData',
    method: 'POST',
    json: true,
    body: {'token':token,'objectType':objectType,'objectData':objectData}
  }

  try {
    return await request(options)
  }
  catch(error) {
    return null
  }
}
// -----------------------------
async function sendObject(type,object) {

  let token = await getToken()

  let options = {
    uri: SunStalkerServerUrl+'/setMyObject',
    method: 'POST',
    json: true,
    body: {'token': token, 'objectType': type, 'object':object}
  }

  try {
    return await request(options)
  }
  catch(error) {
    return null
  }
}
// -----------------------------
async function getObjectData(objid,property) {

  let options = {
    uri: SunStalkerServerUrl+'/objects/' + objid + '/' +property,
    method: 'GET',
    json: true,
  }

  try {
    return await request(options)
  }
  catch(error) {
    return null
  }
}
// -----------------------------
async function retrieveAllObject(token) {

  let options = {
    uri: SunStalkerServerUrl+'/getObjects/' + token,
    method: 'GET',
    json: true,
  }

  try {
    return await request(options)
  }
  catch(error) {
    return null
  }
}

async function getOnlinePhotoValues() {

  let options = {
    uri: SunStalkerServerUrl+'/getFullOrient',
    method: 'GET',
    json: true,
  }

  let positions = await request(options)

  return positions
}

// -------------------------------------------------------

async function main() {
  let resp = null

  // ----- add objects
  resp = await sendObject('Heliot',{'id':'heliotid','desc':'je suis un heliot'})
  console.log(resp)
  resp = await retrieveAllObject(await getToken())
  console.log(resp)
  resp = await sendObject('Sensor',{'id':'sensorid','desc':'je suis un sensor'})
  console.log(resp)
  resp = await retrieveAllObject(await getToken())
  console.log(resp)


  // ----- set object data
  resp = await sendData('Heliot',{'myData':[0,1,2,3]})
  console.log(resp)
  resp = await getObjectData('heliotid','myData')
  console.log(resp)
  resp = await getObjectData('sensorid','myData')
  console.log(resp)

  // ----- remove objects
  resp = await sendObject('Heliot',null)
  console.log(resp)
  resp = await sendData('Heliot',{'myData':[0,1,2,3]})
  console.log(resp)
  resp = await getObjectData('heliotid','myData')
  console.log(resp)

  // ----- retrive orientations
  resp = await sendData('Sensor',{'photoCellValues':[0,1,2]})
  console.log(resp)
  resp = await getOnlinePhotoValues()
  console.log(resp)
}

console.log('trying ...')
main().then(function(){
  console.log('done')
})
