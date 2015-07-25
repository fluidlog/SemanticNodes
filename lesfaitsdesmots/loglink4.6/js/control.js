$('#initGraph')
  .click(function() {
    location.reload(true)
  })
  .popup({
    inline: true,
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 100,
      hide: 500
    }
  });

$('#deleteGraph')
  .click(function() {
    myGraph.deleteGraph(false);
  })
  .popup({
    inline: true,
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 100,
      hide: 500
    }
  });

$('#uploadGraph')
  .click(function() {
    $("#hiddenFileUpload").click();
  })
  .popup({
    inline: true,
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 100,
      hide: 500
    }
  });

$('#hiddenFileUpload')
  .on("change", myGraph.uploadGraph)

$('#downloadGraph')
  .click(function() {
    myGraph.downloadGraph(myGraph);
  })
  .popup({
    inline: true,
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 100,
      hide: 500
    }
  });

$('#focusContextNode')
  .click(function() {
    myGraph.focusContextNode(); //On selected node
    $('#focusContextNodeOff').show();
  })
  .popup({
    inline: true,
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 100,
      hide: 500
    }
  });

$('#focusContextNodeOff')
  .click(function() {
    myGraph.focusContextNodeOff();
    $('#focusContextNodeOff').hide();
  })
  .popup({
    inline: true,
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 100,
      hide: 500
    }
  });

$('#activeForceCheckbox').checkbox({
  onChecked: function() {
    myGraph.config.force = "On";
    myGraph.config.elastic = "On";
    $('#activeElasticCheckbox').checkbox('check');
    $('#activeElasticCheckbox').removeClass('disabled');
    if (checkboxIsInitialized)
      myGraph.refreshGraph();
  },
  onUnchecked: function() {
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
  onChecked: function() {
    myGraph.config.elastic = "On";
    if (checkboxIsInitialized)
      myGraph.refreshGraph();
  },
  onUnchecked: function() {
    if (typeof myGraph.force != "undefined")
      myGraph.force.stop();
    myGraph.config.elastic = "Off";
    if (checkboxIsInitialized)
      myGraph.refreshGraph();
  }
});
