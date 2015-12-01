//PAIR - Project, Actor, Idea, Ressource

var data = {"nodes":[
						{"id":0, "name":"< Les faits des mots", "full_name":"Retour à l'espace de démonstration...", "url": "fluidlog.com/", "ext":"no", "type":"nav"},											
						{"id":1, "name":"< fluidlog", "full_name":"Retour à l'accueil...", "url": "fluidlog.com", "ext":"no", "type":"nav"},										
						{"id":2, "name":"# Cartographie sémantique", "full_name":"Le monde de la cartographie sémantique !", "url": "", "ext":"no", "type":"quoi"},
						{"id":3, "name":"# Web sémantique", "full_name":"Les technologies du web sémantique", "url": "", "ext":"no", "type":"quoi"},											
						{"id":4, "name":"# Libs de graphe", "full_name":"Librairies de représentation de graphes", "url": "", "ext":"no", "type":"quoi"},
						{"id":5, "name":"^ D3 JS", "full_name":"Librairie Javascript générant du SVG", "url": "d3js.org", "ext":"yes", "type":"ou"},											
						{"id":6, "name":"^ Sigma JS", "full_name":"Librairie Javascript générant du bitmap", "url": "sigmajs.org", "ext":"yes", "type":"ou"},											
						{"id":7, "name":"^ SVG", "full_name":"Scalable Vector Graphics", "url": "fr.wikipedia.org/wiki/Scalable_Vector_Graphics", "ext":"yes", "type":"comment"},											
						{"id":8, "name":"^ Bitmap", "full_name":"Format d'image matricielle", "url": "fr.wikipedia.org/wiki/Image_matricielle", "ext":"yes", "type":"comment"},					
						{"id":9, "name":"@ Jean-Marc Vanel", "full_name":"@jmvanel", "url": "twitter.com/jmvanel", "ext":"yes", "type":"qui"},											
						{"id":10, "name":"^ Deductions", "full_name":"Deduction software SARL", "url": "deductions-software.com", "ext":"yes", "type":"ou"},											
						{"id":11, "name":"@ Yannick Duthé", "full_name":"@fluidlog", "url": "twitter.com/fluidlog", "ext":"yes", "type":"qui"},											
						{"id":12, "name":"^ FLUIDLOG", "full_name":"@fluidlog", "url": "fluidlog.com", "ext":"yes", "type":"ou"},											
						{"id":13, "name":"^ BORDER CLOUD", "full_name":"Héberger vos données dans le Web 3.0 !", "url": "bordercloud.com", "ext":"yes", "type":"ou"},									
						{"id":14, "name":"@ Karima Rafes", "full_name":"@karima_rafes", "url": "twitter.com/karima_rafes", "ext":"yes", "type":"qui"},							
						{"id":15, "name":"^ MONDECA", "full_name":"Take your content further", "url": "mondeca.com/fr", "ext":"yes", "type":"ou"},							
						{"id":16, "name":"^ ANTIDOT", "full_name":"Moteur de recherche sémantique", "url": "antidot.net", "ext":"yes", "type":"ou"},							
						{"id":17, "name":"^ GEPHI", "full_name":"Visualize graph data easily", "url": "gephi.org", "ext":"yes", "type":"ou"},
						{"id":18, "name":"^ LINKURIOUS", "full_name":"Makes graphs handy", "url": "linkurio.us", "ext":"yes", "type":"ou"},
						{"id":19, "name":"@ Sebastien Heymann", "full_name":"@Gephi", "url": "twitter.com/Gephi", "ext":"yes", "type":"qui"},
						{"id":20, "name":"^ VUE", "full_name":"Visual Understanding Environment", "url": "vue.tufts.edu/", "ext":"yes", "type":"ou"},
						{"id":21, "name":"@ Christophe Tricot", "full_name":"@ctricot", "url": "twitter.com/ctricot", "ext":"yes", "type":"qui"},
						{"id":22, "name":"^ VISUAL COMPLEXITY", "full_name":"Agrégateur de cartographies", "url": "visualcomplexity.com/vc/", "ext":"yes", "type":"ou"},
						{"id":23, "name":"# Mind mapping", "full_name":"Cartes mentales", "url": "", "ext":"no", "type":"quoi"},
						{"id":24, "name":"^ MINDMUP", "full_name":"Zero-Friction Free Mind Mapping online", "url": "www.mindmup.com", "ext":"yes", "type":"ou"},
						{"id":25, "name":"^ MINDOMO", "full_name":"Create the best looking mind map online", "url": "mindomo.com", "ext":"yes", "type":"ou"},
						{"id":26, "name":"^ CYTOSCAPE", "full_name":"Visualizing complex networks", "url": "cytoscape.org", "ext":"yes", "type":"ou"},
						{"id":27, "name":"^ PEARLTREE", "full_name":"Cultivez vos intérêts", "url": "pearltrees.com", "ext":"yes", "type":"ou"},
						{"id":28, "name":"^ MAGILEM", "full_name":"Cartographie documentaire industrielle", "url": "magillem.com", "ext":"yes", "type":"ou"},
						{"id":29, "name":"@ Fabien Gandon", "full_name":"@fabien_gandon", "url": "twitter.com/fabien_gandon", "ext":"yes", "type":"qui"},
						{"id":30, "name":"^ PIKKO SOFTWARE", "full_name":"Cartographiez votre information!", "url": "pikko-software.com", "ext":"yes", "type":"ou"},
						{"id":31, "name":"^ SILOBREAKER", "full_name":"Explore & connect (à 1'08'')", "url": "www.youtube.com/watch?v=4oktFT_-_YU", "ext":"yes", "type":"ou"},
						{"id":32, "name":"^ KNOWNODES", "full_name":"Share and create connections", "url": "www.knownodes.com/", "ext":"yes", "type":"ou"},
						{"id":33, "name":"@ Dor Garbash", "full_name":"@garbash", "url": "twitter.com/garbash", "ext":"yes", "type":"qui"},
						{"id":34, "name":"^ STAMPLE", "full_name":"Co-operating systems", "url": "stample.co/login", "ext":"yes", "type":"ou"},
						{"id":35, "name":"@ Sacha Roger", "full_name":"@SachaRoger", "url": "twitter.com/SachaRoger", "ext":"yes", "type":"qui"},
						{"id":36, "name":"@ Henry Story", "full_name":"@bblfish", "url": "twitter.com/bblfish", "ext":"yes", "type":"qui"},
						{"id":37, "name":"^ ASSEMBLEE VIRTUELLE", "full_name":"Créer, c'est unir", "url": "assemblee-virtuelle.org/", "ext":"yes", "type":"ou"},
						{"id":38, "name":"@ Guillaume Rouyer", "full_name":"@Guillaume_AV", "url": "twitter.com/Guillaume_AV", "ext":"yes", "type":"qui"},
						{"id":39, "name":"@ Michel Cadennes", "full_name":"@tchevengour", "url": "twitter.com/tchevengour", "ext":"yes", "type":"qui"},
						{"id":40, "name":"@ Martin Pruvost Beaurain", "full_name":"@tchevengour", "url": "twitter.com/Martin__PB", "ext":"yes", "type":"qui"},
						{"id":41, "name":"@ Edward Silhol", "full_name":"@edwardsilhol", "url": "twitter.com/edwardsilhol", "ext":"yes", "type":"qui"},
						{"id":42, "name":"^ NETWORKX", "full_name":"High-productivity software for complex networks", "url": "networkx.github.io/", "ext":"yes", "type":"ou"},
						{"id":43, "name":"^ CHRISTOPHE VIAU", "full_name":"BIG cartographie Gallery", "url": "christopheviau.com/d3list/gallery.html", "ext":"yes", "type":"ou"},
						{"id":44, "name":"^ QUADRIGRAM", "full_name":"Exploring, analyzing, and visualizing data", "url": "www.quadrigram.com", "ext":"yes", "type":"ou"},
						{"id":45, "name":"^ MOEBIO", "full_name":"Cartography", "url": "moebio.com/", "ext":"yes", "type":"ou"},
						{"id":46, "name":"^ JENA", "full_name":"A free and open source Java framework", "url": "jena.apache.org/", "ext":"yes", "type":"ou"},
						{"id":47, "name":"^ MINDMEISTER", "full_name":"Collaborative mind mapping (online)", "url": "www.mindmeister.com", "ext":"yes", "type":"ou"},
						{"id":48, "name":"^ TSO", "full_name":"Corporate Information Solutions", "url": "www.tso.co.uk", "ext":"yes", "type":"ou"},
						{"id":49, "name":"^ OPENLINK", "full_name":"Link Data Solutions", "url": "www.openlinksw.com", "ext":"yes", "type":"ou"},
						{"id":50, "name":"# SPARQL", "full_name":"Requêtage RDF", "url": "", "ext":"no", "type":"quoi"},											
						{"id":51, "name":"^ FLINT", "full_name":"SPARQL Editor", "url": "openuplabs.tso.co.uk/demos/sparqleditor", "ext":"yes", "type":"ou"},
						{"id":52, "name":"# RDF", "full_name":"Requêtage RDF", "url": "", "ext":"no", "type":"quoi"},											
						{"id":53, "name":"# SKOS", "full_name":"Vocabulaire pour les thésaurus", "url": "", "ext":"no", "type":"quoi"},											
						{"id":54, "name":"# Triplestore", "full_name":"SPARQL End Point", "url": "", "ext":"no", "type":"quoi"},											
						{"id":55, "name":"^ 4Store", "full_name":"Scalable RDF Storage", "url": "4store.org/", "ext":"yes", "type":"ou"},
						{"id":56, "name":"^ ARC2", "full_name":"PHP RDF Storage", "url": "github.com/semsol/arc2/wiki", "ext":"yes", "type":"ou"},
						{"id":57, "name":"^ VIRTUOSO", "full_name":"Scalable RDF Storage", "url": "virtuoso.openlinksw.com/", "ext":"yes", "type":"ou"},
						{"id":58, "name":"^ TEMATRES", "full_name":"Manage, Publish, Share, Re-use", "url": "www.vocabularyserver.com/", "ext":"yes", "type":"ou"},
						{"id":59, "name":"^ PROTEGE", "full_name":"ontology editor", "url": "code.google.com/p/skoseditor/", "ext":"yes", "type":"ou"},
						{"id":60, "name":"^ SKOS EDITOR", "full_name":"plugin for Protege", "url": "protege.stanford.edu/", "ext":"yes", "type":"ou"},
						{"id":61, "name":"^ THMANAGER", "full_name":"créer et visualiser des thesauri", "url": "georezo.net/wiki/main/logiciels/thmanager", "ext":"yes", "type":"ou"},
						{"id":62, "name":"@ Kingsley Uyi Idehen", "full_name":"@kidehen", "url": "twitter.com/kidehen", "ext":"yes", "type":"qui"},
						{"id":63, "name":"@ Jean Delahousse", "full_name":"@jdelahousse", "url": "twitter.com/jdelahousse", "ext":"yes", "type":"qui"},
						{"id":64, "name":"@ Gautier Poupeau", "full_name":"@lespetitescases", "url": "twitter.com/lespetitescases", "ext":"yes", "type":"qui"},
						{"id":65, "name":"@ Bernard Vatant", "full_name":"@lespetitescases", "url": "twitter.com/BVatant", "ext":"yes", "type":"qui"},
						{"id":66, "name":"@ cyberlabe", "full_name":"@cyberlabe", "url": "twitter.com/cyberlabe", "ext":"yes", "type":"qui"},
						{"id":67, "name":"^ METREECA", "full_name":"Seeding Intuition", "url": "www.metreeca.it/", "ext":"yes", "type":"ou"},
						{"id":68, "name":"@ Jason Davies", "full_name":"@jasondavies", "url": "twitter.com/jasondavies", "ext":"yes", "type":"qui"},
						{"id":69, "name":"^ DATAVEYES", "full_name":"Interactions Homme-Données", "url": "dataveyes.com/#!/fr", "ext":"yes", "type":"ou"},
						{"id":70, "name":"@ PY Vandenbussche", "full_name":"@pyvandenbussche", "url": "twitter.com/pyvandenbussche", "ext":"yes", "type":"qui"},
						{"id":71, "name":"^ INRIA", "full_name":"Inventeurs du monde numérique", "url": "www.inria.fr/", "ext":"yes", "type":"ou"},
						{"id":72, "name":"@ Nicolas Cynober", "full_name":"@cyno", "url": "twitter.com/cyno", "ext":"yes", "type":"qui"},
						{"id":73, "name":"^ RENAULT", "full_name":"Constructeur automobile", "url": "www.renault.fr", "ext":"yes", "type":"ou"},
						{"id":74, "name":"^ MAKOLAB", "full_name":"Web sémantique Pologne", "url": "makolab.pl/fr", "ext":"yes", "type":"ou"},
						{"id":75, "name":"@ Mirek Sopek", "full_name":"@sopekmir", "url": "twitter.com/sopekmir", "ext":"yes", "type":"qui"},
						{"id":76, "name":"@ Jean-Paul Servant", "full_name":"@hyperfp", "url": "twitter.com/hyperfp", "ext":"yes", "type":"qui"},
						{"id":77, "name":"@ Mike Bostock", "full_name":"@mbostock", "url": "twitter.com/mbostock", "ext":"yes", "type":"qui"},
						{"id":78, "name":"@ Scott Murray", "full_name":"@alignedleft", "url": "twitter.com/alignedleft", "ext":"yes", "type":"qui"},
						{"id":79, "name":"^ VISUAL.LY", "full_name":"Tell your story visually", "url": "visual.ly/", "ext":"yes", "type":"ou"},
						{"id":80, "name":"^ FLUIDOPS", "full_name":"fluid Operations", "url": "fluidops.com/", "ext":"yes", "type":"ou"},
						{"id":81, "name":"@ Sylvie Dalbin", "full_name":"Sylvie Dalbin", "url": "linkedin.com/in/sylviedalbin", "ext":"yes", "type":"qui"},
						{"id":82, "name":"^ DEBATEGRAPH", "full_name":"Join a global community of mappers", "url": "debategraph.org/Stream.aspx?nid=61932&vt=bubble&dc=focus", "ext":"yes", "type":"ou"},
						{"id":83, "name":"^ 3KBO", "full_name":"Strategy for building semantic web applications", "url": "notes.3kbo.com/", "ext":"yes", "type":"ou"},
						{"id":84, "name":"^ GFII et ADBS", "full_name":"Référentiel pédagogique sur le web sémantique", "url": "www.zotero.org/groups/web_semantique_ressources_pedagogiques", "ext":"yes", "type":"ou"},
						{"id":85, "name":"^ GOALSCAPE", "full_name":"Référentiel de web sémantic français", "url": "goalscape.com", "ext":"yes", "type":"ou"},
						{"id":86, "name":"^ EXPLORE YOUR DATA", "full_name":"Insights @exploreyourdata", "url": "exploreyourdata.wordpress.com/", "ext":"yes", "type":"ou"},
						{"id":87, "name":"^ DATAVISUAL", "full_name":"The French Incubators Network", "url": "datavizual.com/myblog/the-french-incubators-network/", "ext":"yes", "type":"ou"},
						{"id":88, "name":"^ DELIMITED", "full_name":"Datavisualization, Consulting, Development", "url": "delimited.io", "ext":"yes", "type":"ou"},
						{"id":89, "name":"^ KEYLINES", "full_name":"KeyLines Network Visualization", "url": "keylines.com", "ext":"yes", "type":"ou"},
						{"id":90, "name":"^ VIZLIVES", "full_name":"Visualization as I see it.", "url": "vislives.com", "ext":"yes", "type":"ou"},
						{"id":91, "name":"^ VISUWORDS", "full_name":"Online graphical dictionary", "url": "visuwords.com", "ext":"yes", "type":"ou"},
						{"id":92, "name":"^ WIKIMINDMAP", "full_name":"Visual representation of RDF", "url": "github.com/alangrafu/visualRDF", "ext":"yes", "type":"ou"},
						{"id":93, "name":"^ TREEVIZ", "full_name":"A Visual Bibliography of Tree Visualization", "url": "vcg.informatik.uni-rostock.de/~hs162/treeposter/poster.html", "ext":"yes", "type":"ou"},
						{"id":94, "name":"^ LIVEPLASMA", "full_name":"Discovery Engine", "url": "www.liveplasma.com/", "ext":"yes", "type":"ou"},
						{"id":95, "name":"^ TUNEGLUE", "full_name":"Musicmap", "url": "audiomap.tuneglue.net/", "ext":"yes", "type":"ou"},
						{"id":96, "name":"^ MUSICOVERY", "full_name":"Jouez votre humeur", "url": "musicovery.com/", "ext":"yes", "type":"ou"},
						{"id":97, "name":"^ ONTOCASE", "full_name":"l'atelier de génie logiciel d'ingénierie ontologique", "url": "ontocase.com", "ext":"yes", "type":"ou"},
						{"id":98, "name":"^ VISUALISATION OF RELATEDNESS", "full_name":"Cartographie of relatedness", "url": "visualisationofrelatedness.alwaysdata.net/", "ext":"yes", "type":"ou"},
						{"id":99, "name":"^ JOLOCOM", "full_name":"Data is everywhere", "url": "jolocom.com/", "ext":"yes", "type":"ou"},
						{"id":100, "name":"^ METAMAPS", "full_name":"a home on the web for ...", "url": "metamaps.cc/", "ext":"yes", "type":"ou"},
						{"id":101, "name":"^ CONJECTO", "full_name":"Semantic for business.", "url": "conjecto.com", "ext":"yes", "type":"ou"},
						{"id":102, "name":"^ DYDRA", "full_name":"a powerful graph database in the cloud", "url": "dydra.com", "ext":"yes", "type":"ou"},
						{"id":103, "name":"^ SEMSOFT", "full_name":"Data agility", "url": "semsoft-corp.com", "ext":"yes", "type":"ou"},
						{"id":104, "name":"^ MISSION CRITICAL IT", "full_name":"offers a new way to build and run flexible...", "url": "www.missioncriticalit.com", "ext":"yes", "type":"ou"},
						{"id":105, "name":"^ BLUENOD", "full_name":"Visualize communities", "url": "bluenod.com", "ext":"yes", "type":"ou"},
						{"id":106, "name":"^ KNOWTEXT", "full_name":"Réseau pour les explorateurs des communautés", "url": "knowtext.com", "ext":"yes", "type":"ou"},
					], 
			"links":[
						{"source":0,"target":1},
						{"source":2,"target":3},
						{"source":2,"target":4},
						{"source":4,"target":5},
						{"source":4,"target":6},
						{"source":5,"target":7},
						{"source":6,"target":8},
						{"source":3,"target":10},
						{"source":10,"target":9},
						{"source":3,"target":13},
						{"source":13,"target":14},
						{"source":3,"target":12},
						{"source":3,"target":15},
						{"source":3,"target":16},
						{"source":12,"target":11},
						{"source":2,"target":17},
						{"source":2,"target":18},
						{"source":17,"target":19},
						{"source":18,"target":19},
						{"source":2,"target":20},
						{"source":2,"target":21},
						{"source":2,"target":22},
						{"source":2,"target":23},
						{"source":23,"target":24},
						{"source":23,"target":25},
						{"source":2,"target":26},
						{"source":2,"target":27},
						{"source":2,"target":28},
						{"source":3,"target":29},
						{"source":3,"target":21},
						{"source":2,"target":30},
						{"source":2,"target":31},
						{"source":2,"target":32},
						{"source":32,"target":33},
						{"source":2,"target":34},
						{"source":34,"target":35},
						{"source":34,"target":36},
						{"source":34,"target":3},
						{"source":34,"target":37},
						{"source":2,"target":37},
						{"source":3,"target":37},
						{"source":37,"target":38},
						{"source":37,"target":32},
						{"source":37,"target":12},
						{"source":34,"target":12},
						{"source":37,"target":39},
						{"source":37,"target":40},
						{"source":36,"target":3},
						{"source":2,"target":12},
						{"source":3,"target":38},
						{"source":3,"target":39},
						{"source":34,"target":41},
						{"source":41,"target":3},
						{"source":2,"target":42},
						{"source":2,"target":43},
						{"source":2,"target":44},
						{"source":2,"target":45},
						{"source":3,"target":46},
						{"source":23,"target":47},
						{"source":3,"target":48},
						{"source":3,"target":49},
						{"source":3,"target":50},
						{"source":3,"target":52},
						{"source":3,"target":53},
						{"source":50,"target":51},
						{"source":3,"target":54},
						{"source":54,"target":55},
						{"source":54,"target":56},
						{"source":54,"target":57},
						{"source":52,"target":53},
						{"source":53,"target":58},
						{"source":53,"target":59},
						{"source":53,"target":60},
						{"source":52,"target":54},
						{"source":53,"target":61},
						{"source":3,"target":59},
						{"source":52,"target":59},
						{"source":49,"target":57},
						{"source":48,"target":51},
						{"source":49,"target":62},
						{"source":3,"target":63},
						{"source":3,"target":62},
						{"source":3,"target":64},
						{"source":16,"target":64},
						{"source":3,"target":65},
						{"source":15,"target":65},
						{"source":2,"target":66},
						{"source":3,"target":67},
						{"source":2,"target":67},
						{"source":2,"target":68},
						{"source":2,"target":69},
						{"source":3,"target":70},
						{"source":3,"target":71},
						{"source":2,"target":72},
						{"source":3,"target":72},
						{"source":3,"target":73},
						{"source":3,"target":74},
						{"source":74,"target":75},
						{"source":73,"target":76},
						{"source":3,"target":76},
						{"source":2,"target":77},
						{"source":5,"target":77},
						{"source":5,"target":78},
						{"source":2,"target":79},
						{"source":29,"target":71},
						{"source":2,"target":80},
						{"source":53,"target":81},
						{"source":2,"target":82},
						{"source":3,"target":83},
						{"source":3,"target":84},
						{"source":2,"target":85},
						{"source":2,"target":86},
						{"source":2,"target":87},
						{"source":2,"target":88},
						{"source":2,"target":89},
						{"source":2,"target":90},
						{"source":2,"target":91},
						{"source":3,"target":92},
						{"source":2,"target":93},
						{"source":2,"target":94},
						{"source":2,"target":95},
						{"source":2,"target":96},
						{"source":3,"target":97},
						{"source":2,"target":98},
						{"source":3,"target":98},
						{"source":2,"target":99},
						{"source":2,"target":100},
						{"source":3,"target":101},
						{"source":3,"target":102},
						{"source":3,"target":103},
						{"source":3,"target":104},
						{"source":2,"target":105},
						{"source":2,"target":106},
					]
			   }    


