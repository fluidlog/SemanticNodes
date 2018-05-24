//Carto focus + Context with autonome functions

function getMockData(dataIndex) {
  var d3data;
  //Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
  $.ajax({
    type: 'GET',
    url: '/data/d3data',
    dataType: 'json',
    success: function(t_data) {
      d3data = t_data[dataIndex];
      return false;
    },
    error: function(t_data) {
      console.log("Erreur Ajax : Message=" + t_data + " (Fonction getD3Data()) !");
    },
    async: false
  });
  return d3data;
}

function menuInitialisation(myGraph) {

  if (myGraph.config.debug) console.log("checkboxInitialisation start");

  $('#focusContextNodeOff').hide();

  if (myGraph.config.curvesLinks == 'On')
    $('#curvesLinksCheckbox').checkbox('check');
  else
    $('#curvesLinksCheckbox').checkbox('uncheck');

  if (myGraph.config.editGraphMode == true)
    $('#editGraphModeCheckbox').checkbox('check');
  else
    $('#editGraphModeCheckbox').checkbox('uncheck');

  if (myGraph.config.clicOnNodeAction == "flod")
    $('#displayFlodCheckbox').checkbox('check');
  else
    $('#displayFlodCheckbox').checkbox('uncheck');

  if (myGraph.config.force == 'On')
    $('#activeForceCheckbox').checkbox('check');
  else
    $('#activeForceCheckbox').checkbox('uncheck');

  if (myGraph.config.elastic == 'On')
    $('#activeElasticCheckbox').checkbox('check');
  else
    $('#activeElasticCheckbox').checkbox('uncheck');

  if (myGraph.config.displayIndex == 'On')
    $('#displayIndexCheckbox').checkbox('check');
  else
    $('#displayIndexCheckbox').checkbox('uncheck');

  if (myGraph.typeLdpServer == 'external')
  {
    $('#typeLdpServerCheckbox').checkbox('check');
    $('#graphNameSegment').hide();
  }
  else
  {
    $('#typeLdpServerCheckbox').checkbox('uncheck');
    $('#graphNameSegment').show();
  }

  if (myGraph.config.makeLinkSelectingNode == 'On')
    $('#LinkCreationModeCheckbox').checkbox('check');
  else
    $('#LinkCreationModeCheckbox').checkbox('uncheck');

  if (myGraph.config.debug) console.log("checkboxInitialisation end");
}

