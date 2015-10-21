/*
Code lié au menu
*/

$('#refreshGraph')
    .click(function()
    {
      location.reload()
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

/*
Code lié au formulaire de gauche
*/

  var dataldp = [];
  var datalink = [];
  var tab_uri = [];
  var compteur_node = 0;
  var uri_to_nodeid = [];
  var nb_objets = 0;
  var force;
  var nodes;
  var edges;

  //Prepare the SVG + G + G + rect
  addSvgSocle("#chart",500,500)

  window.storepeople = new MyStore({
      container: "https://localhost:8443/2013/people/",
      context: "http://owl.openinitiative.com/oicontext.jsonld",
      template: $("#main-template-people").html(),
      partials: {'profilepeople': $("#profile-template-people").html()},
  });

  buildGraph(storepeople,"about",500,500,false);
  buildListHtml(storepeople,"about","#div-people")

  window.storetodo = new MyStore({
      container: "https://localhost:8443/2013/todos/",
      context: "http://owl.openinitiative.com/oicontext.jsonld",
      template: $("#main-template-todo").html(),
      partials: {'profiletodo': $("#profile-template-todo").html()},
  });

  buildListHtml(storetodo,"todos","#div-todo")
  buildSelectHtml(storepeople,"about")

  buildGraph(storetodo,"todos",500,500,true);

  function buildListHtml(store,voc, div)
  {
    //lco = List of Container Object
    //co = Container Object
    //cop = Container Object Property
    //voc = Vocabulary
    //dataldp_ = local
    //tab_uri_ = local

    var dataldp_ = [];
    var tab_uri_ = [];
    var properties;
    store.list(store.container).then(function(lco) {
      var inc = 0;
      lco.forEach(function(co) {
        store.get(co,store.context).then(function(cop) {
          inc++;
          store.resetId(cop);
          dataldp_.push(cop[voc]);
          tab_uri_.push(cop["@id"]);

          if (inc == lco.length)
          {
            //fusion des deux tableaux pour ajouter l'id
              var i=0;
              tab_uri_.forEach(function(uri){
                dataldp_[i].uri = uri;
                // delete dataldp[i]["@id"];
                if (voc == "about")
                {
                  $(div).append("<li>"+ " ["+dataldp_[i].uri.split("/").pop()+"] "
                                  + "<b>" + dataldp_[i].name + "</b>"
                                  + " ("+dataldp_[i].description+")"
                                  + "<button onclick='javascript:deleteTodo();'>X</button> </li>")
                }
                else {
                  buildListHtmlFromCo(store, uri, voc, div);
                }

                i++;
              });
          }
        });
      });
    });
  }

  function buildListHtmlFromCo(store, uri, voc, div)
  {
    //lco = List of Container Object
    //co = Container Object
    //cop = Container Object Property
    //voc = Vocabulary
    //dataldp_ = local
    //tab_uri_ = local

    store.list(store.container).then(function(lco) {
      var inc = 0;
      lco.forEach(function(co) {
        store.get(co,store.context).then(function(cop) {
          inc++;
          store.resetId(cop);

          if (cop["@id"] == uri)
          {
            $(div).append("<li>"+ " ["+cop["@id"].split("/").pop()+"] "
                            + "<b>" + cop[voc].label + "</b>"
                            + " affecté à ["+cop[voc].assignee.split("/").pop()+"] "
                            + "<button onclick=javascript:deleteTodo('"+uri+"')>X</button></li>")
          }
        });
      });
    });

  }

  function buildSelectHtml(store, voc)
  {
    //lco = List of Container Object
    //co = Container Object
    //cop = Container Object Property
    //voc = Vocabulary
    //dataldp_ = local
    //tab_uri_ = local

    var dataldp_ = [];
    var tab_uri_ = [];
    store.list(store.container).then(function(lco) {
      var inc = 0;
      lco.forEach(function(co) {
        store.get(co,store.context).then(function(cop) {
          inc++;
          store.resetId(cop);
          dataldp_.push(cop[voc]);
          tab_uri_.push(cop["@id"]);

          if (inc == lco.length)
          {
            //fusion des deux tableaux pour ajouter l'id
            var i=0;
            tab_uri_.forEach(function(uri){
              dataldp_[i].uri = uri;
              // delete dataldp[i]["@id"];
              $("#assigneeselect")
                .append($("<option>",{
                  value : dataldp_[i].uri,
                  text : "["+dataldp_[i].uri.split("/").pop()+"] " + dataldp_[i].name
                }))
              i++;
            });
          }
        });
      });
    });
  }

  function buildGraph(store,voc,w,h,display)
  {
    //lco = List of Container Object
    //co = Container Object
    //cop = Container Object Property
    //voc = Vocabulary

    store.list(store.container).then(function(lco) {
      var inc = 0;
      lco.forEach(function(co) {
        store.get(co,store.context).then(function(cop) {
          store.resetId(cop); //change id with @id if it occure
          var temp_cop = {};

          temp_cop.nodeid = compteur_node;
          temp_cop.uri = cop["@id"];
          temp_cop.type = voc;

          if (voc == "about")
          {
            temp_cop.name = cop[voc].name;
            temp_cop.description = cop[voc].description;

          }
          else //todos
          {
            temp_cop.label = cop[voc].label;
            temp_cop.assignee = cop[voc].assignee;
          }

          uri_to_nodeid[temp_cop.uri] = temp_cop.nodeid;

          dataldp.push(temp_cop);
          inc++;
          compteur_node++;

          if (temp_cop.assignee)
          {
            //Create datalink
            var nodeid_source = uri_to_nodeid[temp_cop.uri];
            var nodeid_target = uri_to_nodeid[temp_cop.assignee];
            datalink.push({source : nodeid_source, target : nodeid_target})
          }

          if (inc == lco.length && display)
            displayGraph();

        });
      });

    });
  }

  function addSvgSocle(div,width,height)
  {

    var outer = d3.select(div)
  	  	.append("svg:svg")
  	    .attr("width", width)
  	    .attr("height", height)

    // build the arrow.
    outer.append("svg:defs").selectAll("marker")
            .data(["end"])
          .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

    var svg = outer
      .append('svg:g')
      .call(d3.behavior.zoom().on("zoom", rescale))
      .on("dblclick.zoom", addnode)
      .append('svg:g')
      .attr('id', 'socle')

    svg.append('svg:rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', "#eee")
  }

  /*
  Code lié à la carto à droite
  */
  function displayGraph() {

    var n=100;

    datalinktest = [
            { source: 0, target: 4 },
            { source: 0, target: 5 },
    ]

    var dataset = {
      nodes: dataldp,
      edges: datalink,
    }

    var node_drag = d3.behavior.drag()
      .on("dragstart", dragstart)
      .on("drag", dragmove)
      .on("dragend", dragend);

    force = d3.layout.force()
                         .nodes(dataset.nodes)
                         .links(dataset.edges)
                         .size([500, 500])
                         .linkDistance(100)
                         .charge([-500])

    force.start();
     	for (var i = n * n; i > 0; --i) force.tick();
    force.stop();

    var socle = d3.select("#socle");

    edges = socle.selectAll("path")
            .data(dataset.edges)
            .enter()
            .append("svg:path")
            .style("stroke", "#aaa")
            .style("stroke-width", "2")
            .style("fill", "none")
            .attr("marker-end", "url(#end)")

    edges.attr("d", function(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" +
          d.source.x + "," +
          d.source.y + "A" +
          dr + "," + dr + " 0 0,1 " +
          d.target.x + "," +
          d.target.y;
    })

    nodes = socle.selectAll("circle")
            .data(dataset.nodes)
            .enter()
            .append("g")
            .attr("id", "node")
            .attr("iri_id", "iri_id")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(node_drag);

    nodes.append("circle")
            .attr("r", 7)
            .style("fill", function(d){return d.name ? "red" : "yellow";})
            .style("stroke", "#aaa")
            .style("stroke-width", "2")

    nodes.append("text")
      .text(function(d){
        if (d.type == "about")
          return "["+d.nodeid+"] "+d.name;
        else
          return "["+d.nodeid+"] "+d.label;
        })
      .attr("font-size","16")
      .attr("x", 0)
      .attr("y", -10)

    nodes.append("text")
      .text(function(d){return "("+d.uri.split("/").pop()+")" })
      .attr("font-size","10")
      .attr("x", 10)
      .attr("y", 5)

      force.on("tick", tick);

  }

  function tick()
	{
    edges.attr("d", function(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" +
          d.source.x + "," +
          d.source.y + "A" +
          dr + "," + dr + " 0 0,1 " +
          d.target.x + "," +
          d.target.y;
    })

		nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}

  function rescale()
  {
    trans=d3.event.translate;
    scale=d3.event.scale;

    d3.select("#socle")
      .attr("transform",
        "translate(" + trans + ")"
        + " scale(" + scale + ")");
  }

  function dragstart(d, i) {
		d3.event.sourceEvent.stopPropagation();
		force.stop();
	}

	function dragmove(d, i) {
		d.px += d3.event.dx;
		d.py += d3.event.dy;
		d.x += d3.event.dx;
		d.y += d3.event.dy;
		tick(); // this is the key to make it work together with updating both px,py,x,y on d !
	}

	function dragend(d, i) {
		d3.select(this).classed("fixed", d.fixed = true)
						.select("#flud").style("stroke", "#999");
		tick();
		force.resume();
	}

  function addnode()
  {
    console.log("addnode");
  }

  //Create a new element in the store and refresh the list
  function addNewPeople() {
      var name = $('#name').val();
      var description = $('#description').val();
      var data =  {"@context": "http://owl.openinitiative.com/oicontext.jsonld", about: {name:name, description: description}};
      $('#name').attr("placeholder", "Name ?") ;
      $('#description').attr("placeholder", "Description ?") ;
      window.storepeople.save(data);
      window.storepeople.render("#div-people");
  }

  //Create a new element in the store and refresh the list
  function addNewTodo() {
      var assignee_uri = $('#assigneeselect').val();
      var label = $('#label').val();
      var data =  {"@context": "http://owl.openinitiative.com/oicontext.jsonld", todos: {assignee:assignee_uri, label: label}};
      $('#label').attr("placeholder", "Libellé ?") ;
      window.storetodo.save(data);
      window.storetodo.render("#div-todo");
  }

  function deleteTodo(uri) {
    window.storetodo.delete(uri);
  }