var n = 100,
	node,
	link,
    nodes,
    links,
	width = window.innerWidth - 30, 
	height = window.innerHeight - 30;

var colors = d3.scale.category10();
var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;"

var node_drag = d3.behavior.drag()
	.on("dragstart", dragstart)
	.on("drag", dragmove)
	.on("dragend", dragend);

var svg = d3.select("body")
			.append("svg:svg")
			.attr("width", width)
			.attr("height", height)
			.attr("pointer-events", "all")
			.append('svg:g')
			.call(d3.behavior.zoom().on("zoom", rescale))
			.on("dblclick.zoom", null)
			.append('svg:g')

//rescale g
function rescale() {
  svg.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}

var socle = svg.append('svg:rect')
				.attr('width', width)
				.attr('height', height)
				.attr('fill', 'transparent')
				.style("cursor", "move")

var force = d3.layout.force()
				.nodes(data.nodes)
				.links(data.links)
				.size([width, height])
			    .linkDistance(120)
				.charge(-3000)

force.start();
for (var i = n * n; i > 0; --i) force.tick();
force.stop();

var link = svg.selectAll("line.link")
				.data(data.links)
				.enter().append("svg:line")
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; })
			    .attr("class", "link")
			    .style("stroke", "#DDD")
			    .style("stroke-width", 5)
	
