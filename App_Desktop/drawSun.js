var width = 400;
var bottom = 200;
var height = 250;
var r = bottom/1.2;
var svg;
var image;
var radius;

function drawSun(angle){

    
	svg = d3.select("#sunTrajectory").append("svg")
	  .attr("width", width)
	  .attr("height", height)
	
	let g = svg.append("g").attr("transform", "translate(" + width/2 + "," + bottom+")");
	
	let arc = d3.arc().innerRadius(r)
	.outerRadius(r+2)
	
	var path = g.append("path")
	.datum({endAngle:-Math.PI/2, startAngle:Math.PI/2})
	.style("stroke", 'grey')
	.style("fill", 'grey')
	.attr("d", arc)
	
	radius = svg.append("line")
	
	radius.style("stroke", "grey")  // colour the line
	//radius.style("stroke-dasharray", "grey")
    .attr("x1", width/2)     // x position of the first end of the line
    .attr("y1", bottom)      // y position of the first end of the line
    .attr("x2", width/2 + Math.cos(angle*Math.PI/180)*r)     // x position of the second end of the line
    .attr("y2", bottom- Math.sin(angle*Math.PI/180)*r)
    .style('stroke-dasharray', '5,3');
	
	image = svg.append('svg:image')
	
	image.attr('xlink:href', 'https://st2.depositphotos.com/6025596/11754/v/950/depositphotos_117540510-stock-illustration-sun-icon-light-sign-isolated.jpg')
	.attr("r", 40)
	  .attr("x", width/2 + Math.cos(angle*Math.PI/180)*r-40)
	  .attr("y", bottom- Math.sin(angle*Math.PI/180)*r-40)
	.attr("fill", "yellow")
	.attr("width", 80)
	.attr("height", 80)

	svg.append("circle")
	.attr("r", 4)
	  .attr("cx", width/2)
	  .attr("cy", bottom)
	.attr("fill", "black")
	
	svg.append("rect")
		.attr("x", 0)
		.attr("y", bottom+5)
	  .attr("width", width)
	  .attr("height", 100)
	.attr("fill", "white")
}

function updateSun(angle){
	
	image.attr('xlink:href', 'https://st2.depositphotos.com/6025596/11754/v/950/depositphotos_117540510-stock-illustration-sun-icon-light-sign-isolated.jpg')
	.attr("r", 40)
	  .attr("x", width/2 + Math.cos(angle*Math.PI/180)*r-40)
	  .attr("y", bottom- Math.sin(angle*Math.PI/180)*r-40)
	.attr("fill", "yellow")
	.attr("width", 80)
	.attr("height", 80)
	
	radius.style("stroke", "grey")  // colour the line
	//radius.style("stroke-dasharray", "grey")
    .attr("x1", width/2)     // x position of the first end of the line
    .attr("y1", bottom)      // y position of the first end of the line
    .attr("x2", width/2 + Math.cos(angle*Math.PI/180)*r)     // x position of the second end of the line
    .attr("y2", bottom- Math.sin(angle*Math.PI/180)*r)   
    .style('stroke-dasharray', '5,3');
}


exports.drawSun = drawSun
exports.updateSun = updateSun
