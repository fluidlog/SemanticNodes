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

	var width_closed_flud = 80,
	height_closed_flud = 80,
	width_opened_flud = 200,
	height_opened_flud = 200,
	arrondi = 50,
	width_stroke_node = 10,
	width_stroke_node_hover = 20,
	flud_transition_easing = "elastic" //default : linear, elastic
	flud_transition_duration_open = 1000;
	flud_transition_duration_close = 500;
	flud_transition_delay = 0,

	position_x_drag_option_image_closed_flud = -45,
	position_y_drag_option_image_closed_flud = -45,
	position_x_drag_option_image_opened_flud = (-width_opened_flud/2)-10,
	position_y_drag_option_image_opened_flud = (-height_opened_flud/2)-10,

	position_x_edit_option_image_closed_flud = 25,
	position_y_edit_option_image_closed_flud = -43,

	position_x_type_option_image_closed_flud = 25,
	position_y_type_option_image_closed_flud = 25,
	position_x_type_option_image_opened_flud = (width_opened_flud/2)-10,
	position_y_type_option_image_opened_flud = (height_opened_flud/2)-10,

	position_x_select_option_image_closed_flud = -43,
	position_y_select_option_image_closed_flud = 22,

	position_x_close_option_image_opened_flud = -15+width_opened_flud/2,
	position_y_close_option_image_opened_flud = -7-height_opened_flud/2

	//local ou distant ?
	var panTimer;
	var translateX = null;
	var translateY = null;
	var panBgSpeed = 10;

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

	var rect_bg = svg.append('rect')
			.attr('class', "rect_bg")
	    .attr('x', 10)
	    .attr('y', 10)
	    .attr('width', width)
	    .attr('height', height)

	var rect_left = svg.append('rect')
			.attr('class', "rect_pan")
			.attr('x', 100)
			.attr('y', 100)
			.attr('width', 200)
			.attr('height', 200)
			.attr('fill', "green")
			.on("mouseover", function(d){
				panTimer = true;
				bgPan(svg, "left");
      })
			.on("mouseout",function(d){
				clearTimeout(panTimer);
      })


	var node_drag = d3.behavior.drag()
					.on("dragstart", dragstart)
					.on("drag", dragmove)
					.on("dragend", dragend);

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

	redraw();

	//pan g
	function bgPan (objetSvg, direction){

	  var translateCoords, getTransform;

	  if (panTimer) {
	    clearTimeout(panTimer);

	    getTransform = objetSvg.attr("transform");
	    translateCoords = d3.transform(getTransform);
	    if (direction == 'left')
	    {
	      translateX = translateCoords.translate[0] + panBgSpeed;
	      translateY = translateCoords.translate[1];
	    }
	    else if  (direction == 'right')
	    {
	      translateX = translateCoords.translate[0] - panBgSpeed;
	      translateY = translateCoords.translate[1];
	    }
	    else if  (direction == 'up')
	    {
	      translateX = translateCoords.translate[0];
	      translateY = translateCoords.translate[1] + panBgSpeed;
	    }
	    else if (direction == 'down')
	    {
	      translateX = translateCoords.translate[0];
	      translateY = translateCoords.translate[1] - panBgSpeed;
	    }

			svg.attr("transform","translate(" + translateX + "," + translateY + ")");

	    panTimer = setTimeout(function() {
	      bgPan(objetSvg, direction);
	    }, 1000);
	  }

	}

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
							.attr("id","g_closed_flud")
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
							.attr("id", "flud")
							.attr("class", "node_circle")
							.style("fill", function(d) { return color_type[d.type] } )
							.attr("rx", arrondi)
							.attr("ry", arrondi)
							.style("stroke-width", width_stroke_node)
							.style("stroke-opacity", .5)
							.style("cursor", "pointer")
							.attr("x", -width_closed_flud/2)
							.attr("y", -height_closed_flud/2)
							.attr("width", width_closed_flud)
							.attr("height", height_closed_flud)

		/* iri_id circle */
		node_enter_g
			.append("circle")
		    .attr("id", "circle_id")
		    .attr("class", "circle_id")
			.attr("cx", 0)
			.attr("cy", -33)
			.attr("r", 8)
			.attr("fill", function(d){return color_type[d.type];})

		/* Text of iri_id */
		node_enter_g
			.append("text")
		    .attr("id", "text_id")
			.attr("dx", -1)
			.attr("dy", -29)
		    .attr("class", "text_id")
			.attr("fill", "#EEE")
			.attr("font-weight", "bold")
			.text(function(d) {
				  return d.iri_id;
			  })

		/* type circle*/
		node_enter_g
			.append("circle")
		    .attr("id", "circle_type")
		    .attr("class", "circle_type")
			.attr("cx", 0)
			.attr("cy", 30)
			.attr("r", 13)

		/* Image of type */
		var fo_type_image = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_type_image")
					.attr('x', -11)
					.attr('y', 19)
					.attr('width', 25)
					.attr('height', 25)

		//xhtml div image
		var fo_xhtml_type_image = fo_type_image
					.append('xhtml:div')
				    .attr("id", "fo_div_type_image")
				    .attr("class", "fo_div_image")
					.append('i')
				    .attr("id", "fo_i_type_image")
				    .attr("class", function(d){
									return "ui large "+image_type[d.type]+" icon";
						})
					.attr("style", "display:inline")

		DisplayContentClosedFlud(node_enter_g)

		node
			.exit()
			.transition()
		    .attr("r", 0)
		    .remove();

		  if (d3.event)
		  {
		    // prevent browser's default behavior
		    d3.event.preventDefault();
		  }

		 //lancement du tick
		force.on("tick", tick);
		d3.select("#waiting").style("display", "none");

		//On supprime tous les noeuds "deleted"
		d3.selectAll(".deleted").remove();

	}

