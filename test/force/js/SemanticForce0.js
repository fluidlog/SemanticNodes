//var dataset = [{}];
var dataset = {
        nodes: [
                { name: "Adam" },
                { name: "Bob" },
                { name: "Carrie" },
                { name: "Donovan" },
                { name: "Edward" },
                { name: "Felicity" },
                { name: "George" },
                { name: "Hannah" },
                { name: "Iris" },
                { name: "Jerry" }
        ],
        edges: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
                { source: 0, target: 4 },
                { source: 1, target: 5 },
                { source: 2, target: 5 },
                { source: 2, target: 5 },
                { source: 3, target: 4 },
                { source: 5, target: 8 },
                { source: 5, target: 9 },
                { source: 6, target: 7 },
                { source: 7, target: 8 },
                { source: 8, target: 9 }
        ]
};

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

svg.append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white');

// init force layout
var force = d3.layout.force()
    .size([width, height])
    .nodes(dataset.nodes) // initialize with a single node
    .links(dataset.edges)
    .linkDistance(50)
    .charge(-200)
    .on("tick", tick)
    .start();

	var links = svg.selectAll(".link");
	links = links.data(dataset.edges);
	links.enter()
  		.insert("line", ".node")
  		.attr("class", "link")

	var nodes = svg.selectAll(".node");
	nodes = nodes.data(dataset.nodes);
	nodes.enter()
        .append("g")
  		.append("circle")
  		.attr("class", "node")
  		.attr("r", 5)

  	nodes.append("text")
  		.attr("x", 12)
  		.attr("dy", ".35em")
  		.attr("dx", ".50em")
  		.text(function(d) { return d.name; });

  function tick() {
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
