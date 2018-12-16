'use strict';

const dataModel = require('./dataModel.js')

console.log('data model launched !')

let serial = dataModel.getSerialInterface()

serial.bindToSensorConnect(function () {
  console.log('New Sensor connected')
})
serial.bindToSensorDisconnect(function () {
  console.log('Sensor disconnected')
})

serial.bindToHeliotConnect(function () {
  console.log('New Heliot connected')
})
serial.bindToHeliotDisconnect(function () {
  console.log('Heliot disconnected')
})