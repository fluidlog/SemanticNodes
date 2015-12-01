	var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
	var color_type_rgba = {"project" : "137,165,229", "actor" : "242,133,185", "idea" : "255,217,141", "ressource" : "205,249,137", "without" : "white"};
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
		           {iri_id:1, label: "Actor tralala", type:"actor" },
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
						.attr("cy", width_closed_flud/2)
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

		// text on node
		var fo_text_node = node_enter_g
						.append("foreignObject")
						.attr("id","fo_closed_flud")
						.attr("x",-width_closed_flud/2)
						.attr("y",0)
					    .attr("width", width_closed_flud*2)
					    .attr("height", height_closed_flud)
				.on("mouseover",f_onmouseover)
				.on("mouseout",f_onmouseout)

		//fo xhtml
		var fo_xhtml_text_node = fo_text_node
			.append('xhtml:div')
		    .attr("class", "fo_xhtml")
	
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

	function f_onmouseover(d)
			{
				var el = d3.select(this);
				var p_el = d3.select(this.parentNode);
				p_el.select('.circle_options')
								.transition()
								.duration(200)
								.attr("r", 50)
			}
	
	function f_onmouseout(d)
			{
				var el = d3.select(this);
				var p_el = d3.select(this.parentNode);
				p_el.select('.circle_options')
								.transition()
								.duration(200)
								.attr("r", 0)		
			}
