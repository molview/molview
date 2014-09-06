<?php
include("php/utility.php");
error_reporting(0);

if(is_below_IE10())
{
	header('Location: http://molview.org/nosupport');
	exit;
}


//preserve + sign by encoding it to %2B before parsing it
parse_str(str_replace("+", "%2B", $_SERVER["QUERY_STRING"]));
?>

<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Thing">

<!--
This file is part of MolView (http://molview.org)
Copyright (c) 2014, Herman Bergwerf

MolView is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

MolView is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with MolView.  If not, see <http://www.gnu.org/licenses/>.
-->

<!--
Query parameters:
  - q = search query
  - smiles = resolve SMILES string
  - cid = load CID
  - pdbid = load PDBID
  - codid = load CIF from COD
  - mode = balls || stick || vdw || wireframe || line
  - chainType = ribbon || cylinders || btube || ctrace || bonds (alias for chainBonds=bonds)
  - chainBonds = true || false
  - chainColor = ss || spectrum || chain || bfactor || polarity
  - bg = black || grey || white
-->

	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

		<meta name="viewport" content="width=device-width, user-scalable=no" />

		<title>MolView</title>

		<link rel="icon" href="favicon-32x32.png" />

		<meta name="author" content="Herman Bergwerf" />
		<meta name="keywords" content="molview,free,chemistry,app,molecules,proteins,crystals,spectroscopy" />

		<!-- CSS -->
		<link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" />
		<link type="text/css" rel="stylesheet" href="build/molview.embed.min.css" media="screen" />

		<!-- JS -->
		<script type="text/javascript" src="build/molview.embed.min.js"></script>

		<!-- Google Analytics -->
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-49088779-3', 'molview.org');
			ga('send', 'pageview');
		</script>

		<script type="text/javascript">
			Request.HTTP_ACCEPT_LANGUAGE = <?php echo '"'.$_SERVER["HTTP_ACCEPT_LANGUAGE"].'"'; ?>;
			Request.HTTP_CLIENT_IP = <?php
			echo '"';
			if(isset($_SERVER["HTTP_CLIENT_IP"]))
				echo $_SERVER["HTTP_CLIENT_IP"];
			else if (isset($_SERVER["HTTP_X_FORWARDED_FOR"]))
				echo $_SERVER["HTTP_X_FORWARDED_FOR"];
			else echo $_SERVER["REMOTE_ADDR"];
			echo '"';
			?>;

			Request.ChemicalIdentifierResolver.available = true;/*<?php
			echo is_available("http://cactus.nci.nih.gov/chemical/structure/C/smiles") ? "true" : "false";
			?>;*/
		</script>
	</head>
	<body id="model" <?php
		if(isset($bg))
		{
			echo 'style="background:'.($bg != "white" ? $bg != "grey" ?
				"#000000" : "#cccccc" : "#ffffff").'"';
		}
	?>>
		<input id="search-input" style="display: none" />
		<div id="chemdoodle" class="render-engine full-cover" style="display: none;"><canvas id="chemdoodle-canvas"></canvas></div>
		<div id="jsmol" class="render-engine full-cover" style="display: none;"></div>
		<div id="glmol" class="render-engine full-cover" style="display: none;"></div>
		<div id="messages"></div>
	</body>
</html>
