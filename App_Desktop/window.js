'use strict';

const chart = require('./chart.js');
const sun = require('./drawSun.js');
const power = require('./lineChart.js');


const rp = require('request-promise-native')

let i = 0;
let angle = 0;
let powerDatas = [];

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


$(() => {
    sun.drawSun(angle)
    chart.drawChart([50, 300, 200]);
    power.drawPower(powerDatas);
    updatePhotoValuesChart();

    updateSun();
    updateTime();
    
})
