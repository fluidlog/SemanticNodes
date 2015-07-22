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
  };

  thisGraph.firstBgElement = firstBgElement || [],
  thisGraph.d3data = d3data || [],
  thisGraph.bgElement = null,
  thisGraph.svgNodesEnter = [],
  thisGraph.svgLinksEnter = [],
  thisGraph.width = window.innerWidth - 30,
  thisGraph.height = window.innerHeight - 30,
  thisGraph.nodeidct = null,

  //mouse event vars
  thisGraph.selected_node = null,
  thisGraph.selected_link = null,
  thisGraph.mouseDownNode = null,
  thisGraph.svgMouseDownNode = null,
  thisGraph.mouseUpNode = null,
  thisGraph.mouseDownLink = null;

}

var sem = 1; //semaphore

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
                          .attr("stroke-dasharray", "5,5")
                          .attr("stroke", "#999")
                          .attr("stroke-width", "2")
                          .attr("d", "M0 0 L0 0")
                          .attr("visibility", "hidden");
  // console.log("initSgvContainer end");
}

FluidGraph.prototype.activateForce = function(){
  // console.log("activateForce start");

  var thisGraph = this;

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

  // console.log("activateForce end");
}

FluidGraph.prototype.drawGraph = function(){
  console.log("drawGraph start");

  var thisGraph = this;

  //Update of the nodes
  if (typeof thisGraph.d3data.nodes != "undefined")
  {
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


    //delete node if there's less object in svgNodes array than in DOM
    thisGraph.svgNodesEnter.exit().remove();
    //idem for edges
    thisGraph.svgLinksEnter.exit().remove();

    if (myGraph.config.force == "Off")
    {
      thisGraph.movexy.call(thisGraph);
    }
  }

  console.log("drawGraph end");
}


