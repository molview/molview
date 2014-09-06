<?php
include("php/utility.php");
include("php/load.php");
error_reporting(0);

if(is_below_IE10())
{
	header('Location: nosupport');
	exit;
}

//preserve + sign by encoding it to %2B before parsing it
parse_str(str_replace("+", "%2B", $_SERVER["QUERY_STRING"]));
$metadata = load_metadata($q, $smiles, $cid, $pdbid, $codid);

//layout
$contentClass = "layout-vsplit";
if(isset($layout)) $contentClass = "layout-".$layout;
else if(isset($pdbid)) $contentClass = "layout-model";
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
  - search = fast || pubchem || rcsb || cod
  - smiles = resolve SMILES string
  - cid = load CID
  - pdbid = load PDBID
  - codid = load CIF from COD
  - layout = model || sketcher || hsplit || vsplit
  - menu = on || off
  - dialog = about || help || share || embed
  - mode = balls || stick || vdw || wireframe || line
  - chainType = ribbon || cylinders || btube || ctrace || bonds (alias for chainBonds=bonds)
  - chainBonds = true || false
  - chainColor = ss || spectrum || chain || bfactor || polarity
  - bg = black || grey || white
-->

	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

		<meta name="mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-capable" content="yes" />

		<meta name="viewport" content="width=device-width, user-scalable=no" />

		<?php echo "<title>".$metadata["title"]."</title>"; ?>

		<link rel="shortcut icon" href="favicon-32x32.png" />

		<meta name="author" content="Herman Bergwerf" />
		<meta name="keywords" <?php echo 'content="'.$metadata["keywords"].'"' ?> />

		<!-- Open Graph + Schema.org + Twitter Card -->
		<meta name="twitter:card" content="summary">
		<meta name="twitter:site" content="@molview">
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="MolView" />
		<?php
			echo '<meta name="description" content="'.$metadata["description"].'" />';

			echo '<meta name="twitter:title" property="og:title" content="'.$metadata["title"].'" />';
			echo '<meta itemprop="name" content="'.$metadata["title"].'" />';

			echo '<meta name="twitter:description" property="og:description" content="'.$metadata["description"].'" />';
			echo '<meta itemprop="description" content="'.$metadata["description"].'" />';

			echo '<meta itemprop="sameAs" content="'.$metadata["same_as"].'" />';

			if(isset($metadata["pubchem_query"]))
			{
				if($metadata["pubchem_query"] == "smiles")
				{
					echo '<meta name="twitter:image:src" property="og:image" content="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/png?smiles='.urlencode($metadata["pubchem_value"]).'&record_type=2d" />';
					echo '<meta itemprop="image" content="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/png?smiles='.urlencode($metadata["pubchem_value"]).'record_type=2d" />';
				}
				else
				{
					echo '<meta name="twitter:image:src" property="og:image" content="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/'.$metadata["pubchem_query"].'/'.$metadata["pubchem_value"].'/png?record_type=2d" />';
					echo '<meta itemprop="image" content="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/'.$metadata["pubchem_query"].'/'.$metadata["pubchem_value"].'/png?record_type=2d" />';
				}
			}
			else

			{
				echo '<meta name="twitter:image:src" itemprop="image" property="og:image" content="'.$metadata["image_url"].'" />';
				echo '<meta itemprop="image" content="'.$metadata["image_url"].'" />';
			}
		?>

		<!-- CSS -->
		<link type="text/css" rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">
		<link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">
		<link type="text/css" rel="stylesheet" href="build/molview.min.css" />

		<!-- JS -->
		<script type="text/javascript" src="src/js/lib/JSmol.min.js"></script>
		<script type="text/javascript" src="src/js/lib/jquery.min.js"></script>
		<script type="text/javascript" src="src/js/lib/jquery.hotkeys.js"></script>
		<script type="text/javascript" src="src/js/lib/Detector.js"></script>
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
		<script type="text/javascript" src="src/js/moledit/ChemicalViewCore.js"></script>
		<script type="text/javascript" src="src/js/moledit/ChemicalViewEvents.js"></script>
		<script type="text/javascript" src="src/js/moledit/Utility.js"></script>
		<script type="text/javascript" src="src/js/lib/three.min.js"></script>
		<script type="text/javascript" src="src/js/lib/GLmol.js"></script>
		<script type="text/javascript" src="src/js/lib/ChemDoodleWeb.js"></script>
		<script type="text/javascript" src="src/js/lib/Blob.js"></script>
		<script type="text/javascript" src="src/js/lib/FileSaver.js"></script>
		<script type="text/javascript" src="src/js/lib/PeriodicTable.js"></script>
		<script type="text/javascript" src="src/js/Utility.js"></script>
		<script type="text/javascript" src="src/js/Data.js"></script>
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
		<script type="text/javascript" src="src/js/InfoCard.js"></script>
		<script type="text/javascript" src="src/js/Spectroscopy.js"></script>
		<script type="text/javascript" src="src/js/Autocomplete.js"></script>
		<script type="text/javascript" src="src/js/MolView.js"></script>

		<!-- <script type="text/javascript" src="build/molview.min.js"></script> -->

		<!-- Dynamic CSS -->
		<script type="text/javascript">
			MolView.touch = isTouchDevice();
			MolView.mobile = isMobile();
			if(MolView.touch)
			{
				document.write('<link id="theme-stylesheet" type="text/css" rel="stylesheet" href="build/molview.touch.min.css" media="screen" />');
			}
			else
			{
				document.write('<link id="theme-stylesheet" type="text/css" rel="stylesheet" href="build/molview.desktop.min.css" media="screen" />');
			}
			if(MolView.mobile)
			{
				document.write('<link type="text/css" rel="stylesheet" href="build/molview.mobile.min.css" media="screen" />');
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
			<div class="progress-part" style="width: 0; opacity: 0;"></div>
		</div>
		<div id="menu" class="no-select menu swipeable">
			<div class="inner">
				<ul id="main-menu" class="brick menu-bar">
					<li class="dropdown">
						<a class="dropdown-toggle brand">MolView<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li class="menu-header">Layout</li>
							<li id="layout-menu">
								<a id="window-model" <?php if($contentClass == "model") echo 'class="selected"' ?>></a>
								<a id="window-hsplit" <?php if($contentClass == "hsplit") echo 'class="selected"' ?>></a>
								<a id="window-vsplit" <?php if($contentClass == "vsplit") echo 'class="selected"' ?>></a>
								<a id="window-sketcher" <?php if($contentClass == "sketcher") echo 'class="selected"' ?>></a>
							</li>
							<li class="menu-header">Theme</li>
							<li><a id="theme-desktop">Desktop</a></li>
							<li><a id="theme-touch">Touch</a></li>
							<li class="menu-header">Information</li>
							<li><a id="mv-help">Help</a></li>
							<li><a id="mv-about">About</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle">Tools<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li class="menu-header">Link</li>
							<li><a id="mv-share">Share</a></li>
							<li><a id="mv-embed">Embed</a></li>
							<li class="menu-header">Export</li>
							<li><a id="export-2d">Structural formula image</a></li>
							<li><a id="export-3d">3D model image</a></li>
							<li><a id="save-local-3d">MOL file</a></li>
							<li class="menu-header">Chemical data</li>
							<li><a id="data-infocard">Information card</a></li>
							<li><a id="data-spectra">Spectroscopy</a></li>
							<li class="menu-header">Advanced search</li>
							<li><a id="search-similarity">Similarity</a></li>
							<li><a id="search-substructure">Substructure</a></li>
							<li><a id="search-superstructure">Superstructure</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle">Model<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a id="model-reset">Reset</a></li>
							<li class="menu-header">Representation</li>
							<li><a id="model-balls" class="r-mode checked">Ball and Stick</a></li>
							<li><a id="model-stick" class="r-mode">Stick</a></li>
							<li><a id="model-vdw" class="r-mode">van der Waals Spheres</a></li>
							<li><a id="model-wireframe" class="r-mode">Wireframe</a></li>
							<li><a id="model-line" class="r-mode">Line</a></li>
							<li class="menu-header">Background</li>
							<li><a id="model-bg-black" <?php echo 'class="model-bg'.(isset($bg) ? $bg == "black" ? ' checked"' : '"' : ' checked"'); ?> >Black</a></li>
							<li><a id="model-bg-grey" <?php echo 'class="model-bg'.(isset($bg) ? $bg == "grey" ? ' checked"' : '"' : '"'); ?> >Grey</a></li>
							<li><a id="model-bg-white" <?php echo 'class="model-bg'.(isset($bg) ? $bg == "white" ? ' checked"' : '"' : '"'); ?> >White</a></li>
							<li class="menu-header">Engine</li>
							<li><a id="engine-glmol" class="checked">GLmol (fast)</a></li>
							<li><a id="engine-jmol">Jmol (extensive)</a></li>
							<li><a id="engine-cdw">ChemDoodle</a></li>
							<li class="menu-header">Crystallography</li>
							<li><a id="cif-unit-cell">Load unit cell</a></li>
							<li><a id="cif-2x2x2-cell">Load 2&times;2&times;2 supercell</a></li>
							<li><a id="cif-1x3x3-cell">Load 1&times;3&times;3 supercell</a></li>
						</ul>
					</li>
					<li id="glmol-menu" class="dropdown" style="display: none;">
						<a class="dropdown-toggle">GLmol<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a id="bio-assembly">Biological assembly</a></li>
							<li class="menu-header">Chain representation</li>
							<li><a id="glmol-chain-ribbon" class="glmol-chain checked">Ribbon</a></li>
							<li><a id="glmol-chain-cylinders" class="glmol-chain">Cylinder and plate</a></li>
							<li><a id="glmol-chain-btube" class="glmol-chain">B-factor tube</a></li>
							<li><a id="glmol-chain-ctrace" class="glmol-chain">C-alpha trace</a></li>
							<li class="menu-divider"></li>
							<li><a id="glmol-chain-bonds">Bonds</a></li>
							<li class="menu-header">Chain coloring</li>
							<li><a id="glmol-color-ss" class="glmol-color checked">Secondary structure</a></li>
							<li><a id="glmol-color-spectrum" class="glmol-color">Spectrum</a></li>
							<li><a id="glmol-color-chain" class="glmol-color">Chain</a></li>
							<li><a id="glmol-color-bfactor" class="glmol-color">B-factor</a></li>
							<li><a id="glmol-color-polarity" class="glmol-color">Polarity</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle">Jmol<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a id="jmol-clean" class="jmol-script">Clean</a></li>
							<li class="menu-header">Calculations</li>
							<li><a id="mep-lucent" class="jmol-script jmol-calc">MEP surface lucent</a></li>
							<li><a id="mep-opaque" class="jmol-script jmol-calc">MEP surface opaque</a></li>
							<li><a id="jmol-charge" class="jmol-script jmol-calc">Charge</a></li>
							<li><a id="bond-dipoles" class="jmol-script jmol-calc">Bond dipoles</a></li>
							<li><a id="net-dipole" class="jmol-script jmol-calc">Overall dipole</a></li>
							<li><a id="jmol-minimize" class="jmol-script jmol-calc">Energy minimization</a></li>
							<li class="menu-header">Measurement</li>
							<li><a id="measure-distance" class="jmol-script jmol-picking">Distance</a></li>
							<li><a id="measure-angle" class="jmol-script jmol-picking">Angle</a></li>
							<li><a id="measure-torsion" class="jmol-script jmol-picking">Torsion</a></li>
							<li class="menu-header">Render mode</li>
							<li><a id="jmol-render-all" class="jmol-rnd">Everything</a></li>
							<li><a id="jmol-render-normal" class="jmol-rnd checked">Normal</a></li>
							<li><a id="jmol-render-minimal" class="jmol-rnd">Minimal</a></li>
						</ul>
					</li>
				</ul>
				<form id="search" class="brick form-bar" action="javascript:void(0)">
					<div id="search-input-wrap">
						<input id="search-input" name="q" type="text"
							placeholder="Name, InChiKey, SMILES &hellip;"
							autocomplete="off" spellcheck="false" />
					</div>
					<div id="search-buttons">
						<button id="fast-search" class="btn btn-search" type="submit" title="Fast search"><i class="fa fa-search"></i></button>
						<button id="pubchem-search" class="btn btn-search" type="button" title="Find compounds via PubChem">Compounds</button>
						<button id="rcsb-search" class="btn btn-search" type="button" title="Find macromolecules via RCSB">Macromolecules</button>
						<button id="cod-search" class="btn btn-search" type="button" title="Find crystals via COD">Crystals</button>
						<button id="show-search-layer" class="btn btn-search last" type="button" title="Show results" style="display: block;"><i class="fa fa-eye"></i></button>
						<button id="hide-search-layer" class="btn btn-search last" type="button" title="Hide results" style="display: none;"><i class="fa fa-eye-slash"></i></button>
					</div>
				</form>
			</div>
		</div>
		<div id="content">
			<div id="main-layer" <?php echo 'class="layer '.$contentClass.'"' ?>>
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
					else $("#menu > .inner").css("min-width", 1200);

					MolView.layout = <?php echo '"'.$contentClass.'"'; ?>;
					MolView.query = getQuery();

					if($(window).height() > $(window).width()
						&& !MolView.query.layout
						&& MolView.layout != "model") Actions.window_hsplit();

					if(MolView.touch) $("#theme-touch").addClass("checked");
					else $("#theme-desktop").addClass("checked");
				</script>
				<div id="sketcher">
					<div id="moledit" class="sketcher">
						<div id="chem-tools" class="toolbar swipeable">
							<div class="inner">
								<div id="me-single" class="tool-button mode tool-button-selected" title="Single bond"></div>
								<div id="me-double" class="tool-button mode" title="Double bond"></div>
								<div id="me-triple" class="tool-button mode" title="Triple bond"></div>
								<div id="me-updown" class="tool-button mode" title="Up/Down bond"></div>
								<div class="vertical-separator"></div>
								<div id="me-frag-0" class="tool-button mode" title="Benzene"></div>
								<div id="me-frag-1" class="tool-button mode" title="Cyclopropane"></div>
								<div id="me-frag-2" class="tool-button mode" title="Cyclobutane"></div>
								<div id="me-frag-3" class="tool-button mode" title="Cyclopentane"></div>
								<div id="me-frag-4" class="tool-button mode" title="Cyclohexane"></div>
								<div id="me-frag-5" class="tool-button mode" title="Cycloheptane"></div>
								<div class="vertical-separator"></div>
								<div id="me-chain" class="tool-button mode" title="Click and drag to draw a chain of carbon atoms"></div>
								<div id="me-charge-add" class="tool-button mode" title="Charge +">e<sup>+</sup></div>
								<div id="me-charge-sub" class="tool-button mode" title="Charge -">e<sup>-</sup></div>
							</div>
						</div>
						<div id="edit-tools" class="toolbar swipeable">
							<div class="inner">
								<div id="me-new" class="tool-button tool-button-horizontal" title="Clear all"></div>
								<div id="me-eraser" class="tool-button tool-button-horizontal mode" title="Erase"></div>
								<div class="horizontal-separator"></div>
								<div id="me-undo" class="tool-button tool-button-horizontal tool-button-disabled" title="Undo"></div>
								<div id="me-redo" class="tool-button tool-button-horizontal tool-button-disabled" title="Redo"></div>
								<div class="horizontal-separator"></div>
								<div id="me-move" class="tool-button tool-button-horizontal mode" title="Move"></div>
								<div id="me-center" class="tool-button tool-button-horizontal" title="Center structure"></div>
								<div class="horizontal-separator"></div>
								<div id="me-rect" class="tool-button tool-button-horizontal mode custom tool-button-selected" title="Rectangle selection"></div>
								<div id="me-lasso" class="tool-button tool-button-horizontal mode custom" title="Lasso selection"></div>
								<div id="me-deselect" class="tool-button tool-button-horizontal" title="Clear selection"></div>
								<div class="horizontal-separator"></div>
								<div id="me-clean" class="tool-button tool-button-horizontal" title="Clean structure"></div>
								<div id="resolve" class="tool-button tool-button-horizontal resolve-updated" title="Update 3D view">2D to 3D</div>
							</div>
						</div>
						<div id="elem-tools" class="toolbar swipeable">
							<div class="inner">
								<div id="me-atom-h" class="tool-button mode" title="Hydrogen">H</div>
								<div id="me-atom-c" class="tool-button mode" title="Carbon">C</div>
								<div id="me-atom-n" class="tool-button mode" title="Nitrogen">N</div>
								<div id="me-atom-o" class="tool-button mode" title="Oxygen">O</div>
								<div id="me-atom-s" class="tool-button mode" title="Sulfur">S</div>
								<div id="me-atom-p" class="tool-button mode" title="Phosphorus">P</div>
								<div id="me-atom-f" class="tool-button mode" title="Fluorine">F</div>
								<div id="me-atom-i" class="tool-button mode" title="Iodine">I</div>
								<div id="me-atom-cl" class="tool-button mode" title="Chlorine">Cl</div>
								<div id="me-atom-br" class="tool-button mode" title="Bromine">Br</div>
								<div id="me-elements" class="tool-button" title="Periodic Table">...</div>
								<div class="vertical-separator"></div>
								<div id="me-info" class="tool-button" title="Information"></div>
							</div>
						</div>
						<div id="moledit-area" class="edit-area">
							<canvas id="moledit-canvas"></canvas>
						</div>
					</div>
				</div>
				<div id="model" <?php
					if(isset($bg))
					{
						echo 'style="background:'.($bg != "white" ? $bg != "grey" ?
							"#000000" : "#cccccc" : "#ffffff").'"';
					}
				?>>
					<div id="chemdoodle" class="render-engine" style="display: none;">
						<canvas id="chemdoodle-canvas"></canvas>
					</div>
					<div id="jsmol" class="render-engine" style="display: none;"></div>
					<div id="glmol" class="render-engine" style="display: none;"></div>
				</div>
			</div>
			<div id="search-layer" class="layer search-results" style="display: none;">
				<div class="btn-group-bar">
					<button class="btn close btn-primary "><i class="fa fa-arrow-left"></i> Return</button>
				</div>
				<div class="container"></div>
				<div id="load-more-pubchem" class="load-more" style="display: none;"></div>
				<div id="load-more-rcsb" class="load-more" style="display: none;"></div>
				<div id="load-more-cod" class="load-more" style="display: none;"></div>
			</div>
			<div id="infocard-layer" class="layer data-layer" style="display: none;">
				<div class="btn-group-bar">
					<button class="btn close btn-primary "><i class="fa fa-arrow-left"></i> Return</button>
				</div>
				<div id="properties-wrapper">
					<div id="general-properties">
						<div id="molecule-image-wrapper" class="properties-block">
							<img id="molecule-image" alt=""/>
						</div>
						<div class="properties-block">
							<div id="molecule-info">
								<h3 id="molecule-title"></h3>
								<p id="molecule-description"></p>
							</div>
							<table id="common-chem-props" class="light-table">
								<tbody>
									<tr id="prop-formula-wrapper"><td>Formula</td><td id="prop-formula" class="chemprop"></td></tr>
									<tr id="prop-mw-wrapper"><td>Molecular weight</td><td id="prop-mw" class="chemprop"></td></tr>
									<tr id="prop-donors-wrapper"><td>Proton donors</td><td id="prop-donors" class="chemprop"></td></tr>
									<tr id="prop-acceptors-wrapper"><td>Proton acceptors</td><td id="prop-acceptors" class="chemprop"></td></tr>
								</tbody>
							</table>
						</div>
					</div>
					<table id="chem-identifiers" class="input-table">
						<thead>
							<tr><th>Identifiers</th></tr>
						</thead>
						<tbody>
							<tr id="prop-sysname-title"><th>Systematic name</th></tr>
							<tr id="prop-sysname-wrapper"><td><input type="text" id="prop-sysname" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr id="prop-canonicalsmiles-title"><th>Canonical SMILES</th></tr>
							<tr id="prop-canonicalsmiles-wrapper"><td><input type="text" id="prop-canonicalsmiles" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr id="prop-isomericsmiles-title"><th>Isomeric SMILES</th></tr>
							<tr id="prop-isomericsmiles-wrapper"><td><input type="text" id="prop-isomericsmiles" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr id="prop-inchikey-title"><th>InChiKey</th></tr>
							<tr id="prop-inchikey-wrapper"><td><input type="text" id="prop-inchikey" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr id="prop-inchi-title"><th>InChi</th></tr>
							<tr id="prop-inchi-wrapper"><td><input type="text" id="prop-inchi" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr id="prop-cas-title"><th>CAS Number</th></tr>
							<tr id="prop-cas-wrapper"><td><input type="text" id="prop-cas" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr id="prop-csid-title"><th>Chemspider ID&nbsp;&nbsp;<a id="chemspider-external-link" class="a" target="_blank"><i class="fa fa-external-link"></i></a></th></tr>
							<tr id="prop-csid-wrapper"><td><input type="text" id="prop-csid" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
							<tr id="prop-cid-title"><th>PubChem Compound ID&nbsp;&nbsp;<a id="pubchem-external-link" class="a" target="_blank"><i class="fa fa-external-link"></i></a></th></tr>
							<tr id="prop-cid-wrapper"><td><input type="text" id="prop-cid" class="chemprop" autocomplete="off" spellcheck="false" /></td></tr>
						</tbody>
					</table>
				</div>
			</div>
			<div id="spectra-layer" class="layer data-layer" style="display: none;">
				<div class="btn-group-bar">
					<button class="btn close btn-primary "><i class="fa fa-arrow-left"></i> Return</button>
					<select id="spectrum-select"></select>
					<button id="png-current-spectrum" class="btn"><i class="fa fa-download"></i> Download PNG image</button>
					<button id="jcamp-current-spectrum" class="btn"><i class="fa fa-download"></i> Download JCAMP data</button>
				</div>
				<div id="spectrum-wrapper">
					<canvas id="spectrum-canvas"></canvas>
				</div>
			</div>
		</div>
		<div id="messages"></div>
		<div id="autocomplete-dropdown-wrapper" style="display: none;">
			<div id="autocomplete-dropdown"></div>
		</div>
		<div id="dialog-overlay" class="dialog-overlay">
			<div id="dialog-click-area">
				<div id="dialog-wrapper">
					<div class="dialog" id="start-dialog">
						<h1>Welcome to MolView</h1>
						<p>MolView is a modern webapp for chemistry education around the world!</p>
						<div class="btn-group">
							<button id="start-help" class="btn btn-large">Getting started</button>
							<button class="btn close btn-large btn-primary">Continue</button>
						</div>
						<p>MolView is also on YouTube, Twitter, Facebook and Google Plus to keep you updated about the latest stuff!</p>
						<div class="btn-group">
							<a class="btn" target="_blank" title="YouTube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a>
							<a class="btn" target="_blank" title="@molview" href="https://twitter.com/molview">Twitter</a>
							<a class="btn" target="_blank" title="Facebook page" href="https://www.facebook.com/molview">Facebook</a>
							<a class="btn" target="_blank" title="+MolView" href="https://google.com/+MolviewOrganization/about" rel="publisher">Google+</a>
						</div>
						<p id="donate-msg">We believe MolView should be accessible for free to everyone. Since MolView is non-profit and there is no budget behind its development and maintenance we need your support!<br/>This way we can continue to add more awesome features to MolView.</p>
						<a class="btn" title="Support MolView!" target="_blank" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=88QDZTWLV9GXG">Donate</a>
					</div>
					<div class="dialog" id="about-dialog" style="display: none;">
						<h2>About</h2>
						<div class="dialog-close-btn"></div>
						<p>MolView is a web application for drawing, searching and viewing chemical structures.<br>
						This web application is built using the JavaScript libraries and online services listed below. I also drew inspration from the <a class="link" href="http://chemagic.com/JSmolVMK2.htm" target="_blank" title="Virtual Model Kit">Virtual Model Kit</a>, a similar webapplication.</p>
						<ul>
							<li>JavaScript libraries
								<ul>
									<li><a class="link" href="https://www.molsoft.com/moledit.html" target="_blank" title="MolEdit">MolEdit v1.2.4</a>: sketcher (modified with permission from <a class="link" href="https://www.molsoft.com" target="_blank" title="MolSoft">MolSoft</a>)</li>
									<li><a class="link" href="http://ggasoftware.com/opensource/ketcher" target="_blank" title="Ketcher">Ketcher</a>: Molfile to SMILES conversion</li>
									<li><a class="link" href="http://webglmol.sourceforge.jp/index-en.html" target="_blank" title="GLmol">GLmol v0.47</a>: primary 3D render engine</li>
									<li><a class="link" href="http://sourceforge.net/projects/jsmol/" target="_blank" title="JSmol">JSmol v14.2.3</a>: 3D render engine</li>
									<li><a class="link" href="http://web.chemdoodle.com/" target="_blank" title="ChemDoodle Web">ChemDoodle Web Components v6.0.1</a>: 3D render engine and spectrum display</li>
								</ul>
							</li>
							<li>Databases/REST API's
								<ul>
									<li><a class="link" href="http://cactus.nci.nih.gov/chemical/structure" target="_blank" title="NCI/CADD Chemical Identifier Resolver API">NCI/CADD Chemical Identifier Resolver</a></li>
									<li><a class="link" href="http://www.rcsb.org/pdb/software/rest.do" target="_blank" title="RCSB Protein Databank API">RCSB Protein Data Bank</a></li>
									<li><a class="link" href="https://pubchem.ncbi.nlm.nih.gov/pug_rest/PUG_REST.html" target="_blank" title="The PubChem Project API">The PubChem Project</a></li>
									<li><a class="link" href="http://www.crystallography.net/" target="_blank" title="COD">Crystallography Open Database</a></li>
									<li><a class="link" href="http://www.nmrdb.org/" target="_blank" title="NMRdb.org">NMR Database</a></li>
									<li><a class="link" href="http://webbook.nist.gov/chemistry" target="_blank" title="NIST Chemistry WebBook Reference">NIST Chemistry WebBook</a></li>
									<li><a class="link" href="http://mymemory.translated.net/doc/spec.php" target="_blank" title="MyMemory API">MyMemory translation API</a></li>
								</ul>
							</li>
						</ul>
						<p id="about-links">
							MolView v2.2.0
							<br/>
							Copyright &copy; 2014 <a class="link" target="_blank" rel="author" title="Personal website" href="http://hermanbergwerf.com">Herman Bergwerf</a>
							&nbsp;|&nbsp;
							<a class="link" href="CHANGELOG.md" target="_blank">Changelog</a>
							&nbsp;|&nbsp;
							<a class="link" href="LICENSE.md" target="_blank">License</a>
							<br/>
							<a class="link" target="_blank" title="Chrome App" href="https://chrome.google.com/webstore/detail/molview/nogcacamdkipgkfpfiakaoamdnihinnm">Chrome Web Store</a>
							&nbsp;|&nbsp;
							<a class="link" target="_blank" title="YouTube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a>
							&nbsp;|&nbsp;
							<a class="link" target="_blank" title="@molview" href="https://twitter.com/molview">Twitter</a>
							&nbsp;|&nbsp;
							<a class="link" target="_blank" title="Facebook page" href="https://www.facebook.com/molview">Facebook</a>
							&nbsp;|&nbsp;
							<a class="link" target="_blank" title="+MolView" href="https://google.com/+MolviewOrganization" rel="publisher">Google+</a>
							&nbsp;|&nbsp;
							<a class="link" target="_blank" title="Mail" href="mailto:info@molview.org">info@molview.org</a>
						</p>
						<div class="footer">
							<button class="btn close btn-primary">Continue</button>
						</div>
					</div>
					<div class="dialog" id="help-dialog" style="display: none;">
						<h2>Help</h2>
						<div class="dialog-close-btn"></div>
						<script type="text/javascript">
							if(isTouchDevice())
							{
								document.write('<div class="alert-bar alert-danger" style="margin-bottom: 20px;"><b>Important!</b> you can slide toolbars which don\'t fit in you screen.</div>');
							}
						</script>
						<p><a class="link" href="docs/MolView-v2.2-manual.pdf" target="_blank">Download PDF version</a></p>
						<p>Click one of the subjects below to learn more. You can also watch some videos on <a class="link" target="_blank" title="YouTube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a> to get started.</p>
						<h3>Subjects</h3>
						<div class="expandable">
							<div class="expandable-title"><i class="fa"></i><b>Drawing structural formulas</b></div>
							<div class="expandable-content">
								<p>You can draw structural formulas using the Sketcher component.</p>
								<h4>Top toolbar</h4>
								<p>The top toolbar contains all general editing tools. The <i>2D to 3D</i> tool converts the structural formula into a 3D molecule which is displayed in the model window.</p>
								<p style="text-align: right;"><img style="display: inline-block; max-height: 40px;" src="img/help/SketcherTopToolbar.png" alt="Top toolbar" /></p>
								<p class="image-note"><i>Top toolbar, from left to right: delete all, erase, undo, redo, move atoms/bonds, center view, rectangle select, lasso select, clear selection, clean structural formula, 2D to 3D conversion</i></p>
								<h4>Left toolbar</h4>
								<p>In the left toolbar, you can select a tool you want to use in order to modify or extend the structural formula. You can draw a carbon chain using the chain tool. Just click a start point or atom and drag a chain.</p>
								<p style="text-align: right;"><img style="max-height: 40px; display: inline-block;" src="img/help/SketcherLeftToolbar.png" alt="Left toolbar" /></p>
								<p class="image-note"><i>Left toolbar (rotated), from left to right: single bond, double bond, triple bond, up/down bond, benzene, cyclopropane/butane/pentane/hexane/heptane, chain, charge+, charge-</i></p>
								<h4>Right toolbar</h4>
								<p>The right toolbar contains some common elements and a periodic table tool in case you want to use another element. You can select an atom and click an existing atom in order to replace it with the selected atom. Note that you can only replace existing atoms. In order to add an atom, you will first have to add a new bond using the tools from the left toolbar.</p>
								<p style="text-align: right;"><img style="max-height: 40px; display: inline-block;" src="img/help/SketcherRightToolbar.png" alt="Right toolbar" /></p>
								<p class="image-note"><i>Right toolbar (rotated), from left to right: hydrogen, carbon, nitrogen, oxygen, sulfur, phosphorus, fluorine, iodine, chlorine, bromine, table of elements, info (about dialog)</i></p>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><i class="fa"></i><b>Finding structures</b></div>
							<div class="expandable-content">
								<p>You can load structures from large databases like PubChem via the search bar located on the right side of the menubar. Just type what you are looking for and find it in the autocomplete dropdown or click one of the search categories listed below to perform a more extensive search.</p>
								<ul>
									<li><b>Compounds:</b> small molecules from the PubChem database</li>
									<li><b>Macromolecules:</b> biological macromolecules from the RCSB database</li>
									<li><b>Crystals:</b> crystal structures from the Open Crystallography Database</li>
								</ul>
								<p>You can also enter a PubChem CID via <i>Compounds</i>, a PDB ID via <i>Macromolecules</i> or a COD ID via <i>Crystals</i>. It is also possible to enter a SMILES, InChi or InChiKey string in the search field.</p>
								<p>You can show or hide search results using the leftmost button. Note that <i>Macromolecules</i> search is absent on mobile browsers which do not support WebGL since they can't display macromolecules anyway.</p>
								<p style="text-align: right;"><img style="max-height: 40px; display: inline-block;" src="img/help/SearchBar.png" alt="Search bar" /></p>
								<p class="image-note"><i>Search bar, from left to right: input field, fast search, compounds search (PubChem), macromolecules search (RCSB) and crystals search (COD)</i></p>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><i class="fa"></i><b>3D model</b></div>
							<div class="expandable-content">
								<p>You can find the general 3D <i>Model</i> menu in the menubar.</p>
								<h4>Reset</h4>
								<p>This function sets the model position, zoom and rotation back to default.</p>
								<h4>Representation</h4>
								<p>You can choose from a list of different molecule representations including; ball and stick, stick, van der Waals spheres, wireframe and lines. Macromolecules are automatically drawn using ribbons.</p>
								<h4>Background</h4>
								<p>You can switch between a black, grey or white background. The default background is black (exported images from GLmol or ChemDoodle have a transparent background)</p>
								<h4>Engines</h4>
								<p>You can choose from three different render engines: <b>GLmol</b>, <b>Jmol</b> and <b>ChemDoodle</b>. GLmol is used as default render engine. MolView automatically switches to:</p>
								<ol>
									<li><b>Jmol</b> if you execute functions from the Jmol menu</li>
									<li><b>GLmol</b> if you load macromolecules<br/><i>(due to significant higher performance)</i></li>
									<li><b>ChemDoodle</b> if you load a crystal structure<br/><i>(GLmol cannot render crystal structures)</i></li>
								</ol>
								<p>You might want to switch back to GLmol when you do no longer need Jmol or ChemDoole since GLmol has a better performance.</p>
								<p>Note that macromolecules are drawn slightly different in each engine. ChemDoodle provides the finest biomolecule display. You should, however, avoid using ChemDoodle for very large macromolecules.</p>
								<h4>Model transformation</h4>
								<p>You can rotate, translate and zoom the 3D model using a mouse. Use the right button for rotation, the middle button for translation (except for ChemDoodle) and the scrollwheel for zooming. On touch devices, you can rotate the model using one pointer and scale the model using multi-touch.</p>
								<h4>Crystallography</h4>
								<p>You can load an array of crystal cells (2x2x2 or 1x3x3) or a single unit cell when viewing crystal structures.</p>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><i class="fa"></i><b>Advanced tools</b></div>
							<div class="expandable-content">
								<p>You can find the <i>Tools</i> menu in the menubar. This menu contains several utility functions.</p>
								<h4>Link</h4>
								<p>You can embed or share a specific compound, biomolecule or crystal using the provided URL or HTML code. Note that the linked structure is the one which is currently displayed in the model window. You can also copy the URL from the adress bar in order to link to the current structure.</p>
								<h4>Export</h4>
								<p>Export options in the Export menu:</p>
								<ul>
									<li><b>Structural formula image:</b> PNG snapshot from sketcher <i>(transparent background)</i></li>
									<li><b>3D model image:</b> PNG snapshot from model window<br/><i>(transparent background in GLmol and ChemDoodle)</i></li>
									<li><b>MOL file:</b> exports a MDL Molfile from the 3D model<br/><i>(displayed if the 3D model is a common molecule)</i></li>
									<li><b>PDB file:</b> exports a Protein Data Bank file from the 3D model<br/><i>(displayed if the 3D model is a biomolecule)</i></li>
									<li><b>CIF file:</b> exports a Crystallographic Information File from the 3D model<br/><i>(displayed if the 3D model is a crystal structure)</i></li>
								</ul>
								<h4>Information card</h4>
								<p>This function collects and displays information about the structural formula.</p>
								<h4>Spectroscopy</h4>
								<p>This function collects and displays information about the current structural formula (loaded from the Sketcher) You can also find a database reference for the current 3D model.</p>
								<h4>Advanced search</h4>
								<p>This function shows a new layer where you can view molecular spectra of the current structural formula (loaded from the Sketcher) More details are covered in chapter 5.</p>
								<ol>
									<li><b>Similarity search:</b> search for compounds with a similar structural formula</li>
									<li><b>Substructure search:</b> search for compounds with the current structure as subset</li>
									<li><b>Superstructure search:</b> search for compounds with the current structure as superset</li>
								</ol>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><i class="fa"></i><b>Spectroscopy</b></div>
							<div class="expandable-content">
								<p>You can open the Spectroscopy layer via <i>Menu >Model > Chemical data > Spectrocopy</i>. You can view three kinds of molecular spectra.</p>
								<ol>
									<li>Mass spectrum</li>
									<li>IR spectrum</li>
									<li>H1-NMR prediction</li>
								</ol>
								<h4>Export data</h4>
								<p>You can also export different kinds of data from the currently selected spectrum.</p>
								<ul>
									<li><b>PNG image:</b> snapshot from interactive spectrum</li>
									<li><b>JCAMP file:</b> JCAMP-DX file of the current spectrum</li>
								</ul>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><i class="fa"></i><b>Custom GLmol display</b></div>
							<div class="expandable-content">
								<p>The GLmol render engine contains some custom display functions for macromolecules. These functions are located under the <i>GLmol</i> menu in the menubar.</p>
								<h4>Biological assembly</h4>
								<p>Some macromolecules are only a small unit (asymmetric unit) from a much larger structure (biololgical unit) This function allows you to view the full biological unit.</p>
								<h4>Chain representation</h4>
								<p>GLmol offers four different chain representations, you can select one of them. You can also view all bonds as lines by enabling the <i>Bonds</i> option.</p>
								<ol>
									<li><b>Ribbon:</b> draws ribbon diagram <i>(default representation)</i></li>
									<li><b>Cylinder and plate:</b> solid cylinders for α-helices and solid plates for β-sheets</li>
									<li><b>B-factor tube:</b> tube with B-factor as  thickness <i>(thermal motion)</i></li>
									<li><b>C-alpha trace:</b> lines between central carbon atom in amino-acids <i>(very fast rendering)</i></li>
								</ol>
								<h4>Chain coloring</h4>
								<p>You can choose from five chain coloring methods.</p>
								<ol>
									<li><b>Secondary structures:</b> different colors for α-helices, β-sheets, etc.</li>
									<li><b>Spectrum:</b> chain colored with full color spectrum <i>(blue-green-red)</i></li>
									<li><b>Chain:</b> each chains gets a different color</li>
									<li><b>B-factor:</b> blue for low B-factor and red for high B-factor <i>(if provided)</i></li>
									<li><b>Polarity:</b> colors polar amino-acids red and non polar amino-acids white</li>
								</ol>
								<h4>Fog and clipping</h4>
								<p>When you are viewing large structures, like proteins, it can be usefull to hide a certain part using fog or clipping. GLmol offers a few options to do this.</p>
								<ol>
									<li><b>Fog:</b> you can move the fog forward by dragging the mouse <b>up</b> while holding the <b>CTRL</b> and the <b>SHIFT</b> key (and vice versa)</li>
									<li><b>Clipping plane:</b> you can move a frontal clipping plane into the structure by dragging the mouse to the <b>left</b> while holding the <b>CTRL</b> and the <b>SHIFT</b> key (and vice versa)</li>
								</ol>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><i class="fa"></i><b>Advanced Jmol operations</b></div>
							<div class="expandable-content">
								<p>Jmol offers some advanced functions. You can find them in the Jmol menu in the menubar. Note that all functions (except for render modes) are disabled when viewing proteins.</p>
								<h4>Clear</h4>
								<p>Clears all executed calculations and measurements.</p>
								<h4>Calculations</h4>
								<p>You can perform the following Jmol calculations in Jmol:</p>
								<ul>
									<li><b>MEP surface lucent/opaque:</b> calculates and projects molecular electrostatic potential on a translucent or opaque van der Waals surface</li>
									<li><b>Charge:</b> calculates and projects atomic charge as text label and white to atom color gradient</li>
									<li><b>Bond dipoles:</b> calculates and draws individual bond dipoles</li>
									<li><b>Overall dipole:</b> calculates and draws netto bond dipole</li>
									<li><b>Energy minimization:</b> executes an MMFF94 energy minimization calculation<br/><i>(note that this function only executes a maximum of 100 minimization steps at a time)</i></li>
								</ul>
								<h4>Measurement</h4>
								<p>You can execute distance, angle and torsion measurements using Jmol. You can select one of these measurement modes via the Jmol menu <i>(click selected mode again to deselect)</i> Select atoms using the right mouse button.</p>
								<ul>
									<li><b>Distance</b> distance between two atoms in <b>nm</b> <i>(select two atoms)</i></li>
									<li><b>Angle</b> angle between two bonds in <b>deg</b> <i>(select three atoms)</i></li>
									<li><b>Torsion</b> torsion between four atoms in <b>deg</b> <i>(select four atoms)</i></li>
								</ul>
								<p>Note that the resolved 3D model is only an approach of the real molecule, this means you have to execute an <b>Energy minimization</b> in order to do reliable measurements.</p>
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
								<li>Twitter: <a class="link" target="_blank" title="Twitter page" href="https://twitter.com/molview">@molview</a></li>
								<li>Facebook: <a class="link" target="_blank" title="Facebook page" href="https://www.facebook.com/molview">MolView</a></li>
								<li>Google Plus: <a class="link" target="_blank" title="Google+ page" href="https://google.com/+MolviewOrganization" rel="publisher">+MolView</a></li>
								<li>Mail: <a class="link" target="_blank" title="Mail adress" href="mailto:support@molview.org">support@molview.org</a></li>
							</ul>
						</p>
						<div class="footer">
							<button class="btn close btn-primary">Close</button>
						</div>
					</div>
					<div class="dialog" id="share-dialog" style="display: none;">
						<h2>Share</h2>
						<div class="dialog-close-btn"></div>
						<div class="alert-box">
							<span id="share-2d-not-3d" class="alert-bar">The strutural formula is not the same molecule as the 3D model (3D model is shared)</span>
						</div>
						<div id="share-dialog-social" class="social no-select">
							<div class="share share-facebook"></div>
							<div class="share share-twitter"></div>
							<div class="share share-googleplus"></div>
						</div>
						<input id="share-link" class="contrast expand" type="text" autocomplete="off" spellcheck="false" />
						<div class="footer">
							<button class="btn close btn-primary">Close</button>
						</div>
					</div>
					<div class="dialog" id="embed-dialog" style="display: none;">
						<h2>Embed</h2>
						<div class="dialog-close-btn"></div>
						<div class="alert-box">
							<span id="embed-2d-not-3d" class="alert-bar">The strutural formula is not the same molecule as the 3D model (3D model is embedded)</span>
							<span id="embed-macromolecule" class="alert-bar">Embedded macromolecules cannot be viewed on smartphones without WebGL support</span>
						</div>
						<h4>Width</h3>
						<input id="embed-width" class="contrast expand" type="text" value="500px" autocomplete="off" spellcheck="false" /><br/>
						<h4>Height</h4>
						<input id="embed-height" class="contrast expand" type="text" value="300px" autocomplete="off" spellcheck="false" />
						<h4>HTML code</h4>
						<input id="embed-code" class="contrast expand" type="text" autocomplete="off" spellcheck="false" />
						<div class="footer">
							<button class="btn close btn-primary">Close</button>
						</div>
					</div>
					<div class="dialog" id="elements-dialog" style="display: none;">
						<h2>Periodic Table</h2>
						<div class="dialog-close-btn"></div>
						<div id="periodictable" class="no-select"></div>
						<div class="footer">
							<button class="btn close btn-primary">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
