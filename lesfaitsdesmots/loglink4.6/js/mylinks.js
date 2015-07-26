FluidGraph.prototype.drawLinks = function(svgLinks){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("drawLinks start");

  if (thisGraph.config.curvesLinks)
  {
    svgLinks.attr("id", "path")
            .attr("stroke", thisGraph.customEdges.strokeColor)
            .attr("stroke-width", thisGraph.customEdges.strokeWidth)
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
  else { //false
    svgLinks.attr("id", "path")
            .attr("stroke", thisGraph.customEdges.strokeColor)
            .attr("stroke-width", thisGraph.customEdges.strokeWidth)
            .attr("x1", function(d) { return d.source.x; })
    		  	.attr("y1", function(d) { return d.source.y; })
    		  	.attr("x2", function(d) { return d.target.x; })
    		  	.attr("y2", function(d) { return d.target.y; })     
  }

  if (thisGraph.config.debug) console.log("drawLinks end");
}

FluidGraph.prototype.linkEdit = function(d3node, d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("linkEdit start");

  d3.event.stopPropagation();
  console.log("linkEdit");

  if (thisGraph.config.debug) console.log("linkEdit end");
}

FluidGraph.prototype.spliceLinksForNode = function (nodeid) {
  thisGraph = this;

  var toSplice = thisGraph.d3data.edges.filter(
    function(l) {
      return (l.source.id === nodeid) || (l.target.id === nodeid); });

  toSplice.map(
    function(l) {
      thisGraph.d3data.edges.splice(thisGraph.d3data.edges.indexOf(l), 1); });
}

FluidGraph.prototype.replaceSelectLinks = function(d3Path, edgeData){
  var thisGraph = this;
  d3Path.classed(thisGraph.consts.selectedClass, true);
  if (thisGraph.state.selectedLink){
    thisGraph.removeSelectFromLinks();
  }
  thisGraph.state.selectedLink = edgeData;
};

FluidGraph.prototype.removeSelectFromLinks = function(){
  var thisGraph = this;
  thisGraph.svgLinksEnter.filter(function(cd){
    return cd === thisGraph.state.selectedLink;
  }).classed(thisGraph.consts.selectedClass, false);
  thisGraph.state.selectedLink = null;
};

FluidGraph.prototype.addLink = function(sourceid, targetid)
{
  thisGraph = myGraph;

  if (thisGraph.config.debug) console.log("addLink start");

  // draw link between mouseDownNode and this node
  var newlink = { source: thisGraph.searchIndexOfNodeId(d3data.nodes,sourceid),
                  target: thisGraph.searchIndexOfNodeId(d3data.nodes,targetid)};

  thisGraph.d3data.edges.push(newlink);

  thisGraph.drawGraph();

  if (thisGraph.config.debug) console.log("addLink end");
}

FluidGraph.prototype.linkOnMouseDown = function(d3path, d){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("linkOnMouseDown start");

  d3.event.stopPropagation();
  thisGraph.state.mouseDownLink = d;

  if (thisGraph.state.selectedNode){
    thisGraph.removeSelectFromNode();
  }

  var prevEdge = thisGraph.state.selectedLink;
  if (!prevEdge || prevEdge !== d){
    thisGraph.replaceSelectLinks(d3path, d);
  } else{
    thisGraph.removeSelectFromLinks();
  }

  if (thisGraph.config.debug) console.log("linkOnMouseDown end");
}

FluidGraph.prototype.deleteLink = function(selectedLink) {
  //In console mode "this" is myGraph (executed by : myGraph.deleteNode())
  thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteLink start");

  if (thisGraph.d3data.edges.length > 0)
  {
    thisGraph.d3data.edges.splice(thisGraph.d3data.edges.indexOf(selectedLink), 1);
    thisGraph.state.selectedLink = null;
    thisGraph.drawGraph();
  }
  else {
    console.log("No edge to delete !");
  }

  if (thisGraph.config.debug) console.log("deleteLink end");
}
