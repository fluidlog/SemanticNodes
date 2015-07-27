// Prototypes concerning nodes

FluidGraph.prototype.drawNodes = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("drawNodes start");

  var rectCircle;
  if (thisGraph.customNodes.rectSvg) {
    rectCircle = svgNodes.append("rect")
      .attr("x", -thisGraph.customNodes.widthClosed / 2)
      .attr("y", -thisGraph.customNodes.heightClosed / 2)
      .attr("width", thisGraph.customNodes.widthClosed)
      .attr("height", thisGraph.customNodes.heightClosed)
      .attr("rx", thisGraph.customNodes.curvesCorners)
      .attr("ry", thisGraph.customNodes.curvesCorners)
  } else {
    rectCircle = svgNodes.append("circle")
      .attr("r", 0)
      .transition()
      .duration(300)
      .attr("r", thisGraph.customNodes.sizeOfCircleNode)
  }

  rectCircle
    .attr("id", "nodecircle")
    .attr("class", "nodecircle")
    .style("fill", function(d) {
      return thisGraph.customNodes.colorType[d.type]
    })
    .style("stroke", thisGraph.customNodes.strokeColor)
    .style("stroke-width", thisGraph.customNodes.strokeWidth)
    .style("stroke-opacity", thisGraph.customNodes.strokeOpacity)
    .style("cursor", thisGraph.customNodes.cursor)
    .style("opacity", 1)

  if (thisGraph.customNodes.displayId)
    thisGraph.displayId(svgNodes)

  if (thisGraph.customNodes.displayType)
    thisGraph.displayType(svgNodes)

  if (thisGraph.customNodes.displayText)
    thisGraph.displayText(svgNodes)


  if (thisGraph.config.debug) console.log("drawNodes end");
}

FluidGraph.prototype.displayText = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayId start");

  if (thisGraph.customNodesText.awesomeText) {
    // content closed node
    var fo_content_text_node = svgNodes
      .append("foreignObject")
      .attr("id", "fo_content_text_node")
      .attr("x", -thisGraph.customNodesText.widthMax / 2)
      .attr("y", -thisGraph.customNodesText.heightMax / 2)
      .attr("width", thisGraph.customNodesText.widthMax)
      .attr("height", thisGraph.customNodesText.heightMax)

    //fo xhtml
    var fo_xhtml_content_text_node = fo_content_text_node
      .append('xhtml:div')
      .attr("class", "fo_xhtml_content_text_node")
      .attr("style", "width:"+thisGraph.customNodesText.widthMax+"px;"
                    +"height:"+thisGraph.customNodesText.heightMax+"px;"  )

    //label_closed_node
    var label_closed_node = fo_xhtml_content_text_node
      .append("div")
      .attr("id", "label_closed_node")
      .attr("class", "label_closed_node")
      .attr("style", function(d) {
        return "background-color:rgba(" + thisGraph.customNodes.colorTypeRgba[d.type]
                                    + "," + thisGraph.customNodesText.strokeOpacity + ");"
                                    + "border: 1px solid rgba("
                                    + thisGraph.customNodes.colorTypeRgba[d.type] + ","
                                    + thisGraph.customNodesText.strokeOpacity + ")";
      })
      .text(function(d, i) {
        return d.label;
      })
  } else {
    svgNodes
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".25em")
      .text(function(d) {
        return d.label
      })
      .style("font-size", thisGraph.customNodesText.fontSize)
      .style("font-family", thisGraph.customNodesText.fontFamily)
      .style("cursor", thisGraph.customNodesText.cursor)
  }

  if (thisGraph.config.debug) console.log("displayId end");
}

