
$('#home')
  .popup({
    inline: true,
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 100,
      hide: 300
    }
  });

$('#newGraph')
  .click(function() {
    myGraph.newGraph();
  })
  .popup({
    inline: true,
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 100,
      hide: 300
    }
  });

$('#openGraph').click(function() {
  myGraph.selectOpenedGraphInModal();
  myGraph.getListOfGraphsInLocalStorage("open");
  myGraph.getListOfGraphsInExternalStorage(myGraph.externalStore.uri, "open");

  $('#openGraphModal')
    .modal({
          onApprove : function()
            {
              myGraph.openGraph();
            }
          })
    .modal('show');
})
.popup({
  inline: true,
  hoverable: true,
  position: 'bottom left',
  delay: {
    show: 100,
    hide: 300
  }
});

$("#saveGraph").click(function () {
  var graphNameLabel = $('#graphNameLabel').html().split(" (")[0];

  if (graphNameLabel == myGraph.consts.UNTILTED_GRAPH_NAME)
    $('#graphNameInput').val("");
  else
    $('#graphNameInput').val(thisGraph.graphName);

    $('#saveGraphModal')
      .modal({
            onApprove : function()
              {
                thisGraph.graphName = $('#graphNameInput').val();
                thisGraph.saveGraph();
              }
            })
      .modal('show');
})
.popup({
  inline: true,
  hoverable: true,
  position: 'bottom left',
  delay: {
    show: 100,
    hide: 300
  }
});


$("#manageGraph").click(function () {
  myGraph.getListOfGraphsInLocalStorage("manage");
  myGraph.getListOfGraphsInExternalStorage(myGraph.externalStore.uri, "manage");
  if (myGraph.listOfLocalGraphs.length > 0)
  {
    myGraph.displayContentManageGraphModal()
    $('#manageGraphModal')
      .modal({
            onApprove : function()
              {
                myGraph.manageGraphs();
              }
            })
      .modal('show');
    }
    else {
      alert ("You don't have any graph in your local store")
    }
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

$("#publishGraph").click(function () {
    myGraph.publishGraph()
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

if (thisGraph.config.makeLinkSelectingNode == "On" && thisGraph.state.selectedNode)
{
  $('#focusContextNode')
    .click(function() {
      thisGraph.focusContextNode(thisGraph.state.selectedNode);

      $('#focusContextNodeOff').show();
      $('#focusContextNode').hide();
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
}
else
{
  $('#focusContextNodeOff').hide();
  $('#focusContextNode').hide();
}


$('#focusContextNodeOff')
  .click(function() {
    thisGraph.focusContextNodeOff();
    $('#focusContextNodeOff').hide();
    $('#focusContextNode').show();
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

$('#sidebarButton').click(function(){
    $('.right.sidebar').sidebar('toggle');
});

$('#sidebarMenuHelpItem').click(function () {
  $('#helpModal')
    .modal('show');
});

$('#sidebarMenuSettingsItem').click(function () {
  $('#settingsModal')
    .modal('show');
});

$('#sidebarMenuUploadGraphItem').click(function() {
    $('#uploadModal')
      .modal('show')
      .modal({
        onApprove : function()
          {
            var input = $('#uploadInput');
            myGraph.uploadGraph(input);
          }
        })
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

$('#sidebarMenuDownloadGraphItem')
  .click(function() {
    myGraph.downloadGraph();
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

$('#typeLdpServerCheckbox').checkbox({
  onChecked:function() {
    myGraph.typeLdpServer = "external";
    $('#graphNameSegment').hide();
  },
  onUnchecked: function() {
    myGraph.typeLdpServer = "local";
    $('#graphNameSegment').show();
  },
});

$('#curvesLinksCheckbox').checkbox({
  onChecked:function() {
    myGraph.config.curvesLinks = "On";
    myGraph.refreshGraph();
  },
  onUnchecked: function() {
    myGraph.config.curvesLinks = "Off";
    myGraph.refreshGraph();
  },
});

$('#editGraphModeCheckbox').checkbox({
  onChecked:function() {
    myGraph.config.editGraphMode = true;
    myGraph.config.allowDraggingNode = true;
    myGraph.config.allowModifyLink = true;
    myGraph.config.allowOpenNode = true;
    myGraph.config.editWithDoubleClick = true;
    myGraph.config.newNodeWithDoubleClickOnBg = true;
    myGraph.config.allowDragOnBg = true;
    myGraph.refreshGraph();
  },
  onUnchecked: function() {
    myGraph.config.editGraphMode = false;
    myGraph.config.allowDraggingNode = false;
    myGraph.config.allowModifyLink = false;
    myGraph.config.allowOpenNode = false;
    myGraph.config.editWithDoubleClick = false;
    myGraph.config.newNodeWithDoubleClickOnBg = false;
    myGraph.config.allowDragOnBg = false;
    myGraph.refreshGraph();
  }
});

$('#displayFlodCheckbox').checkbox({
  onChecked:function() {
    myGraph.config.clicOnNodeAction = "flod"
    myGraph.refreshGraph();
  },
  onUnchecked: function() {
    myGraph.config.clicOnNodeAction = "options"
    myGraph.refreshGraph();
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

$('#displayIndexCheckbox').checkbox({
  onChecked: function() {
    myGraph.config.displayIndex = "On";
    myGraph.refreshGraph();
  },
  onUnchecked: function() {
    myGraph.config.displayIndex = "Off";
    myGraph.refreshGraph();
  }
});

$('#LinkCreationModeCheckbox').checkbox({
  onChecked: function() {
    myGraph.config.makeLinkSelectingNode = "On";
    myGraph.refreshGraph();
  },
  onUnchecked: function() {
    myGraph.config.makeLinkSelectingNode = "Off";
    myGraph.refreshGraph();
  }
});

$('#message').hide();
