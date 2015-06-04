	/* =========================================
	 *  
	 *  Variables Initialisation
	 *  
	 *  ======================================== */
 
	var default_domain = "loglink11";
	var dataset;

	var new_domain = true;
	
	//mouse event vars
	var selected_node = null,
	    selected_link = null,
	    mousedown_link = null,
	    mousedown_node = null,
	    mouseup_node = null;

	var width = window.innerWidth - 10,
	    height = window.innerHeight - 50;

	var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
	var color_type_rgba = {"project" : "137,165,229", "actor" : "242,133,185", "idea" : "255,217,141", "ressource" : "205,249,137", "without" : "white"};
	var image_type = {"project" : "lab", "actor" : "user", "idea" : "idea", "ressource" : "tree", "without" : "circle thin"};
	var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;";
	var rayon = width_closed_flud/2;
	var n = 100;
	var message_offline = "Connectez-vous à internet pour pouvoir continuer";
	var debug = false;

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
	position_x_drag_option_image_opened_flud = (-width_opened_flud/2)-20,
	position_y_drag_option_image_opened_flud = (-height_opened_flud/2)-20,

	position_x_edit_option_image_closed_flud = 25,
	position_y_edit_option_image_closed_flud = -43,

	position_x_type_option_image_closed_flud = 25,
	position_y_type_option_image_closed_flud = 25,
	position_x_type_option_image_opened_flud = (width_opened_flud/2),
	position_y_type_option_image_opened_flud = (height_opened_flud/2),
	
	position_x_select_option_image_closed_flud = -43,
	position_y_select_option_image_closed_flud = 22,

	position_x_close_option_image_opened_flud = -15+width_opened_flud/2,
	position_y_close_option_image_opened_flud = -7-height_opened_flud/2

	position_x_save_option_image_opened_flud = (width_opened_flud/2),
	position_y_save_option_image_opened_flud = (-height_opened_flud/2)-20

	//local ou distant ?
	var online = navigator.onLine;

	//Contenu du moteur de recherche (reflet du dataset)
	var contentSearch = [];

	/* =========================================
	 *  
	 *  Actions on menus and slidebar
	 *  
	 *  ======================================== */
	
	$('#home')
			.popup({
			    inline   : true,
			    hoverable: true,
			    position : 'bottom left',
			    delay: {
			      show: 300,
			      hide: 500
			    }
			});

	$('#initializeGraph')
			.click(function()
			{
				$('#initializeGraphModal')
				  .modal({
						    onApprove : function()
									{
										if (online)
										{
											sparql_delete_all_into_triplestore();
											init_graph(default_domain);
										}
										location.reload()
									}
				  		  })
				  .modal('show');
			})
			.popup({
			    inline   : true,
			    hoverable: true,
			    position : 'bottom left',
			    delay: {
			      show: 300,
			      hide: 500
			    }
			});
			

	$('#refreshGraph')
			.click(function()
			{
				location.reload()
			})
			.popup({
			    inline   : true,
			    hoverable: true,
			    position : 'bottom left',
			    delay: {
			      show: 300,
			      hide: 500
			    }
			});
	
	$('#filterButtonMenu').dropdown()

	$('#sidebarButton').click(function(){
			$('.right.sidebar').sidebar('toggle');
	});

	$('#sidebarMenuHelpItem').click(function () {
		$('#helpModal')
		  .modal('show');
	});

	$('#debugSettingsCheckbox').checkbox({
		onChecked : function()
		{
				$("#debugPanel").show();
		}
	});

	$('#messageSettingsCheckbox').checkbox({
		onChecked : function()
		{
				$("#messagePanel").show();
		}
	});

	$('#sidebarMenuSettingsItem').click(function () {
		$('#settingsModal')
		  .modal('show');
	});
	
	$('#debug').hover(
	 		function(){$('.debug').css({'z-index' : 1,'zoom' : 1.7});},
	 		function(){$('.debug').css({'zoom' : 1});}
	 	);

	$('#sidebarMenuDownloadItem').click(function () {
		$('#downloadModal')
		  .modal({
				    onApprove : function()
							{
								var exportGraph = sparql_export_from_triplestore();
								var blob = new Blob([exportGraph], {type: "text/plain;charset=utf-8"});
								var d = new Date();
								var date_now = d.getDate()+"-"+d.getMonth()+1+"-"+d.getFullYear()+"-"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
								saveAs(blob, "svg-"+date_now+".ttl");
							}
		  		  })
		  .modal('show');
	});
	
	$("#sidebarMenuUploadItem").click(function () {
		$('#uploadModal')
		  .modal({
				    onApprove : function()
							{
							    var input = $('#uploadInput');
				    			//Retrieve the first (and only!) File from the FileList object
							    var f = input[0].files[0]; 
		
							    if (f) {
							      var r = new FileReader();
							      r.onload = function(e) 
							      { 
								      var contents = e.target.result;
								      sparql_import_into_triplestore(contents);
//								      alert( "Import réussi ! ;-)");  
								      location.reload()
							      }
							      r.readAsText(f);
							    } else { 
							      alert("Failed to load file");
							    }
							}
		  		  })
		  .modal('show');
	});


	function init_graph(default_domain)
	{
		var domain_created;

		domain_created = sparql_add_domain_to_triplestore(default_domain);
		if (!domain_created)
		{
			message("erreur de création du domaine","alert");
			return false;
		}

		//On initialise le compteur de noeud à 0 pour ce domaine
		sparql_increment_node_id(-1);
		var first_node_iri = sparql_get_new_node_iri();
		//Le compteur de noeud doit être à 1
		sparql_init_kernel_graph(first_node_iri, null);
	}

	/* =========================================
	 *  
	 *  Chargement du dataset et du content pour le moteur de recherche
	 *  
	 *  ======================================== */

	if (online)
	{
		if (debug)
			dataset = debug_get_dataset("4");
		else
		{
			dataset = sparql_get_dataset();
			contentSearch = loadSearchContent();
		}
	}
	else
	{
		dataset = debug_get_dataset("1");
		message (message_offline,"warning");
	}

	function loadSearchContent (force)
	{
		if (force)
			dataset = sparql_get_dataset();

		//Associe le label et le type des champs "nodes" au contenu du moteur de recherche
		for (i=0; i<dataset.nodes.length; i++) 
		{
			contentSearch[i] = {"title" : dataset.nodes[i].label, "description" : dataset.nodes[i].type, "id" : dataset.nodes[i].iri_id}
		}
		return contentSearch;
	}
	

