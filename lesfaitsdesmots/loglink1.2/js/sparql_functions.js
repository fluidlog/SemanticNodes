//=======================================
//
// Fonctions AJAX SPARQL de l'interface loglink1.1.js
//
//=======================================

function sparql_exist_domain(domain_name)
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
							message ("Erreur Ajax : Message="+t_data+" (Fonction sparql_exist_domain()) !","alert");
					    },
		    data: { fn : "existDomain", domain_name : domain_name },
		    async: false
		}
	);
	return test;
}


function sparql_add_domain_to_triplestore(domain_name)
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
							message ("Erreur Ajax : Message="+t_data+" (Fonction sparql_add_domain_to_triplestore()) !","alert");
					    },
		    data: { fn : "addDomainToTriplestore", domain_name : domain_name },
		    async: false
		}
	);
	return return_domain;
}

function sparql_increment_node_id(node_iri_id)
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
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_increment_node_id()) !","alert");
		    				return false;
					    },
		    data: { fn : "incrementNodeId", node_iri_id : node_iri_id },
		    async: false
		}
	);
	return node_iri_id;
}

function sparql_get_new_node_iri()
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
			    				message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_get_new_node_iri()) !","alert");
			    				return false;
						    },
			    data: { fn : "getNewNodeIri" },
			    async: false
			}
		);

	return node_iri;
}

function sparql_init_kernel_graph(first_node_iri, second_node_iri)
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
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_init_kernel_graph()) !","alert");
		    				return false;
					    },
		    data: { fn : "initKernelGraph", first_node_iri : first_node_iri, second_node_iri : second_node_iri },
		    async: false
		}
	);
	return { nodes : nodes, edges : edges };
}

//Récupère les termes à l'utilisateur connecté
function sparql_get_dataset()
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
			 					//Récupération des noeuds dans le tableau nodes
			 				
			 					//Attention, pour éviter que la fonction "d3.force" ne plante, 
			 					//il faut autant de noeuds que d'indice existants (iri_id)
			 					//Donc on va ajouter des noeuds "fictifs" pour combler les trous ;-)
				 		 		if (t_data[2].nodes)
				 		 		{
					 		 		$.each(t_data[2].nodes, function(i, entry)
											{
					 		 					nodes.push({
					 								iri_id : parseInt(entry.node_iri_id, 10), 
					 								label : entry.node_label, 
					 								type : entry.node_type, 
												});
											}
									);
					 		 		//Ne pas oublier d'ordonner les noeuds, car l'indice correspond à celui des liens !
			 						nodes = nodes.sort(function (a,b) {return a.iri_id - b.iri_id});

			 						//On récupère le nombre de noeuds et on complète par rapport à l'iri_id max
			 						var t_length = nodes.length;
			 						//Vu que le tableau est ordonné, l'iri_id_max est le dernier iri_id du tableau
			 						var node_id_max = nodes[t_length-1].iri_id;
			 						for (inc=0; inc<node_id_max; inc++)
				 		 			{
				 		 				if (nodes[inc].iri_id != inc)
				 		 					{
				 		 						//Ajout d'un noeud fictif à la position "inc", 0 supression.
					 		 					nodes.splice(inc, 0, {
					 								iri_id : -1, 
					 								label : "deleted", 
					 								type : "deleted", 
												});
				 		 					}
				 		 			}
				 		 		}
				 		 					 						
			 					//récupération des liens dans le tableau edges
		 						//Important de convertir les index en type "integer" pour la fonciton D3 force
				 		 		if (t_data[2].edges)
				 		 		{
			 						$.each(t_data[2].edges, function(i, entry)
											{	
					 		 					edges.push({
					 								source : parseInt(entry.source, 10), 
					 								target : parseInt(entry.target, 10), 
												});
											}
					 		 		);
				 		 		}

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
			    				message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_get_dataset()) !","alert");
			    				return false;
						    },
			    data: { fn : "getDataset" },
			    async: false
			}
		);

	return { nodes : nodes, edges : edges };
}

// Cette fonction ajoute un nouveau noeud et lien entre lui et le noeud à partir duquel il a été créé.
function sparql_add_node(source_node_id, target_node_id)
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
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_add_node()) !","alert");
		    				return false;
					    },
		    data: { fn : "addNode", source_node_id : source_node_id, target_node_id : target_node_id },
		    async: false
		}
	);
}

//Cette fonction ajoute un lien lorsque l'utilisateur veut faire un lien entre deux noeuds existants 
function sparql_add_link(source_node_id, target_node_id)
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
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_add_link()) !","alert");
		    				return false;
					    },
		    data: { fn : "addLink", source_node_id : source_node_id, target_node_id : target_node_id },
		    async: false
		}
	);
}

function sparql_delete_link (source_iri_id, target_iri_id)
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
								result = t_data[2];
							}
							return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_delete_link()) !","alert");
		    				return false;
					    },
		    data: { fn : "deleteLink", source_iri_id : source_iri_id, target_iri_id : target_iri_id},
		    async: false
		}
	);
}

function sparql_delete_node (node_iri_id)
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
								result = t_data[2];
							}
							return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_delete_node()) !","alert");
		    				return false;
					    },
		    data: { fn : "deleteNode", node_iri_id : node_iri_id},
		    async: false
		}
	);
}

function sparql_change_type (node_id, old_type, new_type)
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
								result = t_data[2];
							}
							return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction change_type()) !","alert");
		    				return false;
					    },
		    data: { fn : "changeType", node_id : node_id, old_type : old_type, new_type : new_type},
		    async: false
		}
	);
}

function sparql_change_label (node_id, label)
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
								result = t_data[2];
							}
							return false;
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction change_label()) !","alert");
		    				return false;
					    },
		    data: { fn : "changeLabel", node_id : node_id, label : label},
		    async: false
		}
	);
}

function sparql_delete_all_into_triplestore()
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
			    				message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_delete_all_into_triplestore()) !","alert");
			    				return false;
						    },
			    data: { fn : "deleteAll" },
			    async: false
			}
		);
}

function sparql_export_from_triplestore()
{
	var exportedGraph;
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
				    				exportedGraph = t_data[2];
				    				message ("sparql_export_from_triplestore OK","succed");
			 					}
								else
								{
									message ("Erreur t_data Null","alert");
								}
						    },
			    error: function(t_data) 
						    { 
			    				message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_export_from_triplestore()) !","alert");
			    				return false;
						    },
			    data: { fn : "exportFromTriplestore" },
			    async: false
			}
		);
	return exportedGraph;
}

function sparql_import_into_triplestore(imported_graph)
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
				    				message ("sparql_import_into_triplestore OK","succed");
			 					}
								else
								{
									message ("Erreur t_data Null","alert");
								}
						    },
			    error: function(t_data) 
						    { 
			    				message ("Erreur Ajax : Message="+t_data.responseText+" (Fonction sparql_import_into_triplestore()) !","alert");
			    				return false;
						    },
			    data: { fn : "importIntoTriplestore", imported_graph : imported_graph },
			    async: false
			}
		);
}

