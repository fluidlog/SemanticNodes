// define graph object
var FluidGraph = function (firstBgElement,d3data)
{
  /*
  *
  *           Initialisation
  *
  ****************************/

  //Help to assure that it's the "this" of myGraph object
  var thisGraph = this;

  thisGraph.config = {
    size : 20,
    type : "N",
    xNewNode : 100,
    yNewNode : 100,
    bgElementType : "panzoom", //choixe : "panzoom" or "simple"
    force : "On",
    elastic : "On",
    uriBase : "http://fluidlog.com/", //Warning : with LDP, no uriBase... :-)
    linkDistance : 100,
    charge : -1000,
  };

  thisGraph.firstBgElement = firstBgElement || [],
  thisGraph.d3data = d3data || [],
  thisGraph.bgElement = null,
  thisGraph.svgNodesEnter = [],
  thisGraph.svgLinksEnter = [],
  thisGraph.width = window.innerWidth - 30,
  thisGraph.height = window.innerHeight - 30,

  //mouse event vars
  thisGraph.selected_node = null,
  thisGraph.selected_link = null,
  thisGraph.mouseDownNode = null,
  thisGraph.svgMouseDownNode = null,
  thisGraph.mouseUpNode = null,
  thisGraph.mouseDownLink = null;

}

/*
*
*           functions
*
****************************/

//rescale g
FluidGraph.prototype.rescale = function(){
  // console.log("rescale start");

  //Here, "this" is the <g> where mouse double-clic
  thisGraph = window.myGraph;

  thisGraph.bgElement.attr("transform",
    "translate(" + d3.event.translate + ")"
    + " scale(" + d3.event.scale + ")");

  // console.log("rescale end");
}

//Create a balise SVG with events
FluidGraph.prototype.initSgvContainer = function(bgElementId){
  // console.log("initSgvContainer start");

  var thisGraph = this;
  var div = thisGraph.firstBgElement;
  var svg;

  if (thisGraph.config.bgElementType == "simple")  {
    svg = d3.select(div)
          .append("svg")
          .attr("width", thisGraph.width)
          .attr("height", thisGraph.height)
          .append('g')
          .attr('id', bgElementId)
  }
  else  //panzoom
  {
    var outer = d3.select(div)
          .append("svg")
          .attr("width", thisGraph.width)
          .attr("height", thisGraph.height)

    svg = outer
      .append('g')
      .call(d3.behavior.zoom().on("zoom", thisGraph.rescale))
      .on("dblclick.zoom", null)
      .on("click", null)
      .on("dblclick", thisGraph.addNode)
      .append('g')
      .attr('id', bgElementId)
      .on("mousedown", thisGraph.bgOnMouseDown)
      .on("mousemove", thisGraph.bgOnMouseMove)
	    .on("mouseup", thisGraph.bgOnMouseUp)

    svg.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', thisGraph.width)
          .attr('height', thisGraph.height)
          .attr('fill', "#eee")
  }

  thisGraph.bgElement = d3.select("#"+bgElementId);

  // line displayed when dragging new nodes
  thisGraph.drag_line = svg.append("path")
                          .attr("stroke-dasharray", "5,5")
                          .attr("stroke", "#999")
                          .attr("stroke-width", "2")
                          .attr("d", "M0 0 L0 0")
                          .attr("visibility", "hidden");
  // console.log("initSgvContainer end");
}

FluidGraph.prototype.activateForce = function()
{
  // console.log("activateForce start");

  var thisGraph = this;

  thisGraph.force = d3.layout.force()
                        .nodes(thisGraph.d3data.nodes)
                        .links(thisGraph.d3data.edges)
                        .size([thisGraph.width, thisGraph.height])
                        .linkDistance(100)
                        .charge(-1000)

  if (thisGraph.config.elastic == "On")
  {
    thisGraph.force.start()
  }
  else // Off
  {
    // Run the layout a fixed number of times.
  	// The ideal number of times scales with graph complexity.
    thisGraph.force.start();
  	for (var i = 1000; i > 0; --i) thisGraph.force.tick();
    thisGraph.force.stop();
  }

  if (thisGraph.config.elastic == "On")
  {
    thisGraph.force.on("tick", thisGraph.movexy)
  }

  // console.log("activateForce end");
}

