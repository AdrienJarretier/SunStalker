
'use strict';

const common = require('../common.js');


let g;
let y;
let x;
var line;
let width;
let height;
let x_scale;
let y_scale;

var margin = { top: 20, right: 20, bottom: 30, left: 50 };

function drawPower(data) {
    width = common.WINDOW.WIDTH / 2;
    height = common.WINDOW.HEIGHT / 4;


    let svg = d3.select('#powerChart').append('svg')
        .attr("width", width)
        .attr("height", height + 20);



    x_scale = d3.scaleLinear().range([0, width]);
    y_scale = d3.scaleLinear().range([height, 0]);


    x_scale.domain([0, data.length]);
    y_scale.domain([0, 1]);

    g = svg.append("g")
        .attr("transform",
            "translate(" + 0 + "," + 10 + ")"
        );

    // g.append("text")
    //     .text("Heliot's power in time")
    //     .attr("x", width / 2 - 100)
    //     .style("fill", 'black')
    //     .attr("y", 10);


    line = d3.line()
        .x(function (d, i) { return x_scale(i) })
        .y(function (d) { return y_scale(d.value) })
        .curve(d3.curveBasis);

    g.append("path")
        .attr("class", "path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

function updatePower(data) {


    g.select(".path")   // change the line
        .attr("d", line);
}

exports.drawPower = drawPower
exports.updatePower = updatePower
