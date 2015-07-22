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
          show: 100,
          hide: 500
        }
    });

  $('#deleteGraph')
    .click(function()
    {
      myGraph.deleteGraph(false);
    })
    .popup({
        inline   : true,
        hoverable: true,
        position : 'bottom left',
        delay: {
          show: 100,
          hide: 500
        }
    });

  $('#uploadGraph')
    .click(function()
    {
      $("#hiddenFileUpload").click();
    })
    .popup({
        inline   : true,
        hoverable: true,
        position : 'bottom left',
        delay: {
          show: 100,
          hide: 500
        }
    });

  $('#hiddenFileUpload')
      .on("change", myGraph.uploadGraph)

  $('#downloadGraph')
    .click(function()
    {
      myGraph.downloadGraph(myGraph);
    })
    .popup({
        inline   : true,
        hoverable: true,
        position : 'bottom left',
        delay: {
          show: 100,
          hide: 500
        }
    });

  var checkboxIsInitialized = false;

  checkboxInitialisation();

  $('#activeForceCheckbox').checkbox({
    onChecked : function()
  	{
      myGraph.config.force = "On";
      myGraph.config.elastic = "On";
      $('#activeElasticCheckbox').checkbox('check');
      $('#activeElasticCheckbox').removeClass('disabled');
      if (checkboxIsInitialized)
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
      if (checkboxIsInitialized)
        myGraph.refreshGraph();
  	},
  });

  $('#activeElasticCheckbox').checkbox({
    onChecked : function()
  	{
      myGraph.config.elastic = "On";
      if (checkboxIsInitialized)
        myGraph.refreshGraph();
  	},
    onUnchecked : function()
  	{
      if (typeof myGraph.force != "undefined")
        myGraph.force.stop();
      myGraph.config.elastic = "Off";
      if (checkboxIsInitialized)
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

  checkboxIsInitialized = true;
  myGraph.drawGraph();

}
