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
      console.log("Erreur Ajax : Message=" + t_data + " (Fonction getd3data()) !");
    },
    async: false
  });
  return d3data;
}

$(document).ready()
{
  var d3data = getD3Data();

  var myGraph = new FluidGraph("#chart", d3data)

  myGraph.initSgvContainer("bgElement");

  var checkboxIsInitialized = false;
  menuInitialisation(myGraph);

  if (myGraph.config.force == "On") {
    myGraph.activateForce();
  } else {
    $('#activeElasticCheckbox').addClass('disabled');
  }

  checkboxIsInitialized = true;
  myGraph.drawGraph();


  // var myStore = new MyStore({container : "https://localhost:8443/2013",
  //                             context : "http://owl.openinitiative.com/oicontext.jsonld"})
  //
  // var people ;
  // myStore.get("https://ldp.openinitiative.com:8443/2013/people/8a71fbcb20").then(function(object){
  //   people = object.about.name;
  //   myGraph.addNode({id:15, label: people, type:"ressource", x:500, y:100, identifier:"http://fluidlog.com/15" })
  // });

  // makeFluidGraph( "toto" );
}
