// --------------------------------------------------------------
// -------------------------------------------- RETRIEVE DATA ---

// ----------------------------------------- OUR DATA
function getOnlinePhotoValue() {
	return [[523, 230, 201],[523, 230, 201],[523, 230, 201]]
	// [data,data,data] / [null,null,null]
}

function getLocalPhotoValue() {
	return [523, 230, 201]
	// [data,data,data] / [null,null,null]

}

function getLocalPanelOrient() {

}

// ----------------------------------------- ONLINE DATA


// --------------------------------------------------------------
// --------------------------------------------- COMPUTE DATA ---

function computePhotoValue() {

	let localPhoto = getLocalPhotoValue()
	let onlinePhoto = getOnlinePhotoValue()

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

exports.getPhotoValues = function() {
	return computePhotoValue()
}

exports.getLocalPhotoValues = function() {
	return getLocalPhotoValues()
}

exports.getSunPosition = function() {
	return computeSunPosition()
}