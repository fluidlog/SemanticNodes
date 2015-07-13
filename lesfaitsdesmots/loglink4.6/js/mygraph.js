// define graph object
var myGraph = function (firstBgElement,d3data)
{

  /*
  *
  *           Initialisation
  *
  ****************************/

  //Help to assure that it's the "this" of myGraph object
  var thisGraph = this;

  thisGraph.config = {
    size : 20,
    type : "N",
    xNewNode : 100,
    yNewNode : 100,
    bgElementType : "bg",
    forceTick : "Off",
    uriBase : "http://fluidlog.com/",
    linkDistance : 100,
    charge : -1000,
  }

  thisGraph.firstBgElement = firstBgElement || [],
  thisGraph.d3data = d3data || [],
  thisGraph.bgElement = null,
  thisGraph.nodes_enter = thisGraph.d3data.nodes || [];
  thisGraph.links_enter = thisGraph.d3data.links || [];
  thisGraph.width = window.innerWidth - 30;
  thisGraph.height = window.innerHeight - 30;

  thisGraph.node_drag = d3.behavior.drag()
  					.on("dragstart", thisGraph.dragstart)
  					.on("drag", thisGraph.dragmove)
  					.on("dragend", thisGraph.dragend);

  thisGraph.force = d3.layout.force()
                        .nodes(thisGraph.d3data.nodes)
                        .links(thisGraph.d3data.links)
                        .size([thisGraph.width, thisGraph.height])
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

  //Here, "this" is the <g> where mouse double-clic
  thisGraph = window.myGraph;

  thisGraph.bgElement.attr("transform",
    "translate(" + d3.event.translate + ")"
    + " scale(" + d3.event.scale + ")");

  // console.log("rescale end");
}

myGraph.prototype.addSvg = function(bgElementId)
{
  // console.log("addSvg start");

  var thisGraph = this;
  var div = thisGraph.firstBgElement;

  if (thisGraph.config.bgElementType == "simple")
  {
    d3.select(div)
          .append("svg:svg")
          .attr("width", thisGraph.width)
          .attr("height", thisGraph.height)
          .append('svg:g')
          .attr('id', bgElementId)
  }
  else
  {
    var outer = d3.select(div)
          .append("svg:svg")
          .attr("width", thisGraph.width)
          .attr("height", thisGraph.height)

    var svg = outer
      .append('svg:g')
      .call(d3.behavior.zoom().on("zoom", thisGraph.rescale))
      .on("dblclick.zoom", null)
      .on("click", null)
      .on("dblclick", thisGraph.addNode)
      .append('svg:g')
      .attr('id', bgElementId)

    svg.append('svg:rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', thisGraph.width)
          .attr('height', thisGraph.height)
          .attr('fill', "#eee")
  }

  // console.log("addSvg end");
}

myGraph.prototype.activeForce = function()
{
  // console.log("activeForce start");

  var thisGraph = this;
  if (thisGraph.config.forceTick == "On")
  {
    thisGraph.force.start()
  }
  else // Off
  {
    // Run the layout a fixed number of times.
  	// The ideal number of times scales with graph complexity.
    thisGraph.force.start();
  	for (var i = 1000; i > 0; --i) thisGraph.force.tick();
    thisGraph.force.stop();
  }

  console.log("activeForce end");
}

myGraph.prototype.drawGraph = function()
{
  console.log("drawGraph start");

  var thisGraph = this;
  if (typeof thisGraph.d3data.links != "undefined")
  {
    thisGraph.links_enter = thisGraph.bgElement.selectAll("#link")
                			.data(thisGraph.d3data.links)
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

  if (typeof thisGraph.d3data.nodes != "undefined")
  {
    thisGraph.nodes_enter = thisGraph.bgElement.selectAll("#node")
    				.data(thisGraph.d3data.nodes)
    				.enter()
    				.append("g")
    				.attr("id", "node")
    				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(thisGraph.node_drag)

    var circle = thisGraph.nodes_enter.append("circle")
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
          .on("click",thisGraph.click)
          .attr("r", 0)
				  .transition()
				  .duration(300)
          .attr("r", function(d) { return d.size ; })

    var text = thisGraph.nodes_enter.append("text")
    			.attr("text-anchor", "middle")
    			.attr("dy", ".25em")
    			.text(function(d) { return d.name+d.index })
    			.style("font-size", 14)
  }

  if (thisGraph.config.forceTick == "On")
  {
    thisGraph.force.on("tick", thisGraph.movexy)
  }

  console.log("drawGraph end");
}

myGraph.prototype.addNode = function(newnode)
{
  console.log("addnode start");

  //Here, "this" is the <g> where mouse double-clic
  thisGraph = window.myGraph;

  var xy = [];

  if (typeof this.__ondblclick != "undefined")  //if after dblclick
  {
    xy = d3.mouse(this);
  }
  else
  {
    xy[0] = thisGraph.config.xNewNode;
    xy[1] = thisGraph.config.yNewNode;
  }

  if (typeof newnode == "undefined")
    var newnode = {}

  if (typeof newnode.name == "undefined")
    newnode.name = "x";
  if (typeof newnode.size == "undefined")
    newnode.size = thisGraph.config.size;
  if (typeof newnode.type == "undefined")
    newnode.type = thisGraph.config.type;
  if (typeof newnode.nodeid == "undefined")
    newnode.nodeid = thisGraph.config.uriBase + d3data.nodes.length;
  if (typeof newnode.index == "undefined")
    newnode.index = d3data.nodes.length;

  if (typeof newnode.x == "undefined")
    newnode.x = xy[0];
  if (typeof newnode.y == "undefined")
    newnode.y = xy[1];

  thisGraph.d3data.nodes.push(newnode)

  //If we don't put that, when you add a new node, then if you move it -> error (0,0)
  //activeForce()

  thisGraph.drawGraph();

  console.log("d3data.nodes", d3data.nodes);
  console.log("addnode end");
}

myGraph.prototype.movexy = function()
{
  // console.log("movexy start");

  if (typeof this.tick != "undefined")
  {
    //Here, "this" is the tick
    thisGraph = window.myGraph;
  }
  else
  {
    //Here, "this" is the <g.node> where mouse drag
    thisGraph = this;
  }

  thisGraph.links_enter.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

  thisGraph.nodes_enter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

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

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = window.myGraph;

  d3.event.sourceEvent.stopPropagation();
  thisGraph.force.stop();

  // console.log("dragstart end");
}

myGraph.prototype.dragmove = function(d, i) {
  // console.log("dragmove start");

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = window.myGraph;

	d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy;
  thisGraph.movexy(); // this is the key to make it work together with updating both px,py,x,y on d !

  // console.log("dragmove end");
}

myGraph.prototype.dragend = function(d, i) {
  // console.log("dragend start");

  //Here, "this" is the <g.node> where mouse drag
  thisGraph = window.myGraph;

  if (thisGraph.config.forceTick == "On")
  {
    thisGraph.movexy();
    thisGraph.force.resume(); //start force with force.alpha=0.1
  }

  // console.log("dragend end");
}
