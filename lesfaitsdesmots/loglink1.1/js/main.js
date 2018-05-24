// Code de départ : http://bl.ocks.org/benzguo/4370043

	var default_domain = "loglink11";
	var dataset;

	$('#initKernelGraph').bind('click', function()
			{
				sparql_delete_all_into_triplestore();
				init_graph(default_domain);
				location.reload()
			}
	);
	
	$('#refreshGraph').bind('click', function()
			{
				location.reload()
			}
	);

 	$('#debug').hover(
	 		function(){$('.debug').css({'z-index' : 1,'zoom' : 1.7});},
	 		function(){$('.debug').css({'zoom' : 1});}
	 	);

 	$('#help').hover(
	 		function(){$('.help').css({'z-index' : 1,'zoom' : 1.7});},
	 		function(){$('.help').css({'zoom' : 1});}
	 	);

	//local or distant ?
	var online = navigator.onLine;
	
	if (online)
	{
		dataset = sparql_get_dataset();
	}
	else
	{
		message (message_offline,"warning");
	}

	//mouse event vars
	var selected_node = null,
	    selected_link = null,
	    mousedown_link = null,
	    mousedown_node = null,
	    mouseup_node = null;
	
	var width = 1200,
	    height = 700,
	    fill = d3.scale.category20();
	
	var n = 100;
	var message_offline = "Connectez-vous à internet pour pouvoir continuer";
	var debug = false;

	// init svg
	var outer = d3.select("#chart")
	  .append("svg:svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("pointer-events", "all");
	
	var svg = outer
	  .append('svg:g')
	    .call(d3.behavior.zoom().on("zoom", rescale))
	    .on("dblclick.zoom", null)
	    .append('svg:g')
	    .on("mousemove", mousemove)
	    .on("mousedown", mousedown)
	    .on("mouseup", mouseup);
	
	svg.append('svg:rect')
	    .attr('width', width)
	    .attr('height', height)
	    .attr('fill', 'white');
	
	// init force layout
	var force = d3.layout.force()
	    .size([width, height])
	    .nodes(dataset.nodes)
	    .links(dataset.edges)
	    .linkDistance(80)
	    .charge(-500)
	    
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

		//On valorise ici le paramètre "key" de la fonction data
		//pour ne pas décaler les id des noeuds lors de la suppression
		node = node.data(nodes, function(d) { return d.iri_id;});
		node_enter_g = node.enter()
				.append("g")
	        	.attr("class", function(d) { return d.type == "deleted" ? "deleted" : "node";})
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		
		node_enter_g.append("circle")
	        	.attr("class", "node_circle")
		  		.attr("r", 10)
	
		node_enter_g.append("text")
				.attr("x", 12)
				.text(function(d, i) { 
				  return d.label+" "+nodes[i].iri_id; 
				  })	  		
	
		node.select(".node_circle").classed("node_selected", function(d) 
				  { 
			  		return d === selected_node; 
				  });

	    node.on("mousedown", 
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
	            if (mouseup_node == mousedown_node) { resetMouseVars(); return; }
	
	            // add link
	            var link = {source: mousedown_node, target: mouseup_node};
	            links.push(link);
	
	            // select new link
	            selected_link = link;
	            selected_node = null;
	            
	            //Ajoute le lien dans le triplestore via la fonction "fluidlog" Addlink
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
	
			//lancement du tick
			d3.select("#waiting").style("display", "none");
			force.on("tick", tick);
			
			//On supprime tous les noeuds "deleted"
			d3.selectAll(".deleted").remove();
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
				      // Récupération du nouvel id via la fonction "fluidlog" get_new_iri()
				      sparql_increment_node_id();
				      var new_node_iri_id = parseInt(sparql_get_new_node_iri().split("/").pop(), 10);
				      
				      var 	point = d3.mouse(this),
				        	node = {iri_id : new_node_iri_id, label : "Node", x: point[0], y: point[1]};
				      
				      nodes.push(node);
				
				      // select new node
				      selected_node = node;
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
