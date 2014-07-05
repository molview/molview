<?php
include("../utility.php");
error_reporting(0);

if(is_below_IE10())
{
	header('Location: http://molview.org/nosupport');
	exit;
}

//preserve + sign by encoding it before parsing it
if(strpos($_SERVER["QUERY_STRING"], "+") !== false)
{
    $_SERVER["QUERY_STRING"] = str_replace("+", "%2B", $_SERVER["QUERY_STRING"]);
}

parse_str($_SERVER["QUERY_STRING"]);
if(isset($pdbid)) $pdbid = strtoupper($pdbid);

//title
$title = "MolView";
if(isset($q)) $title = ucfirst($q);
else if(isset($pdbid)) $title = $pdbid;
else if(isset($codid)) $title = "COD: ".$codid;

//description
$description = "MolView is a web application for drawing, searching and viewing chemical structures on desktops, tablets and smartphones.";
if(isset($q) || isset($smiles) || isset($cid)) $description = "View this structure at http://molview.org";
else if(isset($pdbid)) $description = "View this protein at http://molview.org";

//same as
$same_as = "http://molview.hermanbergwerf.com";
if(isset($q)) $same_as = "//en.wikipedia.org/wiki/".$q;
else if(isset($cid)) $same_as = "//www.rcsb.org/pdb/explore/explore.do?structureId=".$pdbid;
else if(isset($pdbid)) $same_as = "https://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=".$cid;

//image
$image_url = "http://molview.org/src/src/img/image.png";
$pubchem_query = null;
$pubchem_value = null;
if(isset($q))			{ $pubchem_query = "name"; $pubchem_value = $q; }
else if(isset($smiles))	{ $pubchem_query = "smiles"; $pubchem_value = $smiles; }
else if(isset($cid))	{ $pubchem_query = "cid"; $pubchem_value = $cid; }
else if(isset($pdbid)) $image_url = "http://www.rcsb.org/pdb/images/".$pdbid."_bio_r_500.jpg";

//layout
$contentClass = "vsplit";
if(isset($layout)) $contentClass = $layout;
else if(isset($pdbid) || isset($codid)) $contentClass = "model";

//data via PubChem
if(isset($pubchem_query))
{
	$json = file_get_contents("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/".$pubchem_query."/description/json?".$pubchem_query.'='.urlencode($pubchem_value));
	$data = json_decode($json);
	
	if(isset($data -> InformationList -> Information[0] -> Title))
		$title = ucfirst($data -> InformationList -> Information[0] -> Title);
	if(isset($data -> InformationList -> Information[0] -> Description))
		$description = $data -> InformationList -> Information[0] -> Description;
}

//data via RCSB
else if(isset($pdbid))
{
	$xml = file_get_contents("http://www.rcsb.org/pdb/rest/customReport?pdbids=".$pdbid."&customReportColumns=structureId,structureTitle");
	$data = new SimpleXMLElement($xml);
	
	if(isset($data -> {"record"} -> {"dimStructure.structureId"}))
		$title = $data -> {"record"} -> {"dimStructure.structureId"};
	if(isset($data -> {"record"} -> {"dimStructure.structureTitle"}))
		$description = $data -> {"record"} -> {"dimStructure.structureTitle"};
}

//data via COD
else if(isset($codid))
{
	$cod = new mysqli("www.crystallography.net", "cod_reader", "", "cod");
	if($cod -> connect_errno == 0)
	{
		$query = 'SELECT mineral,commonname,chemname,title FROM data WHERE file = '.$codid;
		if($result = $cod -> query($query))
		{
			while($row = $result -> fetch_row())//print JSON
			{				
				$title = isset($row[0]) ? $row[0] : (isset($row[1]) ? $row[1] : (isset($row[2]) ? $row[2] : $title));
				$description = $row[3];
			}
		}
		
		$cod -> close();
	}
}
?>

