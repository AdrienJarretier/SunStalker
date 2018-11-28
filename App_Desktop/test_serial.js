const serial = require('./serial.js')


// ------------------------------------- start data recievers
serial.start()

// ------------------------------------- start listening to data
serial.bindToSensorConnect(function(device) {

	serial.bindToSensorData(function(data) {
		console.log('sensor data:',data)
	})

})