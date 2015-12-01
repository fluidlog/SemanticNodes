<!DOCTYPE html>
<meta charset="utf-8">
<head>
<title>PAIR (Focus + Context)</title>
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
	
	switch ($type) 
	{
		case "P" :
			echo '<script src="pair.js?type=P"></script>';
			break;
			
		case "A" :
			echo '<script src="pair.js?type=A"></script>';
			break;
			
		case "I" :
			echo '<script src="pair.js?type=I"></script>';
			break;

		case "R" :
			echo '<script src="pair.js?type=R"></script>';
			break;
			
	}
}
	else 
		echo '<script src="pair.js"></script>';
?>
</body>
</html>