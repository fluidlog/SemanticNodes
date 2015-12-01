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
			       {iri_id:0, label: "Project", type:"project" },
		           {iri_id:1, label: "Actor", type:"actor" },
			      ],
			edges:[
			       {source:0, target:1},
			      ],
			};

	/* =========================================
	 *  
	 *  Zone de test Flud (avec D3js et Semantic UI
	 *  
	 *   Faire apparaitre le titre sur le cercle, 
	 *   puis le titre et la description lorsque le cercle se transforme en carré 
	 *  
	 *  ======================================== */

	var x_closed_flud = 150,
		y_closed_flud = 150,
		x_opened_flud = 80,
		y_opened_flud = 80,
		width_closed_flud = 100,
		height_closed_flud = 100,
		width_opened_flud = 250,
		height_opened_flud = 250,
		arrondi = 50,
		flud_title = "Titre du flud qui peut être sur plusieurs lignes...";
		flud_type = "Project";
	
	/* =========================================
	 *  
	 *  Création du SVG et du rectangle de fond (dans un groupe)
	 *  
	 *  ======================================== */

	var svg = d3.select("#chart")
				  	.append("svg")
				  	
				    .attr("width", 810)
				    .attr("height", 410)

	var g1 = svg
				  	.append("g")
	
	var rect = g1
				  	.append("rect")
				    .attr("width", 800)
				    .attr("height", 400)
				    .attr("style", "fill:#CCC")
				    
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

	var node = g1.selectAll(".node")
				.data(nodes);

	/* =========================================
	 *  
	 *  Création du flud fermé (dans un groupe)
	 *  
	 *  ======================================== */

	var node_enter_g = node
						.enter()
						.append('g')
						.attr("class", "node")
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

	/* Circle on hover */
	var circle_hover_node = node_enter_g
						.append("circle")
						.attr("r", 0)
						.attr("cx", width_closed_flud/2)
						.attr("cy", height_closed_flud/2)
						.attr("class", "circle_options")

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

	var text = node_enter_g
				.append("text")
				.text(function(d){return d.label})
    

	flud.on("mouseover",function(d)
			{
				var el = d3.select(this);
				var p_el = d3.select(this.parentNode);
				p_el.select('.circle_options')
								.transition()
								.duration(300)
								.attr("r", 50)
			});
	
	flud.on("mouseout",function(d)
			{
				var el = d3.select(this);
				var p_el = d3.select(this.parentNode);
				p_el.select('.circle_options')
								.transition()
								.duration(300)
								.attr("r", 0)		
			});
