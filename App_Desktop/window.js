'use strict';

const chart = require('./chart.js');
const sun = require('./drawSun.js');
const power = require('./lineChart.js');


const rp = require('request-promise-native')

let i = 0;
let angle = 0;
<<<<<<< HEAD
let powerDatas = [];

function updatePhotoValuesChart() {
	i = i+1
    let data = [Math.random() * 200, Math.random() * 200, Math.random() * 200]
    chart.update(data);
    setTimeout(updatePhotoValuesChart, 1000);
    angle = (angle+5)%180
    sun.updateSun(angle)
    powerDatas.push({
            date: i,
            value: Math.random()*205
        })	
    power.updatePower(powerDatas)
=======
function updatePhotoValuesChart() {

    rp({

        method: 'GET',
        uri: 'http://127.0.0.1:6138/getLocalPhotoValue',
        json: true

    }).then((data) => {

        chart.update(data);
        // updatePhotoValuesChart();
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

        console.log(data)

        sun.updateSun(data * 180)

        setTimeout(updateSun, 100);

    }, (err) => {

        console.log('error when getting PhotoValues')

    })





>>>>>>> cd22c84603bf3bdc66038e9a7bfc09472429c797
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
<<<<<<< HEAD
    powerDatas.push({
            date: i,
            value: Math.random()*205
        })
    
=======
    updateSun();


>>>>>>> cd22c84603bf3bdc66038e9a7bfc09472429c797
    updateTime();
})
