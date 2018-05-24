//=======================================
//
// Fonctions de l'interface loglink1.2.js
// pour le mode debug
//
//=======================================

function affiche_debug(fonction,sparql)
{
	var text = 'Function : '+fonction+'\nLast SPARQL request : \n'+sparql;
	$('#debug').html(text 
			.replace(/</g, "&lt;")
			.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ '<br>' +'$2')
			.replace(/\t/g, "&nbsp;")
	);
}

function debug_get_dataset(type_debug)
{
	var dataset;
	
	switch (type_debug)
	{
		case "1":
		{
			dataset = {
					nodes:[
					       {iri_id:0, label: "Node", type:"project" },
					      ],
					edges: [],
					};
			break;
		}
		case "4":
		{
			dataset = {
			nodes:[
			       {iri_id:0, label: "Node", type:"project" },
		           {iri_id:1, label: "Node", type:"actor" },
		           {iri_id:2, label: "Node", type:"idea" },
		           {iri_id:3, label: "Node", type:"ressource" },
			      ],
			edges:[
			       {source:0, target:1},
			       {source:0, target:2},
			       {source:0, target:3},
			       {source:1, target:2},
			       {source:1, target:3},
			      ],
			};
			break;
		}
	}
	
	return dataset;
}
