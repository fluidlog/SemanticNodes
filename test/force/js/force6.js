var data = {"nodes":[
						{"name":"fluidlog", "full_name":"Les ontologies graphiques fluides !", "url": "", "type":"quoi"},
						{"name":"Démo statique", "full_name":"technos, acteurs, projets", "url": "fluidlog.com/lesfaitsdesmots/CartographieSemantique/index.html", "type":"ou"},
						{"name":"Contact", "full_name":"@fluidlog", "url": "twitter.com/fluidlog", "type":"qui"},
						{"name":"Wiki", "full_name":"Wiki (privé)", "url": "fluidlog.cloud.xwiki.com", "type":"comment"},
						{"name":"Blog", "full_name":"Les ontologies graphiques (privé)", "url": "lesontologiesgraphiques.wordpress.com/", "type":"comment"}												
					], 
			"links":[
						{"source":0,"target":1,"value":1},
						{"source":0,"target":2,"value":1},
						{"source":0,"target":3,"value":1},
						{"source":0,"target":4,"value":1}
						]
			   }    
		

/* ---------------------------------------------------------------- *
 * Déclaration de la carto, des forces, des liens et des noeuds
 * ---------------------------------------------------------------- */

var w = 800,
	h = 800
	
var vis = d3.select("body").append("svg:svg")
	.attr("width", w)
	.attr("height", h);
			
var force = self.force = d3.layout.force()
	.nodes(data.nodes)
	.links(data.links)
	.size([w, h])
	.linkDistance(100)
	.linkStrength(0.1)
	.friction(0.8)
	.gravity(0.05)
	.theta(0.1)
	.charge([-400])
	.start();		

var link = vis.selectAll("line.link")
	.data(data.links)
	.enter().append("svg:line")
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; })
    .attr("class", "link")
    .style("stroke", "#aaa")
    .style("stroke-width", 5)
	.style("opacity", "0.7")
	.attr("marker-end", function(d) {
										if (d.value == 1) {return "url(#arrowhead)"}
										else    { return " " }
									;});
	
var node = vis.selectAll("g.node")
				.data(data.nodes)
				.enter().append("svg:g")
				.attr("class", "node")
				.call(force.drag);

	
/* ---------------------------------------------------------------- *
 * Habillage des noeuds et du text sur le noeud
 * ---------------------------------------------------------------- */

// Création d'un rectangle à bord arrondis à la place d'un cercle
node.append("rect")
	.attr("x", function(d) {return -(15*d.name.length / 2);})
	.attr("y", "-20")
	.attr("rx", 10)
	.attr("ry", 10)
	.attr("width", function(d) {return 15*d.name.length})
	.attr("height", 30)
	.attr("fill", function(d)
			{
				if (d.type == "qui") 
					return "#FF0"; 
				else if (d.type == "quoi")
					return "#A00"
				else if (d.type == "ou")
					return "#00A"
				else if (d.type == "comment")
					return "#0A0"
			})
	.style("opacity", 0.7)
	.on("click", openLink());

node.append("text")
	.attr("text-anchor", "middle")
	.style("font-size","18px")
	.style("fill", function(d)
			{
		if (d.type == "qui") 
			return "black"; 
		else if (d.type == "quoi")
			return "white";
		else if (d.type == "ou")
			return "white";
		else if (d.type == "comment")
			return "white";
	})
	.style("font-family", "Courier New")
	.style("cursor", function(d)
			{
		if (d.type == "qui") 
			return "pointer"; 
		else if (d.type == "quoi")
			return "move";
		else if (d.type == "ou")
			return "pointer";
		else if (d.type == "comment")
			return "not-allowed";
	})
	.text(function(d) { return d.name })
	.on("click", openLink());

/* ---------------------------------------------------------------- *
 * Gestion du hover
 * ---------------------------------------------------------------- */

node.on("mouseover", function (d) {
	d3.select(this).select('rect')
					.transition()
					.duration(300)
					.attr("x", function(d) {return -(9*d.full_name.length / 2);})
					.attr("width", function(d) {return 9*d.full_name.length})
					.style("opacity", 1)

	d3.select(this).select('text')
					.transition()
					.duration(300)
					.text(function(d){return d.full_name;})
					.style("font-size","14px");
});
 
node.on("mouseout", function (d) {
	d3.select(this).select('rect')
					.transition()
					.duration(300)
					.attr("x", function(d) {return -(15*d.name.length / 2);})
					.attr("width", function(d) {return 15*d.name.length})
					.style("opacity", 0.7)

	d3.select(this).select('text')
					.transition()
					.duration(300)
					.text(function(d){return d.name;})
					.style("font-size","18px");
});

/* ---------------------------------------------------------------- *
 * Les fonctions 
 * ---------------------------------------------------------------- */
function openLink() 
{
	return function(d) 
	{
		var url = "";
		if(d.url != "") 
		{
			url = d.url
		}
		window.open("//"+url)
	}
}

force.on("tick", function() {
  link.attr("x1", function(d) { return d.source.x; })
	  .attr("y1", function(d) { return d.source.y; })
	  .attr("x2", function(d) { return d.target.x; })
	  .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});
