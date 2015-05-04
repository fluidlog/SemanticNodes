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
	$Endpoint->setLogin($MyLogin);
	$Endpoint->setPassword($MyPassword);
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

function trace_sparql($text)
{
	$fp = fopen('../log/trace_sparql.txt','a+'); // ouvrir le fichier ou le créer
	fseek($fp,SEEK_END); // poser le point de lecture à la fin du fichier
// 	echo "=================\r\n";
// 	var_dump($text);
	$err= date('Y-m-d H:i:s ') . $text . " ($_SERVER[REMOTE_ADDR])\r\n";
	fputs($fp,$err); // ecrire ce texte
	fclose($fp); //fermer le fichier
}

//Récupère tout le contenu du triplestore
function getTriplesFromTriplestore($domain)
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;

	//On se connecte
	$MyEndPointSparql = connectMaBase();

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
function exportFromTriplestore()
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

 	//exorte le graph avec une requete CONSTRUCT
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

	$res = $MyEndPointSparql->queryRead($sparql,"text/plain");
	//afficheText("exportGraph : ".$sparql,520);
	
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
	
	$rich_result[0] = "exportFromTriplestore";
	$rich_result[1] = $sparql;
	$rich_result[2] = $res;
	return $rich_result;
}

//Import d'une sauvegarde en turtle
function importIntoTriplestore($imported_graph)
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
	$MyEndPointSparql->query($sparql);
	$err = $MyEndPointSparql->getErrors();
	if ($err) {
		throw new \Exception($err);
	}

	$stripedGraph = stripslashes($imported_graph);
	$maxCharacters = 9000;
	if (strlen($stripedGraph) > $maxCharacters) {
		$index = 0;
		$characters = 0;
		$graphs = [];
		$nextGraphLines = [];
		$stripedGraph = str_replace("\rn", "\n", $stripedGraph);
		$graph = str_replace("\r", "\n", $stripedGraph);
		$lines = explode("\n", $graph);
		while ($index < count($lines)) {
			$nextGraphLines[] = $lines[$index];
			$index++;
			if (array_key_exists($index, $lines)) {
				$characters = $characters + strlen($lines[$index]);
				if ($characters >= $maxCharacters) {
					$characters = 0;
					$graphs[] = $nextGraphLines;
					$nextGraphLines = [];
				}
			}
		}
		foreach ($graphs as $index => $lines) {
			$graphs[$index] = implode("\n", $lines);
		}
	} else {
		$graphs = [$stripedGraph];
	}
	foreach ($graphs as $index => $graph) {
		// Importe le graph avec une requête de type `LOAD`
		$sparql = <<<"SPARQL"
INSERT INTO GRAPH <$MyGraph>
{
	$graph
}
SPARQL;
		$res = $MyEndPointSparql->query($sparql);
		$err = $MyEndPointSparql->getErrors();
		if ($err) {
			throw new \Exception($err);
		}
		$rich_result[0] = "importIntoTriplestore";
		$rich_result[1] = $sparql;
		$rich_result[2] = $res;
		if ($index + 1 === count($graphs)) {
			trace_sparql(sprintf('Imported a graph from %d chunks',  count($graphs)));
			return $rich_result;
		}
	}
}
?>