var node = svg.selectAll("g.node")
				.data(data.nodes)
				.enter()
				.append("svg:g")
				.attr("class", "node")
				.call(node_drag);

/* ---------------------------------------------------------------- *
 * Habillage des noeuds et du text sur le noeud
 * ---------------------------------------------------------------- */

/* Cercle qui apparait sur le hover */
node.append("circle")
	.attr("cx", 0)
	.attr("cy", -5)
	.attr("r", 0)
    .attr("class", "CircleOptions")
	.style("fill", "white")
	.style("stroke", "#aaa")
	.style("fill-opacity", "0")
	.style("stroke-width", "5")

/* Option de déplacement */
node.append("circle")
	.attr("cx", -30)
	.attr("cy", -30)
	.attr("r", 0)
    .attr("class", "CircleF")
	.style("stroke", "aaa")
	.attr("fill", "white")
	.style("fill-opacity", "1")
	.style("stroke-width", "2")

node.append("svg:image")
    		.attr("class", "ImageF")
			.attr('x', -40)
			.attr('y', -40)
			.attr('width', 20)
			.attr('height', 20)
			.style("visibility", "hidden")
			.attr("xlink:href","http://fluidlog.com/img/move_64.png")
	.style("cursor", "move")

/* Option de link */
node.append("circle")
	.attr("cx", 30)
	.attr("cy", -30)
	.attr("r", 0)
    .attr("class", "CircleL")
	.style("stroke", "aaa")
	.attr("fill", "white")
	.style("fill-opacity", "1")
	.style("stroke-width", "2")

