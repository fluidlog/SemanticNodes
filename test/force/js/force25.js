//Force24.js - [[D3ForceTEst24]] Graph without force - dblclick to add nodes - drag

uriBase = "http://fluidlog.com/";

var d3data = {
        nodes: [
                { name: "dblclick on surface", x:200, y:200, nodeid:uriBase+1 },
                { name: "to add new node", x:300, y:300, nodeid:uriBase+2 },
        ],
        edges: [
                { source: 0, target: 1 },
        ]
};

var svgNodesEnter = [],
    svgLinksEnter = [];

//mouse event vars
var selected_node = null,
    selected_link = null,
    mouseDownNode = null,
    svgMouseDownNode = null,
    mouseUpNode = null,
    mouseDownLink = null;

var svg = d3.select("body")
			.append("svg")
			.attr("width", 500)
			.attr("height", 500)
			.append('g')
      .call(d3.behavior.zoom().on("zoom", rescale) )
      .on("dblclick.zoom", null)
      .on("dblclick", addNode)
      .append('g')
      .attr('id', "bg") //background
	    .on("mousedown", bgOnMouseDown)
      .on("mousemove", bgOnMouseMove)
	    .on("mouseup", bgOnMouseUp)

var rect = svg.append('svg:rect')
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', 500)
              .attr('height', 500)
              .attr('fill', "#fafafa")

// var force = d3.layout.force()
//           .nodes(d3data.nodes)
//           .links(d3data.edges)
//           .size([500, 500])
//           .linkDistance(100)
//           .charge(-1000)
//           .on("tick", movexy)
//           .start()

// line displayed when dragging new nodes
var drag_line = svg.append("path")
    // .attr("class", "drag_line")
    .attr("stroke-dasharray", "5,5")
    .attr("stroke", "#999")
    .attr("stroke-width", "2")
    .attr("d", "M50 50 L100 100")

drawGraph();

function drawGraph()
{
  //without force, the first time, links don't have objects of nodes into
  //and nodes don't have px, py, index and weight(1)
  svgNodesEnter = d3.select("#bg")
                .selectAll("#node")
                .data(d3data.nodes)

  // When we add a new node, we don't have to valorise d3data.edges.
  if (typeof d3data.nodes.px == "undefined")
  {
    d3data.nodes.forEach(function(node)
            {
              node.px = node.x;
              node.py = node.y;
              node.weight = 1;
            });
  }

  var svgNodes = svgNodesEnter.enter()
        				.append("g")
        				.attr("id", "node")
                .on("click",fixUnfixNode)
                .on("mousedown",nodeOnMouseDown)
                .on("mouseup",nodeOnMouseUp)
                .call(
                      d3.behavior.drag()
                          .on("dragstart", dragstart)
                          .on("drag", dragmove)
                          .on("dragend", dragend)
                      )

  svgNodes.append("circle")
        			  .attr("id", "nodecircle")
        			  .style("fill", "red" )
        			  .style("opacity", 1)
        			  .style("stroke", "#DDD")
        			  .style("stroke-width", "7")
        			  .attr("r", "20")

  svgNodes.append("text")
          			.attr("text-anchor", "middle")
          			.attr("dy", ".25em")
          			.style("font-size", "20px")
          			.style("pointer-events", "none")
          			.text(function(d) { return d.name; })

  svgNodes.select("#nodecircle")


  // Without force :
  // once you have object nodes, you can create d3data.edges without force.links function

  // From the second time, we check every edges to see if there are number
  d3data.edges.forEach(function(link)
          {
            if (typeof(link.source) == "number")
            {
              link.source = d3data.nodes[link.source];
              link.target = d3data.nodes[link.target];
            }
          });

  svgLinksEnter = d3.select("#bg")
                .selectAll("#path")
                .data(d3data.edges)

  var svgLinks = svgLinksEnter.enter()
                .insert("path", "#node")
                .attr("id", "path")
                .attr("stroke", "#DDD")
          			.attr("stroke-width", 3)
          		  .attr("d", function(d) {
                            var dx = d.target.x - d.source.x,
                                dy = d.target.y - d.source.y,
                                dr = Math.sqrt(dx * dx + dy * dy);
                            return "M" +
                                d.source.x + "," +
                                d.source.y + "A" +
                                dr + "," + dr + " 0 0,1 " +
                                d.target.x + "," +
                                d.target.y;
                          })
                .style("fill", "none")

  movexy()
}

function fixUnfixNode(node)
{
  // console.log("fixUnfixNode start");

  if (typeof node.name != "undefined")
  {
    thisNode = this;
  }
  else
  {
    thisNode = node[0][0];
  }

  if (d3.event.defaultPrevented) return;

  //Toggle Class="fixed", fix d force and change circle stroke
  var circle_stroke;
	d3.select(thisNode).select("#nodecircle").classed("fixed", function(d)
      {
        if (d.fixed == true)
        {
          d.fixed = false;
          circle_stroke = "#DDD";
          return false;
        }
        else {
          d.fixed = true
          circle_stroke = "#999"
          return true;
        }
      })
      .style("stroke", circle_stroke);

  // console.log("fixUnfixNode end");
}

