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

$(function(){
  //Prepare the SVG + G + G + rect
  addSvgSocle("#chart",500,500)

    window.storepeople = new MyStore({
        container: "https://localhost:8443/2013/people/",
        context: "http://ld.hackers4peace.net/contexts/plp.jsonld",
        template: $("#main-template-people").html(),
        partials: {'profilepeople': $("#profile-template-people").html()},
    });

  storepeople.render("#div-people")

  buildGraph(storepeople,"about",500,500);

    window.storetodo = new MyStore({
        container: "https://localhost:8443/2013/todos/",
        context: "http://owl.openinitiative.com/oitodo.jsonld",
        template: $("#main-template-todo").html(),
        partials: {'profiletodo': $("#profile-template-todo").html()},
    });
    storetodo.render("#div-todo");

    buildGraph(storetodo,"todos",500,500);
});

function buildGraph(store,ontologie,w,h)
{
  var dataldp = [];
  var tab_id = [];
  var ontologie = ontologie;
  store.list(store.container).then(function(list) {
    var inc = 0;
    list.forEach(function(id) {
      this.get(id,store.context).then(function(object) {
        inc++;
        dataldp.push(object[ontologie]);
        tab_id.push(object.id);
        if (inc == list.length)
        {
          //fusion des deux tableaux pour ajouter l'id
            var i=0;
            tab_id.forEach(function(id){
              dataldp[i].uri = id;
              delete dataldp[i]["id"];
              i++;
            });

            displayGraph(dataldp);
        }
      }.bind(store));
    }.bind(store));
  });
}

function addSvgSocle(div,width,height)
{
  var outer = d3.select(div)
	  	.append("svg:svg")
	    .attr("width", width)
	    .attr("height", height)

  var svg = outer
    .append('g')
    .call(d3.behavior.zoom().on("zoom", rescale))
    .on("dblclick.zoom", addnode)
    .append('g')
    .attr('id', 'socle')

  svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', "#ddd")
}

/*
Code lié à la carto à droite
*/
function displayGraph(dataldp) {
  console.log(dataldp);

  var n=100;

  var dataset = {
    nodes: dataldp,
    edges: []
  }

  var force = d3.layout.force()
                       .nodes(dataset.nodes)
                       .links(dataset.edges)
                       .size([500, 500])
                       .linkDistance([100])
                       .charge([-500])

  force.start();
   	for (var i = n * n; i > 0; --i) force.tick();
  force.stop();

  var colors = d3.scale.category10();

var socle = d3.select("#socle");

  var nodes = socle.selectAll("circle")
          .data(dataset.nodes)
          .enter()
          .append("g")
          .attr("id", "node")
          .attr("iri_id", "iri_id")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

  nodes.append("circle")
          .attr("r", 10)
          .style("fill", "red")

  nodes.append("text")
    .text(function(d){return d.name || d.label;})
    .attr("font-size","16")
    .attr("x", 0)
    .attr("y", -10)
  nodes.append("text")
    .text(function(d){return "("+d.uri.split("/").pop()+")" })
    .attr("font-size","10")
    .attr("x", 10)
    .attr("y", 5)
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

function addnode()
{
  console.log("addnode");
}

//Create a new element in the store and refresh the list
function addNewPeople() {
    var name = $('#name').val();
    var description = $('#description').val();
    var data =  {"@context": "http://ld.hackers4peace.net/contexts/plp.jsonld", about: {name:name, description: description}};
    window.storepeople.save(data);
    window.storepeople.render("#div-people");
};

//Create a new element in the store and refresh the list
function addNewTodo() {
    var assignee = $('#assignee').val();
    var label = $('#label').val();
    var data =  {"@context": "http://owl.openinitiative.com/oitodo.jsonld", todos: {assignee:assignee, label: label}};
    window.storetodo.save(data);
    window.storetodo.render("#div-todo");
};
