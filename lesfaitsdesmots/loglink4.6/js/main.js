//Carto focus + Context with autonome functions

function getD3Data() {
  var d3data;
  //Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
  $.ajax({
    type: 'GET',
    url: '/data/d3data',
    dataType: 'json',
    success: function(t_data) {
      d3data = t_data;
      return false;
    },
    error: function(t_data) {
      console.log("Erreur Ajax : Message=" + t_data + " (Fonction getD3Data()) !");
    },
    async: false
  });
  return d3data;
}

$(document).ready()
{
  //  console.log(JSON.stringify(d3data));
  var myGraph = new FluidGraph();

  //Load default graph (Démo, explaination...)
  myGraph.d3data = getD3Data();

  myGraph.initSgvContainer("#chart");

  var store = new MyStore({ container : myGraph.externalStore.uri,
                            context : myGraph.externalStore.context,
                            template : "",
                            partials : ""})

  var openedGraph = myGraph.getOpenedGraph();
  if (openedGraph)
  {
    myGraph.loadLocalGraph(openedGraph);
  }

  var checkboxIsInitialized = false;
  menuInitialisation(myGraph);

  if (myGraph.config.force == "On") {
    myGraph.activateForce();
  } else {
    $('#activeElasticCheckbox').addClass('disabled');
  }

  checkboxIsInitialized = true;

  myGraph.drawGraph();
}
