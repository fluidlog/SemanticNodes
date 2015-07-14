$.mockjax({
  url : '/data/d3data',
  dataType : 'json',
  responseTime : 2000,
  responseText : {
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
  }
});
