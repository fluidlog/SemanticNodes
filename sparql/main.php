<?php

ini_set("display_errors", "0");

include('functions.php');
include('domain.php');
include('loglink1.1.php');

//==================================================
//
//Ce script est appelé :
// - soit en ajax par l'application
// - soit en http via l'url (cela permet de tester les fonctions sans passer par le client en JS)
//
//==================================================

$bouchon = "false";
$ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';

$function_name = $_REQUEST['fn'];

if ($ajax)
{	
	header('Content-type: application/json');
	header("Cache-Control: max-age=1"); // Annule le cache du serveur pour ne plus avoir de persistances dans les requêtes SPARQL
	
	
	switch ($_REQUEST['fn'])
	{
		//Fonctions spécifiques utilisées pour l'application loglink1.1
		case "getDataset" :
			echo json_encode($_REQUEST['fn']());
			break;
		case "incrementNodeId" :
			echo json_encode($_REQUEST['fn']($_REQUEST['node_iri_id']));
			break;
		case "getNewNodeIri" :
			echo json_encode($_REQUEST['fn']());
			break;
		case "initKernelGraph" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['first_node_iri'], 
												$_REQUEST['second_node_iri']));
			break;
		case "addNode" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['source_node_id'],
												$_REQUEST['target_node_id']));
			break;
		case "addLink" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['source_node_id'],
												$_REQUEST['target_node_id']));
			break;
		case "changeType" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['node_id'],
											$_REQUEST['old_type'],
											$_REQUEST['new_type']));
			break;
		case "changeLabel" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['node_id'],
												$_REQUEST['label']));
			break;
		case "deleteLink" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['source_iri_id'],
												$_REQUEST['target_iri_id']));
			break;
		case "deleteNode" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['node_iri_id']));
			break;
		case "exportGraph" :
			echo json_encode($_REQUEST['fn']());
			break;
					
		//Fonctions liées à l'utilisateur
		case "existUser" :
			echo json_encode($_REQUEST['fn']($_REQUEST['user_name']));
			break;
		case "connectUserIntoTriplestore" :
			echo json_encode($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;
		case "disconnectUserIntoTriplestore" :
			echo json_encode($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;
		case "incrementUserId" :
			echo json_encode($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;
		case "getNewUserIri" :
			echo json_encode($_REQUEST['fn']());
			break;
		case "addUserToTriplestore" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['user_name'],
												$_REQUEST['left'],
												$_REQUEST['top']));
			break;
		case "getUsersFromTriplestore" :
			if ($bouchon == "true")
			{
				$users = array (
						0 => "Bouchon - getUsersFromTriplestore",
						1 => "PREFIX loglink: <http://www.fluidlog.com/2013/05/loglink/core#>
								SELECT ?u ?left ?top ?name ?connexion
								WHERE
								{
									graph <http://lod.bordercloud.com/lesontologiesgraphiques>
						   			{
							   			<http://www.fluidlog.com/loglink> loglink:user ?u .
							   					?u 	loglink:user_left ?left ;
							   						loglink:user_top ?top ;
							   						loglink:user_name ?name ;
							   						loglink:user_connexion_status ?connexion
									}
								}",
						2 => array (
							0 => array (
								"user_iri" => "http://www.fluidlog.com/loglink/user/1",
								"user_name" => "yannick",
								"user_left" => "600",
								"user_top" => "5",
								"user_connexion_status" => "connected"
								)
					)
				);
				echo json_encode($users);
			}
			else
				echo json_encode($_REQUEST['fn']());
			break;
			case "saveUserToTriplestore" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['user_iri_id'],
												$_REQUEST['left'],
												$_REQUEST['top']));
			break;
		case "deleteUserIntoTriplestore" :
			echo json_encode($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;
				
		//Fonctions liées aux termes
		case "getTermsFromTriplestore" :
			if ($bouchon == "true")
			{
				$terms = array (
						0 => "Bouchon - getTermsFromTriplestore",
						1 => "PREFIX loglink: <http://www.fluidlog.com/2013/05/loglink/core#>
							SELECT ?term_iri ?label ?x ?y ?user_iri ?user_name
							WHERE
							{
								graph <http://lod.bordercloud.com/lesontologiesgraphiques>
								{
								    <http://www.fluidlog.com/loglink/user/1> 	loglink:accesstoterm ?term_iri .
								    		?term_iri 	loglink:label ?label ;
								    					loglink:x ?x ;
								    					loglink:y ?y ;
														loglink:hasforowner ?user_iri .
								    		?user_iri 	loglink:user_name ?user_name
								}
							}",
						2 => array (
							0 => array (
								"term_iri" => "http://www.fluidlog.com/loglink/domain/loglink01/term/1",
								"term_text" => "toto",
								"term_left" => "600",
								"term_top" => "100",
								"term_owner_iri" => "http://www.fluidlog.com/loglink/user/1",
								"term_owner_name" => "yannick",
							),
							1 => array (
								"term_iri" => "http://www.fluidlog.com/loglink/domain/loglink01/term/2",
								"term_text" => "tata",
								"term_left" => "400",
								"term_top" => "200",
								"term_owner_iri" => "http://www.fluidlog.com/loglink/user/1",
								"term_owner_name" => "yannick",
							)
						)
				);
				echo json_encode($terms);
			}
			else
				echo json_encode($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;	
		case "incrementTermId" :
			echo json_encode($_REQUEST['fn']($_REQUEST['term_iri_id']));
			break;
		case "addTermToTriplestore" :
			$term = json_decode($_REQUEST['term'],true);
			echo json_encode($_REQUEST['fn'](	$term[0]["term_iri_id"],
												$term[0]["text"],
												$term[0]["left"],
												$term[0]["top"],
												$term[0]["owner_iri_id"],
												$term[0]["owner_name"]));
			break;
		case "getNewTermIri" :
			echo json_encode($_REQUEST['fn']());
			break;
		
		case "saveTermToTriplestore" :
			$term = json_decode($_REQUEST['terms'],true);
			echo json_encode($_REQUEST['fn'](	$term[0]["term_iri_id"],
													$term[0]["text"],
													$term[0]["left"],
													$term[0]["top"],
													$term[0]["owner_iri_id"],
													$term[0]["owner_name"]));
			break;
		case "linkTermsIntoTriplestore" :
			echo json_encode($_REQUEST['fn']($_REQUEST['term_receptor_iri_id'],$_REQUEST['term_dropped_iri_id']));
			break;
		case "deleteTermsUserConnected" :
			echo json_encode($_REQUEST['fn']($_REQUEST['user_connected_iri_id']));
			break;
		case "deleteTermFromTriplestore" :
			echo json_encode($_REQUEST['fn'](	$_REQUEST['term_iri_id'], 
												$_REQUEST['user_connected_iri_id'], 
												$_REQUEST['owner_iri_id']));
			break;
					
		case "existDomain" :
			echo json_encode($_REQUEST['fn']($_REQUEST['domain_name']));
			break;
		case "addDomainToTriplestore" :
			echo json_encode($_REQUEST['fn']($_REQUEST['domain_name']));
			break;
		case "selectDomainInTriplestore" :
			echo json_encode($_REQUEST['fn']($_REQUEST['domain_name']));
			break;
		case "getDomains" :
			echo json_encode($_REQUEST['fn']());
			break;
		case "getDomainSelected" :
			echo json_encode($_REQUEST['fn']());
			break;
	
		//fonctions d'administration
		case "getTriplesFromTriplestore" :
			echo json_encode($_REQUEST['fn']($_REQUEST['domain_name']));
		break;
		case "deleteTripleIntoTriplestore" :
			echo json_encode($_REQUEST['fn']($_REQUEST['sujet'], $_REQUEST['predicat'], $_REQUEST['objet']));
			break;
		
		case "deleteAll" :
			echo json_encode($_REQUEST['fn']());
			break;
	}
}
else
{
	// ==================================================
	//
	// Dans le cas où la page est appelé en direct...
	// Via une requête http : http://localhost/fluidlog/sparql/main.php?fn=getTermsFromTriplestore&user_iri_id=1
	//
	// ==================================================
	
	echo ("Bienvenue dans le mode d'appel aux fonctions du triplesore Fluidlog");
	echo ("<br>Par exemple :");
	echo ("<br> - Ajouter un terme lie a l'utilisateur possedant user_iri_id = 1 : ");
	echo ("<br><a href='main.php?fn=addTermToTriplestore&terms&terms=[{\"term_iri_id\":\"1\",\"text\":\"zdzdzdz\",\"left\":2,\"top\":52,\"owner_iri_id\":\"1\",\"owner_name\":\"yannick\"}]'>main.php?fn=addTermToTriplestore&terms&terms=[{\"term_iri_id\":\"1\",\"text\":\"zdzdzdz\",\"left\":2,\"top\":52,\"owner_iri_id\":\"1\",\"owner_name\":\"yannick\"}]</a>");
	echo ("<br> - Recuperer tous les termes lies a l'utilisateur possedant user_iri_id = 1 : ");
	echo ("<br><a href='main.php?fn=getTermsFromTriplestore&user_iri_id=1'>main.php?fn=getTermsFromTriplestore&user_iri_id=1</a>");
	echo ("<br> - Recuperer tous les utilisateurs ");
	echo ("<br><a href='main.php?fn=getUsersFromTriplestore'>main.php?fn=getUsersFromTriplestore</a>");
	echo ("<br> - Sauvegarder les coordonnees d'un utilisateur ");
	echo ("<br><a href='main.php?fn=saveUserToTriplestore&user_iri_id=1&x=300&y=34'>main.php?fn=saveUserToTriplestore&user_iri_id=1&x=300&y=34</a>");
	echo ("<br> - Afficher tout les triples !");
	echo ("<br><a href='main.php?fn=getTriplesFromTriplestore&domain_name=loglink11'>main.php?fn=getTriplesFromTriplestore&domain_name=loglink11</a>");
	echo ("<br> - getNewNodeIri ");
	echo ("<br><a href='main.php?fn=getNewNodeIri'>main.php?fn=getNewNodeIri</a>");
	echo ("<br> - getDataset ");
	echo ("<br><a href='main.php?fn=getDataset'>main.php?fn=getDataset</a>");
	echo ("<br> - changeType ");
	echo ("<br><a href='main.php?fn=changeType&node_id=1&old_type=actor&new_type=idea'>main.php?fn=changeType&node_id=1&old_type=actor&new_type=idea</a>");
	echo ("<br> - deleteLink ");
	echo ("<br><a href='main.php?fn=deleteLink&source_iri_id=1&target_iri_id=2'>main.php?fn=deleteLink&source_iri_id=1&target_iri_id=2</a>");
	echo ("<br> - deleteNode ");
	echo ("<br><a href='main.php?fn=deleteNode&node_iri_id=3'>main.php?fn=deleteNode&node_iri_id=3</a>");
	echo ("<br> - exportGraph ");
	echo ("<br><a href='main.php?fn=exportGraph'>main.php?fn=exportGraph</a>");
	
	echo ("<br> - Supprimer tout le contenu du Triplestore (Attention !) ");
	echo ("<br><a href='main.php?fn=deleteAll'>main.php?fn=deleteAll</a>");
	echo ("<br>");
	
	switch ($_REQUEST['fn'])
	{
		//Fonctions spécifiques utilisées pour l'application loglink4.2
		case "getDataset" :
			echo var_dump($_REQUEST['fn']());
			break;
		case "incrementNodeId" :
			echo var_dump($_REQUEST['fn']($_REQUEST['node_iri_id']));
			break;
		case "getNewNodeIri" :
			echo var_dump($_REQUEST['fn']());
			break;
		case "initKernelGraph" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['first_node_iri'], 
											$_REQUEST['second_node_iri']));
			break;
		case "addNode" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['source_node_id'],
											$_REQUEST['target_node_id']));
			break;
		case "addLink" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['source_node_id'],
											$_REQUEST['target_node_id']));
			break;
		case "changeType" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['node_id'],
											$_REQUEST['old_type'],
											$_REQUEST['new_type']));
			break;
		case "changeLabel" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['node_id'],
												$_REQUEST['label']));
			break;
		case "deleteLink" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['source_iri_id'],
												$_REQUEST['target_iri_id']));
			break;
		case "deleteNode" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['node_iri_id']));
			break;
		case "exportGraph" :
			echo json_encode($_REQUEST['fn']());
			break;
					
		//Fonctions liées à l'utilisateur
		case "existUser" :
			echo var_dump($_REQUEST['fn']($_REQUEST['user_name']));
			break;
		case "connectUserIntoTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;
		case "disconnectUserIntoTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;
		case "incrementUserId" :
			echo var_dump($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;
		case "getNewUserIri" :
			echo var_dump($_REQUEST['fn']());
			break;
		case "addUserToTriplestore" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['user_name'],
												$_REQUEST['left'],
												$_REQUEST['top']));
			break;
		case "getUsersFromTriplestore" :
			if ($bouchon == "true")
			{
				$users = array (
						0 => "Bouchon - getUsersFromTriplestore",
						1 => "PREFIX loglink: <http://www.fluidlog.com/2013/05/loglink/core#>
								SELECT ?u ?left ?top ?name ?connexion
								WHERE
								{
									graph <http://lod.bordercloud.com/lesontologiesgraphiques>
						   			{
							   			<http://www.fluidlog.com/loglink> loglink:user ?u .
							   					?u 	loglink:user_left ?left ;
							   						loglink:user_top ?top ;
							   						loglink:user_name ?name ;
							   						loglink:user_connexion_status ?connexion
									}
								}",
						2 => array (
							0 => array (
								"user_iri" => "http://www.fluidlog.com/loglink/user/1",
								"user_name" => "yannick",
								"user_left" => "600",
								"user_top" => "5",
								"user_connexion_status" => "connected"
								)
					)
				);
				echo var_dump($users);
			}
			else
				echo var_dump($_REQUEST['fn']());
			break;
		case "saveUserToTriplestore" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST["user_iri_id"],
													$_REQUEST["left"],
													$_REQUEST["top"]));
			break;
		case "deleteUserIntoTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;

		case "getTermsFromTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['user_iri_id']));
			break;
		case "incrementTermId" :
			echo json_encode($_REQUEST['fn']($_REQUEST['term_iri_id']));
			break;
		case "addTermToTriplestore" :
			//Simuler un seul terme : [{"term_iri_id":"10","text":"zdzdzdz","left":2,"top":52,"owner_iri_id":"1","owner_name":"admin"}]
	
			// Attention : utiliser le deuxième paramètre à "true" permet de récupérer un tableau associatif à la
			// place d'un tableau d'objet PHP object(stdClass), ou alors utiliser get_objetc_vars()
			// Réponse ici : http://stackoverflow.com/questions/3754411/php-json-stdclass-object
			// Rien ici : http://php.net/manual/fr/function.json-encode.php :-(
			$term = json_decode($_REQUEST['terms'],true);
			echo var_dump($_REQUEST['fn'](	$term[0]["term_iri_id"],
												$term[0]["text"],
												$term[0]["left"],
												$term[0]["top"],
												$term[0]["owner_iri_id"],
												$term[0]["owner_name"]));
			break;
		case "getNewTermIri" :
			echo var_dump($_REQUEST['fn']());
			break;
		case "saveTermToTriplestore" :
			$term = json_decode($_REQUEST['terms'],true);
			echo var_dump($_REQUEST['fn'](	$term[0]["term_iri_id"],
													$term[0]["text"],
													$term[0]["left"],
													$term[0]["top"],
													$term[0]["owner_iri_id"],
													$term[0]["owner_name"]));
			break;
		case "linkTermsIntoTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['term_receptor_iri_id'],$_REQUEST['term_dropped_iri_id']));
			break;
		case "deleteTermsUserConnected" :
			echo var_dump($_REQUEST['fn']($_REQUEST['user_connected_iri_id']));
			break;
		case "deleteTermFromTriplestore" :
			echo var_dump($_REQUEST['fn'](	$_REQUEST['term_iri_id'],
														$_REQUEST['user_connected_iri_id'],
														$_REQUEST['owner_iri_id']));
			break;
					
		case "existDomain" :
			echo var_dump($_REQUEST['fn']($_REQUEST['domain_name']));
			break;
		case "addDomainToTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['domain_name']));
			break;
		case "selectDomainInTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['domain_name']));
			break;
		case "getDomains" :
			echo var_dump($_REQUEST['fn']());
			break;
		case "getDomainSelected" :
			echo var_dump($_REQUEST['fn']());
			break;
					
		case "incrementTermId" :
			echo var_dump($_REQUEST['fn']($_REQUEST['id']));
			break;
		case "incrementUserId" :
			echo var_dump($_REQUEST['fn']($_REQUEST['id']));
			break;
		
		case "deleteId" :
			echo var_dump($_REQUEST['fn']($_REQUEST['delete_id']));
			break;
			
		case "deleteAll" :
			$_REQUEST['fn']();
			echo "DeleteAll : OK";
			break;

		//fonctions d'administration
		case "getTriplesFromTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['domain_name']));
		break;
		case "deleteTripleIntoTriplestore" :
			echo var_dump($_REQUEST['fn']($_REQUEST['sujet'], $_REQUEST['predicat'], $_REQUEST['objet']));
		break;
	}
}
// On trace quelle fonction a été appelée
trace_sparql($function_name);
?>
