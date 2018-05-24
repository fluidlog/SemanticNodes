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
			       {iri_id:0, label: "Node", type:"project" },
		           {iri_id:1, label: "Node", type:"actor" },
		           {iri_id:2, label: "Node", type:"idea" },
		           {iri_id:3, label: "Node", type:"ressource" },
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

	var open_button = d3.select("#open_flud").on("click", OpenFlud);
	var close_button = d3.select("#close_flud").on("click", CloseFlud);

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


	/* =========================================
	 *
	 *  Création du flud fermé (dans un groupe)
	 *
	 *  ======================================== */
	var g2 = g1
			.append('g')

	var flud = g2
				.append("rect")
				.attr("id", "flud")
				.attr("fill", "#eee")
			    .style("stroke", "#aaa")
			    .style("stroke-width", 2)
				.attr("rx", arrondi)
				.attr("ry", arrondi)
				.attr("x", x_closed_flud)
				.attr("y", y_closed_flud)
				.attr("width", width_closed_flud)
				.attr("height", height_closed_flud)

	DisplayContentClosedFlud();

	function DisplayContentClosedFlud() {
		var fo = g2
			.append("foreignObject")
			.attr("id","fo_closed_flud")
			.attr("x",x_opened_flud)
			.attr("y",y_opened_flud)
		    .attr("width", width_opened_flud)
		    .attr("height", height_opened_flud)

		//xhtml
		var fo_xhtml = fo
			.append('xhtml:div')
		    .attr("class", "fo_xhtml")

		//div permettant un contenu centré verticalement
		var fo_div = fo_xhtml
			.append('xhtml:div')
		    .attr("class", "fo_div_centered")

		//paragraph
		var p = fo_div
			.append("p")
		    .attr("class", "fo_p_node")
			.append("h4")
			.attr("class", "ui header")
			.text(flud_title)
	}

	/* =========================================
	 *
	 *  Fonctions gérant l'ouverture et la fermeture flud
	 *
	 *  ======================================== */
	function OpenFlud() {
		d3.select("#fo_closed_flud").remove();

		d3.select("#flud")
		.transition()
		.duration(500)
		.attr("x", x_opened_flud)
		.attr("y", y_opened_flud)
		.attr("width", width_opened_flud)
		.attr("height", height_opened_flud)
		.each("end", DisplayContentOpenedFlud);
	}

	function DisplayContentOpenedFlud() {
		var fo = g2
			.append("foreignObject")
			.attr("id","fo_opened_flud")
			.attr("x", x_opened_flud)
			.attr("y", y_opened_flud)
			.attr("width", width_opened_flud)
			.attr("height", height_opened_flud)

		var fo_xhtml = fo
			.append('xhtml:div')
		    .attr("class", "fo_xhtml")

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
				  	.text(flud_type)

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

		/*
	   *
	   * Vidéo
	   *
	   * */

	  var fo_xhtml_video_in_open_node_label = form_segment
	        .append('div')
	        .attr("class", "fo_xhtml_video_in_open_node_label")
	        .attr("id", "fo_xhtml_video_in_open_node_label")
	        //Warning : using css doesn't work !?
	        .attr("style", "width:200px;"
	                      +"position:static;")
	        .html(function(d){
	          var html_video = "<iframe src='https://www.youtube.com/embed/t3DhMLQsJA0' allowfullscreen width='200px'>vidéo</iframe>"
	          return html_video;
	        })

	}


	function CloseFlud() {
		d3.select("#fo_opened_flud").remove();

		d3.select("#flud")
		.transition()
		.duration(500)
		.attr("x", 150)
		.attr("y", 150)
		.attr("width", 100)
		.attr("height", 100)

		DisplayContentClosedFlud();
	}
