'use strict';

const serialport = require("serialport");
const Readline = require('@serialport/parser-readline');
const usbDetect = require('usb-detection');

// ------------------------------------------------------
// ------------------------------------------------------

let allowedType = ['Sensor', 'Heliot']

let isStarted = false

let portMap = {}
let deviceMap = { 'Sensor': null, 'Heliot': null }

let sensorConnected = false
let heliotConnected = false

let connectCallback = { 'Sensor': [], 'Heliot': [] }
let disconnectCallback = { 'Sensor': [], 'Heliot': [] }
let dataCallback = { 'Sensor': [], 'Heliot': [] }


let dataTransformers = {

	Sensor: function (data) {
		if (data.length != 4)
			return null
		return [parseInt(data[1]), parseInt(data[2]), parseInt(data[3])]
	},

	Heliot: function (data) {
		if (data.length != 4)
			return null
		return [parseInt(data[1]), parseFloat(data[2]), parseInt(data[3])]
	},
}

// --------------------------------------------------------------------
// -------------------------------------------------- MOMENT PICKER ---

exports.isStarted = function () {
	return isStarted
}

// ------------------------------------------------------

exports.isSensorConnected = function () {
	return deviceMap['Sensor'] != null
}
// ------------
exports.isHeliotConnected = function () {
	return deviceMap['Heliot'] != null
}

// ------------------------------------------------------

exports.getSensorData = function () {
	if (deviceMap['Sensor'] == null)
		return null
	return deviceMap['Sensor'].lastData
}

exports.getHeliotData = function () {
	if (deviceMap['Heliot'] == null)
		return null
	return deviceMap['Heliot'].lastData
}

// --------------------------------------------------------------------
// --------------------------------------------------- COMMUNICATOR ---

function sendDevice(deviceType, dataArray) {
	if (deviceMap[deviceType] == null) {
		return false
	}
	let dataStr = dataArray.join(',')
	deviceMap[deviceType].port.write(dataStr + '\n')
	return true
}

exports.sendSensor = function (dataArray) {

	return sendDevice('Sensor', dataArray)
}

exports.sendHeliot = function (dataArray) {

	return sendDevice('Heliot', dataArray)
}


// --------------------------------------------------------------------
// --------------------------------------------------------- BINDER ---

exports.bindToSensorConnect = function (callback) {
	connectCallback['Sensor'].push(callback)
}
// ------------
exports.bindToHeliotConnect = function (callback) {
	connectCallback['Heliot'].push(callback)
}

exports.bindToSensorDisconnect = function (callback) {
	disconnectCallback['Sensor'].push(callback)
}
// ------------
exports.bindToHeliotDisconnect = function (callback) {
	disconnectCallback['Heliot'].push(callback)
}

// ------------------------------------------------------

exports.bindToSensorData = function (callback) {
	dataCallback['Sensor'].push(callback)
}

exports.bindToHeliotData = function (callback) {
	dataCallback['Heliot'].push(callback)
}

// --------------------------------------------------------------------
// --------------------------------------------------- PORT METHODS ---

function isArduino(deviceName) {
	return deviceName.includes('Arduino Uno')
}
function getArduinoPortName(deviceName) {
	return deviceName.replace('Arduino Uno (', '').replace(')', '')
}
function getArduinoPort(deviceName) {
	if (isArduino(deviceName))
		return getArduinoPortName(deviceName)
	return null
}

// --------------------------------------------------------------------
// ---------------------------------------------------- DATA HANDLE ---

function dataRecieved(portName, data) {

	let deviceType = data[0]
	if (allowedType.indexOf(deviceType) == -1)
		return

	// ---------------------------------- connect
	if (deviceMap[deviceType] == null) {
		for (let callback of connectCallback[deviceType]) {
			callback(portMap[portName])
		}
		portMap[portName].type = deviceType
		deviceMap[deviceType] = portMap[portName]
	}

	// ---------------------------------- transform data
	let transformedData = dataTransformers[deviceType](data)

	// ---------------------------------- update data
	portMap[portName].lastData = transformedData

	for (let callback of dataCallback[deviceType]) {
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

		if (portName != null) {
			let port = new serialport(portName, { autoOpen: false, baudRate: 9600 });
			port.open()
			let parser = port.pipe(new Readline({ delimiter: '\r\n' }))
			parser.on('data', (d) => {
				d = d.split(',');
				dataRecieved(portName, d)
			})
			portMap[portName] = { 'port': port, 'type': null, 'lastData': null }
		}
	}
	// --------------------------------------
	function usbOut(device) {
		let deviceName = device.deviceName
		let portName = getArduinoPort(deviceName)

		if (portName != null) {

			if (portMap.hasOwnProperty(portName)) {
				let deviceType = portMap[portName].type
				if (allowedType.indexOf(deviceType) != -1) {
					for (let callback of disconnectCallback[deviceType]) {
						callback(portMap[portName])
					}
				}
				delete portMap[portName]
				delete deviceMap[deviceType]
			}
		}
	}

	// -----------------------------------------------
	// -----------------------------------------------
	usbDetect.find(10755, 67, function (err, devices) {

		for (let device of devices) {
			usbIn(device)
		}
	});
	usbDetect.on('add', usbIn);
	usbDetect.on('remove', usbOut);
}


// --------------------------------------------------------------------
// --------------------------------------------------- INIT METHODS ---

exports.start = function () {
	startUsbMonitoring()
	isStarted = true
}

exports.stop = function () {

	console.log("stopping usbDetect monitoring");

	usbDetect.stopMonitoring();
	isStarted = false
}