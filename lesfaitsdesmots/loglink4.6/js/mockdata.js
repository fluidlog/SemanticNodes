var data = [];

data[0] = {
      nodes: [
              {id:0, name: "A", size:20, type:"P", x:100, y:100, identifier:"http://fluidlog.com/0" },
              {id:1, name: "B", size:20, type:"I", x:200, y:200, identifier:"http://fluidlog.com/1" },
      ],
      edges: [
              { source: 0, target: 1 },
      ]
}

data[1] = {
      nodes: [
              {id:0, name: "A", size:20, type:"P", x:100, y:100, identifier:"http://fluidlog.com/0" },
              {id:1, name: "B", size:20, type:"I", x:200, y:200, identifier:"http://fluidlog.com/1" },
              {id:1, name: "C", size:20, type:"P", x:300, y:300, identifier:"http://fluidlog.com/2" },
      ],
      edges: [
              { source: 0, target: 1 },
      ]
}

data[2] = {
      nodes: [
              {id:0, name: "A", size:20, type:"P", x:100, y:100, identifier:"http://fluidlog.com/0" },
              {id:1, name: "B", size:20, type:"I", x:200, y:200, identifier:"http://fluidlog.com/1" },
              {id:2, name: "C", size:20, type:"P", x:300, y:300, identifier:"http://fluidlog.com/2" },
              {id:3, name: "D", size:20, type:"I", x:400, y:400, identifier:"http://fluidlog.com/3" },
              {id:4, name: "E", size:20, type:"P", x:300, y:400, identifier:"http://fluidlog.com/4" },
              {id:5, name: "F", size:20, type:"P", x:500, y:300, identifier:"http://fluidlog.com/5" },
              {id:6, name: "G", size:20, type:"P", x:300, y:500, identifier:"http://fluidlog.com/6" },
              {id:7, name: "H", size:20, type:"P", x:400, y:500, identifier:"http://fluidlog.com/7" },
      ],
      edges: [
              { source: 0, target: 1 },
              { source: 0, target: 2 },
              { source: 0, target: 3 },
              { source: 3, target: 4 },
              { source: 3, target: 5 },
              { source: 3, target: 6 },
              { source: 3, target: 7 },
      ]
}

$.mockjax({
  url : '/data/d3data',
  dataType : 'json',
  responseTime : 2000,
  responseText : data[2],
});
