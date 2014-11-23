<?php
// =================================================
//
// Fonctions génériques et connexion à la base
//
// function connectMaBase()
// function afficheText($text,$top)
//
// =================================================

require_once('../lib/SPARQL/Endpoint.php');
//Lorsqu'on utilise la librairie Bordercloud
//Config debug
$modeDebug = false;

//Put here the URL of your endpoint
CONST  ENDPOINTSPARQL = "http://io.bordercloud.com/sparql-auth/";

if (
	$_SERVER['HTTP_HOST'] === 'fluidlog.com' ||
	$_SERVER['HTTP_HOST'] === 'www.fluidlog.com' ||
	$_SERVER['HTTP_HOST'] === 'assemblee-virtuelle.org' ||
	$_SERVER['HTTP_HOST'] === 'www.assemblee-virtuelle.org'
) {
	//Prod graph
	$MyGraph = "http://prod.fluidlog.com";	
} else {
	//Test graph
	$MyGraph = "http://test.fluidlog.com";
}

//Test code security
$MyLogin = "fluidlog";
$MyPassword = "password";

//IRI sur laquelle tout les autres IRI se base pour le projet loglink
$iri_loglink = "http://www.fluidlog.com/loglink";
$iri_loglink_domain = "http://www.fluidlog.com/loglink/domain/";
$iri_loglink_user = "http://www.fluidlog.com/loglink/user/";
$iri_loglink_term = "http://www.fluidlog.com/loglink/domain/loglink01/term/";
$iri_loglink_node = "http://www.fluidlog.com/loglink/domain/loglink11/node/";

//Préfix global sur lequel se repose l'ontologie loglink
$prefix_loglink = "http://www.fluidlog.com/2013/05/loglink/core#";
$prefix_rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
$prefix_rdfs = "http://www.w3.org/2000/01/rdf-schema#";

// Fonction de connexion avec la librairie Bordercloud
function connectMaBase()
{
	global $ENDPOINTSPARQL,$MyLogin,$MyPassword,$modeDebug;
	$Endpoint = new Endpoint(ENDPOINTSPARQL,$modeDebug);
	$Endpoint->setEndpointUpdate(ENDPOINTSPARQL);
	$Endpoint->setEndpointQuery(ENDPOINTSPARQL);
	$Endpoint->setLogin("fluidlog");
	$Endpoint->setPassword("password");
	return $Endpoint;
}

// Fonction de connexion directe avec la librairie ARC2
function ARC_connectMaBase()
{
	$config = array(
			'remote_store_endpoint' => "http://io.bordercloud.com/sparql"
	);
	
	return ARC2::getRemoteStore($config);
}

function afficheText($text,$top)
{
	//On affiche la requête SPARQL. Il faudra prévoir de pouvoir afficher une pile...
	echo '<div id="requete" style="text-align:left;font-family:arial;font-size:12px;position:fixed;left: 10; top: '.$top.';" width=100>';
	print_r($text);
	echo '</div>';
}

//Récupère tout le contenu du triplestore
function getTriplesFromTriplestore($domain)
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;

	//On se connecte
	$MyEndPointSparql = connectMaBase();

	//on supprime tous les triplets contenant des predicats de l'ontologie loglink
	$sparql ='
 		SELECT ?s ?p ?o
 		{
 			graph <'.$MyGraph.'>
			{
			    ?s ?p ?o .
			}
		}
 	';

	//afficheText("Select all triples : ".$sparql,520);
	$rows = $MyEndPointSparql->query($sparql, 'rows');

	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
	
//	var_dump($rows["result"]["rows"][0]);
	
	$result = array();
	foreach($rows["result"]["rows"] as $row)
	{
		$result[] = array(
				"sujet" => $row["s"], 
				"predicat" => $row["p"], 
				"objet" => $row["o"]
		);
	}
	
	$rich_result[0] = "getTriplesFromTriplestore";
	$rich_result[1] = $sparql;
	$rich_result[2] = $result;
	return $rich_result;
}

//Supprime un triplet
function deleteTripleIntoTriplestore($sujet, $predicat, $objet)
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;

	//On se connecte
	$MyEndPointSparql = connectMaBase();

	//on supprime tous les triplets contenant des predicats de l'ontologie loglink
	$sparql ='
 		DELETE DATA
 		{
 			graph <'.$MyGraph.'>
			{
			    <'.$sujet.'> <'.$predicat.'> <'.$objet.'> .
			}
		}
 	';

	//afficheText("Select all triples : ".$sparql,520);
	$rows = $MyEndPointSparql->query($sparql, 'rows');

	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
		
	$rich_result[0] = "deleteTripleIntoTriplestore";
	$rich_result[1] = $sparql;
	$rich_result[2] = "";
	return $rich_result;
}

//Supprime tout le contenu du triplestore
function deleteAll()
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

 	//on supprime tous les triplets contenant des predicats de l'ontologie loglink
 	$sparql ='
 		DELETE 
 		WHERE
 		{
 			graph <'.$MyGraph.'>
			{
			    ?s ?p ?o .
			}
		}
 	';

	$res = $MyEndPointSparql->query($sparql);
	//afficheText("deleteAll : ".$sparql,520);
	
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
	
	$rich_result[0] = "deleteAll";
	$rich_result[1] = $sparql;
	$rich_result[2] = "ok";
	return $rich_result;
}

//Export du contenu du triplestore
function exportGraph()
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

 	//on supprime tous les triplets contenant des predicats de l'ontologie loglink
 	$sparql ='
		CONSTRUCT { ?s ?p ?o }
		WHERE
		{
			GRAPH <'.$MyGraph.'>
			{ 
				?s ?p ?o
			} .
		}
 	';

	$res = $MyEndPointSparql->query($sparql);
	//afficheText("deleteAll : ".$sparql,520);
	
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
	
	$rich_result[0] = "exportGraph";
	$rich_result[1] = $sparql;
	$rich_result[2] = $res;
	return $rich_result;
}
?>
