
var dataset = {
        nodes: [
                { name: "Adam" },
                { name: "Bob" },
                { name: "Carrie" },
                { name: "Donovan" },
                { name: "Edward" },
                { name: "Felicity" },
                { name: "George" },
                { name: "Hannah" },
                { name: "Iris" },
                { name: "Jerry" }
        ],
        edges: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
                { source: 0, target: 4 },
                { source: 1, target: 5 },
                { source: 2, target: 5 },
                { source: 2, target: 5 },
                { source: 3, target: 4 },
                { source: 5, target: 8 },
                { source: 5, target: 9 },
                { source: 6, target: 7 },
                { source: 7, target: 8 },
                { source: 8, target: 9 }
        ]
};

var w = 500,
    h = 300

var svg = d3.select("#chart")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

var colors = d3.scale.category10();

var force = d3.layout.force()
                     .nodes(dataset.nodes)
                     .links(dataset.edges)
                     .size([w, h])
                     .linkDistance([70])        // <-- New!
                     .charge([-300])            // <-- New!
                     .on("tick", tick)        // <-- New!
                     .start();

var edges = svg.selectAll(".link")         // <-- New!
        .data(dataset.edges)
        .enter()
        .append("line")         // <-- New!
        .attr("class", "link")         // <-- New!
        .style("stroke", "#ccc")
        .style("stroke-width", 3);         // <-- New!


var nodes = svg.selectAll(".node")        // <-- New!
        .data(dataset.nodes)
        .enter()
        .append("g")        // <-- New!
        .attr("class", "node")        // <-- New!
        .style("fill", function(d, i) {
                return colors(i);
        })
	    .on("mouseover", mouseover)        // <-- New!
	    .on("mouseout", mouseout)        // <-- New!
        .call(force.drag);

nodes.append("circle")
	.attr("r", 15);

nodes.append("text")
.attr("x", 12)
.attr("dy", ".35em")
.attr("dx", ".50em")
.text(function(d) { return d.name; });


//var labels = svg.selectAll("text")
//				.data(dataset.nodes)
//				.enter()
//				.append("text")
//				.attr({"x":function(d){return d.x;},"y":function(d){return d.y;}})
//				.attr({"dy":".35em"})       // Permet de descendre un peu le texte <-- New!
//				.text(function(d){return d.name;})
//        .attr("class", "node")        // <-- New!
//	    .on("mouseover", mouseover)        // <-- New!
//	    .on("mouseout", mouseout)        // <-- New!
//				.call(force.drag); // Permet le drag n drop sur le label et pas uniquement sur le point...


function tick() 
{

	edges.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	nodes.attr("cx", function(d) { return d.x; })
	     .attr("cy", function(d) { return d.y; });

//	labels.attr("x", function(d) { return d.x; })
//		  .attr("y", function(d) { return d.y; }); 
}

function mouseover()         // <-- New!
{
	var node_select = d3.select(this).select("circle");
	d3.select(this).select("circle").transition()
	  .duration(500)
	  .attr("r", 30);
}

function mouseout()         // <-- New!
{
	  d3.select(this).select("circle").transition()
	      .duration(500)
	      .attr("r", 15);
}