FluidGraph.prototype.drawGraph = function()
{
  console.log("drawGraph start");

  var thisGraph = this;

    myGraph.d3data.nodes.forEach(function(node)
            {
              if (typeof myGraph.d3data.nodes.px == "undefined")
              {
                node.px = node.x;
                node.py = node.y;
                node.weight = 1;
              }
            });

  //Update of the nodes
  if (typeof thisGraph.d3data.nodes != "undefined")
  {
    thisGraph.svgNodesEnter = thisGraph.bgElement.selectAll("#node")
    				              .data(thisGraph.d3data.nodes)

    thisGraph.svgNodes = thisGraph.svgNodesEnter
                                .enter()
                        				.append("g")
                        				.attr("id", "node")
                                .on("mousedown",thisGraph.nodeOnMouseDown)
                                .on("mouseup",thisGraph.nodeOnMouseUp)
                                .call(d3.behavior.drag()
                                					.on("dragstart", thisGraph.dragstart)
                                					.on("drag", thisGraph.dragmove)
                                					.on("dragend", thisGraph.dragend)
                                )

    if (thisGraph.config.force == "On" || thisGraph.config.elastic == "On")
    {
      thisGraph.svgNodes.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
    }

    thisGraph.svgNodes
              .append("circle")
              .attr("id", "nodecircle")
              .style("fill", function (d){
                	switch (d.type)
                	{
                		case "P" : return "red"; break
                		case "A" : return "orange";	break
                		case "I" : return "yellow"; break
                    case "R" : return "green"; break
                    case "N" : return "gray"; break
                	}
              })
              .style("opacity", 1)
              .style("stroke", "#DDD")
              .style("stroke-width", 7)
              .style("cursor", "pointer")
              .attr("r", 0)
    				  .transition()
    				  .duration(300)
              .attr("r", function(d) { return d.size ; })

    thisGraph.svgNodes
              .append("text")
        			.attr("text-anchor", "middle")
        			.attr("dy", ".25em")
        			.text(function(d) { return d.name })
        			.style("font-size", 14)
              .style("cursor", "pointer")
  }

  //Update links
  // Without force :
  // once you have object nodes, you can create d3data.edges without force.links function

  // From the second time, we check every edges to see if there are number to replace by nodes objects
  thisGraph.d3data.edges.forEach(function(link)
          {
            if (typeof(link.source) == "number")
            {
              link.source = thisGraph.d3data.nodes[link.source];
              link.target = thisGraph.d3data.nodes[link.target];
            }
          });

  if (typeof thisGraph.d3data.edges != "undefined")
  {
    thisGraph.svgLinksEnter = thisGraph.bgElement.selectAll("#path")
                			.data(thisGraph.d3data.edges)

    thisGraph.svgLinks = thisGraph.svgLinksEnter
                      .enter()
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
  }

  //delete node if there's less object in svgNodes array than in DOM
  thisGraph.svgNodesEnter.exit().remove();

  if (myGraph.config.force == "Off")
  {
    thisGraph.movexy();
  }

  console.log("drawGraph end");
}