node.append("svg:image")
    		.attr("class", "ImageL")
			.attr('x', 20)
			.attr('y', -40)
			.attr('width', 20)
			.attr('height', 20)
			.style("visibility", "hidden")
			.style("cursor", "pointer")
			.attr("xlink:href","http://fluidlog.com/img/arrow_full_upperright_64.png")
			.on("click", openLink())

// Création d'un rectangle à bord arrondis à la place d'un cercle
var rect = node.append("rect")
	.attr("x", function(d) { return -(11*d.name.length / 2) })
	.attr("y", "-17")
	.attr("rx", 10) //Gère les bords arrondis
	.attr("ry", 10) //Gère les bords arrondis
	  .style("stroke", "#DDD")
	  .style("stroke-width", "4")
	.attr("width", function(d) { return 11*d.name.length })
	.attr("fill", color)
	.style("opacity", 1)
	.attr("height", "25")

node.append("title")
	.text(function(d) { return d.full_name; })

node.append("text")
	.attr("text-anchor", "middle")
	.style("font-size", "14")
	.style("fill", "white")
	.style("font-family", "Courier New")
	.style("pointer-events", function(d)
		{
			if (d.type == "quoi") 
				return "none";
		}
	)
	.text(function(d) { return d.name })

/* ---------------------------------------------------------------- *
 * Gestion du hover
 * ---------------------------------------------------------------- */

