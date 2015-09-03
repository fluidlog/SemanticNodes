function menuInitialisation(myGraph) {

  if (myGraph.config.debug) console.log("checkboxInitialisation start");

  $('#focusContextNodeOff').hide();
  $('#curvesLinks').hide();

  if (myGraph.config.force == 'On')
    $('#activeForceCheckbox').checkbox('check');
  else
    $('#activeForceCheckbox').checkbox('uncheck');

  if (myGraph.config.elastic == 'On')
    $('#activeElasticCheckbox').checkbox('check');
  else
    $('#activeElasticCheckbox').checkbox('uncheck');

  if (myGraph.config.debug) console.log("checkboxInitialisation end");
}

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
    xNewNode : 100,
    yNewNode : 100,
    bgElementType : "panzoom", //choixe : "panzoom" or "simple"
    force : "Off",
    elastic : "Off",
    uriBase : "http://fluidlog.com/", //Warning : with LDP, no uriBase... :-)
    linkDistance : 100,
    charge : -1000,
    debug : false,
    version : "loglink46",
    newGraphName : "Untilted",
  };

  thisGraph.customNodes = {
    rectSvg : true, //False = circle
    sizeOfCircleNode : 20,
    strokeWidth : 10,
    strokeOpacity : .5,
    strokeColor: "#DDD",
    strokeSelectedColor: "#999",
    listType : ["without", "project","actor","idea","ressource"],
    colorType : {"project" : "#89A5E5",
                  "actor" : "#F285B9",
                  "idea" : "#FFD98D",
                  "ressource" : "#CDF989",
                  "without" : "white"},
    typeOfNewNode : "without",
  	colorTypeRgba : {"project" : "137,165,229",
                      "actor" : "242,133,185",
                      "idea" : "255,217,141",
                      "ressource" : "205,249,137",
                      "without" : "white"},
    imageType : {"project" : "lab", "actor" : "user", "idea" : "idea", "ressource" : "tree", "without" : "circle thin"},
    displayId : false,
    displayType : true,
    displayText : true,
    cursor : "move", //Value : grab or move (default), pointer, context-menu, text, crosshair, default
    bringNodeToFrontOnHover : false,
    widthClosed : 80,
		heightClosed : 80,
		widthOpened : 200,
		heightOpened : 200,
		curvesCorners : 50,
		widthStrokeHover : 20,
		transitionEasing : "elastic", //Values : linear (default), elastic
		transitionDurationOpen : 1000,
		transitionDurationClose : 500,
		transitionDelay : 0,
    blankNodeLabel : "New...",
    blankNodeType : "without",
  }

  thisGraph.nodeTypeIcon = {
    r : 13,
    cxClosed : 0,
    cxOpened : 0,
    cyClosed : (thisGraph.customNodes.heightClosed/2)-10,
    cyOpened : (thisGraph.customNodes.heightOpened/2)-10,
    xClosed : -11,
    xOpened : -11,
    yClosed : (thisGraph.customNodes.heightClosed/2)-20,
    yOpened : (thisGraph.customNodes.heightOpened/2)-20,
  }

  thisGraph.nodeIdCircle = {
    r : 10,
    cxClosed : 0,
    cyClosed : -(thisGraph.customNodes.heightClosed/2)+6,
    cxOpened : 0,
    cyOpened : -(thisGraph.customNodes.heightOpened/2),
    dxClosed : 0,
    dyClosed : -(thisGraph.customNodes.heightClosed/2)+10,
    dxOpened : 0,
    dyOpened : -(thisGraph.customNodes.heightOpened/2)+5,
  }

  thisGraph.customNodesText = {
    fontSize : 14,
    FontFamily : "Helvetica Neue, Helvetica, Arial, sans-serif;",
    strokeOpacity : .5,
    widthMax : 160,
		heightMax : thisGraph.customNodes.heightClosed,
  }

  thisGraph.customLinks = {
    strokeWidth: 7,
    strokeColor: "#DDD",
    strokeSelectedColor: "#999",
    curvesLinks : true,
  }

  thisGraph.graphName = thisGraph.config.newGraphName;
  thisGraph.listOfLocalGraphs = [];
  thisGraph.selectedGraphName = null;
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
    selectedLink : null,
    mouseDownNode : null,
    mouseDownLink : null,
    svgMouseDownNode : null,
    mouseUpNode : null,
    lastKeyDown : -1,
    openedNode : null,
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
  if (thisGraph.config.debug) console.log("rescale start");

  //Here, "this" is the <g> where mouse double-clic
  thisGraph = window.myGraph;

  thisGraph.bgElement.attr("transform",
    "translate(" + d3.event.translate + ")"
    + " scale(" + d3.event.scale + ")");

  if (thisGraph.config.debug) console.log("rescale end");
}

