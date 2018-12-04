
'use strict';

const common = require('./common.js');


let g;
let data;
let y;
let x;

function drawChart(data) {
    data = data;
    let width = common.WINDOW.WIDTH / 2;
    let height = width / ((1 + Math.sqrt(5)) / 2);

    let svg = d3.select('#photoValuesChart').append('svg')
        .attr("width", width)
        .attr("height", height);

    x = d3.scaleLinear().range([0, width]);
    y = d3.scaleLinear().range([0, height]);

    x.domain([0, data.length]);
    y.domain([0, 1024]);


    g = svg.append('g');

    g.selectAll('rect').data(data).enter().append('rect')
        .attr('x', function (d, i) {

            console.log("x : ", x(i), i)
            return x(i);
        })
        .attr('y', function (d) {

            console.log("y : ", y(d), d);
            return 200 - y(d);
        })
        .attr('height', function (d) { return y(d); })
        .attr('width', function (d) { return width / 3.5; })
        .style("fill", "red");




}

function update(data) {
    data = data;
    g.selectAll('rect').data(data).transition()
        .attr('y', function (d) {

            console.log("y : ", y(d), d);
            return 200 - y(d);
        })
        .attr('height', function (d) { return y(d); })
}

exports.drawChart = drawChart
exports.update = update

