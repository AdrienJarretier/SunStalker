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
exports.getPhotoValues = async function() {
	return await computePhotoValue()
}

exports.getLocalPhotoValue = async function() {
	return getLocalPhotoValue()
}

exports.getSunPosition = async function() {
	return await computeSunPosition()
}

exports.getHeliotPosition = async function() {
	return getHeliotPosition()
}

exports.getHeliotPower = async function() {
  return 0
}

// -------------------------------------------
exports.setHeliotPosition = function(position) {
	serial.sendHeliot([1,position]);
}

// -------------------------------------------
exports.getSerialInterface = function() {
	return serial
}