FluidGraph.prototype.movexy = function()
{
  // console.log("movexy start");

  if (typeof this.tick != "undefined")
  {
    //Here, "this" is the tick
    thisGraph = myGraph;
  }
  else
  {
    //Here, "this" is the <g.node> where mouse drag
    thisGraph = this;
  }

  thisGraph.svgLinksEnter.attr("d", function(d) {
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

  thisGraph.svgNodesEnter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  // console.log("movexy end");
}

FluidGraph.prototype.fixUnfixNode = function(node)
{
  console.log("fixUnfixNode start");

  if (typeof node.name != "undefined")
  {
    thisNode = this;
  }
  else
  {
    thisNode = node;
  }

  if (d3.event.defaultPrevented) return;

  //Toggle Class="fixed", fix d force and change circle stroke
  var circle_stroke;
  var status;
	d3.select(thisNode).select("#nodecircle").classed("fixed", function(d)
      {
        if (d.fixed == true)
        {
          d.fixed = false;
          circle_stroke = "#DDD";
          status = "unfixed";
          return false;
        }
        else {
          d.fixed = true;
          circle_stroke = "#999";
          status = "fixed";
          return true;
        }
      })
      .style("stroke", circle_stroke);

      return status;
  console.log("fixUnfixNode end");
}

FluidGraph.prototype.addNode = function(newnode)
{
  console.log("addnode start");

  //Here, "this" is the <g> where mouse double-clic
  thisGraph = myGraph;

  var xy = [];

  if (typeof this.__ondblclick != "undefined")  //if after dblclick
  {
    xy = d3.mouse(this);
  }
  else
  {
    xy[0] = thisGraph.config.xNewNode;
    xy[1] = thisGraph.config.yNewNode;
  }

  if (typeof newnode == "undefined")
    var newnode = {}

  if (typeof newnode.name == "undefined")
    newnode.name = "x";
  if (typeof newnode.size == "undefined")
    newnode.size = thisGraph.config.size;
  if (typeof newnode.type == "undefined")
    newnode.type = thisGraph.config.type;
  if (typeof newnode.nodeid == "undefined")
    newnode.nodeid = thisGraph.config.uriBase + (d3data.nodes.length+1);

  if (typeof newnode.px == "undefined")
    newnode.px = xy[0];
  if (typeof newnode.py == "undefined")
    newnode.py = xy[1];
  if (typeof newnode.x == "undefined")
    newnode.x = xy[0];
  if (typeof newnode.y == "undefined")
    newnode.y = xy[1];
  // if (typeof newnode.weight == "undefined")
  //   newnode.weight = 1;

  thisGraph.d3data.nodes.push(newnode)

  thisGraph.drawGraph();

  return nodeid = newnode.nodeid;

  console.log("addnode end");
}

FluidGraph.prototype.addLink = function(sourceid, targetid)
{
  console.log("addLink start");

  thisGraph = myGraph;
  // draw link between mouseDownNode and this node
  var newlink = { source: thisGraph.searchIndexOfNodeId(d3data.nodes,sourceid),
                  target: thisGraph.searchIndexOfNodeId(d3data.nodes,targetid)};

  thisGraph.d3data.edges.push(newlink);

  thisGraph.drawGraph();

  console.log("addLink end");
}

FluidGraph.prototype.nodeOnMouseDown = function(d)
{
  console.log("nodeOnMouseDown start");
  thisGraph = myGraph;

  if (thisGraph.config.force == "On")
    thisGraph.force.stop();

  thisGraph.mouseDownNode = d;
  thisGraph.svgMouseDownNode = this;

  //initialise drag_line position on this node
  thisGraph.drag_line.attr("d", "M"+thisGraph.mouseDownNode.x
                              +" "+thisGraph.mouseDownNode.y
                              +" L"+thisGraph.mouseDownNode.x
                              +" "+thisGraph.mouseDownNode.y)

  console.log("nodeOnMouseDown end");
}

FluidGraph.prototype.nodeOnMouseUp = function(d)
{
  console.log("nodeOnMouseUp start");
  thisGraph = myGraph;

  // if we clicked on an origin node
  if (thisGraph.mouseDownNode)
  {
    thisGraph.mouseUpNode = d;
    // if we clicked on the same node, reset vars
    if (thisGraph.mouseUpNode.nodeid == thisGraph.mouseDownNode.nodeid)
    {
      thisGraph.fixUnfixNode(thisGraph.svgMouseDownNode);
      thisGraph.resetMouseVars();
      return;
    }

    thisGraph.fixUnfixNode(thisGraph.svgMouseDownNode);
    thisGraph.drag_line.attr("visibility", "hidden");
    thisGraph.addLink(thisGraph.mouseDownNode.nodeid,thisGraph.mouseUpNode.nodeid);
    thisGraph.resetMouseVars();
  }

  console.log("nodeOnMouseUp end");
}

FluidGraph.prototype.bgOnMouseMove = function()
{
  // console.log("bgOnMouseMove start");
  thisGraph = myGraph;

  // if the origin click is not a node, then pan the graph (activated by bgOnMouseDown)...
  if (!thisGraph.mouseDownNode) return;

  var mouse_x = d3.mouse(this)[0];
  var mouse_y = d3.mouse(this)[1];

  // update drag line
  thisGraph.drag_line.attr("d", "M"+thisGraph.mouseDownNode.x
                              +" "+thisGraph.mouseDownNode.y
                              +" L"+mouse_x
                              +" "+mouse_y)

  // console.log("mouseDownNode/mouse_x/mouse_y", mouseDownNode, mouse_x, mouse_y)
}

FluidGraph.prototype.bgOnMouseUp = function()
{
  console.log("bgOnMouseUp start");
  thisGraph = myGraph;

  if (!thisGraph.mouseDownNode)
  {
    thisGraph.resetMouseVars();
    return;
  }

  var mouse_x = d3.mouse(this)[0];
  var mouse_y = d3.mouse(this)[1];

  var d3svgMouseDownNode = d3.select(thisGraph.svgMouseDownNode);

  thisGraph.drag_line.attr("visibility", "hidden");
  thisGraph.fixUnfixNode(thisGraph.svgMouseDownNode);
  var newnodeid = thisGraph.addNode({x:mouse_x,
                                              y:mouse_y,
                                              px:mouse_x,
                                              py:mouse_y});

  thisGraph.addLink(thisGraph.mouseDownNode.nodeid, newnodeid);

  thisGraph.resetMouseVars();

  console.log("bgOnMouseUp end");
}

FluidGraph.prototype.dragstart = function(d, i) {
  console.log("dragstart start");

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = myGraph;

  d3.event.sourceEvent.stopPropagation();

  if (thisGraph.config.force == "On" && thisGraph.config.elastic == "On")
    thisGraph.force.stop();

  if (d.fixed != true)
  {
    thisGraph.drag_line.attr("visibility", "visible");
  }

  console.log("dragstart end");
}

FluidGraph.prototype.dragmove = function(d, i) {
  // console.log("dragmove start");

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = myGraph;

  if (d.fixed != true)
  {
    //drag node
  	d.px += d3.event.dx;
  	d.py += d3.event.dy;
  	d.x += d3.event.dx;
  	d.y += d3.event.dy;
    thisGraph.movexy();
    thisGraph.resetMouseVars();
  }

  // console.log("dragmove end");
}

FluidGraph.prototype.dragend = function(d, i) {
  console.log("dragend start");

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = myGraph;

  if (thisGraph.config.elastic == "On")
  {
    if (d.fixed != true)
    {
      thisGraph.movexy();
      thisGraph.force.start();
    }
  }

  console.log("dragend end");
}

FluidGraph.prototype.deleteNode = function(nodeid) {
  // console.log("deleteNode start");

  //In console mode "this" is myGraph (executed by : myGraph.deleteNode())
  thisGraph = this;

  if (thisGraph.d3data.nodes.length > 0)
  {
    var nodeid = nodeid || thisGraph.d3data.nodes[0].nodeid;
    index = searchIndexOfNodeId(thisGraph.d3data.nodes, nodeid);

    thisGraph.d3data.nodes.splice(thisGraph.d3data.nodes.indexOf(index), 1);
    thisGraph.drawGraph();
  }
  else {
    console.log("No node to delete !");
  }
  // console.log("deleteNode end");
}

FluidGraph.prototype.searchIndexOfNodeId = function(o, searchTerm)
{
  for(var i = 0, len = o.length; i < len; i++) {
      if (o[i].nodeid === searchTerm) return i;
  }
  return -1;
}

FluidGraph.prototype.resetMouseVars = function()
{
  thisGraph.mouseDownNode = null;
  thisGraph.svgMouseDownNode = null;
  thisGraph.mouseUpNode = null;
  thisGraph.mouseDownLink = null;
}

FluidGraph.prototype.deleteGraph = function() {
  // console.log("deleteGraph start");

  thisGraph = this;
  thisGraph.resetMouseVars();
  thisGraph.d3data.nodes = [];
  thisGraph.d3data.edges = [];
  d3.select("bgElement").remove();

  // console.log("deleteGraph end");
}

FluidGraph.prototype.refreshGraph = function() {
  // console.log("deleteGraph start");

  thisGraph = this;
  thisGraph.resetMouseVars();
  d3.select("bgElement").remove();
  if (myGraph.config.force == "On")
    myGraph.activateForce();

  myGraph.drawGraph();

  // console.log("deleteGraph end");
}
