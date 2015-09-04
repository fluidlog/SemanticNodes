FluidGraph.prototype.drawLinks = function(svgLinks){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("drawLinks start");

  if (thisGraph.customLinks.curvesLinks)
  {
    svgLinks.attr("id", "link")
            .attr("class", "link")
            .attr("stroke", thisGraph.customLinks.strokeColor)
            .attr("stroke-width", thisGraph.customLinks.strokeWidth)
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
    svgLinks.attr("id", "link")
            .attr("class", "link")
            .attr("stroke", thisGraph.customLinks.strokeColor)
            .attr("stroke-width", thisGraph.customLinks.strokeWidth)
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
  var thisGraph = this;

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
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("addLink start");

  // draw link between mouseDownNode and this new node
  var sourceObj = thisGraph.d3data.nodes[thisGraph.searchIndexOfNodeId(thisGraph.d3data.nodes,sourceid)];
  var targetObj = thisGraph.d3data.nodes[thisGraph.searchIndexOfNodeId(thisGraph.d3data.nodes,targetid)];
  var newlink = { source: sourceObj,
                  target: targetObj};

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

FluidGraph.prototype.deleteLink = function() {
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteLink start");

  if (thisGraph.d3data.edges.length > 0)
  {
    thisGraph.d3data.edges.splice(thisGraph.d3data.edges.indexOf(thisGraph.state.selectedLink), 1);
    thisGraph.state.selectedLink = null;
    thisGraph.drawGraph();
  }
  else {
    console.log("No link to delete !");
  }

  if (thisGraph.config.debug) console.log("deleteLink end");
}