//	$('#inputSearch').focus(function(){
//		//On recharge le contenu avant de rechercher (trouver une autre méthodes plus tard...)
//		contentSearch = loadSearchContent(true);
//	})
	
	$('#search').search({
 	   type : "standard",
 	   source : contentSearch,
	   searchFields : ['title'],
 	   onSelect: function(result, response) {
 		  highlight_result(result);
 		  console.log("ui onSelect : "+result.title)
 	   },
 	   onResults: function(response) {
 		  highlight_response(response.results);
		    console.log("ui onResults : "+response.results)
 	   },
 	   minCharacters: 1,
 	   debug : false,
 	   cache: false,
 	});        

	function highlight_result (result)
	{
		d3.selectAll(".circle_highlight2").remove();
		d3.selectAll(".node").each( function(d, i)
				{
			  		if(d.iri_id == result.id)
			  		{
			  			d3.select(this).insert("circle", ".circle_options")
			  					.attr("class", "circle_highlight2")
			  					.attr("r", rayon+10);
			  		}
				})
	}

	function highlight_response (response)
	{
		var searched_id = [];
		for (i=0; i<response.length; i++)
			searched_id[i] = response[i].id;
		
		d3.selectAll(".circle_highlight1").remove();
		for (inc=0; inc<searched_id.length; inc++)
		{
			d3.selectAll(".node").each( function(d, i)
					{
				  		if(d.iri_id == searched_id[inc])
				  		{
				  			d3.select(this).insert("circle", ".circle_options")
				  					.attr("class", "circle_highlight1")
				  					.attr("r", rayon+10);
				  		}
					})
		}
	}
	
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
			.attr("r", 10)
			.attr("fill", function(d){return color_type[d.type];})

		/* Text of iri_id */
		node_enter_g
			.append("text")
		    .attr("id", "text_id")
			.attr("dx", 0)
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

		// content closed flud
		var fo_content_closed_flud = node_enter_g
						.append("foreignObject")
						.attr("id","fo_content_closed_flud")
						.attr("x", -width_opened_flud/2)
						.attr("y", -height_opened_flud/2)
					    .attr("width", width_opened_flud)
					    .attr("height", height_opened_flud)

		//fo xhtml
		var fo_xhtml_content_closed_flud = fo_content_closed_flud
			.append('xhtml:div')
		    .attr("class", "fo_xhtml_content_closed_flud")
	
		//label_closed_flud
		var label_closed_flud = fo_xhtml_content_closed_flud
			.append("p")
			.attr("id", "label_closed_flud")
			.attr("class", "label_closed_flud")
			.attr("style", function(d){
				return	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
					+ "border: 1px solid rgba("+color_type_rgba[d.type]+",.5)";
			})
			.text(function(d, i) { return d.label; })

		/* 
		 * 
		 * Edit option 
		 * 
		 * */

		/* Edit Image */
		var fo_edit_option_image = node_enter_g
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
		 * Type option 
		 * 
		 * */

		/* Change type Image */
		var fo_type_option_image = node_enter_g
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
		var fo_select_option_image = node_enter_g
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
		    		.attr("id", "fo_div_edit_option_zone")
				    .attr("style", "padding:40px; text-align:right")

		//action on edit zone
		var action_on_edit_option_zone = fo_edit_option_zone
					.on("mouseover",f_oneditover)
					.on("mouseout",f_oneditout)
					.style("cursor", "pointer")
					.on("click", OpenFlud)
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
		    		.attr("id", "fo_div_type_option_zone")
				    .attr("style", "padding:40px; text-align:right")

		//action on type zone
		var action_on_type_option_zone = fo_type_option_zone
					.on("mouseover",f_ontypeover)
					.on("mouseout",f_ontypeout)
					.style("cursor", "pointer")
					.on("click", ChangeType)
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
	            	sparql_add_link(mousedown_node.iri_id, mouseup_node.iri_id);

	            // enable zoom
	            svg.call(d3.behavior.zoom().on("zoom"), rescale);
	            redraw();
	          }
	        })
			.append("title").text("Click to select")

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
							.style("opacity", fade(.2,"#DDD"))
			
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
							.style("opacity", fade(1,"#DDD"))

			p_el.select('#fo_i_drag_option_image').remove();
		}
		
		p_el.select('#fo_div_drag_option_zone')
				.attr("style", "padding:40px; text-align:right;")
	}

	function f_oneditover(d)
	{
			var el = d3.select(this);
			var p_el = d3.select(this.parentNode);

			if (p_el.attr("id") == "g_closed_flud")
			{
				p_el.select('#flud')
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
			
			p_el.select('#fo_div_edit_option_zone')
									.attr("style", "padding:40px; text-align:right;"	
												+"background-color:rgba(200,200,200,.1);")
	}

	function f_oneditout(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		if (p_el.attr("id") == "g_closed_flud")
		{
			p_el.select('#flud')
									.attr("rx", arrondi+30)
									.attr("ry", arrondi+30)
									.style("stroke-width", width_stroke_node)
									.style("opacity", fade(1,"#DDD"))
	
			p_el.select('#fo_i_edit_option_image').remove();
		}
		
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
						.style("opacity", fade(.2,"#DDD"))

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
						.style("opacity", fade(1,"#DDD"))

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
								.style("opacity", fade(.2,"#DDD"))
								
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
									.style("opacity", fade(1,"#DDD"))
			
			p_el.select('#fo_i_select_option_image').remove();
			
			p_el.select('#fo_div_select_option_zone')
			.attr("style", "padding:40px; text-align:right;")
	}

	function OpenFlud(d) 
	{
		//this = fo_edit_option_zone
		//this.parentNode = g_closed_flud
		var el = d3.select(this); //el = fo_edit_option_zone
		var p_el = d3.select(this.parentNode); //p_el = g_closed_flud

		//Put g_closed_flud at the end of g_closed_flud child, to be at the top
		this.parentNode.parentNode.appendChild(this.parentNode);
				
		p_el
			.select("#label_closed_flud")
			.attr("class", "label_closed_flud_hidden")
		
		p_el
			.select("#flud")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("x", -width_opened_flud/2)
			.attr("y", -height_opened_flud/2)
			.attr("width", width_opened_flud)
			.attr("height", height_opened_flud)
			.each("end", DisplayContentOpenedFlud)


		var g_opened_flud_js = this.parentNode

		p_el.attr("id", "g_opened_flud")

		p_el
			.select("#circle_id")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("cx", 0)
			.attr("cy", -height_opened_flud/2)

		p_el
			.select("#text_id")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("dx", 0)
			.attr("dy", 5-height_opened_flud/2)
			
		p_el
			.select("#circle_type")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("cx", 0)
			.attr("cy", height_opened_flud/2)
		
		p_el
			.select("#fo_type_image")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("x", -10)
			.attr("y", (height_opened_flud/2)-10)

		p_el.select("#fo_drag_option_image")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("x", position_x_drag_option_image_opened_flud)
			.attr("y", position_y_drag_option_image_opened_flud)

		p_el.select("#fo_div_drag_option_image")
			.append('i')
		    .attr("id", "fo_i_drag_option_image")
		    .attr("class", "ui large move icon")
			.attr("style", "display:inline")

		p_el.select("#fo_type_option_image")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("x", position_x_type_option_image_opened_flud)
			.attr("y", position_y_type_option_image_opened_flud)

		p_el.select("#fo_div_type_option_image")
			.append('i')
		    .attr("id", "fo_i_type_option_image")
		    .attr("class", "ui large flag icon")
			.attr("style", "display:inline")

		p_el.select("#fo_drag_option_zone")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("x", (-width_opened_flud/2)-40)
			.attr("y", (-height_opened_flud/2)-40)

		p_el.select("#fo_type_option_zone")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("x", (width_opened_flud/2)-40)
			.attr("y", (height_opened_flud/2)-40)

		/*
		*
		* Change Edit option un Save option
		*
		* */
        // Remove Edit icon & Edit zone
        p_el.select('#fo_i_edit_option_image').remove();

		p_el.select("#fo_edit_option_image")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("x", position_x_save_option_image_opened_flud)
			.attr("y", position_y_save_option_image_opened_flud)

		/* Replace by Save icon */
        p_el.select('#fo_div_edit_option_image')
					.append('i')
				    .attr("id", "fo_i_save_option_image")
				    .attr("class", "ui large save icon")
					.attr("style", "display:inline")

		/* And Save zone with action */
		p_el.select("#fo_edit_option_zone")
			.transition()
			.duration(flud_transition_duration_open)
			.delay(flud_transition_delay)
			.ease(flud_transition_easing)
			.attr("x", (width_opened_flud/2)-40)
			.attr("y", (-width_opened_flud/2)-40)
				    
		//action on edit zone
		p_el.select("#fo_edit_option_zone")
					.on("click", SaveFlud)
					//Pas besoin de hover ici...
					.append("title").text("Click to save label")
	}
	
	function DisplayContentOpenedFlud(d) 
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		/* 
		 * 
		 * Contenu du flud 
		 * 
		 * */

		var fo_opened_flud = p_el
				.append("foreignObject")
				.attr("id","fo_opened_flud")
				.attr("x", -width_opened_flud/2)
				.attr("y", -height_opened_flud/2)
				.attr("width", width_opened_flud)
				.attr("height", height_opened_flud)
	
		var fo_xhtml = fo_opened_flud
			.append('xhtml:div')
		    .attr("class", "fo_xhtml_content_opened_flud")

		//Flud Segment
		var flud_segment = fo_xhtml
					.append("div")
					.attr("class", "ui raised segment")
					.attr("style", "position:static;margin:0px;padding:10px")
	
		//Form Segment
		var form_segment = flud_segment
					.append("div")
					.attr("class", "ui form top attached segment")
					.attr("style", "position:static;margin-top:0px;padding:0px")

		var field_label = form_segment
					.append("div")
					.attr("class", "field")

		//flud label

		var flud_label = field_label
					.append("label")
					.attr("style", "position:static")
					.text("Libellé")
					
		var textarea_label_open_flud = field_label
					.append("textarea")
					.attr("id", "textarea_label_open_flud")
					.attr("style", "height:80px;width:140px;")
	                    .text(function() {
	                    	this.focus();
	                        return d.label;
	                    })		
	}
	
	function SaveFlud(d)
	{
//	    console.log("SaveFlud", arguments);

        // Select element that call the SaveFlud function
        var el = d3.select(this); //fo_edit_option_zone
        var p_el = d3.select(this.parentNode); //g_opened_flud

        var label_closed_flud = p_el.select("#label_closed_flud");;
        var textarea_label_open_flud = p_el.select("#textarea_label_open_flud");

        var txt = textarea_label_open_flud.node().value;
        if (txt == "")
        	txt = "New...";

        d.label = txt;
        //Put the new label into the closed flud label
        label_closed_flud.text(d.label);

        //Save in triplestore
        sparql_change_label(d.iri_id, d.label)

		/* 
		 * 
		 * Close flud 
		 * 
		 * */
        p_el.select("#fo_opened_flud").remove();
		
		p_el
			.select("#flud")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("x", -width_closed_flud/2)
			.attr("y", -height_closed_flud/2)
			.attr("width", width_closed_flud)
			.attr("height", height_closed_flud)
	
		//Make the label_closed_flud visible (not with class hidden)
		p_el
			.select("#label_closed_flud")
			.attr("class", "label_closed_flud")

		p_el
			.select("#circle_id")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("cx", 0)
			.attr("cy", -33)
	
		p_el
			.select("#text_id")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("dx", -1)
			.attr("dy", -29)
			
		p_el
			.select("#circle_type")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("cx", 0)
			.attr("cy", 30)
		
		p_el
			.select("#fo_type_image")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("x", -11)
			.attr("y", 19)
	
		p_el.select("#fo_drag_option_image")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("x", position_x_drag_option_image_closed_flud)
			.attr("y", position_y_drag_option_image_closed_flud)

		p_el.select("#fo_type_option_image")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("x", position_x_type_option_image_closed_flud)
			.attr("y", position_y_type_option_image_closed_flud)

		p_el.select("#fo_drag_option_zone")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("x", -width_closed_flud)
			.attr("y", -height_closed_flud)

		p_el.select("#fo_type_option_zone")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("x", 0)
			.attr("y", 0)
			
		p_el.select("#fo_i_drag_option_image").remove();
		p_el.select("#fo_i_type_option_image").remove();

		// Remove Save icon
        p_el.select('#fo_i_save_option_image').remove();

		p_el.select("#fo_edit_option_image")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("x", position_x_edit_option_image_closed_flud)
			.attr("y", position_y_edit_option_image_closed_flud)

		/* Replace by edit icon */
        p_el.select('#fo_div_edit_option_image')
					.append('i')
				    .attr("id", "fo_i_edit_option_image")
				    .attr("class", "ui large edit icon")
					.attr("style", "display:inline")

		/* And Save zone with action */
		p_el.select("#fo_edit_option_zone")
			.transition()
			.duration(flud_transition_duration_close)
			.attr("x", 0)
			.attr("y", -height_closed_flud)
				    
		//action on edit zone
		p_el.select("#fo_edit_option_zone")
					.on("click", OpenFlud)
					//Pas besoin de hover ici...
					.append("title").text("Click to save label")

		p_el.attr("id", "g_closed_flud")
	}

	function ChangeType(d, i)
	{		
        var zone_el = d3.select(this); //fo_type_option_zone
        var g_el = d3.select(this.parentNode);
        var node_el = g_el.select("#flud");
        var type_el = g_el.select("#fo_type_image");
        var text_el = g_el.select("#label_closed_flud");
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
				sparql_change_type(i, "project", "actor");
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
				sparql_change_type(i, "actor", "idea");
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
				sparql_change_type(i, "idea", "ressource");
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
				sparql_change_type(i, "ressource", "project");
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
				sparql_change_type(i, "without", "project");
				break;
		}
	}

	var filters = {
		    "actor": {
	      "key": "actor",
	      "selector": ".actor",
	      "filter": "#filter_actor"
	    },
	    "idea": {
	      "key": "idea",
	      "selector": ".idea",
	      "filter": "#filter_idea"
	    },
	    "none": {
	      "key": "none",
	      "selector": ".none",
	      "filter": "#filter_none"
	    },
	    "project": {
	      "key": "project",
	      "selector": ".project",
	      "filter": "#filter_project"
	    },
	    "ressource": {
	      "key": "ressource",
	      "selector": ".ressource",
	      "filter": "#filter_ressource"
	    },
	    "without": {
	      "key": "without",
	      "selector": ".without",
	      "filter": "#filter_without"
	    }
	  };

	  var toggleFilter = function (target) {
	    d3.selectAll(target.selector).style("opacity", function () {
	      this.classList.remove("node_opacity")}
	    );

	    var filterName;
	    for (filterName in filters) {
	      if (filterName !== target.key) {
	        d3.selectAll(filters[filterName].selector).style("opacity", function () {
	          if (target.key == 'none') {
	            this.classList.remove("node_opacity");
	          } else {
	            this.classList.add("node_opacity");
	          }
	        });
	      }
	    }
	  };

	  var filterName;
	  var filterNames = Object.keys(filters);

	  var k;
	  for (k = 0; k < filterNames.length; k = k + 1) {
	    filterName = filters[filterNames[k]];

	    $(filterName.filter).click(function () {
	      var filterKey = $(this).attr('id').substring('filter_'.length);
	      toggleFilter(filters[filterKey]);
	    });
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
	    	node.select("#flud")
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

			node.select("#label_closed_flud")
					.style("opacity", function(o)
					{
						return isConnected(d, o) ? 1 : opacity;
					})
					
			node.select("#fo_i_type_image")
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
						.select("#flud").style("stroke", "#999");
		tick();
		force.resume();
	}

	function spliceLinksForNode(node) {
		  toSplice = links.filter(
		    function(l) {
		      return (l.source === node) || (l.target === node); });
		  toSplice.map(
		    function(l) {
		      links.splice(links.indexOf(l), 1); });
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
