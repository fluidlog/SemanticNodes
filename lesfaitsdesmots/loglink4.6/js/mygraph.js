function menuInitialisation(myGraph) {

  if (myGraph.config.debug) console.log("checkboxInitialisation start");

  $('#focusContextNodeOff').hide();

  if (myGraph.config.curvesLinks == 'On')
    $('#curvesLinksCheckbox').checkbox('check');
  else
    $('#curvesLinksCheckbox').checkbox('uncheck');

  if (myGraph.config.openNodeOnHover == 'On')
    $('#openNodeOnHoverCheckbox').checkbox('check');
  else
    $('#openNodeOnHoverCheckbox').checkbox('uncheck');

  if (myGraph.config.force == 'On')
    $('#activeForceCheckbox').checkbox('check');
  else
    $('#activeForceCheckbox').checkbox('uncheck');

  if (myGraph.config.elastic == 'On')
    $('#activeElasticCheckbox').checkbox('check');
  else
    $('#activeElasticCheckbox').checkbox('uncheck');

  if (myGraph.config.displayId == 'On')
    $('#displayIdCheckbox').checkbox('check');
  else
    $('#displayIdCheckbox').checkbox('uncheck');

  if (myGraph.config.debug) console.log("checkboxInitialisation end");
}

/*
*
*           functions
*
****************************/

//rescale g
FluidGraph.prototype.rescale = function(thisGraph){
  if (thisGraph.config.debug) console.log("rescale start");

  thisGraph.bgElement.attr("transform",
    "translate(" + d3.event.translate + ")"
    + " scale(" + d3.event.scale + ")");

  if (thisGraph.config.debug) console.log("rescale end");
}

//Create a balise SVG with events
FluidGraph.prototype.initSgvContainer = function(firstBgElement){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("initSgvContainer start");

  // listen for key events
  d3.select(window).on("keydown", function(){
    thisGraph.bgKeyDown.call(thisGraph);
  })
  .on("keyup", function(){
    thisGraph.bgKeyUp.call(thisGraph);
  });

  var div = firstBgElement;
  var svg;

  if (thisGraph.config.bgElementType == "simple")  {
    svg = d3.select(div)
          .append("svg")
          .attr("width", thisGraph.width)
          .attr("height", thisGraph.height)
          .append('g')
          .attr('id', "bgElement")
  }
  else  {  //panzoom
    var outer = d3.select(div)
          .append("svg")
          .attr("width", thisGraph.width)
          .attr("height", thisGraph.height)

    svg = outer
      .append('g')
      .call(d3.behavior.zoom()
        // .scaleExtent([1, 10])
        .on("zoom", function(d){thisGraph.rescale.call(this, thisGraph, d)}))
      .on("dblclick.zoom", null)
      .on("click", null)
      .on("dblclick", function(d){
        if (thisGraph.config.editGraphMode == true)
          thisGraph.addNode.call(this, thisGraph, d)
        })
      .append('g')
      .attr('id', "bgElement")
      .on("mousedown", function(d){
        thisGraph.bgOnMouseDown.call(thisGraph, d)})
      .on("mousemove", function(d){
        thisGraph.bgOnMouseMove.call(thisGraph, d)})
	    .on("mouseup", function(d){
        thisGraph.bgOnMouseUp.call(thisGraph, d)})

    svg.append('rect')
          .attr('x', -thisGraph.width*3)
          .attr('y', -thisGraph.height*3)
          .attr('width', thisGraph.width*7)
          .attr('height', thisGraph.height*7)
          .attr('fill', thisGraph.config.backgroundColor)
  }

  thisGraph.bgElement = d3.select("#bgElement");

  thisGraph.initDragLine();

  if (thisGraph.config.debug) console.log("initSgvContainer end");
}

FluidGraph.prototype.initDragLine = function(){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("initDragLine start");

  // line displayed when dragging new nodes
  if (thisGraph.config.curvesLinks == "On")
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
                        .linkDistance(thisGraph.config.linkDistance)
                        .charge(thisGraph.config.charge)

  if (thisGraph.config.elastic == "On")  {
    thisGraph.force.start()
    thisGraph.force.on("tick", function(args){
      thisGraph.movexy.call(thisGraph, args)})
  }  else { // Off
    // Run the layout a fixed number of times.
  	// The ideal number of times scales with graph complexity.
    thisGraph.force.start();
  	for (var t = 100; t > 0; --t) thisGraph.force.tick();
    thisGraph.force.stop();
  }

  if (thisGraph.config.debug) console.log("activateForce end");
}

