//=======================================
//
// Fonctions simples de l'interface loglink1.1.js
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
