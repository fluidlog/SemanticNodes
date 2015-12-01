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
	arrondi = 50,
	width_stroke_node = 10,
	width_stroke_node_hover = 20;

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
			
		DisplayContentClosedFlud()

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

function DisplayContentClosedFlud()
{
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
				.style("stroke-width", width_stroke_node)
				.style("stroke-opacity", .5)
				.style("cursor", "pointer")
				.attr("x", -width_closed_flud/2)
				.attr("y", -height_closed_flud/2)
				.attr("width", width_closed_flud)
				.attr("height", height_closed_flud)

		/* iri_id circle */
		node_enter_g.append("circle")
			.attr("cx", 0)
			.attr("cy", -33)
			.attr("r", 8)
			.attr("fill", function(d){return color_type[d.type];})
		    .attr("id", "circle_id")
		    .attr("class", "circle_id")

		/* Text of iri_id */
		node_enter_g.append("text")
			.attr("dx", -1)
			.attr("dy", -29)
		    .attr("id", "text_id")
		    .attr("class", "text_id")
			.attr("fill", "#EEE")
			.attr("font-weight", "bold")
			.text(function(d) {
				  return d.iri_id;
			  })

		/* type circle*/
		node_enter_g.append("circle")
			.attr("cx", 0)
			.attr("cy", 30)
			.attr("r", 13)
		    .attr("id", "circle_type")
		    .attr("class", "circle_type")

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

		// text on node
		var fo_text_node = node_enter_g
						.append("foreignObject")
						.attr("id","fo_closed_flud")
						.attr("x",-width_closed_flud)
						.attr("y",-height_closed_flud/2)
					    .attr("width", width_closed_flud*2)
					    .attr("height", height_closed_flud)

		//fo xhtml
		var fo_xhtml_text_node = fo_text_node
			.append('xhtml:div')
		    .attr("class", "fo_xhtml")
	
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
		var fo_drag_option_image = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_drag_option_image")
					.attr('x', -45)
					.attr('y', -45)
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
		var fo_edit_option_image = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_edit_option_image")
					.attr('x', 25)
					.attr('y', -43)
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
		var fo_type_option_image = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_type_option_image")
					.attr('x', 25)
					.attr('y', 25)
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
		var fo_select_option_image = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_select_option_image")
					.attr('x', -43)
					.attr('y', 22)
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
		var fo_drag_option_zone = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_drag_option_zone")
					.attr('x', -width_closed_flud)
					.attr('y', -height_closed_flud)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)
			    
		//xhtml div zone (with 40px of paddinf for Chrome to create a hovered surface
		var fo_xhtml_drag_option_zone = fo_drag_option_zone
					.append('xhtml:div')
				    .attr("style", "padding:40px; text-align:right")

		//action on drag zone
		var action_on_drag_option_zone = fo_drag_option_zone
					.style("cursor", "move")
					.on("mouseover",f_ondragover)
					.on("mouseout",f_ondragout)
					.call(node_drag)
					.append("title").text("Drag & drop")

		/* Edit zone */
		var fo_edit_option_zone = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_edit_option_zone")
					.attr('x', 0)
					.attr('y', -height_closed_flud)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)
				    
		//xhtml div zone (with 40px of paddinf for Chrome to create a hovered surface
		var fo_xhtml_edit_option_zone = fo_edit_option_zone
					.append('xhtml:div')
				    .attr("style", "padding:40px; text-align:right")

		//action on edit zone
		var action_on_edit_option_zone = fo_edit_option_zone
					.on("mouseover",f_oneditover)
					.on("mouseout",f_oneditout)
					.style("cursor", "pointer")
					.on("click", make_editable)
					.append("title").text("Click to edit label")

		/* Type zone */
		var fo_type_option_zone = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_type_option_zone")
					.attr('x', 0)
					.attr('y', 0)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)

		//xhtml div zone (with 40px of paddinf for Chrome to create a hovered surface
		var fo_xhtml_type_option_zone = fo_type_option_zone
					.append('xhtml:div')
				    .attr("style", "padding:40px; text-align:right")

		//action on type zone
		var action_on_type_option_zone = fo_type_option_zone
					.on("mouseover",f_ontypeover)
					.on("mouseout",f_ontypeout)
					.style("cursor", "pointer")
					.on("click", click_image_type)
					.append("title").text("Click to change the type")

		/* Select Zone */
		var fo_select_option_zone = node_enter_g
					.append("foreignObject")
		    		.attr("id", "fo_select_option_zone")
					.attr('x', -width_closed_flud)
					.attr('y', 0)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud)			

		//xhtml div zone (with 40px of paddinf for Chrome to create a hovered surface
		var fo_xhtml_select_option_zone = fo_select_option_zone
					.append('xhtml:div')
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
	        		node.select("#node_circle").classed("node_selected", function(d)
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
				.append("title").text("Click to select")
		}

	  function f_ondragover(d)
	  {
			var el = d3.select(this);
			var p_el = d3.select(this.parentNode);

			p_el.select('#node_circle')
									.attr("rx", arrondi-30)
									.attr("ry", arrondi-30)
									.style("stroke-width", width_stroke_node_hover)
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
									.style("stroke-width", width_stroke_node)
									.style("opacity", fade(1,"#DDD"))

			p_el.select('#fo_i_drag_option_image').remove();
	}

	function f_oneditover(d)
	{
			var el = d3.select(this);
			var p_el = d3.select(this.parentNode);

			p_el.select('#node_circle')
									.attr("rx", arrondi-30)
									.attr("ry", arrondi-30)
									.style("stroke-width", width_stroke_node_hover)
									.style("opacity", fade(.2,"#DDD"))
				
			p_el.select('#fo_div_edit_option_image')
									.append('i')
								    .attr("id", "fo_i_edit_option_image")
								    .attr("class", "ui large edit icon")
									.attr("style", "display:inline")
	}

	function f_oneditout(d)
	{
			var el = d3.select(this);
			var p_el = d3.select(this.parentNode);

			p_el.select('#node_circle')
									.attr("rx", arrondi+30)
									.attr("ry", arrondi+30)
									.style("stroke-width", width_stroke_node)
									.style("opacity", fade(1,"#DDD"))

			p_el.select('#fo_i_edit_option_image').remove();
	}

	function f_ontypeover(d)
	{
		var el = d3.select(this);
			var p_el = d3.select(this.parentNode);

			p_el.select('#node_circle')
									.attr("rx", arrondi-30)
									.attr("ry", arrondi-30)
									.style("stroke-width", width_stroke_node_hover)
									.style("opacity", fade(.2,"#DDD"))
				
			p_el.select('#fo_div_type_option_image')
									.append('i')
								    .attr("id", "fo_i_type_option_image")
								    .attr("class", "ui large flag icon")
									.attr("style", "display:inline")
	}

	function f_ontypeout(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		p_el.select('#node_circle')
								.attr("rx", arrondi+30)
								.attr("ry", arrondi+30)
								.style("stroke-width", width_stroke_node)
								.style("opacity", fade(1,"#DDD"))

		p_el.select('#fo_i_type_option_image').remove();
	}

	function f_onselectover(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		p_el.select('#node_circle')
								.attr("rx", arrondi-30)
								.attr("ry", arrondi-30)
								.style("stroke-width", width_stroke_node_hover)
								.style("opacity", fade(.2,"#DDD"))
								
		p_el.select('#fo_div_select_option_image')
								.append('i')
							    .attr("id", "fo_i_select_option_image")
							    .attr("class", "ui large selected radio icon")
								.attr("style", "display:inline")
	}

	function f_onselectout(d)
	{
			var el = d3.select(this);
			var p_el = d3.select(this.parentNode);

			p_el.select('#node_circle')
									.attr("rx", arrondi+30)
									.attr("ry", arrondi+30)
									.style("stroke-width", width_stroke_node)
									.style("opacity", fade(1,"#DDD"))
			
			p_el.select('#fo_i_select_option_image').remove();
	}

	function make_editable(d)
	{
//        console.log(this, arguments);

        // Select element that call the make_editable function
        var el = d3.select(this);
        var p_el = d3.select(this.parentNode);

		var frm = p_el
			.append("foreignObject")
        	.attr("class", "edit");

        var input = frm
            .attr("x", -100)
            .attr("y", -15)
            .attr("width", 200)
            .attr("height", 50)
            .append("xhtml:form")
                    .append("textarea")
                    .attr("class", "input")
                        .html(function() {
                        	this.focus();
                            return d.label;
                        })
                        .attr("style", 200)
                        .on("keypress", function() {
                            //console.log("keypress", this, arguments);

                            // IE fix
                            if (!d3.event)
                                d3.event = window.event;

                            var e = d3.event;
                            if (e.keyCode == 13)
                            {
                                if (typeof(e.cancelBubble) !== 'undefined') // IE
                                  e.cancelBubble = true;
                                if (e.stopPropagation)
                                  e.stopPropagation();
                                e.preventDefault();
                            }
                        });

        // Remove Edit icon & Edit zone
        p_el.select('#fo_i_edit_option_image').remove();
		p_el.select('#fo_edit_option_zone').remove();

		/* Replace by Save icon */
        p_el.select('#fo_div_edit_option_image')
					.append('i')
				    .attr("id", "fo_i_save_option_image")
				    .attr("class", "ui large save icon")
					.attr("style", "display:inline")

		/* And Save zone with action */
		var fo_save_option_zone = p_el
					.append("foreignObject")
		    		.attr("id", "fo_save_option_zone")
					.attr('x', 0)
					.attr('y', -height_closed_flud/2)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud/2)
				    
		//action on edit zone
		var action_on_save_option_zone = fo_save_option_zone
					.style("cursor", "pointer")
					.on("click", change_label)
					//Pas besoin de hover ici...
					.append("title").text("Click to save label")
	}

	function change_label(d)
	{
	    //console.log("save_label", arguments);

        // Select element that call the save_label function
        var el = d3.select(this);
        var p_el = d3.select(this.parentNode);
        var fo_el = p_el.select(".edit");
        var txt_el = p_el.select(".label");
        var input_el = fo_el.select(".input");

        var txt = input_el.node().value;
        if (txt == "")
        	txt = "New...";

        d.label = txt;
        //Met à jour le champ text dans le noeud
        txt_el.text(d.label);

        //Enregistrement du nouveau label dans le TS
//        sparql_change_label(d.iri_id, d.label)

        // Note to self: frm.remove() will remove the entire <g> group! Remember the D3 selection logic!
        fo_el.remove();

        // Remove Save icon & Save zone
        p_el.select('#fo_i_save_option_image').remove();
		p_el.select('#fo_save_option_zone').remove();

//		/* Replace by Edit icon */
//		No need here cause the hover will add the image (and it could have two images...)		
//       p_el.select('#fo_div_edit_option_image')
//					.append('i')
//				    .attr("id", "fo_i_edit_option_image")
//				    .attr("class", "ui large edit icon")
//					.attr("style", "display:inline")

		/* And Edit zone with actions */
		var fo_edit_option_zone = p_el
					.append("foreignObject")
		    		.attr("id", "fo_edit_option_zone")
					.attr('x', 0)
					.attr('y', -height_closed_flud/2)
					.attr('width', width_closed_flud)
					.attr('height', height_closed_flud/2)
				    
		//action on edit zone
		var action_on_edit_option_zone = fo_edit_option_zone
					.style("cursor", "pointer")
					.on("click", make_editable)
				  .on("mouseover",f_oneditover)
				  .on("mouseout",f_oneditout)
					.append("title").text("Click to edit label")
	}

	function click_image_type(d, i)
	{
//		if (d3.event.defaultPrevented) return;
		//The selected object is the "fo_type_option_zone"
        var zone_el = d3.select(this);
        var g_el = d3.select(this.parentNode);
        var node_el = g_el.select("#node_circle");
        var type_el = g_el.select("#fo_type_image");
        var text_el = g_el.select("#fo_text_node");
        var circle_id_el = g_el.select("#circle_id");

        switch (d.type)
		{
			case "project" :
				//type_el : Change project icon by actor icon
				type_el.select('#fo_i_type_image').remove();
				type_el.select('#fo_div_type_image')
						.append('i')
					    .attr("id", "fo_i_type_image")
					    .attr("class", "ui large user icon")
						.attr("style", "display:inline")

				d.type = "actor";
				text_el.attr("style", function(d){
					return	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
							+ "border: 2px solid rgba("+color_type_rgba[d.type]+",.5);";
				})
				circle_id_el.style("fill", function(d) { return color_type[d.type] } );
				node_el.style("fill", function(d) { return color_type[d.type] } );
				//sparql_change_type(i, "project", "actor");
				break;
			case "actor" :
				//type_el : Change actor icon by idea icon
				type_el.select('#fo_i_type_image').remove();
				type_el.select('#fo_div_type_image')
						.append('i')
					    .attr("id", "fo_i_type_image")
					    .attr("class", "ui large idea icon")
						.attr("style", "display:inline")

				d.type = "idea";
				text_el.attr("style", function(d){
					return	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
							+ "border: 2px solid rgba("+color_type_rgba[d.type]+",.5);";
				})
				circle_id_el.style("fill", function(d) { return color_type[d.type] } );
				node_el.style("fill", function(d) { return color_type[d.type] } );
				//sparql_change_type(i, "actor", "idea");
				break;
			case "idea" :
				//type_el : Change idea icon by ressource icon
				type_el.select('#fo_i_type_image').remove();
				type_el.select('#fo_div_type_image')
						.append('i')
					    .attr("id", "fo_i_type_image")
					    .attr("class", "ui large tree icon")
						.attr("style", "display:inline")

				d.type = "ressource";
				text_el.attr("style", function(d){
					return	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
							+ "border: 2px solid rgba("+color_type_rgba[d.type]+",.5);";
				})
				circle_id_el.style("fill", function(d) { return color_type[d.type] } );
				node_el.style("fill", function(d) { return color_type[d.type] } );
				//sparql_change_type(i, "idea", "ressource");
				break;
			case "ressource" :
				//type_el : Change ressource icon by project icon
				type_el.select('#fo_i_type_image').remove();
				type_el.select('#fo_div_type_image')
						.append('i')
					    .attr("id", "fo_i_type_image")
					    .attr("class", "ui large lab icon")
						.attr("style", "display:inline")

				d.type = "project";
				text_el.attr("style", function(d){
					return	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
							+ "border: 2px solid rgba("+color_type_rgba[d.type]+",.5);";
				})
				circle_id_el.style("fill", function(d) { return color_type[d.type] } );
				node_el.style("fill", function(d) { return color_type[d.type] } );
				//sparql_change_type(i, "ressource", "project");
				break;
			case "without" :
				//type_el : Change without icon by project icon
				type_el.select('#fo_i_type_image').remove();
				type_el.select('#fo_div_type_image')
						.append('i')
					    .attr("id", "fo_i_type_image")
					    .attr("class", "ui large lab icon")
						.attr("style", "display:inline")

				d.type = "project";
				text_el.attr("style", function(d){
					return	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
							+ "border: 2px solid rgba("+color_type_rgba[d.type]+",.5);";
				})
				circle_id_el.style("fill", function(d) { return color_type[d.type] } );
				node_el.style("fill", function(d) { return color_type[d.type] } );
				//sparql_change_type(i, "without", "project");
				break;
		}
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
			node.select("#circle_id")
	    			.style("opacity", function(o)
					{
						return isConnected(d, o) ? 1 : opacity;
					})
			node.select("#text_id")
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
