'use strict';

const chart = require('./chart.js');

let i = 0;

function updatePhotoValuesChart() {



    let data = [Math.random() * 200, Math.random() * 200, Math.random() * 200]
    chart.update(data);
    setTimeout(updatePhotoValuesChart, 1000);

}

function updateTime() {

    $('#timeNow').text((new Date()).toLocaleTimeString('fr-FR'));

    setTimeout(updateTime, 1000);

}

$(() => {
    chart.drawChart([50, 300, 200]);
    updatePhotoValuesChart();


    updateTime();
})

