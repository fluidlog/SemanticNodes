var dataset = [{}];

//mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

var newnode = null; //mémorise lorsqu'il faut ajouter un noeud

var width = 600,
    height = 300,
    fill = d3.scale.category20();

// init svg
var outer = d3.select("#chart")
  .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all");

var svg = outer
  .append('svg:g')
    .call(d3.behavior.zoom().on("zoom", rescale))
    .on("dblclick.zoom", null)
    .append('svg:g')
    .on("mousemove", mousemove)
    .on("mousedown", mousedown)
    .on("mouseup", mouseup);

svg.append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white');

// init force layout
var force = d3.layout.force()
    .size([width, height])
    .nodes(dataset) // initialize with a single node
//    .links(dataset)
    .linkDistance(50)
    .charge(-200)
    .on("tick", tick)

// line displayed when dragging new nodes
var drag_line = svg.append("line")
    .attr("class", "drag_line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0);

var forcenodes = force.nodes();
var forcelinks = force.links();

var links = svg.selectAll(".link");
var nodes = svg.selectAll(".node");

newnode = dataset;

redraw();

// redraw force layout
function redraw() 
{
	links = links.data(forcelinks);
	links.enter()
  		.insert("line", ".node")
  		.attr("class", "link")

  	links.exit().remove();

	nodes = nodes.data(forcenodes);
	nodes_enter_g = nodes.enter()
			.append("g")
        	.attr("class", "node")
	
	nodes_enter_g.append("circle")
	  		.attr("r", 6.5)

	nodes_enter_g.append("text")
			.attr("x", 12)
			.attr("dy", ".35em")
			.attr("dx", ".50em")
			.text(function(d, i) { 
			  return i; 
			  })	  		

    nodes.on("mousedown", 
        function(d) { 
          // disable zoom
          svg.call(d3.behavior.zoom().on("zoom"), null);

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
        function(d) { //lorsqu'on lache la souris au dessus d'un noeud
          if (mousedown_node) {
            mouseup_node = d; 
            if (mouseup_node == mousedown_node) { resetMouseVars(); return; }

            // add link
            var link = {source: mousedown_node, target: mouseup_node};
            forcelinks.push(link);

            // select new link
            selected_link = link;
            selected_node = null;

            // enable zoom
            svg.call(d3.behavior.zoom().on("zoom"), rescale);
            redraw();
          } 
        })

//    if (newnode) //Ne créer un cercle que si on ne click plus sur le noeud.
//    {
//		nodes
//			.append("circle")
//	  		.attr("r", 6.5);
//	
//		nodes
//			.append("text")
//	  		.attr("x", 12)
//	  		.attr("dy", ".35em")
//	  		.attr("dx", ".50em")
//			  .text(function(d, i) { 
//				  return i; 
//				  });
//		
//		newnode=null;
//    }
	
	nodes.exit().remove(); // Supprime le <g> en trop par rapport au contenu du dataset

	  if (d3.event) 
	  {
	    // prevent browser's default behavior
	    d3.event.preventDefault();
	  }

	  force.start();

}

function tick() 
{
	links.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	nodes.attr("cx", function(d) { return d.x; })
	     .attr("cy", function(d) { return d.y; });
}

// rescale g
function rescale() {
  trans=d3.event.translate;
  scale=d3.event.scale;

  svg.attr("transform",
      "translate(" + trans + ")"
      + " scale(" + scale + ")");
}

function mousedown() 
{
  if (!mousedown_node && !mousedown_link) {
    // allow panning if nothing is selected
    svg.call(d3.behavior.zoom().on("zoom"), rescale);
    return;
  }
}

function mousemove() 
{
  if (!mousedown_node) return;

  // update drag line
  drag_line
      .attr("x1", mousedown_node.x)
      .attr("y1", mousedown_node.y)
      .attr("x2", d3.svg.mouse(this)[0])
      .attr("y2", d3.svg.mouse(this)[1]);
}

function mouseup() 
{
  if (mousedown_node) 
  {
    // hide drag line
    drag_line
      .attr("class", "drag_line_hidden")

    if (!mouseup_node) 
    {
      // add node
      var point = d3.mouse(this),
        node = {x: point[0], y: point[1]},
        n = forcenodes.push(node);

      // select new node
      selected_node = node;
      selected_link = null;
      newnode=node;
      
      // add link to mousedown node
      forcelinks.push({source: mousedown_node, target: node});
    }

    redraw();
  }
  // clear mouse event vars
  resetMouseVars();
}

function resetMouseVars() 
{
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}

