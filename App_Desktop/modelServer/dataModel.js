const serial = require('./serial.js')

serial.start()
let sensorBinded = false
let sensorData = null
let heliotBinded = false
let heliotData = null

// --------------------------------------------------------------
// -------------------------------------------- RETRIEVE DATA ---

// ----------------------------------------- OUR DATA
async function getOnlinePhotoValues() {
	return [[523, 230, 201],[523, 230, 201],[523, 230, 201]]
}

function getLocalPhotoValue() {

	if(serial.isSensorConnected()) {

		if(!sensorBinded) {
			sensorBinded = true
			serial.bindToSensorData(function(data) {
				sensorData = data
			})
			serial.bindToSensorDisconnect(function() {
				sensorData = null
				sensorBinded = false
			})
		}

	}
	console.log('sensorData:',sensorData)
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
	console.log('heliotData:',heliotData)
	return heliotData
}

// ----------------------------------------- ONLINE DATA


// --------------------------------------------------------------
// --------------------------------------------- COMPUTE DATA ---


async function computePhotoValue() {

	let localPhoto = await getLocalPhotoValue()
	let onlinePhoto = await getOnlinePhotoValues()

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

	let photoValues = await computePhotoValue()

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
  return 0
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