	var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
	var color_type_rgba = {"project" : "137,165,229", "actor" : "242,133,185", "idea" : "255,217,141", "ressource" : "205,249,137", "without" : "white"};
	var image_type = {"project" : "lab", "actor" : "user", "idea" : "idea", "ressource" : "tree", "without" : "circle thin"};
	var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;";
	var rayon = width_closed_flud/2;
	var n = 100;
	var message_offline = "Connectez-vous à internet pour pouvoir continuer";
	var debug = true;

	var width_closed_flud = 80,
	height_closed_flud = 80,
	width_opened_flud = 250,
	height_opened_flud = 250,
	arrondi = 50;

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
			       {source:0, target:1},
			       {source:0, target:2},
			       {source:0, target:3},
			       {source:1, target:2},
			       {source:1, target:3},
			      ],
			};

	
	/* =========================================
	 *  
	 *  Initialisation et chargement du graph D3js
	 *  
	 *  ======================================== */

	//mouse event vars
	var selected_node = null,
	    selected_link = null,
	    mousedown_link = null,
	    mousedown_node = null,
	    mouseup_node = null;

	var width = window.innerWidth - 10,
	    height = window.innerHeight - 50;

	// init svg
	var outer = d3.select("#chart")
	  	.append("svg:svg")
	    .attr("width", width)
	    .attr("height", height)

	var svg = outer
	  .append('svg:g')
	    .call(d3.behavior.zoom().on("zoom", rescale))
	    .on("dblclick.zoom", null)
	    .append('svg:g')
	    .on("mousemove", mousemove)
	    .on("mousedown", mousedown)
	    .on("mouseup", mouseup)

	var node_drag = d3.behavior.drag()
					.on("dragstart", dragstart)
					.on("drag", dragmove)
					.on("dragend", dragend);

	svg.append('svg:rect')
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

	force.start();
	for (var i = n * n; i > 0; --i) force.tick();
	force.stop();

	// line displayed when dragging new nodes
	var drag_line = svg.append("line")
	    .attr("class", "drag_line")
	    .attr("x1", 0)
	    .attr("y1", 0)
	    .attr("x2", 0)
	    .attr("y2", 0);

	var nodes = force.nodes(),
	    links = force.links(),
	    node = svg.selectAll(".node"),
	    link = svg.selectAll(".link");
	
	// add keyboard callback
	if (online)
	{
		d3.select(window)
		    .on("keydown", keydown);
	}
	else
		message (message_offline,"warning");

	redraw();

	// redraw force layout
	function redraw()
	{
		link = link.data(links, function(d) { return d.source.iri_id + "-" + d.target.iri_id; });
		link.enter()
	  		.insert("line", ".node")
	  	  .attr("class", "link")
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; })
	      .on("mousedown",
	        function(d) {
	          mousedown_link = d;
	          if (mousedown_link == selected_link) selected_link = null;
	          else selected_link = mousedown_link;
	          selected_node = null;
	          redraw();
	        })

        link.exit().remove();

		link.classed("link_selected", function(d)
				{
					return d === selected_link;
				});

		node = node.data(nodes, function(d) { return d.iri_id;});
		var node_enter_g = node
							.enter()
							.append("g")
				        	.attr("class", function(d) { return d.type == "deleted" ? "deleted" : "node "+d.type;})
				        	.attr("iri_id", function(d) { return d.iri_id;})
							.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

		/* 
		 * 
		 * Circle node 
		 * 
		 * */
		var flud = node_enter_g
				.append("rect") //Rect with round corner = circle ;-)
				.attr("id", "node_circle")
				.attr("class", "node_circle")
				.style("fill", function(d) { return color_type[d.type] } )
				.attr("rx", arrondi)
				.attr("ry", arrondi)
				.style("stroke", "#DDD")
				.style("stroke-width", 7)
				.style("cursor", "pointer")
				.attr("x", -width_closed_flud/2)
				.attr("y", -height_closed_flud/2)
				.attr("width", width_closed_flud)
				.attr("height", height_closed_flud)

		/* 
		 * 
		 * Drag option 
		 * 
		 * */

		/* Drag Image */
		var fo_drag_option_image = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_drag_option_image")
					.attr('x', -45)
					.attr('y', -55)
					.attr('width', 22)
					.attr('height', 22)

		//xhtml div image
		var fo_xhtml_drag_image = fo_drag_option_image
					.append('xhtml:div')
				    .attr("class", "fo_div_image")
				    .attr("id", "fo_div_drag_option_image")
				    //Image add when hover

		/* 
		 * 
		 * action zones
		 * 
		 * */

		/* Drag Zone */
		var fo_drag_option_zone = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_drag_option_zone")
					.attr('x', -width_closed_flud)
					.attr('y', -height_closed_flud)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)
			    
		//xhtml div zone
		var fo_xhtml_drag_option_zone = fo_drag_option_zone
					.append('xhtml:div')
				    .attr("style", "padding:40px; text-align:right")

		//action on drag zone
		var action_on_drag_option_zone = fo_drag_option_zone
					.on("mouseover",f_ondragover)
					.on("mouseout",f_ondragout)
					.style("cursor", "move")
					.call(node_drag)
					.append("title").text("Drag & drop")

		  function f_ondragover(d)
		  {
				var el = d3.select(this);
				var p_el = d3.select(this.parentNode);

				p_el.select('#node_circle')
										.attr("rx", arrondi-30)
										.attr("ry", arrondi-30)
										.style("stroke-width", 15)
										.style("opacity", fade(.2,"#DDD"))
					
				p_el.select('#fo_div_drag_option_image')
										.append('i')
									    .attr("id", "fo_i_drag_option_image")
									    .attr("class", "ui large move icon")
										.attr("style", "display:inline")
		  }

		  function f_ondragout(d)
			{
				var el = d3.select(this);
				var p_el = d3.select(this.parentNode);

				p_el.select('#node_circle')
										.attr("rx", arrondi+30)
										.attr("ry", arrondi+30)
										.style("stroke-width", 7)
										.style("opacity", fade(1,"#DDD"))

				p_el.select('#fo_i_drag_option_image').remove();
		}


		 //lancement du tick
		force.on("tick", tick);
		d3.select("#waiting").style("display", "none");
	
		//On supprime tous les noeuds "deleted"
		d3.selectAll(".deleted").remove();

	}

 	var linkedByIndex = {};
	dataset.edges.forEach(function(d) {
	    linkedByIndex[d.source.index + "," + d.target.index] = 1;
	});

	function isConnected(a, b) {
	    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
	}

	function fade(opacity,color)
	{
	    return function(d)
	    {
	    	node.select("#node_circle")
	    			.style("opacity", function(o)
					{
						return isConnected(d, o) ? 1 : opacity;
					})
			node.select(".circle_id")
	    			.style("opacity", function(o)
					{
						return isConnected(d, o) ? 1 : opacity;
					})
			node.select(".text_id")
					.style("opacity", function(o)
					{
						return isConnected(d, o) ? 1 : opacity;
					})
			node.select(".label")
					.style("opacity", function(o)
					{
						return isConnected(d, o) ? 1 : opacity;
					})

			link.style("stroke-opacity", function(o) {
	            return o.source === d || o.target === d ? 1 : opacity;
	        })
	    }
	}

	function getTextSize(object,r)
	{
		var textlength = object.getComputedTextLength();
		var fontsize = Math.min(2 * r, (2 * r - 10) / textlength * 24) + "px";
		return fontsize ;
	}

	function tick()
	{
		link.attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });

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
	    		sparql_increment_node_id();
	    		var new_node_iri_id = parseInt(sparql_get_new_node_iri().split("/").pop(), 10);

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
	    	  	sparql_add_node(mousedown_node.iri_id, new_node_iri_id);
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
						.select("#node_circle").style("stroke", "#999");
		tick();
		force.resume();
	}

	function keydown() {
		  if (!selected_node && !selected_link) return;
		  switch (d3.event.keyCode) {
		    case 8: // backspace
		    	break;
		    case 46: { // delete
		      if (selected_node) {
		        nodes.splice(nodes.indexOf(selected_node), 1);
		        spliceLinksForNode(selected_node);
		        sparql_delete_node(selected_node.iri_id)
		      }
		      else if (selected_link) {
		        links.splice(links.indexOf(selected_link), 1);
		        sparql_delete_link(selected_link.source.iri_id, selected_link.target.iri_id)
		      }
		      selected_link = null;
		      selected_node = null;
		      redraw();
		      break;
		    }
		  }
		}
