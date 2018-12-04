var width = 960;
var bottom = 400;
var height = 500;
var r = 250;
var svg;
var image;

function drawSun(angle){

    
	svg = d3.select("body").append("svg")
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
		.attr("y", height-90)
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
	
}


exports.drawSun = drawSun
exports.updateSun = updateSun