//Create a balise SVG with events
FluidGraph.prototype.initSgvContainer = function(bgElementId){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("initSgvContainer start");

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

  thisGraph.initDragLine();

  if (thisGraph.config.debug) console.log("initSgvContainer end");
}

FluidGraph.prototype.initDragLine = function(){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("initDragLine start");

  // line displayed when dragging new nodes
  if (thisGraph.customLinks.curvesLinks)
  {
    thisGraph.drag_line = thisGraph.bgElement.append("path")
                          .attr("id", "drag_line")
                          .attr("class", "drag_line")
                          .attr("stroke-dasharray", "5,5")
                          .attr("stroke", "#999")
                          .attr("stroke-width", "2")
                          .attr("d", "M0 0 L0 0")
                          .attr("visibility", "hidden");
  }
  else {
    thisGraph.drag_line = thisGraph.bgElement.append("line")
                          .attr("id", "drag_line")
                          .attr("class", "drag_line")
                          .attr("stroke-dasharray", "5,5")
                          .attr("stroke", "#999")
                          .attr("stroke-width", "2")
                          .attr("x1", 0)
                    	    .attr("y1", 0)
                    	    .attr("x2", 0)
                    	    .attr("y2", 0)
                          .attr("visibility", "hidden");
  }

  if (thisGraph.config.debug) console.log("initDragLine start");
}

FluidGraph.prototype.activateForce = function(){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("activateForce start");

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

  if (thisGraph.config.debug) console.log("activateForce end");
}

FluidGraph.prototype.drawGraph = function(d3dataFc){
  var thisGraph = this;

  var dataToDraw = d3dataFc || thisGraph.d3data;

  if (thisGraph.config.debug) console.log("drawGraph start");

  if (typeof dataToDraw.nodes != "undefined")
  {
    //Update of the nodes
    thisGraph.nodeidct = 0;
    dataToDraw.nodes.forEach(function(node)
            {
              thisGraph.nodeidct++;
              if (typeof dataToDraw.nodes.px == "undefined")
              {
                node.px = node.x;
                node.py = node.y;
                node.weight = 1;
              }

            });

    thisGraph.svgNodesEnter = thisGraph.bgElement.selectAll("#node")
    				              .data(dataToDraw.nodes)

    thisGraph.svgNodes = thisGraph.svgNodesEnter
                                .enter()
                        				.append("g")
                        				.attr("id", "node")
                                .call(d3.behavior.drag()
                                          .on("dragstart", function(args){
                                            thisGraph.nodeOnDragStart.call(thisGraph, args)})
                                          .on("drag", function(args){
                                            thisGraph.nodeOnDragMove.call(thisGraph, args)})
                                          .on("dragend", function(args){
                                            thisGraph.nodeOnDragEnd.call(thisGraph, args)})
                                )

    if (thisGraph.config.force == "On" || thisGraph.config.elastic == "On")
    {
      thisGraph.svgNodes.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
    }

    thisGraph.drawNodes(thisGraph.svgNodes);

    //delete node if there's less object in svgNodes array than in DOM
    thisGraph.svgNodesEnter.exit().remove();

    //Update links
    // Without force :
    // once you have object nodes, you can create d3data.edges without force.links() function

    // From the second time, we check every edges to see if there are number to replace by nodes objects
    dataToDraw.edges.forEach(function(link)
            {
              if (typeof(link.source) == "number")
              {
                link.source = dataToDraw.nodes[link.source];
                link.target = dataToDraw.nodes[link.target];
              }
            });

    thisGraph.svgLinksEnter = thisGraph.bgElement.selectAll("#link")
                  			.data(dataToDraw.edges)

    if (thisGraph.customLinks.curvesLinks)
    {
      thisGraph.svgLinks = thisGraph.svgLinksEnter
                          .enter()
                          .insert("path", "#node")
    }
    else
    {
      thisGraph.svgLinks = thisGraph.svgLinksEnter
                          .enter()
                          .insert("line", "#node")
    }

    thisGraph.svgLinks.on("mousedown", function(d){
                          thisGraph.linkOnMouseDown.call(thisGraph, d3.select(this), d);
                          }
                        )
                        .on("mouseup", function(d){
                          thisGraph.state.mouseDownLink = null;
                        })
                        // .on("dblclick", function(d){
                        //   thisGraph.linkEdit.call(thisGraph, d3.select(this), d);
                        //   }
                        // )

                        thisGraph.svgLinks.attr("id", "link")
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
    // thisGraph.drawLinks(thisGraph.svgLinks);

    //delete link if there's less object in svgLinks array than in DOM
    thisGraph.svgLinksEnter.exit().remove();

    if (myGraph.config.force == "Off")
    {
      thisGraph.movexy.call(thisGraph);
    }
  }

  if (thisGraph.config.debug) console.log("drawGraph end");
}

