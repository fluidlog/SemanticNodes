
var data = {
"name": "Fluidlog",
"rayon" : 50,
"level" : 1,
"image" : "http://fluidlog.com/logo_fluidlog_300_trans.png",
//"x" : 600,
//"y" : 200,
//"fixed" : "true",
"children": 
	[{
		"name": "Démos",
		"rayon" : 40,
		"level" : 2,
		"children": 
		[{
			"name": "Cartographie sémantique",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.com/lesfaitsdesmots/loglink4.1/index.html",
		},
		{
			"name": "Semantic Taskboard",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.com/lesfaitsdesmots/demo/loglink0.1/index.html",
		},
		{
			"name": "Semantic Nodes",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.com/lesfaitsdesmots/loglink1.1/index.html",
		},
		{
			"name": "Open Thesaurus",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.com/lesfaitsdesmots/loglink5.1/index.php",
		}]
	},
	{
		"name": "Contact",
		"rayon" : 40,
		"level" : 2,
		"children": 
		[
		 	{
		 		"name": "Twitter", 	
		 		"rayon" : "30", 
				"level" : 3,
		 		"url": "twitter.com/fluidlog"
		 	},
		 	{
		 		"name": "Facebook", 
		 		"rayon" : "30", 
				"level" : 3,
		 		"url": "fr-fr.facebook.com/yannick.duthe.7"
		 	},
		 ]
	},
	{
		"name": "Publications",
		"rayon" : 40,
		"level" : 2,
		"children": 
		[
		 	{
		 		"name": "Wiki",
		 		"rayon" : "30", 
				"level" : 3,
		 		"url": "fluidlog.cloud.xwiki.com"
		 	},
		 	{
		 		"name": "Blog",	
		 		"rayon" : "30", 
				"level" : 3,
		 		"url": "lesontologiesgraphiques.wordpress.com"
		 	},
		 ]
	}]
};

var width = 1200, // Default
    height = 700, // Default
    node,
    link,
    nodes,
    links,
    n=100;

var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;"

var force = d3.layout.force()
	.linkDistance(100)
	.charge(-2500)
//	.chargeDistance(20)
	.friction(0.6)
//	.gravity(0) //Disable gravity = équilible autour du noeud principal ! Mais pas au centre de la fenêtre... :-(
    .size([width, height])
    .on("tick", tick)

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var node_drag = d3.behavior.drag()
				.on("dragstart", dragstart)
				.on("drag", dragmove)
				.on("dragend", dragend);

update();

//Initialize the display to show a few nodes.
data.children.forEach(toggleAll);
update();


function resize() {
    width = window.innerWidth; 
    height = window.innerHeight;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
}

function update() 
{
	var duration = d3.event && d3.event.altKey ? 5000 : 500;
	var nodelevel1;

	nodes = flatten(data);
	links = d3.layout.tree().links(nodes);
	
	// Restart the force layout.
	force.nodes(nodes)
			.links(links)
			.start();

	// Update nodes.
	node = svg.selectAll(".node");

	node = node.data(nodes, function(d) { return d.id });

	var nodeEnter = node.enter().append("g")
								.attr("class", "node")
								.call(node_drag)
  
      nodeEnter.append("circle")
		      .attr("class", function(d) { return d.level ? "level" +d.level : "level" +4 ; })
			  .style("fill", "white")
			  .attr("r", 0)
			  .transition()
//				.delay(250)
				.duration(500)
//  			  .ease("circle")
			  .attr("r", function(d) { return d.rayon; })
			  .style("stroke", "steelblue")
			  .style("stroke-width", "2")
			  .style("cursor", "pointer")
	  
	  nodeEnter.append("svg:image")
				.attr('x', -30)
				.attr('y', -30)
				.attr('width', function(d) {  if (d.image) return 60; })
				.attr('height', function(d) {  if (d.image) return 60; })
				.attr("xlink:href",function(d) { return d.image; })

	  nodeEnter.append("title")
	  			.text(function(d) { return d.name; })

	  nodeEnter.append("text")
		.attr("text-anchor", "middle")
		.style("font-size", "24px")
		.style("pointer-events", "none")
		.style("font-family", FontFamily)
		.text(function(d) { if (d.level!=1) return d.name; })
		.style("font-size", function(d) { return getTextSize(this, d.rayon) })
		.style("fill", "white")
  			  .transition()
  			  .duration(500)
		.style("fill", "steelblue")
		.attr("dy", ".35em")

  //Ajout d'un cercle invisible au dessus pour gérer l'approche de la souris sur le noeud...
  nodeEnter.append("circle")
      .attr("class", "circle2")
//      .style("stroke", "steelblue")
//      .style("stroke-width", "1")
	  .attr("r", function(d) { if (d.level>1) return d.rayon * 2; else return 0 })
      .on("click", function(d) 
    		  { 
    	  if (d.level==3) 
    		window.open("//"+d.url)
     	  })
      .on("mouseover", function(d) { if (d.level==2) {
    	  hover(d); 
    	  update(d);
    	  } })
      .on("mouseout", function(d) { if (d.level==2) hover(d); })
	  .style("fill", "transparent")
	  .style("cursor", "pointer")

  node.exit().remove();
  
  // Update links.
  link = svg.selectAll(".link")
  		.data(links, function(d) { return d.target.id; });

  link.enter().insert("line", ".node")
			  .attr("class", "link")
  				.attr("stroke-width", "0")
  			  .transition()
  			  .duration(500)
  				.attr("stroke-width", "5")
  				.attr("stroke", "steelblue")

  link.exit().remove();
}

resize();
d3.select(window).on("resize", resize);

function openLink() 
{
	return function(d) 
	{
		window.open("//"+d.url)
	}
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function color(d) 
{
	switch (d.level)
	{
		case 1 : 
			return "steelblue";
		break
		case 2 : 
			return "red";
		break
	}
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) 
  {
	if (node.children) 
    	node.children.forEach(recurse);
    	if (!node.id) 
    		node.id = ++i;
    	nodes.push(node);
  }

  recurse(root);
  return nodes;
}

function getTextSize(object,r) 
{
	var textlength = object.getComputedTextLength();
	var fontsize = Math.min(2 * r, (2 * r - 8) / textlength * 24) + "px";
	return fontsize ; 
}

function dragstart(d, i) {
	force.stop() // stops the force auto positioning before you start dragging
	d3.select(this).classed("fixed", d.fixed = true);
}

function dragmove(d, i) {
	d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy; 
	tick(); // this is the key to make it work together with updating both px,py,x,y on d !
}

function dragend(d, i) {
	d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
	tick();
	force.resume();
}

function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }

//Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

//Toggle children.
function hover(d) {
 if (d3.event.defaultPrevented) return; // ignore drag
 toggle(d);
}
