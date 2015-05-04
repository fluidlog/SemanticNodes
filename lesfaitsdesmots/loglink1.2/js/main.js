// Code de départ : http://bl.ocks.org/benzguo/4370043

/* =========================================
 *  
 *  Initialisation des variables
 *  
 *  ======================================== */
 
	var default_domain = "loglink11";
	var dataset;

	var new_domain = true;
	
	var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
	var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;";
	var rayon = 30;
	var n = 100;
	var message_offline = "Connectez-vous à internet pour pouvoir continuer";
	var debug = false;

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
	

	$('#inputSearch').focus(function(){
		//On recharge le contenu avant de rechercher (trouver une autre méthodes plus tard...)
		contentSearch = loadSearchContent(true);
	})
	
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

	//mouse event vars
	var selected_node = null,
	    selected_link = null,
	    mousedown_link = null,
	    mousedown_node = null,
	    mouseup_node = null;

	var width = window.innerWidth - 10,
	    height = window.innerHeight - 80;

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
						.on("click", make_editable)
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
						.on("click", click_image_type)
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

	function tick()
	{
		link.attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}

	function click_image_type(d, i)
	{
//		if (d3.event.defaultPrevented) return;
        var el = d3.select(this);
        var g_el = d3.select(this.parentNode);
        var node_el = g_el.select(".node_circle");
        var type_el = g_el.select(".image_type");

        switch (d.type)
		{
			case "project" :
				el.attr("xlink:href","img/actor.png");
				type_el.attr("xlink:href","img/actor.png");
				d.type = "actor";
				node_el.style("fill", function(d) { return color_type[d.type] } );
				sparql_change_type(i, "project", "actor");
				break;
			case "actor" :
				el.attr("xlink:href","img/idea.png");
				type_el.attr("xlink:href","img/idea.png");
				d.type = "idea";
				node_el.style("fill", function(d) { return color_type[d.type] } );
				sparql_change_type(i, "actor", "idea");
				break;
			case "idea" :
				el.attr("xlink:href","img/ressource.png");
				type_el.attr("xlink:href","img/ressource.png");
				d.type = "ressource";
				node_el.style("fill", function(d) { return color_type[d.type] } );
				sparql_change_type(i, "idea", "ressource");
				break;
			case "ressource" :
				el.attr("xlink:href","img/project.png");
				type_el.attr("xlink:href","img/project.png");
				d.type = "project";
				node_el.style("fill", function(d) { return color_type[d.type] } );
				sparql_change_type(i, "ressource", "project");
				break;
			case "without" :
				el.attr("xlink:href","img/project.png");
				type_el.attr("xlink:href","img/project.png");
				d.type = "project";
				node_el.style("fill", function(d) { return color_type[d.type] } );
				sparql_change_type(i, "without", "project");
				break;
		}
	}

	function getTextSize(object,r)
	{
		var textlength = object.getComputedTextLength();
		var fontsize = Math.min(2 * r, (2 * r - 10) / textlength * 24) + "px";
		return fontsize ;
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

	function make_editable(d)
	{
//        console.log(this, arguments);

        // Select element that call the make_editable function
        var el = d3.select(this);
        var p_el = d3.select(this.parentNode);
        var txt_el = p_el.select(".label");

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
//                        .attr("value", function() {
//                            // nasty spot to place this call, but here we are sure that the <input> tag is available
//                            // and is handily pointed at by 'this':
//                            this.focus();
//                            return d.label;
//                        })
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

        // Remplace l'image d'édition par une image de sauvegarde
        el.attr("xlink:href","img/save.png")
        	.on("click", change_label);
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
        sparql_change_label(d.iri_id, d.label)

        // Note to self: frm.remove() will remove the entire <g> group! Remember the D3 selection logic!
        fo_el.remove();
        // Remplace l'image de sauvegarde par une image d'édition
        el.attr("xlink:href","img/edit_64.png")
    			.on("click", make_editable);
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
