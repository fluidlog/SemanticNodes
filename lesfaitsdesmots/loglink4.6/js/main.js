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

  myGraph.initSgvContainer("bgElement");

  $('#initGraph')
      .click(function()
      {
        location.reload(true)
      })
      .popup({
          inline   : true,
          hoverable: true,
          position : 'bottom left',
          delay: {
            show: 300,
            hide: 500
          }
      });

  if (myGraph.config.force == 'On')
    $('#activeForceCheckbox').checkbox('check');
  else
    $('#activeForceCheckbox').checkbox('uncheck');

  if (myGraph.config.elastic == 'On')
    $('#activeElasticCheckbox').checkbox('check');
  else
    $('#activeElasticCheckbox').checkbox('uncheck');

  $('#activeForceCheckbox').checkbox({
    onChecked : function()
  	{
      myGraph.config.force = "On";
      myGraph.config.elastic = "On";
      $('#activeElasticCheckbox').checkbox('check');
      $('#activeElasticCheckbox').removeClass('disabled');
      myGraph.refreshGraph();
  	},
    onUnchecked : function()
  	{
      if (typeof myGraph.force != "undefined")
        myGraph.force.stop();
      myGraph.config.force = "Off";
      myGraph.config.elastic = "Off";
      $('#activeElasticCheckbox').checkbox('uncheck');
      $('#activeElasticCheckbox').addClass('disabled');
      myGraph.refreshGraph();
  	}
  });

  $('#activeElasticCheckbox').checkbox({
    onChecked : function()
  	{
      myGraph.config.elastic = "On";
      myGraph.refreshGraph();
  	},
    onUnchecked : function()
  	{
      if (typeof myGraph.force != "undefined")
        myGraph.force.stop();
      myGraph.config.elastic = "Off";
      myGraph.refreshGraph();
  	}
  });

  if (myGraph.config.force == "On")
  {
    myGraph.activateForce();
  }
  else {
    $('#activeElasticCheckbox').addClass('disabled');
  }

  myGraph.drawGraph();

}