$(document).ready()
{
  var myGraph = new FluidGraph();

  myGraph.customNodes.listType = ["loglink:qui",
                                  "loglink:pourquoi",
                                  "loglink:quoi",
                                  "loglink:ou",
                                  "loglink:comment",
                                  "loglink:quand",
                                  "loglink:combien",
                                  "loglink:without",
                                    ];

  // myGraph.customNodes.colorType = {"loglink:qui" : "#F3FD97",
  //                                     "loglink:quoi" : "#FDA8AE",
  //                                     "loglink:pourquoi" : "#FFDE98",
  //                                     "loglink:ou" : "#899DD5",
  //                                     "loglink:comment" : "#B5F49D",
  //                                     "loglink:quand" : "#C381D3",
  //                                     "loglink:combien" : "#AAAAAA",
  //                                     "loglink:without" : "#FFFFFF"
  //                                     };
  //
  // myGraph.customNodes.colorTypeRgba = {"loglink:qui" : "243,253,151",
  //                                       "loglink:quoi" : "253,168,174",
  //                                       "loglink:pourquoi" : "255,222,152",
  //                                       "loglink:ou" : "137,157,213",
  //                                       "loglink:comment" : "181,244,157",
  //                                       "loglink:quand" : "195,129,211",
  //                                       "loglink:combien" : "163,163,163",
  //                                       "loglink:without" : "255,255,255"
  //                                       };

  myGraph.customNodes.colorType = {"loglink:qui" : "#FFF800",
                                    "loglink:quoi" : "#FF0000",
                                    "loglink:pourquoi" : "#FF7400",
                                    "loglink:ou" : "#3C00FD",
                                    "loglink:comment" : "#23FE00",
                                    "loglink:quand" : "#9F00FD",
                                    "loglink:combien" : "#AAAAAA",
                                    "loglink:without" : "#FFFFFF"
                                    };

  myGraph.customNodes.colorTypeRgba = {"loglink:qui" : "255,248,0",
                                        "loglink:quoi" : "255, 0, 0",
                                        "loglink:pourquoi" : "255, 116, 0",
                                        "loglink:ou" : "60, 0, 253",
                                        "loglink:comment" : "35, 254, 0",
                                        "loglink:quand" : "159, 0, 253",
                                        "loglink:combien" : "163,163,163",
                                        "loglink:without" : "255,255,255"
                                        };

  myGraph.customNodes.neighbourColorType = {"loglink:qui" : "#F3FD97",
                                      "loglink:quoi" : "#FDA8AE",
                                      "loglink:pourquoi" : "#FFDE98",
                                      "loglink:ou" : "#899DD5",
                                      "loglink:comment" : "#B5F49D",
                                      "loglink:quand" : "#C381D3",
                                      "loglink:combien" : "#AAAAAA",
                                      "loglink:without" : "#FFFFFF"
                                      };

  myGraph.customNodes.neighbourColorTypeRgba = {"loglink:qui" : "243,253,151",
                                        "loglink:quoi" : "253,168,174",
                                        "loglink:pourquoi" : "255,222,152",
                                        "loglink:ou" : "137,157,213",
                                        "loglink:comment" : "181,244,157",
                                        "loglink:quand" : "195,129,211",
                                        "loglink:combien" : "163,163,163",
                                        "loglink:without" : "255,255,255"
                                        };

  myGraph.customNodes.strokeNeighbourColorType = {"loglink:qui" : "#CDCB14",
                                      "loglink:quoi" : "#DA0918",
                                      "loglink:pourquoi" : "#AB7C1A",
                                      "loglink:ou" : "#1A398F",
                                      "loglink:comment" : "#30AD02",
                                      "loglink:quand" : "#6F1286",
                                      "loglink:combien" : "#2F2B2B",
                                      "loglink:without" : "#FFFFFF"
                                    };

  myGraph.customNodes.strokeNeighbourColorTypeRgba = {"loglink:qui" : "205,203,20",
                                      "loglink:quoi" : "218,9,24",
                                      "loglink:pourquoi" : "171,124,26",
                                      "loglink:ou" : "26,57,143",
                                      "loglink:comment" : "48,173,2",
                                      "loglink:quand" : "111,18,134",
                                      "loglink:combien" : "47,43,43",
                                      "loglink:without" : "255,255,255"
                                    };

  myGraph.customNodes.imageType = {"loglink:qui" : "yellow user",
                                    "loglink:quoi" : "red cube",
                                    "loglink:pourquoi" : "orange help",
                                    "loglink:ou" : "blue unhide",
                                    "loglink:comment" : "green lab",
                                    "loglink:quand" : "violet wait",
                                    "loglink:combien" : "grey money",
                                    "loglink:without" : "circle thin"};

  myGraph.customNodes.strokeColorType = {"loglink:qui" : "#CDCB14",
                                      "loglink:quoi" : "#DA0918",
                                      "loglink:pourquoi" : "#AB7C1A",
                                      "loglink:ou" : "#1A398F",
                                      "loglink:comment" : "#30AD02",
                                      "loglink:quand" : "#6F1286",
                                      "loglink:combien" : "#2F2B2B",
                                      "loglink:without" : "#FFFFFF"
                                    };

  // myGraph.config.awsomeStrokeNode = false;
  myGraph.config.version = "loglink47";
  myGraph.customNodes.blankNodeType = "loglink:without"
  myGraph.externalStore.uri = "https://ldp.virtual-assembly.org:8443/2013/fludy/";
  myGraph.mockData0 = getMockData(5);
  myGraph.customNodes.strokeOpacity = 1;
  myGraph.customNodes.strokeWidth = 0;
  myGraph.customNodes.widthClosed = 30;
  myGraph.customNodes.displayType = "Off";
  myGraph.config.editGraphMode = true;
  myGraph.config.allowDraggingNode = true; // default : false
  myGraph.config.allowModifyLink = true; // default : false
  myGraph.config.allowOpenNode = true; // default : false
  myGraph.config.editWithDoubleClick = false; // default : false
  myGraph.config.newNodeWithDoubleClickOnBg = true; // default : false
  myGraph.config.allowDragOnBg = true;
  myGraph.config.clicOnNodeAction = "flod"; // options, flod, media
  myGraph.config.customOptions = {
    edit : true,
    center : true,
    focusContextOn : true,
    focusContextOff : true,
    hypertext : true,
    close : false,
    delete : false,
  };


  myGraph.initSvgContainer("#chart");

  var store = new MyStore({ container : myGraph.externalStore.uri,
                            context : myGraph.externalStore.context,
                            template : "",
                            partials : ""})

  // location.hash = #https://ldp.virtual-assembly.org:8443/2013/cartopair/2a1499b5dc
  if (window.location.hash)
  {
    // myGraph.ldpGraphName = https://ldp.virtual-assembly.org:8443/2013/cartopair/2a1499b5dc
    myGraph.ldpGraphName = window.location.hash.substring(1);
    myGraph.openedGraph = myGraph.ldpGraphName;
    // myGraph.graphName = 2a1499b5dc
    myGraph.graphName = myGraph.openedGraph.split("/").pop();
    // myGraph.externalStore.uri = https://ldp.virtual-assembly.org:8443/2013/cartopair/
    myGraph.externalStore.uri = myGraph.openedGraph.split(myGraph.graphName)[0];
    myGraph.typeLdpServer = "external";
  }
  else
    myGraph.openedGraph = myGraph.getOpenedGraph();

  if (myGraph.openedGraph)
  {
    myGraph.loadGraph(myGraph.typeLdpServer, myGraph.openedGraph);
  }
  else {
    //Load default graph (Démo, explaination...)
    myGraph.d3Data = getMockData(4);
  }

  var checkboxIsInitialized = false;
  menuInitialisation(myGraph);

  if (myGraph.config.force == "On") {
    myGraph.activateForce();
  } else {
    $('#activeElasticCheckbox').addClass('disabled');
  }

  checkboxIsInitialized = true;

  if (myGraph.d3Data.nodes.length > 0)
  {
    myGraph.drawGraph();
    if (thisGraph.config.force == "Off")
      thisGraph.movexy.call(thisGraph);
  }

  //For testing open first node
  // var dNode = myGraph.d3Data.nodes[0];
  // var d3Node = thisGraph.searchD3NodeFromD(dNode)
  // myGraph.openNode(d3Node, dNode);

}
