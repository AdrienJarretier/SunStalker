const dataModel = require('./dataModel.js')

dataModel.getSerialInterface().bindToSensorConnect(function() {
	dataModel.getSerialInterface().bindToSensorData(function(data) {
		console.log('SENSOR:',data)
	})
})

dataModel.getSerialInterface().bindToSensorDisconnect(function() {
	console.log('Sensor is disconnected')
})

// -----------------------------------------------------------------------------

let tick = 0
let position = 0

dataModel.getSerialInterface().bindToHeliotConnect(function() {
	console.log('Heliot is connected')
	dataModel.getSerialInterface().bindToHeliotData(function(data) {

		if(tick == 20) {
			console.log('send',position)
			dataModel.setHeliotPosition(position)
			tick = 0
			position+=10
		}

		console.log('HELIOT:',data)
		tick ++
	})
})

dataModel.getSerialInterface().bindToHeliotDisconnect(function() {
	console.log('Heliot is disconnected')
})