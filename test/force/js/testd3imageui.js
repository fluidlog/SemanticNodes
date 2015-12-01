
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
        ],
        links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
                { source: 0, target: 4 },
                { source: 1, target: 5 },
                { source: 2, target: 5 },
                { source: 2, target: 5 },
                { source: 3, target: 4 },
                { source: 5, target: 7 },
                { source: 5, target: 3 },
                { source: 6, target: 7 },
                { source: 7, target: 4 },
        ]
};

var w = 500,
    h = 500

var svg = d3.select("#chart")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

var colors = d3.scale.category10();

var force = d3.layout.force()
                     .nodes(dataset.nodes)
                     .links(dataset.links)
                     .size([w, h])
                     .linkDistance(100)
                     .charge([-1000])
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

/* type circle*/
var type_circle = nodes
			.append("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 11)
		    .attr("class", "circle_type")

/* Image of type */
var fo_type_image = nodes
			.append("foreignObject")
    		.attr("id", "fo_image_type")
			.attr('x', -10)
			.attr('y', -10)
			.attr('width', 25)
			.attr('height', 25)

//xhtml div image
var fo_xhtml = fo_type_image
			.append('xhtml:i')
		    .attr("class", "ui large lab icon")
		    .attr("style", "display:inline")

function tick() 
{

	links.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	nodes.attr("cx", function(d) { return d.x; })
	     .attr("cy", function(d) { return d.y; });

//	fo_xhtml.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}



