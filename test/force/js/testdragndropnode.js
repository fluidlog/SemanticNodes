var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
var color_type_rgba = {"project" : "137,165,229", "actor" : "242,133,185", "idea" : "255,217,141", "ressource" : "205,249,137", "without" : "white"};
var image_type = {"project" : "lab", "actor" : "user", "idea" : "idea", "ressource" : "tree", "without" : "circle thin"};
var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;";
var n = 100;
var message_offline = "Connectez-vous à internet pour pouvoir continuer";
var debug = true;
var duration = 500;
// variables for drag/drop
var targetNode = null;
var targetNodeSvg = null;
var draggingNode = null;
var svgNode = null;
var dNode = null;

var width = window.innerWidth - 10,
		height = window.innerHeight - 50;

//local ou distant ?
var online = navigator.onLine;

dataset = {
		nodes:[
					 {index:0, label: "P", type:"project" },
						 {index:1, label: "A", type:"actor" },
						 {index:2, label: "I", type:"idea" },
						 {index:3, label: "R", type:"ressource" },
					],
		edges:[
					 {source:0, target:1, type:"likedto"},
					 {source:0, target:2, type:"likedto"},
					],
		};


/* =========================================
 *
 *  Initialisation et chargement du graph D3js
 *
 *  ======================================== */

// init svg
var outer = d3.select("#chart")
		.append("svg")
		.attr("width", width)
		.attr("height", height)

var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", rescale);

var svg = outer
	.append('g')
		// .call(d3.behavior.zoom().on("zoom", rescale))
		.call(zoomListener)
		.on("dblclick.zoom", null)
		.append('g')

svg.append('rect')
		.attr('x', -width*3)
		.attr('y', -height*3)
		.attr('width', width*7)
		.attr('height', height*7)

// init force layout
var force = d3.layout.force()
		.size([width, height])
		.nodes(dataset.nodes)
		.links(dataset.edges)
		.linkDistance(150)
		.charge(-2000)

var diagonal = d3.svg.diagonal();

var svgNodes, svgLinks, tempConnector;

force.start();
for (var i = n * n; i > 0; --i) force.tick();
force.stop();

function initiateDrag(d, svgNode) {
    draggingNode = d;
    d3.select(svgNode).select('.ghostCircle').attr('pointer-events', 'none');
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
    d3.select(svgNode).attr('class', 'node activeDrag');

		//Make drag node on the back (first of the list)
		svg.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
        if (a.index != draggingNode.index) return 1; // a is not the hovered element, send "a" to the back
        else return -1; // a is the hovered element, bring "a" to the front
    });

    dragStarted = null;
}

// Define the drag listeners for drag/drop behaviour of nodes.
dragListener = d3.behavior.drag()
.on("dragstart", function(d) {
		dragStarted = true;
		// nodes = force.nodes(d);
		d3.event.sourceEvent.stopPropagation();
		// it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
})
.on("drag", function(d) {
		draggingNode = d;
		if (dragStarted) {
				initiateDrag(d, this);
		}

		draggingNode.x += d3.event.dx;
		draggingNode.y += d3.event.dy;
	  movexy();
		updateTempConnector();
}).on("dragend", function(d) {
		svgNode = this;
		draggingNode = d;

		//Make node ordred by index
		svg.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
        if (a.index > b.index) return 1; // a is not the hovered element, send "a" to the back
        else return -1; // a is the hovered element, bring "a" to the front
    });

		if (targetNode) {
			console.log("targetNode :"+targetNode.index)

			d3.select(svgNode)
					.transition()
					.duration(duration)
					.attr("transform", function (d){ return "translate("+d.px+","+d.py+")" })

			d3.selectAll(".link")
					.transition()
					.duration(duration)
					.attr("d", diagonal
						.source(function(d) { return {"x":d.source.px, "y":d.source.py}; })
						.target(function(d) { return {"x":d.target.px, "y":d.target.py}; })
					)

			//Come back to the old position
			draggingNode.x = draggingNode.px;
			draggingNode.y = draggingNode.py;

			drawLink();

			endDrag();
		} else {
			//Re-initialisation of px and py
			draggingNode.px = draggingNode.x;
			draggingNode.py = draggingNode.y;

			endDrag();
		}
});

function endDrag() {
		targetNode = null;
		d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
		d3.select(svgNode).attr('class', 'node');
		// now restore the mouseover event or we won't be able to drag a 2nd time
		d3.select(svgNode).select('.ghostCircle').attr('pointer-events', '');
		updateTempConnector();
		if (draggingNode !== null) {
				// centerNode(draggingNode);
				draggingNode = null;
		}
}

