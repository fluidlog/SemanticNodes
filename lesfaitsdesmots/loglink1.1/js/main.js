function init_graph(default_domain)
{
	var domain_created;
	
	domain_created = add_domain_to_triplestore(default_domain);
	if (!domain_created)
	{
		message("erreur de création du domaine","alert");
		return false;
	}
	//On initialise le compteur de noeud à 0 pour ce domaine
//	increment_node_id(-1);
	//On charge le noyeau d'amorçage
//	var first_node_iri = "http://www.fluidlog.com/loglink/domain/loglink11/node/0";
//	var second_node_iri = "http://www.fluidlog.com/loglink/domain/loglink11/node/1";
	increment_node_id(-1);
	var first_node_iri = get_new_node_iri();
	increment_node_id();
	var second_node_iri = get_new_node_iri();
	//Le compteur de noeud doit être à 1
	init_kernel_graph(first_node_iri, second_node_iri);
}

	//Vérification de l'existance du domaine "loglink11" dans le triplestore
	var default_domain = "loglink11";
	var dataset;
	var new_domain = false;
	
	// =========================================================
	// S'il n'y a pas de domaine mémorisé dans le localstorage, 
	// - On l'ajoute dans le LS
	// - Et s'il n'existe pas dans le triplestore, on le créer
	// Ainsi, on ne fait pas le test de l'existance dans le TS à chaque fois car c'est trop long...
	// =========================================================
	domain_in_localstorage=localStorage.getItem(default_domain+".domain");
	if (domain_in_localstorage == null)
	{
		localStorage.setItem(default_domain+".domain",default_domain);
		var test_domain = exist_domain(default_domain);
		if (test_domain == false)
		{
			init_graph(default_domain);
		}
	}

	$('#initKernelGraph').bind('click', function()
			{
				delete_all_into_triplestore();
				localStorage.removeItem(default_domain+".domain");
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

//Permet de tester la partie JS sans faire appel au triplestore
//	dataset = {
//	nodes:[
//	       {id:0, label: "Node" },
//           {id:1, label: "Node" },
//	      ],
//	edges:[
//	       {source:0, target:1},
//	      ],
//};

	dataset = get_dataset();

	//mouse event vars
	var selected_node = null,
	    selected_link = null,
	    mousedown_link = null,
	    mousedown_node = null,
	    mouseup_node = null;
	
	var width = 800,
	    height = 600,
	    fill = d3.scale.category20();
	
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
	    .linkDistance(50)
	    .charge(-200)
	    .on("tick", tick)
	
	// line displayed when dragging new nodes
	var drag_line = svg.append("line")
	    .attr("class", "drag_line")
	    .attr("x1", 0)
	    .attr("y1", 0)
	    .attr("x2", 0)
	    .attr("y2", 0);
	
	var links = svg.selectAll(".link");
	var nodes = svg.selectAll(".node");
	
	redraw();
	
	// redraw force layout
	function redraw() 
	{
		links = links.data(dataset.edges);
		links.enter()
	  		.insert("line", ".node")
	  		.attr("class", "link")
	
	  	links.exit().remove();
	
		nodes = nodes.data(dataset.nodes);
		nodes_enter_g = nodes.enter()
				.append("g")
	        	.attr("class", "node")
		
		nodes_enter_g.append("circle")
		  		.attr("r", 6.5)
	
		nodes_enter_g.append("text")
				.attr("x", 12)
				.text(function(d, i) { 
				  return d.label+" "+dataset.nodes[i].id; 
				  })	  		
	
	    nodes.on("mousedown", 
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
	        function(d) { //lorsqu'on lache la souris au dessus d'un noeud
	          if (mousedown_node) {
	            mouseup_node = d; 
	            if (mouseup_node == mousedown_node) { resetMouseVars(); return; }
	
	            // add link
	            var link = {source: mousedown_node, target: mouseup_node};
	            dataset.edges.push(link);
	
	            // select new link
	            selected_link = link;
	            selected_node = null;
	            
	            //Ajoute le lien dans le triplestore via la fonction "fluidlog" Addlink
	            add_link(mousedown_node.id, mouseup_node.id);
	
	            // enable zoom
	            svg.call(d3.behavior.zoom().on("zoom"), rescale);
	            redraw();
	          } 
	        })
	
		nodes.exit().remove(); // Supprime le <g> en trop par rapport au contenu du dataset
	
		  if (d3.event) 
		  {
		    // prevent browser's default behavior
		    d3.event.preventDefault();
		  }
	
		  force.start();
	
	}
	
	function tick() 
	{
		links.attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });
		
		nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		nodes.attr("cx", function(d) { return d.x; })
		     .attr("cy", function(d) { return d.y; });
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
	      // Récupération du nouvel id via la fonction "fluidlog" get_new_iri()
	      increment_node_id();
	      var new_node_id = parseInt(get_new_node_iri().split("/").pop(), 10);
	      var inc_new_node_id = new_node_id + 1;
	      
	      var point = d3.mouse(this),
	        node = {id : new_node_id, label : "Node", x: point[0], y: point[1]},
	        n = dataset.nodes.push(node);
	
	      // select new node
	      selected_node = node;
	      selected_link = null;
	      
	      // add link to mousedown node
	      dataset.edges.push({source: mousedown_node, target: node});
	      
	      //fonction "fluidlog" permettant d'ajouter un noeud et un lien (depuis le noeud source vers le nouveau noeud) dans le triplestore
	      add_node(mousedown_node.id, new_node_id);
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
