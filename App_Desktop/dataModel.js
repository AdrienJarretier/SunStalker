const serial = require('./serial.js')

serial.start()
let sensorBinded = false
let sensorData = null
let heliotBinded = false
let heliotData = null

// --------------------------------------------------------------
// -------------------------------------------- RETRIEVE DATA ---

// ----------------------------------------- OUR DATA
function getOnlinePhotoValues() {
	return [[523, 230, 201],[523, 230, 201],[523, 230, 201]]
	// [data,data,data] / [null,null,null]
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

function computePhotoValue() {

	let localPhoto = getLocalPhotoValue()
	let onlinePhoto = getOnlinePhotoValues()

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
function positionFunction(east, zenith, west) {

	let sunPosition = null

	if(east > west && zenith > west) {

		sunPosition = (zenith - east)*90 + 45

	}
	else if(west > east && zenith > east) {

		sunPosition = (west - zenith)*90 + 45 + 90
	}

	return sunPosition

}

function normalize(photoSensorSet) {

	return photoSensorSet

}

function computeSunPosition() {

	let photoValues = computePhotoValue()
	photoValues = normalize(photoValues)
	return positionFunction(photoValues[0],photoValues[1],photoValues[2])

}

// --------------------------------------------------------------
// ------------------------------------------------ INTERFACE ---

// -------------------------------------------
exports.getPhotoValues = function() {
	return computePhotoValue()
}

exports.getLocalPhotoValue = function() {
	return getLocalPhotoValue()
}

exports.getSunPosition = function() {
	return computeSunPosition()
}

exports.getHeliotPosition = function() {
	return getHeliotPosition()
}

// -------------------------------------------
exports.setHeliotPosition = function(position) {
	
	// [ <byte saying their is data> , <position> ]
	serial.sendHeliot([1,position]);
}

// -------------------------------------------
exports.getSerialInterface = function() {
	return serial
}