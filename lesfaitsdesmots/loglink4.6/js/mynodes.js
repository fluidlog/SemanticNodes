// Prototypes concerning nodes

FluidGraph.prototype.drawNodes = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("drawNodes start");

  var rectCircle;
  if (thisGraph.customNodes.rectSvg) {
    rectCircle = svgNodes
      .append("rect")
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
                  +"height:"+thisGraph.customNodesText.heightMax+"px;")

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
                                  + thisGraph.customNodesText.strokeOpacity + ");"
                                  + "cursor:" + thisGraph.customNodes.cursor + ";"
    })
    .text(function(d, i) {
      return d.label;
    })
    .on("mousedown",function(d){
      thisGraph.nodeOnMouseDown.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d)})
    .on("mouseup",function(d){
      thisGraph.nodeOnMouseUp.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d)})
    .on("mouseover",function(d){
      thisGraph.nodeOnMouseOver.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d)})
    .on("mouseout",function(d){
      thisGraph.nodeOnMouseOut.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d)})
    .on("dblclick",function(d){
      thisGraph.editNode.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d)})

  //Rect to put events
  var fo_content_circle_node = svgNodes
    .append("foreignObject")
    .attr("id", "fo_content_circle_node")
    .attr("x", -thisGraph.customNodesText.widthMax / 2)
    .attr("y", -thisGraph.customNodesText.heightMax / 2)
    .attr("width", thisGraph.customNodesText.widthMax)
    .attr("height", thisGraph.customNodesText.heightMax)

  var fo_xhtml_content_circle_node = fo_content_circle_node
    .append('xhtml:div')
    .attr("class", "fo_xhtml_content_circle_event_node")
    .attr("style", "margin-left:40px;padding:" + thisGraph.customNodes.widthClosed/2 + "px;"
                  + "width:"+thisGraph.customNodes.widthClosed+"px;"
                  + "height:"+thisGraph.customNodes.heightClosed+"px;position:static;"
                  + "cursor:" + thisGraph.customNodes.cursor + ";")

    .on("mousedown",function(d){
      thisGraph.nodeOnMouseDown.call(thisGraph, d3.select(this.parentNode.parentNode), d)})
    .on("mouseup",function(d){
      thisGraph.nodeOnMouseUp.call(thisGraph, d3.select(this.parentNode.parentNode), d)})
    .on("mouseover",function(d){
      thisGraph.nodeOnMouseOver.call(thisGraph, d3.select(this.parentNode.parentNode), d)})
    .on("mouseout",function(d){
      thisGraph.nodeOnMouseOut.call(thisGraph, d3.select(this.parentNode.parentNode), d)})
    .on("dblclick",function(d){
      thisGraph.editNode.call(thisGraph, d3.select(this.parentNode.parentNode), d)})

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
    .attr("cx", thisGraph.nodeIdCircle.cxClosed)
    .attr("cy", thisGraph.nodeIdCircle.cyClosed)
    .attr("r", thisGraph.nodeIdCircle.r)
    .attr("fill", function(d) {
      return thisGraph.customNodes.colorType[d.type];
    })

  /* Text of id */
  svgNodes
    .append("text")
    .attr("id", "text_id")
    .attr("class", "text_id")
    .attr("dx", thisGraph.nodeIdCircle.dxClosed)
    .attr("dy", thisGraph.nodeIdCircle.dyClosed)
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
    .attr("cy", thisGraph.nodeTypeIcon.cyClosed)
    .attr("r", thisGraph.nodeTypeIcon.r)

  /* Image of type */
  var fo_type_image = svgNodes
    .append("foreignObject")
    .attr("id", "fo_type_image")
    .attr('x', thisGraph.nodeTypeIcon.xClosed)
    .attr('y', thisGraph.nodeTypeIcon.yClosed)
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

FluidGraph.prototype.changeTypeNode = function(node,type) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayType start");

  var el = d3.select(node);

  var nodecircle = el.select("#nodecircle");
  nodecircle.style("fill", thisGraph.customNodes.colorType[type]);

  var type_el = el.select("#fo_type_image");
  type_el.select('#fo_i_type_image').remove();
  type_el.select('#fo_div_type_image')
      .append('i')
        .attr("id", "fo_i_type_image")
        .attr("class", "ui large " + thisGraph.customNodes.imageType[type] + " icon")
      .attr("style", "display:inline")

  var circle_id_el = el.select("#circle_id");
  circle_id_el.style("fill", function(d) { return thisGraph.customNodes.colorType[type] } );

  if (thisGraph.config.debug) console.log("displayType end");
}

