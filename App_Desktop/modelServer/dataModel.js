const serial = require('./serial.js')
const request = require('request-promise');
const fs = require('fs')

serial.start()

let sensorBinded = false
let sensorData = null
let heliotBinded = false
let heliotData = null

let tokenPath = 'SunStalkerToken.tkn'
let SunStalkerToken = null
let SunStalkerServerUrl = 'http://localhost:8080'

let myToken = null

// --------------------------------------------------------------
// -------------------------------------------------- BINDERS ---

serial.bindToSensorData(function(data) {
  sensorData = data
  sendOrientationData(data)
  .catch(function(error){})
})
serial.bindToSensorDisconnect(function() {
  sensorData = null
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

  myToken = await request(options)

  return myToken
}
// -----------------------------
async function sendOrientationData(orientation) {

  let token = await getToken()

  let options = {
    uri: SunStalkerServerUrl+'/setMyOrientation',
    method: 'POST',
    json: true,
    body: {'token': token, 'orientData': JSON.stringify(orientation)}
  }

  let resp = await request(options)

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

  console.log('all positions',positions)

  return positions
}

function getLocalPhotoValue() {

	return sensorData

}

function getHeliotPosition() {

	if(serial.isHeliotConnected()) {

		if(!heliotBinded) {
			heliotBinded = true
			serial.bindToHeliotData(function(data) {
				heliotData = data
			})
			serial.bindToHeliotDisconnect(function() {
				heliotData = null
				heliotBinded = false
			})
		}

	}
	return heliotData
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

  if(onlinePhoto.length == 0)
    return null

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

async function computeSunPosition() {

	let photoValues = await getLocalPhotoValue()

  let minValue = Math.min(photoValues[0],photoValues[1],photoValues[2])

  let west = photoValues[0] - minValue
  let zenith = photoValues[1] - minValue
  let east = photoValues[2] - minValue

  if(west == east)
    return 90

  if(east == 0) {
    let maxValue = Math.max(west,zenith)
    let ratio = maxValue / 45
    west = west * ratio
    zenith = zenith * ratio
    return  45 + zenith - west
  }

  if(west == 0) {
    let maxValue = Math.max(east,zenith)
    let ratio = maxValue / 45
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
  return Math.random() * 205
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