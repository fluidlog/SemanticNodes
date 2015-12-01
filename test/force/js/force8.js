// Ajout du Pan + Zoom
var data = {"nodes":[
						{"name":"fluidlog", "full_name":"Les ontologies graphiques fluides !", "url": "", "type":"quoi"},
						{"name":"Démo statique", "full_name":"technos, acteurs, projets", "url": "fluidlog.com/lesfaitsdesmots/CartographieSemantique/index.html", "type":"ou"},
						{"name":"Contact", "full_name":"@fluidlog", "url": "twitter.com/fluidlog", "type":"qui"},
						{"name":"Wiki", "full_name":"Wiki (privé)", "url": "fluidlog.cloud.xwiki.com", "type":"comment"},
						{"name":"Blog", "full_name":"Les ontologies graphiques (privé)", "url": "lesontologiesgraphiques.wordpress.com/", "type":"comment"}												
					], 
			"links":[
						{"source":0,"target":1,"value":1},
						{"source":0,"target":2,"value":1},
						{"source":0,"target":3,"value":1},
						{"source":0,"target":4,"value":1}
						]
			   }    

/* ---------------------------------------------------------------- *
 * Déclaration de la carto, des forces, des liens et des noeuds
 * ---------------------------------------------------------------- */

var width = 1200,height = 800

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

var outer = d3.select("body")
	.append("svg:svg")
	.attr("width", width)
	.attr("height", height)
	.attr("pointer-events", "all");

var vis = outer
		.append('svg:g')
		  .call(d3.behavior.zoom().on("zoom", rescale))
		  .on("dblclick.zoom", null)
		.append('svg:g')

vis.append('svg:rect')
		.attr('width', width)
		.attr('height', height)
		.attr('fill', 'white');

var force = self.force = d3.layout.force()
	.nodes(data.nodes)
	.links(data.links)
	.size([width, height])
//	.linkDistance(20)
//	.linkStrength(0.2)
//	.gravity(0.05)
//	.theta(0.05)
	.charge([-3000])
	.start();		

var link = vis.selectAll("line.link")
	.data(data.links)
	.enter().append("svg:line")
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; })
    .attr("class", "link")
    .style("stroke", "#aaa")
    .style("stroke-width", 5)
	.style("opacity", "0.7")

var node = vis.selectAll("g.node")
				.data(data.nodes)
				.enter()
				.append("svg:g")
				.attr("class", "node")

/* ---------------------------------------------------------------- *
 * Habillage des noeuds et du text sur le noeud
 * ---------------------------------------------------------------- */

node.append("circle")
	.attr("cx", 0)
	.attr("cy", -5)
	.attr("r", 0)
    .attr("class", "CircleOptions")
	.style("stroke", "aaa")
	.style("fill-opacity", "0")
	.style("stroke-width", "5")
	.style("cursor", "not-allowed")

/* Option de déplacement Fluide (F) */
node.append("circle")
	.attr("cx", -30)
	.attr("cy", -30)
	.attr("r", 0)
    .attr("class", "CircleF")
	.style("stroke", "aaa")
	.attr("fill", function(d)
			{
				if (d.type == "qui") 
					return "#FF0"; 
				else if (d.type == "quoi")
					return "#A00";
				else if (d.type == "ou")
					return "#00A";
				else if (d.type == "comment")
					return "#0A0";
				else if (d.type == "nav")
					return "#AAA";
			})
	.style("fill-opacity", "1")
	.style("stroke-width", "2")
	.style("cursor", "move")
	.call(force.drag)

node.append("text")
	.attr("x", -30)
	.attr("y", -26)
	.attr("text-anchor", "middle")
    .attr("class", "TextF")
	.style("font-size","14")
	.style("fill", function(d)
			{
		if (d.type == "qui") 
			return "black"; 
		else if (d.type == "quoi")
			return "white";
		else if (d.type == "ou")
			return "white";
		else if (d.type == "comment")
			return "white";
			}
	)
	.style("font-family", "Courier New")
	.style("visibility", "hidden")
	.text("F")
	.style("cursor", "move")
	.call(force.drag)

/* Option de link (L) */
node.append("circle")
	.attr("cx", 30)
	.attr("cy", -30)
	.attr("r", 0)
    .attr("class", "CircleL")
	.style("stroke", "aaa")
	.attr("fill", function(d)
			{
				if (d.type == "qui") 
					return "#FF0"; 
				else if (d.type == "quoi")
					return "#A00";
				else if (d.type == "ou")
					return "#00A";
				else if (d.type == "comment")
					return "#0A0";
				else if (d.type == "nav")
					return "#AAA";
			})
	.style("fill-opacity", "1")
	.style("stroke-width", "2")
	.style("cursor", "pointer")
	.on("click", openLink())
	.call(force.drag)

node.append("text")
	.attr("x", 30)
	.attr("y", -26)
	.attr("text-anchor", "middle")
    .attr("class", "TextL")
	.style("font-size","14")
	.style("fill", function(d)
			{
		if (d.type == "qui") 
			return "black"; 
		else if (d.type == "quoi")
			return "white";
		else if (d.type == "ou")
			return "white";
		else if (d.type == "comment")
			return "white";
			}
	)
	.style("font-family", "Courier New")
	.style("cursor", "pointer")
	.style("visibility", "hidden")
	.text("L")
	.on("click", openLink())
	.call(force.drag)