FluidGraph.prototype.changeLabelNode = function(node,type) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("changeLabelNode start");

  var el = d3.select(node);

  if (thisGraph.config.debug) console.log("changeLabelNode end");
}

FluidGraph.prototype.editNode = function(d3node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("editNode start");

  d3.event.stopPropagation();

  var el = d3node;
  var p_el = d3.select(d3node.node().parentNode); //p_el = g#node

  el
    .select("#fo_content_text_node").remove();

  el
    .select("#circle_id")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("cx", thisGraph.nodeIdCircle.cxOpened)
    .attr("cy", thisGraph.nodeIdCircle.cyOpened)

  el
    .select("#text_id")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("dx", thisGraph.nodeIdCircle.dxOpened)
    .attr("dy", thisGraph.nodeIdCircle.dyOpened)

  el
    .select("#circle_type")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("cx", 0)
    .attr("cy", thisGraph.nodeTypeIcon.cyOpened)

  el
    .select("#fo_type_image")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("x", -10)
    .attr("y", thisGraph.nodeTypeIcon.yOpened)

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
      thisGraph.displayContentEditNode.call(thisGraph, d3.select(this), d)
    })

  if (thisGraph.state.openedNode)
    thisGraph.closeEditNode(thisGraph.state.openedNode);

  thisGraph.state.openedNode = d3node.node();

  if (thisGraph.config.debug) console.log("editNode end");
}

FluidGraph.prototype.displayContentEditNode = function(d3node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayContentEditNode start");

  var el = d3node;
  var p_el = d3.select(d3node.node().parentNode); //p_el = g#node

  /*
   *
   * Content of the node
   *
   * */

  var fo_edit_node = p_el
        .append("foreignObject")
        .attr("id","fo_content_edit_node")
        .attr("x", -thisGraph.customNodes.widthOpened/2)
        .attr("y", -thisGraph.customNodes.heightOpened/2)
        .attr("width", thisGraph.customNodes.widthOpened)
        .attr("height", thisGraph.customNodes.heightOpened)

  var fo_xhtml = fo_edit_node
        .append('xhtml:div')
        .attr("class", "fo_xhtml_content_edit_node")
        //Warning : using css doesn't work !
        .attr("style", "width:"+thisGraph.customNodes.widthOpened+"px;"
                      +"height:"+thisGraph.customNodes.heightOpened+"px;"
                      +"cursor:"+thisGraph.customNodes.cursor+";"
                      +"position:static;")

  //Node Segment
  var  node_segment = fo_xhtml
        .append("div")
        .attr("class", "ui raised segment")
        .attr("style", "position:static;margin:0px;padding:10px")

  //Form Segment
  var form_segment = node_segment
        .append("div")
        .attr("class", "ui form top attached segment")
        .attr("style", "position:static;margin-top:0px;padding:0px")

      /*
       *
       * Type
       *
       * */

   var field_type = form_segment
         .append("div")
         .attr("class", "field")
         .attr("style", "margin:0px")

  //Node label type
  var node_label_type = field_type
        .append("label")
        .attr("style", "margin:0;")
        .text("Type")

  //select type
  var select_type = field_type
        .append("select")
        .attr("id", "select_type")
        .attr("style", "padding:0px")

  thisGraph.customNodes.listType.forEach(function(type) {
    var option = select_type.append("option")

    option.attr("value", type)

    if (d.type === type)
      option.attr("selected",true)

    option.text(type)

  });

  /*
   *
   * Description
   *
   * */

var field_description = form_segment
  .append("div")
  .attr("class", "field")
  .attr("style", "margin:0px")

//Node label 1 (description)
var node_label_1 = field_description
  .append("label")
  .attr("style", "margin:0;")
  .text("Description")

//Node textarea
var textarea_label_open_flud = field_description
  .append("textarea")
  .attr("id", "textarea_label_edit_node")
  .attr("style", "padding:0;min-height:0;height:50px;width:140px;")
              .text(function() {
                this.focus();
                  return d.label;
              })


  if (thisGraph.config.debug) console.log("displayContentEditNode end");
}