FluidGraph.prototype.drawGraph = function(d3dataFc){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("drawGraph start");

  var dataToDraw = d3dataFc || thisGraph.d3data;

  if (typeof dataToDraw.nodes != "undefined")
  {
    //Update of the nodes
    dataToDraw.nodes.forEach(function(node)
            {
              if (typeof dataToDraw.nodes.px == "undefined")
              {
                node.px = node.x;
                node.py = node.y;
                node.weight = 1;
              }

            });

    thisGraph.svgNodesEnter = thisGraph.bgElement.selectAll("#node")
    				              .data(dataToDraw.nodes, function(d) { return d.index;})

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
                  			.data(dataToDraw.edges, function(d) { return d.source.index + "-" + d.target.index; })

    if (thisGraph.config.curvesLinks == "On")
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
                        })
                        .on("mouseup", function(d){
                          thisGraph.state.mouseDownLink = null;
                        })
                        .on("dblclick", function(d){
                          thisGraph.linkEdit.call(thisGraph, d3.select(this), d);
                        })

    thisGraph.drawLinks(thisGraph.svgLinks);

    //delete link if there's less object in svgLinksEnter array than in DOM
    thisGraph.svgLinksEnter.exit().remove();

    thisGraph.svgLinksLabelEnter = thisGraph.bgElement.selectAll(".linksLabel")
        .data(dataToDraw.edges, function(d) { return d.source.index + "-" + d.target.index; })

    thisGraph.svgLinksLabel  =  thisGraph.svgLinksLabelEnter
        .enter()
    		.insert("text", "#node")
        .attr("class", "linksLabel")
        .attr("id", function(d) { return "edge" + d.source.index + "_" + d.target.index })
    		.attr("x", function(d) { return d.source.x + (d.target.x - d.source.x)/2; })
        .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y)/2; })
        .attr("text-anchor", "middle")
        .attr("visibility", "hidden")
        .attr("cursor", "default")
    	  .style("fill", "#000")
        .text(function(d) {
          return d.type;
        });

    //delete label link if there's less object in svgLinksLabelEnter array than in DOM
    thisGraph.svgLinksLabelEnter.exit().remove();

    if (thisGraph.config.force == "Off")
    {
      thisGraph.movexy.call(thisGraph);
    }
  }

  if (thisGraph.config.debug) console.log("drawGraph end");
}

FluidGraph.prototype.movexy = function(d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("movexy start");

  if (isNaN(thisGraph.svgNodesEnter[0][0].__data__.x) || isNaN(thisGraph.svgNodesEnter[0][0].__data__.y))
  {
    console.log("movexy problem if tick...",thisGraph.svgNodesEnter[0][0].__data__.x)
    throw new Error("movexy still problem if tick :-)...");
  }

  if (thisGraph.config.curvesLinks == "On")
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

  thisGraph.svgLinksLabelEnter
      .attr("x", function(d) { return d.source.x + (d.target.x - d.source.x)/2; })
      .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y)/2; })

  thisGraph.svgNodesEnter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  if (thisGraph.config.debug) console.log("movexy end");
}

FluidGraph.prototype.newGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("newGraph start");

  thisGraph.clearGraph();
  thisGraph.changeGraphName();
  thisGraph.d3data.nodes = [{index:0, label: thisGraph.customNodes.blankNodeLabel, type: thisGraph.customNodes.blankNodeType, x:200, y:200, identifier:"http://fluidlog.com/0" }];
  thisGraph.initDragLine()
  localStorage.removeItem(thisGraph.config.version+"|"+thisGraph.consts.OPENED_GRAPH_KEY);
  thisGraph.drawGraph();

  if (thisGraph.config.debug) console.log("newGraph end");
}

FluidGraph.prototype.clearGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("clearGraph start");

  thisGraph.resetMouseVars();
  thisGraph.resetStateNode();
  thisGraph.d3data.nodes = [];
  thisGraph.d3data.edges = [];
  thisGraph.graphName = thisGraph.config.newGraphName;
  thisGraph.removeSvgElements();

  if (thisGraph.config.debug) console.log("clearGraph end");
}

FluidGraph.prototype.resetStateNode = function() {
  thisGraph.state.selectedNode = null;
  thisGraph.state.openedNode = null;
  thisGraph.state.editedNode = null;
}

FluidGraph.prototype.refreshGraph = function() {
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("refreshGraph start");

  thisGraph.resetMouseVars();
  if (thisGraph.config.force == "On")
    thisGraph.activateForce();

  thisGraph.resetStateNode();
  thisGraph.removeSvgElements();
  thisGraph.initDragLine();
  thisGraph.drawGraph();

  if (thisGraph.config.debug) console.log("refreshGraph end");
}

