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

	var width_closed_flud = 100,
		height_closed_flud = 100,
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
	    .linkDistance(200)
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
				.on("click",OpenFlud)

	var flud = node_enter_g
				.append("rect")
				.attr("id", "flud")
				.attr("class", "flud")
				.attr("fill", "transparent")
			    .style("stroke", "#aaa")
			    .style("stroke-width", 2)
				.attr("x", width_opened_flud/2-width_closed_flud/2)
				.attr("y", height_opened_flud/2-height_closed_flud/2)
				.attr("rx", arrondi)
				.attr("ry", arrondi)
				.attr("width", width_closed_flud)
				.attr("height", height_closed_flud)

	DisplayContentClosedFlud();

	function DisplayContentClosedFlud()
	{
		// text on node
		var fo_text_node = node_enter_g
						.append("foreignObject")
						.attr("id","fo_closed_flud")
					    .attr("width", width_opened_flud)
					    .attr("height", height_opened_flud)

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
	}

	/* =========================================
	 *
	 *  Fonctions gérant l'ouverture et la fermeture flud
	 *
	 *  ======================================== */
	function OpenFlud(d)
	{
		var el = d3.select(this); // <g.node>
		var p_el = d3.select(this.parentNode); //<g>

		//Make the node on the top by changing the order of the svg sequence
		this.parentNode.appendChild(this);
		el.select("#fo_closed_flud").remove();

		el.on("click", null)

        el.select("#flud")
			.transition()
			.duration(500)
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width_opened_flud)
			.attr("height", height_opened_flud)
			.each("end", DisplayContentOpenedFlud);
	}

	function DisplayContentOpenedFlud(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		var fo = p_el
			.append("foreignObject")
			.attr("id","fo_opened_flud")
			// .attr("x", function (){return d.x})
			// .attr("y", function (){return d.y})
			.attr("width", width_opened_flud)
			.attr("height", height_opened_flud)

		var fo_xhtml = fo
			.append('xhtml:div')
		    .attr("class", "fo_xhtml_opened")

		//Flud Segment
		var flud_segment = fo_xhtml
					.append("div")
					.attr("class", "ui raised segment")

		// //Form Segment
		// var form_segment = flud_segment
		// 			.append("div")
		// 			.attr("class", "ui form top attached segment")
		// 			.attr("style", "position:static;margin-top:0px;padding:0px")

					/*
		       *
		       * Type
		       *
		       * */

					//Type du flud dans une étiquette (label ui)
					var label_type = flud_segment
								.append("div")
								.attr("class", "ui blue ribbon label")

					//type icon
					var icon_type = label_type
								.append("i")
							  	.attr("class", "lab icon")

					//dropdown type
					var dropdown_type = label_type
								.append("div")
								.attr("class", "ui dropdown")
								.attr("id", "dropdown_type")

					//text
					var text_type = dropdown_type
								.append("div")
								.attr("class", "text")
								.text(function (){return d.type})

					//dropdown icon
					var icon_type = dropdown_type
								.append("i")
							  	.attr("class", "dropdown icon")

					//dropdown menu
					var dropdown_type_menu = dropdown_type
								.append("div")
								.attr("class", "menu")

					var dropdown_project = dropdown_type_menu
								.append("div")
								.attr("class", "item")
								.text("Project")

					var dropdown_actor = dropdown_type_menu
								.append("div")
								.attr("class", "item")
								.text("Actor")

					var dropdown_idea = dropdown_type_menu
								.append("div")
								.attr("class", "item")
								.text("Idea")

					var dropdown_ressource = dropdown_type_menu
								.append("div")
								.attr("class", "item")
								.text("Ressource")

				$('#dropdown_type').dropdown({
				    // you can use any ui transition
				    transition: 'drop'
				  });

			/*
		   *
		   * Description
		   *
		   * */
		var title_content = flud_segment
					.append("div")
					.attr("class", "ui top attached label")
					.attr("style", "position:static;")
					.text("Description")
		var field_content = flud_segment
					.append("div")
					.attr("class", "field")

		var textarea_content = flud_segment
					.append("textarea")
					.attr("style", "height:50px;width:180px;")
                    .text(function() {
                    	this.focus();
                        return d.label;
                    })
	}


	function DisplayContentOpenedFlud_old(d)
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		var fo = p_el
			.append("foreignObject")
			.attr("id","fo_opened_flud")
			.attr("width", width_opened_flud)
			.attr("height", height_opened_flud)

		var fo_xhtml = fo
			.append('xhtml:div')
		    .attr("class", "fo_xhtml_opened")

		//Segment sur lequel nous allons déposer le formulaire
		var flud_segment = fo_xhtml
					.append("div")
					.attr("class", "ui raised segment")

		//Type du flud dans une étiquette (label ui)
		var label_type = flud_segment
					.append("div")
					.attr("class", "ui blue ribbon label")

		//type icon
		var icon_type = label_type
					.append("i")
				  	.attr("class", "lab icon")

		//dropdown type
		var dropdown_type = label_type
					.append("div")
					.attr("class", "ui dropdown")
					.attr("id", "dropdown_type")

		//text
		var text_type = dropdown_type
					.append("div")
					.attr("class", "text")
				  	.text(function(){return d.type})

		//dropdown icon
		var icon_type = dropdown_type
					.append("i")
				  	.attr("class", "dropdown icon")

		//dropdown menu
		var dropdown_type_menu = dropdown_type
					.append("div")
					.attr("class", "menu")

		var dropdown_project = dropdown_type_menu
					.append("div")
					.attr("class", "item")
					.text("Project")

		var dropdown_actor = dropdown_type_menu
					.append("div")
					.attr("class", "item")
					.text("Actor")

		var dropdown_idea = dropdown_type_menu
					.append("div")
					.attr("class", "item")
					.text("Idea")

		var dropdown_ressource = dropdown_type_menu
					.append("div")
					.attr("class", "item")
					.text("Ressource")

	$('#dropdown_type').dropdown({
	    // you can use any ui transition
	    transition: 'drop'
	  });

		//Segment sur lequel nous allons déposer le formulaire
		var form_segment = flud_segment
					.append("div")
					.attr("class", "ui form top attached segment")
					.attr("style", "margin-top:3px;padding:0px")

		//Titre du flud
		var title_content = form_segment
					.append("div")
					.attr("class", "ui top attached label")
					.text("Description")
		var field_content = form_segment
					.append("div")
					.attr("class", "field")
		var textarea_content = form_segment
					.append("textarea")
					.attr("style", "height:20px;width:180px;")
					.text(function(){return d.label})

	}

	function CloseFlud()
	{
		var el = d3.select(this);
		var p_el = d3.select(this.parentNode);

		d3.select("#fo_opened_flud").remove();

		el.on("click", OpenFlud)

		d3.select("#flud")
				.transition()
				.duration(500)
				.attr("x", 150)
				.attr("y", 150)
				.attr("width", 100)
				.attr("height", 100)

		DisplayContentClosedFlud();
	}
