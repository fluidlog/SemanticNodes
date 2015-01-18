function get_triples_from_triplestore(domain_name)
{
	var t_triples;
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../sparql/main.php',
		    dataType: 'json',
		    success: function(t_data) 
					    { 
							// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> retour,
		    				affiche_debug(t_data[0], t_data[1]);
							if (t_data[2] != null)
							{
								t_triples = t_data[2];
							}
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data+" (Fonction get_triples_from_triplestore()) !","alert");
					    },
		    data: { fn : "getTriplesFromTriplestore", domain_name : domain_name },
		    async: false
		}
	);
	return t_triples;
}

function delete_triple_into_triplestore(triple) 
{
	//alert("delete: sujet="+triple[0]+" Predicat="+triple[1]+" Objet="+triple[2]);
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../sparql/main.php',
		    dataType: 'json',
		    success: function(t_data) 
					    { 
							// t_data[0] -> nom fonction php, t_data[1] -> sparql, t_data[2] -> retour,
		    				affiche_debug(t_data[0], t_data[1]);
					    },
		    error: function(t_data) 
					    { 
							message ("Erreur Ajax : Message="+t_data+" (Fonction delete_triple_into_triplestore()) !","alert");
					    },
		    data: { fn : "deleteTripleIntoTriplestore", sujet : triple[0], predicat : triple[1], objet : triple[2] },
		    async: false
		}
	);
}