FluidGraph.prototype.downloadGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("downloadGraph start");

  var blob = new Blob([thisGraph.d3DataToJsonD3()], {type: "text/plain;charset=utf-8"});
  var now = new Date();
  var date_now = now.getDate()+"-"+now.getMonth()+1+"-"+now.getFullYear()+"-"+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
  saveAs(blob, "Carto-"+thisGraph.graphName+"-"+date_now+".d3json");

  if (thisGraph.config.debug) console.log("downloadGraph end");
}

FluidGraph.prototype.uploadGraph = function(input) {

thisGraph = this;

if (thisGraph.config.debug) console.log("uploadGraph start");

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var uploadFile = input[0].files[0];
    var filereader = new window.FileReader();

    filereader.onload = function(){
      var txtRes = filereader.result;
      // TODO better error handling
      try{
        thisGraph.clearGraph();
        thisGraph.d3data = thisGraph.jsonD3ToD3Data(txtRes);
        thisGraph.changeGraphName();
        thisGraph.initDragLine()
        thisGraph.drawGraph();
      }catch(err){
        window.alert("Error parsing uploaded file\nerror message: " + err.message);
        return;
      }
    };
    filereader.readAsText(uploadFile);
    $("#sidebarButton").click();

  } else {
    alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
  }

  if (thisGraph.config.debug) console.log("uploadGraph end");
}

FluidGraph.prototype.changeGraphName = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("changeGraphName start");

  $('#graphNameLabel').text(thisGraph.graphName);

  if (thisGraph.config.debug) console.log("changeGraphName end");
}

FluidGraph.prototype.getContentLocalStorage = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getContentLocalStorage start");

  thisGraph.listOfLocalGraphs = [];
  Object.keys(localStorage)
      .forEach(function(key){
          var regexp = new RegExp(thisGraph.config.version);
           if (regexp.test(key)) {
             var keyvalue = [];
             keyvalue[0] = key.split("|").pop();
             keyvalue[1] = localStorage.getItem(key)

            if (keyvalue[0] != thisGraph.consts.OPENED_GRAPH_KEY)
             thisGraph.listOfLocalGraphs.push(keyvalue)
           }
       });

  if (thisGraph.config.debug) console.log("getContentLocalStorage end");
}

FluidGraph.prototype.displayContentOpenGraphModal = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayContentOpenGraphModal start");

  //Get index selected if selection change
  var openGraphModalSelection = d3.select('#openGraphModalSelection');
  if (openGraphModalSelection.node())
  {
    var selectedoption = openGraphModalSelection.node().selectedIndex;
    thisGraph.selectedGraphName = openGraphModalSelection.node().options[selectedoption].value;
  }

  d3.select('#openGraphModalSelection').remove();
  openGraphModalSelection = d3.select('#openGraphModalList')
        .append("select")
        .attr("id", "openGraphModalSelection")
        .attr("multiple", true)
        .attr("style","width:300px; height:100px")
        .on("change", function(d){
          thisGraph.displayContentOpenGraphModal.call(thisGraph)})

  thisGraph.listOfLocalGraphs.forEach(function(value, index) {
    var option = openGraphModalSelection
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

  if (!thisGraph.selectedGraphName)
    thisGraph.selectedGraphName = thisGraph.graphName;

  thisGraph.loadLocalGraph(thisGraph.selectedGraphName);

  d3.select("#contentOpenGraphModalPreview").remove();

  var contentOpenGraphModalPreview = d3.select("#openGraphModalPreview")
              .append("div")
              .attr("id", "contentOpenGraphModalPreview")
  var ul =  contentOpenGraphModalPreview
                .append("ul")

  //Use every instead of forEach to stop loop when you want
  thisGraph.d3data.nodes.every(function(node, index) {
    var li = ul
              .append("li")
              .text(node.label)
    if (index > 4)
      return false;
    else
      return true
  });

  var total = contentOpenGraphModalPreview
                .append("div")
                .attr("id","totalOpenGraphModalPreview")
                .html("<b>Total of nodes :</b> "+thisGraph.d3data.nodes.length+"<br> <b>Total of links :</b> "+thisGraph.d3data.edges.length);

  if (thisGraph.config.debug) console.log("displayContentOpenGraphModal end");

}

FluidGraph.prototype.openGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("openGraph start");

  thisGraph.resetMouseVars();
  thisGraph.removeSvgElements();
  thisGraph.initDragLine();
  thisGraph.drawGraph();
  thisGraph.rememberOpenedGraph();

  if (thisGraph.config.debug) console.log("openGraph end");
}