function drawLink ()
{
	//Search if there is a link between the two nodes
	var searchLink1 = d3.select("#edge"+draggingNode.index+"_"+targetNode.index);
	var searchLink2 = d3.select("#edge"+targetNode.index+"_"+draggingNode.index);

	if (!searchLink1.node() && !searchLink2.node())
	{
		// Add new edge between the two nodes
		var sourceObj = targetNode;
		var targetObj = draggingNode;
		var datalink = { type : "loglink:linkedto",
										source: sourceObj,
										target: targetObj,
									};

		dataset.edges.push(datalink);

		var newLink = d3.svg.diagonal()
				.source({"x":targetNode.x, "y":targetNode.y})
				.target({"x":draggingNode.x, "y":draggingNode.y})
				// .projection(function(d) { return [d.y, d.x]; });

		var newPath = svg
				.insert("path", ".node")
				.attr("class", "link")
				.attr("stroke", "#ccc")
				.attr("stroke-width", "1.5px")
				.style("fill", "none")
				.attr("id", "edge"+draggingNode.index + "_" + targetNode.index)
				.attr("d", newLink)

		totalLengthPath = newPath.node().getTotalLength();

		newPath
			.attr("stroke-dasharray", totalLengthPath + " " + totalLengthPath)
			.attr("stroke-dashoffset", totalLengthPath)
			.transition()
			.duration(duration)
			.attr("stroke-dashoffset", 0)
			.each("end", function() {
				newPath.attr("stroke-dasharray", "none")
				svgLinks = svg.selectAll(".link").data(dataset.edges)
			})
	}
}

function movexy()
{
		svgLinks.attr("d", diagonal
								.source(function(d) { return {"x":d.source.x, "y":d.source.y}; })
								.target(function(d) { return {"x":d.target.x, "y":d.target.y}; })
							)

		svgNodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

// Function to update the temporary connector indicating dragging affiliation
var updateTempConnector = function() {
    var data = [];
    if (draggingNode !== null && targetNode !== null) {
        data = [{
            source: {x1 : targetNode.x, y1 : targetNode.y},
            target: {x2 : draggingNode.x, y2 : draggingNode.y}
        }];
    }
    var tempConnector = svg.selectAll(".templink").data(data);

		tempConnector.enter()
				.insert("line", ".node")
        .attr("class", "templink")
				.attr('pointer-events', 'none')
				.attr('stroke', '#eee')
				.attr('fill', 'none')
				.attr('stroke-width', '40')
				.attr("stroke-opacity", ".5")
				.attr("x1", function (d) { return d.source.x1 })
				.attr("y1", function (d) { return d.source.y1 })
				.attr("x2", function (d) { return d.target.x2 })
				.attr("y2", function (d) { return d.target.y2 })     

		tempConnector
				.attr("x1", function (d) { return d.source.x1 })
				.attr("y1", function (d) { return d.source.y1 })
				.attr("x2", function (d) { return d.target.x2 })
				.attr("y2", function (d) { return d.target.y2 })     

		tempConnector.exit().remove();
};

drawGraph();

// drawGraph force layout
function drawGraph()
{
	var svgNodesEnter, svgLinksEnter;

	svgNodes = svg.selectAll(".node")
										.data(dataset.nodes, function(d) { return d.index;});

	svgNodesEnter = svgNodes
						.enter()
						.append("g")
						.attr("id","g_closed_flud")
							.attr("class", "node")
							.attr("index", function(d) { return d.index;})
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

	/*
	*
	* Circle node
	*
	* */
	svgNodesEnter
						.call(dragListener)
						.append("circle") //Rect with round corner = circle ;-)
						.attr("cx", 0)
						.attr("cy", 0)
						.attr("id", "flud")
						.attr("class", "node_circle")
						.style("fill", function(d) { return color_type[d.type] } )
						.style("stroke-width", 7)
						.style("stroke-opacity", .5)
						.style("cursor", "pointer")
						.attr("r", 20)

	// phantom node to give us mouseover in a radius around it
	svgNodesEnter.append("circle")
      .attr('class', 'ghostCircle')
			.attr("r", 100)
      .attr("opacity", 0.2) // change this to zero to hide the target area
  		.style("fill", "yellow")
      .attr('pointer-events', 'mouseover')
      .on("mouseover", function(node) {
          overCircle(node, d3.select(this.parentNode));
      })
      .on("mouseout", function(node) {
          outCircle(node, d3.select(this.parentNode));
      });

svgNodesEnter.append("text")
	.attr("text-anchor", "middle")
	.attr("y", 5)
	.style("font-size", "24")
	.style("font-weight", "bold")
	.text(function(d) {
			return d.label+d.index;
	});

	svgLinks = svg.selectAll(".link")
			.data(dataset.edges)

	svgLinksEnter	= svgLinks.enter()
			.insert("path", ".node")
			.attr("class", "link")
			.attr("stroke", "#ccc")
			.attr("stroke-width", "1.5px")
			.style("fill", "none")
			.attr("id", function(d) { return "edge"+d.source.index + "_" + d.target.index; })
			.attr("d", diagonal)
}

// rescale g
function rescale() {
	trans=d3.event.translate;
	scale=d3.event.scale;

	svg.attr("transform",
			"translate(" + trans + ")"
			+ " scale(" + scale + ")");
}

var overCircle = function(d, d3Node) {
	targetNode = d;
	targetNodeSvg = d3Node.node();
		updateTempConnector();
};
var outCircle = function(d, d3Node) {
		targetNode = null;
		targetNodeSvg = null;
		updateTempConnector();
};
