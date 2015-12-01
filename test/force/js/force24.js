//Force24.js - [[D3ForceTEst24]] Graph without force - dblclick to add nodes - drag

var d3data = {
        nodes: [
                { name: "dblclick on surface", x:200,y:200 },
                { name: "to add new node", x:300,y:300 },
        ],
        links: [
                { source: 0, target: 1 },
        ]
};

var svgNodes = [],
    svgLinks = [];

var svg = d3.select("body")
			.append("svg")
			.attr("width", 500)
			.attr("height", 500)
			.append('g')
      .on("dblclick", addNode)
      .append('g')
      .attr('id', "bg") //background

var rect = svg.append('svg:rect')
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', 500)
              .attr('height', 500)
              .attr('fill', "#eee")

var force = d3.layout.force()
          .nodes(d3data.nodes)
          .links(d3data.links)
          .size([500, 500])
          .linkDistance(100)
          .charge(-1000)
          .on("tick", movexy)
          .start()

drawGraph();

function drawGraph()
{
  //without force, links don't have objects of nodes into...
  svgNodes = d3.select("#bg")
                .selectAll("#node")
                .data(d3data.nodes)

  var svgNodesEnter = svgNodes.enter()
        				.append("g")
        				.attr("id", "node")
                .call(
                      d3.behavior.drag()
                          .on("dragstart", dragstart)
                          .on("drag", dragmove)
                          .on("dragend", dragend)
                      )

  svgNodesEnter.append("circle")
        			  .attr("class", "nodecircle")
        			  .style("fill", "red" )
        			  .style("opacity", 1)
        			  .style("stroke", "#DDD")
        			  .style("stroke-width", "7")
        			  .attr("r", "20")

  svgNodesEnter.append("text")
          			.attr("text-anchor", "middle")
          			.attr("dy", ".25em")
          			.style("font-size", "20px")
          			.style("pointer-events", "none")
          			.text(function(d) { return d.name; })

  // Without force :
  // once you have object nodes, you can create d3data.links without force.links function

  // When we add a new node, we don't have to valorise d3data.links.
  if (typeof(d3data.links[0].source) == "number")
  {
    d3data.links.forEach(function(link)
            {
              link.source = d3data.nodes[link.source];
              link.target = d3data.nodes[link.target];
            });
  }

  svgLinks = d3.select("#bg")
                .selectAll("#link")
                .data(d3data.links)

  var svgLinksEnter = svgLinks.enter()
                .insert("line", "#node")
          		  .attr("x1", function(d) { return d.source.x; })
          		  .attr("y1", function(d) { return d.source.y; })
          		  .attr("x2", function(d) { return d.target.x; })
          		  .attr("y2", function(d) { return d.target.y; })
          			.attr("id", "link")
          			.attr("stroke", "#DDD")
          			.attr("stroke-width", 5)

  movexy()
}

function addNode(newnode)
{
   console.log("addnode start");

   var xy = d3.mouse(this);
   d3data.nodes.push({name: "new",
                      // index:d3data.nodes.length,
                      // weight:1,
                      px:xy[0], py:xy[1],
                      x:xy[0], y:xy[1] });

   drawGraph();

   console.log("nodes", d3data.nodes);
   console.log("addnode end");
}

function dragstart(d, i) {
  console.log("start of drag");
	d3.event.sourceEvent.stopPropagation();
}

function dragmove(d, i) {
  d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy;

  movexy();
}

function dragend(d, i) {
  console.log("end of drag");
  // force.start()
}

function movexy() {
  svgLinks.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  svgNodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}
