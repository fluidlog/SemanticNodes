<?php 
// =========================================
//
// Gestion des domaines
//
// function addDomainToTriplestore($domain_name)
// function getDomains()
// function selectDomain($domain_name)
// function getIriDomainSelected()
// function getDomainSelected()
// function deleteDomainSelected($domain_name)
// function deleteDomains()
//
// =========================================

function existDomain($domain_name)
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;

	//On se connecte
	$MyEndPointSparql = connectMaBase();

	//La requête recherche si un label de domaine correspond à celui fournit en entrée
	$sparql = '
		PREFIX loglink: <'.$prefix_loglink.'>
		SELECT ?d WHERE
		{
			graph <'.$MyGraph.'>
			{
				<'.$iri_loglink.'> loglink:domain ?s .
				?s loglink:label ?d .
				FILTER regex (str(?d),"'.$domain_name.'","i")
			}
		}
	';
		
	$rows = $MyEndPointSparql->query($sparql,"rows");
	//afficheText("existDomain (".$domain_name."): ".$sparql,500);

	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err." existDomain",true));
	}

	$result = array();
	foreach($rows as $row)
	{
		$result[] = $row['d'];
	}
	
	$rich_result[0] = "existDomain";
	$rich_result[1] = $sparql;
	if ($result[0] == $domain_name)
		$rich_result[2] = true;
	else
		$rich_result[2] = false;
	return $rich_result;
}

//Fonction permettant d'initier un domaine sur lequel seront liés tous les termes du domaine.
function addDomainToTriplestore($domain_name)
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	global $iri_loglink_domain;
	
	//On se connecte
	//echo "rrrrr";
	$MyEndPointSparql = connectMaBase();
	//print_r($MyEndPointSparql);
	
	$iri_domain = $iri_loglink_domain.$domain_name;

	//on créer l'IRI du domaine
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
		INSERT DATA
		{
			graph <'.$MyGraph.'>
			{
				<'.$iri_loglink.'> loglink:domain <'.$iri_domain.'>
			}
		}
	';

	//Durant le développement
	//afficheText("addDomainToTriplestore : ".$sparql,450);
	$res = $MyEndPointSparql->queryUpdate($sparql);

	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}

	//on créer le label du domaine (lié à son IRI)
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
		INSERT DATA
		{
			graph <'.$MyGraph.'>
			{
				<'.$iri_domain.'> loglink:label "'.$domain_name.'"
			}
		}
	';

	//Durant le développement
	//afficheText("addDomainToTriplestore : ".$sparql,470);
	$res = $MyEndPointSparql->queryUpdate($sparql);

	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}
	
	$rich_result[0] = "addDomainToTriplestore";
	$rich_result[1] = $sparql;
	$rich_result[2] = $domain_name;
	return $rich_result;
}

function selectDomainInTriplestore($domain_name)
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	global $iri_default_domain;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	//on supprime le triplet représentant le domain sélectionné
	//S'il n'y en a pas, rien ne se passera... ;-)
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
		DELETE WHERE
		{
			graph <'.$MyGraph.'>
			{
				<'.$iri_loglink.'> loglink:domain_selected ?s
			}
		}
	';

	//afficheText("selectDomainInTriplestore Delete iri selected domain : ".$sparql,480);
	$res = $MyEndPointSparql->query($sparql);

	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}

	//on récupère l'URI du domain à sélectionner en fonction du domaine passé en paramètre
	//Ce sont celles qui sont liées à l'uri_fluidlog par le predicat "fluidlog:domain"
	$sparql = '
		PREFIX loglink: <'.$prefix_loglink.'>
		SELECT ?s  WHERE
		{ 
	   		graph <'.$MyGraph.'> 
	   		{
	      		<'.$iri_loglink.'> loglink:domain ?s .
				?s loglink:label ?o .
				FILTER regex (str(?o),"'.$domain_name.'","i")
			}
		}
	';
	
	//afficheText("selectDomainInTriplestore IRI domain to select : ".$sparql,500);
	$rows = $MyEndPointSparql->query($sparql, "rows");
	  
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err) {
		die (print_r($err,true));
	}
	
	$iri_domain_selected = $rows[0]['s'];
	
	//on insère l'IRI du domain sélectionné
	$sparql ='
		PREFIX loglink: <'.$prefix_loglink.'>
		INSERT DATA
		{
			graph <'.$MyGraph.'>
			{
				<'.$iri_loglink.'> loglink:domain_selected <'.$iri_domain_selected.'>
			}
		}
	';
	//afficheText("selectDomainInTriplestore Insert domain selected : ".$sparql,520);
	$res = $MyEndPointSparql->queryUpdate($sparql);

	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err)
	{
		die (print_r($err,true));
	}

	$rich_result[0] = "selectDomainInTriplestore";
	$rich_result[1] = $sparql;
	$rich_result[2] = $domain_name;
	return $rich_result;
}

