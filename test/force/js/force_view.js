//http://bl.ocks.org/benzguo/4370043
var width = 960,
    height = 500,
    fill = d3.scale.category20();
var n = 100;

//Permet de tester la partie JS sans faire appel au triplestore
dataset = {
nodes:[
       {iri_id:0, label: "project", type:"project" },
       {iri_id:1, label: "actor", type:"actor" },
       {iri_id:2, label: "idea", type:"idea" },
       {iri_id:3, label: "ressource", type:"ressource" },
      ],
edges:[
       {source:0, target:1},
       {source:0, target:2},
       {source:0, target:3},
       {source:1, target:2},
       {source:1, target:3},
      ],
};

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

// init svg
var outer = d3.select("#chart")
  .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all");

var vis = outer
  .append('svg:g')
    .call(d3.behavior.zoom().on("zoom", rescale))
    .on("dblclick.zoom", null)
  .append('svg:g')
    .on("mousemove", mousemove)
    .on("mousedown", mousedown)
    .on("mouseup", mouseup);

vis.append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white');

// init force layout
var force = d3.layout.force()
    .size([width, height])
	.nodes(dataset.nodes)
	.links(dataset.edges)
    .linkDistance(50)
    .charge(-200)

force.start();
for (var i = n * n; i > 0; --i) force.tick();
force.stop();

// line displayed when dragging new nodes
var drag_line = vis.append("line")
    .attr("class", "drag_line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0);

// get layout properties
var nodes = force.nodes(),
	links = force.links(),
	node = vis.selectAll(".node"),
    link = vis.selectAll(".link");

// add keyboard callback
d3.select(window)
    .on("keydown", keydown);

redraw();

// redraw force layout
function redraw() {

  link = link.data(links, function(d) { return d.source.iri_id + "-" + d.target.iri_id; });
  link.enter()
  		.insert("line", ".node")
      .attr("class", "link")
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; })
      .on("mousedown", 
        function(d) { 
          mousedown_link = d; 
          if (mousedown_link == selected_link) selected_link = null;
          else selected_link = mousedown_link; 
          selected_node = null; 
          redraw(); 
        })

  link.exit().remove();

  link
    .classed("link_selected", function(d) { return d === selected_link; });

	//On valorise ici le paramètre "key" de la fonction data
	//pour ne pas décaler les id des noeuds lors de la suppression
  	node = node.data(nodes, function(d) { return d.iri_id;});
	node_enter_g = node.enter()
				.append("g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	
	node_enter_g.append("circle")
        	.attr("class", "node_circle")
	  		.attr("r", 10)
	
	node_enter_g.append("text")
			.attr("x", 12)
			.text(function(d, i) { 
			  return d.label+" "+nodes[i].iri_id; 
			  })
			        
  node.select(".node_circle").classed("node_selected", function(d) { return d === selected_node; });

	node.on("mousedown", 
        function(d) { 
          // disable zoom
          vis.call(d3.behavior.zoom().on("zoom"), null);

          mousedown_node = d;
          if (mousedown_node == selected_node) selected_node = null;
          else selected_node = mousedown_node; 
          selected_link = null; 

          // reposition drag line
          drag_line
              .attr("class", "link")
              .attr("x1", mousedown_node.x)
              .attr("y1", mousedown_node.y)
              .attr("x2", mousedown_node.x)
              .attr("y2", mousedown_node.y);

          redraw(); 
        })
      .on("mousedrag",
        function(d) {
          // redraw();
        })
      .on("mouseup", 
        function(d) { 
          if (mousedown_node) {
            mouseup_node = d; 
            if (mouseup_node == mousedown_node) { resetMouseVars(); return; }

            // add link
            var link = {source: mousedown_node, target: mouseup_node};
            links.push(link);

            // select new link
            selected_link = link;
            selected_node = null;

            // enable zoom
            vis.call(d3.behavior.zoom().on("zoom"), rescale);
            redraw();
          } 
        })
    .transition()
      .duration(750)
      .ease("elastic")
      .attr("r", 6.5);

  node.exit().transition()
      .attr("r", 0)
    .remove();

  if (d3.event) {
    // prevent browser's default behavior
    d3.event.preventDefault();
  }

	force.on("tick", tick);

}

function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}

// rescale g
function rescale() {
  trans=d3.event.translate;
  scale=d3.event.scale;

  vis.attr("transform",
      "translate(" + trans + ")"
      + " scale(" + scale + ")");
}

function mousedown() {
	  if (!mousedown_node && !mousedown_link) {
	    // allow panning if nothing is selected
	    vis.call(d3.behavior.zoom().on("zoom"), rescale);
	    return;
	  }
	}

	function mousemove() {
	  if (!mousedown_node) return;

	  // update drag line
	  drag_line
	      .attr("x1", mousedown_node.x)
	      .attr("y1", mousedown_node.y)
	      .attr("x2", d3.svg.mouse(this)[0])
	      .attr("y2", d3.svg.mouse(this)[1]);

	}

	function mouseup() {
	  if (mousedown_node) {
	    // hide drag line
	    drag_line
	      .attr("class", "drag_line_hidden")

	    if (!mouseup_node) {
	      // add node
	      var point = d3.mouse(this),
	        node = {x: point[0], y: point[1]};
	      
	      nodes.push(node);

	      // select new node
	      selected_node = node;
	      selected_link = null;
	      
	      // add link to mousedown node
	      links.push({source: mousedown_node, target: node});
	    }

	    redraw();
	  }
	  // clear mouse event vars
	  resetMouseVars();
	}

	function resetMouseVars() {
	  mousedown_node = null;
	  mouseup_node = null;
	  mousedown_link = null;
	}

function spliceLinksForNode(node) {
  toSplice = links.filter(
    function(l) { 
      return (l.source === node) || (l.target === node); });
  toSplice.map(
    function(l) {
      links.splice(links.indexOf(l), 1); });
}

function keydown() {
  if (!selected_node && !selected_link) return;
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: { // delete
      if (selected_node) {
        nodes.splice(nodes.indexOf(selected_node), 1);
        spliceLinksForNode(selected_node);
      }
      else if (selected_link) {
        links.splice(links.indexOf(selected_link), 1);
      }
      selected_link = null;
      selected_node = null;
      redraw();
      break;
    }
  }
}
