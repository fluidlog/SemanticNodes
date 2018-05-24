var data = [];

data[0] = {
      nodes: [
        {index:0, label: "new", type: "av:without", x:200, y:200, identifier:"http://fluidlog.com/0" },
      ],
      edges: []
}

data[1] = {
      nodes: [
              {index:0, label: "A", type:"av:project", x:100, y:100, identifier:"http://fluidlog.com/0" },
              {index:1, label: "B", type:"av:idea", x:200, y:200, identifier:"http://fluidlog.com/1" },
              {index:2, label: "C", type:"av:project", x:300, y:300, identifier:"http://fluidlog.com/2" },
      ],
      edges: [
              { source: 0, target: 1 },
      ]
}

data[2] = {
      nodes: [
              {index:0, label: "A petit texte", type:"av:project", x:100, y:100, identifier:"http://fluidlog.com/0" },
              {index:1, label: "B texte sur deux longues lignes", type:"av:idea", x:200, y:200, identifier:"http://fluidlog.com/1" },
              {index:2, label: "C", type:"av:project", x:400, y:200, identifier:"http://fluidlog.com/2" },
              {index:3, label: "D", type:"av:idea", x:400, y:400, identifier:"http://fluidlog.com/3" },
              {index:4, label: "E", type:"av:project", x:300, y:400, identifier:"http://fluidlog.com/4" },
              {index:5, label: "F", type:"av:project", x:500, y:300, identifier:"http://fluidlog.com/5" },
              {index:6, label: "G", type:"av:project", x:300, y:500, identifier:"http://fluidlog.com/6" },
              {index:7, label: "H", type:"av:project", x:400, y:500, identifier:"http://fluidlog.com/7" },
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

data[3] = {
      nodes: [
              {index:0, label: "Bienvenue dans la Carto PAIR !", type:"av:project", x:300, y:50, identifier:"http://fluidlog.com/0" },
              {index:1, label: "Vous pouvez ajouter...", type:"av:idea", x:150, y:150, identifier:"http://fluidlog.com/1" },
              {index:2, label: "Des Projets", type:"av:project", x:300, y:200, identifier:"http://fluidlog.com/2" },
              {index:3, label: "Des Acteurs", type:"av:actor", x:400, y:200, identifier:"http://fluidlog.com/3" },
              {index:4, label: "Des Idées", type:"av:idea", x:500, y:200, identifier:"http://fluidlog.com/4" },
              {index:5, label: "Des Ressources", type:"av:ressource", x:600, y:200, identifier:"http://fluidlog.com/5" },
              {index:6, label: "Faire des liens entre les noeuds", type:"av:idea", x:300, y:300, identifier:"http://fluidlog.com/6" },
              {index:7, label: "Pour cartographier un réseau PAIR à PAIR !", type:"av:project", x:600, y:300, identifier:"http://fluidlog.com/7" },
              {index:8, label: "Pour plus d'infos, lisez l'aide (menu en haut à droite) !", type:"av:ressource", x:500, y:400, identifier:"http://fluidlog.com/7" },
      ],
      edges: [
              { source: 0, target: 1 },
              { source: 1, target: 2 },
              { source: 2, target: 3 },
              { source: 3, target: 4 },
              { source: 4, target: 5 },
              { source: 4, target: 6 },
              { source: 4, target: 7 },
              { source: 4, target: 8 },
      ]
}

$.mockjax({
  url : '/data/d3data',
  dataType : 'json',
  responseTime : 2000,
  responseText : data[3],
});
