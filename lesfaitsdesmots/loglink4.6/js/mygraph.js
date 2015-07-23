// define graph object
var FluidGraph = function (firstBgElement,d3data){
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
    force : "Off",
    elastic : "Off",
    uriBase : "http://fluidlog.com/", //Warning : with LDP, no uriBase... :-)
    linkDistance : 100,
    charge : -1000,
    debug : true,
  };

  thisGraph.customNodes = {
    strokeWidth : 7,
    strokeColor: "#DDD",
    strokeSelectedColor: "#999",
  }

  thisGraph.customEdges = {
    strokeWidth: 7,
    strokeColor: "#DDD",
    strokeSelectedColor: "#999",
  }

  thisGraph.firstBgElement = firstBgElement || [],
  thisGraph.d3data = d3data || [],
  thisGraph.bgElement = null,
  thisGraph.svgNodesEnter = [],
  thisGraph.svgLinksEnter = [],
  thisGraph.width = window.innerWidth - 30,
  thisGraph.height = window.innerHeight - 30,
  thisGraph.nodeidct = null,

  //mouse event vars
  thisGraph.state = {
    selectedNode : null,
    selectedEdge : null,
    mouseDownNode : null,
    mouseDownLink : null,
    svgMouseDownNode : null,
    mouseUpNode : null,
    lastKeyDown : -1,
  }
}

// Come from : https://github.com/cjrd/directed-graph-creator/blob/master/graph-creator.js
FluidGraph.prototype.consts =  {
  selectedClass: "selected",
  connectClass: "connect-node",
  circleGClass: "conceptG",
  graphClass: "graph",
  activeEditId: "active-editing",
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50,
};

/*
*
*           functions
*
****************************/

//rescale g
FluidGraph.prototype.rescale = function(){
  if (thisGraph.debug) console.log("rescale start");

  //Here, "this" is the <g> where mouse double-clic
  thisGraph = window.myGraph;

  thisGraph.bgElement.attr("transform",
    "translate(" + d3.event.translate + ")"
    + " scale(" + d3.event.scale + ")");

  if (thisGraph.debug) console.log("rescale end");
}

