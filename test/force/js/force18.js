//Static force layout : http://bl.ocks.org/mbostock/1667139
//Ajout d'HTML dans le SVG dans le niveau 3 en utilisant les foreign object

var data = {
"name": "Fluidlog",
"rayon" : 50,
"level" : 1,
"image" : "http://fluidlog.com/logo_fluidlog_300_trans.png",
"x" : 0, //Renseigné plus tard en fonction de la taille de la fenêtre
"y" : 0, //Renseigné plus tard en fonction de la taille de la fenêtre
"fixed" : "true",
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
		},
		{
			"name": "PAIR",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.com/lesfaitsdesmots/loglink4.2/index.html",
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

var n = 100,
	node,
	link,
    nodes,
    links,
	width = window.innerWidth - 30, 
	height = window.innerHeight - 30;

data.x = window.innerWidth /2, 
data.y = window.innerHeight /2;

var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;"


var force = d3.layout.force()
	.linkDistance(100)
	.charge(-2500)
    .size([width, height])
//.on("tick", tick) // Remplacé par une boucle dans update()

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

var node_drag = d3.behavior.drag()
					.on("dragstart", dragstart)
					.on("drag", dragmove)
					.on("dragend", dragend)

nodes = flatten(data);
links = d3.layout.tree().links(nodes);


function onTimeTick()
{
	force.nodes(nodes)
		.links(links)
	// Run the layout a fixed number of times.
	// The ideal number of times scales with graph complexity.
	force.start();
	for (var i = n * n; i > 0; --i) force.tick();
	force.stop();
}

onTimeTick();	
update();

//Initialize the display to show a few nodes.
data.children.forEach(toggleAll);

// Restart the force layout.
nodes = flatten(data);
links = d3.layout.tree().links(nodes);
update();
force.on("tick", tick);

function update()
{
	node = svg.selectAll(".node");
		node = node.data(nodes, function(d) { return d.id });
		nodeEnter = node.enter()
						.append("g")
						.attr("class", "node")
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
						.call(node_drag)
	
		nodeEnter.append("circle")
			      .attr("class", function(d) { return d.level ? "level" +d.level : "level" +4 ; })
				  .style("fill", "white")
				  .attr("r", 0)
				  .transition()
				  .duration(500)
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
	
		
	nodeEnter.append("foreignObject")
				.attr("x", function(d) { return -d.rayon-2; })
				.attr("y", function(d) { return -d.rayon })
				.attr("width", function(d) { return d.rayon*2; })
				.attr("height", function(d) { return d.rayon*2; })
				.append("xhtml:body")
				.style("width",function(d) { return d.rayon*2+"px"; })
				.style("height",function(d) { return d.rayon*2+"px"; })
	      		.attr("class", "fObjectCircle")
				.html(function(d) 
				{
					if (d.level > 1)
					{
						var fontsize = getFontSize(d.name, d.rayon);
						var inputtext = '<div class="intocircle" style="color: steelblue; font-size: '+fontsize+';"><span class="middlespan">';
						inputtext += d.name;
						inputtext += '</span></div>';
						
						return inputtext;
					}
				})
					
		//Ajout d'un cercle invisible au dessus pour gérer l'approche de la souris sur le noeud...
	  nodeEnter.append("circle")
	      		.attr("class", "circle2")
	      		.attr("r", function(d) { if (d.level>1) return d.rayon * 2; else return 0 })
	      		.on("click", click)
			      .on("mouseover", function(d) { if (d.level==2) {
			    	  hover(d);
			    	  nodes = flatten(data);
			    	  links = d3.layout.tree().links(nodes);
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
				  .attr("x1", function(d) { return d.source.x; })
				  .attr("y1", function(d) { return d.source.y; })
				  .attr("x2", function(d) { return d.target.x; })
				  .attr("y2", function(d) { return d.target.y; });
		
		  link.exit().remove();
}

function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; })

	  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

//Returns a list of all nodes under the root.
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

function getFontSize(text,r) 
{
	//var fontsize = (4 * r) / text.length-5 + "px"; // algorithme à trouver...
	var fontsize = r/2.8 + "px";
	return fontsize ; 
}

function click(d,i) 
{ 
		if (d3.event.defaultPrevented) return;
		d3.select(this).classed("fixed", d.fixed = false);
		if (d.level==3) 
			window.open("//"+d.url)
}

function dragstart(d, i) 
{
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
	if (d.level<3) 
		d3.select(this).classed("fixed", d.fixed = true);
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
