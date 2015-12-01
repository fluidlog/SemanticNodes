//focus lors du survol d'un noeud

var data = {"nodes":[
						{"id":0, "name":"# Statiques", "full_name":"technos, acteurs, projets", "url": "", "ext":"no", "type":"quoi"},
						{"id":1, "name":"# Dynamiques", "full_name":"Add your terms on a surface", "url": "", "ext":"no", "type":"quoi"},
						{"id":2, "name":"< fluidlog", "full_name":"Retour à l'acceuil", "url": "fluidlog.com", "ext":"no", "type":"nav"},											
						{"id":3, "name":"# Les faits des mots", "full_name":"Espace de démonstration...", "url": "", "ext":"no", "type":"quoi"},
						{"id":4, "name":"^ Loglink4.1", "full_name":"{relation:4, version:1}", "url": "fluidlog.com/lesfaitsdesmots/loglink4.1/index.html", "ext":"no", "type":"ou"},
						{"id":5, "name":"^ Loglink0.1", "full_name":"{relation:0, version:1}", "url": "fluidlog.com/lesfaitsdesmots/demo/loglink0.1/index.html", "ext":"no", "type":"ou"}
					], 
			"links":[
						{"source":3,"target":1},
						{"source":3,"target":0},
						{"source":1,"target":5},
						{"source":0,"target":4}
						]
			   }    
		

/* ---------------------------------------------------------------- *
 * Déclaration de la carto, des forces, des liens et des noeuds
 * ---------------------------------------------------------------- */

var w = 800,
	h = 800
	
var vis = d3.select("#chart").append("svg:svg")
	.attr("width", w)
	.attr("height", h);
						
var force = self.force = d3.layout.force()
	.nodes(data.nodes)
	.links(data.links)
	.size([w, h])
	.linkDistance(200)
	.linkStrength(0.2)
	.gravity(0.05)
	.theta(0.05)
	.charge([-400])
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
	.style("opacity", "0.7");
	
var node = vis.selectAll("g.node")
				.data(data.nodes)
				.enter().append("svg:g")
				.attr("class", "node")
				.call(force.drag);

	
/* ---------------------------------------------------------------- *
 * Habillage des noeuds et du text sur le noeud
 * ---------------------------------------------------------------- */

// Création d'un rectangle à bord arrondis à la place d'un cercle
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
	.style("cursor", function(d)
			{
				if (d.type == "qui") 
					return "pointer"; 
				else if (d.type == "quoi")
					return "move";
				else if (d.type == "ou")
					return "pointer";
				else if (d.type == "comment")
					return "pointer";
				else if (d.type == "nav")
					return "pointer";
			}
	)
	.style("opacity", 0.7)
	.on("click", openLink());

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
	.style("cursor", function(d)
		{
			if (d.type == "qui") 
				return "pointer"; 
			else if (d.type == "quoi")
				return "move";
			else if (d.type == "ou")
				return "pointer";
			else if (d.type == "comment")
				return "pointer";
			else if (d.type == "nav")
				return "pointer";
		}
	)
	.style("pointer-events", function(d)
		{
			if (d.type == "quoi") 
				return "none";
		}
	)
	.text(function(d) { return d.name })
	.on("click", openLink());

/* ---------------------------------------------------------------- *
 * Gestion du hover
 * ---------------------------------------------------------------- */

node.on("mouseover", function (d) 
	{
		d3.select(this).select('rect')
						.transition()
						.duration(300)
						.attr("x", rectx("hover"))
						.attr("width", rectWidth("hover"))
						.style("opacity", fade(.4,"#aaa"))
	
		d3.select(this).select('text')
						.transition()
						.duration(300)
						.text(function(d){return d.full_name;})
						.style("font-size",textSize("hover"));
	
	}
);
	 
node.on("mouseout", function (d) 
	{
		d3.select(this).select('rect')
						.transition()
						.duration(300)
						.attr("x", rectx("normal"))
						.attr("width", rectWidth("normal"))
						.style("opacity", fade(1,"#aaa"))
	
		d3.select(this).select('text')
						.transition()
						.duration(300)
						.text(function(d){return d.name;})
						.style("font-size",textSize("normal"));
	}
);

/* ---------------------------------------------------------------- *
 * Les fonctions 
 * ---------------------------------------------------------------- */
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
		node.style("stroke-opacity", function(o) 
				{
					thisOpacity = isConnected(d, o) ? 1 : opacity;
					this.setAttribute('fill-opacity', thisOpacity);
					return thisOpacity;
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