FluidGraph.prototype.displayId = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayId start");

  /* id circle */
  svgNodes
    .append("circle")
    .attr("id", "circle_id")
    .attr("class", "circle_id")
    .attr("cx", 0)
    .attr("cy", -33)
    .attr("r", 10)
    .attr("fill", function(d) {
      return thisGraph.customNodes.colorType[d.type];
    })

  /* Text of id */
  svgNodes
    .append("text")
    .attr("id", "text_id")
    .attr("class", "text_id")
    .attr("dx", 0)
    .attr("dy", -29)
    .attr("fill", "#EEE")
    .attr("font-weight", "bold")
    .text(function(d) {
      return d.id;
    })

  if (thisGraph.config.debug) console.log("displayId end");
}

FluidGraph.prototype.displayType = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayType start");

  /* type circle*/
  svgNodes
    .append("circle")
    .attr("id", "circle_type")
    .attr("class", "circle_type")
    .attr("cx", 0)
    .attr("cy", 30)
    .attr("r", 13)

  /* Image of type */
  var fo_type_image = svgNodes
    .append("foreignObject")
    .attr("id", "fo_type_image")
    .attr('x', -11)
    .attr('y', 19)
    .attr('width', 25)
    .attr('height', 25)

  //xhtml div image
  var fo_xhtml_type_image = fo_type_image
    .append('xhtml:div')
    .attr("id", "fo_div_type_image")
    .attr("class", "fo_div_image")
    .append('i')
    .attr("id", "fo_i_type_image")
    .attr("class", function(d) {
      return "ui large " + thisGraph.customNodes.imageType[d.type] + " icon";
    })
    .attr("style", "display:inline")

  if (thisGraph.config.debug) console.log("displayType end");
}

FluidGraph.prototype.nodeEdit = function(d3node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeEdit start");

  d3.event.stopPropagation();

  var el = d3node;
  var p_el = d3node.parentNode; //p_el = g_closed_node

  el
    .select("#nodecircle")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("x", -thisGraph.customNodes.widthOpened / 2)
    .attr("y", -thisGraph.customNodes.heightOpened / 2)
    .attr("width", thisGraph.customNodes.widthOpened)
    .attr("height", thisGraph.customNodes.heightOpened)
    .each("end", function(d) {
      thisGraph.displayContentOpenedNode.call(thisGraph, d3.select(this), d)
    })

  thisGraph.state.nodeOpened = d3node;

  if (thisGraph.config.debug) console.log("nodeEdit end");
}

FluidGraph.prototype.displayContentOpenedNode = function(d3node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayContentOpenedNode start");
  console.log("displayContentOpenedNode, thisGraph, d3node, d : ", thisGraph, d3node, d);

  if (thisGraph.config.debug) console.log("displayContentOpenedNode end");
}

FluidGraph.prototype.closeNode = function(d3node) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("closeNode start");

  var el = d3node;
  var p_el = d3node.parentNode; //p_el = g_closed_node

  // el.select("#fo_opened_flud").remove();

  el.select("#nodecircle")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("x", -thisGraph.customNodes.widthClosed /2)
    .attr("y", -thisGraph.customNodes.heightClosed/2)
    .attr("width", thisGraph.customNodes.widthClosed)
    .attr("height", thisGraph.customNodes.heightClosed)

  thisGraph.state.nodeOpened = null;

  if (thisGraph.config.debug) console.log("closeNode end");
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};

FluidGraph.prototype.nodeOnMouseOver = function(d3node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnMouseOver start");

  if (thisGraph.customNodes.bringNodeToFrontOnHover) {
    var el = d3.select(d3node.node());
    el.moveToFront();
  }

  if (thisGraph.config.debug) console.log("nodeOnMouseOver end");
}

FluidGraph.prototype.nodeOnMouseOut = function(d3node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnMouseOut start");

  if (thisGraph.config.debug) console.log("nodeOnMouseOut end");
}

FluidGraph.prototype.searchIndexOfNodeId = function(o, searchTerm) {
  for (var i = 0, len = o.length; i < len; i++) {
    if (o[i].identifier === searchTerm) return i;
  }
  return -1;
}