node.on("mouseover", function (d) 
	{
		d3.select(this).select('rect')
						.style("opacity", fade(.2,"#aaa"))
		
		d3.select(this).select('.CircleOptions')
						.transition()
						.duration(300)
						.attr("r", 40)

		d3.select(this).select('.CircleF')
						.transition()
						.duration(300)
						.attr("r", 10)

		d3.select(this).select('.ImageF')
						.transition()
						.duration(300)
						.style("visibility", "visible")

		if (d.url != "")
		{
			d3.select(this).select('.ImageL')
							.transition()
							.duration(300)
							.style("visibility", "visible")

			d3.select(this).select('.CircleL')
							.transition()
							.duration(300)
							.attr("r", 10)
		}
	}
);
	 
node.on("mouseout", function (d) 
	{
		d3.select(this).select('rect')
						.style("opacity", fade(1,"#DDD"))

		d3.select(this).select('.CircleOptions')
						.transition()
						.duration(300)
						.attr("r", 0)

		d3.select(this).select('.CircleF')
						.transition()
						.duration(300)
						.attr("r", 0)

		d3.select(this).select('.ImageF')
						.transition()
						.duration(300)
						.style("visibility", "hidden")

		if (d.url != "")
		{
			d3.select(this).select('.ImageL')
							.transition()
							.duration(300)
							.style("visibility", "hidden")

			d3.select(this).select('.CircleL')
							.transition()
							.duration(300)
							.attr("r", 0)
		}
	}
);

