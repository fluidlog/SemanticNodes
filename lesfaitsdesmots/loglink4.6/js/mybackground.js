FluidGraph.prototype.bgOnMouseDown = function(d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("bgOnMouseDown start");

  if (thisGraph.state.selectedLink){
    thisGraph.removeSelectFromLinks();
  }

  if (thisGraph.state.selectedNode){
    thisGraph.fixUnfixNode(thisGraph.state.svgMouseDownNode,d);
  }

  //If it still exist somthing "selected", set to "unselected"
  d3.selectAll("#path.selected").classed(thisGraph.consts.selectedClass, false);
  d3.selectAll("#nodecircle.selected").classed(thisGraph.consts.selectedClass, false);

  if (thisGraph.config.debug) console.log("bgOnMouseDown start");
}

FluidGraph.prototype.bgOnMouseMove = function(d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("bgOnMouseMove start");

  // if the origin click is not a node, then pan the graph (activated by bgOnMouseDown)...
  if (!thisGraph.state.mouseDownNode) return;

  var xycoords = d3.mouse(thisGraph.bgElement.node());

  // update drag line
  if (thisGraph.config.curvesLinks)
  {
    thisGraph.drag_line.attr("d", function(d) {
             var dx = xycoords[0] - thisGraph.state.mouseDownNode.x,
                  dy = xycoords[1] - thisGraph.state.mouseDownNode.y,
                  dr = Math.sqrt(dx * dx + dy * dy);
             return "M" +
                  thisGraph.state.mouseDownNode.x + "," +
                  thisGraph.state.mouseDownNode.y + "A" +
                  dr + "," + dr + " 0 0,1 " +
                  xycoords[0] + "," +
                  xycoords[1];
                })
                .style("fill", "none")
  }
  else{ //false
    thisGraph.drag_line.attr("x1", thisGraph.state.mouseDownNode.x)
                	      .attr("y1", thisGraph.state.mouseDownNode.y)
                	      .attr("x2", xycoords[0])
                	      .attr("y2", xycoords[1]);
  }

  if (thisGraph.config.debug) console.log("bgOnMouseMove end")
}

FluidGraph.prototype.bgOnMouseUp = function(d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("bgOnMouseUp start");

  if (!thisGraph.state.mouseDownNode)
  {
    thisGraph.resetMouseVars();
    if (thisGraph.config.debug) console.log("bgOnMouseUp end");
    return;
  }

  var xycoords = d3.mouse(thisGraph.bgElement.node());

  thisGraph.drag_line.attr("visibility", "hidden");
  thisGraph.fixUnfixNode(thisGraph.state.svgMouseDownNode);
  var newnodeidentifier = thisGraph.addNode({x:xycoords[0],
                                              y:xycoords[1],
                                              });

  thisGraph.addLink(thisGraph.state.mouseDownNode.identifier, newnodeidentifier);

  thisGraph.resetMouseVars();

  if (thisGraph.config.debug) console.log("bgOnMouseUp end");
}

// From https://github.com/cjrd/directed-graph-creator/blob/master/graph-creator.js
FluidGraph.prototype.bgKeyDown = function() {
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("bgKeyDown start");

  // make sure repeated key presses don't register for each keydown
  if(thisGraph.state.lastKeyDown !== -1) return;

  thisGraph.state.lastKeyDown = d3.event.keyCode;
  var selectedNode = thisGraph.state.selectedNode,
      selectedLink = thisGraph.state.selectedLink;

  switch(d3.event.keyCode) {
  case thisGraph.consts.BACKSPACE_KEY:
  case thisGraph.consts.DELETE_KEY:
    d3.event.preventDefault();
    if (selectedNode){
      thisGraph.deleteNode(selectedNode.identifier)
    } else if (selectedLink){
      thisGraph.deleteLink(selectedLink)
    }
    break;
  }

  if (thisGraph.config.debug) console.log("bgKeyDown end");
}

FluidGraph.prototype.bgKeyUp = function() {
  this.state.lastKeyDown = -1;
};