/* Option de URL (I) */
node.append("circle")
	.attr("cx", -30)
	.attr("cy", 20)
	.attr("r", 0)
    .attr("class", "CircleI")
	.style("stroke", "aaa")
	.attr("fill", function(d)
			{
				if (d.type == "qui") 
					return "#FF0"; 
				else if (d.type == "quoi")
					return "#A00";
				else if (d.type == "ou")
					return "#00A";
				else if (d.type == "comment")
					return "#0A0";
				else if (d.type == "nav")
					return "#AAA";
			})
	.style("fill-opacity", "1")
	.style("stroke-width", "2")
	.style("cursor", "pointer")
	.on("click", openLink())
	.call(force.drag)

node.append("text")
	.attr("x", -30)
	.attr("y", 26)
	.attr("text-anchor", "middle")
    .attr("class", "TextI")
	.style("font-size","14")
	.style("fill", function(d)
			{
		if (d.type == "qui") 
			return "black"; 
		else if (d.type == "quoi")
			return "white";
		else if (d.type == "ou")
			return "white";
		else if (d.type == "comment")
			return "white";
			}
	)
	.style("font-family", "Courier New")
	.style("cursor", "pointer")
	.style("visibility", "hidden")
	.text("I")
	.on("click", openLink())
	.call(force.drag)

/* Option de URL (U) */
node.append("circle")
	.attr("cx", 30)
	.attr("cy", 20)
	.attr("r", 0)
    .attr("class", "CircleU")
	.style("stroke", "aaa")
	.attr("fill", function(d)
			{
				if (d.type == "qui") 
					return "#FF0"; 
				else if (d.type == "quoi")
					return "#A00";
				else if (d.type == "ou")
					return "#00A";
				else if (d.type == "comment")
					return "#0A0";
				else if (d.type == "nav")
					return "#AAA";
			})
	.style("fill-opacity", "1")
	.style("stroke-width", "2")
	.style("cursor", "pointer")
	.on("click", openLink())
	.call(force.drag)

node.append("text")
	.attr("x", 30)
	.attr("y", 26)
	.attr("text-anchor", "middle")
    .attr("class", "TextU")
	.style("font-size","14")
	.style("fill", function(d)
			{
		if (d.type == "qui") 
			return "black"; 
		else if (d.type == "quoi")
			return "white";
		else if (d.type == "ou")
			return "white";
		else if (d.type == "comment")
			return "white";
			}
	)
	.style("font-family", "Courier New")
	.style("cursor", "pointer")
	.style("visibility", "hidden")
	.text("U")
	.on("click", openLink())
	.call(force.drag)

/* Flud */
node.append("rect")
	.attr("x", rectx("normal"))
	.attr("y", "-17")
	.attr("rx", 10) //Gère les bords arrondis
	.attr("ry", 10) //Gère les bords arrondis
	.attr("width", rectWidth("normal"))
	.attr("height", rectHeight("normal"))
	.attr("fill", function(d)
			{
				if (d.type == "qui") 
					return "#FF0"; 
				else if (d.type == "quoi")
					return "#A00";
				else if (d.type == "ou")
					return "#00A";
				else if (d.type == "comment")
					return "#0A0";
				else if (d.type == "nav")
					return "#AAA";
			})
	.style("cursor", "text")
	.style("opacity", 1)

node.append("text")
	.attr("text-anchor", "middle")
	.style("font-size",textSize("normal"))
	.style("fill", function(d)
			{
				if (d.type == "qui") 
					return "black"; 
				else if (d.type == "quoi")
					return "white";
				else if (d.type == "ou")
					return "white";
				else if (d.type == "comment")
					return "white";
			}
	)
	.style("font-family", "Courier New")
	.style("cursor", "text")
//	.style("pointer-events", function(d)
//		{
//			if (d.type == "quoi") 
//				return "none";
//		}
//	)
	.text(function(d) { return d.name })


/* ---------------------------------------------------------------- *
 * Gestion du hover
 * ---------------------------------------------------------------- */

node.on("mouseover", function (d) 
	{
		d3.select(this).select('.CircleOptions')
						.transition()
						.duration(300)
						.attr("r", 40)
						
		d3.select(this).select('.CircleF')
						.transition()
						.duration(300)
						.attr("r", 10)

		d3.select(this).select('.TextF')
						.transition()
						.duration(300)
						.style("visibility", "visible")

		d3.select(this).select('.CircleL')
						.transition()
						.duration(300)
						.attr("r", 10)

		d3.select(this).select('.TextL')
						.transition()
						.duration(300)
						.style("visibility", "visible")

		d3.select(this).select('.CircleU')
						.transition()
						.duration(300)
						.attr("r", 10)

		d3.select(this).select('.TextU')
						.transition()
						.duration(300)
						.style("visibility", "visible")

		d3.select(this).select('.CircleI')
						.transition()
						.duration(300)
						.attr("r", 10)

		d3.select(this).select('.TextI')
						.transition()
						.duration(300)
						.style("visibility", "visible")
	}
);
	 