FluidGraph.prototype.removeSvgElements = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("removeSvgElements start");

  d3.selectAll("#node").remove();
  d3.selectAll("#link").remove();
  d3.selectAll(".linksLabel").remove();
  d3.selectAll("#drag_line").remove();

  if (thisGraph.config.debug) console.log("removeSvgElements end");
}

FluidGraph.prototype.rememberOpenedGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("rememberGraphOpened start");

  localStorage.setItem(thisGraph.config.version+"|"+thisGraph.consts.OPENED_GRAPH_KEY,thisGraph.graphName)

  if (thisGraph.config.debug) console.log("rememberGraphOpened end");
}

FluidGraph.prototype.getOpenedGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("rememberGraphOpened start");

  var openedGraph;
  openedGraph = localStorage.getItem(thisGraph.config.version+"|"+thisGraph.consts.OPENED_GRAPH_KEY);

  if (thisGraph.config.debug) console.log("rememberGraphOpened end");

  return openedGraph;
}

FluidGraph.prototype.displayContentManageGraphModal = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayContentManageGraphModal start");

  d3.select('#manageGraphModalTable').remove();
  var manageGraphModalTable = d3.select('#manageGraphModalDivTable')
                            .append("table")
                            .attr("id", "manageGraphModalTable")
                            .attr("class","ui celled table")

  var manageGraphModalThead = manageGraphModalTable
                            .append("thread")

  var manageGraphModalTrHead =  manageGraphModalTable
                          .append("tr")

  manageGraphModalTrHead.append("th")
                            .text("Name")
  manageGraphModalTrHead.append("th")
                            .text("Content")
  manageGraphModalTrHead.append("th")
                            .text("Action")

  var manageGraphModalTbody =  manageGraphModalTable.append("tbody")


  thisGraph.listOfLocalGraphs.forEach(function(value, index) {
    try{
      var data = JSON.parse(value[1]);
    }catch(err){
      var data = null;
    }

    if (data)
    {
      var nodesPreview = "(";
      data.nodes.every(function(node, index){
        if (index > 2)
        {
          nodesPreview += node.label.split(" ",2);
          return false;
        }
        else {
          if (index == data.nodes.length-1)
            nodesPreview += node.label.split(" ",2);
          else
            nodesPreview += node.label.split(" ",2) + ',';
          return true;
        }
      });
      nodesPreview += ")";
    }

    var manageGraphModalTrBody =  manageGraphModalTbody
                            .append("tr")

    manageGraphModalTrBody.append("td")
                            .text(value[0]);

    manageGraphModalTrBody.append("td")
                            .text(' ' + nodesPreview);

    manageGraphModalTrBody.append("td")
                          .append("button")
                          .attr("class", "ui mini labeled icon button")
                          .on("click", function (){
                            thisGraph.graphToDeleteName = value[0];
                            thisGraph.deleteGraph.call(thisGraph);
                            thisGraph.getContentLocalStorage.call(thisGraph);
                            thisGraph.displayContentManageGraphModal.call(thisGraph);
                          })
                          .text("Delete")
                          .append("i")
                          .attr("class", "delete small icon")
  });

  if (thisGraph.config.debug) console.log("displayContentManageGraphModal end");
}

FluidGraph.prototype.deleteGraph = function(skipPrompt) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteGraph start");

  doDelete = true;
  if (!skipPrompt){
    doDelete = window.confirm("Press OK to delete the graph named " + thisGraph.graphToDeleteName);
  }
  if(doDelete){
    localStorage.removeItem(thisGraph.config.version+"|"+thisGraph.graphToDeleteName);
    if (thisGraph.graphToDeleteName == thisGraph.graphName)
      thisGraph.newGraph();
  }

  if (thisGraph.config.debug) console.log("deleteGraph end");
}

FluidGraph.prototype.resetMouseVars = function()
{
  if (thisGraph.config.debug) console.log("resetMouseVars start");

  thisGraph.state.mouseDownNode = null;
  thisGraph.state.mouseUpNode = null;
  thisGraph.state.mouseDownLink = null;

  if (thisGraph.config.debug) console.log("resetMouseVars end");
}

