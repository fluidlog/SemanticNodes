//=======================================
//
// Fonctions de l'interface loglink1.1.js
//
//=======================================

// Affiche les messages d'alert, ou de warning ou de succès au milieu de l'interface
// Voir les coordonnée dans le *.css
// Amélioration : pouvoir afficher plusieurs messages les uns sur les autres

function message(text,type)
{
	var time;
	if (type == "succed")
	{
		$('#message').css("color","white");
		$('#message').css("background","green");
		time=3000;
	}
	else if (type == "warning")
	{
		$('#message').css("color","black");
		$('#message').css("background","orange");
		time=3000;
	}
	else if (type == "alert")
	{
		$('#message').css("color","white");
		$('#message').css("background","red");
		time=4000;
	}
	$('#message').text(text).show();
}

function affiche_debug(fonction,sparql)
{
	var text = 'Function : '+fonction+'\nLast SPARQL request : \n'+sparql;
	$('#debug').html(text 
			.replace(/</g, "&lt;")
			.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ '<br>' +'$2')
			.replace(/\t/g, "&nbsp;")
	);
}

function exist_domain(domain_name)
{
	var test;
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../../sparql/main.php',
		    dataType: 'json',
		    success: function(t_data) 
					    { 
							// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> retour,
		    				affiche_debug(t_data[0], t_data[1]);
							if (t_data[2] != null)
							{
								//True or false
								test = t_data[2];
							}
							return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data+" (Fonction exist_domain()) !","alert");
					    },
		    data: { fn : "existDomain", domain_name : domain_name },
		    async: false
		}
	);
	return test;
}


function add_domain_to_triplestore(domain_name)
{
	var return_domain;
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../../sparql/main.php',
		    dataType: 'json',
		    success: function(t_data) 
					    { 
							// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> retour,
		    				affiche_debug(t_data[0], t_data[1]);
							if (t_data[2] != null)
							{
								return_domain = t_data[2];
							}
							return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data+" (Fonction add_domain_to_triplestore()) !","alert");
					    },
		    data: { fn : "addDomainToTriplestore", domain_name : domain_name },
		    async: false
		}
	);
	return return_domain;
}

function increment_node_id(node_iri_id)
{
	var node_iri_id;
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../../sparql/main.php',
		    dataType: 'json',
		    success: function(t_data) 
					    { 
							// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> retour,
							affiche_debug(t_data[0], t_data[1]);
							if (t_data[2] != null)
							{
								node_iri_id = t_data[2];
							}
							return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction increment_node_id()) !","alert");
		    				return false;
					    },
		    data: { fn : "incrementNodeId", node_iri_id : node_iri_id },
		    async: false
		}
	);
	return node_iri_id;
}

function get_new_node_iri()
{
	var node_iri;
	
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
			{
			    type: 'GET',
			    url: '../../sparql/main.php',
			    dataType: 'json',
			    success: function(t_data) 
						    { 
					 			if (t_data[2] != null)
			 					{
									// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> iri,
				    				affiche_debug(t_data[0], t_data[1]);
				    				node_iri=t_data[2];
			 					}
								else
								{
									message ("Erreur t_data Null","alert");
								}
						    },
			    error: function(t_data) 
						    { 
			    				message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction get_new_node_iri()) !","alert");
			    				return false;
						    },
			    data: { fn : "getNewNodeIri" },
			    async: false
			}
		);

	return node_iri;
}

function init_kernel_graph(first_node_iri, second_node_iri)
{
	var nodes = [];
	var edges = [];
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../../sparql/main.php',
		    dataType: 'json',
		    success: function(t_data) 
					    { 
							// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> retour,
							affiche_debug(t_data[0], t_data[1]);
				 			if (t_data[2] != null)
		 					{
				 				message ("Kernel initialized","succed");
							}
			 		 		return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction init_kernel_graph()) !","alert");
		    				return false;
					    },
		    data: { fn : "initKernelGraph", first_node_iri : first_node_iri, second_node_iri : second_node_iri },
		    async: false
		}
	);
	return { nodes : nodes, edges : edges };
}