function DisplayContentClosedFlud(node_g)
{
		// text on node
		var fo_text_node = node_g
						.append("foreignObject")
						.attr("id","fo_closed_flud")
						.attr("x", -width_opened_flud/2)
						.attr("y", -height_opened_flud/2)
					    .attr("width", width_opened_flud)
					    .attr("height", height_opened_flud)

		//fo xhtml
		var fo_xhtml_text_node = fo_text_node
			.append('xhtml:div')
		    .attr("class", "fo_xhtml_closed")

		//paragraph
		var p_text_node = fo_xhtml_text_node
			.append("p")
			.attr("id", "fo_text_node")
			.attr("class", "fo_text_node")
			.attr("style", function(d){
				return	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
					+ "border: 1px solid rgba("+color_type_rgba[d.type]+",.5);";
			})
			.append("h4")
			.attr("class", "ui header")
			.text(function(d, i) { return d.label; })

		/*
		 *
		 * Drag option
		 *
		 * */

		/* Drag Image */
		var fo_drag_option_image = node_g
					.append("foreignObject")
		    		.attr("id", "fo_drag_option_image")
					.attr('x', position_x_drag_option_image_closed_flud)
					.attr('y', position_y_drag_option_image_closed_flud)
					.attr('width', 22)
					.attr('height', 22)

		//xhtml div image
		var fo_xhtml_drag_option_image = fo_drag_option_image
					.append('xhtml:div')
				    .attr("class", "fo_div_image")
				    .attr("id", "fo_div_drag_option_image")
				    //Image add when hover

		/*
		 *
		 * Edit option
		 *
		 * */

		/* Edit Image */
		var fo_edit_option_image = node_g
					.append("foreignObject")
		    		.attr("id", "fo_edit_option_image")
					.attr('x', position_x_edit_option_image_closed_flud)
					.attr('y', position_y_edit_option_image_closed_flud)
					.attr('width', 22)
					.attr('height', 22)

		//xhtml div image
		var fo_xhtml_edit_image = fo_edit_option_image
					.append('xhtml:div')
				    .attr("class", "fo_div_image")
				    .attr("id", "fo_div_edit_option_image")
				    //Image add when hover

		/*
		 *
		 * Type option
		 *
		 * */

		/* Change type Image */
		var fo_type_option_image = node_g
					.append("foreignObject")
		    		.attr("id", "fo_type_option_image")
					.attr('x', position_x_type_option_image_closed_flud)
					.attr('y', position_y_type_option_image_closed_flud)
					.attr('width', 22)
					.attr('height', 22)

		//xhtml div image
		var fo_xhtml_type_option_image = fo_type_option_image
					.append('xhtml:div')
				    .attr("class", "fo_div_image")
				    .attr("id", "fo_div_type_option_image")
				    //Image add when hover

		/*
		 *
		 * Select option
		 *
		 * */

		/* Change select Image */
		var fo_select_option_image = node_g
					.append("foreignObject")
		    		.attr("id", "fo_select_option_image")
					.attr('x', position_x_select_option_image_closed_flud)
					.attr('y', position_y_select_option_image_closed_flud)
					.attr('width', 22)
					.attr('height', 22)

		//xhtml div image
		var fo_xhtml_select_option_image = fo_select_option_image
					.append('xhtml:div')
				    .attr("class", "fo_div_image")
				    .attr("id", "fo_div_select_option_image")
				    //Image add when hover


		/*
		 *
		 * action zones
		 *
		 * */

		/* Drag Zone */
		var fo_drag_option_zone = node_g
					.append("foreignObject")
		    		.attr("id", "fo_drag_option_zone")
					.attr('x', -width_closed_flud)
					.attr('y', -height_closed_flud)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)

		//xhtml div zone (with 40px of paddinf for Chrome to create a hovered surface
		var fo_xhtml_drag_option_zone = fo_drag_option_zone
					.append('xhtml:div')
		    		.attr("id", "fo_div_drag_option_zone")
				    .attr("style", "padding:40px; text-align:right")

		//action on drag zone
		var action_on_drag_option_zone = fo_drag_option_zone
					.style("cursor", "move")
					.on("mouseover",f_ondragover)
					.on("mouseout",f_ondragout)
					.call(node_drag)
					.append("title").text("Drag & drop")

		/* Edit zone */
		var fo_edit_option_zone = node_g
					.append("foreignObject")
		    		.attr("id", "fo_edit_option_zone")
					.attr('x', 0)
					.attr('y', -height_closed_flud)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)

		//xhtml div zone (with 40px of paddinf for Chrome to create a hovered surface
		var fo_xhtml_edit_option_zone = fo_edit_option_zone
					.append('xhtml:div')
		    		.attr("id", "fo_div_edit_option_zone")
				    .attr("style", "padding:40px; text-align:right")

		//action on edit zone
		var action_on_edit_option_zone = fo_edit_option_zone
					.on("mouseover",f_oneditover)
					.on("mouseout",f_oneditout)
					.style("cursor", "pointer")
					// .on("click", OpenFlud)
					.append("title").text("Click to edit label")

		/* Type zone */
		var fo_type_option_zone = node_g
					.append("foreignObject")
		    		.attr("id", "fo_type_option_zone")
					.attr('x', 0)
					.attr('y', 0)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)

		//xhtml div zone (with 40px of paddinf for Chrome to create a hovered surface
		var fo_xhtml_type_option_zone = fo_type_option_zone
					.append('xhtml:div')
		    		.attr("id", "fo_div_type_option_zone")
				    .attr("style", "padding:40px; text-align:right")

		//action on type zone
		var action_on_type_option_zone = fo_type_option_zone
					.on("mouseover",f_ontypeover)
					.on("mouseout",f_ontypeout)
					.style("cursor", "pointer")
					// .on("click", click_image_type)
					.append("title").text("Click to change the type")

		/* Select Zone */
		var fo_select_option_zone = node_g
					.append("foreignObject")
		    		.attr("id", "fo_select_option_zone")
					.attr('x', -width_closed_flud)
					.attr('y', 0)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)

		//xhtml div zone (with 40px of paddinf for Chrome to create a hovered surface
		var fo_xhtml_select_option_zone = fo_select_option_zone
					.append('xhtml:div')
		    		.attr("id", "fo_div_select_option_zone")
				    .attr("style", "padding:40px; text-align:right")

		//action on select zone
		var action_on_select_option_zone = fo_select_option_zone
					.style("cursor", "pointer")
					.on("mouseover",f_onselectover)
					.on("mouseout",f_onselectout)

				.on("mousedown",
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
	        		node.select("#flud").classed("node_selected", function(d)
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
//	            	sparql_add_link(mousedown_node.iri_id, mouseup_node.iri_id);

	            // enable zoom
	            svg.call(d3.behavior.zoom().on("zoom"), rescale);
	            redraw();
	          }
	        })
			.append("title").text("Click to select")
		}

	function f_ondragover(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		if (p_el.attr("id") == "g_closed_flud")
		{
			p_el.select('#flud')
							.attr("rx", arrondi-30)
							.attr("ry", arrondi-30)
							.style("stroke-width", width_stroke_node_hover)
							// .style("opacity", fade(.2,"#DDD"))

			p_el.select('#fo_div_drag_option_image')
							.append('i')
						    .attr("id", "fo_i_drag_option_image")
						    .attr("class", "ui large move icon")
							.attr("style", "display:inline")
		}

		p_el.select('#fo_div_drag_option_zone')
								.attr("style", "padding:40px; text-align:right;"
											+"background-color:rgba(200,200,200,.1);")
	}

	function f_ondragout(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		if (p_el.attr("id") == "g_closed_flud")
		{
			p_el.select('#flud')
							.attr("rx", arrondi+30)
							.attr("ry", arrondi+30)
							.style("stroke-width", width_stroke_node)
							// .style("opacity", fade(1,"#DDD"))

			p_el.select('#fo_i_drag_option_image').remove();
		}

		p_el.select('#fo_div_drag_option_zone')
				.attr("style", "padding:40px; text-align:right;")
	}

	function f_oneditover(d)
	{
			var el = d3.select(this);
			var p_el = d3.select(this.parentNode);

			p_el.select('#flud')
									.attr("rx", arrondi-30)
									.attr("ry", arrondi-30)
									.style("stroke-width", width_stroke_node_hover)
									// .style("opacity", fade(.2,"#DDD"))

			p_el.select('#fo_div_edit_option_image')
									.append('i')
								    .attr("id", "fo_i_edit_option_image")
								    .attr("class", "ui large edit icon")
									.attr("style", "display:inline")

			p_el.select('#fo_div_edit_option_zone')
									.attr("style", "padding:40px; text-align:right;"
												+"background-color:rgba(200,200,200,.1);")
	}

	function f_oneditout(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		p_el.select('#flud')
								.attr("rx", arrondi+30)
								.attr("ry", arrondi+30)
								.style("stroke-width", width_stroke_node)
								// .style("opacity", fade(1,"#DDD"))

		p_el.select('#fo_i_edit_option_image').remove();

		p_el.select('#fo_div_edit_option_zone')
		.attr("style", "padding:40px; text-align:right;")
	}

	function f_ontypeover(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		if (p_el.attr("id") == "g_closed_flud")
		{
			p_el.select('#flud')
						.attr("rx", arrondi-30)
						.attr("ry", arrondi-30)
						.style("stroke-width", width_stroke_node_hover)
						// .style("opacity", fade(.2,"#DDD"))

			p_el.select('#fo_div_type_option_image')
						.append('i')
					    .attr("id", "fo_i_type_option_image")
					    .attr("class", "ui large flag icon")
						.attr("style", "display:inline")
		}

		p_el.select('#fo_div_type_option_zone')
								.attr("style", "padding:40px; text-align:right;"
											+"background-color:rgba(200,200,200,.1);")
	}

	function f_ontypeout(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		if (p_el.attr("id") == "g_closed_flud")
		{
			p_el.select('#flud')
						.attr("rx", arrondi+30)
						.attr("ry", arrondi+30)
						.style("stroke-width", width_stroke_node)
						// .style("opacity", fade(1,"#DDD"))

			p_el.select('#fo_i_type_option_image').remove();
		}

		p_el.select('#fo_div_type_option_zone')
		.attr("style", "padding:40px; text-align:right;")
	}

	function f_onselectover(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		p_el.select('#flud')
								.attr("rx", arrondi-30)
								.attr("ry", arrondi-30)
								.style("stroke-width", width_stroke_node_hover)
								// .style("opacity", fade(.2,"#DDD"))

		p_el.select('#fo_div_select_option_image')
								.append('i')
							    .attr("id", "fo_i_select_option_image")
							    .attr("class", "ui large selected radio icon")
								.attr("style", "display:inline")

		p_el.select('#fo_div_select_option_zone')
								.attr("style", "padding:40px; text-align:right;"
											+"background-color:rgba(200,200,200,.1);")
	}

	function f_onselectout(d)
	{
			var el = d3.select(this);
			var p_el = d3.select(this.parentNode);

			p_el.select('#flud')
									.attr("rx", arrondi+30)
									.attr("ry", arrondi+30)
									.style("stroke-width", width_stroke_node)
									// .style("opacity", fade(1,"#DDD"))

			p_el.select('#fo_i_select_option_image').remove();

			p_el.select('#fo_div_select_option_zone')
			.attr("style", "padding:40px; text-align:right;")
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
						.select("#flud").style("stroke", "#999");
		tick();
		force.resume();
	}
