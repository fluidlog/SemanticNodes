<!DOCTYPE html>
<html
xmlns:foaf="http://xmlns.com/foaf/0.1/"
xmlns:dc="http://purl.org/dc/elements/1.1/">
<head>
<meta rel="dc:creator" href="http://alvaro.graves.cl" /> 
<meta rel="dc:source" href="http://github.com/alangrafu/visualRDF" /> 
<meta property="dc:modified" content="2012-05-18" /> 
<meta charset='utf-8'> 
<link href='css/bootstrap-responsive.min.css' rel='stylesheet' type='text/css' />
<link href='css/bootstrap.min.css' rel='stylesheet' type='text/css' />
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/bootstrap-modal.js"></script>
<script type="text/javascript" src="js/d3/d3.js"></script>
<script type="text/javascript" src="js/d3/d3.layout.js"></script>
<script type="text/javascript" src="js/d3/d3.geom.js"></script>
<script type="text/javascript">
var url = 'http://graves.cl/visualRDF/#',
    thisUrl = document.URL;

function restart(myUrl)
{
	//Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
	$.ajax(
		{
		    type: 'GET',
		    url: '../../../sparql/rdf2json.php',
//		    url: '../../../sparql/main.php',
		    dataType: 'json',
		    success: function(json) 
					    { 
							d3.select("#waiting").style("display", "none");
							init(json);
			    			return false;
					    },
		    error: function(json) 
					    { 
							message ("Erreur Ajax : Message="+json+" (Fonction restart()) !","alert");
					    },
		    data: { url : encodeURIComponent(myUrl) },
//		    data: { fn : "getDataset" },
		    async: false
		}
	);
}
    
// function restart(myUrl){
// 	d3.json('../../../sparql/rdf2json.php?url='+encodeURIComponent(myUrl), function(json){
// 		d3.select("#waiting").style("display", "none");
// 		init(json);
// 	});
// }

restart(url);

</script>
<title>Visual RDF</title>
</head>
<body>

<div style="float: left;border-width: 1px; border-style: solid;width:100%;min-height:500px;height:100%" id='chart'></div>

</body>
</html>