function addNode(newnode)
{
   console.log("addnode start");

   xy = d3.mouse(this);

   if (typeof newnode == "undefined")
     var newnode = {}

   if (typeof newnode.name == "undefined")
     newnode.name = "x";
   if (typeof newnode.nodeid == "undefined")
     newnode.nodeid = uriBase + (d3data.nodes.length+1);
   if (typeof newnode.index == "undefined")
     newnode.index = d3data.nodes.length;

   if (typeof newnode.px == "undefined")
     newnode.px = xy[0];
   if (typeof newnode.py == "undefined")
     newnode.py = xy[1];
   if (typeof newnode.x == "undefined")
     newnode.x = xy[0];
   if (typeof newnode.y == "undefined")
     newnode.y = xy[1];

  d3data.nodes.push(newnode)

   drawGraph();

   return nodeid = newnode.nodeid;
   console.log("nodes", d3data.nodes);
   console.log("addnode end");
}

function addLink(sourceid, targetid)
{
  // draw link between mouseDownNode and this node
  var newlink = { source: searchIndexOfNodeId(d3data.nodes,sourceid),
                  target: searchIndexOfNodeId(d3data.nodes,targetid)};
  d3data.edges.push(newlink);
  drawGraph();
}

function nodeOnMouseDown(d)
{
  mouseDownNode = d;
  svgMouseDownNode = this;
  //initialise drag_line position on this node
  drag_line.attr("d", "M"+mouseDownNode.x
                +" "+mouseDownNode.y
                +" L"+mouseDownNode.x
                +" "+mouseDownNode.y)

  drag_line.attr("visibility", "visible");
}

function nodeOnMouseUp(d)
{
  // if we clicked on the origin node
  if (mouseDownNode)
  {
    mouseUpNode = d;
    // if we clicked on the same node, reset vars
    if (mouseUpNode.nodeid == mouseDownNode.nodeid)
    {
      resetMouseVars();
      return;
    }

    var d3svgMouseDownNode = d3.select(svgMouseDownNode);
    drag_line.attr("visibility", "hidden");
    fixUnfixNode(d3svgMouseDownNode);
    addLink(mouseDownNode.nodeid,mouseUpNode.nodeid);
    resetMouseVars();
  }
}

function bgOnMouseDown()
{
  // if (!mouseDownNode && !mouseDownLink) {
  //   // allow panning if nothing is selected
  //   svg.call(d3.behavior.zoom().on("zoom"), rescale);
  //   return;
  // }
}

function bgOnMouseMove()
{
  // if the origin click is not a node, then pan the graph (activated by bgOnMouseDown)...
  if (!mouseDownNode) return;

  var mouse_x = d3.mouse(this)[0];
  var mouse_y = d3.mouse(this)[1];

  // update drag line
  drag_line.attr("d", "M"+mouseDownNode.x
                +" "+mouseDownNode.y
                +" L"+mouse_x
                +" "+mouse_y)
  // console.log("mouseDownNode/mouse_x/mouse_y", mouseDownNode, mouse_x, mouse_y)
}

function bgOnMouseUp()
{
  if (mouseDownNode)
  {
    var mouse_x = d3.mouse(this)[0];
    var mouse_y = d3.mouse(this)[1];

    var d3svgMouseDownNode = d3.select(svgMouseDownNode);

    drag_line.attr("visibility", "hidden");
    fixUnfixNode(d3svgMouseDownNode);
    var newnodeid = addNode({x:mouse_x, y:mouse_y, px:mouse_x, py:mouse_y});
    addLink(mouseDownNode.nodeid, newnodeid);
    resetMouseVars();
  }
}

function dragstart(d, i) {
  // console.log("start of drag");
	d3.event.sourceEvent.stopPropagation();
}

function dragmove(d, i) {
  if (d.fixed != true)
  {
    d.px += d3.event.dx;
  	d.py += d3.event.dy;
  	d.x += d3.event.dx;
  	d.y += d3.event.dy;

    movexy();
  }
}

function dragend(d, i) {
  // console.log("end of drag");
  // force.start()
}

function movexy() {
  svgLinksEnter.attr("d", function(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
     return "M" +
          d.source.x + "," +
          d.source.y + "A" +
          dr + "," + dr + " 0 0,1 " +
          d.target.x + "," +
          d.target.y;
    })

  svgNodesEnter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

// rescale g
function rescale() {
  trans=d3.event.translate;
  scale=d3.event.scale;

  svg.attr("transform",
      "translate(" + trans + ")"
      + " scale(" + scale + ")");
}

function searchIndexOfNodeId(o, searchTerm)
{
  for(var i = 0, len = o.length; i < len; i++) {
      if (o[i].nodeid === searchTerm) return i;
  }
  return -1;
}

function resetMouseVars()
{
  mouseDownNode = null;
  svgMouseDownNode = null;
  mouseUpNode = null;
  mouseDownLink = null;
}