//Create a balise SVG with events
FluidGraph.prototype.initSgvContainer = function(bgElementId){
  var thisGraph = this;

  if (thisGraph.debug) console.log("initSgvContainer start");

  // listen for key events
  d3.select(window).on("keydown", function(){
    thisGraph.bgKeyDown.call(thisGraph);
  })
  .on("keyup", function(){
    thisGraph.bgKeyUp.call(thisGraph);
  });

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
  else  {  //panzoom
    var outer = d3.select(div)
          .append("svg")
          .attr("width", thisGraph.width)
          .attr("height", thisGraph.height)

    svg = outer
      .append('g')
      .call(d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", thisGraph.rescale))
      .on("dblclick.zoom", null)
      .on("click", null)
      .on("dblclick", thisGraph.addNode)
      .append('g')
      .attr('id', bgElementId)
      .on("mousedown", function(d){
        thisGraph.bgOnMouseDown.call(thisGraph, d)})
      .on("mousemove", function(d){
        thisGraph.bgOnMouseMove.call(thisGraph, d)})
	    .on("mouseup", function(d){
        thisGraph.bgOnMouseUp.call(thisGraph, d)})

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
                          .attr("class", "drag_line")
                          .attr("stroke-dasharray", "5,5")
                          .attr("stroke", "#999")
                          .attr("stroke-width", "2")
                          .attr("d", "M0 0 L0 0")
                          .attr("visibility", "hidden");

  if (thisGraph.debug) console.log("initSgvContainer end");
}

FluidGraph.prototype.activateForce = function(){
  var thisGraph = this;

  if (thisGraph.debug) console.log("activateForce start");

  thisGraph.force = d3.layout.force()
                        .nodes(thisGraph.d3data.nodes)
                        .links(thisGraph.d3data.edges)
                        .size([thisGraph.width, thisGraph.height])
                        .linkDistance(100)
                        .charge(-1000)

  if (thisGraph.config.elastic == "On")  {
    thisGraph.force.start()
    thisGraph.force.on("tick", function(args){
      thisGraph.movexy.call(thisGraph, args)})
  }  else { // Off
    // Run the layout a fixed number of times.
  	// The ideal number of times scales with graph complexity.
    thisGraph.force.start();
  	for (var i = 1000; i > 0; --i) thisGraph.force.tick();
    thisGraph.force.stop();
  }

  if (thisGraph.debug) console.log("activateForce end");
}

FluidGraph.prototype.drawGraph = function(){
  var thisGraph = this;

  if (thisGraph.debug) console.log("drawGraph start");

  if (typeof thisGraph.d3data.nodes != "undefined")
  {
    //Update of the nodes
    thisGraph.nodeidct = 0;
    myGraph.d3data.nodes.forEach(function(node)
            {
              thisGraph.nodeidct++;
              if (typeof myGraph.d3data.nodes.px == "undefined")
              {
                node.px = node.x;
                node.py = node.y;
                node.weight = 1;
              }

            });

    thisGraph.svgNodesEnter = thisGraph.bgElement.selectAll("#node")
    				              .data(thisGraph.d3data.nodes)

    thisGraph.svgNodes = thisGraph.svgNodesEnter
                                .enter()
                        				.append("g")
                        				.attr("id", "node")
                                .on("mousedown",function(d){
                                  thisGraph.nodeOnMouseDown.call(thisGraph, d3.select(this), d)})
                                .on("mouseup",function(d){
                                  thisGraph.nodeOnMouseUp.call(thisGraph, d3.select(this), d)})
                                .call(d3.behavior.drag()
                                          .on("dragstart", function(args){
                                            thisGraph.dragstart.call(thisGraph, args)})
                                          .on("drag", function(args){
                                            thisGraph.dragmove.call(thisGraph, args)})
                                          .on("dragend", function(args){
                                            thisGraph.dragend.call(thisGraph, args)})
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


    //Update links
    // Without force :
    // once you have object nodes, you can create d3data.edges without force.links() function

    // From the second time, we check every edges to see if there are number to replace by nodes objects
    thisGraph.d3data.edges.forEach(function(link)
            {
              if (typeof(link.source) == "number")
              {
                link.source = thisGraph.d3data.nodes[link.source];
                link.target = thisGraph.d3data.nodes[link.target];
              }
            });

    thisGraph.svgLinksEnter = thisGraph.bgElement.selectAll("#path")
                  			.data(thisGraph.d3data.edges)

    thisGraph.svgLinks = thisGraph.svgLinksEnter
                        .enter()
                        .insert("path", "#node")
                        .attr("id", "path")
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
                        .on("mousedown", function(d){
                          thisGraph.pathOnMouseDown.call(thisGraph, d3.select(this), d);
                          }
                        )
                        .on("mouseup", function(d){
                          thisGraph.state.mouseDownLink = null;
                        });


    //delete node if there's less object in svgNodes array than in DOM
    thisGraph.svgNodesEnter.exit().remove();
    //idem for edges
    thisGraph.svgLinksEnter.exit().remove();

    if (myGraph.config.force == "Off")
    {
      thisGraph.movexy.call(thisGraph);
    }
  }

  if (thisGraph.debug) console.log("drawGraph end");
}


FluidGraph.prototype.movexy = function(d){
  thisGraph = this;

  if (thisGraph.debug) console.log("movexy start");

  if (isNaN(thisGraph.svgNodesEnter[0][0].__data__.x))
  {
    console.log("movexy problem if tick...",thisGraph.svgNodesEnter[0][0].__data__.x)
    throw new Error("movexy still problem if tick :-)...");
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

  if (thisGraph.debug) console.log("movexy end");
}

FluidGraph.prototype.fixUnfixNode = function(d3node,d)
{
  // if (typeof d3node.name != "undefined")
  // {
  //   thisNode = this;
  // }
  // else
  // {
  //   thisNode = d3node.node();
  // }

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

FluidGraph.prototype.replaceSelectEdge = function(d3Path, edgeData){
  var thisGraph = this;
  d3Path.classed(thisGraph.consts.selectedClass, true);
  if (thisGraph.state.selectedEdge){
    thisGraph.removeSelectFromEdge();
  }
  thisGraph.state.selectedEdge = edgeData;
};

FluidGraph.prototype.removeSelectFromEdge = function(){
  var thisGraph = this;
  thisGraph.svgLinksEnter.filter(function(cd){
    return cd === thisGraph.state.selectedEdge;
  }).classed(thisGraph.consts.selectedClass, false);
  thisGraph.state.selectedEdge = null;
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

FluidGraph.prototype.pathOnMouseDown = function(d3path, d){
  var thisGraph = this;

  if (thisGraph.debug) console.log("pathOnMouseDown start");

  d3.event.stopPropagation();
  thisGraph.state.mouseDownLink = d;

  if (thisGraph.state.selectedNode){
    thisGraph.removeSelectFromNode();
  }

  var prevEdge = thisGraph.state.selectedEdge;
  if (!prevEdge || prevEdge !== d){
    thisGraph.replaceSelectEdge(d3path, d);
  } else{
    thisGraph.removeSelectFromEdge();
  }

  if (thisGraph.debug) console.log("pathOnMouseDown end");
}

FluidGraph.prototype.bgOnMouseDown = function(d){
  thisGraph = this;

  if (thisGraph.debug) console.log("bgOnMouseDown start");

  if (thisGraph.state.selectedEdge){
    thisGraph.removeSelectFromEdge();
  }

  if (thisGraph.state.selectedNode){
    thisGraph.fixUnfixNode(thisGraph.state.svgMouseDownNode,d);
  }

  //If it still exist somthing "selected", set to "unselected"
  d3.selectAll(".selected").classed(thisGraph.consts.selectedClass, false);

  if (thisGraph.debug) console.log("bgOnMouseDown start");
}

FluidGraph.prototype.bgOnMouseMove = function(d){
  thisGraph = this;

  if (thisGraph.debug) console.log("bgOnMouseMove start");

  // if the origin click is not a node, then pan the graph (activated by bgOnMouseDown)...
  if (!thisGraph.state.mouseDownNode) return;

  var xycoords = d3.mouse(thisGraph.bgElement.node());

  // update drag line
  thisGraph.drag_line.attr("d", "M"+thisGraph.state.mouseDownNode.x
                              +" "+thisGraph.state.mouseDownNode.y
                              +" L"+xycoords[0]
                              +" "+xycoords[1])

  if (thisGraph.debug) console.log("bgOnMouseMove end")
}

FluidGraph.prototype.bgOnMouseUp = function(d){
  thisGraph = this;

  if (thisGraph.debug) console.log("bgOnMouseUp start");

  if (!thisGraph.state.mouseDownNode)
  {
    thisGraph.resetMouseVars();
    if (thisGraph.debug) console.log("bgOnMouseUp end");
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

  if (thisGraph.debug) console.log("bgOnMouseUp end");
}

FluidGraph.prototype.dragstart = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.debug) console.log("dragstart start");

  d3.event.sourceEvent.stopPropagation();

  if (d.fixed != true)
  {
    thisGraph.drag_line.attr("visibility", "visible");
  }

  if (thisGraph.debug) console.log("dragstart end");
}

FluidGraph.prototype.dragmove = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.debug) console.log("dragmove start");

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

  if (thisGraph.debug) console.log("dragmove end");
}

FluidGraph.prototype.dragend = function(d, i) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.debug) console.log("dragend start");

  if (thisGraph.config.elastic == "On")
  {
    if (d.fixed != true)
    {
      thisGraph.movexy();
      thisGraph.force.start();
    }
  }

  if (thisGraph.debug) console.log("dragend end");
}

FluidGraph.prototype.searchIndexOfNodeId = function(o, searchTerm)
{
  for(var i = 0, len = o.length; i < len; i++) {
      if (o[i].identifier === searchTerm) return i;
  }
  return -1;
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

FluidGraph.prototype.deleteLink = function(selectedEdge) {
  //In console mode "this" is myGraph (executed by : myGraph.deleteNode())
  thisGraph = this;

  if (thisGraph.debug) console.log("deleteLink start");

  if (thisGraph.d3data.edges.length > 0)
  {
    thisGraph.d3data.edges.splice(thisGraph.d3data.edges.indexOf(selectedEdge), 1);
    thisGraph.state.selectedEdge = null;
    thisGraph.drawGraph();
  }
  else {
    console.log("No edge to delete !");
  }

  if (thisGraph.debug) console.log("deleteLink end");
}

// From https://github.com/cjrd/directed-graph-creator/blob/master/graph-creator.js
FluidGraph.prototype.bgKeyDown = function() {
  var thisGraph = this;

  if (thisGraph.debug) console.log("bgKeyDown start");

  // make sure repeated key presses don't register for each keydown
  if(thisGraph.state.lastKeyDown !== -1) return;

  thisGraph.state.lastKeyDown = d3.event.keyCode;
  var selectedNode = thisGraph.state.selectedNode,
      selectedEdge = thisGraph.state.selectedEdge;

  switch(d3.event.keyCode) {
  case thisGraph.consts.BACKSPACE_KEY:
  case thisGraph.consts.DELETE_KEY:
    d3.event.preventDefault();
    if (selectedNode){
      thisGraph.deleteNode(selectedNode.identifier)
    } else if (selectedEdge){
      thisGraph.deleteLink(selectedEdge)
    }
    break;
  }

  if (thisGraph.debug) console.log("bgKeyDown end");
}

FluidGraph.prototype.bgKeyUp = function() {
  this.state.lastKeyDown = -1;
};

FluidGraph.prototype.resetMouseVars = function()
{
  if (thisGraph.debug) console.log("resetMouseVars start");

  thisGraph.state.mouseDownNode = null;
  thisGraph.state.mouseUpNode = null;
  thisGraph.state.mouseDownLink = null;

  if (thisGraph.debug) console.log("resetMouseVars end");
}

FluidGraph.prototype.deleteGraph = function(skipPrompt) {
  thisGraph = this;

  if (thisGraph.debug) console.log("deleteGraph start");

  doDelete = true;
  if (!skipPrompt){
    doDelete = window.confirm("Press OK to delete this graph");
  }
  if(doDelete){
    thisGraph.resetMouseVars();
    thisGraph.d3data.nodes = [];
    thisGraph.d3data.edges = [];
    d3.selectAll("#node").remove();
    d3.selectAll("#path").remove();
  }

  if (thisGraph.debug) console.log("deleteGraph end");
}

FluidGraph.prototype.refreshGraph = function() {
  thisGraph = this;

  if (thisGraph.debug) console.log("refreshGraph start");

  thisGraph.resetMouseVars();
  if (myGraph.config.force == "On")
    myGraph.activateForce();

  myGraph.drawGraph();

  if (thisGraph.debug) console.log("refreshGraph end");
}

FluidGraph.prototype.downloadGraph = function() {
  thisGraph = this;

  if (thisGraph.debug) console.log("downloadGraph start");

  var saveEdges = [];
  thisGraph.d3data.edges.forEach(function(val, i){
    saveEdges.push({source: val.source.id, target: val.target.id});
  });
  var d3dataToSave = {"nodes": thisGraph.d3data.nodes, "edges": saveEdges};
  var blob = new Blob([window.JSON.stringify(d3dataToSave)], {type: "text/plain;charset=utf-8"});
  var now = new Date();
  var date_now = now.getDate()+"-"+now.getMonth()+1+"-"+now.getFullYear()+"-"+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
  saveAs(blob, "Carto-"+date_now+".d3json");

  if (thisGraph.debug) console.log("downloadGraph end");
}

FluidGraph.prototype.uploadGraph = function() {
  if (thisGraph.debug) console.log("uploadGraph start");

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var uploadFile = this.files[0];
    var filereader = new window.FileReader();

    filereader.onload = function(){
      var txtRes = filereader.result;
      // TODO better error handling
      try{
        var jsonObj = JSON.parse(txtRes);
        thisGraph.deleteGraph(true);
        thisGraph.d3data.nodes = jsonObj.nodes;

        var newEdges = jsonObj.edges;
        newEdges.forEach(function(e, i){
          newEdges[i] = {source: thisGraph.d3data.nodes.filter(function(n){return n.id == e.source;})[0],
                      target: thisGraph.d3data.nodes.filter(function(n){return n.id == e.target;})[0]};
        });
        thisGraph.d3data.edges = newEdges;
        thisGraph.drawGraph();
      }catch(err){
        window.alert("Error parsing uploaded file\nerror message: " + err.message);
        return;
      }
    };
    filereader.readAsText(uploadFile);

  } else {
    alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
  }

  if (thisGraph.debug) console.log("uploadGraph end");
}

function checkboxInitialisation() {
  thisGraph = this;

  if (thisGraph.debug) console.log("checkboxInitialisation end");

  if (myGraph.config.force == 'On')
    $('#activeForceCheckbox').checkbox('check');
  else
    $('#activeForceCheckbox').checkbox('uncheck');

  if (myGraph.config.elastic == 'On')
    $('#activeElasticCheckbox').checkbox('check');
  else
    $('#activeElasticCheckbox').checkbox('uncheck');

    if (thisGraph.debug) console.log("checkboxInitialisation end");
}