function display_admin_panel($board, t_user_connected)
{
	//  =========================================================
	//	Gestion des users
	//  =========================================================

	$('#admin').show().fadeIn(1000);
	//Remplis la liste déroulante avec les utilisateurs existants
	var list_users=get_users_from_triplestore();

	if (list_users)
	{
		//Mise à jour de la liste déroulante des users
		var select = $('#list_users');
		
		//Vide le select
		$('#list_users').empty();
	
		//Rajoute la liste des users
	    $.each(list_users, function(i, entry) 
	     		{
	     			// Attention : options[options.length] = new Option(entry) doit fonctionner sur IE, mais pas sur Chrome avec la dernière version de Jquery 
	     			$('#list_users').append(new Option(entry.name,entry.name));
	     		}
	    );
	    //On affiche le bouton de suppression qui était caché lorsqu'il n'y avait pas de user
		$('#delete_user_selected').show();
	}
	else
	{
		//Vide le select lorsqu'on supprime le dernier, sinon, il reste dans la liste...
		$('#list_users').empty();
		//Ne pas afficher la listbox ni le bouton de suppression s'il n'y a pas de user dans la liste...
		$('#list_users').hide().fadeOut(3000);
		$('#delete_user_selected').hide().fadeOut(3000);
	}
	
		
	//alert(t_user_connected["user_name"]);
	//Ajoute selected="selected" sur l'option HTML correspondant au user sélectionné dans le tripletore
	$("#list_users option:contains('" + t_user_connected["user_name"] + "')").attr("selected", "selected");
	$("#list_users").val(t_user_connected["user_name"]);

	// Lorsqu'on ajoute un utilisateur, 
	// on montre l'input, le bouton "Create" et le bouton "cacher"
	// on cache le bouton "ajouter"
	$('#add_user').click(function()
 		{
			$('#create_user_input').show().fadeIn(1000);
			$('#create_user_button').show().fadeIn(1000);
			$('#hide_add_user').show().fadeIn(1000);
			$('#add_user').hide().fadeOut(1000);
 		}
	);
	
	// Lorsqu'on cache l'ajout d'un utilisateur, 
	// on cache l'input, le bouton "Create" et le bouton "cacher"
	// on montre le bouton "ajouter"
	$('#hide_add_user').click(function()
 		{
			$('#create_user_input').hide().fadeOut(1000);
			$('#create_user_button').hide().fadeOut(1000);
			$('#hide_add_user').hide().fadeOut(1000);
			$('#add_user').show().fadeIn(1000);
 		}
	);

	//suppression du "placeholder" lorsque l'utilisateur entre un filtre
	//http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	$('#user_name_input [placeholder]').focus(function() 
		{
		  var input = $(this);
		  input.removeClass('input-error');
		  if (input.val() == input.attr('placeholder')) 
		  {
		    input.val('');
		    input.removeClass('placeholder');
		  }
		}
	).blur(function() 
		{
		  var input = $(this);
		  if (input.val() == '' || input.val() == input.attr('placeholder')) 
		  {
		    input.addClass('placeholder');
		    input.val(input.attr('placeholder'));
		  }
		}
	).blur();

	$('#create_user_button').click(function()
 		{
			var name_user = $('#create_user_input').val();
			
			if (name_user)
			{
			 	//suppression du "placeholder" lorsque l'utilisateur entre un filtre
				//http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
				$('#create_user_input [placeholder]').focus(function() 
					{
					  var input = $(this);
					  if (input.val() == input.attr('placeholder')) 
					  {
					    input.val('');
					    input.removeClass('placeholder');
					  }
					}
				).blur(function() 
					{
					  var input = $(this);
					  if (input.val() == '' || input.val() == input.attr('placeholder')) 
					  {
					    input.addClass('placeholder');
					    input.val(input.attr('placeholder'));
					  }
					}
				).blur();
				
				if (!$('#list_users option:contains("'+name_user+'")').val())
				{
					var user_added_iri_id = add_user_to_triplestore(name_user);
					
					//Ajoute le nouveau user créé dans la liste déroulante
        			$('#list_users').append(new Option(user_added_iri_id,name_user,true,true));
 					//On vide le texte dans l'input
 					$('#create_user_input').val("");

 					//Si c'est le premier user créé, afficher la liste et le bouton de suppression
 	        		if ($('#list_users option').length == 1)
 	        		{
 	        			$('#list_users').show().fadeIn(3000);
 	        			$('#delete_user_selected').show().fadeIn(3000);
 	        		}

					$('#create_user_input').hide().fadeOut(1000);
					$('#create_user_button').hide().fadeOut(1000);
					$('#hide_add_user').hide().fadeOut(1000);
					$('#add_user').show().fadeIn(1000);
				}
				else
			 		message("User '"+name_user+"' already exist","alert");
			}
			else
			{
		 		message("Please enter a user.","alert");
			}
		}
 	);

 	$('#delete_user').click(function()
 		{
			var name_user = $('#list_users option:selected').text();
			delete_user(name_user);
		}
 	);

 	$('#list_users').change(function()
 		{
			var name_user = $('#list_users option:selected').val();
	 		if (name_user)
	 		{
	 			triplestore_connect_user(name_user);
		 		message("user "+name_user+" selected","warning");
	 		}
	 		else
		 		message("No user selected in triplestore","alert");
	 			
		}
 	);

	//  =========================================================
	//	Gestion des domaines (Seulement en admin, sinon : "loglink01" sélectionné par défaut)
	//  =========================================================

	//Remplis la liste déroulante avec les domains existants
	var domains=[];
 	domains=get_domains();
	
	if (domains != null)
	{
		//Mise à jour de la liste déroulante des domaines
		var select = $('#list_domains');
		
		//Vide le select
		$('#list_domains').empty();
 
		//Rajoute la liste des domains
        $.each(domains, function(i, entry) 
        		{
        			// Attention : options[options.length] = new Option(entry) doit fonctionner sur IE, mais pas sur Chrome avec la dernière version de Jquery 
        			$('#list_domains').append(new Option(entry,entry));
        		}
        );
        //On affiche le bouton de suppression qui était caché lorsqu'il n'y avait pas de domaine
		$('#delete_domain_selected').show();
	}
 	else
 	{
		//Vide le select lorsqu'on supprime le dernier, sinon, il reste dans la liste...
		$('#list_domains').empty();
		//Ne pas afficher la listbox ni le bouton de suppression s'il n'y a pas de domain dans la liste...
		$('#list_domains').hide().fadeOut(3000);
		$('#delete_domain_selected').hide().fadeOut(3000);
 	}
	
	//Récupère le domaine sélectionné dans le triplestore pour l'utilisateur connecté
	domain_selected=get_domain_selected();
	//Ajoute selected="selected" sur l'option HTML correspondant au domain sélectionné dans le tripletore
	$("#list_domains option:contains('" + domain_selected + "')").attr("selected", "selected");
	$("#list_domains").val(domain_selected);
	
	// Lorsqu'on ajoute un domain, 
	// on montre l'input, le bouton "Create" et le bouton "cacher"
	// on cache le bouton "ajouter"
	$('#add_domain').click(function()
 		{
			$('#create_domain_input').show().fadeIn(1000);
			$('#create_domain_button').show().fadeIn(1000);
			$('#hide_add_domain').show().fadeIn(1000);
			$('#add_domain').hide().fadeOut(1000);
 		}
	);
	
	// Lorsqu'on cache l'ajout d'un domain, 
	// on cache l'input, le bouton "Create" et le bouton "cacher"
	// on montre le bouton "ajouter"
	$('#hide_add_domain').click(function()
 		{
			$('#create_domain_input').hide().fadeOut(1000);
			$('#create_domain_button').hide().fadeOut(1000);
			$('#hide_add_domain').hide().fadeOut(1000);
			$('#add_domain').show().fadeIn(1000);
 		}
	);

 	$('#create_domain_button').click(function()
 		{
			var name_domain = $('#create_domain_input').val();
			
			if (name_domain)
			{
			 	//suppression du "placeholder" lorsque l'utilisateur entre un filtre
				//http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
				$('#create_domain_input [placeholder]').focus(function() 
					{
					  var input = $(this);
					  if (input.val() == input.attr('placeholder')) 
					  {
					    input.val('');
					    input.removeClass('placeholder');
					  }
					}
				).blur(function() 
					{
					  var input = $(this);
					  if (input.val() == '' || input.val() == input.attr('placeholder')) 
					  {
					    input.addClass('placeholder');
					    input.val(input.attr('placeholder'));
					  }
					}
				).blur();
				
				if (!$('#list_domains option:contains("'+name_domain+'")').val())
				{
					var domain_created = add_domain_to_triplestore(name_domain);
					
					if (domain_created)
					{
	 					//Ajoute le nouveau domaine créé dans la liste déroulante
	        			$('#list_domains').append(new Option(jsondata,jsondata,true,true));
	 					//On vide le texte dans l'input
	 					$('#create_domain_input').val("");
	 					//On le sélectionne dans le triplestore
	 					select_domain_in_triplestore(domain_created);
	
	 					message("Domain "+domain_created+" created and selected in the triplestore !","succed");
	
	 					//Si c'est le premier domaine créé, afficher la liste et le bouton de suppression
	 	        		if ($('#list_domains option').length == 1)
	 	        		{
	 	        			$('#list_domains').show().fadeIn(3000);
	 	        			$('#delete_domain_selected').show().fadeIn(3000);
	 	        		}
	
						$('#create_domain_input').hide().fadeOut(1000);
						$('#create_domain_button').hide().fadeOut(1000);
						$('#hide_add_domain').hide().fadeOut(1000);
						$('#add_domain').show().fadeIn(1000);
					}
					else
						message("Erreur to add domain "+name_domain+" ! ","alert");
					
				}
				else
			 		message("Domain '"+name_domain+"' already exist","alert");
			}
			else
			{
		 		message("Please enter a domain.","alert");
			}
		}
 	);

 	$('#delete_domain_selected').click(function()
 		{
			var name_domain = $('#list_domains option:selected').text();
			delete_domain_selected(name_domain);
		}
 	);

 	$('#list_domains').change(function()
 		{
			var name_domain = $('#list_domains option:selected').val();
	 		if (name_domain)
	 		{
	 			select_domain_in_triplestore(name_domain);
		 		message("Domain "+name_domain+" selected","warning");
	 		}
	 		else
		 		message("No domain selected in triplestore","alert");
	 			
		}
 	);

	//  =========================================================
	//	Affiche la liste des termes présents dans le triplestore
	//  =========================================================

	var terms=[];
	terms=get_terms_from_triplestore(t_user_connected["user_iri_id"]);
	
 	//Remplis la liste déroulante avec les terms existants
	if (terms != null)
	{
		//Mise à jour de la liste déroulante des domaines
		var select = $('#list_terms');
		
		//Vide le select
		$('#list_terms').empty();
 
		//Rajoute la liste des domains
        $.each(terms, function(i, entry) 
        		{
        			// Attention : options[options.length] = new Option(entry) doit fonctionner sur IE, mais pas sur Chrome avec la dernière version de Jquery 
        			$('#list_terms').append(new Option(entry.text,entry.text));
        		}
        );
        //On affiche le bouton de suppression qui était caché lorsqu'il n'y avait pas de domaine
		$('#delete_term_selected').show();
	}
 	else
 	{
		//Vide le select lorsqu'on supprime le dernier, sinon, il reste dans la liste...
		$('#list_terms').empty();
		//Ne pas afficher la listbox ni le bouton de suppression s'il n'y a pas de domain dans la liste...
		$('#list_terms').hide().fadeOut(3000);
		$('#delete_term_selected').hide().fadeOut(3000);
 	}

	//  ===========================================================================
	//	Affichage d'un panel pour voir les requêtes SPARQL
	//  ===========================================================================
	$('#debug').show();
 	$('#debug').hover(
 			function()
	 		{
	 	    	$('.debug').css(
	 	           {
	 	        	   'z-index' : 1,
	 	               'zoom' : 1.5
	 	           }
	 	        );
	 		},
	 		function()
	 		{
	 			$('.debug').css(
	 	           {
	 	               'zoom' : 1
	 	           }
	 	        );
	 		}
	 	);
}
