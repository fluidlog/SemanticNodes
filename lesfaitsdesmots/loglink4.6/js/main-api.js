// Carto focus + Context

// Please edit this: LDP or semantic_forms server
var serverURLPrefix = "http://SSSSS.org:9000/ldp/"

function getD3Data( jsonDataURL ) {
  var d3data;
	// Appelle le serveur de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
			type: 'GET',
			url: jsonDataURL,
			dataType: 'json',
			success: function(t_data) {
				d3data = t_data;
				return false;
			},
			error: function(t_data) {
				console.log("Erreur Ajax : Message="+t_data+" (Fonction getd3data()) !");
			},
			async: false
		}
	);
	return d3data;
}

function makeFluidGraph( graphURI ) {
  var d3data = getD3Data( serverURLPrefix + graphURI );
  var myGraph = new FluidGraph("#chart", d3data)

  // TODO move this to FluidGraph constructor
  {
    myGraph.initSgvContainer("bgElement");
    var checkboxIsInitialized = false;
    checkboxInitialisation(myGraph);

    if (myGraph.config.force == "On") {
	myGraph.activateForce();
    } else {
	$('#activeElasticCheckbox').addClass('disabled');
    }
    checkboxIsInitialized = true;
  }

  myGraph.drawGraph();
}
