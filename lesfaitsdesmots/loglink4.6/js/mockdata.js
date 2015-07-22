$.mockjax({
  url : '/data/d3data',
  dataType : 'json',
  responseTime : 2000,
  responseText : {
        nodes: [
                {id:0, name: "A", size:20, type:"P", x:100, y:100, identifier:"http://fluidlog.com/0" },
                {id:1, name: "B", size:20, type:"I", x:200, y:200, identifier:"http://fluidlog.com/1" },
        ],
        edges: [
                { source: 0, target: 1 },
        ]
  }
});
