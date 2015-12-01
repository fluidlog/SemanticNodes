	var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
	var color_type_rgba = {"project" : "137,165,229", "actor" : "242,133,185", "idea" : "255,217,141", "ressource" : "205,249,137", "without" : "white"};
	var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;";
	var rayon = 30;
	var n = 100;
	var message_offline = "Connectez-vous à internet pour pouvoir continuer";
	var debug = true;

	//mouse event vars
	var selected_node = null,
	    mousedown_node = null,
	    mouseup_node = null;

	var width_closed_flud = 80,
		height_closed_flud = 80,
		width_opened_flud = 200,
		height_opened_flud = 200,
		arrondi = 50,
		width_stroke_node = 10,
		width_stroke_node_hover = 20,
		flud_transition_easing = "elastic" //default : linear, elastic
		flud_transition_duration = 1000;
		flud_transition_delay = 0,
		
		position_x_drag_option_image_closed_flud = -15,
		position_y_drag_option_image_closed_flud = -15;

	//local ou distant ?
	var online = navigator.onLine;

	dataset = {
			nodes:[
			       {iri_id:0, label: "Project", type:"project" },
		           {iri_id:1, label: "Actor tralala", type:"actor" },
			      ],
			edges:[
			       {source:0, target:1},
			      ],
			};

	/* =========================================
	 *  
	 *  Zone de test Flud
	 *  
	 *  ======================================== */

	var width_closed_flud = 80,
		height_closed_flud = 80,
		width_opened_flud = 250,
		height_opened_flud = 250,
		arrondi = 50;	
	/* =========================================
	 *  
	 *  Création du SVG et du rectangle de fond (dans un groupe)
	 *  
	 *  ======================================== */

	var svg = d3.select("#chart")
				  	.append("svg")
				    .attr("width", 810)
				    .attr("height", 410)

	var g_zoom_pan = svg
				.append('g')
			  	.attr('id','g_zoom_pan')
			    .call(d3.behavior.zoom().on("zoom", rescale))
			    .on("dblclick.zoom", rescale)

//	var g_bg_flud = g_zoom_pan
				.append('g')
			  	.attr('id','g_bg_flud')
//			    .on("mousemove", mousemove)
//			    .on("mousedown", mousedown)
//			    .on("mouseup", mouseup)
	
	var bg = g_zoom_pan
				  	.append("rect")
					.attr('id','bg')
				    .attr("width", 800)
				    .attr("height", 400)
				    
// init force layout
	var force = d3.layout.force()
	    .size([400, 200])
	    .nodes(dataset.nodes)
	    .links(dataset.edges)
	    .linkDistance(100)
	    .charge(-2000)

	force.start();
	for (var i = n * n; i > 0; --i) force.tick();
	force.stop();

	var nodes = force.nodes()

	var node = g_zoom_pan.selectAll("#g_closed_flud")
				.data(nodes);

	/* =========================================
	 *  
	 *  Création du flud fermé (dans un groupe)
	 *  
	 *  ======================================== */

	var node_drag = d3.behavior.drag()
						.on("dragstart", dragstart)
						.on("drag", dragmove)
						.on("dragend", dragend);

	redraw();
	
	// redraw force layout
	function redraw()
	{
		var node_enter_g = node
							.enter()
							.append('g')
							.attr("id", "g_closed_flud")
							.attr("class", " node")
							.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
							.call(node_drag)
	
		var flud = node_enter_g
					.append("rect")
					.attr("id", "flud")
					.attr("fill", "#eee")
				    .style("stroke", "#aaa")
				    .style("stroke-width", 2)
					.attr("rx", arrondi)
					.attr("ry", arrondi)
					.attr("width", width_closed_flud)
					.attr("height", height_closed_flud)
	
			// text on node
			var fo_text_node = node_enter_g
							.append("foreignObject")
							.attr("id","fo_closed_flud")
							.attr("x",-width_closed_flud/2)
							.attr("y",0)
						    .attr("width", width_closed_flud*2)
						    .attr("height", height_closed_flud)
	
			//fo xhtml
			var fo_xhtml_text_node = fo_text_node
				.append('xhtml:div')
			    .attr("class", "fo_xhtml_closed")
		
			//paragraph
			var p_text_node = fo_xhtml_text_node
				.append("p")
				.attr("class", "fo_text_node")
				.attr("style", function(d){
						var style_p =	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
										+ "border: 2px solid rgba("+color_type_rgba[d.type]+",.5);";
						return style_p
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
			var fo_drag_option_image = node_enter_g
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
			 * action zones
			 * 
			 * */
	
			/* Drag Zone */
			var fo_drag_option_zone = node_enter_g
						.append("foreignObject")
			    		.attr("id", "fo_drag_option_zone")
						.attr('x', -width_closed_flud/2)
						.attr('y', -height_closed_flud/2)
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
						.append("title").text("Drag & drop")

	      if (d3.event)
		  {
		    // prevent browser's default behavior
		    d3.event.preventDefault();
		  }
	}
	
	// rescale g
	function rescale() {
	  trans=d3.event.translate;
	  scale=d3.event.scale;

	  g_zoom_pan.attr("transform",
	      "translate(" + trans + ")"
	      + " scale(" + scale + ")");
	}

	function mousedown()
	{
	  if (!mousedown_node) 
	  {
	    // allow panning if nothing is selected
		g_zoom_pan.call(d3.behavior.zoom().on("zoom"), rescale);
	    return;
	  }
	}

	function mousemove()
	{
	  if (!mousedown_node) return;
	}

	function mouseup()
	{
	  if (mousedown_node)
	  {
	    redraw();
	  }
	  // clear mouse event vars
	  resetMouseVars();
	}

	function resetMouseVars()
	{
	  mousedown_node = null;
	  mouseup_node = null;
	}

	function dragstart(d, i) {
		d3.event.sourceEvent.stopPropagation();
		force.stop();
		//Make the node on the top by changing the order of the svg sequence
		this.parentNode.appendChild(this);
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

	function f_ondragover(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		if (p_el.attr("id") == "g_closed_flud")
		{
			p_el.select('#flud')
							.attr("rx", arrondi-30)
							.attr("ry", arrondi-30)
			
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

			p_el.select('#fo_i_drag_option_image').remove();
		}
		
		p_el.select('#fo_div_drag_option_zone')
				.attr("style", "padding:40px; text-align:right;")
	}

	function tick()
	{
		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}