FluidGraph.prototype.movexy = function(d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("movexy start");

  if (isNaN(thisGraph.svgNodesEnter[0][0].__data__.x))
  {
    console.log("movexy problem if tick...",thisGraph.svgNodesEnter[0][0].__data__.x)
    throw new Error("movexy still problem if tick :-)...");
  }

  if (thisGraph.customLinks.curvesLinks)
  {
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
  }
  else { //false
    thisGraph.svgLinksEnter.attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });
  }

  thisGraph.svgNodesEnter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  if (thisGraph.config.debug) console.log("movexy end");
}

FluidGraph.prototype.resetMouseVars = function()
{
  if (thisGraph.config.debug) console.log("resetMouseVars start");

  thisGraph.state.mouseDownNode = null;
  thisGraph.state.mouseUpNode = null;
  thisGraph.state.mouseDownLink = null;

  if (thisGraph.config.debug) console.log("resetMouseVars end");
}

FluidGraph.prototype.newGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("newGraph start");

  thisGraph.clearGraph();
  thisGraph.d3data.nodes = [{id:0, label: thisGraph.customNodes.blankNodeLabel, type: thisGraph.customNodes.blankNodeType, x:200, y:200, identifier:"http://fluidlog.com/0" }];
  thisGraph.drawGraph();

  if (thisGraph.config.debug) console.log("newGraph end");
}

FluidGraph.prototype.deleteGraph = function(skipPrompt) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteGraph start");

  doDelete = true;
  if (!skipPrompt){
    doDelete = window.confirm("Press OK to delete the graph named " + thisGraph.graphName);
  }
  if(doDelete){
    thisGraph.resetMouseVars();
    thisGraph.d3data.nodes = [];
    thisGraph.d3data.edges = [];
    d3.selectAll("#node").remove();
    d3.selectAll("#link").remove();
    d3.selectAll("#drag_line").remove();

    localStorage.removeItem(thisGraph.config.version+"|"+thisGraph.graphName);
    thisGraph.graphName = thisGraph.config.newGraphName
    $('#saveGraphLabel').text(thisGraph.graphName);
  }

  if (thisGraph.config.debug) console.log("deleteGraph end");
}

FluidGraph.prototype.clearGraph = function(skipPrompt) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteGraph start");

  thisGraph.resetMouseVars();
  thisGraph.d3data.nodes = [];
  thisGraph.d3data.edges = [];
  d3.selectAll("#node").remove();
  d3.selectAll("#link").remove();
  d3.selectAll("#drag_line").remove();

  thisGraph.graphName = thisGraph.config.newGraphName
  $('#saveGraphLabel').text(thisGraph.graphName);

  if (thisGraph.config.debug) console.log("deleteGraph end");
}

FluidGraph.prototype.refreshGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("refreshGraph start");

  thisGraph.resetMouseVars();
  if (myGraph.config.force == "On")
    myGraph.activateForce();

  d3.selectAll("#node").remove();
  d3.selectAll("#link").remove();
  d3.select("#drag_line").remove();
  myGraph.initDragLine()
  myGraph.drawGraph();

  if (thisGraph.config.debug) console.log("refreshGraph end");
}

FluidGraph.prototype.downloadGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("downloadGraph start");

  var blob = new Blob([thisGraph.jsonifyGraph()], {type: "text/plain;charset=utf-8"});
  var now = new Date();
  var date_now = now.getDate()+"-"+now.getMonth()+1+"-"+now.getFullYear()+"-"+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
  saveAs(blob, "Carto-"+date_now+".d3json");

  if (thisGraph.config.debug) console.log("downloadGraph end");
}

FluidGraph.prototype.jsonifyGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("jsonifyGraph start");

  var saveEdges = [];
  thisGraph.d3data.edges.forEach(function(val, i){
    saveEdges.push({source: val.source.id, target: val.target.id});
  });
  var d3dataToSave = window.JSON.stringify({"nodes": thisGraph.d3data.nodes, "edges": saveEdges});

  if (thisGraph.config.debug) console.log("jsonifyGraph end");

  return d3dataToSave;
}

