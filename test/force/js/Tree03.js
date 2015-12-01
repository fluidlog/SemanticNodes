//A patir de http://stackoverflow.com/questions/12042858/create-tree-hierarchy-from-csv-in-d3-js

//var data = 
//{
//"basicGenre": "Maps",
//"value" : 5,
//"children": [
// {
//  "basicGenre": "Atlases (Geographic)",
//  "value" : 10,
//  "children": [
//   {
//    "basicGenre": "Atlases 1",
//    "children": []
//   },
//   {
//    "basicGenre": "Atlases 2",
//    "children": []
//   }
//  ]
// }
//]
//}

var data = "genre,groupGenre,basicGenre,value\n" + 
    "genre,No larger group,Maps,5\n" +
    "genre,Maps,Atlases (Geographic),10\n" + 
    "genre,No larger group,Catalogs,6\n" +
    "genre,Catalogs,Auction catalogs,28\n" + 
    "genre,No larger group,Academic dissertations,451\n" + 
    "genre,No larger group,Anti-slavery literature,1\n" +
    "genre,No larger group,Maps,1\n" ;

var width = 960,
    height = 500;

var tree = d3.layout.tree()
    .size([height, width - 160]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(40, 0)");

var csv = d3.csv.parse(data);

  var nodes = tree.nodes(makeTree(csv));

  var link = vis.selectAll("path.link")
      .data(tree.links(nodes))
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = vis.selectAll("g.node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 4.5);

  node.append("text")
      .attr("dx", function(d) { return d.values ? -8 : 8; })
      .attr("dy", 3)
      .attr("text-anchor", function(d) { return d.values ? "end" : "start"; })
      .text(function(d) { return d.basicGenre; });

//NEW Function to Build Tree from CSV data
function makeTree(nodes) {
    var nodeByGenre = {};

    //index nodes by genre in case they are out of order
    nodes.forEach(function(d) {
        nodeByGenre[d.basicGenre] = d;
    });

    //Lazily compute children.
    nodes.forEach(function(d) {
        if (d.groupGenre != "No larger group") {
          var groupGenre = nodeByGenre[d.groupGenre];
          console.log(d.groupGenre);
          if (groupGenre.children) groupGenre.children.push(d);
          else groupGenre.children = [d];
        }
    });

    return {"name": "genres", "children": nodes}
}
