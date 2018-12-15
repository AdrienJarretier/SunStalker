
const common = require('../common.js')

const serial = require('./serial.js')
const request = require('request-promise-native');
const fs = require('fs')

serial.start()

let sensorBinded = false
let sensorData = null
let heliotBinded = false
let heliotData = null

let tokenPath = 'SunStalkerToken.tkn'
let SunStalkerToken = null
let SunStalkerServerUrl = 'http://localhost:' + common.centralServerConfig.port

let myToken = null

// --------------------------------------------------------------
// -------------------------------------------------- BINDERS ---

// -------------------------- SENSOR
serial.bindToSensorData(async function(data) {
  sensorData = data
  if(myToken != null)
    sendOrientationData(data)
  else
    getToken()
})
serial.bindToSensorDisconnect(function() {
  sensorData = null
})

// -------------------------- HELIOT
serial.bindToHeliotData(async function(data) {
  heliotData = data
})
serial.bindToHeliotDisconnect(function() {
  heliotData = null
})

// --------------------------------------------------------------
// ------------------------------------------------ SEND DATA ---

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
async function sendOrientationData(orientation) {

  let token = await getToken()

  let options = {
    uri: SunStalkerServerUrl+'/setMyOrientation',
    method: 'POST',
    json: true,
    body: {'token': token, 'orientData': orientation}
  }

  try {
    let resp = await request(options)
  }
  catch(error) {}

}

// --------------------------------------------------------------
// -------------------------------------------- RETRIEVE DATA ---

// ----------------------------------------- OUR DATA
async function getOnlinePhotoValues() {

  let options = {
    uri: SunStalkerServerUrl+'/getFullOrient',
    method: 'GET',
    json: true,
  }

  let positions = await request(options)

  return positions
}

function getLocalPhotoValue() {

	return sensorData

}

function getHeliotPosition() {

	if(heliotData == null)
    return null
  return heliotData[0]
}

function getHeliotPower() {

  if(heliotData == null)
    return null
  return heliotData[1]
}

// ----------------------------------------- ONLINE DATA


// --------------------------------------------------------------
// --------------------------------------------- COMPUTE DATA ---


async function computePhotoValue() {

	let localPhoto = await getLocalPhotoValue()
  try {
	 let onlinePhoto = await getOnlinePhotoValues()
  } catch(error) {
    onlinePhoto = []
  }

	let computedValues = localPhoto

	for(let data of onlinePhoto){
		computedValues[0] += data[0]
		computedValues[1] += data[1]
		computedValues[2] += data[2]
	}

	computedValues[0] /= onlinePhoto.length+1
	computedValues[1] /= onlinePhoto.length+1
	computedValues[2] /= onlinePhoto.length+1

	return computedValues
}
// -----------------------------------

async function getOnlineData() {

  let apis = []
  apis.push('https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400')

  let returns = []

  for(let api of apis) {

    let options = {
      uri: api,
      method: 'GET',
      json: true
    }

    let data = await request(options)

    returns.push(data)
  }

  console.log(returns)

  return returns
}

// -----------------------------------

async function computeSunPosition() {

	let photoValues = await computePhotoValue()
  let onlineData = await getOnlineData()

  let minValue = Math.min(photoValues[0],photoValues[1],photoValues[2])

  let west = photoValues[0] - minValue
  let zenith = photoValues[1] - minValue
  let east = photoValues[2] - minValue

  if(west == east)
    return 90

  let mid = Math.abs(west - east) / 2

  if(east == 0) {
    let maxValue = Math.max(west,zenith)
    let ratio = 45 / maxValue
    west = west * ratio
    zenith = zenith * ratio
    return  45 + zenith - west
  }

  if(west == 0) {
    let maxValue = Math.max(east,zenith)
    let ratio = 45 / maxValue
    east = east * ratio
    zenith = zenith * ratio
    return  (90+45) - zenith + east
  }

  return 0

}

// --------------------------------------------------------------
// ------------------------------------------------ INTERFACE ---

// -------------------------------------------

/**
 * return 3 elements array containing the average values of photo cells from all arduinos connected to central server
 */
exports.getPhotoValues = async function() {
	return await computePhotoValue()
}


/**
 * return 3 elements array containing the values of photo cells from the locally connected arduino
 */
exports.getLocalPhotoValue = async function() {
	return getLocalPhotoValue()
}

/**
 * return a number between 0 and 1, corresponding to an angle of 0 to 180 degrees
 */
exports.getSunPosition = async function() {
	return await computeSunPosition()
}

/**
 * return 
 */
exports.getHeliotPosition = async function() {
	return getHeliotPosition()
}

/**
 * return 
 */
exports.getHeliotPower = async function() {
  return getHeliotPower()
}

// -------------------------------------------
/**
 * return 
 */
exports.setHeliotPosition = function(position) {
	serial.sendHeliot([1,position]);
}

// -------------------------------------------
/**
 * return the serial interface object handler
 */
exports.getSerialInterface = function() {
	return serial
}