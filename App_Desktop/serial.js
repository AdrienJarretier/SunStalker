
const serialport = require("serialport");
const Readline = require('@serialport/parser-readline');
const usbDetect = require('usb-detection');

let data;
let port;
let isOpen;
exports.data = data;

// ------------------------------------------------------
// ------------------------------------------------------

let allowedType = ['Sensor','Heliot']


let portMap = {}
let deviceMap = {'Sensor':null,'Heliot':null}

let sensorConnected = false
let heliotConnected = false

let connectCallback = {'Sensor':[],'Heliot':[]}
let dataCallback = {'Sensor':[],'Heliot':[]}


let dataTransformers = {
	
	Sensor: function(data) {
		if(data.length != 4)
			return null
		return [parseInt(data[1]),parseInt(data[2]),parseInt(data[3])]
	},

	Heliot: function(data) {
		return data
	},
}

// --------------------------------------------------------------------
// -------------------------------------------------- MOMENT PICKER ---

exports.isSensorConnected = function() {
	return deviceMap['Sensor'] != null
}
// ------------
exports.isHeliotConnected = function() {
	return deviceMap['Heliot'] != null
}

// ------------------------------------------------------

exports.getSensorData = function() {
	if(deviceMap['Sensor'] == null)
		return null
	return deviceMap['Sensor'].lastData
}

exports.getHeliotData = function() {
	if(deviceMap['Heliot'] == null)
		return null
	return deviceMap['Heliot'].lastData
}

// --------------------------------------------------------------------
// --------------------------------------------------------- BINDER ---

exports.bindToSensorConnect = function(callback) {
	connectCallback['Sensor'].push(callback)
}
// ------------
exports.bindToHeliotConnect = function(callback) {
	connectCallback['Heliot'].push(callback)
}

// ------------------------------------------------------

exports.bindToSensorData = function(callback) {
	dataCallback['Sensor'].push(callback)
}

exports.bindToHeliotData = function(callback) {
	dataCallback['Heliot'].push(callback)
}

// --------------------------------------------------------------------
// --------------------------------------------------- PORT METHODS ---

function isArduino(deviceName) {
	return deviceName.includes('Arduino Uno')
}
function getArduinoPortName(deviceName) {
	return deviceName.replace('Arduino Uno (','').replace(')','')
}
function getArduinoPort(deviceName) {
	if(isArduino(deviceName))
		return getArduinoPortName(deviceName)
	return null
}

// --------------------------------------------------------------------
// ---------------------------------------------------- DATA HANDLE ---

function dataRecieved(portName, data) {

	let deviceType = data[0]
	if(allowedType.indexOf(deviceType) == -1)
		return

	// ---------------------------------- connect
	if(deviceMap[deviceType] == null) {
		for(let callback of connectCallback[deviceType]) {
			callback(portMap[portName])
		}
		deviceMap[deviceType] = portName
	}

	// ---------------------------------- transform data
	let transformedData = dataTransformers[deviceType](data)

	// ---------------------------------- update data
	portMap[portName].lastData = transformedData

	for(let callback of dataCallback[deviceType]) {
		callback(transformedData)
	}
}


// --------------------------------------------------------------------
// --------------------------------------------------- PORT CONNECT ---

function startUsbMonitoring() {

	// --------------------------------------
	usbDetect.startMonitoring();

	// --------------------------------------
	function usbIn(device) {
		let deviceName = device.deviceName
		let portName = getArduinoPort(deviceName)

		if(portName != null) {
			let port = new serialport(portName, {autoOpen: false,baudRate: 9600});
			port.open()
			let parser = port.pipe(new Readline({ delimiter: '\r\n' }))
			parser.on('data', (d) => {
				d = d.split(',');
				dataRecieved(portName, d)
			})
			portMap[portName] = { 'port':port, 'type':null, 'lastData':null}
			console.log('NEW DEVICE CONNECTED',portName)
		}
	}
	// --------------------------------------
	function usbOut(device) {
		let deviceName = device.deviceName
		let portName = getArduinoPort(deviceName)

		if(portName != null) {

			if(portMap.hasOwnProperty(portName)) {
				delete portMap[portName]
				console.log('DEVICE DISCONNECTED',portName)
			}
		}
	}

	// -----------------------------------------------
	// -----------------------------------------------
	usbDetect.find(function(err, devices) {
		for(let device of devices) {
			usbIn(device)
		}
	});
	usbDetect.on('add', usbIn);
	usbDetect.on('remove', usbOut);
}


// --------------------------------------------------------------------
// --------------------------------------------------- INIT METHODS ---

exports.start = function() {
	startUsbMonitoring()
}

exports.stop = function() {
	usbDetect.stopMonitoring();
}