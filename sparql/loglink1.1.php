<?php
// ================================================================
//
// Fonctions liées à l'application loglink1.1
//
// ================================================================

function InitKernelGraph($first_node_iri, $second_node_iri)
{
	// $first_node_iri = "http://www.fluidlog.com/loglink/domain/loglink11/node/1";
	// $second_node_iri = "http://www.fluidlog.com/loglink/domain/loglink11/node/2";
	
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	global $iri_loglink_domain;
	global $prefix_rdf;
	global $prefix_rdfs;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	$domain_selected_iri=$iri_loglink_domain."loglink11";

	$first_node_label = "Node";
	$second_node_label = "Node";
	
	//on insère le nouveau triplet "$iri_loglink loglink:term $term_iri"
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
    	PREFIX rdf: <'.$prefix_rdf.'>
    	PREFIX rdfs: <'.$prefix_rdfs.'>
		INSERT DATA
		{
			graph <'.$MyGraph.'>
			{
				<'.$domain_selected_iri.'> loglink:node <'.$first_node_iri.'> .
				<'.$domain_selected_iri.'> loglink:node <'.$second_node_iri.'> .
				<'.$first_node_iri.'> rdfs:label "'.$first_node_label.'" .
				<'.$second_node_iri.'> rdfs:label "'.$second_node_label.'" .
				<'.$first_node_iri.'> loglink:linkedto <'.$second_node_iri.'>
			}
		}
	';

	$res = $MyEndPointSparql->queryUpdate($sparql);
	//afficheText("InitKernelGraph 1: first_node_iri : ".$first_node_iri." requete : ".$sparql,400);
	
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}

	$parts = explode('/', rtrim($first_node_iri, '/'));
	$first_node_iri_id = array_pop($parts);
	$parts = explode('/', rtrim($second_node_iri, '/'));
	$second_node_iri_id = array_pop($parts);
	
	$nodes = array(
				1 => array(
					"node_iri_id" => $first_node_iri_id,
					"node_label" => $first_node_label,
				),
				2 => array(
					"node_iri_id" => $second_node_iri_id,
					"node_label" => $second_node_label,
				)
			);
	
	$edges = array(
				1 => array(
					"source" => $first_node_iri_id,
					"target" => $second_node_iri_id,
				),
			);
			
	$dataset = array(
				"nodes" => $nodes,
				"edges" => $edges,
				);

//	echo "dataset: ".var_dump($dataset);

	$rich_result[0] = "InitKernelGraph";
	$rich_result[1] = $sparql;
	$rich_result[2] = $dataset;
	return $rich_result;
}

function getDataset()
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	global $iri_loglink_domain;
	global $prefix_rdf;
	global $prefix_rdfs;
	
	$domain_selected_iri=$iri_loglink_domain."loglink11";
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	//on récupère tous les triplets liés à l'IRI de l'utilisateur connecté.
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
    	PREFIX rdf: <'.$prefix_rdf.'>
    	PREFIX rdfs: <'.$prefix_rdfs.'>
		SELECT ?node_iri ?node_label
		WHERE
		{
			graph <'.$MyGraph.'>
			{
			    <'.$domain_selected_iri.'> 	loglink:node ?node_iri .
			    		?node_iri 	rdfs:label ?node_label
			}
		}
		LIMIT 100
	';
		
	//afficheText("getDataset select iri(s) sparql: ".$sparql,450);
	$rows = $MyEndPointSparql->query($sparql, "rows");
	
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
	
// 	echo var_dump($rows);
// 	die (print_r("die",true));
	
	foreach($rows["result"]["rows"] as $row)
	{
		// Récupère l'id de l'uri 
		$parts = explode('/', rtrim($row['node_iri'], '/'));
		$node_iri_id = array_pop($parts);
		
		$nodes[] = array(
				"node_iri_id" => $node_iri_id,
				"node_label" => $row['node_label'],
		);

		//Initialisation de $result2, sinon, il conserve la même valeur...
		$result2 = array();
		//Pour chaque node retourné, on récupère tous ses nodees liés
		$sparql2 ='
			PREFIX loglink: <'.$prefix_loglink.'>
	    	PREFIX rdf: <'.$prefix_rdf.'>
	    	PREFIX rdfs: <'.$prefix_rdfs.'>
			SELECT ?node_linked_iri
			WHERE
			{
				graph <'.$MyGraph.'>
				{
				    <'.$row['node_iri'].'> 	loglink:linkedto ?node_linked_iri
				}
			}
			LIMIT 100
		';
		
		//afficheText("getDataset select linkedto : node_iri_of_row: ".$node_iri_of_row." et sparql2: ".$sparql2,450);
		$rows2 = $MyEndPointSparql->query($sparql2, "rows");
		
		$err2 = $MyEndPointSparql->getErrors();
		if ($err2)
		{
			die (print_r($err2,true));
		}
		
		foreach($rows2["result"]["rows"] as $row2)
		{
			// Récupère l'id de l'uri 
			$parts = explode('/', rtrim($row['node_iri'], '/'));
			$node_iri_id_source = array_pop($parts);
			$parts = explode('/', rtrim($row2['node_linked_iri'], '/'));
			$node_iri_id_target = array_pop($parts);
				
			$edges[] = array(
						"source" => $node_iri_id_source,
						"target" => $node_iri_id_target,
			);
		}		
	}
	
	$dataset = array(
			"nodes" => $nodes,
			"edges" => $edges,
	);
	