node.on("mouseout", function (d) 
	{
		d3.select(this).select('.CircleOptions')
						.transition()
						.duration(300)
						.attr("r", 0)
		
		d3.select(this).select('.CircleF')
						.transition()
						.duration(300)
						.attr("r", 0)

		d3.select(this).select('.TextF')
						.transition()
						.duration(300)
						.style("visibility", "hidden")

		d3.select(this).select('.CircleL')
						.transition()
						.duration(300)
						.attr("r", 0)

		d3.select(this).select('.TextL')
						.transition()
						.duration(300)
						.style("visibility", "hidden")

		d3.select(this).select('.CircleU')
						.transition()
						.duration(300)
						.attr("r", 0)

		d3.select(this).select('.TextU')
						.transition()
						.duration(300)
						.style("visibility", "hidden")

		d3.select(this).select('.CircleI')
						.transition()
						.duration(300)
						.attr("r", 0)

		d3.select(this).select('.TextI')
						.transition()
						.duration(300)
						.style("visibility", "hidden")
	}
);

/* ---------------------------------------------------------------- *
 * Les fonctions 
 * ---------------------------------------------------------------- */
//rescale g
function rescale() {
  trans=d3.event.translate;
  scale=d3.event.scale;

  vis.attr("transform",
      "translate(" + trans + ")"
      + " scale(" + scale + ")");
}

var linkedByIndex = {};
data.links.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}

function fade(opacity,color) 
{
    return function(d) 
    {
		node.style("opacity", function(o) 
				{
					return isConnected(d, o) ? 1 : opacity;
				}
		);
		
        link.style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;
        })
        
        .style("stroke", function(o) {
            return o.source === d || o.target === d ? color : color ;
        });
    }
}

function openLink() 
{
	return function(d) 
	{
		if(d.type != "quoi") 
			if(d.ext == "yes") 
				window.open("//"+d.url)
			else
				window.open("//"+d.url,"_self")
	}
}

function rectx(action) 
{
	if (action == "normal")
		return function(d)
		{
			if (d.type == "qui") 
				return -(11*d.name.length / 2);
			else if (d.type == "quoi")
				return -(12*d.name.length / 2);
			else if (d.type == "ou")
				return -(10*d.name.length / 2);
			else if (d.type == "comment")
				return -(9*d.name.length / 2);
			else if (d.type == "nav")
				return -(9*d.name.length / 2);
		}
	else if (action == "hover")
		return function(d)
		{
			if (d.type == "qui") 
				return -(9*d.full_name.length / 2);
			else if (d.type == "quoi")
				return -(10*d.full_name.length / 2);
			else if (d.type == "ou")
				return -(8*d.full_name.length / 2);
			else if (d.type == "comment")
				return -(8*d.full_name.length / 2);
			else if (d.type == "nav")
				return -(8*d.full_name.length / 2);
		}
}

function rectWidth(action) 
{
	if (action == "normal")
		return function(d)
		{
			if (d.type == "qui") 
				return 11*d.name.length; 
			else if (d.type == "quoi")
				return 12*d.name.length;
			else if (d.type == "ou")
				return 10*d.name.length;
			else if (d.type == "comment")
				return 9*d.name.length;
			else if (d.type == "nav")
				return 9*d.name.length;
		}
	else if (action == "hover")
		return function(d)
		{
			if (d.type == "qui") 
				return 9*d.full_name.length; 
			else if (d.type == "quoi")
				return 10*d.full_name.length;
			else if (d.type == "ou")
				return 8*d.full_name.length;
			else if (d.type == "comment")
				return 8*d.full_name.length;
			else if (d.type == "nav")
				return 8*d.full_name.length;
		}	
}

function rectHeight() 
{
	return function(d)
	{
		if (d.type == "qui") 
			return "24"; 
		else if (d.type == "quoi")
			return "25";
		else if (d.type == "ou")
			return "23";
		else if (d.type == "comment")
			return "21";
		else if (d.type == "nav")
			return "21";
	}
}

function textSize(action) 
{
	if (action == "normal")
		return function(d)
		{
			if (d.type == "qui") 
				return "15px"; 
			else if (d.type == "quoi")
				return "17px";
			else if (d.type == "ou")
				return "14px";
			else if (d.type == "comment")
				return "13px";
			else if (d.type == "nav")
				return "13px";
		}
	else if (action == "hover")
		return function(d)
		{
			if (d.type == "qui") 
				return "13px"; 
			else if (d.type == "quoi")
				return "15px";
			else if (d.type == "ou")
				return "12px";
			else if (d.type == "comment")
				return "11px";
			else if (d.type == "nav")
				return "11px";
		}
}

force.on("tick", function() 
		{
		  link.attr("x1", function(d) { return d.source.x; })
			  .attr("y1", function(d) { return d.source.y; })
			  .attr("x2", function(d) { return d.target.x; })
			  .attr("y2", function(d) { return d.target.y; });
		
		  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		}
);

