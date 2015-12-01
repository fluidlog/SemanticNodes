// Text fit to circles
var data = {"nodes":[
						{"id":"0", "title":"Assemblée Virtuelle", "description":"description de l'AV", "url": "assemblee-virtuelle.org/", "type":"qui"},
						{"id":"1", "title":"Stample", "description":"description de stample", "url": "stample.co", "type":"qui"},
						{"id":"2", "title":"Web sémantique", "description":"description du Web sémantique", "url": "fr.wikipedia.org/wiki/Web_s%C3%A9mantique", "type":"ou"},
						{"id":"3", "title":"Outils", "description":"description de Outils", "url": "", "type":"quoi"},
						{"id":"4", "title":"Cartographie sémantique", "description":"description de Cartographie sémantique", "url": "lesontologiesgraphiques.wordpress.com/", "type":"comment"},											
					], 
			"links":[
						{"source":0,"target":1},
						{"source":0,"target":2},
						{"source":0,"target":3},
						{"source":0,"target":4},
						]
			   }    

/* ---------------------------------------------------------------- *
 * Déclaration de la carto, des forces, des liens et des noeuds
 * ---------------------------------------------------------------- */

var rayon = 50, rayon_hover = 100;
var width = 1200,height = 800
var FontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif;"

var force = d3.layout.force()
	.nodes(data.nodes)
	.links(data.links)
	.size([width, height])
	.linkDistance(200)
	.charge([-500])
	.start();		

var vis = d3.select("body")
	.append("svg:svg")
	.attr("width", width)
	.attr("height", height)
	.append('svg:g')


var link = vis.selectAll("line.link").data(data.links)

var node = vis.selectAll("g.node")
				.data(data.nodes)
				.enter().append("svg:g")
				.attr("class", "node")

force.on("tick", function() 
		{
		  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		}
);


node.append("circle")
	.attr("r", rayon)
	.attr("fill", "#eee")
    .style("stroke", "#aaa")
    .style("stroke-width", 2)
	.style("cursor", "text")
	.style("opacity", 1)

node
    .append("text")
	.attr("text-anchor", "middle")
	.style("font-size", "24px")
	//On empêche de déclencher le hover sur le text
	.style("pointer-events", "none")
	.style("font-family", FontFamily)
	.style("fill", "black")
	.text(function(d) { return d.title })
    .style("font-size", function(d) { return getTextSize(this, rayon) })
    //Recentre un peu vers le bas
    .attr("dy", ".35em")

node.on("mouseover", function () {
	d3.select(this).select('circle')
					.transition()
					.duration(300)
					.attr("r", rayon_hover)

	d3.select(this).select('text')
					.transition()
					.duration(300)
				    .style("font-size", function(d) { return getTextSize(this, rayon) })
				    
});
 
node.on("mouseout", function () {
	d3.select(this).select('circle')
					.transition()
					.duration(300)
					.attr("r", rayon)

	d3.select(this).select('text')
					.transition()
					.duration(300)
				    .style("font-size", function(d) { return getTextSize(this, rayon) })

});

function getTextSize(object,r) 
{
	var textlength = object.getComputedTextLength();
	var fontsize = Math.min(2 * r, (2 * r - 8) / textlength * 24) + "px";
	return fontsize ; 
}

