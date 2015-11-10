// define graph object
var FluidGraph = function (firstBgElement){
  /*
  *
  *           Initialisation
  *
  ****************************/

  //Help to assure that it's the "this" of myGraph object
  var thisGraph = this;

  thisGraph.config = {
    backgroundColor : "#EEE",
    xNewNode : 200,
    yNewNode : 100,
    bgElementType : "panzoom", //choixe : "panzoom" or "simple"
    force : "Off",
    elastic : "Off",
    curvesLinks : "On",
    openNodeOnHover : "Off",
    displayIndex : "Off",
    proportionalNodeSize : "On",
    uriBase : "http://fluidlog.com/", //Warning : with LDP, no uriBase... :-)
    // Rwwplay : "https://localhost:8443/2013/fluidlog/",
    // SemForms : "http://localhost:9000/ldp/fluidlog/",
    uriExternalStore : "http://localhost:9000/ldp/fluidlog/",
    linkDistance : 100,
    charge : -1000,
    debug : false,
    version : "loglink46",
    newGraphName : "Untilted",
    bringNodeToFrontOnHover : false,
    repulseNeighbourOnHover : false,
    awsomeStrokeNode : true,
    remindSelectedNodeOnSave : true,
    editGraphMode : true, // default : true
  };

  thisGraph.customNodes = {
    strokeColor : "#CCC",
    strokeWidth : "10px",
    strokeOpacity : .5,
    listType : ["av:without", "av:project","av:actor","av:idea","av:ressource"],
    colorType : {"av:project" : "#89A5E5",
                  "av:actor" : "#F285B9",
                  "av:idea" : "#FFD98D",
                  "av:ressource" : "#CDF989",
                  "av:without" : "#999",
                  "av:gray" : "gray"},
    typeOfNewNode : "av:without",
  	colorTypeRgba : {"av:project" : "137,165,229",
                      "av:actor" : "242,133,185",
                      "av:idea" : "255,217,141",
                      "av:ressource" : "205,249,137",
                      "av:without" : "255,255,255",
                      "av:gray" : "200,200,200"},
    imageType : {"av:project" : "lab", "av:actor" : "user", "av:idea" : "idea", "av:ressource" : "tree", "av:without" : "circle thin"},
    displayType : true,
    displayText : true,
    cursor : "move", //Value : grab or move (default), pointer, context-menu, text, crosshair, default
    cursorOpen : "default", //Value : grab or move (default), pointer, context-menu, text, crosshair, default
    widthClosed : 50,
		heightClosed : 50,
    maxRadius : 40,
    widthOpened : 160,
    heightOpened : 230,
    heightOpenedNeighbour : 30,
    heightOpenedTopMax : 50,
    heightOpenedBottomMax : 25,
    heightOpenedNeighboursMax : 200,
    widthEdited : 200,
		heightEdited : 200,
    curvesCornersClosedNode : 50,
    curvesCornersOpenedNode : 20,
		widthStrokeHover : 20,
		transitionEasing : "elastic", //Values : linear (default), elastic
    transitionDurationOpen : 300,
    transitionDurationEdit : 1000,
		transitionDurationClose : 300,
		transitionDelay : 0,
    blankNodeLabel : "New...",
    blankNodeType : "av:without",
  }

  if (thisGraph.config.awsomeStrokeNode == true)
  {
    thisGraph.customNodes.strokeColorType = {"av:project" : "#CCC",
                  "av:actor" : "#CCC",
                  "av:idea" : "#CCC",
                  "av:ressource" : "#CCC",
                  "av:without" : "#CCC"}
  }
  else {
    thisGraph.customNodes.strokeColorType = {"av:project" : "#89A5E5",
                  "av:actor" : "#F285B9",
                  "av:idea" : "#FFD98D",
                  "av:ressource" : "#CDF989",
                  "av:without" : "#999"}
  }

  thisGraph.nodeTypeIcon = {
    r : 13,
    cxClosed : 0,
    cxEdited : 0,
    cyClosed : (thisGraph.customNodes.heightClosed/2)-10,
    cyEdited : (thisGraph.customNodes.heightEdited/2)-10,
    xClosed : -11,
    xOpened : -11,
    xEdited : -11,
    yClosed : (thisGraph.customNodes.heightClosed/2)-20,
    yEdited : (thisGraph.customNodes.heightEdited/2)-20,
  }

  thisGraph.nodeIndexCircle = {
    r : 10,
    cxClosed : 0,
    cyClosed : -(thisGraph.customNodes.heightClosed/2)+6,
    cxEdited : 0,
    cyEdited : -(thisGraph.customNodes.heightOpened/2),
    dxClosed : 0,
    dyClosed : -(thisGraph.customNodes.heightClosed/2)+10,
    dxEdited : 0,
    dyEdited : -(thisGraph.customNodes.heightOpened/2)+5,
  }

  thisGraph.customNodesText = {
    fontSize : 14,
    FontFamily : "Helvetica Neue, Helvetica, Arial, sans-serif;",
    strokeOpacity : .5,
    widthMax : 160,
		heightMax : 60,
    curvesCorners : thisGraph.customNodes.curvesCornersOpenedNode,
  }

  thisGraph.customLinks = {
    strokeWidth: 7,
    strokeColor: "#DDD",
    strokeSelectedColor: "#999",
  }

  thisGraph.customLinksLabel = {
    width : 200,
    height : 80,
    fillColor : "#CCC",
    strokeColor : "#DDD",
    curvesCorners : 20,
    blankNodeLabel : "loglink:linkto",
  }

  thisGraph.graphName = thisGraph.config.newGraphName;
  thisGraph.listOfLocalGraphs = [];
  thisGraph.selectedGraphName = null;
  thisGraph.graphToDeleteName = null;
  thisGraph.firstBgElement = null;
  thisGraph.d3data = [];
  thisGraph.bgElement = null;
  thisGraph.svgNodesEnter = [];
  thisGraph.svgLinksEnter = [];
  thisGraph.svgLinksLabelEnter = [];
  thisGraph.width = window.innerWidth - 30;
  thisGraph.height = window.innerHeight - 30;

  // dbpedia : http://dbpedia.org/resource/ (John_Lennon)
  thisGraph.rwwplayUri = "https://localhost:8443/2013/fluidlog/";
  thisGraph.semFormsUri = "http://localhost:9000/ldp/fluidlog/";

  thisGraph.externalStore = {
    uri : thisGraph.rwwplayUri,
    context : {
      "@context":{
        "loglink": "http://www.fluidlog.com/2013/05/loglink/core#",
        "nodes": "http://www.fluidlog.com/2013/05/loglink/core#node",
        "label": "http://www.w3.org/2000/01/rdf-schema#label",
        "index": "http://www.fluidlog.com/2013/05/loglink/core#index",
        "x": "http://www.fluidlog.com/2013/05/loglink/core#x",
        "y": "http://www.fluidlog.com/2013/05/loglink/core#y",
        "edges": "http://www.fluidlog.com/2013/05/loglink/core#edge",
        "source": "http://www.fluidlog.com/2013/05/loglink/core#source",
        "target": "http://www.fluidlog.com/2013/05/loglink/core#target",
        "av": "http://www.assemblee-virtuelle.org/ontologies/v1.owl#"
      }
    }
  }

  //mouse event vars
  thisGraph.state = {
    selectedNode : null,
    selectedLink : null,
    mouseDownNode : null,
    mouseDownLink : null,
    svgMouseDownNode : null,
    mouseUpNode : null,
    lastKeyDown : -1,
    editedNode : null,
    editedIndexNode : null,
    openedNode : null,
    editedLinkLabel : null,
  }
}

// Come from : https://github.com/cjrd/directed-graph-creator/blob/master/graph-creator.js
FluidGraph.prototype.consts =  {
  selectedClass: "selected",
  connectClass: "connect-node",
  circleGClass: "conceptG",
  graphClass: "graph",
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50,
  OPENED_GRAPH_KEY: "openedGraph"
};
