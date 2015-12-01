var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
var color_type_rgba = {"project" : "137,165,229", "actor" : "242,133,185", "idea" : "255,217,141", "ressource" : "205,249,137", "without" : "white"};
var image_type = {"project" : "lab", "actor" : "user", "idea" : "idea", "ressource" : "tree", "without" : "circle thin"};
var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;";
var rayon = width_closed_flud/2;
var n = 100;
var message_offline = "Connectez-vous à internet pour pouvoir continuer";
var debug = true;

//mouse event vars
var selected_node = null,
		selected_link = null,
		mousedown_link = null,
		mousedown_node = null,
		mouseup_node = null;

var width = window.innerWidth - 10,
		height = window.innerHeight - 50;

var width_closed_flud = 50,
height_closed_flud = 30;

//local ou distant ?
var online = navigator.onLine;

dataset = {
		nodes:[
					 {iri_id:0, label: "Project", type:"project" },
						 {iri_id:1, label: "Actor", type:"actor" },
						 {iri_id:2, label: "Idea", type:"idea" },
						 {iri_id:3, label: "Ressource sur plusieurs lignes...", type:"ressource" },
					],
		edges:[
					 {source:0, target:1, type:"likedto"},
					 {source:0, target:2, type:"likedto"},
					 {source:0, target:3, type:"likedto"},
					 {source:1, target:2, type:"likedto"},
					 {source:1, target:3, type:"likedto"},
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

var svg = outer
	.append('g')
		.call(d3.behavior.zoom().on("zoom", rescale))
		.on("dblclick.zoom", null)
		.append('g')
		.on("mousemove", mousemove)
		.on("mousedown", mousedown)
		.on("mouseup", mouseup)

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
		.linkDistance(200)
		.charge(-2000)

force.start();
for (var i = n * n; i > 0; --i) force.tick();
force.stop();

var nodes = force.nodes(),
		links = force.links(),
		node = svg.selectAll(".node"),
		link = svg.selectAll(".link");

redraw();

// redraw force layout
function redraw()
{
	node = node.data(nodes, function(d) { return d.iri_id;});

	var node_enter_g = node
						.enter()
						.append("g")
						.attr("id","g_closed_flud")
							.attr("class", "node")
							.attr("iri_id", function(d) { return d.iri_id;})
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

	/*
	*
	* Circle node
	*
	* */
	var flud = node_enter_g
						.append("rect") //Rect with round corner = circle ;-)
						.attr("id", "flud")
						.attr("class", "node_circle")
						.style("fill", function(d) { return color_type[d.type] } )
						.attr("rx", 50)
						.attr("ry", 50)
						.style("stroke-width", 7)
						.style("stroke-opacity", .5)
						.style("cursor", "pointer")
						.attr("x", -width_closed_flud/2)
						.attr("y", -height_closed_flud/2)
						.attr("width", width_closed_flud)
						.attr("height", height_closed_flud)

	link = link.data(links)
			.enter()
			.insert("line", ".node")
			// .insert("path", ".node")
			.attr("class", "link")
			.style("fill", "none")
			.attr("id", function(d) { return d.source.index + "_" + d.target.index; })
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; })
			// .attr("d", function(d) {
	    //   var dx = d.target.x - d.source.x,
	    //       dy = d.target.y - d.source.y,
	    //       dr = Math.sqrt(dx * dx + dy * dy);
	    //  return "M" +
	    //       d.source.x + "," +
	    //       d.source.y + "A" +
	    //       dr + "," + dr + " 0 0,1 " +
	    //       d.target.x + "," +
	    //       d.target.y;
	    // })
			.on("mousedown",
				function(d) {
					mousedown_link = d;
					if (mousedown_link == selected_link) selected_link = null;
					else selected_link = mousedown_link;
					selected_node = null;
					redraw();
				})

	link.classed("link_selected", function(d)
			{
				return d === selected_link;
			});

		var path_label = svg
												.selectAll(".path_label")
										    .data(links)
										  	.enter()
												.append("text")
										    .attr("class", "path_label")
												.attr("x", function(d) { return d.source.x + (d.target.x - d.source.x)/2; })
										    .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y)/2; })
										    // .append("textPath")
									      // .attr("startOffset", "50%")
									      .attr("text-anchor", "middle")
												// .attr("dx", "50")
											  // .attr("dy", "-10")
									      // .attr("xlink:href", function(d) { return "#" + d.source.index + "_" + d.target.index; })
									      .style("fill", "#000")
									      .style("font-family", "Arial")
									      .text(function(d) { return d.type; });

	 //lancement du tick
	force.on("tick", tick);
}

function tick()
{
	link.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });

	// link.attr("d", function(d) {
	// 	var dx = d.target.x - d.source.x,
	// 			dy = d.target.y - d.source.y,
	// 			dr = Math.sqrt(dx * dx + dy * dy);
	//  return "M" +
	// 			d.source.x + "," +
	// 			d.source.y + "A" +
	// 			dr + "," + dr + " 0 0,1 " +
	// 			d.target.x + "," +
	// 			d.target.y;
	// });

	node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

// rescale g
function rescale() {
	trans=d3.event.translate;
	scale=d3.event.scale;

	svg.attr("transform",
			"translate(" + trans + ")"
			+ " scale(" + scale + ")");
}

function mousedown()
{
	if (!mousedown_node && !mousedown_link) {
		// allow panning if nothing is selected
		svg.call(d3.behavior.zoom().on("zoom"), rescale);
		return;
	}
}

function mousemove()
{
	if (!mousedown_node) return;

	// update drag line
	drag_line
			.attr("x1", mousedown_node.x)
			.attr("y1", mousedown_node.y)
			.attr("x2", d3.svg.mouse(this)[0])
			.attr("y2", d3.svg.mouse(this)[1]);
}

function mouseup()
{
	if (mousedown_node)
	{
		// hide drag line
		drag_line
			.attr("class", "drag_line_hidden")

		if (!mouseup_node)
		{
			// add node
			if (online)
			{
				// Récupération du nouvel iri_id via la fonction "fluidlog" get_new_iri()
//	    		sparql_increment_node_id();
//	    		var new_node_iri_id = parseInt(sparql_get_new_node_iri().split("/").pop(), 10);

				var point = d3.mouse(this);
				var node = {iri_id : new_node_iri_id,
						label : "Node",
						type : "without",
						x: point[0],
						y: point[1]};

				nodes.push(node);

					// new node not selected
					selected_node = null;
					selected_link = null;

					// add link to mousedown node
					links.push({source: mousedown_node, target: node});

					//fonction "fluidlog" permettant d'ajouter un noeud et un lien (depuis le noeud source vers le nouveau noeud) dans le triplestore
//	    	  	sparql_add_node(mousedown_node.iri_id, new_node_iri_id);
			}
			else
				message (message_offline,"warning");
		}

		redraw();
	}
	// clear mouse event vars
	resetMouseVars();
}

function resetMouseVars()
{
	mousedown_node = null;
	mouseup_node = null;
	mousedown_link = null;
}
