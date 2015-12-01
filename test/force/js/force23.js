//PAIR - Project, Actor, Idea, Ressource

var data = {
        nodes: [
                { id:0, name: "Project", rayon:50, type:"P" },
                { id:1, name: "Idea", rayon:30, type:"I" },
                { id:2, name: "...", rayon:30, type:"P" },
                { id:3, name: "Actor", rayon:30, type:"A" },
                { id:4, name: "Ressource", rayon:30, type:"R" },
        ],
        links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
                { source: 0, target: 4 },
        ]
};

var n = 100,
	node,
	link,
    nodes,
    links,
	width = window.innerWidth - 30,
	height = window.innerHeight - 30;

var colors = d3.scale.category10();
var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;"

var node_drag = d3.behavior.drag()
					.on("dragstart", dragstart)
					.on("drag", dragmove)
					.on("dragend", dragend);

var svg = d3.select("body")
			.append("svg:svg")
			.attr("width", width)
			.attr("height", height)
			.attr("pointer-events", "all")
			.append('svg:g')
			.call(d3.behavior.zoom().on("zoom", rescale))
			.on("dblclick.zoom", null)
			.append('svg:g')

var socle = svg.append('svg:rect')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', 'transparent')
			.style("cursor", "move")

var force = d3.layout.force()
                     .nodes(data.nodes)
                     .links(data.links)
                     .size([width, height])
                     .linkDistance(120)
                     .charge(-1000)

force.start();
for (var i = n * n; i > 0; --i) force.tick();
force.stop();

//Update links.
var link = svg.selectAll("line.link")
  			.data(data.links)
			.enter()
			.append("svg:line")
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; })
			.attr("class", "link")
			.attr("stroke", "#DDD")
			.attr("stroke-width", 5)

var node = svg.selectAll("g.node")
				.data(data.nodes)
				.enter()
				.append("svg:g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
				.call(node_drag);

		/* Cercle qui apparait sur le hover */
		node.append("circle")
			.attr("r", 0)
		    .attr("class", "CircleOptions")
			.style("fill", "transparent")
			.style("stroke", "#aaa")
			.style("stroke-opacity", ".5")
			.style("stroke-width", "15")
			.style("stroke-dasharray", "10,5")

		/* Option de déplacement */
		node.append("circle")
			.attr("cx", function(d) { return -d.rayon-5; })
			.attr("cy", function(d) { return -d.rayon-5; })
			.attr("r", 0)
		    .attr("class", "CircleF")
			.style("stroke", "aaa")
			.attr("fill", "white")
			.style("stroke-opacity", ".5")
			.style("stroke-width", "2")

		node.append("svg:image")
		    		.attr("class", "ImageF")
					.attr('x', function(d) { return -d.rayon-15; })
					.attr('y', function(d) { return -d.rayon-15; })
					.attr('width', 20)
					.attr('height', 20)
					.style("visibility", "hidden")
					.attr("xlink:href","http://fluidlog.com/img/move_64.png")
					.style("cursor", "move")

		/* Option d'édition */
		node.append("circle")
			.attr("cx", function(d) { return d.rayon+5; })
			.attr("cy", function(d) { return -d.rayon-5; })
			.attr("r", 0)
		    .attr("class", "CircleE")
			.style("stroke", "aaa")
			.style("stroke-opacity", ".5")
			.attr("fill", "white")
			.style("fill-opacity", "1")
			.style("stroke-width", "2")

		node.append("svg:image")
		    		.attr("class", "ImageE")
					.attr('x', function(d) { return d.rayon-5; })
					.attr('y', function(d) { return -d.rayon-15; })
					.attr('width', 20)
					.attr('height', 20)
					.style("visibility", "hidden")
					.style("cursor", "pointer")
					.attr("xlink:href","http://fluidlog.com/img/edit_64.png")

		// Cercle avec un fond de couleur, sur lequel le text s'affichera
		var cercle = node.append("circle")
				  .attr("class", "nodecircle")
				  .style("fill", color )
				  .style("opacity", 1)
				  .style("stroke", "#DDD")
				  .style("stroke-width", "7")
				  .style("cursor", "pointer")
				  .on("click",click)
				  .attr("r", 0)
				  .transition()
				  .duration(500)
				  .attr("r", function(d) { return d.rayon; })

		  node.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", ".25em")
			.style("font-size", "24px")
			.style("pointer-events", "none")
			.style("font-family", FontFamily)
			.text(function(d) { return d.name; })
			.style("font-size", function(d) { return getTextSize(this, d.rayon) })
			.attr("class", "name")
			.style("fill", color)
	  			  .transition()
	  			  .duration(500)
			.style("fill", "#333");


node.on("mouseover",function(d)
{
				d3.select(this).select('.nodecircle')
								.style("opacity", fade(.2,"#DDD"))

				d3.select(this).select('.CircleOptions')
								.transition()
								.duration(300)
								.attr("r", function(d) { return d.rayon + 20; })

				d3.select(this).select('.CircleF')
								.transition()
								.duration(300)
								.attr("r", 15)

				d3.select(this).select('.ImageF')
								.transition()
								.duration(300)
								.style("visibility", "visible")

				if (d.url != "")
				{
					d3.select(this).select('.ImageE')
									.transition()
									.duration(300)
									.style("visibility", "visible")

					d3.select(this).select('.CircleE')
									.transition()
									.duration(300)
									.attr("r", 15)
				}
});

node.on("mouseout", function(d)
{
				d3.select(this).select('.nodecircle')
								.style("opacity", fade(1,"#DDD"))

				d3.select(this).select('.CircleOptions')
								.transition()
								.duration(300)
								.attr("r", 0)

				d3.select(this).select('.CircleF')
								.transition()
								.duration(300)
								.attr("r", 0)

				d3.select(this).select('.ImageF')
								.transition()
								.duration(300)
								.style("visibility", "hidden")

				if (d.url != "")
				{
					d3.select(this).select('.ImageE')
									.transition()
									.duration(300)
									.style("visibility", "hidden")

					d3.select(this).select('.CircleE')
									.transition()
									.duration(300)
									.attr("r", 0)
				}
});

//lancement du tick
 force.on("tick", tick);


function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function getTextSize(object,r)
{
	var textlength = object.getComputedTextLength();
	var fontsize = Math.min(2 * r, (2 * r - 10) / textlength * 24) + "px";
	return fontsize ;
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

function getFontSize(text,r)
{
	//var fontsize = (4 * r) / text.length-5 + "px"; // algorithme à trouver...
	var fontsize = r/2.8 + "px";
	return fontsize ;
}

function click(d, i)
{
	if (d3.event.defaultPrevented) return;
	d3.select(this).classed("fixed", d.fixed = false)
					.style("stroke", "#DDD");
}

function dragstart(d, i) {
	d3.event.sourceEvent.stopPropagation();
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

$('#help').hover(
 		function(){$('.help').css({'z-index' : 1,'zoom' : 1.7});},
 		function(){$('.help').css({'zoom' : 1});}
 	);

var linkedByIndex = {};
data.links.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}

function fade(opacity,color)
{
    return function(d)
    {
    	node.select(".nodecircle").style("opacity", function(o)
				{
					return isConnected(d, o) ? 1 : opacity;
				})

//		.style("stroke", function(o)
//				{
//					return isConnected(d, o) ? color : "#DDD";
//				});

		link.style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;
        })

        .style("stroke", function(o) {
            return o.source === d || o.target === d ? color : color ;
        });
    }
}

//rescale g
function rescale() {
svg.attr("transform",
  "translate(" + d3.event.translate + ")"
  + " scale(" + d3.event.scale + ")");
}
