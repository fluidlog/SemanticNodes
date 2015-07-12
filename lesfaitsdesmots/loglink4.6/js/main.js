//Carto focus + Context with autonome functions

/*
*
*           Initialisation
*
****************************/

var  nodes_enter,
     links_enter,
     force,
     width = window.innerWidth - 30,
     height = window.innerHeight - 30;

var d3data = {
        nodes: [
                {name: "A", size:20, type:"P", uri:"http://fluidlog/321654" },
                {name: "B", size:20, type:"I", uri:"http://fluidlog/456789" },
                {name: "C", size:20, type:"P", uri:"http://fluidlog/321789" },
                {name: "D", size:20, type:"A", uri:"http://fluidlog/231654" },
                {name: "E", size:20, type:"R", uri:"http://fluidlog/987456" },
        ],
        links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
        ]
};

/*
*
*           program
*
****************************/

var default_size = 20,
    default_type = "N",
    default_x = 100,
    default_y = 100;

var node_drag = d3.behavior.drag()
					.on("dragstart", dragstart)
					.on("drag", dragmove)
					.on("dragend", dragend);

addSvgSocle("#chart",width,height,"socle")

var socle = d3.select('#socle');

force = d3.layout.force()
      .nodes(d3data.nodes)
     .links(d3data.links)
     .size([width, height])
     .linkDistance(100)
     .charge(-1000)

nodes_enter = force.nodes();
links_enter = force.links();

onTimeTick();

drawGraph();

//Bind mouvexy function to tick
force.on("tick", movexy);

/*
*
*           functions
*
****************************/

function onTimeTick()
{
  // console.log("onTimeTick start");

	// Run the layout a fixed number of times.
	// The ideal number of times scales with graph complexity.
	force.start();
	for (var i = 1000; i > 0; --i) force.tick();
	force.stop();

  // console.log("onTimeTick end");
}

function drawGraph()
{
  console.log("drawGraph start");

  if (typeof d3data.links != "undefined")
  {
    links_enter = socle.selectAll("#link")
                			.data(d3data.links)
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

  if (typeof d3data.nodes != "undefined")
  {
    nodes_enter = socle.selectAll("#node")
    				.data(d3data.nodes)
    				.enter()
    				.append("g")
    				.attr("id", "node")
    				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(node_drag)

    var circle = nodes_enter.append("circle")
          .attr("id", "nodecircle")
          .style("fill", color )
          .style("opacity", 1)
          .style("stroke", "#DDD")
          .style("stroke-width", "7")
          .style("cursor", "pointer")
          .on("click",click)
          .attr("r", 0)
				  .transition()
				  .duration(300)
          .attr("r", function(d) { return d.size ; })

    var text = nodes_enter.append("text")
    			.attr("text-anchor", "middle")
    			.attr("dy", ".25em")
    			.text(function(d) { return d.name+d.index })
    			.style("font-size", 14)
  }

  console.log("drawGraph end");
}

function addNode(newnode)
{
  console.log("addnode start");

  var mouse_coord = [];

  if (typeof this.__ondblclick != "undefined")  //if after dblclick
  {
    mouse_coord = d3.mouse(this);
  }
  else
  {
    mouse_coord[0] = default_x;
    mouse_coord[1] = default_y;
  }

  if (typeof newnode == "undefined")
  {
    var newnode = {
              name : "x",
              size : default_size,
              type : default_type,
              x: mouse_coord[0],
	    	  		y: mouse_coord[1],
              index: d3data.nodes.length,
              }
  }

  d3data.nodes.push(newnode)

  //If we don't put that, when you add a new node, then if you move it -> error (0,0)
  onTimeTick()

  force.nodes(d3data.nodes)
      .links(d3data.links)

  drawGraph();

  console.log("d3data.nodes", d3data.nodes);
  console.log("addnode end");
}

function movexy() {
  // console.log("movexy start");

    links_enter.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

    nodes_enter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  // console.log("movexy end");
}

function click(d, i)
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

function dragstart(d, i) {
  // console.log("dragstart start");

  d3.event.sourceEvent.stopPropagation();
	force.stop();

  // console.log("dragstart end");
}

function dragmove(d, i) {
  // console.log("dragmove start");

	d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy;
  movexy(); // this is the key to make it work together with updating both px,py,x,y on d !

  // console.log("dragmove end");
}

function dragend(d, i) {
  // console.log("dragend start");

  movexy();
	force.resume(); //start force with force.alpha=0.1

  // console.log("dragend end");
}

function color(d)
{
	switch (d.type)
	{
		case "P" :
			return "red";
		break
		case "A" :
			return "orange";
		break
		case "I" :
			return "yellow";
		break
    case "R" :
			return "green";
		break
    case "N" :
			return "gray";
		break
	}
}

//rescale g
function rescale() {
  // console.log("rescale start");

  socle.attr("transform",
    "translate(" + d3.event.translate + ")"
    + " scale(" + d3.event.scale + ")");

  // console.log("rescale end");
}

function addSvgSocle(div,width,height,type_socle)
{
  // console.log("addSvgSocle start");

  if (type_socle == "simple")
  {
    d3.select(div)
          .append("svg:svg")
          .attr("width", width)
          .attr("height", height)
          .append('svg:g')
          .attr('id', 'socle')
  }
  else
  {
    var outer = d3.select(div)
          .append("svg:svg")
          .attr("width", width)
          .attr("height", height)

    var svg = outer
      .append('svg:g')
      .call(d3.behavior.zoom().on("zoom", rescale))
      .on("dblclick.zoom", null)
      .on("click", null)
      .on("dblclick", addNode)
      .append('svg:g')
      .attr('id', 'socle')

    svg.append('svg:rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', "#eee")

  }

  // console.log("addSvgSocle end");
}
