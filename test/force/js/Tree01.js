//Réalisé à partir de l'exemple : http://bl.ocks.org/mbostock/2949981

var data = "source,target\n"+
			"A1,A2\n"+
			"A2,A3\n"+
			"A2,A4\n";

var svg = d3.select("body")
			.append("svg")
			.attr("width", 500)
			.attr("height", 500)
			.append("g")
			.attr("transform", "translate(50,50)");

var tree = d3.layout.tree()
				.size([400, 400]);

var links = d3.csv.parse(data);

//d3.csv("graph.csv", function(links) {
  var nodesByName = {};

  // Create nodes for each unique source and target.
  links.forEach(function(link) {
    var parent = link.source = nodeByName(link.source),
        child = link.target = nodeByName(link.target);
    if (parent.children) parent.children.push(child);
    else parent.children = [child];
  });

  // Extract the root node and compute the layout.
  var nodes = tree.nodes(links[0].source);

  var diagonal = d3.svg.diagonal()
				.projection(function(d) { return [d.y, d.x]; });

  // Create the link lines.
  var link = svg.selectAll(".link")
      .data(links)
    .enter()
    .append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  // Create the node circles.
	node = svg.selectAll(".node")
			.data(nodes)
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	node.append("circle")
      .attr("r", 7)

  node.append("text")
		.text(function(d) { return d.name })

  function nodeByName(name) 
  {
    var toto = nodesByName[name] || (nodesByName[name] = {name: name});
	return toto;
  }
//});