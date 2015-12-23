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
                                      "loglink:quoi",
                                      "loglink:pourquoi",
                                      "loglink:ou",
                                      "loglink:comment",
                                      "loglink:quand",
                                      "loglink:combien",
                                      "loglink:without",
                                    ];

  myGraph.customNodes.colorType = {"loglink:qui" : "#F3FD97",
                                      "loglink:quoi" : "#FDA8AE",
                                      "loglink:pourquoi" : "#FFDE98",
                                      "loglink:ou" : "#899DD5",
                                      "loglink:comment" : "#B5F49D",
                                      "loglink:quand" : "#C381D3",
                                      "loglink:combien" : "#AAA",
                                      "loglink:without" : "#FFF"
                                      };

  myGraph.customNodes.colorTypeRgba = {"loglink:qui" : "243,253,151",
                                        "loglink:quoi" : "253,168,174",
                                        "loglink:pourquoi" : "255,222,152",
                                        "loglink:ou" : "137,157,213",
                                        "loglink:comment" : "181,244,157",
                                        "loglink:quand" : "195,129,211",
                                        "loglink:combien" : "163,163,163",
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

  myGraph.config.version = "loglink47";
  myGraph.customNodes.blankNodeType = "loglink:without"
  myGraph.externalStore.uri = "https://ldp.virtual-assembly.org:8443/2013/fludy/";
  myGraph.mockData0 = getMockData(5);

  myGraph.initSvgContainer("#chart");

  var store = new MyStore({ container : myGraph.externalStore.uri,
                            context : myGraph.externalStore.context,
                            template : "",
                            partials : ""})

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
    myGraph.drawGraph();
}
