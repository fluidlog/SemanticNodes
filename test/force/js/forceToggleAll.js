var data = {
"name": "Fluidlog",
"rayon" : "50",
"children": 
	[{
		"name": "Démos",
		"rayon" : "40",
		"children": 
		[{
			"name": "Statiques",
			"rayon" : "30",
		},
		{
			"name": "Dynamiques",
			"rayon" : "30",
		}]
	},
	]
};


var w = 960,
    h = 500,
    node,
    link,
    root, 
    t;

var force = d3.layout.force()
    .on("tick", tick)
    .size([w, h]);

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

  update();

 function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }
    // Initialize the display to show a few nodes.
 data.children.forEach(toggleAll);


update(); 


function update() {
  var nodes = flatten(data),
      links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
        .charge(-1000)
    .linkDistance(100)
    .friction(0.5)
      .start();

  // Update the links…
  link = vis.selectAll("line.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links.
  link.enter().insert("svg:line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  // Exit any old links.
  link.exit().remove();

  // Update the nodes…
  node = vis.selectAll("circle.node")
      .data(nodes, function(d) { return d.id; })
      .style("fill", color);

  // Enter any new nodes.
  node.enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r",  "15")
      .style("fill", color)
      .on("click", click)     
      .call(force.drag);

  // Exit any old nodes.
  node.exit().remove();

  t = vis.selectAll(".t-node")
      .data(nodes, function(d) { return d.id; })
      .style("fill", color);

  // Enter any new nodes.
  t.enter().append("svg:text")
      .attr("class", "t-node")
      .attr("dx", "25px")
      .attr("y", 0)
      .text(function(d) { return d.name; });
     // .call(force.drag);

  // Exit any old nodes.
  t.exit().remove();

}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  t.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; }); 
//  t.attr("transform", function(d) {
 //       return "translate(" + d.x + "," + d.y + ")"; } ) 

}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update();
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}