force.on("tick", tick);

resize();
d3.select(window).on("resize", resize);

function resize() {
    width = window.innerWidth; 
    height = window.innerHeight;
    svg.attr("width", width).attr("height", height);
    socle.attr('width', width).attr('height', height)

    force.size([width, height]).resume();
}

var linkedByIndex = {};
data.links.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}

function fade(opacity,color) 
{
    return function(d) 
    {
		rect.style("opacity", function(o) 
				{
					return isConnected(d, o) ? 1 : opacity;
				})
		
		.style("stroke", function(o) 
				{
					return isConnected(d, o) ? color : "#DDD";
				});

		link.style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;
        })
        
        .style("stroke", function(o) {
            return o.source === d || o.target === d ? color : color ;
        });
    }
}

function dragstart(d, i) 
{
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
					.select(".nodecircle").style("stroke", "#999");
	tick();
	force.resume();
}

function openLink() 
{
	return function(d) 
	{
		if(d.type != "quoi") 
			if(d.ext == "yes") 
				window.open("//"+d.url)
			else
				window.open("//"+d.url,"_self")
	}
}

function color(d) 
{
	switch (d.type)
	{
		case "qui" : 
			return "orange";
		break
		case "quoi" : 
			return "#A00";
		break
		case "ou" : 
			return "#00A";
		break
		case "comment" : 
			return "#0A0";
		break
	}
}

function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}
