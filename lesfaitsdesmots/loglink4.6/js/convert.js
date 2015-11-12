FluidGraph.prototype.d3DataToJsonD3 = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("d3DataToJsonD3 start");

  var saveEdges = [];
  thisGraph.d3data.edges.forEach(function(edge, i){
    saveEdges.push({source: edge.source.index, target: edge.target.index, type: edge.type});
  });

  var jsonD3Object = {"name" : thisGraph.graphName, "nodes": thisGraph.d3data.nodes, "edges": saveEdges};
  var jsonD3 = window.JSON.stringify(jsonD3Object);

  if (thisGraph.config.debug) console.log("d3DataToJsonD3 end");

  return jsonD3;
}

FluidGraph.prototype.d3DataToJsonLd = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("d3DataToJsonLd start");

  var saveNodes = [];
  var saveEdges = [];
  thisGraph.d3data.nodes.forEach(function(node, i){
    var nodeObject = {"@id": node.identifier,
                      "@type": "av:"+node.type,
                      "index": node.index.toString(),
                      "label": node.label,
                      "x": node.x.toString(),
                      "y": node.y.toString()}
    saveNodes.push(nodeObject);
  });
  thisGraph.d3data.edges.forEach(function(edge, i){
    var edgeObject = {  source: saveNodes[edge.source.index]["@id"],
                        target: saveNodes[edge.target.index]["@id"]};
    saveEdges.push(edgeObject);
  });

  var urlNameGraph = encodeURIComponent(thisGraph.graphName)
  var jsonD3Object = { // "@id" : thisGraph.config.uriSemFormsBase+urlNameGraph,
                "nodes": saveNodes,
                "edges": saveEdges};

  // var jsonLd = window.JSON.stringify(jsonD3Object);
  var jsonLd = jsonD3Object;

  if (thisGraph.config.debug) console.log("d3DataToJsonLd end");

  return jsonLd;
}

FluidGraph.prototype.jsonD3ToD3Data = function(jsonObj) {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("jsonGraphToData start");

  var d3data = {};
  var newNodes = [];
  var newEdges = [];
  thisGraph.GraphName = jsonObj.name;

  newNodes = jsonObj.nodes;
  newNodes.forEach(function(node,i){
    newNodes[i].index = typeof node.index != "undefined" ? node.index : node.id ;
    if (!node.type.includes("av:"))
    newNodes[i].type = "av:"+node.type;
  });

  newEdges = jsonObj.edges;
  newEdges.forEach(function(edge, i){
    newEdges[i] = {source: newNodes.filter(function(node){
                    return node.index == edge.source || node.id == edge.source;
                    })[0],
                target: newNodes.filter(function(node){
                    return node.index == edge.target || node.id == edge.target;
                  })[0],
                type: edge.type,
              };
  });

  if (thisGraph.config.debug) console.log("jsonGraphToData end");

  return {"nodes" : newNodes, "edges" : newEdges};
}

FluidGraph.prototype.jsonLdToD3Data = function(jsonObj) {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("jsonLdToD3Data start");

  var d3data = {};
  thisGraph.GraphName = jsonObj.name;
  d3data.nodes = jsonObj.nodes;

  var newEdges = jsonObj.edges;

  newEdges.forEach(function(edge, i){
    newEdges[i] = {
                source: d3data.nodes.filter(function(node){
                  return node["@id"] == edge.source;
                  })[0],
                target: d3data.nodes.filter(function(node){
                  return node["@id"] == edge.target;
                  })[0],
                type: edge["@type"],
              };
  });

  d3data.edges = newEdges;

  if (thisGraph.config.debug) console.log("jsonLdToD3Data end");

  return d3data;
}