FluidGraph.prototype.closeEditNode = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("closeEditNode start");

  var el = d3.select(thisGraph.state.openedNode);
  var p_el = d3.select(thisGraph.state.openedNode.parentNode); //p_el = g#node

  var type_node_select = p_el.select("#select_type");
  var description_node_textarea = p_el.select("#textarea_label_edit_node");

  var type_node = type_node_select.node().value;
  var description_node = description_node_textarea.node().value;
  if (description_node == "")
    description_node = thisGraph.customNodes.blankNodeLabel;

  thisGraph.state.openedNode.__data__.type = type_node;
  thisGraph.state.openedNode.__data__.label = description_node;

  thisGraph.saveEditNode();

  el.select("#fo_content_edit_node").remove();
  thisGraph.displayText(el);

  el
    .select("#circle_id")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("cx", thisGraph.nodeIdCircle.cxClosed)
    .attr("cy", thisGraph.nodeIdCircle.cyClosed)

  el
    .select("#text_id")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("dx", thisGraph.nodeIdCircle.dxClosed)
    .attr("dy", thisGraph.nodeIdCircle.dyClosed)

  el
    .select("#circle_type")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("cx", thisGraph.nodeTypeIcon.cxClosed)
    .attr("cy", thisGraph.nodeTypeIcon.cyClosed)

  el
    .select("#fo_type_image")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("x", thisGraph.nodeTypeIcon.xClosed)
    .attr("y", thisGraph.nodeTypeIcon.yClosed)

  el.select("#nodecircle")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("x", -thisGraph.customNodes.widthClosed/2)
    .attr("y", -thisGraph.customNodes.heightClosed/2)
    .attr("width", thisGraph.customNodes.widthClosed)
    .attr("height", thisGraph.customNodes.heightClosed)

  thisGraph.state.openedNode = null;

  if (thisGraph.config.debug) console.log("closeEditNode end");
}

FluidGraph.prototype.saveEditNode = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("saveEditNode start");

  var openedNodeData = thisGraph.state.openedNode.__data__;
  thisGraph.d3data.nodes[openedNodeData.id].type = openedNodeData.type;
  thisGraph.d3data.nodes[openedNodeData.id].label = openedNodeData.label;
  thisGraph.changeTypeNode(thisGraph.state.openedNode,openedNodeData.type);
  thisGraph.changeLabelNode(thisGraph.state.openedNode,openedNodeData.label);

  if (thisGraph.config.debug) console.log("saveEditNode end");
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
  var thisGraph = this;

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
    newnode.identifier = thisGraph.config.uriBase + (thisGraph.d3data.nodes.length);
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

  if (thisGraph.state.openedNode)
    var openedNode = thisGraph.state.openedNode

  if (d3node.node() != openedNode)
  {
    thisGraph.state.mouseDownNode = d;
    thisGraph.state.selectedNode = d;
    thisGraph.state.svgMouseDownNode = d3node;

    //initialise drag_line position on this node
    thisGraph.drag_line.attr("d", "M" + thisGraph.state.mouseDownNode.x + " " + thisGraph.state.mouseDownNode.y + " L" + thisGraph.state.mouseDownNode.x + " " + thisGraph.state.mouseDownNode.y)
  }

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
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteNode start");

  if (thisGraph.d3data.nodes.length > 0) {
    //delete args or the first if not arg.
    var nodeIdentifier = nodeIdentifier || thisGraph.d3data.nodes[0].identifier;
    index = thisGraph.searchIndexOfNodeId(thisGraph.d3data.nodes, nodeIdentifier);

    //delete node
    var tab = ["a","b","c"];
    tab.splice(1,1);
    var id = thisGraph.d3data.nodes.indexOf(index);

    thisGraph.d3data.nodes.splice(index, 1);

    //delete edges linked to this (old) node
    thisGraph.spliceLinksForNode(index);
    thisGraph.state.selectedNode = null;
    thisGraph.drawGraph();
  } else {
    console.log("No node to delete !");
  }
  if (thisGraph.config.debug) console.log("deleteNode end");
}
