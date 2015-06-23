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
    window.storepeople = new MyStore({
        container: "https://localhost:8443/2013/people/",
        context: "http://ld.hackers4peace.net/contexts/plp.jsonld",
        template: $("#main-template-people").html(),
        partials: {'profilepeople': $("#profile-template-people").html()},
    });

  storepeople.render("#div-people")

  buildGraph(storepeople,"about");
});

$(function(){
    window.storetodo = new MyStore({
        container: "https://localhost:8443/2013/todos/",
        context: "http://owl.openinitiative.com/oitodo.jsonld",
        template: $("#main-template-todo").html(),
        partials: {'profiletodo': $("#profile-template-todo").html()},
    });
    storetodo.render("#div-todo");

    buildGraph(storetodo,"todos");
});

function buildGraph(store,ontologie)
{
  var dataset = [];
  var ontologie = ontologie;
  store.list(store.container).then(function(list) {
    var inc = 0;
    list.forEach(function(id) {
      this.get(id,store.context).then(function(object) {
        inc++;
        dataset.push(object[ontologie]);
        if (inc == list.length)
          displayGraph(dataset);
      }.bind(store));
    }.bind(store));
  });
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

/*
Code lié à la carto à droite
*/
function displayGraph(dataset) {
  console.log(dataset);

  var dataset = {
    nodes: dataset,
    edges: []
  }

  var w = 500,
      h = 300

  var svg = d3.select("#chart")
  			.append("svg")
  			.attr("width", w)
  			.attr("height", h);

  var force = d3.layout.force()
                       .nodes(dataset.nodes)
                       .links(dataset.edges)
                       .size([w, h])
                       .linkDistance([100])
                       .charge([-500])
                       .start();

  var colors = d3.scale.category10();

  var nodes = svg.selectAll("circle")
          .data(dataset.nodes)
          .enter()
          .append("circle")
          .attr("r", 10)
          .style("fill", function(d, i) {
                  return colors(i);
          })
          .call(force.drag);

  var labels = svg.selectAll("text")
  				.data(dataset.nodes)
  				.enter()
  				.append("text")
  				.attr({"x":function(d){return d.x;},"y":function(d){return d.y;}})
  				.text(function(d){return d.name || d.label;})
  				.call(force.drag);


  force.on("tick", function() {

  nodes.attr("cx", function(d) { return d.x; })
       .attr("cy", function(d) { return d.y; });

  labels.attr("x", function(d) { return d.x; })
  		.attr("y", function(d) { return d.y; });
  });

}


// var edges = svg.selectAll("line")
//         .data(dataset.edges)
//         .enter()
//         .append("line")
//         .style("stroke", "#ccc")
//         .style("stroke-width", 1);

// edges.attr("x1", function(d) { return d.source.x; })
//      .attr("y1", function(d) { return d.source.y; })
//      .attr("x2", function(d) { return d.target.x; })
//      .attr("y2", function(d) { return d.target.y; });
