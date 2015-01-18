//Début

(function (document, $, storage) {
	
	$(function ()
			{
				//var $board = $("<section id=board>").appendTo($(document.body));
				
				var default_domain = "loglink11";
				
				$('#datatable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"><thead><tr><th>Sujet</th><th>Predicat</th><th>Objet</th><th>Action</th></tr><tbody></tbody></thead></table>' );
				
				var t_triples = [];
				t_triples = get_triples_from_triplestore(default_domain);

				var aaData = [];
				var aoColumns;
				var iDisplayLength = 50;

				$.each(t_triples, function(i, triple)
						{
								aaData.push([triple.sujet,triple.predicat,triple.objet,"<a href='#' id='delete_triple' i='"+i+"'>Delete</a>"]);
						}
				);

				aoColumns = [{"sTitle":"Sujet"},{"sTitle":"Predicat"},{"sTitle":"Objet"},{"sTitle":"Action"}];

				var oTable = $('#example').dataTable({
			        "aaData": aaData,
			        "aoColumns": aoColumns
				});
				
				$('#delete_triple').live("click", function()
				 		{
							var i=$(this).attr("i");
							delete_triple_into_triplestore(aaData[i]);
						}
				 	);

		}

	);
}
)(document, jQuery, localStorage);
