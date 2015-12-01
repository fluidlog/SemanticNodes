
var dataset = {
        nodes: [
                { id:0, name: "P1" },
                { id:1, name: "A1" },
                { id:2, name: "I1" },
                { id:3, name: "R1" },
                { id:4, name: "P2" },
                { id:5, name: "A2" },
                { id:6, name: "I2" },
                { id:7, name: "R2" },
                { id:8, name: "P3" },
                { id:9, name: "A3" },
                { id:10, name: "I3" },
                { id:11, name: "R3" },
        ],
        links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
                { source: 0, target: 4 },
                { source: 0, target: 5 },
                { source: 1, target: 2 },
                { source: 1, target: 5 },
                { source: 1, target: 11 },
                { source: 1, target: 10 },
                { source: 2, target: 2 },
                { source: 2, target: 5 },
                { source: 2, target: 11 },
                { source: 2, target: 10 },
                { source: 2, target: 3 },
                { source: 2, target: 7 },
                { source: 2, target: 4 },
                { source: 3, target: 5 },
                { source: 3, target: 9 },
                { source: 4, target: 5 },
                { source: 4, target: 9 },
                { source: 5, target: 5 },
                { source: 5, target: 11 },
                { source: 6, target: 10 },
                { source: 6, target: 3 },
                { source: 6, target: 7 },
                { source: 7, target: 2 },
                { source: 8, target: 5 },
                { source: 9, target: 11 },
                { source: 10, target: 10 },
                { source: 11, target: 10 },
        ]
};

var w = 500,
    h = 500

var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

var colors = d3.scale.category10();

var force = d3.layout.force()
                     .nodes(dataset.nodes)
                     .links(dataset.links)
                     .size([w, h])
                     .linkDistance(100)
                     .linkStrength(0.1)
                     .friction(0.8)
                     .gravity(0.05)
                     .theta(0.1)
                     .charge([-400])
                     .on("tick", tick)
                     .start();

var links = svg.selectAll(".link")
        .data(dataset.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "#aaa")
        .style("stroke-width", 8)
		.style("opacity", "0.8");

var nodes = svg.selectAll(".node")
        .data(dataset.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
	    .on("mouseover", mouseover)
	    .on("mouseout", mouseout)
        .call(force.drag);

// Création d'un rectangle à bord arrondis à la place d'un cercle
nodes.append("rect")
	.attr("x", function(d) {return -(15*d.name.length / 2);})
	.attr("y", "-20")
	.attr("rx", 10)
	.attr("ry", 10)
	.attr("width", function(d) {return 15*d.name.length})
	.attr("height", 30)
	.style("stroke", "#aaa")
	.style("stroke-width", "5")
	.style("opacity", "0.8");

nodes.append("text")
		.attr("text-anchor", "middle")
		.attr("class", "text")
		.text(function(d) { return d.name; });

function tick() 
{

	links.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	nodes.attr("cx", function(d) { return d.x; })
	     .attr("cy", function(d) { return d.y; });

}

function mouseover()
{
	d3.select(this).select("rect").transition()
	  .duration(200)
      .style("fill", "#AA0000");
}

function mouseout()
{
	  d3.select(this).select("rect").transition()
	      .duration(200)
	  	  .style("fill", "#DD4D4D");
}
