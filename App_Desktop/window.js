'use strict';

const chart = require('./chart.js');
const sun = require('./drawSun.js');

let i = 0;
let angle = 0;
function updatePhotoValuesChart() {


    
    let data = [Math.random()*200,Math.random()*200, Math.random()*200] 
    chart.update(data);
    setTimeout(updatePhotoValuesChart, 1000);
    
    angle = (angle+5)%180
    
    sun.sunTraj(angle)

}

$(() => {
    chart.drawChart([50, 300, 200]);
    updatePhotoValuesChart();
    
})

