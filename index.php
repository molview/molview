<?php
include("utility.php");
error_reporting(0);

if(is_below_IE10())
{
	header('Location: nosupport');
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
$image_url = "http://molview.org/src/img/image.png";
$pubchem_query = null;
$pubchem_value = null;
if(isset($q))			{ $pubchem_query = "name"; $pubchem_value = $q; }
else if(isset($smiles))	{ $pubchem_query = "smiles"; $pubchem_value = $smiles; }
else if(isset($cid))	{ $pubchem_query = "cid"; $pubchem_value = $cid; }
else if(isset($pdbid)) $image_url = "http://www.rcsb.org/pdb/images/".$pdbid."_bio_r_500.jpg";

//layout
$contentClass = "vsplit";
if(isset($layout)) $contentClass = $layout;
else if(isset($pdbid)) $contentClass = "model";

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
	MolView v2.2.0 (http://molview.org)
	Copyright (c) 2014, Herman Bergwerf
	ALL RIGHTS RESERVED
	
	Query parameters:
	- q = search query
	- search = fast || pubchem || proteins || crystals
	- smiles = resolve SMILES string
	- cid = load CID
	- pdbid = load PDBID
	- codid = load CIF from COD
	- layout = model || sketcher || hsplit || vsplit
	- menu = on || off
	- dialog = about || help || share || embed
	- mode = balls || stick || vdw || wireframe || line
	-->
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="mobile-web-app-capable" content="yes">
		
		<meta name="viewport" content="width=device-width, user-scalable=no" />
		
		<?php echo "<title>".$title."</title>"; ?>
		
		<link rel="icon" sizes="196x196" href="src/img/icon/196.png">
		<link rel="icon" sizes="128x128" href="src/img/icon/128.png">
		<link rel="apple-touch-icon" href="src/img/icon/48.png">
		<link rel="apple-touch-icon" sizes="76x76" href="src/img/icon/76.png">
		<link rel="apple-touch-icon" sizes="120x120" href="src/img/icon/120.png">
		<link rel="apple-touch-icon" sizes="152x152" href="src/img/icon/152.png">
		
		<link rel="icon" href="src/img/icon/32.png" />
		
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
		<link type="text/css" rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css">
		<link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" />
		
		<link type="text/css" rel="stylesheet" href="src/css/form.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/global.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/layout.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/menu.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/menu-theme.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/sketcher.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/model.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/search.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/messages.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/progress.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/swipeable.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/dialogs.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/alert.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/help.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/share.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/periodictable.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="src/css/chemicaldata.css" media="screen" />
		
		<!-- JS -->
		<script type="text/javascript" src="src/js/lib/JSmol.min.js"></script>
		<script type="text/javascript" src="src/js/lib/jquery-1.11.0.min.js"></script>
		<script type="text/javascript" src="src/js/lib/jquery.hotkeys.js"></script>
		<script type="text/javascript" src="src/js/lib/Detector.js"></script>
		<script type="text/javascript" src="src/js/lib/jMouseWheel.js"></script>
		<script type="text/javascript" src="src/js/lib/Polyfill.js"></script>
        <script type="text/javascript" src="src/js/m2s/prototype.js"></script>
        <script type="text/javascript" src="src/js/m2s/util/common.js"></script>
        <script type="text/javascript" src="src/js/m2s/util/vec2.js"></script>
        <script type="text/javascript" src="src/js/m2s/util/set.js"></script>
        <script type="text/javascript" src="src/js/m2s/util/map.js"></script>
        <script type="text/javascript" src="src/js/m2s/util/pool.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/element.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/struct.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/molfile.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/sgroup.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/struct_valence.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/dfs.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/cis_trans.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/stereocenters.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/smiles.js"></script>
        <script type="text/javascript" src="src/js/m2s/chem/inchi.js"></script>
		<script type="text/javascript" src="src/js/moledit/Constants.js"></script>
		<script type="text/javascript" src="src/js/moledit/Objects.js"></script>
		<script type="text/javascript" src="src/js/moledit/Chemical.js"></script>
		<script type="text/javascript" src="src/js/moledit/ChemicalView.js"></script>
		<script type="text/javascript" src="src/js/moledit/ChemicalView_core.js"></script>
		<script type="text/javascript" src="src/js/moledit/ChemicalView_events.js"></script>
		<script type="text/javascript" src="src/js/moledit/Utility.js"></script>
		<script type="text/javascript" src="src/js/lib/Three49custom.js"></script>
		<script type="text/javascript" src="src/js/lib/GLmol.js"></script>
		<script type="text/javascript" src="src/js/lib/ChemDoodleWeb.js"></script>
		<script type="text/javascript" src="src/js/lib/Blob.js"></script>
		<script type="text/javascript" src="src/js/lib/FileSaver.js"></script>
		<script type="text/javascript" src="src/js/lib/PeriodicTable.js"></script>
		<script type="text/javascript" src="src/js/Utility.js"></script>
		<script type="text/javascript" src="src/js/Variables.js"></script>
		<script type="text/javascript" src="src/js/History.js"></script>
		<script type="text/javascript" src="src/js/Progress.js"></script>
		<script type="text/javascript" src="src/js/Messages.js"></script>
		<script type="text/javascript" src="src/js/Sketcher.js"></script>
		<script type="text/javascript" src="src/js/Model.js"></script>
		<script type="text/javascript" src="src/js/Request.js"></script>
		<script type="text/javascript" src="src/js/Loader.js"></script>
		<script type="text/javascript" src="src/js/Actions.js"></script>
		<script type="text/javascript" src="src/js/Share.js"></script>
		<script type="text/javascript" src="src/js/Link.js"></script>
		<script type="text/javascript" src="src/js/ChemicalData.js"></script>
		<script type="text/javascript" src="src/js/MolView.js"></script>
		
		<!-- <script type="text/javascript" src="build/molview.min.js"></script> -->
		
		<!-- Custom styling -->
		<script type="text/javascript">
			if(isTouchDevice())
			{
				document.write('<link type="text/css" rel="stylesheet" href="src/css/menu-touch.css" media="screen" />');
				document.write('<link type="text/css" rel="stylesheet" href="src/css/active.css" media="screen" />');
			}
			else
			{
				//document.write('<link type="text/css" rel="stylesheet" href="src/css/scrollbar.css" media="screen" />');
				document.write('<link type="text/css" rel="stylesheet" href="src/css/menu-nice.css" media="screen" />');
				document.write('<link type="text/css" rel="stylesheet" href="src/css/smooth.css" media="screen" />');
				document.write('<link type="text/css" rel="stylesheet" href="src/css/hover.css" media="screen" />');
				document.write('<link type="text/css" rel="stylesheet" href="src/css/active.css" media="screen" />');
			}
		</script>
		
		<!-- Google Analytics -->
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-49088779-3', 'molview.org');
			ga('send', 'pageview');
		</script>
	</head>
	<body <?php if(isset($menu)) if($menu == "off") echo 'class="no-menu"'; ?>>
		<div id="progress" class="no-select progress-bar">
			<div class="part" style="width: 0; opacity: 0;"></div>
		</div>
		<div id="menu" class="no-select menu swipeable">
			<div class="inner">
				<ul id="main-menu" class="brick menu-bar">
					<li class="dropdown">
						<a class="dropdown-toggle brand">MolView<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li class="header">Layout</li>
							<li id="layout-menu">
								<a id="window-model" <?php if($contentClass == "model") echo 'class="selected"' ?>></a>
								<a id="window-hsplit" <?php if($contentClass == "hsplit") echo 'class="selected"' ?>></a>
								<a id="window-vsplit" <?php if($contentClass == "vsplit") echo 'class="selected"' ?>></a>
								<a id="window-sketcher" <?php if($contentClass == "sketcher") echo 'class="selected"' ?>></a>
							</li>
							<li class="header">Information</li>
							<li><a id="mv-help">Help</a></li>
							<li><a id="mv-about">About</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle">Tools<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li class="header">Link</li>
							<li><a id="mv-share">Share</a></li>
							<li><a id="mv-embed">Embed</a></li>
							<li class="header">Export</li>
							<li><a id="export-2d">Structural formula image</a></li>
							<li><a id="export-3d">3D model image</a></li>
							<li><a id="save-local-3d">file</a></li>
							<li class="header">Chemical data</li>
							<li><a id="data-properties">Properties</a></li>
							<li><a id="data-spectra">Spectroscopy</a></li>
							<li class="header">Advanced search</li>
							<li><a id="search-similarity">Similarity</a></li>
							<li><a id="search-substructure">Substructure</a></li>
							<li><a id="search-superstructure">Superstructure</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle">Model<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a id="model-reset">Reset</a></li>
							<li class="header">Representation</li>
							<li><a id="model-balls" class="r-mode checked">Ball and Stick</a></li>
							<li><a id="model-stick" class="r-mode">Stick</a></li>
							<li><a id="model-vdw" class="r-mode">van der Waals Spheres</a></li>
							<li><a id="model-wireframe" class="r-mode">Wireframe</a></li>
							<li><a id="model-line" class="r-mode">Line</a></li>
							<li class="header">Engine</li>
							<li><a id="engine-glmol" class="checked">GLmol (fast)</a></li>
							<li><a id="engine-jmol">Jmol (extensive)</a></li>
							<li><a id="engine-cdw">ChemDoodle</a></li>
							<li class="header">Crystallography</li>
							<li><a id="cif-unit-cell">Load unit cell</a></li>
							<li><a id="cif-2x2x2-cell">Load 2x2x2 supercell</a></li>
							<li><a id="cif-1x3x3-cell">Load 1x3x3 supercell</a></li>
						</ul>
					</li>
					<li id="glmol-menu" class="dropdown" style="display: none;">
						<a class="dropdown-toggle">GLmol<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a id="bio-assembly">Biological assembly</a></li>
							<li class="header">Chain representation</li>
							<li><a id="glmol-lucent" class="checked">Ribbon</a></li>
							<li><a id="glmol-lucent">Strand</a></li>
							<li><a id="glmol-lucent">Cylinder and plate</a></li>
							<li><a id="glmol-lucent">C-alpha trace</a></li>
							<li><a id="glmol-lucent">B-factor tube</a></li>
							<li><a id="glmol-lucent">Bonds (everything)</a></li>
							<li class="header">Chain coloring</li>
							<li><a id="mep-lucent" class="checked">Secondary structure</a></li>
							<li><a id="mep-lucent">Spectrum</a></li>
							<li><a id="mep-lucent">Chain</a></li>
							<li><a id="mep-lucent">B-factor</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle">Jmol<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a id="jmol-clean" class="jmol-script">Clean</a></li>
							<li class="header">Calculations</li>
							<li><a id="mep-lucent" class="jmol-script">MEP surface lucent</a></li>
							<li><a id="mep-opaque" class="jmol-script">MEP surface opaque</a></li>
							<!-- <li><a id="vdw-surface" class="jmol-script">van der Waals surface</a></li> -->
							<li><a id="jmol-charge" class="jmol-script">Charge</a></li>
							<li><a id="bond-dipoles" class="jmol-script">Bond dipoles</a></li>
							<li><a id="net-dipole" class="jmol-script">Overall dipole</a></li>
							<li><a id="jmol-minimize" class="jmol-script">Energy minimization</a></li>
							<li class="header">Measurement</li>
							<li><a id="measure-distance" class="jmol-script jmol-picking">Distance (2 atoms)</a></li>
							<li><a id="measure-angle" class="jmol-script jmol-picking">Angle (3 atoms)</a></li>
							<li><a id="measure-torsion" class="jmol-script jmol-picking">Torsion (4 atoms)</a></li>
							<li class="header">Render mode</li>
							<li><a id="jmol-render-all" class="jmol-rnd">Everything</a></li>
							<li><a id="jmol-render-normal" class="jmol-rnd checked">Normal</a></li>
							<li><a id="jmol-render-minimal" class="jmol-rnd">Minimal</a></li>
						</ul>
					</li>
				</ul>
				<form id="search" class="brick input-append" action="javascript:void(0)">
					<div id="search-input-wrap">
						<input id="search-input" name="q" type="text"
							placeholder="Find structures"
							autocomplete="off" spellcheck="false" />
					</div>
					<div class="btn-group">
						<button id="fast-search" class="btn btn-white" type="submit" title="Fast search"><i class="fa fa-search"></i></button>
						<button id="pubchem-search" class="btn btn-white" type="button" title="Search via PubChem">PubChem</button>
						<button id="proteins-search" class="btn btn-white" type="button" title="Search for proteins">Proteins</button>
						<button id="crystals-search" class="btn btn-white" type="button" title="Search for crystals">Crystals</button>
						<button id="show-search-results" class="btn btn-white last" type="button" title="Show results" style="display: block;"><i class="fa fa-eye"></i></button>
						<button id="hide-search-results" class="btn btn-white last" type="button" title="Hide results" style="display: none;"><i class="fa fa-eye-slash"></i></button>
					</div>
				</form>
			</div>
		</div>
		<div id="content" <?php echo 'class="'.$contentClass.'"' ?>>
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
				
				if(Detector.webgl) $("#glmol-menu").show();
				
				MolView.layout = <?php echo '"'.$contentClass.'"'; ?>;
				MolView.query = getQuery();
				if($.isEmptyObject(MolView.query)) $("#content").addClass("start-messages");
				if($(window).height() > $(window).width()
					&& !MolView.query.layout
					&& MolView.layout != "model") Actions.window_hsplit();
			</script>
			
			<div id="sketcher">
				<div id="moledit" class="sketcher">
					<div id="chem-tools" class="toolbar vertical swipeable">
						<div class="inner">
							<div id="me-single" class="button mode selected" title="Single bond"></div>
							<div id="me-double" class="button mode" title="Double bond"></div>
							<div id="me-triple" class="button mode" title="Triple bond"></div>
							<div id="me-updown" class="button mode" title="Up/Down bond"></div>
							<div class="separator"></div>
							<div id="me-frag-0" class="button mode" title="Benzene"></div>
							<div id="me-frag-1" class="button mode" title="Cyclopropane"></div>
							<div id="me-frag-2" class="button mode" title="Cyclobutane"></div>
							<div id="me-frag-3" class="button mode" title="Cyclopentane"></div>
							<div id="me-frag-4" class="button mode" title="Cyclohexane"></div>
							<div id="me-frag-5" class="button mode" title="Cycloheptane"></div>
							<div class="separator"></div>
							<div id="me-chain" class="button mode" title="Click and drag to draw a chain of carbon atoms"></div>
							<div id="me-charge-add" class="button mode" title="Charge +">e<sup>+</sup></div>
							<div id="me-charge-sub" class="button mode" title="Charge -">e<sup>-</sup></div>
						</div>
					</div>
					<div id="edit-tools" class="toolbar horizontal swipeable">
						<div class="inner">
							<div id="me-new" class="button" title="Clear all"></div>
							<div id="me-eraser" class="button mode" title="Erase"></div>
							<div id="me-move" class="button mode" title="Move"></div>
							<div class="separator"></div>
							<div id="me-undo" class="button disabled" title="Undo"></div>
							<div id="me-redo" class="button disabled" title="Redo"></div>
							<div class="separator"></div>
							<div id="me-rect" class="button mode custom selected" title="Rectangle selection"></div>
							<div id="me-lasso" class="button mode custom" title="Lasso selection"></div>
							<div class="separator"></div>
							<div id="me-deselect" class="button" title="Clear selection"></div>
							<div id="me-center" class="button" title="Center structure"></div>
							<div id="me-clean" class="button" title="Cleanup structure"></div>
							<div class="separator"></div>
							<div id="resolve" class="button" title="Update 3D view">2D to 3D</div>
						</div>
					</div>
					<div id="elem-tools" class="toolbar vertical swipeable">
						<div class="inner">
							<div id="me-atom-h" class="button element mode" title="Hydrogen">H</div>
							<div id="me-atom-c" class="button element mode" title="Carbon">C</div>
							<div id="me-atom-n" class="button element mode" title="Nitrogen">N</div>
							<div id="me-atom-o" class="button element mode" title="Oxygen">O</div>
							<div id="me-atom-s" class="button element mode" title="Sulfur">S</div>
							<div id="me-atom-p" class="button element mode" title="Phosphorus">P</div>
							<div id="me-elements" class="button element" title="Periodic Table">...</div>
							<div class="separator"></div>
							<div id="me-info" class="button" title="Information"></div>
						</div>
					</div>
					<div id="moledit-area" class="edit-area">
						<canvas id="moledit-canvas"></canvas>
					</div>
				</div>				
				<div id="sketcher-messages" class="layer full-cover dark-glass">
					<div class="center">
						<div class="message progress">
							<img class="process" src="src/img/loading-white.svg" alt="" />
							<img class="alert" src="src/img/alert-white.svg" alt="" />
							<p class="text"></p>
							<button class="btn ok btn-large btn-primary">OK</button>
						</div>
					</div>
				</div>
			</div>
			<div id="model">
				<div id="chemdoodle" class="render-engine full-cover" style="display: none;">
					<canvas id="chemdoodle-canvas"></canvas>
				</div>
				<div id="jsmol" class="render-engine full-cover" style="display: none;"></div>
				<div id="glmol" class="render-engine full-cover" style="display: none;"></div>
				
				<div id="model-messages" class="layer full-cover dark-glass">
					<div class="center">
						<div class="message">
							<img class="process" src="src/img/loading-white.svg" alt="" />
							<img class="alert" src="src/img/alert-white.svg" alt="" />
							<p class="text"></p>
							<button class="btn ok btn-large btn-primary">OK</button>
						</div>
					</div>
				</div>
				
				<div id="start-messages" class="layer full-cover dark-glass">
					<div class="center">
						<div class="message">
							<p class="text">
                                Keep updated!<br/><a class="link" target="_blank" title="Youtube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a>, <a class="link" target="_blank" title="Facebook" href="https://www.facebook.com/molview" rel="publisher">Facebook</a>, <a class="link" target="_blank" title="Google+" href="https://plus.google.com/102377643104393981977" rel="publisher">Google+</a>, <a class="link" target="_blank" title="Twitter" href="https://twitter.com/molview">Twitter</a>
							</p>
							<button id="start-help" class="btn btn-primary btn-large">Getting started</button>
							<p class="text">We need your help to keep this up!<br/>If you think MolView is useful, please support development and maintenance of MolView.</p>
							<a class="btn btn-primary btn-large" title="Support MolView!" target="_blank" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=88QDZTWLV9GXG">PayPal donation&nbsp;&nbsp;<i class="fa fa-chevron-right"></i></a>
						</div>
					</div>
				</div>
				<div id="start-messages-close" class="close-btn"></div>
			</div>
			<div id="content-messages" class="layer full-cover dark-glass">
				<div class="center">
					<div class="message">
						<img class="process" src="src/img/loading-white.svg" alt="" />
						<img class="alert" src="src/img/alert-white.svg" alt="" />
						<p class="text"></p>
						<button class="btn ok btn-large btn-primary">OK</button>
					</div>
				</div>
			</div>
			<div id="search-results" class="search-results full-cover dark-glass" style="display: none;">
				<div class="container"></div>
				<div id="load-more-compounds" class="more" style="display: none;"></div>
				<div id="load-more-proteins" class="more" style="display: none;"></div>
				<div id="load-more-crystals" class="more" style="display: none;"></div>
			</div>
		</div>
		<div id="window-layer" class="window-layer" style="display: none;">
			<div class="dialog" id="about-dialog" style="display: none;">
				<h2>About</h2>
				<p>MolView is a web application for drawing, searching and viewing chemical structures.<br>
				This web application is built upon the JavaScript libraries and online services listed below. I also drew inspration from the <a class="link" href="http://chemagic.com/JSmolVMK2.htm" target="_blank" title="Virtual Model Kit">Virtual Model Kit</a>, a similar webapplication.</p>
				<ul>
					<li>JavaScript libraries
						<ul>
							<li><a class="link" href="https://www.molsoft.com/moledit.html" target="_blank" title="MolEdit">MolEdit v1.2.4:</a> sketcher (modified with permission from <a class="link" href="https://www.molsoft.com" target="_blank" title="MolSoft">MolSoft</a>)</li>
							<li><a class="link" href="http://ggasoftware.com/opensource/ketcher" target="_blank" title="Ketcher">Ketcher:</a> SMILES conversion (modified under GNU Affero GPL)</li>
							<li><a class="link" href="http://webglmol.sourceforge.jp/index-en.html" target="_blank" title="GLmol">GLmol v0.47:</a> primary 3D rendering (modified under MIT licence)</li>
							<li><a class="link" href="http://sourceforge.net/projects/jsmol/" target="_blank" title="JSmol">JSmol:</a> 3D rendering (Jmol v14.0.11)</li>
							<li><a class="link" href="http://web.chemdoodle.com/" target="_blank" title="ChemDoodle Web">ChemDoodle Web Components v6.0.1:</a> 3D rendering and spectrum display</li>
						</ul>
					</li>
					<li>Databases/REST API's
						<ul>
							<li><a class="link" href="http://cactus.nci.nih.gov/chemical/structure" target="_blank" title="NCI/CADD Chemical Identifier Resolver API">NCI/CADD Chemical Identifier Resolver</a></li>
							<li><a class="link" href="http://www.rcsb.org/pdb/software/rest.do" target="_blank" title="RCSB Protein Databank API">RCSB Protein Databank</a></li>
							<li><a class="link" href="https://pubchem.ncbi.nlm.nih.gov/pug_rest/PUG_REST.html" target="_blank" title="The PubChem Project API">The PubChem Project</a></li>
							<li><a class="link" href="http://www.crystallography.net/" target="_blank" title="COD">Crystallography Open Database</a></li>
							<li><a class="link" href="http://www.nmrdb.org/" target="_blank" title="NMRdb.org">NMR Database</a></li>
							<li><a class="link" href="http://webbook.nist.gov/chemistry" target="_blank" title="NIST Chemistry WebBook Reference">NIST Chemistry WebBook</a></li>
							<li><a class="link" href="http://mymemory.translated.net/doc/spec.php" target="_blank" title="MyMemory API">MyMemory translation API</a></li>
						</ul>
					</li>
				</ul>
				<p style="text-align: center;">
					MolView v2.2.0
					&nbsp;|&nbsp;
					&copy; 2014 <a class="link" target="_blank" rel="author" title="Personal website" href="http://hermanbergwerf.com">Herman Bergwerf</a>
					&nbsp;|&nbsp;
					<a class="link" href="CHANGELOG.md" target="_blank">Changelog</a>
					<br/>
					<a class="link" target="_blank" title="Chrome App" href="https://chrome.google.com/webstore/detail/molview/nogcacamdkipgkfpfiakaoamdnihinnm">Chrome Web Store</a>
					&nbsp;|&nbsp;
					<a class="link" target="_blank" title="Youtube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a>
					&nbsp;|&nbsp;
					<a class="link" target="_blank" title="Facebook" href="https://www.facebook.com/molview" rel="publisher">Facebook</a>
					&nbsp;|&nbsp;
					<a class="link" target="_blank" title="Google+" href="https://plus.google.com/102377643104393981977" rel="publisher">+MolView</a>
					&nbsp;|&nbsp;
					<a class="link" target="_blank" title="Twitter" href="https://twitter.com/molview">@molview</a>
					&nbsp;|&nbsp;
					<a class="link" target="_blank" title="Mail" href="mailto:info@molview.org">info@molview.org</a>
				</p>
				<div id="disclaimer">DISCLAIMER: MolView does not warrant that the data contained in its website is complete and correct and shall not be liable whatsoever for any damages incurred as a result of its use.</div>
				<div class="footer">
					<button class="btn close btn-primary pull-right">OK</button>
				</div>
			</div>
			<div class="dialog styled-headings" id="help-dialog" style="display: none;">
				<h2>Help</h2>
				<script type="text/javascript">
				if(isTouchDevice())
				{
					document.write('<div class="alert-bar alert-danger"><b>Important!</b> you can slide toolbars which don\'t fit in you screen.</div>');
					document.write('<div class="alert-bar alert-info"><b>Hint:</b> on several mobile browsers including <b>Chrome</b> and <b>Safari</b>, you can add MolView to your homescreen.</div>');
				}
				</script>
				<a class="link" href="docs/MolView-v2.2-manual-revision-1.pdf" target="_blank">Download PDF version</a></p>
				<p>Click one of the subjects below to learn more. You can also watch some videos on <a class="link" target="_blank" title="Youtube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a> to get started.</p>
				<h3>Subjects</h3>
				<div class="expandable">
					<div class="title"><i class="fa"></i><b>Drawing structural formulas</b></div>
					<div class="content">
						<p>You can draw structural formulas using the sketching component.</p>
						<h4>Top toolbar</h4>
						<p>The top toolbar contains all general editing tools. These tools include a clear all tool, an erase tool, a move atoms tool, an undo and redo tool, two selection tools, a clear selection tool, a center structure tool, a cleanup tool and a resolve tool. The last one converts the structural formula to a 3D molecule displayed in the model window.</p>
						<h4>Left toolbar</h4>
						<p>In the left toolbar, you can select a tool you want to use in order to modify or extend the structural formula. In order to draw a carbon chain using the chain tool, you have to click a start point or atom and drag a chain.</p>
						<h4>Right toolbar</h4>
						<p>The right toolbar contains some common elements and a periodic table tool in case you want to use another element. Note that you can only replace existing atoms. So in order to add an atom, you frist have to add a new bond using the tools from the left toolbar.</p>
					</div>
				</div>
				<div class="expandable">
					<div class="title"><i class="fa"></i><b>Finding structures</b></div>
					<div class="content">
						<p>You can load structures from large databases like PubChem via the search field located on the right side of the menubar. Just type whatever and enter or click the kind of structures you want to find:</p>
						<ul>
							<li><b>Compounds:</b> small molecules</li>
							<li><b>Proteins:</b> biopolymers</li>
							<li><b>Crystals:</b> crystal structures</li>
						</ul>
						<p>It's recommended to use only one or two words for crystal structures search due to database limitations.</p>
						<p>You can show or hide search results using the leftmost button. Note that proteins search is absent on mobile browsers which do not support WebGL (because they cannot display proteins fast enough)</p>
					</div>
				</div>
				<div class="expandable">
					<div class="title"><i class="fa"></i><b>3D model</b></div>
					<div class="content">
						<p>You can find the general 3D <i>Model</i> menu in the menubar.</p>
						<h4>Reset</h4>
						<p>This function sets the model position, zoom and rotation back to default.</p>
						<h4>Representation</h4>
						<p>You can choose from a list of different molecule representations including; ball and stick, stick, van der Waals spheres, wireframe and lines. Proteins are automatically drawn using ribbons.</p>
						<h4>Engine</h4>
						<p>You can choose from three different render engines. MolView uses GLmol, Jmol and ChemDoodle Web as render engines. MolView automatically switches to:</p>
						<ol>
							<li>Jmol if your browser doesn't support WebGL</li>
							<li>Jmol if you execute functions from the Jmol menu</li>
							<li>ChemDoodle if you load a crystal structure</li>
						</ol>
						<p>You might want to switch back to GLmol after case 2 and 3.</p>
						<p>Note that proteins are drawn slightly different in each engine. ChemDoodle Web provides the most sophisticated protein display. You should, however, avoid using ChemDoodle Web for large proteins.</p>
						<h4>Crystallography</h4>
						<p>This submenu contains functions to load an array of crystal 'boxes'.</p>
						<ul>
							<li><b>1x1x1</b> Unit cell <i>(default)</i></li>
							<li><b>2x2x2</b> supercel</li>
							<li><b>3x3x1</b> supercel</li>
						</ul>
					</div>
				</div>
				<div class="expandable">
					<div class="title"><i class="fa"></i><b>Advanced tools</b></div>
					<div class="content">
						<p>You can find the <i>Tools</i> menu in the menubar. This menu contains several utility functions.</p>
						<h4>Link</h4>
						<p>You can link to a specific compound, protein or crystal using URL parameters. This menu gives you two options:</p>
						<ul>
							<li><b>Share:</b> use this option if you want to share the current MolView content including chemical structure, layout and molecule representation.</li>
							<li><b>Embed:</b> use this option if you want to embed the current model into your website. To add the 3D view with the current structure to your website, you have to copy the given HTML code into your website.</li>
						</ul>
						<p>If you only want to link to the current chemical structure, you can also copy the URL from the adress bar. (make sure the URL links to the right structure by reloading the page)</p>
						<h4>Export</h4>
						<p>Export options in the Export menu:</p>
						<ul>
							<li><b>Structural formula image:</b> PNG snapshot from sketcher</li>
							<li><b>3D model image:</b> PNG snapshot from model window</li>
							<li><b>MOL file:</b> exports a MDL Molfile from the 3D model<br/><i>(displayed if the 3D model is a common molecule)</i></li>
							<li><b>PDB file:</b> exports a Protein Data Bank file from the 3D model<br/><i>(displayed if the 3D model is a protein)</i></li>
							<li><b>CIF file:</b> exports a Crystallographic Information File from the 3D model<br/><i>(displayed if the 3D model is a crystal structure)</i></li>
						</ul>
						<h4>Properties</h4>
						<p>Depending on the situation, this function gives you more information about the current molecule.</p>
						<ul>
							<li><b>If the model is a protein:</b> hotlink to RCSB Protein Data Bank page</li>
							<li><b>If the model is a crystal structure:</b> hotlink to Crystallography Open Database page</li>
							<li><b>Else:</b> shows a dialog with a number of properties for the structural formula from the sketcher</li>
						</ul>
						<h4>Spectroscopy</h4>
						<p>This method shows a dialog where you can view spectra related to the structural formula from the sketcher. More details are covered in chapter 5.</p>
						<h4>Advanced search</h4>
						<p>You can perform three types of advanced search based on the structural formula from the sketcher.</p>
						<ol>
							<li><b>Similarity search:</b> search for compounds with a similar structural formula</li>
							<li><b>Substructure search:</b> search for compounds with the current structure as subset</li>
							<li><b>Superstructure search:</b> search for compounds with the current structure as superset</li>
						</ol>
					</div>
				</div>
				<div class="expandable">
					<div class="title"><i class="fa"></i><b>Spectroscopy</b></div>
					<div class="content">
						<p>The Spectroscopy menu item is located under <i>Model > Chemical</i> data in the menubar. This menuitem shows the spectroscopy dialog where you can choose from a number of spectra (if available)</p>
						<ol>
							<li>H1-NMR prediction</li>
							<li>Mass spectrum</li>
							<li>IR spectrum</li>
						</ol>
						<h4>Export data</h4>
						<p>The spectroscopy dialog allows you to export two kind of files from the current spectrum:</p>
						<ul>
							<li><b>PNG image:</b> snapshot from interactive spectrum</li>
							<li><b>JCAMP file:</b> JCAMP-DX file of the current spectrum</li>
						</ul>
					</div>
				</div>
				<div class="expandable">
					<div class="title"><i class="fa"></i><b>Advanced Jmol operations</b></div>
					<div class="content">
						<p>Jmol provides several advanced functions. Some of these can be accessed via the Jmol menu in the menubar.</p>
						<h4>Clear</h4>
						<p>Clears all executed calculations and measurements.</p>
						<h4>Calculations</h4>
						<p>You can perform the following Jmol calculations in Jmol:</p>
						<ul>
							<li><b>MEP surface lucent/opaque:</b> calculates and projects molecular electrostatic potential on a translucent or opaque van der Waals surface</li>
							<li><b>Charge:</b> calculates and projects atomic charge as text label and white to atom color gradient</li>
							<li><b>Bond dipoles:</b> calculates and draws individual bond dipoles</li>
							<li><b>Overall dipole:</b> calculates and draws netto bond dipole</li>
							<li><b>Energy minimization:</b> executes an MMFF94 energy minimization calculation</li>
						</ul>
						<h4>Measurement</h4>
						<p>You can perform the following measurements in Jmol:</p>
						<ul>
							<li><b>Distance</b> (nm)</li>
							<li><b>Angle</b> (deg)</li>
							<li><b>Torsion</b> (deg)</li>
						</ul>
						<h4>Render mode</h4>
						<p>In Jmol, you can switch between different render modes in order to speed up performance or to increase quality.<br/>There are three render modes:</p>
						<ol>
							<li><b>Everything:</b> slowest but best quality</li>
							<li><b>Normal:</b> average speed and quality</li>
							<li><b>Minimal:</b> fastest but least quality</li>
						</ol>
					</div>
				</div>
				<p>
					If you still have questions, found bugs or want to request new features. You can discuss them with me via social media or send me an email.
					<ul>
						<li>Twitter: <a class="link" target="_blank" title="Twitter" href="https://twitter.com/molview">@molview</a></li>
						<li>Facebook: <a class="link" target="_blank" title="FaceBook" href="https://www.facebook.com/molview" rel="publisher">MolView</a></li>
						<li>Google Plus: <a class="link" target="_blank" title="Google+" href="https://plus.google.com/102377643104393981977" rel="publisher">+MolView</a></li>
						<li>Mail: <a class="link" target="_blank" title="Mail" href="mailto:support@molview.org">support@molview.org</a></li>
					</ul>
				</p>
				<div class="footer">
					<button class="btn close btn-primary pull-right">Close</button>
				</div>
			</div>
			<div class="dialog styled-headings" id="share-dialog" style="display: none;">
				<h2>Share</h2>
				<div id="share-2d-not-3d" class="alert-bar alert-danger"><b>The structural formula and the model do not look the same!</b><p>make sure to resolve the strutural formula if you want to share the molecule from the sketcher</p></div>
				<h3>URL</h3>
				<input id="share-link" class="contrast expand" type="text" autocomplete="off" spellcheck="false" />
				<div class="social no-select">
					<div class="facebook share"></div>
					<div class="twitter share"></div>
					<div class="googleplus share"></div>
				</div>
				<div class="footer">
					<button class="btn close btn-primary pull-right">Close</button>
				</div>
			</div>
			<div class="dialog styled-headings" id="embed-dialog" style="display: none;">
				<h2>Embed</h2>
				<div id="embed-2d-not-3d" class="alert-bar alert-danger"><b>The structural formula and the model do not look the same!</b><p>make sure to resolve the strutural formula if you want to share the molecule from the sketcher</p></div>
				<div class="alert-bar alert-info">Embedded proteins cannot be viewed on smartphones without WebGL</div>
				<div class="expandable">
					<div class="title no-select">
						<b>Dimensions</b>
						<i class="fa"></i>
					</div>
					<div class="content">
						<h4>Width</h4>
						<input id="embed-width" class="contrast expand" type="text" value="500px" autocomplete="off" spellcheck="false" /><br/>
						<h4>Height</h4>
						<input id="embed-height" class="contrast expand" type="text" value="300px" autocomplete="off" spellcheck="false" />
					</div>
				</div>
				<h3>Code</h3>
				<input id="embed-code" class="contrast expand" type="text" autocomplete="off" spellcheck="false" />
				<div class="footer">
					<button class="btn close btn-primary pull-right">Close</button>
				</div>
			</div>
			<div class="dialog" id="properties-dialog" style="display: none;">
				<h2>Chemical Properties</h2>
				<div id="properties-wrapper">
					<div id="general-properties">
						<div id="molecule-image-wrapper" class="properties-block">
							<img id="molecule-image" class="chemprop" src="src/img/empty.png" alt=""/>
						</div>
						<div class="properties-block">
							<div id="molecule-info">
								<h3 id="molecule-title"></h3>
								<p id="molecule-description"></p>
							</div>
							<table class="light-table">
								<tbody>
									<tr><td>Formula</td><td id="prop-formula" class="chemprop"></td></tr>
									<tr><td>Molecular weight</td><td id="prop-weight" class="chemprop"></td></tr>
									<tr><td>Hydrogen bond donors</td><td id="prop-h-donors" class="chemprop"></td></tr>
									<tr><td>Hydrogen bond acceptors</td><td id="prop-h-acceptors" class="chemprop"></td></tr>
									<tr><td>Rule of 5 violations</td><td id="prop-ro5-violations" class="chemprop"></td></tr>
									<tr><td>Freely rotatable bonds</td><td id="prop-fr-bonds" class="chemprop"></td></tr>
									<tr><td>Effectively rotatable bonds</td><td id="prop-er-bonds" class="chemprop"></td></tr>
									<tr><td>Rings</td><td id="prop-rings" class="chemprop"></td></tr>
									<tr><td>Ring systems</td><td id="prop-ring-systems" class="chemprop"></td></tr>
								</tbody>
							</table>
						</div>
					</div>
					<table id="chem-identifiers" class="input-table">
						<thead>
							<tr><th>Identifiers</th></tr>
						</thead>
						<tbody>
							<tr><th>IUPAC name</th></tr>
							<tr><td><input type="text" id="prop-iupac" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr><th>SMILES</th></tr>
							<tr><td><input type="text" id="prop-smiles" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr><th>Standard InChiKey</th></tr>
							<tr><td><input type="text" id="prop-stdinchikey" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr><th>Standard InChi</th></tr>
							<tr><td><input type="text" id="prop-stdinchi" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr><th>CAS Registry Number</th></tr>
							<tr><td><input type="text" id="prop-cas" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr><th>Chemspider ID&nbsp;&nbsp;<a id="chemspider-external-link" class="a" target="_blank"><i class="fa fa-external-link"></i></a></th></tr>
							<tr><td><input type="text" id="prop-chemspider_id" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr><th>PubChem CID&nbsp;&nbsp;<a id="pubchem-external-link" class="a" target="_blank"><i class="fa fa-external-link"></i></th></tr>
							<tr><td><input type="text" id="prop-cid" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
						</tbody>
					</table>
				</div>
				<div class="footer">
					<button class="btn close btn-primary pull-right">Close</button>
				</div>
			</div>
			<div class="dialog" id="spectra-dialog" style="display: none;">
				<h2>Spectroscopy</h2>
				<div id="spectrum">
					<select id="spectrum-select"></select>
					<div id="spectrum-wrapper">
						<canvas id="spectrum-canvas"></canvas>
					</div>
				</div>
				<div class="footer">
					<button id="png-current-spectrum" class="btn">Download PNG image</button>
					<button id="jcamp-current-spectrum" class="btn">Download JCAMP data</button>
					<button class="btn close btn-primary ">Close</button>
				</div>
			</div>
			<div class="dialog" id="elements-dialog" style="display: none;">
				<h2>Periodic Table</h2>
				<div id="periodictable" class="no-select"></div>
				<div class="footer">
					<button class="btn close btn-primary pull-right">Close</button>
				</div>
			</div>
		</div>
	</body>
</html>
