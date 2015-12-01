var div = d3.select("#force111");

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
var width = 900,height = 500
var FontFamily = "14px 'Helvetica Neue'"
var FontFamily_hover = "22px 'Helvetica Neue'"

var force = d3.layout.force()
	.nodes(data.nodes)
	.links(data.links)
	.size([width, height])
	.linkDistance(200)
	.charge([-500])
	.start();		

var vis = d3.select("#chart")
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

var fo = node.append('svg:foreignObject')
			    .attr("id", "fo")
			    .attr("width", 2 * rayon)
			    .attr("height", 2 * rayon)
    
fo.append("xhtml:body")
	.style("text-align","center")
//styling foreignobject doesn't seam to work fine...
//	.style("stroke", "#A00")
//  .style("stroke-width", 2)
	.append("div")
    .attr("class", "fotext")
	.style("margin", "0px auto")
	.style("font", FontFamily)
	.style("border","1px dotted #A00")
	.style("overflow","auto")
	.html(function(d) { return d.title })

fo.attr("transform", function(d) { return translateInMiddle(this)} )

node.on("mouseover", function (d) {
	d3.select(this).select('circle')
					.transition()
					.duration(300)
					.attr("r", rayon_hover)

	d3.select(this).select('#fo')
// Attention, pas de transition ni duration avec les foreignObject !
//					.transition()
//					.duration(300)
				    .attr("width", 2*rayon_hover)
				    .attr("height", 2*rayon_hover)
				    .attr("transform", function(d) { return translateInMiddle(this)})

	d3.select(this).select('.fotext')
					.style("font", FontFamily_hover)

});
 
node.on("mouseout", function (d) {
	d3.select(this).select('circle')
					.transition()
					.duration(300)
					.attr("r", rayon)

	d3.select(this).select('#fo')
				    .attr("width", 2*rayon)
				    .attr("height", 2*rayon)
					.attr("transform", function(d) { return translateInMiddle(this)})
	
	d3.select(this).select('.fotext')
					.style("font", FontFamily)
});

function translateInMiddle(object) 
{ 
	bbox = object.getBBox();
	return "translate(" + [ -bbox.width/2, -bbox.height/8 ] + ")";
}
