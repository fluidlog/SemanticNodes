// Retour au bases pour travailler un graphe static 
// dont les forces ne s'activent que lors du drag

var dataset = {
        node_data: [
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
        link_data: [
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
    h = 300,
    n = 100;

var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

var force = d3.layout.force()
                     .nodes(dataset.node_data)
                     .links(dataset.link_data)
                     .size([w, h])
                     .linkDistance([50])
                     .charge([-100])
//                     .start();

var node_drag = d3.behavior.drag()
					.on("dragstart", dragstart)
					.on("drag", dragmove)
					.on("dragend", dragend)

force.start();            // <-- New!
for (var i = n * n; i > 0; --i) force.tick();            // <-- New!
force.stop();            // <-- New!

var links = svg.selectAll("line")
        .data(dataset.link_data)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1)
		.attr("x1", function(d) { return d.source.x; })            // <-- New!
		.attr("y1", function(d) { return d.source.y; })            // <-- New!
		.attr("x2", function(d) { return d.target.x; })            // <-- New!
		.attr("y2", function(d) { return d.target.y; });            // <-- New!

var colors = d3.scale.category10();

var nodes = svg.selectAll("g.node")
		        .data(dataset.node_data)
		        .enter()
		        .append("svg:g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		        .call(node_drag)

var circles = nodes.append("circle")
				.attr("r", 10)
		        .style("fill", function(d, i) {return colors(i);})
		        .attr("class", "nodecircle")
				.style("stroke", "#DDD")
				.style("stroke-width", "2")
				.on("click",click)

force.on("tick", tick);

function tick() 
{
	links.attr("x1", function(d) { return d.source.x; })
		     .attr("y1", function(d) { return d.source.y; })
		     .attr("x2", function(d) { return d.target.x; })
		     .attr("y2", function(d) { return d.target.y; });

	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function click(d, i)
{ 
	if (d3.event.defaultPrevented) return;
	d3.select(this).classed("fixed", d.fixed = false)
					.style("stroke", "#DDD");
}

function dragstart(d, i) {
    force.stop()
}

function dragmove(d, i) {
	d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy; 
	tick(); // this is the key to make it work together with updating both px,py,x,y on d !
}

function dragend(d, i) {
	d3.select(this).classed("fixed", d.fixed = true)
					.select(".nodecircle").style("stroke", "#000");
    tick();
    force.resume();
}
