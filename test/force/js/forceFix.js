var data = {
		  "nodes": [
		            {"id":"0", "x": 469, "y": 410, "title":"Assemblée Virtuelle", "description":"description de l'AV", "url": "assemblee-virtuelle.org/", "type":"qui"},
		            {"id":"1", "x": 493, "y": 364, "title":"Stample", "description":"description de stample", "url": "stample.co", "type":"qui"},
		            {"id":"2", "x": 442, "y": 365, "title":"Web sémantique", "description":"description du Web sémantique", "url": "fr.wikipedia.org/wiki/Web_s%C3%A9mantique", "type":"ou"},
		            {"id":"3", "x": 467, "y": 314, "title":"Outils", "description":"description de Outils", "url": "", "type":"quoi"},
		            {"id":"4", "x": 477, "y": 248, "title":"Cartographie sémantique", "description":"description de Cartographie sémantique", "url": "lesontologiesgraphiques.wordpress.com/", "type":"comment"},
		          ],
		          "links": [
		            {"source":  0, "target":  1},
		            {"source":  1, "target":  2},
		            {"source":  2, "target":  0},
		            {"source":  1, "target":  3},
		            {"source":  3, "target":  2},
		            {"source":  3, "target":  4},
		          ]
		        }    


var width = 960,
    height = 500;

var vis = d3.select("body")
				.append("svg:svg")
				.attr("width", width)
				.attr("height", height)
				.attr("pointer-events", "all")
				.append('svg:g')

	vis.append('svg:rect')
		.attr('width', width)
		.attr('height', height)
		.attr('fill', 'white')
		//On place le pan+zoom sur le rectangle blanc !
		.call(d3.behavior.zoom().on("zoom", rescale))
		.on("dblclick.zoom", null)

  //rescale g
  function rescale() {
    trans=d3.event.translate;
    scale=d3.event.scale;

   vis.attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");
  }

var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(40)
    .on("tick", tick);

var drag = force.drag()
    .on("dragstart", dragstart);

var link = vis.selectAll("line.link"),
    node = vis.selectAll("g.node");

  force
      .nodes(data.nodes)
      .links(data.links)
      .start();

  link = link.data(data.links)
    .enter().append("svg:line")
      .attr("class", "link");

  node = node.data(data.nodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("r", 12)
      .on("dblclick", dblclick)
      .call(drag);

  
  /* ---------------------------------------------------------------- *
   * Les fonctions 
   * ---------------------------------------------------------------- */
  
function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}