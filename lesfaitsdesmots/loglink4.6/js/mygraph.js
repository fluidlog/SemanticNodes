// define graph object
var myGraph = function (firstBgElement,d3data)
{

  /*
  *
  *           Initialisation
  *
  ****************************/

  this.config = {
    size : 20,
    type : "N",
    xNewNode : 100,
    yNewNode : 100,
    bgElementType : "simple",
    forceTick : "On",
    uriBase : "http://fluidlog.com/",
    linkDistance : 100,
    charge : -1000,
  }

  this.firstBgElement = firstBgElement || [],
  this.d3data = d3data || [],
  this.nodes_enter = this.d3data.nodes || [];
  this.links_enter = this.d3data.links || [];
  this.width = window.innerWidth - 30;
  this.height = window.innerHeight - 30;

  this.node_drag = d3.behavior.drag()
  					.on("dragstart", this.dragstart)
  					.on("drag", this.dragmove)
  					.on("dragend", this.dragend);

  this.force = d3.layout.force()
                        .nodes(this.d3data.nodes)
                        .links(this.d3data.links)
                        .size([this.width, this.height])
                        .linkDistance(100)
                        .charge(-1000)
}

/*
*
*           functions
*
****************************/

//rescale g
myGraph.prototype.rescale = function()
{
  // console.log("rescale start");

  this.bgElement.attr("transform",
    "translate(" + d3.event.translate + ")"
    + " scale(" + d3.event.scale + ")");

  // console.log("rescale end");
}

myGraph.prototype.addSvg = function()
{
  // console.log("addSvg start");

  var div = this.firstBgElement;

  if (this.config.bgElementType == "simple")
  {
    d3.select(div)
          .append("svg:svg")
          .attr("width", this.width)
          .attr("height", this.height)
          .append('svg:g')
          .attr('id', 'bgElement')
  }
  else
  {
    var outer = d3.select(div)
          .append("svg:svg")
          .attr("width", this.width)
          .attr("height", this.height)

    var svg = outer
      .append('svg:g')
      .call(d3.behavior.zoom().on("zoom", this.rescale))
      .on("dblclick.zoom", null)
      .on("click", null)
      .on("dblclick", this.addNode)
      .append('svg:g')
      .attr('id', 'bgElement')

    svg.append('svg:rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', this.width)
          .attr('height', this.height)
          .attr('fill', "#eee")
  }

  // console.log("addSvg end");
}

myGraph.prototype.activeForce = function()
{
  // console.log("activeForce start");

  if (this.config.forceTick == "On")
  {
    this.force.start();
  }
  else // Off
  {
    // Run the layout a fixed number of times.
  	// The ideal number of times scales with graph complexity.
    this.force.start();
  	for (var i = 1000; i > 0; --i) this.force.tick();
    this.force.stop();
  }

  console.log("activeForce end");
}

myGraph.prototype.drawGraph = function()
{
  console.log("drawGraph start");


  this.force.start();

  if (typeof this.d3data.links != "undefined")
  {
    this.links_enter = this.bgElement.selectAll("#link")
                			.data(this.d3data.links)
                			.enter()
                			.append("line")
                		  .attr("x1", function(d) { return d.source.x; })
                		  .attr("y1", function(d) { return d.source.y; })
                		  .attr("x2", function(d) { return d.target.x; })
                		  .attr("y2", function(d) { return d.target.y; })
                			.attr("id", "link")
                			.attr("stroke", "#DDD")
                			.attr("stroke-width", 5)
  }

  if (typeof this.d3data.nodes != "undefined")
  {
    this.nodes_enter = this.bgElement.selectAll("#node")
    				.data(this.d3data.nodes)
    				.enter()
    				.append("g")
    				.attr("id", "node")
    				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            // .call(node_drag)

    var circle = this.nodes_enter.append("circle")
          .attr("id", "nodecircle")
          .style("fill", function (d){
            	switch (d.type)
            	{
            		case "P" : return "red"; break
            		case "A" : return "orange";	break
            		case "I" : return "yellow"; break
                case "R" : return "green"; break
                case "N" : return "gray"; break
            	}
          })
          .style("opacity", 1)
          .style("stroke", "#DDD")
          .style("stroke-width", "7")
          .style("cursor", "pointer")
          .on("click",this.click)
          .attr("r", 0)
				  .transition()
				  .duration(300)
          .attr("r", function(d) { return d.size ; })

    var text = this.nodes_enter.append("text")
    			.attr("text-anchor", "middle")
    			.attr("dy", ".25em")
    			.text(function(d) { return d.name+d.index })
    			.style("font-size", 14)
  }

  //Bind mouvexy function to tick
  // this.force.on("tick", this.movexy);
  this.links_enter.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

  this.nodes_enter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


  console.log("drawGraph end");
}

myGraph.prototype.addNode = function(newnode)
{
  console.log("addnode start");

  var xy = [];

  if (typeof this.__ondblclick != "undefined")  //if after dblclick
  {
    xy = d3.mouse(this);
  }
  else
  {
    xy[0] = this.config.xNewNode;
    xy[1] = this.config.yNewNode;
  }

  if (typeof newnode == "undefined")
    var newnode = {}

  if (typeof newnode.name == "undefined")
    newnode.name = "x";
  if (typeof newnode.size == "undefined")
    newnode.size = this.config.size;
  if (typeof newnode.type == "undefined")
    newnode.type = this.config.type;
  if (typeof newnode.nodeid == "undefined")
    newnode.nodeid = this.config.uriBase + d3data.nodes.length;
  if (typeof newnode.index == "undefined")
    newnode.index = d3data.nodes.length;

  if (typeof newnode.x == "undefined")
    newnode.x = xy[0];
  if (typeof newnode.y == "undefined")
    newnode.y = xy[1];

  this.d3data.nodes.push(newnode)

  //If we don't put that, when you add a new node, then if you move it -> error (0,0)
  //activeForce()

  this.drawGraph();

  console.log("d3data.nodes", d3data.nodes);
  console.log("addnode end");
}

myGraph.prototype.movexy = function()
{
  // console.log("movexy start");

  this.links_enter.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

  this.nodes_enter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  // console.log("movexy end");
}

myGraph.prototype.click = function(d, i)
{
  // console.log("click start");

  if (d3.event.defaultPrevented) return;

  //Toggle Class="fixed", fix d force and change circle stroke
  var circle_stroke;
	d3.select(this).classed("fixed", function(d)
      {
        if (d.fixed == true)
        {
          d.fixed = false;
          circle_stroke = "#DDD";
          return false;
        }
        else {
          d.fixed = true
          circle_stroke = "#999"
          return true;
        }
      })
      .style("stroke", circle_stroke);

  // console.log("click end");
}

myGraph.prototype.dragstart = function(d, i) {
  // console.log("dragstart start");

  d3.event.sourceEvent.stopPropagation();
  this.force.stop();

  // console.log("dragstart end");
}

myGraph.prototype.dragmove = function(d, i) {
  // console.log("dragmove start");

	d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy;
  this.movexy(); // this is the key to make it work together with updating both px,py,x,y on d !

  // console.log("dragmove end");
}

myGraph.prototype.dragend = function(d, i) {
  // console.log("dragend start");

  this.movexy();
  this.force.resume(); //start force with force.alpha=0.1

  // console.log("dragend end");
}