FluidGraph.prototype.focusContextNode = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("focusContextNode start");

  if (thisGraph.state.selectedNode) {
    var linkedByIndex = {};
    thisGraph.d3data.edges.forEach(function(d) {
      linkedByIndex[d.source.id + "," + d.target.id] = 1;
    });

    function isConnected(a, b) {
      return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id == b.id;
    }

    thisGraph.d3dataFc = {}
    thisGraph.d3dataFc.nodes = [];
    thisGraph.d3dataFc.edges = [];

    //First, the selected node
    thisGraph.d3dataFc.nodes.push(thisGraph.state.selectedNode);

    thisGraph.d3data.nodes.forEach(function(node) {
      //Nodes
      if (isConnected(thisGraph.state.selectedNode, node) && thisGraph.state.selectedNode.id != node.id) {
        thisGraph.d3dataFc.nodes.push(node);
      }
      //links
      if (isConnected(thisGraph.state.selectedNode, node) && thisGraph.state.selectedNode.id != node.id) {
        thisGraph.d3dataFc.edges.push({
          source: thisGraph.searchIndexOfNodeId(thisGraph.d3dataFc.nodes, thisGraph.state.selectedNode.identifier),
          target: thisGraph.searchIndexOfNodeId(thisGraph.d3dataFc.nodes, node.identifier)
        });
      }
    });

    //If not, there are problems in movexy()...
    d3.selectAll("#node").remove();
    d3.selectAll("#path").remove();

    thisGraph.drawGraph(thisGraph.d3dataFc);
  } else alert("Please select a node :)")

  if (thisGraph.config.debug) console.log("focusContextNode end");
}

FluidGraph.prototype.focusContextNodeOff = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("focusContextNodeOff start");

  //If not, there are problems in movexy()...
  d3.selectAll("#node").remove();
  d3.selectAll("#path").remove();
  thisGraph.drawGraph(thisGraph.d3data);

  if (thisGraph.config.debug) console.log("focusContextNodeOff end");
}

FluidGraph.prototype.fixUnfixNode = function(d3node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("fixUnfixNode start");

  if (d3.event.defaultPrevented) return;

  //Toggle Class="fixed", fix d force and change circle stroke
  var circle_stroke;
  var status;
  d3.select(d3node.node()).select("#nodecircle").classed("selected", function(d) {
      if (d.fixed == true) {
        d.fixed = false;
        status = "unfixed";
        thisGraph.removeSelectFromNode();
        return false;
      } else {
        d.fixed = true;
        status = "fixed";
        thisGraph.replaceSelectNode(d3node, d);
        return true;
      }
    })
    .style("stroke", circle_stroke);

  if (thisGraph.config.debug) console.log("fixUnfixNode end");
  return status;
}

FluidGraph.prototype.replaceSelectNode = function(d3Node, nodeData) {
  var thisGraph = this;
  d3Node.classed(thisGraph.consts.selectedClass, true);
  if (thisGraph.state.selectedNode) {
    thisGraph.removeSelectFromNode();
  }
  thisGraph.state.selectedNode = nodeData;
};

FluidGraph.prototype.removeSelectFromNode = function() {
  var thisGraph = this;
  thisGraph.svgNodesEnter.filter(function(cd) {
    return cd.id === thisGraph.state.selectedNode.id;
  }).classed(thisGraph.consts.selectedClass, false);
  thisGraph.state.selectedNode = null;
};

FluidGraph.prototype.addNode = function(newnode) {
  //Here, "this" is the <g> where mouse double-clic
  thisGraph = myGraph;

  if (thisGraph.config.debug) console.log("addnode start");

  var xy = [];

  if (typeof this.__ondblclick != "undefined") //if after dblclick
  {
    xy = d3.mouse(this);
  } else {
    xy[0] = thisGraph.config.xNewNode;
    xy[1] = thisGraph.config.yNewNode;
  }

  if (typeof newnode == "undefined")
    var newnode = {}

  if (typeof newnode.label == "undefined")
    newnode.label = "new";
  if (typeof newnode.size == "undefined")
    newnode.size = thisGraph.customNodes.sizeOfCircleNode;
  if (typeof newnode.type == "undefined")
    newnode.type = thisGraph.customNodes.typeOfNewNode;
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

  if (thisGraph.config.debug) console.log("addnode end");
  return newnode.identifier;
}

