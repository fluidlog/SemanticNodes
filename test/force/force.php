<!DOCTYPE html>
<meta charset="utf-8">
<head>
<title>Le monde de la cartographie sémantique</title>
<!--[if lt IE 9]>
Votre navigateur est obselète.
Merci d'utiliser un navigateur récent : IE 9 (min), Firefox, Chrome ou Safari
<![endif]-->

<script src="../js/jquery-1.8.2.js"></script>
<script src="../js/d3.v3.min.js"></script>
</head>
<body>
<div id="chart"></div>

<?php
if (isset($_GET['type']))
{
	$type = $_GET['type'];
	echo 'Type : '.$type;
	
	switch ($_GET['type']) 
	{
		case "P" :
			echo '<script src="force23P.js"></script>';
			break;
			
		case "A" :
			echo '<script src="force23A.js"></script>';
			break;
			
		case "I" :
			echo '<script src="force23I.js"></script>';
			break;

		case "R" :
			echo '<script src="force23R.js"></script>';
			break;
			
	}
}
	else 
		echo '<script src="force19.js"></script>';
?>
</body>
</html>