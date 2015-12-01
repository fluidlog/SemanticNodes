	var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
	var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;";
	var rayon = 30;
	var n = 100;
	var message_offline = "Connectez-vous à internet pour pouvoir continuer";
	var debug = true;

	//local ou distant ?
	var online = navigator.onLine;

	dataset = {
			nodes:[
			       {iri_id:0, label: "Node", type:"project" },
		           {iri_id:1, label: "Node", type:"actor" },
		           {iri_id:2, label: "Node", type:"idea" },
		           {iri_id:3, label: "Node", type:"ressource" },
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
	 *  Zone de test D3js + Semantic UI
	 *  
	 *  ======================================== */
		  	
var svg_test = d3.select("#chart_test")
			  	.append("svg")
			  	
			    .attr("width", 810)
			    .attr("height", 410)
			    
var g_test1 = svg_test
			  	.append("g")

var rect_test = g_test1
			  	.append("rect")
			    .attr("width", 800)
			    .attr("height", 400)
			    .attr("style", "fill:#CCC")
	  
		var g_test2 = g_test1
				.append('g')

		var circle_test = g_test2
					.append("circle")
					.attr("class", "test_circle")
					.attr("fill", "#eee")
				    .style("stroke", "#aaa")
				    .style("stroke-width", 2)
					.attr("cx", 200)
					.attr("cy", 200)
					.attr("r", 150)
			    
		var fo_test = g_test2
				.append("foreignObject")
				.attr("x",100)
				.attr("y",100)
			    .attr("width", 200)
			    .attr("height", 200)
				
		var fo_test_xhtml = fo_test
				.append('xhtml:div')
			    .attr("class", "fo_xhtml")
		
		//paragraph
		var p_test = fo_test_xhtml
				.append("p")
				.text("Lorem ipsum, Lorem ipsum, Lorem ipsum,Lorem ipsum, Lorem ipsum, Lorem ipsum,Lorem ipsum, Lorem ipsum, Lorem ipsum")
			
		//input
		var input_test = fo_test_xhtml
				.append("div")
			  	.attr("class", "ui input")
			  	.append("input")
			  	.attr("placeholder", "Search...")
			  	.attr("type", "text")
			
		//divider
		var divider_test = fo_test_xhtml
				.append("div")
			  	.attr("class", "ui divider")

			  	//icon
  		var icon_test = fo_test_xhtml
  				.append("i")
			  	.attr("class", "disabled users icon")
			  	
			  	//button
		var button_test = fo_test_xhtml
				.append("div")
			  	.attr("class", "ui button")
			  	.text("button")

	
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
		node_enter_g = node.enter()
				.append("g")
	        	.attr("class", function(d) { return d.type == "deleted" ? "deleted" : "node "+d.type;})
	        	.attr("iri_id", function(d) { return d.iri_id;})
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

		/* Cercle qui apparait sur le hover */
		node_enter_g.append("circle")
			.attr("r", 0)
		    .attr("class", "circle_options")
		    .on("click", function ()
		    		{
	            var d3event = d3.event;
	            d3event.stopPropagation();
		    		})


		/* Cercle principal du noeud, sur lequel se trouve le texte */
		node_enter_g.append("circle")
				  .attr("class", "node_circle")
				  .style("fill", function(d) { return color_type[d.type] } )
				  .attr("r", 0)
				  .transition()
				  .duration(500)
				  .attr("r", rayon)

		/* Cercle entourant l'iri_id du noeud */
		node_enter_g.append("circle")
			.attr("cx", 0)
			.attr("cy", -rayon+5)
			.attr("r", 8)
		    .attr("class", "circle_id")

		/* Text de l'iri_id du noeud */
		node_enter_g.append("text")
			.attr("dx", -1)
			.attr("dy", -rayon+9)
		    .attr("class", "text_id")
			.text(function(d) {
				  return d.iri_id;
			  })

		/* Option de déplacement */
		node_enter_g.append("circle")
			.attr("cx", -rayon-5)
			.attr("cy", -rayon-5)
			.attr("r", 0)
		    .attr("class", "circle_option_drag")
			.style("stroke", "#DDD")
			.attr("fill", "white")
			.style("stroke-width", "2")

		node_enter_g.append("svg:image")
		    		.attr("class", "image_option_drag")
					.attr('x', -rayon-15)
					.attr('y', -rayon-15)
					.attr('width', 20)
					.attr('height', 20)
					.style("visibility", "hidden")
					.attr("xlink:href","img/move_64.png")
					.style("cursor", "move")
					.call(node_drag)
					.append("title").text("Drag & drop")

		if (online || debug == true)
		{
			/* Option d'édition */
			node_enter_g.append("circle")
				.attr("cx", +rayon+5)
				.attr("cy", -rayon-5)
				.attr("r", 0)
			    .attr("class", "circle_edit")
				.style("stroke", "#DDD")
				.attr("fill", "white")
				.style("pointer-events", "none")
				.style("stroke-width", "2")

			node_enter_g.append("svg:image")
			    		.attr("class", "image_edit")
						.attr('x', +rayon-5)
						.attr('y', -rayon-15)
						.attr('width', 20)
						.attr('height', 20)
						.style("cursor", "pointer")
						.style("visibility", "hidden")
						.attr("xlink:href","img/edit_64.png")
						.on("click", null)
						.append("title").text("Click to edit label")

			/* Option de changement de type */
			node_enter_g.append("circle")
				.attr("cx", +rayon+5)
				.attr("cy", +rayon+5)
				.attr("r", 0)
			    .attr("class", "circle_change_type")

			node_enter_g.append("svg:image")
			    		.attr("class", "image_change_type")
						.attr('x', +rayon-5)
						.attr('y', +rayon-5)
						.attr('width', 20)
						.attr('height', 20)
						.style("cursor", "pointer")
						.style("visibility", "hidden")
						.attr("xlink:href",function(d){
							switch (d.type)
							{
								case "project" :
									return "img/project.png";
									break;
								case "actor" :
									return "img/actor.png";
									break;
								case "idea" :
									return "img/idea.png";
									break;
								case "ressource" :
									return "img/ressource.png";
									break;
								case "without" :
									return "img/without.png";
									break;
							}

						})
						.on("click", null)
						.append("title").text("Click to change the type")

			/* cercle en tourant le type du noeud*/
			node_enter_g.append("circle")
				.attr("cx", 0)
				.attr("cy", +rayon-10)
				.attr("r", 11)
			    .attr("class", "circle_type")

			/* Image du type du noeud */
			node_enter_g.append("svg:image")
			    		.attr("class", "image_type")
						.attr('x', -8)
						.attr('y', +rayon-15)
						.attr('width', 15)
						.attr('height', 15)
						.attr("xlink:href",function(d){
							switch (d.type)
							{
								case "project" :
									return "img/project.png";
									break;
								case "actor" :
									return "img/actor.png";
									break;
								case "idea" :
									return "img/idea.png";
									break;
								case "ressource" :
									return "img/ressource.png";
									break;
								case "without" :
									return "img/without.png";
									break;
							}

						})
						.style("cursor", "pointer")

			// text sur le noeud principal
			node_enter_g.append("text")
				.attr("text-anchor", "middle")
				.attr("dy", ".25em")
				.style("font-size", "20px")
				.style("pointer-events", "none")
				.style("pointer-events", "none")
				.style("font-family", FontFamily)
				.text(function(d, i) { return d.label; })
				.style("font-size", function(d) { return getTextSize(this, d.rayon) })
				.attr("class", "label")
				.style("fill", "#333");
		}
    	else
    		message (message_offline,"warning");

		node.select(".node_circle").on("mousedown",
	        function(d) {
	          // disable zoom
	          svg.call(d3.behavior.zoom().on("zoom"), null);

	          mousedown_node = d;
	          if (mousedown_node == selected_node) selected_node = null;
	          else selected_node = mousedown_node;
	          selected_link = null;

	          // reposition drag line
	          drag_line
	              .attr("class", "link")
	              .attr("x1", mousedown_node.x)
	              .attr("y1", mousedown_node.y)
	              .attr("x2", mousedown_node.x)
	              .attr("y2", mousedown_node.y);

	          redraw();
	        })
	      .on("mousedrag",
	        function(d) {
	          // redraw();
	        })
	      .on("mouseup",
	        function(d) {
	    	  //lorsqu'on lache la souris au dessus d'un noeud
	          if (mousedown_node) {
	            mouseup_node = d;

	            //Si on lache la souris au dessus du noeud sur lequel on vient de clicker
	            //On le sélectionne et on réinitialise les variables de gestion d'evenements de souris
	            if (mouseup_node == mousedown_node)
	            {
	            	//On met toutes les partie du noeud intérieur en surbrillance
	        		node.select(".node_circle").classed("node_selected", function(d)
	        				{
	        					return d === selected_node;
	        				})
	        		node.select(".circle_id").classed("circle_id_selected", function(d)
	        				{
	        					return d === selected_node;
	        				})
	        		node.select(".text_id").classed("text_id_selected", function(d)
	        				{
	        					return d === selected_node;
	        				})
	        		node.select(".circle_type").classed("circle_type_selected", function(d)
	        				{
	        					return d === selected_node;
	        				})

	            	resetMouseVars();
	            	return;
	            }

	            // Sinon, on créer un lien entre le noeud source et celui sur lequel on est
	            var link = {source: mousedown_node, target: mouseup_node};
	            links.push(link);

	            // select new link
	            selected_link = link;
	            selected_node = null;

	            //Ajoute le lien dans le triplestore via la fonction "fluidlog" Addlink
	            if (online)
	            	sparql_add_link(mousedown_node.iri_id, mouseup_node.iri_id);

	            // enable zoom
	            svg.call(d3.behavior.zoom().on("zoom"), rescale);
	            redraw();
	          }
	        })

		  node.exit().transition()
		      .attr("r", 0)
		    .remove();

		  if (d3.event)
		  {
		    // prevent browser's default behavior
		    d3.event.preventDefault();
		  }

		node_enter_g.on("mouseover",function(d)
		{
						d3.select(this).select('.node_circle')
										.style("opacity", fade(.2,"#DDD"))

						d3.select(this).select('.circle_options')
										.transition()
										.duration(300)
										.attr("r", rayon + 20)

						d3.select(this).select('.circle_option_drag')
										.transition()
										.duration(300)
										.attr("r", 15)

						d3.select(this).select('.image_option_drag')
										.transition()
										.duration(300)
										.style("visibility", "visible")

						d3.select(this).select('.image_edit')
										.transition()
										.duration(300)
										.style("visibility", "visible")

						d3.select(this).select('.circle_edit')
										.transition()
										.duration(300)
										.attr("r", 15)

						d3.select(this).select('.image_change_type')
										.transition()
										.duration(300)
										.style("visibility", "visible")

						d3.select(this).select('.circle_change_type')
										.transition()
										.duration(300)
										.attr("r", 15)
		});

		node_enter_g.on("mouseout", function(d)
		{
						d3.select(this).select('.node_circle')
										.style("opacity", fade(1,"#DDD"))

						d3.select(this).select('.circle_options')
										.transition()
										.duration(300)
										.attr("r", 0)

						d3.select(this).select('.circle_option_drag')
										.transition()
										.duration(300)
										.attr("r", 0)

						d3.select(this).select('.image_option_drag')
										.transition()
										.duration(300)
										.style("visibility", "hidden")

						d3.select(this).select('.image_edit')
										.transition()
										.duration(300)
										.style("visibility", "hidden")

						d3.select(this).select('.circle_edit')
										.transition()
										.duration(300)
										.attr("r", 0)

						d3.select(this).select('.image_change_type')
										.transition()
										.duration(300)
										.style("visibility", "hidden")

						d3.select(this).select('.circle_change_type')
										.transition()
										.duration(300)
										.attr("r", 0)
		});

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
	    	node.select(".node_circle")
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
						.select(".node_circle").style("stroke", "#999");
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