<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Thing">
	<!--
	MolView v2.0 (http://molview.org)
	Copyright (c) 2014, Herman Bergwerf
	ALL RIGHTS RESERVED
		
	Query parameters:
	- q = search query (auto fast search)
	- smiles = resolve SMILES string
	- cid = load CID
	- pdbid = load PDBID
	- codid = load CIF from COD
	- mode = balls || stick || vdw || wireframe || line
	-->
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="mobile-web-app-capable" content="yes">
		
		<meta name="viewport" content="width=device-width, user-scalable=no" />
		
		<?php echo "<title>".$title."</title>"; ?>
		
		<link rel="icon" sizes="196x196" href="../src/img/icon/196.png">
		<link rel="icon" sizes="128x128" href="../src/img/icon/128.png">
		<link rel="apple-touch-icon" href="../src/img/icon/48.png">
		<link rel="apple-touch-icon" sizes="76x76" href="../src/img/icon/76.png">
		<link rel="apple-touch-icon" sizes="120x120" href="../src/img/icon/120.png">
		<link rel="apple-touch-icon" sizes="152x152" href="../src/img/icon/152.png">
		
		<link rel="icon" href="../src/img/icon/32.png" />
		
		<meta name="author" content="Herman Bergwerf" />
		<meta name="keywords" content="herman,bergwerf,free,molecule,chemistry,protein,application,smartphone,tablet,chrome os,properties,sketch,draw,edit,view" />
		
		<!-- Open Graph + Schema.org + Twitter Card -->
		<meta name="twitter:card" content="summary">
		<meta name="twitter:site" content="@molview">
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="MolView" />
		<?php
			echo '<meta name="description" content="'.$description.'" />';
			
			echo '<meta name="twitter:title" property="og:title" content="'.$title.'" />';
			echo '<meta itemprop="name" content="'.$title.'" />';
			
			echo '<meta name="twitter:description" property="og:description" content="'.$description.'" />';
			echo '<meta itemprop="description" content="'.$description.'" />';
			
			echo '<meta itemprop="sameAs" content="'.$same_as.'" />';
			
			if(isset($pubchem_query))
			{
				if($pubchem_query == "smiles")
				{
					echo '<meta name="twitter:image:src" property="og:image" content="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/png?smiles='.urlencode($pubchem_value).'&record_type=2d" />';
					echo '<meta itemprop="image" content="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/png?smiles='.urlencode($pubchem_value).'record_type=2d" />';
				}
				else
				{
					echo '<meta name="twitter:image:src" property="og:image" content="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/'.$pubchem_query.'/'.$pubchem_value.'/png?record_type=2d" />';
					echo '<meta itemprop="image" content="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/'.$pubchem_query.'/'.$pubchem_value.'/png?record_type=2d" />';
				}
			}
			else
			{
				echo '<meta name="twitter:image:src" itemprop="image" property="og:image" content="'.$image_url.'" />';
				echo '<meta itemprop="image" content="'.$image_url.'" />';
			}
		?>
		
		<!-- CSS -->
		<link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" />
		
		<link type="text/css" rel="stylesheet" href="../src/css/form.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="../src/css/global.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="../src/css/model.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="../src/css/messages.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="../src/css/embed.css" media="screen" />
		
		<!-- JSmol -->
		<script type="text/javascript" src="../src/js/lib/JSmol.min.js"></script>
		
		<!-- Misc -->
		<script type="text/javascript" src="../src/js/lib/jquery-1.11.0.min.js"></script>
		<script type="text/javascript" src="../src/js/lib/Detector.js"></script>
		<script type="text/javascript" src="../src/js/lib/jMouseWheel.js"></script>
		<script type="text/javascript" src="../src/js/lib/Polyfill.js"></script>
		
		<!-- GLmol -->
		<script type="text/javascript" src="../src/js/lib/Three49custom.js"></script>
		<script type="text/javascript" src="../src/js/lib/GLmol.js"></script>
		
		<!-- ChemDoodle -->
		<script type="text/javascript" src="../src/js/lib/ChemDoodleWeb.js"></script>
		
		<!-- JS Source -->
		<script type="text/javascript" src='../src/js/Utility.js'></script>
		<script type="text/javascript" src='../src/js/Variables.js'></script>
		<script type="text/javascript" src='../src/js/Progress.js'></script>
		<script type="text/javascript" src='../src/js/Messages.Embed.js'></script>
		<script type="text/javascript" src='../src/js/Model.js'></script>
		<script type="text/javascript" src='../src/js/Request.js'></script>
		<script type="text/javascript" src='../src/js/Loader.Embed.js'></script>
		<script type="text/javascript" src='../src/js/MolView.Embed.js'></script>
		
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
	<body id="model">
		<input id="search-input" style="display: none" />
		
		<div id="chemdoodle" class="render-engine full-cover" style="display: none;">
			<canvas id="chemdoodle-canvas"></canvas>
		</div>
		<div id="jsmol" class="render-engine full-cover" style="display: none;"></div>
		<div id="glmol" class="render-engine full-cover" style="display: none;"></div>
		
		<div id="model-messages" class="layer full-cover dark-glass">
			<div class="center">
				<div class="message">
					<img class="process" src="../src/img/loading-white.svg" alt="" />
					<img class="alert" src="../src/img/alert-white.svg" alt="" />
					<p class="text"></p>
				</div>
			</div>
		</div>
	</body>
</html>