//	echo "dataset: ".var_dump($dataset);
	
	$rich_result[0] = "getDataset";
	$rich_result[1] = $sparql;
	$rich_result[2] = $dataset;
	return $rich_result;
}

//Incrémente ou créer l'id s'il n'est pas présent
function incrementNodeId($id)
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	global $iri_loglink_domain;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	$domain_selected_iri=$iri_loglink_domain."loglink11"; // Attention, rendre cette partie variable !

	if (!$id)
	{
		//On récupère l'ID stockée lors de la dernière insertion..
		$sparql ='
			PREFIX loglink: <'.$prefix_loglink.'>
			SELECT ?id  WHERE
			{
	   			graph <'.$MyGraph.'> 
	   			{
	      			<'.$domain_selected_iri.'> loglink:node_id ?id
	   			}
			}
		';
	
		//afficheText("incrementNodeId : ".$sparql,480);
		$rows = $MyEndPointSparql->query($sparql, 'rows');
	
		//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
		$err = $MyEndPointSparql->getErrors();
		if ($err)
		{
			die (print_r($err,true));
		}
			
		$id = $rows['result']['rows'][0]['id'];
	}
	
	$inc_id=$id+1;
	
	//on supprime l'id en cours
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
		DELETE WHERE
		{
			graph <'.$MyGraph.'>
			{
				<'.$domain_selected_iri.'> loglink:node_id ?id
			}
		}
	';
	
	//afficheText("incrementTermId : ".$sparql,500);
	$res = $MyEndPointSparql->query($sparql);
	
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
	
	//on insère l'id+1
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
		INSERT DATA
		{
			graph <'.$MyGraph.'>
			{
				<'.$domain_selected_iri.'> loglink:node_id "'.$inc_id.'"
			}
		}
	';
	$res = $MyEndPointSparql->queryUpdate($sparql);
	
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}

	$rich_result[0] = "incrementNodeId";
	$rich_result[1] = $sparql;
	$rich_result[2] = $inc_id;
	return $rich_result;
}

function getNewNodeIri()
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	global $iri_loglink_node;
	global $iri_loglink_domain;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	$domain_selected_iri=$iri_loglink_domain."loglink11"; // Attention, rendre cette partie variable !
	
	//On récupère l'ID stockée lors de la dernière insertion..
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
		SELECT ?id  WHERE
		{
   			graph <'.$MyGraph.'> 
   			{
      			<'.$domain_selected_iri.'> loglink:node_id ?id
   			}
		}
	';

	//afficheText("getNewNodeIri : ".$sparql,480);
	$rows = $MyEndPointSparql->query($sparql, 'rows');

	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
		
	$id = $rows['result']['rows'][0]['id'];
	if ($id == "" || $id == null)
	{
		var_dump($rows);
		die (print_r("id est vide !",true));
	}
	
	$new_iri = $iri_loglink_node.intval($id);
	//afficheText("getNewNodeIri : ".$new_iri,520);
	
	$rich_result[0] = "getNewNodeIri (new id=".$inc_id.")";
	$rich_result[1] = $sparql;
	$rich_result[2] = $new_iri;
	return $rich_result;
}

function addNode($source_node_id,$target_node_id)
{
	global $MyGraph;
	global $prefix_loglink;
	global $iri_loglink_domain;
	global $iri_loglink_node;
	global $prefix_rdf;
	global $prefix_rdfs;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	$domain_selected_iri=$iri_loglink_domain."loglink11";
	$source_node_iri=$iri_loglink_node.$source_node_id;
	$target_node_iri=$iri_loglink_node.$target_node_id;
	
	$target_node_label = "Node";
	
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
    	PREFIX rdf: <'.$prefix_rdf.'>
    	PREFIX rdfs: <'.$prefix_rdfs.'>
		INSERT DATA
		{
			graph <'.$MyGraph.'>
			{
				<'.$domain_selected_iri.'> loglink:node <'.$target_node_iri.'> .
				<'.$target_node_iri.'> rdfs:label "'.$target_node_label.'" .
				<'.$source_node_iri.'> loglink:linkedto <'.$target_node_iri.'>
			}
		}
	';

	$res = $MyEndPointSparql->queryUpdate($sparql);
	//afficheText("addNode: source_node_iri : ".$source_node_iri." requete : ".$sparql,400);
	
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}

	$rich_result[0] = "addNode";
	$rich_result[1] = $sparql;
	$rich_result[2] = array(
				"source" => $source_node_id,
				"target" => $target_node_id,
				);
	return $rich_result;
}

function addLink($source_node_id,$target_node_id)
{
	global $MyGraph;
	global $prefix_loglink;
	global $iri_loglink_node;

	//On se connecte
	$MyEndPointSparql = connectMaBase();

	$source_node_iri=$iri_loglink_node.$source_node_id;
	$target_node_iri=$iri_loglink_node.$target_node_id;

	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
    	PREFIX rdf: <'.$prefix_rdf.'>
    	PREFIX rdfs: <'.$prefix_rdfs.'>
		INSERT DATA
		{
			graph <'.$MyGraph.'>
			{
				<'.$source_node_iri.'> loglink:linkedto <'.$target_node_iri.'>
			}
		}
	';

	$res = $MyEndPointSparql->queryUpdate($sparql);
	//afficheText("addLink: source_node_id : ".$source_node_id." requete : ".$sparql,400);

	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}

	$rich_result[0] = "addLink";
	$rich_result[1] = $sparql;
	$rich_result[2] = array(
				"source" => $source_node_id,
				"target" => $target_node_id,
				);
	return $rich_result;
}

?>