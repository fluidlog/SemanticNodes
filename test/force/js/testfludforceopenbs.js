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
			// .attr("style", "position:relative;")

		//Flud Segment
		var flud_dropdown = fo_xhtml
					.append("div")
					.attr("class", "dropdown")

		//dropdown Button
		var dropdown_button = flud_dropdown
					.append("button")
					.attr("class", "btn btn-default dropdown-toggle")
					.attr("type", "button")
					.attr("id", "dropdownMenu1")
					.attr("data-toggle", "dropdown")
					.attr("aria-haspopup", "true")
					.attr("aria-expanded", "true")
					.text("Projet")

		//dropdown menu
		var dropdown_menu_ul = flud_dropdown
					.append("ul")
					.attr("class", "dropdown-menu")
					.attr("aria-labelledby", "dropdownMenu1")

		var dropdown_menu_li1 = dropdown_menu_ul
					.append("li")

		var dropdown_menu_a1 = dropdown_menu_li1
					.append("a")
					.text("Projet")

		var dropdown_menu_li2 = dropdown_menu_ul
					.append("li")

		var dropdown_menu_a2 = dropdown_menu_li2
					.append("a")
					.text("Actor")

		$('#dropdownMenu1').dropdown()

			/*
		   *
		   * Description
		   *
		   * */
		var title_content = fo_xhtml
					.append("div")
					.text("Description")
		var field_content = fo_xhtml
					.append("div")
					.attr("class", "field")

		var textarea_content = fo_xhtml
					.append("textarea")
					.attr("style", "height:50px;width:180px;")
                    .text(function() {
                    	this.focus();
                        return d.label;
                    })

				/*
			   *
			   * Liste de choix (select)
			   *
			   * */

				var control = fo_xhtml
							.append("select")
							.attr("class", "form-control")

				var option1 = control
							.append("option")
							.attr("value", "project")
							.text("Project")

				var option2 = control
							.append("option")
							.attr("value", "actor")
							.text("Actor")
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