FluidGraph.prototype.uploadGraph = function() {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("uploadGraph start");

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var uploadFile = this.files[0];
    var filereader = new window.FileReader();

    filereader.onload = function(){
      var txtRes = filereader.result;
      // TODO better error handling
      try{
        thisGraph.d3data = thisGraph.jsonD3ToD3Data(txtRes);
        thisGraph.deleteGraph(true);
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

  if (thisGraph.config.debug) console.log("uploadGraph end");
}

FluidGraph.prototype.jsonD3ToD3Data = function(jsonInput) {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("jsonGraphToData start");

  var d3data = {};
  var jsonObj = JSON.parse(jsonInput);
  d3data.nodes = jsonObj.nodes;

  var newEdges = jsonObj.edges;
  newEdges.forEach(function(e, i){
    newEdges[i] = {source: d3data.nodes.filter(function(n){return n.id == e.source;})[0],
                target: d3data.nodes.filter(function(n){return n.id == e.target;})[0]};
  });
  d3data.edges = newEdges;

  if (thisGraph.config.debug) console.log("jsonGraphToData end");

  return d3data;
}

FluidGraph.prototype.saveGraph = function() {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("saveGraph start");

  $('#saveGraphLabel').text(thisGraph.graphName);
  thisGraph.selectedGraphName = thisGraph.graphName;

  localStorage.setItem(thisGraph.config.version+"|"+thisGraph.graphName,thisGraph.jsonifyGraph())

  if (thisGraph.config.debug) console.log("saveGraph end");
}

FluidGraph.prototype.getContentLocalStorage = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("openGraph start");

  thisGraph.listOfLocalGraphs = [];
  Object.keys(localStorage)
      .forEach(function(key){
          var regexp = new RegExp(thisGraph.config.version);
           if (regexp.test(key)) {
             var keyvalue = [];
             keyvalue[0] = key.split("|").pop();
             keyvalue[1] = localStorage.getItem(key)

             thisGraph.listOfLocalGraphs.push(keyvalue)
           }
       });

  if (thisGraph.config.debug) console.log("openGraph end");
}

FluidGraph.prototype.displayContentModal = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayPreviewModal start");

  var selectGraph = d3.select('#graphSelection');
  if (selectGraph.node())
  {
    var selectedoption = selectGraph.node().selectedIndex;
    thisGraph.selectedGraphName = selectGraph.node().options[selectedoption].value;
  }

  d3.select('#graphSelection').remove();
  var selectGraph = d3.select('#graphList')
        .append("select")
        .attr("id", "graphSelection")
        .attr("multiple", true)
        .on("change", function(d){
          thisGraph.displayContentModal.call(thisGraph)})

  thisGraph.listOfLocalGraphs.forEach(function(value, index) {
    var option = selectGraph
                .append("option")
                .attr("value", value[0])

                if (thisGraph.graphName == thisGraph.config.newGraphName) //Untilted
                {
                  if (index == 0)
                  {
                    option.attr("selected",true);
                    thisGraph.selectedGraphName = value[0];
                  }
                }
                else {
                  if (value[0] == thisGraph.selectedGraphName)
                  {
                    option.attr("selected",true);
                  }
                }

    option.text(value[0])
  });

  var txtRes = localStorage.getItem(thisGraph.config.version+"|"+thisGraph.selectedGraphName);

  thisGraph.d3data = thisGraph.jsonD3ToD3Data(txtRes);

  thisGraph.graphName = thisGraph.selectedGraphName;
  $('#saveGraphLabel').text(thisGraph.graphName);

  d3.select("#contentGrapPreview").remove();

  var contentGrapPreview = d3.select("#graphPreview")
              .append("div")
              .attr("id", "contentGrapPreview")
  var ul =  contentGrapPreview
                .append("ul")

  var numberOfNodes = 0;
  //Use every instead of forEach to stop loop when you want
  thisGraph.d3data.nodes.every(function(node, index) {
    var li = ul
              .append("li")
              .text(node.label)
    numberOfNodes++;
    if (numberOfNodes > 4)
      return false;
    else
      return true
  });

  var total = contentGrapPreview
                .append("div")
                .attr("id","totalGraphPreview")
                .html("<b>Total of nodes :</b> "+numberOfNodes+"<br> <b>Total of links :</b> "+thisGraph.d3data.edges.length);

  if (thisGraph.config.debug) console.log("displayPreviewModal end");

}

FluidGraph.prototype.openGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("openGraph start");

  thisGraph.resetMouseVars();
  d3.selectAll("#node").remove();
  d3.selectAll("#link").remove();
  d3.selectAll("#drag_line").remove();

  thisGraph.drawGraph();

  if (thisGraph.config.debug) console.log("openGraph end");
}