// Cette fonction ajoute un nouveau noeud et lien entre lui et le noeud à partir duquel il a été créé.
function add_node(source_node_id, target_node_id)
{
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../../sparql/main.php',
		    dataType: 'json',
		    success: function(t_data) 
					    { 
							// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> retour,
							affiche_debug(t_data[0], t_data[1]);
				 			if (t_data[2] != null)
		 					{
				 				message ("Node ["+t_data[2].target+"] added, link ["+t_data[2].source+" > "+t_data[2].target+"] added","succed");
							}
			 		 		return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction add_node()) !","alert");
		    				return false;
					    },
		    data: { fn : "addNode", source_node_id : source_node_id, target_node_id : target_node_id },
		    async: false
		}
	);
}

//Cette fonction ajoute un lien lorsque l'utilisateur veut faire un lien entre deux noeuds existants 
function add_link(source_node_id, target_node_id)
{
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../../sparql/main.php',
		    dataType: 'json',
		    success: function(t_data) 
					    { 
							// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> retour,
							affiche_debug(t_data[0], t_data[1]);
				 			if (t_data[2] != null)
		 					{
				 				message ("Link ["+t_data[2].source+" > "+t_data[2].target+"] added","succed");
							}
			 		 		return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction add_link()) !","alert");
		    				return false;
					    },
		    data: { fn : "addLink", source_node_id : source_node_id, target_node_id : target_node_id },
		    async: false
		}
	);
}


//Récupère les termes à l'utilisateur connecté
function get_dataset()
{
	var nodes = [];
	var edges = [];
	
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
			{
			    type: 'GET',
			    url: '../../sparql/main.php',
			    dataType: 'json',
			    success: function(t_data) 
				    { 
						// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> user,
	    				affiche_debug(t_data[0], t_data[1]);
			 			if (t_data[2] != null)
	 					{
//											On récupère un tableau de tableau comme ceci :
		//	 		 					 t_data[2] = array(
		//		 		 					"nodes" => array(
		//		 				 					1 => array(
		//		 				 							"node_iri_id" => $first_node_iri_id,
		//		 				 							"node_label" => $first_node_label,
		//		 				 						),
		//		 				 						2 => array(
		//		 				 							"node_iri_id" => $second_node_iri_id,
		//		 				 							"node_label" => $second_node_label,
		//		 				 						)
		//		 				 					),
		//		 		 					"edges" => array(
		//					 						1 => array(
		//						 							"source" => $first_node_iri_id,
		//						 							"target" => $second_node_iri_id,
		//						 						),
		//						 					),
		//		 		 					);
		
				 					//Récupération des noeuds dans le tableau nodes
					 		 		$.each(t_data[2].nodes, function(i, entry)
											{	
					 		 					nodes.push({
					 								id : parseInt(entry.node_iri_id, 10), 
					 								label : entry.node_label, 
												});
											}
									);
				 					
				 					//récupération des liens dans le tableau edges
					 		 		$.each(t_data[2].edges, function(i, entry)
											{	
					 		 					edges.push({
					 								source : parseInt(entry.source, 10), 
					 								target : parseInt(entry.target, 10), 
												});
											}
					 		 		);
					 				message ("Dataset refreshed","succed");
	 					}
						else
						{
		    				affiche_debug(t_data[0], t_data[1]);
							message ("No term in triplestore for the user connected","warning");
						}
				    },
			    error: function(t_data) 
						    {
			    				message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction getDataset()) !","alert");
			    				return false;
						    },
			    data: { fn : "getDataset" },
			    async: false
			}
		);

	return { nodes : nodes, edges : edges };
}

function delete_all_into_triplestore()
{
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
			{
			    type: 'GET',
			    url: '../../sparql/main.php',
			    dataType: 'json',
			    success: function(t_data) 
						    { 
					 			if (t_data[2] != null)
			 					{
									// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> iri,
				    				affiche_debug(t_data[0], t_data[1]);
					 				message ("delete_all_into_triplestore OK","succed");
			 					}
								else
								{
									message ("Erreur t_data Null","alert");
								}
						    },
			    error: function(t_data) 
						    { 
			    				message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction delete_all_into_triplestore()) !","alert");
			    				return false;
						    },
			    data: { fn : "deleteAll" },
			    async: false
			}
		);
}

