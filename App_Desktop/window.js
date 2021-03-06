'use strict';

const chart = require('./chart.js');
const sun = require('./drawSun.js');
const power = require('./lineChart.js');


const rp = require('request-promise-native')

const POWER_UPDATE_TIME_RANGE_S = 30;
const POWER_UPDATE_TIME_STEP_MS = 120;

let angle = 0;
let powerData = [];

let updatePowerStep = 0;
while (updatePowerStep < POWER_UPDATE_TIME_RANGE_S * 1000 / POWER_UPDATE_TIME_STEP_MS) {

    powerData.push(
        {
            value: 0
        });

    ++updatePowerStep;

}

function updatePhotoValuesChart() {

    rp({

        method: 'GET',
        uri: 'http://127.0.0.1:6138/getLocalPhotoValue',
        json: true

    }).then((data) => {


        chart.update(data);

        setTimeout(updatePhotoValuesChart, 100);

    }, (err) => {

        console.log('error when getting PhotoValues')

    })

}

function updateSun() {

    rp({

        method: 'GET',
        uri: 'http://127.0.0.1:6138/getSunPosition',
        json: true

    }).then((data) => {

        sun.updateSun(data * 180)

        setTimeout(updateSun, 100);

    }, (err) => {

        console.log('error when getting PhotoValues')

    })
}


function updateTime() {
    $('#timeNow').text((new Date()).toLocaleTimeString('fr-FR'));
    setTimeout(updateTime, 1000);
}

function queryPower() {

    rp({

        method: 'GET',
        uri: 'http://127.0.0.1:6138/getHeliotPower',
        json: true

    }).then((data) => {

        powerData.shift();

        powerData.push({
            value: data
        });


        setTimeout(queryPower, POWER_UPDATE_TIME_STEP_MS);

    }, (err) => {

        console.log('error when getting HeliotPower')

    })

}

function updatePower() {

    power.updatePower(powerData);

    requestAnimationFrame(updatePower);

}

function start() {

    rp({

        method: 'GET',
        uri: 'http://127.0.0.1:6138/getConnectedDevices',
        json: true

    }).then((data) => {

        let devices = data.connectedDevices;

        if (devices.includes('SENSOR')) {

            sun.drawSun(angle)
            chart.drawChart([50, 300, 200]);
            updatePhotoValuesChart();

            updateSun();

        }

        if (devices.includes('HELIOT')) {


            power.drawPower(powerData);
            queryPower();
            updatePower();

        }

    }, (err) => {

        console.log('error when getting ConnectedDevice')

    })

}

$(() => {

    start();

    updateTime();


})
