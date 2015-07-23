FluidGraph.prototype.drawLinks = function(svgLinks){
  thisGraph = this;

  if (thisGraph.debug) console.log("drawLinks start");

  svgLinks.attr("id", "path")
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

  if (thisGraph.debug) console.log("drawLinks end");
}

FluidGraph.prototype.linkEdit = function(d3node, d){
  thisGraph = this;

  if (thisGraph.debug) console.log("linkEdit start");

  d3.event.stopPropagation();
  console.log("linkEdit");

  if (thisGraph.debug) console.log("linkEdit end");
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

  if (thisGraph.debug) console.log("addLink start");

  // draw link between mouseDownNode and this node
  var newlink = { source: thisGraph.searchIndexOfNodeId(d3data.nodes,sourceid),
                  target: thisGraph.searchIndexOfNodeId(d3data.nodes,targetid)};

  thisGraph.d3data.edges.push(newlink);

  thisGraph.drawGraph();

  if (thisGraph.debug) console.log("addLink end");
}

FluidGraph.prototype.linkOnMouseDown = function(d3path, d){
  var thisGraph = this;

  if (thisGraph.debug) console.log("linkOnMouseDown start");

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

  if (thisGraph.debug) console.log("linkOnMouseDown end");
}

FluidGraph.prototype.deleteLink = function(selectedLink) {
  //In console mode "this" is myGraph (executed by : myGraph.deleteNode())
  thisGraph = this;

  if (thisGraph.debug) console.log("deleteLink start");

  if (thisGraph.d3data.edges.length > 0)
  {
    thisGraph.d3data.edges.splice(thisGraph.d3data.edges.indexOf(selectedLink), 1);
    thisGraph.state.selectedLink = null;
    thisGraph.drawGraph();
  }
  else {
    console.log("No edge to delete !");
  }

  if (thisGraph.debug) console.log("deleteLink end");
}