function getDomains()
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	//La requête retourne tous les label des domaines 
	//lié à une iri liée elle même à l'iri_loglink
	$sparql = '
		PREFIX loglink: <'.$prefix_loglink.'>
		SELECT ?o WHERE
		{ 
			graph <'.$MyGraph.'> 
   			{
	   			<'.$iri_loglink.'> loglink:domain ?s .
				?s loglink:label ?o
			}
		}
	';
			
	//Durant le développement 
	//afficheText("getDomains : ".$sparql,500);
	$rows = $MyEndPointSparql->query($sparql, 'rows');
    		
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs		
	$err = $MyEndPointSparql->getErrors();
	if ($err) 
	{
	 	die (print_r($err." getListDomains",true));
	}
	
	$result = array();
	foreach($rows as $row)
	{
		$result[] = $row['o'];
	}

	$rich_result[0] = "getDomains";
	$rich_result[1] = $sparql;
	$rich_result[2] = $result;
	return $rich_result;
}

function getIriDomainSelected()
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	//on récupère l'URI du domain sélectionné
	//Ce sont celles qui sont liées à l'uri_fluidlog par le predicat "fluidlog:selected_domain"
	$sparql = '
		PREFIX loglink: <'.$prefix_loglink.'>
		SELECT ?d  WHERE
		{ 
	   		graph <'.$MyGraph.'>
	   		{
	      		<'.$iri_loglink.'> loglink:domain_selected ?d
			}
		}
	';
	
	//afficheText("IRI domain selected : ".$sparql,450);
	$rows = $MyEndPointSparql->query($sparql, "rows");
	  
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err) {
		die (print_r($err,true));
	}
	
	return $rows[0]['d'];
}

function getDomainSelected()
{
	global $MyGraph;
	global $iri_loglink;
	global $prefix_loglink;
	
	//On se connecte
	$MyEndPointSparql = connectMaBase();

	$iri_domain_selected = getIriDomainSelected();
	//on récupère l'URI du domain sélectionné
	//Ce sont celles qui sont liées à l'uri_fluidlog par le predicat "fluidlog:selected_domain"
	$sparql = '
		PREFIX loglink: <'.$prefix_loglink.'>
		SELECT ?o  WHERE
		{ 
	   		graph <'.$MyGraph.'>
	   		{
	      		<'.$iri_domain_selected.'> loglink:label ?o
			}
		}
	';
	
	//afficheText("domain selected : ".$sparql,500);
	$rows = $MyEndPointSparql->query($sparql, "rows");
	  
	//On vérifie qu'il n'y a pas d'erreur sinon on stop le programme et on affiche les erreurs
	$err = $MyEndPointSparql->getErrors();
	if ($err) {
		die (print_r($err,true));
	}
	
	$rich_result[0] = "getDomainSelected";
	$rich_result[1] = $sparql;
	$rich_result[2] = $rows[0]['o'];
	return $rich_result;
}

?>
