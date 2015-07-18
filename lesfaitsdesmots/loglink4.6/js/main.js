//Carto focus + Context with autonome functions

function getD3Data()
{
  var d3data;
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '/data/d3data',
		    dataType: 'json',
		    success: function(t_data)
					    {
                d3data = t_data;
							  return false;
					    },
		    error: function(t_data)
					    {
							  console.log("Erreur Ajax : Message="+t_data+" (Fonction getd3data()) !");
					    },
		    async: false
		}
	);
	return d3data;
}

$(document).ready()
{
  var d3data = getD3Data();

  var myGraph = new FluidGraph("#chart",d3data)

  myGraph.addSvg("bgElement");

  myGraph.bgElement = d3.select("#bgElement")

  if (myGraph.config.activeForce == "On")
    myGraph.activeForce();

  myGraph.drawGraph();

}
