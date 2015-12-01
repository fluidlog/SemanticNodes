//PAIR - Project, Actor, Idea, Ressource

var data = {
        nodes: [
                { id:0, name: "Idea 1", rayon:30, type:"I" },
                { id:1, name: "Idea 2", rayon:30, type:"I" },
                { id:2, name: "Idea 3", rayon:30, type:"I" },
                { id:3, name: "Idea 4", rayon:30, type:"I" },
                { id:4, name: "Projet 1", rayon:40, type:"P" },
                { id:5, name: "Projet 2", rayon:40, type:"P" },
                { id:6, name: "Projet 3", rayon:40, type:"P" },
                { id:7, name: "Actor 1", rayon:30, type:"A" },
                { id:8, name: "Actor 2", rayon:30, type:"A" },
                { id:9, name: "Actor 3", rayon:30, type:"A" },
                { id:10, name: "Actor 4", rayon:30, type:"A" },
                { id:11, name: "Actor 5", rayon:30, type:"A" },
                { id:12, name: "Ressource 1", rayon:30, type:"R" },
                { id:13, name: "Ressource 2", rayon:30, type:"R" },
                { id:14, name: "Ressource 3", rayon:30, type:"R" },
        ],
        links: [
                { source: 0, target: 7 },
                { source: 0, target: 8 },
                { source: 0, target: 4 },
                { source: 0, target: 5 },
                { source: 1, target: 10 },
                { source: 1, target: 11 },
                { source: 2, target: 4 },
                { source: 3, target: 11 },
                { source: 4, target: 7 },
                { source: 4, target: 8 },
                { source: 4, target: 12 },
                { source: 4, target: 13 },
                { source: 5, target: 10 },
                { source: 5, target: 11 },
                { source: 5, target: 14 },
                { source: 6, target: 3 },
                { source: 6, target: 7 },
                { source: 6, target: 9 },
        ]
};


var n = 500,
	node,
	link,
    nodes,
    links,
	width = window.innerWidth - 30, 
	height = window.innerHeight - 30;

var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;"

var colors = d3.scale.category10();

var force = d3.layout.force()
                     .nodes(data.nodes)
                     .links(data.links)
                     .linkDistance(120)
                     .charge(-1000)
                     .size([width, height])

var svg = d3.select("body").append("svg")
			    .attr("width", width)
			    .attr("height", height);

var node_drag = d3.behavior.drag()
					.on("dragstart", dragstart)
					.on("drag", dragmove)
					.on("dragend", dragend);

force.start();
for (var i = n * n; i > 0; --i) force.tick();
force.stop();
update();
force.on("tick", tick);

function update()
{
	node = svg.selectAll(".node");
		node = node.data(data.nodes);
		nodeEnter = node.enter()
						.append("g")
						.attr("class", "node")
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
						.call(node_drag);
	
		nodeEnter.append("circle")
				  .attr("class", "nodecircle")
				  .style("fill", color )
				  .style("stroke", "#DDD")
				  .style("stroke-width", "7")
				  .style("cursor", "pointer")
				  .on("click",click)
				  .attr("r", 0)
				  .transition()
				  .duration(500)
				  .attr("r", function(d) { return d.rayon; })
			     	
		  nodeEnter.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", ".25em")
			.style("font-size", "24px")
			.style("pointer-events", "none")
			.style("font-family", FontFamily)
			.text(function(d) { if (d.level!=1) return d.name; })
			.style("font-size", function(d) { return getTextSize(this, d.rayon) })
			.style("fill", color)
	  			  .transition()
	  			  .duration(500)
			.style("fill", "white");
		
//	 Update links.
		link = svg.selectAll(".link")
		  			.data(data.links);
	
		link.enter().insert("line", ".node")
					.attr("class", "link")
					.style("opacity", "0.8")
					.attr("stroke", "#DDD")
					.attr("stroke-width", "0")
					.transition()
					.duration(500)
					.attr("stroke-width", "4")
				  .attr("x1", function(d) { return d.source.x; })
				  .attr("y1", function(d) { return d.source.y; })
				  .attr("x2", function(d) { return d.target.x; })
				  .attr("y2", function(d) { return d.target.y; });
}

function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function color(d) 
{
	switch (d.type)
	{
		case "P" : 
			return colors(1);
		break
		case "A" : 
			return colors(2);
		break
		case "I" : 
			return colors(3);
		break
		case "R" : 
			return colors(4);
		break
	}
}

function getTextSize(object,r) 
{
	var textlength = object.getComputedTextLength();
	var fontsize = Math.min(2 * r, (2 * r - 10) / textlength * 24) + "px";
	return fontsize ; 
}

function click(d, i)
{ 
	if (d3.event.defaultPrevented) return;
	d3.select(this).classed("fixed", d.fixed = false)
					.style("stroke", "#DDD");
}

function dragstart(d, i) {
	force.stop();
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
					.select(".nodecircle").style("stroke", "#999");
	tick();
	force.resume();
}