FluidGraph.prototype.saveGraphToLocalStorage = function() {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("saveGraphToLocalStorage start");

  thisGraph.changeGraphName();
  thisGraph.selectedGraphName = thisGraph.graphName;

  if (thisGraph.config.remindSelectedNodeOnSave == false)
  {
    thisGraph.d3data.nodes.forEach(function(node, i){
      if (node.fixed == true) node.fixed = false;
    });
  }

  localStorage.setItem(thisGraph.config.version+"|"+thisGraph.graphName,thisGraph.d3DataToJsonD3())

  $("#message").text("Locally saved!").show().delay(1000).fadeOut();

  if (thisGraph.config.debug) console.log("saveGraphToLocalStorage end");
}

FluidGraph.prototype.displayExternalGraph = function(d3node, d) {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("displayExternGraph start");

  d3.event.stopPropagation();

  externalUri = d.identifier;

  var externalD3Data = thisGraph.getExternalD3Data(externalUri)

  if (externalD3Data)
  {
    thisGraph.d3data = externalD3Data;

    thisGraph.resetMouseVars();
    thisGraph.resetStateNode();
    thisGraph.removeSvgElements();
    thisGraph.initDragLine();
    thisGraph.drawGraph();
  }

  if (thisGraph.config.debug) console.log("displayExternGraph end");
}

FluidGraph.prototype.getExternalD3Data = function(externalUri) {
  var d3data;

  //Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
  $.ajax({
    type: 'GET',
    url: externalUri,
    dataType: 'json',
    success: function(t_data) {
      d3data = t_data;
      return false;
    },
    error: function(t_data) {
      console.log("Erreur Ajax : Message=" + t_data + " (Fonction getd3data()) !");
    },
    async: false
  });
  return d3data;
}

FluidGraph.prototype.saveGraphToExternalStore = function() {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("saveGraphToExternalStore start");

  // var jsonLd = thisGraph.d3DataToJsonLd();
  // localStorage.setItem(thisGraph.config.version+"|"+thisGraph.graphName+".json-ld",window.JSON.stringify(jsonLd));

  // var serverUri = "https://localhost:8443/2013/fluidlog/";
  // var contextmap = {
  //   "@context":{
  //     "av" : "http://www.assemblee-virtuelle.org/ontologies/v1.owl#"
  //   }}


  var jsonLd = {
    "nodes" : [
      { "@id" : "http://fluidlog.com/node/0",
        "@type":"av:project",
        "index":"0",
        "label":"A",
        "x" : "101",
        "y" : "102"},
      { "@id" : "http://fluidlog.com/node/1",
        "@type":"av:idea",
        "index":"1",
        "label":"B",
        "x" : "203",
        "y" : "204"},
      { "@id" : "http://fluidlog.com/node/2",
        "@type":"av:project",
        "index":"2",
        "label":"C",
        "x" : "305",
        "y" : "306"},
    ],
    "edges" : [
      { "@id" : "http://fluidlog.com/edge/0",
        "@type":"loglink:linkedto",
        "source" : "http://fluidlog.com/node/0",
        "target" : "http://fluidlog.com/node/1"},
      { "@id" : "http://fluidlog.com/edge/1",
        "@type":"loglink:linkedto",
        "source" : "http://fluidlog.com/node/1",
        "target" : "http://fluidlog.com/node/2"},
    ]
  }

  store.save(jsonLd);

  console.log("jsonLd " + JSON.stringify(jsonLd));

  if (thisGraph.config.debug) console.log("saveGraphToExternalStore end");
}

FluidGraph.prototype.loadLocalGraph = function(graphName) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("loadLocalGraph start");

  var localGraph = localStorage.getItem(thisGraph.config.version+"|"+graphName);
  thisGraph.d3data = thisGraph.jsonD3ToD3Data(JSON.parse(localGraph)); //ExternalGraph or localGraph
  thisGraph.graphName = graphName;
  thisGraph.changeGraphName();

  if (thisGraph.config.debug) console.log("loadLocalGraph end");
}

FluidGraph.prototype.loadExternalGraph = function(graphName) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("loadExternalGraph start");

  var externalGraph;
  store.get("https://localhost:8443/2013/fluidlog/"+graphName).then(function(ldpObject){
    console.log("loadExternalGraph ldpObject : "+JSON.stringify(ldpObject));
    externalGraph = ldpObject;
    thisGraph.d3data = thisGraph.jsonLdToD3Data(externalGraph); //ExternalGraph or localGraph

    thisGraph.graphName = graphName;
    thisGraph.changeGraphName();
    thisGraph.drawGraph();

    if (thisGraph.config.debug) console.log("loadExternalGraph end");
    return true;
  });
}
