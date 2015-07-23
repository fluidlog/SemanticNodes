// Prototypes concerning nodes

FluidGraph.prototype.drawNodes = function(svgNodes){
  thisGraph = this;

  if (thisGraph.debug) console.log("drawNodes start");

  svgNodes
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
            .style("stroke", thisGraph.customNodes.strokeColor)
            .style("stroke-width", thisGraph.customNodes.strokeWidth)
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


  if (thisGraph.debug) console.log("drawNodes end");
}

FluidGraph.prototype.nodeEdit = function(d3node, d){
  thisGraph = this;

  if (thisGraph.debug) console.log("nodeEdit start");

  d3.event.stopPropagation();
  console.log("nodeEdit");

  if (thisGraph.debug) console.log("nodeEdit end");
}

FluidGraph.prototype.fixUnfixNode = function(d3node,d){
  thisGraph = this;

  if (thisGraph.debug) console.log("fixUnfixNode start");

  if (d3.event.defaultPrevented) return;

  //Toggle Class="fixed", fix d force and change circle stroke
  var circle_stroke;
  var status;
	d3.select(d3node.node()).select("#nodecircle").classed("selected", function(d)
      {
        if (d.fixed == true)
        {
          d.fixed = false;
          status = "unfixed";
          thisGraph.removeSelectFromNode();
          return false;
        }
        else {
          d.fixed = true;
          status = "fixed";
          thisGraph.replaceSelectNode(d3node, d);
          return true;
        }
      })
      .style("stroke", circle_stroke);

  if (thisGraph.debug) console.log("fixUnfixNode end");
  return status;
}

FluidGraph.prototype.replaceSelectNode = function(d3Node, nodeData){
  var thisGraph = this;
  d3Node.classed(thisGraph.consts.selectedClass, true);
  if (thisGraph.state.selectedNode){
    thisGraph.removeSelectFromNode();
  }
  thisGraph.state.selectedNode = nodeData;
};

FluidGraph.prototype.removeSelectFromNode = function(){
  var thisGraph = this;
  thisGraph.svgNodesEnter.filter(function(cd){
    return cd.id === thisGraph.state.selectedNode.id;
  }).classed(thisGraph.consts.selectedClass, false);
  thisGraph.state.selectedNode = null;
};

FluidGraph.prototype.addNode = function(newnode)
{
  //Here, "this" is the <g> where mouse double-clic
  thisGraph = myGraph;

  if (thisGraph.debug) console.log("addnode start");

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
  if (typeof newnode.identifier == "undefined")
    newnode.identifier = thisGraph.config.uriBase + (d3data.nodes.length);
  if (typeof newnode.id == "undefined")
    newnode.id = thisGraph.nodeidct++;

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

  if (thisGraph.debug) console.log("addnode end");
  return newnode.identifier;
}

FluidGraph.prototype.nodeOnMouseDown = function(d3node,d){
  thisGraph = this;

  if (thisGraph.debug) console.log("nodeOnMouseDown start");

  thisGraph.state.mouseDownNode = d;
  thisGraph.state.selectedNode = d;
  thisGraph.state.svgMouseDownNode = d3node;

  //initialise drag_line position on this node
  thisGraph.drag_line.attr("d", "M"+thisGraph.state.mouseDownNode.x
                              +" "+thisGraph.state.mouseDownNode.y
                              +" L"+thisGraph.state.mouseDownNode.x
                              +" "+thisGraph.state.mouseDownNode.y)

  if (thisGraph.debug) console.log("nodeOnMouseDown end");
}

FluidGraph.prototype.nodeOnMouseUp = function(d3node,d){
//.on("mouseup",function(d){thisGraph.nodeOnMouseUp.call(thisGraph, d3.select(this), d)})
// d3node = d3.select(this) = array[1].<g.node>

  thisGraph = this;

  if (thisGraph.debug) console.log("nodeOnMouseUp start");

  // if we clicked on an origin node
  if (thisGraph.state.mouseDownNode)
  {
    thisGraph.state.mouseUpNode = d;
    thisGraph.state.selectedNode = d;
    // if we clicked on the same node, reset vars
    if (thisGraph.state.mouseUpNode.identifier == thisGraph.state.mouseDownNode.identifier)
    {
      thisGraph.fixUnfixNode(d3node,d);
      thisGraph.resetMouseVars();
      return;
    }

    //Drop on an other node --> create a link
    thisGraph.fixUnfixNode(thisGraph.state.svgMouseDownNode,d);
    thisGraph.drag_line.attr("visibility", "hidden");
    thisGraph.addLink(thisGraph.state.mouseDownNode.identifier,thisGraph.state.mouseUpNode.identifier);
    thisGraph.resetMouseVars();
  }

  if (thisGraph.debug) console.log("nodeOnMouseUp end");
}

FluidGraph.prototype.nodeOnDragStart = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.debug) console.log("nodeOnDragStart start");

  d3.event.sourceEvent.stopPropagation();

  if (d.fixed != true)
  {
    thisGraph.drag_line.attr("visibility", "visible");
  }

  if (thisGraph.debug) console.log("nodeOnDragStart end");
}

FluidGraph.prototype.nodeOnDragMove = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.debug) console.log("nodeOnDragMove start");

  if (d.fixed != true) //false or undefined
  {
    //drag node
  	d.px += d3.event.dx;
  	d.py += d3.event.dy;
  	d.x += d3.event.dx;
  	d.y += d3.event.dy;
    thisGraph.movexy();
    thisGraph.drag_line.attr("visibility", "hidden");
    thisGraph.resetMouseVars();
  }

  if (thisGraph.debug) console.log("nodeOnDragMove end");
}

FluidGraph.prototype.nodeOnDragEnd = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.debug) console.log("nodeOnDragEnd start");

  if (thisGraph.config.elastic == "On")
  {
    if (d.fixed != true)
    {
      thisGraph.movexy();
      thisGraph.force.start();
    }
  }

  if (thisGraph.debug) console.log("nodeOnDragEnd end");
}

FluidGraph.prototype.deleteNode = function(nodeIdentifier) {
  //In console mode "this" is myGraph (executed by : myGraph.deleteNode())
  thisGraph = this;

  if (thisGraph.debug) console.log("deleteNode start");

  if (thisGraph.d3data.nodes.length > 0)
  {
    //delete args or the first if not arg.
    var nodeIdentifier = nodeIdentifier || thisGraph.d3data.nodes[0].identifier;
    index = thisGraph.searchIndexOfNodeId(thisGraph.d3data.nodes, nodeIdentifier);

    //delete node
    thisGraph.d3data.nodes.splice(thisGraph.d3data.nodes.indexOf(index), 1);

    //delete edges linked to this (old) node
    thisGraph.spliceLinksForNode(index);
    thisGraph.state.selectedNode = null;
    thisGraph.drawGraph();
  }
  else {
    console.log("No node to delete !");
  }
  if (thisGraph.debug) console.log("deleteNode end");
}
