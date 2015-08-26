// Carto focus + Context

// Please edit this: LDP or semantic_forms server
var serverURLPrefix = "http://localhost:9000/ldp/"

function getSemFormsData( jsonDataURL ) {
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
  var d3data = getSemFormsData( serverURLPrefix + graphURI );
  var myGraph = new FluidGraph("#chart", d3data)

  myGraph.drawGraph();
}