FluidGraph.prototype.movexy = function(d)
{
  // if (sem)
  // {
    // console.log("movexy start");

    thisGraph = this;

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

    // console.log("movexy end");
  // }
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

  console.log("fixUnfixNode end");
  return status;
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

  console.log("addnode end");
  return newnode.identifier;
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

FluidGraph.prototype.nodeOnMouseDown = function(d3node,d)
{
  console.log("nodeOnMouseDown start");

  thisGraph = this;

  // sem = 0;

  thisGraph.mouseDownNode = d;
  thisGraph.svgMouseDownNode = d3node;

  //initialise drag_line position on this node
  thisGraph.drag_line.attr("d", "M"+thisGraph.mouseDownNode.x
                              +" "+thisGraph.mouseDownNode.y
                              +" L"+thisGraph.mouseDownNode.x
                              +" "+thisGraph.mouseDownNode.y)

  console.log("nodeOnMouseDown end");
}

FluidGraph.prototype.nodeOnMouseUp = function(d3node,d)
{
  console.log("nodeOnMouseUp start");
  thisGraph = this;

  // if we clicked on an origin node
  if (thisGraph.mouseDownNode)
  {
    thisGraph.mouseUpNode = d;
    // if we clicked on the same node, reset vars
    if (thisGraph.mouseUpNode.identifier == thisGraph.mouseDownNode.identifier)
    {
      thisGraph.fixUnfixNode(thisGraph.svgMouseDownNode.node());
      thisGraph.resetMouseVars();
      // sem = 1;
      return;
    }

    thisGraph.fixUnfixNode(thisGraph.svgMouseDownNode.node());
    thisGraph.drag_line.attr("visibility", "hidden");
    thisGraph.addLink(thisGraph.mouseDownNode.identifier,thisGraph.mouseUpNode.identifier);
    thisGraph.resetMouseVars();
    // sem = 1;
  }

  console.log("nodeOnMouseUp end");
}

FluidGraph.prototype.bgOnMouseMove = function()
{
  // console.log("bgOnMouseMove start");
  thisGraph = this;

  // if the origin click is not a node, then pan the graph (activated by bgOnMouseDown)...
  if (!thisGraph.mouseDownNode) return;

  var xycoords = d3.mouse(thisGraph.bgElement.node());

  // update drag line
  thisGraph.drag_line.attr("d", "M"+thisGraph.mouseDownNode.x
                              +" "+thisGraph.mouseDownNode.y
                              +" L"+xycoords[0]
                              +" "+xycoords[1])

  // console.log("bgOnMouseMove end")
}

FluidGraph.prototype.bgOnMouseUp = function()
{
  console.log("bgOnMouseUp start");
  thisGraph = this;

  if (!thisGraph.mouseDownNode)
  {
    thisGraph.resetMouseVars();
    return;
  }

  var xycoords = d3.mouse(thisGraph.bgElement.node());

  var d3svgMouseDownNode = d3.select(thisGraph.svgMouseDownNode.node());

  thisGraph.drag_line.attr("visibility", "hidden");
  thisGraph.fixUnfixNode(thisGraph.svgMouseDownNode.node());
  var newnodeidentifier = thisGraph.addNode({x:xycoords[0],
                                              y:xycoords[1],
                                              px:xycoords[0],
                                              py:xycoords[1]});

  thisGraph.addLink(thisGraph.mouseDownNode.identifier, newnodeidentifier);

  thisGraph.resetMouseVars();

  console.log("bgOnMouseUp end");
}

FluidGraph.prototype.dragstart = function(d, i) {
  console.log("dragstart start");

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  d3.event.sourceEvent.stopPropagation();

  if (d.fixed != true)
  {
    thisGraph.drag_line.attr("visibility", "visible");
  }

  console.log("dragstart end");
}

FluidGraph.prototype.dragmove = function(d, i) {
  // console.log("dragmove start");

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

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

  // console.log("dragmove end");
}

FluidGraph.prototype.dragend = function(d, i) {
  console.log("dragend start");

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

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


FluidGraph.prototype.deleteNode = function(nodeidentifier) {
  // console.log("deleteNode start");

  //In console mode "this" is myGraph (executed by : myGraph.deleteNode())
  thisGraph = this;

  if (thisGraph.d3data.nodes.length > 0)
  {
    //delete args or the first if not arg.
    var nodeidentifier = nodeidentifier || thisGraph.d3data.nodes[0].identifier;
    index = thisGraph.searchIndexOfNodeId(thisGraph.d3data.nodes, nodeidentifier);

    //delete node
    thisGraph.d3data.nodes.splice(thisGraph.d3data.nodes.indexOf(index), 1);

    //delete edges linked to this (old) node
    thisGraph.spliceLinksForNode(index);
    thisGraph.drawGraph();
  }
  else {
    console.log("No node to delete !");
  }
  // console.log("deleteNode end");
}

FluidGraph.prototype.resetMouseVars = function()
{
  thisGraph.mouseDownNode = null;
  thisGraph.svgMouseDownNode = null;
  thisGraph.mouseUpNode = null;
  thisGraph.mouseDownLink = null;
}

FluidGraph.prototype.deleteGraph = function(skipPrompt) {
  // console.log("deleteGraph start");

  thisGraph = this;

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
  // console.log("deleteGraph end");
}

FluidGraph.prototype.refreshGraph = function() {
  // console.log("deleteGraph start");

  thisGraph = this;
  thisGraph.resetMouseVars();
  if (myGraph.config.force == "On")
    myGraph.activateForce();

  myGraph.drawGraph();

  // console.log("deleteGraph end");
}

FluidGraph.prototype.downloadGraph = function() {
  // console.log("downloadGraph start");

  thisGraph = this;

  var saveEdges = [];
  thisGraph.d3data.edges.forEach(function(val, i){
    saveEdges.push({source: val.source.id, target: val.target.id});
  });
  var d3dataToSave = {"nodes": thisGraph.d3data.nodes, "edges": saveEdges};
  var blob = new Blob([window.JSON.stringify(d3dataToSave)], {type: "text/plain;charset=utf-8"});
  var now = new Date();
  var date_now = now.getDate()+"-"+now.getMonth()+1+"-"+now.getFullYear()+"-"+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
  saveAs(blob, "Carto-"+date_now+".d3json");

  // console.log("downloadGraph end");
}

FluidGraph.prototype.uploadGraph = function() {
  // console.log("uploadGraph start");

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

  // console.log("uploadGraph end");
}

function checkboxInitialisation() {
  if (myGraph.config.force == 'On')
    $('#activeForceCheckbox').checkbox('check');
  else
    $('#activeForceCheckbox').checkbox('uncheck');

  if (myGraph.config.elastic == 'On')
    $('#activeElasticCheckbox').checkbox('check');
  else
    $('#activeElasticCheckbox').checkbox('uncheck');
}
