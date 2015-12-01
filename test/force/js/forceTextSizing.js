var data = {"nodes":[
						{"id":"0", "title":"Assemblée Virtuelle", "description":"description de l'AV", "url": "assemblee-virtuelle.org/", "type":"qui"},
						{"id":"1", "title":"Stample", "description":"description de stample", "url": "stample.co", "type":"qui"},
						{"id":"2", "title":"Web sémantique", "description":"description du Web sémantique", "url": "fr.wikipedia.org/wiki/Web_s%C3%A9mantique", "type":"ou"},
						{"id":"3", "title":"Outils", "description":"description de Outils", "url": "", "type":"quoi"},
						{"id":"4", "title":"Cartographie sémantique", "description":"description de Cartographie sémantique", "url": "lesontologiesgraphiques.wordpress.com/", "type":"comment"},											
					], 
			"links":[
						{"source":0,"target":1},
						{"source":0,"target":2},
						{"source":0,"target":3},
						{"source":0,"target":4},
						]
			   }    


var width = 960,
	height = 760;
 
var force = d3.layout.force()
			.nodes(data.nodes)
			.links(data.links)
			.size([width, height])
			.linkDistance(200)
			.charge([-500])
			.start();		

var pack = d3.layout.pack()
			.sort(null)
			.size([width, height])
			.padding(2);
 
var svg = d3.select("body").append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
 
d3.json("readme.json", function(error, json) {
var node = svg.selectAll(".node")
			.data(pack.nodes(flatten(json))
			.filter(function(d) { return !d.children; }))
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
 
node.append("circle")
			.attr("r", function(d) {
				var rayon = d.r;
				return d.r; 
				});
 
node.append("text")
			.text(function(d) { return d.name; })
			.style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
			.attr("dy", ".35em")
			.style("fill", "black")
});
 
// Returns a flattened hierarchy containing all leaf nodes under the root.
function flatten(root) {
	var nodes = [];
	 
	function recurse(node) {
	if (node.children) node.children.forEach(recurse);
	else nodes.push({name: node.name, value: node.size});
	}
	 
	recurse(root);
	return {children: nodes};
}
 
//d3.select(self.frameElement).style("height", height + "px");
