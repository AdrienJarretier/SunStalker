
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
    height = common.WINDOW.HEIGHT/4;
    
    
    let svg = d3.select('#powerChart').append('svg')
        .attr("width", width)
        .attr("height", height);
        
    console.log(data)
        

    x_scale = d3.scaleLinear().range([0, width]);
    y_scale = d3.scaleLinear().range([0, height]);
    
    console.log(data.length)
    console.log(data)

    x_scale.domain([0, data.length]);
    y_scale.domain([0, 205]);

	g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")"
        );
	
	g.append("text")
    .text("Heliot's power in time")
    .attr("x", width/2-100)
    .style("fill", 'black')
    .attr("y", 0);

    line = d3.line()
        .x(function (d) { return x_scale(d.date) })
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
	console.log(data.value)
	x_scale.domain([0, data.length]);
    g.select(".path")   // change the line
        .attr("d", line);
}

exports.drawPower = drawPower
exports.updatePower = updatePower
