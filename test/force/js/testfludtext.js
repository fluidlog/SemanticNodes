	var color_type = {"project" : "#89A5E5", "actor" : "#F285B9", "idea" : "#FFD98D", "ressource" : "#CDF989", "without" : "white"};
	var color_type_rgba = {"project" : "137,165,229", "actor" : "242,133,185", "idea" : "255,217,141", "ressource" : "205,249,137", "without" : "white"};
	var image_type = {"project" : "lab", "actor" : "user", "idea" : "idea", "ressource" : "tree", "without" : "circle thin"};

	var width_closed_flud = 150,
	height_closed_flud = 80,
	arrondi = 50;

	var dataset = {
        nodes: [
                { label: "Adam tralalalallalalalalal", type:"project" },
                { label: "Bob", type:"actor" },
                { label: "Carrie", type:"idea" },
                { label: "Joe", type:"ressource" },
        ],
        links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
        ]
};

var w = 500,
    h = 500

var svg = d3.select("#chart")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

var colors = d3.scale.category10();

var force = d3.layout.force()
                     .nodes(dataset.nodes)
                     .links(dataset.links)
                     .size([w, h])
                     .linkDistance(100)
                     .charge([-1000])
                     .on("tick", tick)
                     .start();

var links = svg.selectAll(".link")
        .data(dataset.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "#aaa")
        .style("stroke-width", 8)
		.style("opacity", "0.8");

var nodes = svg.selectAll(".node")
        .data(dataset.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(force.drag);

// Création d'un rectangle à bord arrondis à la place d'un cercle
nodes.append("rect")
	.attr("x", function(d) {return -(15*d.label.length / 2);})
	.attr("y", "-20")
	.attr("rx", 10)
	.attr("ry", 10)
	.attr("width", function(d) {return 15*d.label.length})
	.attr("height", 30)
	.style("stroke", "#aaa")
	.style("stroke-width", "5")
	.style("opacity", "0.8");

// text sur le noeud principal
var fo_text_node = nodes
				.append("foreignObject")
				.attr("id","fo_closed_flud")
				.attr("x",-width_closed_flud/2)
				.attr("y",-13)
			    .attr("width", width_closed_flud)
			    .attr("height", height_closed_flud)
				.attr("style", "background-color:rgba(130,130,130,.5);")

//fo xhtml
var fo_xhtml_text_node = fo_text_node
	.append('xhtml:div')
    .attr("class", "fo_xhtml")
 
////div permettant un contenu centré verticalement
//var fo_div_text_node = fo_xhtml_text_node
//	.append('xhtml:div')
//    .attr("class", "fo_div_centered")

//paragraph
var p_text_node = fo_xhtml_text_node
	.append("p")
    .attr("class", "fo_p_node")
	.attr("style", function(d){
			var style_p =	"background-color:rgba("+color_type_rgba[d.type]+",.5);"
							+ "border: 2px solid rgba("+color_type_rgba[d.type]+",.5);";
			return style_p
	})
	.text(function(d, i) { return d.label; })

function tick() 
{

	links.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	nodes.attr("cx", function(d) { return d.x; })
	     .attr("cy", function(d) { return d.y; });

//	fo_xhtml.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}



