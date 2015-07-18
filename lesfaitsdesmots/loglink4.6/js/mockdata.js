$.mockjax({
  url : '/data/d3data',
  dataType : 'json',
  responseTime : 2000,
  responseText : {
        nodes: [
                {name: "A", size:20, type:"P", x:100, y:100, nodeid:"http://fluidlog.com/1" },
                {name: "B", size:20, type:"I", x:200, y:200, nodeid:"http://fluidlog.com/2" },
        ],
        edges: [
                { source: 0, target: 1 },
        ]
  }
});
