
var dataset = {
        nodes: [
                { name: "Adam" },
                { name: "Bob" },
                { name: "Carrie" },
                { name: "Donovan" },
                { name: "Edward" },
                { name: "Felicity" },
                { name: "George" },
                { name: "Hannah" },
                { name: "Anne" },
                { name: "Emma" },
                { name: "Lou" },
                { name: "Yannick" }
        ],
        links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
                { source: 0, target: 4 },
                { source: 1, target: 5 },
                { source: 2, target: 5 },
                { source: 2, target: 5 },
                { source: 3, target: 4 },
                { source: 5, target: 7 },
                { source: 5, target: 3 },
                { source: 6, target: 7 },
                { source: 7, target: 4 },
                { source: 7, target: 5 },
                { source: 8, target: 9 },
                { source: 8, target: 10 },
                { source: 8, target: 11 }
        ]
};

var w = 800,
    h = 800

var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

var colors = d3.scale.category10();

var force = d3.layout.force()
                     .nodes(dataset.nodes)
                     .links(dataset.links)
                     .size([w, h])
                     .linkDistance(100)
                     .linkStrength(0.1)
                     .friction(0.8)
                     .gravity(0.05)
                     .theta(0.1)
                     .charge([-400])
                     .on("tick", tick)
                     .start();

var links = svg.selectAll(".link")
        .data(dataset.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "#aaa")
        .style("stroke-width", 8)
		.style("opacity", "0.8");

var nodes = svg.selectAll(".node")
        .data(dataset.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
	    .on("mouseover", mouseover)
	    .on("mouseout", mouseout)
        .call(force.drag);

// Création d'un rectangle à bord arrondis à la place d'un cercle
nodes.append("rect")
	.attr("x", function(d) {return -(15*d.name.length / 2);})
	.attr("y", "-20")
	.attr("rx", 10)
	.attr("ry", 10)
	.attr("width", function(d) {return 15*d.name.length})
	.attr("height", 30)
	.style("stroke", "#aaa")
	.style("stroke-width", "5")
	.style("opacity", "0.8");

nodes.append("text")
		.attr("text-anchor", "middle")
		.attr("class", "name")
		.text(function(d) { return d.name; })
		.call(make_editable, "name");

function tick() 
{

	links.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	nodes.attr("cx", function(d) { return d.x; })
	     .attr("cy", function(d) { return d.y; });

}

function mouseover()
{
	d3.select(this).select("rect").transition()
	  .duration(200)
      .style("fill", "#AA0000");
}

function mouseout()
{
	  d3.select(this).select("rect").transition()
	      .duration(200)
	  	  .style("fill", "#DD4D4D");
}

function make_editable(d, field)
{
    console.log("make_editable", arguments);

    this.on("click", function(d) 
    		  {
        var p = this.parentNode;
        console.log(this, arguments);

        // inject a HTML form to edit the content here...

        // bug in the getBBox logic here, but don't know what I've done wrong here;
        // anyhow, the coordinates are completely off & wrong. :-((
        var xy = this.getBBox();
        var p_xy = p.getBBox();

        xy.x -= p_xy.x;
        xy.y -= p_xy.y;

        var el = d3.select(this);
        var p_el = d3.select(p);

        var frm = p_el
			.append("foreignObject")
        	.attr("class", "edit");

        var inp = frm
            .attr("x", xy.x)
            .attr("y", xy.y)
            .attr("width", 200)
            .attr("height", 25)
            .append("xhtml:form")
                    .append("input")
                        .attr("value", function() {
                            // nasty spot to place this call, but here we are sure that the <input> tag is available
                            // and is handily pointed at by 'this':
                            this.focus();

                            return d[field];
                        })
                        .attr("style", "width: 294px;")
                        // make the form go away when you jump out (form looses focus) or hit ENTER:
                        .on("blur", function() {
                            console.log("blur", this, arguments);

                            var txt = inp.node().value;

                            d[field] = txt;
                            el.text(function(d) { return d[field]; });

                            // Note to self: frm.remove() will remove the entire <g> group! Remember the D3 selection logic!
                            p_el.select(".edit").remove();
                        })
                        .on("keypress", function() {
                            console.log("keypress", this, arguments);

                            // IE fix
                            if (!d3.event)
                                d3.event = window.event;

                            var e = d3.event;
                            if (e.keyCode == 13)
                            {
                                if (typeof(e.cancelBubble) !== 'undefined') // IE
                                  e.cancelBubble = true;
                                if (e.stopPropagation)
                                  e.stopPropagation();
                                e.preventDefault();

                                var txt = inp.node().value;

                                d[field] = txt;
                                el
                                    .text(function(d) { return d[field]; });

                                // odd. Should work in Safari, but the debugger crashes on this instead.
                                // Anyway, it SHOULD be here and it doesn't hurt otherwise.
                                p_el.select(".edit").remove();
                            }
                        });
      });
}