FluidGraph.prototype.nodeOnMouseDown = function(d3node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnMouseDown start");

  thisGraph.state.mouseDownNode = d;
  thisGraph.state.selectedNode = d;
  thisGraph.state.svgMouseDownNode = d3node;

  //initialise drag_line position on this node
  thisGraph.drag_line.attr("d", "M" + thisGraph.state.mouseDownNode.x + " " + thisGraph.state.mouseDownNode.y + " L" + thisGraph.state.mouseDownNode.x + " " + thisGraph.state.mouseDownNode.y)

  if (thisGraph.config.debug) console.log("nodeOnMouseDown end");
}

FluidGraph.prototype.nodeOnMouseUp = function(d3node, d) {
  //.on("mouseup",function(d){thisGraph.nodeOnMouseUp.call(thisGraph, d3.select(this), d)})
  // d3node = d3.select(this) = array[1].<g.node>

  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnMouseUp start");

  // if we clicked on an origin node
  if (thisGraph.state.mouseDownNode) {
    thisGraph.state.mouseUpNode = d;
    thisGraph.state.selectedNode = d;
    // if we clicked on the same node, reset vars
    if (thisGraph.state.mouseUpNode.identifier == thisGraph.state.mouseDownNode.identifier) {
      thisGraph.fixUnfixNode(d3node, d);
      thisGraph.resetMouseVars();
      return;
    }

    //Drop on an other node --> create a link
    thisGraph.fixUnfixNode(thisGraph.state.svgMouseDownNode, d);
    thisGraph.drag_line.attr("visibility", "hidden");
    thisGraph.addLink(thisGraph.state.mouseDownNode.identifier, thisGraph.state.mouseUpNode.identifier);
    thisGraph.resetMouseVars();
  }

  if (thisGraph.config.debug) console.log("nodeOnMouseUp end");
}

FluidGraph.prototype.nodeOnDragStart = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnDragStart start");

  d3.event.sourceEvent.stopPropagation();

  if (d.fixed != true) {
    thisGraph.drag_line.attr("visibility", "visible");
  }

  if (thisGraph.config.debug) console.log("nodeOnDragStart end");
}

FluidGraph.prototype.nodeOnDragMove = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnDragMove start");

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

  if (thisGraph.config.debug) console.log("nodeOnDragMove end");
}

FluidGraph.prototype.nodeOnDragEnd = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnDragEnd start");

  if (thisGraph.config.elastic == "On") {
    if (d.fixed != true) {
      thisGraph.movexy();
      thisGraph.force.start();

      if (thisGraph.state.selectedLink) {
        thisGraph.removeSelectFromLinks();
      }

      if (thisGraph.state.selectedNode) {
        thisGraph.removeSelectFromNode();
      }
    }
  }

  if (thisGraph.config.debug) console.log("nodeOnDragEnd end");
}

FluidGraph.prototype.deleteNode = function(nodeIdentifier) {
  //In console mode "this" is myGraph (executed by : myGraph.deleteNode())
  thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteNode start");

  if (thisGraph.d3data.nodes.length > 0) {
    //delete args or the first if not arg.
    var nodeIdentifier = nodeIdentifier || thisGraph.d3data.nodes[0].identifier;
    index = thisGraph.searchIndexOfNodeId(thisGraph.d3data.nodes, nodeIdentifier);

    //delete node
    thisGraph.d3data.nodes.splice(thisGraph.d3data.nodes.indexOf(index), 1);

    //delete edges linked to this (old) node
    thisGraph.spliceLinksForNode(index);
    thisGraph.state.selectedNode = null;
    thisGraph.drawGraph();
  } else {
    console.log("No node to delete !");
  }
  if (thisGraph.config.debug) console.log("deleteNode end");
}
