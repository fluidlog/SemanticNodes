var width = 960,
    height = 50,
    margin = {top: 5, right: 40, bottom: 20, left: 120};

var chart = bulletChart()
    .width(width - margin.right - margin.left)
    .height(height - margin.top - margin.bottom);

d3.json("readme.json", function(data) {

  var vis = d3.select("#chart").selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "bullet")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  var title = vis.append("g")
      .attr("text-anchor", "end")
      .attr("transform", "translate(-6," + (height - margin.top - margin.bottom) / 2 + ")");

  title.append("text")
      .attr("class", "title")
      .text(function(d) { return d.title; })
      .call(make_editable, "title");

  title.append("text")
      .attr("class", "subtitle")
      .attr("dy", "1em")
      .text(function(d) { return d.subtitle; })
      .call(make_editable, "subtitle");

  chart.duration(1000);
  window.transition = function() {
    vis.datum(randomize).call(chart);
  };
});

function randomize(d) {
  if (!d.randomizer) d.randomizer = randomizer(d);
  d.ranges = d.ranges.map(d.randomizer);
  d.markers = d.markers.map(d.randomizer);
  d.measures = d.measures.map(d.randomizer);
  return d;
}

function randomizer(d) {
  var k = d3.max(d.ranges) * .2;
  return function(d) {
    return Math.max(0, d + k * (Math.random() - .5));
  };
}

// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/
function bulletChart() {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 0,
      ranges = bulletRanges,
      markers = bulletMarkers,
      measures = bulletMeasures,
      width = 380,
      height = 30,
      tickFormat = null;

  // For each small multiple?
  function bullet(g) {
    g.each(function(d, i) {
      var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
          markerz = markers.call(this, d, i).slice().sort(d3.descending),
          measurez = measures.call(this, d, i).slice().sort(d3.descending),
          g = d3.select(this);

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
          .range(reverse ? [width, 0] : [0, width]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      // Derive width-scales from the x-scales.
      var w0 = bulletWidth(x0),
          w1 = bulletWidth(x1);

      // Update the range rects.
      var range = g.selectAll("rect.range")
          .data(rangez);

      range.enter().append("svg:rect")
          .attr("class", function(d, i) { return "range s" + i; })
          .attr("width", w0)
          .attr("height", height)
          .attr("x", reverse ? x0 : 0)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

      range.transition()
          .duration(duration)
          .attr("x", reverse ? x1 : 0)
          .attr("width", w1)
          .attr("height", height);

      // Update the measure rects.
      var measure = g.selectAll("rect.measure")
          .data(measurez);

      measure.enter().append("svg:rect")
          .attr("class", function(d, i) { return "measure s" + i; })
          .attr("width", w0)
          .attr("height", height / 3)
          .attr("x", reverse ? x0 : 0)
          .attr("y", height / 3)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

      measure.transition()
          .duration(duration)
          .attr("width", w1)
          .attr("height", height / 3)
          .attr("x", reverse ? x1 : 0)
          .attr("y", height / 3);

      // Update the marker lines.
      var marker = g.selectAll("line.marker")
          .data(markerz);

      marker.enter().append("svg:line")
          .attr("class", "marker")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6)
        .transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1);

      marker.transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6);

      // Compute the tick format.
      var format = tickFormat || x1.tickFormat(8);

      // Update the tick groups.
      var tick = g.selectAll("g.tick")
          .data(x1.ticks(8), function(d) {
            return this.textContent || format(d);
          });

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append("svg:g")
          .attr("class", "tick")
          .attr("transform", bulletTranslate(x0))
          .style("opacity", 1e-6);

      tickEnter.append("svg:line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickEnter.append("svg:text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", height * 7 / 6)
          .text(format);

      // Transition the entering ticks to the new scale, x1.
      tickEnter.transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, x1.
      var tickUpdate = tick.transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

      tickUpdate.select("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickUpdate.select("text")
          .attr("y", height * 7 / 6);

      // Transition the exiting ticks to the new scale, x1.
      tick.exit().transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1e-6)
          .remove();
    });
    d3.timer.flush();
  }

  // left, right, top, bottom
  bullet.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x;
    reverse = orient == "right" || orient == "bottom";
    return bullet;
  };

  // ranges (bad, satisfactory, good)
  bullet.ranges = function(x) {
    if (!arguments.length) return ranges;
    ranges = x;
    return bullet;
  };

  // markers (previous, goal)
  bullet.markers = function(x) {
    if (!arguments.length) return markers;
    markers = x;
    return bullet;
  };

  // measures (actual, forecast)
  bullet.measures = function(x) {
    if (!arguments.length) return measures;
    measures = x;
    return bullet;
  };

  bullet.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bullet;
  };

  bullet.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return bullet;
  };

  bullet.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bullet;
  };

  bullet.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return bullet;
  };

  return bullet;
};

function bulletRanges(d) {
  return d.ranges;
}

function bulletMarkers(d) {
  return d.markers;
}

function bulletMeasures(d) {
  return d.measures;
}

function bulletTranslate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}

function bulletWidth(x) {
  var x0 = x(0);
  return function(d) {
    return Math.abs(x(d) - x0);
  };
}

function test()
{
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', 200);
  svg.setAttribute('height', 200);

  // Should appear behind green rectangle
  var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', 10);
    rect.setAttribute('y', 20);
    rect.setAttribute('width', 50);
    rect.setAttribute('height', 20);
    rect.style.fill = 'red';

    svg.appendChild(rect);

    var fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  fo.setAttribute('width', '120');
  fo.setAttribute('height', '20');
  fo.setAttribute('x', '10');
  fo.setAttribute('y', '10');

  var body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');

    var div = document.createElement('div');
    div.style.background = 'green';
    div.style.width = '100%';
    div.style.height = '100%';
    div.appendChild(document.createTextNode('Hello, World!'))

    body.appendChild(div);
    fo.appendChild(body);
    svg.appendChild(fo);
    document.body.appendChild(svg);
}

function make_editable(d, field)
{
    console.log("make_editable", arguments);

    this
      .on("mouseover", function() {
        d3.select(this).style("fill", "red");
      })
      .on("mouseout", function() {
        d3.select(this).style("fill", null);
      })
      .on("click", function(d) {
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

        var frm = p_el.append("foreignObject");

        var inp = frm
            .attr("x", xy.x)
            .attr("y", xy.y)
            .attr("width", 300)
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
                            el
                                .text(function(d) { return d[field]; });

                            // Note to self: frm.remove() will remove the entire <g> group! Remember the D3 selection logic!
                            p_el.select("foreignObject").remove();
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
                                p_el.select("foreignObject").remove();
                            }
                        });
      });
}