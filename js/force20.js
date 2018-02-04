//Static force layout : http://bl.ocks.org/mbostock/1667139
//Ajout d'HTML dans le SVG dans le niveau 3 en utilisant les foreign object

var data = {
"name": "Fluidlog",
"rayon" : 50,
"level" : 1,
"image" : "http://fluidlog.initiative.place/logo_fluidlog_300_trans.png",
"x" : 0, //Renseigné plus tard en fonction de la taille de la fenêtre
"y" : 0, //Renseigné plus tard en fonction de la taille de la fenêtre
"fixed" : "true",
"children": 
	[{
		"name": "Applis",
		"rayon" : 40,
		"level" : 2,
		"children": 
		[{
			"name": "FluidGraph",
			"description": "You can create your own Carto PAIR an save it locally",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.initiative.place/applis/fluidgraphclient/index.html",
		},
                {
                        "name": "Carto PAIR Viewer",
                        "description": "You can view and open local or distant graphs",
                        "rayon" : 30,
                        "level" : 3,
                        "url" : "fluidlog.initiative.place/applis/cartopairviewer/",
                },
		{
			"name": "Fludy",
			"description": "You can create your own QQCOQP graph an save it locally",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.initiative.place/lesfaitsdesmots/loglink7.1/",
		},
		{
			"name": "Fludy Viewer",
			"description": "You can view all fludy map (local or external)",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.initiative.place/applis/fludyviewer/",
		}]
	},
	{
		"name": "Démos",
		"rayon" : 40,
		"level" : 2,
		"children": 
		[{
			"name": "Cartographie sémantique",
			"description": "Les acteurs de la cartographie sémantique",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.initiative.place/lesfaitsdesmots/loglink4.1/index.html",
		},
		{
			"name": "Semantic Nodes",
			"description": "Application permettant d'ajouter des noeuds dans un graphe (Béta)",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.initiative.place/lesfaitsdesmots/loglink1.1/index.html",
		},
		{
			"name": "PAIR v1.2",
			"description": "Cartographie des PAIR (Enregistrement Triplestore)",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.initiative.place/lesfaitsdesmots/loglink1.2/index.html",
		},
		{
			"name": "PAIR v4.4",
			"description": "Cartographie des PAIR (Nouvelle interface, Enregistrement Triplestore)",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.initiative.place/lesfaitsdesmots/loglink4.4/index.html",
		},
		{
			"name": "PAIR v4.6",
			"description": "Cartographie des PAIR (Enregistrement local)",
			"rayon" : 30,
			"level" : 3,
			"url" : "fluidlog.initiative.place/lesfaitsdesmots/loglink4.6/index.html",
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
				"description": "Compte Twitter de Fluidlog",
		 		"rayon" : 30, 
				"level" : 3,
		 		"url": "twitter.com/fluidlog"
		 	},
		 	{
		 		"name": "Facebook", 
				"description": "Compte facebook",
		 		"rayon" : 30, 
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
				"description": "Wiki du projet Fluidlog",
		 		"rayon" : 30, 
				"level" : 3,
		 		"url": "fluidlog.cloud.xwiki.com"
		 	},
		 	{
		 		"name": "Blog",	
				"description": "Les Ontologies Graphiques",
		 		"rayon" : 30, 
				"level" : 3,
		 		"url": "lesontologiesgraphiques.wordpress.com"
		 	},
		 	{
		 		"name": "Tutoriels",	
				"description": "Tutoriels vidéos",
		 		"rayon" : 30, 
				"level" : 3,
		 		"url": "dailymotion.com/fluidlog"
		 	},
		 	{
		 		"name": "Github",	
				"description": "Code source",
		 		"rayon" : 30, 
				"level" : 3,
		 		"url": "github.com/fluidlog"
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
	.linkDistance(75)
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
	node = svg.selectAll(".node")
				.data(nodes, function(d) { return d.id });
	
	var nodeEnter = node.enter()
					.append("g")
					.attr("class", "node")
					.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
					.on("click", click)
					.on("mouseover", mouseover)
				    .on("mouseout", mouseout)
					.call(node_drag)
	
		/* Cercle qui apparait sur le hover */
		nodeEnter.append("circle")
			.attr("r", 0)
		    .attr("class", "CircleOptions")
			.style("fill", "transparent")
			.style("stroke", "steelblue")
			.style("stroke-opacity", ".5")
			.style("stroke-width", "15")
			.style("stroke-dasharray", "10,5")

		/* Option de déplacement */
		nodeEnter.append("circle")
			.attr("cx", function(d) { return -d.rayon-5; })
			.attr("cy", function(d) { return -d.rayon-5; })
			.attr("r", 0)
		    .attr("class", "CircleF")
			.style("stroke-opacity", ".5")
			.style("stroke", "steelblue")
			.attr("fill", "white")
			.style("fill-opacity", "1")
			.style("stroke-width", "2")

		nodeEnter.append("svg:image")
		    		.attr("class", "ImageF")
					.attr('x', function(d) { return -d.rayon-15; })
					.attr('y', function(d) { return -d.rayon-15; })
					.attr('width', 20)
					.attr('height', 20)
					.style("visibility", "hidden")
					.attr("xlink:href","http://fluidlog.initiative.place/img/move_64.png")
					.style("cursor", "move")
					.append("title").text("Drag'n drop\nClic to free")

		/* Option de lien */
		nodeEnter.append("circle")
			.attr("cx", function(d) { return d.rayon+5; })
			.attr("cy", function(d) { return -d.rayon-5; })
			.attr("r", 0)
		    .attr("class", "CircleL")
			.style("stroke-opacity", ".5")
			.style("stroke", "steelblue")
			.attr("fill", "white")
			.style("fill-opacity", "1")
			.style("stroke-width", "2")

		nodeEnter.append("svg:image")
					.on("click", openLink)
		    		.attr("class", "ImageL")
					.attr('x', function(d) { return d.rayon-5; })
					.attr('y', function(d) { return -d.rayon-15; })
					.attr('width', 20)
					.attr('height', 20)
					.style("visibility", "hidden")
					.style("cursor", "pointer")
					.attr("xlink:href","http://fluidlog.initiative.place/img/arrow_full_upperright_64.png")
					.append("title").text(function(d) { return d.url; })

		/* Option d'information */
		nodeEnter.append("circle")
			.attr("cx", function(d) { return -d.rayon-5; })
			.attr("cy", function(d) { return d.rayon+5; })
			.attr("r", 0)
		    .attr("class", "CircleI")
			.style("stroke-opacity", ".5")
			.style("stroke", "steelblue")
			.attr("fill", "white")
			.style("fill-opacity", "1")
			.style("stroke-width", "2")

		nodeEnter.append("svg:image")
		    		.attr("class", "ImageI")
					.attr('x', function(d) { return -d.rayon-15; })
					.attr('y', function(d) { return d.rayon-5; })
					.attr('width', 20)
					.attr('height', 20)
					.style("visibility", "hidden")
					.attr("xlink:href","http://fluidlog.initiative.place/img/information_64.png")
					.append("title").text(function(d) { return d.name; })

		/* Option de description */
		nodeEnter.append("circle")
			.attr("cx", function(d) { return d.rayon+5; })
			.attr("cy", function(d) { return d.rayon+5; })
			.attr("r", 0)
		    .attr("class", "CircleD")
			.style("stroke-opacity", ".5")
			.style("stroke", "steelblue")
			.attr("fill", "white")
			.style("fill-opacity", "1")
			.style("stroke-width", "2")

		nodeEnter.append("svg:image")
		    		.attr("class", "ImageD")
					.attr('x', function(d) { return d.rayon-5; })
					.attr('y', function(d) { return d.rayon-5; })
					.attr('width', 20)
					.attr('height', 20)
					.style("visibility", "hidden")
					.attr("xlink:href","http://fluidlog.initiative.place/img/comment_64.png")
					.append("title").text(function(d) { return d.description; })

		//Cercle sur lequel nous allons déposer le texte
		nodeEnter.append("circle")
		      .attr("class", function(d) { return d.level ? "level" +d.level : "level" +4 ; })
			  .style("fill", "white")
			  .attr("r", 0)
					.transition()
					.duration(500)
			  .attr("r", function(d) { return d.rayon; })
			  .style("stroke", "steelblue")
			  .style("stroke-width", "2")
			     
		nodeEnter.append("svg:image")
					.attr('x', -30)
					.attr('y', -30)
					.attr('width', function(d) {  if (d.image) return 60; })
					.attr('height', function(d) {  if (d.image) return 60; })
					.attr("xlink:href",function(d) { return d.image; })	
		
	nodeEnter.append("foreignObject")
				.attr("x", function(d) { return -d.rayon-2; })
				.attr("y", function(d) { return -d.rayon-2; })
				.attr("width", function(d) { return d.rayon*2+4; })
				.attr("height", function(d) { return d.rayon*2+4; })
				.append("xhtml:body")
				.style("width",function(d) { return d.rayon*2+4+"px"; })
				.style("height",function(d) { return d.rayon*2+4+"px"; })
	      		.attr("class", "fObjectCircle")
				.html(function(d) 
				{
					if (d.level > 1)
					{
						var fontsize = getFontSize(d.name, d.rayon);
						var inputtext = '<div class="intocircle" style="color:steelblue; font-size: '+fontsize+';"><span class="middlespan">';
						inputtext += d.name;
						inputtext += '</span></div>';
						
						return inputtext;
					}
				})
					
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

function openLink(d) 
{
	window.open("//"+d.url)
}

function mouseover(d,i)
{
	if (d.level==2)
	{
		hover(d);
		nodes = flatten(data);
		links = d3.layout.tree().links(nodes);
		update(d);
	}
	else if (d.level==3)
	{
		d3.select(this).select('.CircleOptions').transition().duration(300)
				.attr("r", function(d) { return d.rayon + 20; })
		d3.select(this).select('.CircleF').transition().duration(300).attr("r", 15)
		d3.select(this).select('.ImageF').transition().duration(300).style("visibility", "visible")
		d3.select(this).select('.ImageL').transition().duration(300).style("visibility", "visible")
		d3.select(this).select('.CircleL').transition().duration(300).attr("r", 15)
		d3.select(this).select('.ImageI').transition().duration(300).style("visibility", "visible")
		d3.select(this).select('.CircleI').transition().duration(300).attr("r", 15)
		d3.select(this).select('.ImageD').transition().duration(300).style("visibility", "visible")
		d3.select(this).select('.CircleD').transition().duration(300).attr("r", 15)
	}
}


function mouseout(d) 
{ 
	if (d.level==2)
		hover(d);
	else if (d.level==3)
	{		
		d3.select(this).select('.CircleOptions').transition().duration(300).attr("r", 0)

		d3.select(this).select('.CircleF').transition().duration(300).attr("r", 0)		
		d3.select(this).select('.ImageF').transition().duration(300).style("visibility", "hidden")		
		d3.select(this).select('.ImageL').transition().duration(300).style("visibility", "hidden")		
		d3.select(this).select('.CircleL').transition().duration(300).attr("r", 0)					
		d3.select(this).select('.ImageI').transition().duration(300).style("visibility", "hidden")		
		d3.select(this).select('.CircleI').transition().duration(300).attr("r", 0)
		d3.select(this).select('.ImageD').transition().duration(300).style("visibility", "hidden")		
		d3.select(this).select('.CircleD').transition().duration(300).attr("r", 0)
	}
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
