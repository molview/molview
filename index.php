<?php
include_once("php/utility.php");
include_once("php/load.php");
include_once("php/Mobile_Detect.php");

error_reporting(0);

$detect = new Mobile_Detect;
$touch = $detect -> isMobile() || $detect -> isTablet();

if(is_below_IE10())
{
	header('Location: internetExplorer');
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
Copyright (c) 2014, 2015 Herman Bergwerf

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
- q = search query (lookup using CIR)
- smiles = resolve SMILES string
- cid = load CID
- pdbid = load PDBID
- codid = load CIF from COD
- mode = balls || stick || vdw || wireframe || line
- chainType = ribbon || cylinders || btube || ctrace || bonds (alias for chainBonds=bonds)
- chainBonds = true || false
- chainColor = ss || spectrum || chain || residue || polarity || bfactor
- layout = model || sketcher || hsplit || vsplit
- menu = on || off
- dialog = about || help || share || embed
- bg = black || gray || white
-->

	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, user-scalable=no" />
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-capable" content="yes" />

		<link rel="shortcut icon" href="favicon-32x32.png" />
		<?php echo "<title>".$metadata["title"]."</title>"; ?>
		<meta name="author" content="Herman Bergwerf" />
		<meta name="keywords" <?php echo 'content="'.$metadata["keywords"].'"' ?> />

		<!-- Open Graph + Schema.org + Twitter Card -->
		<meta name="twitter:card" content="summary">
		<meta name="twitter:site" content="@molview">
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="MolView" />
		<?php
			//url
			echo '<meta property="og:url" content="http://'.$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"].'" />';

			//title
			echo '<meta name="twitter:title" property="og:title" content="'.$metadata["title"].'" />';
			echo '<meta itemprop="name" content="'.$metadata["title"].'" />';

			//description
			echo '<meta name="description" content="'.
			$metadata["description"].'" />';
			echo '<meta name="twitter:description" property="og:description" content="'.
			$metadata["description"].'" />';
			echo '<meta itemprop="description" content="'.
			$metadata["description"].'" />';

			//image
			if($metadata["image_url"] != "")
			{
				echo '<meta property="og:image" content="'.$metadata["image_url"].'" />';
				echo '<meta itemprop="image" content="'.$metadata["image_url"].'" />';
				echo '<meta name="twitter:image" content="'.$metadata["image_url"].'" />';
			}

			//special metadata
			echo '<meta itemprop="sameAs" content="'.$metadata["same_as"].'" />';
		?>

		<!-- CSS -->
		<link type="text/css" rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.css" />
		<link type="text/css" rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,700italic,400,300,700" />
		<link type="text/css" rel="stylesheet" href="build/molview-app.min.css" />
		<?php
			if($touch)
			{
				echo '<link id="theme-stylesheet" type="text/css" rel="stylesheet" href="build/molview-touch.min.css" media="screen" />';
			}
			else
			{
				echo '<link id="theme-stylesheet" type="text/css" rel="stylesheet" href="build/molview-desktop.min.css" media="screen" />';
			}
		?>

		<!-- JS -->
		<script type="text/javascript" src="build/molview-base.min.js"></script>
		<script type="text/javascript" src="build/molview-applib.min.js"></script>
		<script type="text/javascript" src="build/molview-datasets.min.js"></script>
		<script type="text/javascript" src="build/molview-core.min.js"></script>
		<script type="text/javascript" src="build/molview-molpad.min.js"></script>
		<script type="text/javascript" src="build/molview-app.min.js"></script>

		<!-- PHP data injection -->
		<script type="text/javascript">
			Model.JSmol.hq = <?php echo ($touch) ? "false" : "true"; ?>;
			MolView.touch = <?php echo ($touch) ? "true" : "false"; ?>;
			MolView.mobile = <?php echo $detect -> isMobile() ? "true" : "false"; ?>;
			MolView.layout = <?php echo '"'.$contentClass.'"'; ?>;

			Request.CIR.available = true;
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

			if(!Detector.canvas)
			{
				window.location = window.location.origin + window.location.pathname + "htmlCanvas";
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
		<svg width="0" height="0">
			<filter id="pubchemImageFilter" height="1" width="1" y="0" x="0" color-interpolation-filters="sRGB">
				<feColorMatrix
					in="SourceGraphic"
					type="matrix"
					values="1.05 0    0    0 0
					        0    1.05 0    0 0
					        0    0    1.05 0 0
					        0    0    0    1 0"></feColorMatrix>
			</filter>
		</svg>
		<div id="progress">
			<canvas id="progress-canvas"></canvas>
		</div>
		<div id="menu">
			<div id="menu-bar" class="hstack">
				<div id="brand"></div>
				<form id="search" class="hstack" action="index.php">
					<div class="input-wrapper">
						<button><i class="fa fa-search"></i></button>
						<input id="search-input" name="q" type="text" autocomplete="off" spellcheck="false" />
						<div class="input-focus"></div>
						<div id="search-dropdown" class="dropdown">
							<a class="dropdown-toggle"></a>
							<ul class="dropdown-menu dropdown-left">
								<li class="menu-item"><a id="action-show-search-layer">Show last search results</a></li>
								<li class="menu-header">Advanced search</li>
								<li class="menu-item"><a id="action-search-pubchem">PubChem Compounds</a></li>
								<li class="menu-item"><a id="action-search-rcsb">RCSB Protein Data Bank</a></li>
								<li class="menu-item"><a id="action-search-cod">Crystallography Open Database</a></li>
							</ul>
						</div>
					</div>
				</form>
				<ul id="main-menu" class="hstack">
					<li id="molview-dropdown" class="dropdown">
						<a class="dropdown-toggle">MolView</a>
						<ul class="dropdown-menu">
							<li class="menu-header">Layout</li>
							<li id="layout-menu">
								<a id="action-layout-model" <?php if($contentClass == "model") echo 'class="selected"' ?>></a>
								<a id="action-layout-hsplit" <?php if($contentClass == "hsplit") echo 'class="selected"' ?>></a>
								<br/>
								<a id="action-layout-vsplit" <?php if($contentClass == "vsplit") echo 'class="selected"' ?>></a>
								<a id="action-layout-sketcher" <?php if($contentClass == "sketcher") echo 'class="selected"' ?>></a>
							</li>
							<li class="menu-header">Theme</li>
							<li class="menu-item"><a id="action-theme-desktop" <?php echo !$touch ? 'class="radio checked"' : 'class="radio"'; ?>>Desktop</a></li>
							<li class="menu-item"><a id="action-theme-touch" <?php echo $touch ? 'class="radio checked"' : 'class="radio"'; ?>>Touch</a></li>
							<li class="menu-header">Information</li>
							<li class="menu-item"><a id="action-help">Help</a></li>
							<li class="menu-item"><a id="action-about">About</a></li>
						</ul>
					</li>
					<li id="tools-dropdown" class="dropdown">
						<a class="dropdown-toggle">Tools</a>
						<ul class="dropdown-menu">
							<li class="menu-header">Link</li>
							<!-- <li class="menu-item"><a id="action-share">Share</a></li> -->
							<li class="menu-item"><a id="action-embed">Embed</a></li>
							<li class="menu-header">Export</li>
							<li class="menu-item"><a id="action-export-sketcher-png">Structural formula image</a></li>
							<li class="menu-item"><a id="action-export-model-png">3D model image</a></li>
							<li class="menu-item"><a id="action-export-model">MOL file</a></li>
							<li class="menu-header">Chemical data</li>
							<li class="menu-item"><a id="action-data-infocard">Information card</a></li>
							<li class="menu-item"><a id="action-data-spectra">Spectroscopy</a></li>
							<li class="menu-item"><a id="model-source" class="disabled" target="_blank">3D model source</a></li>
							<li class="menu-header">Advanced search</li>
							<li class="menu-item"><a id="action-search-similarity">Similarity</a></li>
							<li class="menu-item"><a id="action-search-substructure">Substructure</a></li>
							<li class="menu-item"><a id="action-search-superstructure">Superstructure</a></li>
						</ul>
					</li>
					<li id="model-dropdown" class="dropdown">
						<a class="dropdown-toggle">Model</a>
						<ul class="dropdown-menu">
							<li class="menu-item"><a id="action-model-reset">Reset</a></li>
							<li class="menu-header">Representation</li>
							<li class="menu-item"><a id="action-model-balls" class="r-mode radio checked">Ball and Stick</a></li>
							<li class="menu-item"><a id="action-model-stick" class="r-mode radio">Stick</a></li>
							<li class="menu-item"><a id="action-model-vdw" class="r-mode radio">van der Waals Spheres</a></li>
							<li class="menu-item"><a id="action-model-wireframe" class="r-mode radio">Wireframe</a></li>
							<li class="menu-item"><a id="action-model-line" class="r-mode radio">Line</a></li>
							<li class="menu-header">Background</li>
							<li class="menu-item"><a id="action-model-bg-black" <?php echo 'class="model-bg radio'.(isset($bg) ? $bg == "black" ? ' checked"' : '"' : ' checked"'); ?> >Black</a></li>
							<li class="menu-item"><a id="action-model-bg-gray" <?php echo 'class="model-bg radio'.(isset($bg) ? $bg == "gray" ? ' checked"' : '"' : '"'); ?> >Gray</a></li>
							<li class="menu-item"><a id="action-model-bg-white" <?php echo 'class="model-bg radio'.(isset($bg) ? $bg == "white" ? ' checked"' : '"' : '"'); ?> >White</a></li>
							<li class="menu-header">Engine</li>
							<li class="menu-item"><a id="action-engine-glmol" class="radio checked">GLmol</a></li>
							<li class="menu-item"><a id="action-engine-jmol" class="radio">Jmol</a></li>
							<li class="menu-item"><a id="action-engine-cdw" class="radio">ChemDoodle</a></li>
							<li class="menu-header">Crystallography</li>
							<li class="menu-item"><a id="action-cif-unit-cell">Load unit cell</a></li>
							<li class="menu-item"><a id="action-cif-cubic-supercell">Load 2&times;2&times;2 supercell</a></li>
							<li class="menu-item"><a id="action-cif-flat-supercell">Load 1&times;3&times;3 supercell</a></li>
						</ul>
					</li>
					<li id="protein-dropdown" class="dropdown">
						<a class="dropdown-toggle">Protein</a>
						<ul class="dropdown-menu">
							<li class="menu-item"><a id="action-bio-assembly" class="check">Show bio assembly</a></li>
							<li class="menu-header">Chain representation</li>
							<li class="menu-item"><a id="action-chain-type-ribbon" class="chain-type radio checked">Ribbon</a></li>
							<li class="menu-item"><a id="action-chain-type-cylinders" class="chain-type radio">Cylinder and plate</a></li>
							<li class="menu-item"><a id="action-chain-type-btube" class="chain-type radio">B-factor tube</a></li>
							<li class="menu-item"><a id="action-chain-type-ctrace" class="chain-type radio">C-alpha trace</a></li>
							<li class="menu-divider"></li>
							<li class="menu-item"><a id="action-chain-type-bonds" class="check">Bonds</a></li>
							<li class="menu-header">Chain color scheme</li>
							<li class="menu-item"><a id="action-chain-color-ss" class="chain-color radio checked">Secondary structure</a></li>
							<li class="menu-item"><a id="action-chain-color-spectrum" class="chain-color radio">Spectrum</a></li>
							<li class="menu-item"><a id="action-chain-color-chain" class="chain-color radio">Chain</a></li>
							<li class="menu-item"><a id="action-chain-color-residue" class="chain-color radio">Residue</a></li>
							<li class="menu-item"><a id="action-chain-color-polarity" class="chain-color radio">Polarity</a></li>
							<li class="menu-item"><a id="action-chain-color-bfactor" class="chain-color radio">B-factor</a></li>
						</ul>
					</li>
					<li id="jmol-dropdown" class="dropdown">
						<a class="dropdown-toggle">Jmol</a>
						<ul class="dropdown-menu">
							<li class="menu-item"><a id="action-jmol-hq" class="check">High Quality</a></li>
							<li class="menu-item"><a id="action-jmol-clean" class="jmol-script">Clean</a></li>
							<li class="menu-header jmol-script jmol-calc">Calculations</li>
							<li class="menu-item"><a id="action-jmol-mep-lucent" class="jmol-script jmol-calc">MEP surface lucent</a></li>
							<li class="menu-item"><a id="action-jmol-mep-opaque" class="jmol-script jmol-calc">MEP surface opaque</a></li>
							<li class="menu-item"><a id="action-jmol-charge" class="jmol-script jmol-calc">Charge</a></li>
							<li class="menu-item"><a id="action-jmol-bond-dipoles" class="jmol-script jmol-calc">Bond dipoles</a></li>
							<li class="menu-item"><a id="action-jmol-net-dipole" class="jmol-script jmol-calc">Overall dipole</a></li>
							<li class="menu-item"><a id="action-jmol-minimize" class="jmol-script jmol-calc">Energy minimization</a></li>
							<li class="menu-header jmol-script">Measurement</li>
							<li class="menu-item"><a id="action-jmol-measure-distance" class="jmol-script jmol-picking radio">Distance</a></li>
							<li class="menu-item"><a id="action-jmol-measure-angle" class="jmol-script jmol-picking radio">Angle</a></li>
							<li class="menu-item"><a id="action-jmol-measure-torsion" class="jmol-script jmol-picking radio">Torsion</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<div id="content">
			<div id="main-layer" <?php echo 'class="layer '.$contentClass.'"' ?>>
				<!-- Dynamic onload layout -->
				<script type="text/javascript">
					MolView.query = getQuery();

					if(localStorage && localStorage["molview.theme"])
					{
						MolView.setTheme(localStorage["molview.theme"]);
					}

					if($(window).height() > $(window).width()
						&& !MolView.query.layout
						&& MolView.layout != "model") Actions.layout_hsplit();

					//compact menu bar
					MolView.setMenuLayout($(window).width() < 1100,
							$(window).width() < 1100 && !MolView.touch,
							$(window).width() < 390 && MolView.touch);
				</script>
				<div id="sketcher">
					<div id="molpad" class="sketcher">
						<div id="chem-tools" class="toolbar">
							<div class="toolbar-inner">
								<div id="action-mp-bond-single" class="tool-button primary-tool" title="Single bond"></div>
								<div id="action-mp-bond-double" class="tool-button primary-tool" title="Double bond"></div>
								<div id="action-mp-bond-triple" class="tool-button primary-tool" title="Triple bond"></div>
								<div id="action-mp-bond-wedge" class="tool-button primary-tool" title="Wedge bond"></div>
								<div id="action-mp-bond-hash" class="tool-button primary-tool" title="Hash bond"></div>
								<div class="vertical-separator"></div>
								<div id="action-mp-frag-benzene" class="tool-button primary-tool" title="Benzene"></div>
								<div id="action-mp-frag-cyclopropane" class="tool-button primary-tool" title="Cyclopropane"></div>
								<div id="action-mp-frag-cyclobutane" class="tool-button primary-tool" title="Cyclobutane"></div>
								<div id="action-mp-frag-cyclopentane" class="tool-button primary-tool" title="Cyclopentane"></div>
								<div id="action-mp-frag-cyclohexane" class="tool-button primary-tool" title="Cyclohexane"></div>
								<div id="action-mp-frag-cycloheptane" class="tool-button primary-tool" title="Cycloheptane"></div>
								<div class="vertical-separator"></div>
								<div id="action-mp-chain" class="tool-button primary-tool" title="Carbon chain"></div>
								<div id="action-mp-charge-add" class="tool-button primary-tool" title="Charge +">e<sup>+</sup></div>
								<div id="action-mp-charge-sub" class="tool-button primary-tool" title="Charge -">e<sup>&minus;</sup></div>
							</div>
						</div>
						<div id="edit-tools" class="toolbar">
							<div class="toolbar-inner hstack">
								<div id="action-mp-clear" class="tool-button tool-button-horizontal" title="Clear all"></div>
								<div id="action-mp-eraser" class="tool-button tool-button-horizontal primary-tool" title="Erase"></div>
								<div class="horizontal-separator"></div>
								<div id="action-mp-undo" class="tool-button tool-button-horizontal tool-button-disabled" title="Undo"></div>
								<div id="action-mp-redo" class="tool-button tool-button-horizontal tool-button-disabled" title="Redo"></div>
								<<div class="horizontal-separator"></div>
								<div id="action-mp-drag" class="tool-button tool-button-horizontal primary-tool" title="Drag atoms and bonds"></div>
								<div id="action-mp-rect" class="tool-button tool-button-horizontal primary-tool" title="Rectangle selection"></div>
								<div id="action-mp-lasso" class="tool-button tool-button-horizontal primary-tool" title="Lasso selection"></div>
								<div class="horizontal-separator"></div>
								<div id="action-mp-color-mode" class="tool-button tool-button-horizontal enabled" title="Toggle color mode"></div>
								<div id="action-mp-skeletal-formula" class="tool-button tool-button-horizontal enabled" title="Toggle skeletal formula"></div>
								<div id="action-mp-center" class="tool-button tool-button-horizontal" title="Center structure"></div>
								<div class="horizontal-separator"></div>
								<div id="action-mp-clean" class="tool-button tool-button-horizontal" title="Clean structure"></div>
								<div id="action-resolve" class="tool-button tool-button-horizontal" title="Update 3D view">2D to 3D</div>
							</div>
						</div>
						<div id="elem-tools" class="toolbar">
							<div class="toolbar-inner">
								<div id="action-mp-atom-c" class="tool-button primary-tool tool-element element-colored" title="Carbon">C</div>
								<div id="action-mp-atom-h" class="tool-button primary-tool tool-element element-colored" title="Hydrogen">H</div>
								<div id="action-mp-atom-n" class="tool-button primary-tool tool-element element-colored" title="Nitrogen">N</div>
								<div id="action-mp-atom-o" class="tool-button primary-tool tool-element element-colored" title="Oxygen">O</div>
								<div id="action-mp-atom-p" class="tool-button primary-tool tool-element element-colored" title="Phosphorus">P</div>
								<div id="action-mp-atom-s" class="tool-button primary-tool tool-element element-colored" title="Sulfur">S</div>
								<div id="action-mp-atom-f" class="tool-button primary-tool tool-element element-colored" title="Fluorine">F</div>
								<div id="action-mp-atom-cl" class="tool-button primary-tool tool-element element-colored" title="Chlorine">Cl</div>
								<div id="action-mp-atom-br" class="tool-button primary-tool tool-element element-colored" title="Bromine">Br</div>
								<div id="action-mp-atom-i" class="tool-button primary-tool tool-element element-colored" title="Iodine">I</div>
								<div id="action-mp-periodictable" class="tool-button primary-tool" title="Periodic Table">...</div>
							</div>
						</div>
						<div id="molpad-canvas-wrapper"></div>
					</div>
				</div>
				<div id="model" <?php
					if(isset($bg))
					{
						echo 'style="background:'.($bg != "white" ? $bg != "gray" ?
							"#000000" : "#cccccc" : "#ffffff").'"';
					}
				?>>
					<!-- Get preferred model background color from localStorage -->
					<script type="text/javascript">
						if(localStorage && localStorage["model.background"])
						{
							var c = localStorage["model.background"];
							$("#model").css("background", c == "gray" ? "#ccc" : c);
						}
					</script>
					<div id="chemdoodle" class="render-engine" style="display: none;">
						<canvas id="chemdoodle-canvas"></canvas>
					</div>
					<div id="jsmol" class="render-engine" style="display: none;"></div>
					<div id="glmol" class="render-engine" style="display: none;"></div>
				</div>
			</div>
			<div id="search-layer" class="layer" style="display: none;">
				<div class="btn-group-bar">
					<button class="btn close btn-primary "><i class="fa fa-arrow-left"></i> Return</button>
				</div>
				<div class="container"></div>
				<div id="action-load-more-pubchem" class="load-more" style="display: none;"></div>
				<div id="action-load-more-rcsb" class="load-more" style="display: none;"></div>
				<div id="action-load-more-cod" class="load-more" style="display: none;"></div>
			</div>
			<div id="infocard-layer" class="layer data-layer" style="display: none;">
				<div class="btn-group-bar">
					<button class="btn close btn-primary "><i class="fa fa-arrow-left"></i> Return</button>
				</div>
				<div id="properties-wrapper">
					<div id="general-properties">
						<div id="molecule-image-wrapper" class="properties-block">
							<img id="molecule-image" alt=""
								style="-webkit-filter: url('#pubchemImageFilter');
										   moz-filter: url('#pubchemImageFilter');
										   -ms-filter: url('#pubchemImageFilter');
										    -o-filter: url('#pubchemImageFilter');
										       filter: url('#pubchemImageFilter');*"/>
						</div>
						<div class="properties-block">
							<div id="molecule-info">
								<h3 id="molecule-title"></h3>
								<p id="molecule-description"></p>
							</div>
							<table id="common-chem-props">
								<tr id="prop-formula-wrapper"><td>Formula</td><td id="prop-formula" class="chemprop"></td></tr>
								<tr id="prop-mw-wrapper"><td>Molecular weight</td><td id="prop-mw" class="chemprop"></td></tr>
								<tr id="prop-donors-wrapper"><td>Proton donors</td><td id="prop-donors" class="chemprop"></td></tr>
								<tr id="prop-acceptors-wrapper"><td>Proton acceptors</td><td id="prop-acceptors" class="chemprop"></td></tr>
							</table>
							<h3 id="percent-composition-title">Percent composition</h3>
							<table id="percent-composition-table"></table>
						</div>
					</div>
					<div id="prop-sysname-wrapper" class="chem-identifier">
						<label for="prop-sysname">Systematic name</label>
						<input type="text" id="prop-sysname" class="input chemprop" autocomplete="off" spellcheck="false" />
					</div>
					<div id="prop-canonicalsmiles-wrapper" class="chem-identifier">
						<label for="prop-canonicalsmiles">Canonical SMILES</label>
						<input type="text" id="prop-canonicalsmiles" class="input chemprop" autocomplete="off" spellcheck="false" />
					</div>
					<div id="prop-isomericsmiles-wrapper" class="chem-identifier">
						<label for="prop-isomericsmiles">Isomeric SMILES</label>
						<input type="text" id="prop-isomericsmiles" class="input chemprop" autocomplete="off" spellcheck="false" />
					</div>
					<div id="prop-inchikey-wrapper" class="chem-identifier">
						<label for="prop-inchikey">InChiKey</label>
						<input type="text" id="prop-inchikey" class="input chemprop" autocomplete="off" spellcheck="false" />
					</div>
					<div id="prop-inchi-wrapper" class="chem-identifier">
						<label for="prop-inchi">InChi</label>
						<input type="text" id="prop-inchi" class="input chemprop" autocomplete="off" spellcheck="false" />
					</div>
					<div id="prop-cas-wrapper" class="chem-identifier">
						<label for="cas-sysname">CAS Number</label>
						<input type="text" id="prop-cas" class="input chemprop" autocomplete="off" spellcheck="false" />
					</div>
					<div id="prop-csid-wrapper" class="chem-identifier">
						<label for="prop-csid">Chemspider ID
							<a id="chemspider-link" class="link chem-link" target="_blank"><i class="fa fa-external-link"></i></a>
						</label>
						<input type="text" id="prop-csid" class="input chemprop" autocomplete="off" spellcheck="false" />
					</div>
					<div id="prop-cid-wrapper" class="chem-identifier">
						<label for="prop-cid">PubChem Compound ID
							<a id="pubchem-link" class="link chem-link" target="_blank"><i class="fa fa-external-link"></i></a>
						</label>
						<input type="text" id="prop-cid" class="input chemprop" autocomplete="off" spellcheck="false" />
					</div>
				</div>
			</div>
			<div id="spectra-layer" class="layer data-layer" style="display: none;">
				<div class="btn-group-bar">
					<button class="btn close btn-primary "><i class="fa fa-arrow-left"></i> Return</button>
					<select id="spectrum-select"></select>
					<button id="action-export-spectrum-png" class="btn"><i class="fa fa-download"></i> Download PNG image</button>
					<button id="action-export-spectrum-jcamp" class="btn"><i class="fa fa-download"></i> Download JCAMP data</button>
					<a id="spectrum-nist-source" class="btn" target="_blank"><i class="fa fa-external-link"></i> NIST source</a>
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
						<img id="welcome-logo" src="img/logo.svg" alt="" />
						<img id="welcome-mark" src="img/mark.svg" alt="MolView" />
						<a id="agpl-logo-wrapper" target="_blank" href="http://github.com/molview">
							<img id="agpl-logo" src="img/agpl.svg" alt="AGPL">
						</a>
						<div id="welcome-loading-msg">LOADING&hellip;</div>
						<div id="welcome-button-bar" class="btn-group" style="display: none;">
							<button id="action-start-help" class="btn btn-large">Get started</button>
							<button class="btn close btn-large btn-primary">Continue</button>
						</div>
						<div class="btn-group">
							<a class="btn" target="_blank" title="YouTube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a>
							<a class="btn" target="_blank" title="@molview" href="https://twitter.com/molview">Twitter</a>
							<a class="btn" target="_blank" title="Facebook page" href="https://www.facebook.com/molview">Facebook</a>
							<a class="btn" target="_blank" title="+MolView" href="https://google.com/+MolViewOrganization/about" rel="publisher">Google+</a>
							<a class="btn" target="_blank" title="MolView Blog" href="http://blog.molview.org">Blog</a>
						</div>
						<p id="allow-tracking-wrapper">
							<input id="allow-tracking" type="checkbox" />
							<script type="text/javascript">
								$("#allow-tracking").prop("checked", Preferences.get("molview", "allow_tracking", true))
							</script>
							<label for="allow-tracking">Allow MolView to collect interaction data (<a class="gray" href="tracking">read more</a>)</label>
						</p>
						<a class="gray" href="legal" target="_blank">Terms of Use</a>
					</div>
					<div class="dialog" id="about-dialog" style="display: none;">
						<h2>About</h2>
						<p>MolView is an intuitive, Open-Source web-application to make science and education more awesome! MolView is mainly intended as web-based data visualization platform. You can use MolView to search through different scientific databases including compound databases, protein databases and spectral databases, and view records from these databases as interactive visualizations using WebGL and HTML5 technologies. This web application is built on top of the JavaScript libraries and online services listed below. The <a class="link" href="http://chemagic.com/JSmolVMK2.htm" target="_blank" title="Virtual Model Kit">Virtual Model Kit</a> has been a source of inspiration for the birth of this project.</p>
						<ul>
							<li>JavaScript libraries
								<ul>
									<li><a class="link" href="http://ggasoftware.com/opensource/ketcher" target="_blank" title="Ketcher">Ketcher</a>: Chemical 2D data reader/writer</li>
									<li><a class="link" href="http://webglmol.sourceforge.jp/index-en.html" target="_blank" title="GLmol">GLmol v0.47</a>: primary 3D render engine</li>
									<li><a class="link" href="http://jmol.sourceforge.net/" target="_blank" title="JSmol">JSmol</a>: 3D render engine</li>
									<li><a class="link" href="http://web.chemdoodle.com/" target="_blank" title="ChemDoodle Web">ChemDoodle Web Components v6.0.1</a>: 3D render engine and spectrum display</li>
								</ul>
							</li>
							<li>Databases/REST API's
								<ul>
									<li><a class="link" href="http://cactus.nci.nih.gov/chemical/structure" target="_blank" title="NCI/CADD Chemical Identifier Resolver API">NCI/CADD Chemical Identifier Resolver</a></li>
									<li><a class="link" href="http://www.rcsb.org/pdb/software/rest.do" target="_blank" title="RCSB Protein Databank API">RCSB Protein Data Bank</a> (~100.000 macromolecules)</li>
									<li><a class="link" href="https://pubchem.ncbi.nlm.nih.gov/pug_rest/PUG_REST.html" target="_blank" title="The PubChem Project API">The PubChem Project</a> (~51 million compounds)</li>
									<li><a class="link" href="http://www.crystallography.net/" target="_blank" title="COD">Crystallography Open Database</a> (~300.000 crystals)</li>
									<li><a class="link" href="http://webbook.nist.gov/chemistry" target="_blank" title="NIST Chemistry WebBook Reference">NIST Chemistry WebBook</a> (~30.000 spectra)</li>
									<li><a class="link" href="http://www.nmrdb.org/" target="_blank" title="NMRdb.org">NMR Database</a></li>
									<li><a class="link" href="http://mymemory.translated.net/doc/spec.php" target="_blank" title="MyMemory API">MyMemory translation API</a></li>
								</ul>
							</li>
						</ul>
						<p id="about-links">
							MolView v2.4
							&nbsp;+&nbsp;
							<a class="link" href="legal" target="_blank">Terms of Use</a>
							<br/>
							Copyright &copy; 2014, 2015 <a class="link" target="_blank" rel="author" title="Personal website" href="https://hermanbergwerf.com">Herman Bergwerf</a>
							&nbsp;+&nbsp;
							<a class="link" href="license" target="_blank">License</a>
							&nbsp;+&nbsp;
							<a class="link" href="https://github.com/molview" target="_blank">GitHub</a>
							<br/>
							<a class="link" target="_blank" title="Chrome App" href="https://chrome.google.com/webstore/detail/molview/nogcacamdkipgkfpfiakaoamdnihinnm">Chrome Web Store</a>
							&nbsp;+&nbsp;
							<a class="link" target="_blank" title="YouTube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a>
							&nbsp;+&nbsp;
							<a class="link" target="_blank" title="@molview" href="https://twitter.com/molview">Twitter</a>
							&nbsp;+&nbsp;
							<a class="link" target="_blank" title="Facebook page" href="https://www.facebook.com/molview">Facebook</a>
							&nbsp;+&nbsp;
							<a class="link" target="_blank" title="+MolView" href="https://google.com/+MolViewOrganization" rel="publisher">Google+</a>
							&nbsp;+&nbsp;
							<a class="link" target="_blank" title="+MolView" href="http://blog.molview.org">Blog</a>
							&nbsp;+&nbsp;
							<a class="link" target="_blank" title="Mail" href="mailto:info@molview.org">info@molview.org</a>
						</p>
						<div class="footer">
							<button class="btn close btn-primary">Continue</button>
						</div>
					</div>
					<div class="dialog" id="help-dialog" style="display: none;">
						<h2>Help</h2>
						<?php
							if($touch)
							{
								echo '<div class="alert-bar alert-danger" style="margin-bottom: 20px;"><b>Important!</b> you can slide toolbars which don\'t fit in your screen.</div>';
							}
						?>
						<p>Download PDF: <a class="link" href="docs/manual.pdf" target="_blank">docs/manual.pdf</a></p>
						<p>Click one of the subjects below to learn more. You can also watch some videos on <a class="link" target="_blank" title="YouTube Channel" href="https://www.youtube.com/channel/UCRP9nXCC59TMlqc-bk1mi3A">YouTube</a> to get started.</p>
						<h3>Subjects</h3>
						<div class="expandable">
							<div class="expandable-title"><span>Drawing structural formulas</span></div>
							<div class="expandable-content">
								<p>MolView consists of two main parts, a structural formula editor and a 3D model viewer. The structural formula editor is surround by three toolbars which contain the tools you can use in the editor. Once you’ve drawn a molecule, you can click the 2D to 3D button to convert the molecule into a 3D model which is then displayed in the viewer. Below is a list of all sketch tools.</p>
								<h4>Top toolbar</h4>
								<p style="margin-top: 10px;"><img style="display: inline-block; max-height: 40px;" src="img/help/SketcherTopToolbar.jpg" alt="Top toolbar" /></p>
								<ul>
									<li><b>Trash:</b> clear the entire canvas</li>
									<li><b>Eraser:</b> erase atoms, bonds or the current selection</li>
									<li><b>Undo/redo:</b> undo or redo your recent changes</li>
									<li>
										<b>Selection tools:</b> all these tool can be used to drag the current selection or individual atoms and bonds. You can add/remove atoms and bonds to the selection by clicking them. If you have selected a separate fragment, you can rotate it by dragging an atom in the selection. You can delete the selection using the <b>DEL</b> key or using the eraser tool. Each tool has different behavior for the right mouse button:
										<ul>
											<li><b>Drag:</b> move the entire molecule (you can already use the left mouse button for this)</li>
											<li><b>Rectangle select:</b> select atoms and bonds using a rectangular selection area</li>
											<li><b>Lasso select:</b> select atoms and bonds by drawing a freehand selection area</li>
										</ul>
									</li>
									<li><b>Color mode:</b> display atoms and bonds using colors</li>
									<li><b>Full mode:</b> displays all C and H atoms instead of skeletal display</li>
									<li><b>Center:</b> centers the whole molecule</li>
									<li><b>Clean:</b> cleans the structural formula using an external service</li>
									<li><b>2D to 3D:</b> converts the structural formula into a 3D model</li>
								</ul>
								<h4>Left toolbar</h4>
								<p style="margin-top: 10px;"><img style="max-height: 40px; display: inline-block;" src="img/help/SketcherLeftToolbar.jpg" alt="Left toolbar" /></p>
								<ul>
									<li><b>Bonds:</b> pick one of the bond types (single, double, triple, up, down) and add or modify bonds</li>
									<li><b>Fragments:</b> pick one of the fragments (benzene, cyclopropane, etc.) and add fragments</li>
									<li><b>Chain:</b> create a chain of carbon atoms</li>
									<li><b>Charge:</b> increment (+) or decrement (-) the charge of atoms</li>
								</ul>
								<h4>Right toolbar</h4>
								<p style="margin-top: 10px;"><img style="max-height: 40px; display: inline-block;" src="img/help/SketcherRightToolbar.jpg" alt="Right toolbar" /></p>
								<p>In this toolbar you can select from a number of elements, you can also pick an element from the periodic table using the last button. You can use the element to create new atoms or modify existing atoms.</p>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><span>Finding structures</span></div>
							<div class="expandable-content">
								<p><img style="max-height: 40px; display: inline-block;" src="img/help/SearchBar.jpg" alt="Search bar" /></p>
								<p>You can load molecules from large databases like PubChem and RCSB using the search form located on the left side of the menu-bar. Just type what you are looking for and a list of available molecules will appear.</p>
								<p>You can also click on the dropdown button next to the search field to select a specific database. This will perform a more extensive search on the selected database. Currently, three big databases are supported:</p>
								<ol>
									<li><b>PubChem</b></li>
									<li><b>The RCSB Protein Data Bank</b></li>
									<li><b>The Crystallography Open Database</b></li>
								</ol>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><span>Tools</span></div>
							<div class="expandable-content">
								<p>The <b>Tools</b> menu contains several utility functions which are listed below.</p>
								<h4>Link</h4>
								<p>You can embed or share a specific compound, macromolecule or crystal using the provided URL or HTML code. Note that the linked structure is the one which is currently displayed in the model window. You can also copy the URL from the address bar in order to link to the current structure.</p>
								<h4>Export</h4>
								<p>Export options:</p>
								<ul>
									<li><b>Structural formula image:</b> sketcher snapshot (PNG with alpha channel)</li>
									<li><b>3D model image:</b> model snapshot (PNG,  alpha channel in Glmol and ChemDoodle)</li>
									<li><b>MOL file:</b> exports a MDL Molfile from the 3D model <b>(common molecules)</b></li>
									<li><b>PDB file:</b> exports a Protein Data Bank file from the 3D model <b>(macromolecules)</b></li>
									<li><b>CIF file:</b> exports a Crystallographic Information File from the 3D model <b>(crystal structures)</b></li>
								</ul>
								<h4>Information card</h4>
								<p>This collects and displays information about the structural formula.</p>
								<h4>Spectroscopy</h4>
								<p>This shows a new layer where you can view molecular spectra of the current structural formula (loaded from the Sketcher) More details are covered in the Spectroscopy chapter.</p>
								<h4>3D model resource</h4>
								<p>This redirects you to the web-page for the current 3D model on the website of its source database (except when the model is resolved using the Chemical Identifier Resolver)</p>
								<h4>Advanced search</h4>
								<p>These functions allow you to perform some advanced searches through the PubChem database using the structural formula from the sketcher.</p>
								<ol>
									<li><b>Similarity search:</b> search for compounds with a similar structural formula</li>
									<li><b>Substructure search:</b> search for compounds with the current structure as subset</li>
									<li><b>Superstructure search:</b> search for compounds with the current structure as superset</li>
								</ol>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><span>Spectroscopy</span></div>
							<div class="expandable-content">
								<p>You can open the Spectroscopy view via <b>Tools > Spectroscopy</b>. You can view three kinds of molecular spectra.</p>
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
							<div class="expandable-title"><span>3D model</span></div>
							<div class="expandable-content">
								<p>The <b>Model</b> menu contains some general functions for the 3D model.</p>
								<h4>Reset</h4>
								<p>This function sets the model position, zoom and rotation back to default.</p>
								<h4>Representation</h4>
								<p>You can choose from a list of different molecule representations including; ball and stick, stick, van der Waals spheres, wireframe and lines. Macromolecules are automatically drawn using ribbons.</p>
								<h4>Background</h4>
								<p>You can switch between a black, gray or white background. The default background is black (exported images from GLmol or ChemDoodle have a transparent background)</p>
								<h4>Engines</h4>
								<p>You can choose from three different render engines: <b>GLmol</b>, <b>Jmol</b> and <b>ChemDoodle</b>. GLmol is used as default render engine. GLmol and ChemDoodle are based on WebGL, a browser technology to support 3D graphics. If WebGL is not available in your browser, Jmol will be used for all rendering.</p>
								<p>MolView automatically switches to:</p>
								<ol>
									<li><b>Jmol</b> if you execute functions from the Jmol menu</li>
									<li><b>GLmol</b> if you load macromolecules (due to significant higher performance)</li>
									<li><b>ChemDoodle</b> if you load a crystal structure (GLmol cannot render crystal structures)</li>
								</ol>
								<p>You might want to switch back to GLmol when you do no longer need Jmol or ChemDoodle since GLmol has a better performance.</p>
								<p>Note that macromolecules are drawn slightly different in each engine. ChemDoodle provides the finest display. You should, however, avoid using ChemDoodle for very large macromolecules.</p>
								<h4>Model transformation</h4>
								<p>You can rotate, pan and zoom the 3D model. Use the right button for rotation, the middle button for translation (except for ChemDoodle) and the scrollwheel for zooming. On touch devices, you can rotate the model with one finger and scale the model using two fingers.</p>
								<h4>Crystallography</h4>
								<p>You can load an array of crystal cells (2x2x2 or 1x3x3) or a single unit cell when viewing crystal structures.</p>
								<h4>Fog and clipping</h4>
								<p>When you are viewing large structures, like proteins, it can be useful to hide a certain part using fog or a clipping plane. GLmol offers a few options to do this.</p>
								<ol>
									<li><b>Fog:</b> you can move the fog forward by dragging the mouse <b>up</b> while holding <b>CTRL + SHIFT</b> (drag in the opposite direction to move the fog backward)</li>
									<li><b>Clipping plane:</b> you can move a frontal clipping plane into the structure by dragging the mouse to the <b>left</b> while holding <b>CTRL + SHIFT</b> (drag in the opposite direction to move the clipping plane back)</li>
								</ol>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><span>Protein display</span></div>
							<div class="expandable-content">
								<p>The <b>Protein</b> menu offers a number of protein display settings including different color schemes and different chain representations.</p>
								<h4>Show bio assembly</h4>
								<p>When loading a protein structure, MolView shows the asymmetric unit by default. This function allows you to view the full biological unit instead.</p>
								<h4>Chain representation</h4>
								<p>You can choose from four different chain representations. You can also view the full chain structure by enabling the <b>Bonds</b> option.</p>
								<ol>
									<li><b>Ribbon:</b> draws ribbon diagram <i>(default representation)</i></li>
									<li><b>Cylinder and plate:</b> solid cylinders for α-helices and solid plates for β-sheets</li>
									<li><b>B-factor tube:</b> tube with B-factor as  thickness <i>(thermal motion)</i></li>
									<li><b>C-alpha trace:</b> lines between central carbon atom in amino-acids <i>(very fast rendering)</i></li>
								</ol>
								<h4>Chain coloring</h4>
								<p>You can choose from six chain color schemes.</p>
								<ol>
									<li><b>Secondary structures:</b> different colors for α-helices, β-sheets, etc.</li>
									<li><b>Spectrum:</b> color spectrum <i>(rainbow)</i></li>
									<li><b>Chain:</b> each chains gets a different color</li>
									<li><b>Residue:</b> all amino-acid residues are colored differently</li>
									<li><b>Polarity:</b> colors polar amino-acids red and non polar amino-acids white</li>
									<li><b>B-factor:</b> blue for low B-factor and red for high B-factor <i>(if provided)</i></li>
								</ol>
							</div>
						</div>
						<div class="expandable">
							<div class="expandable-title"><span>Advanced Jmol tools</span></div>
							<div class="expandable-content">
								<p>The <b>Jmol</b> menu offers some awesome Jmol-only functions and calculations.</p>
								<h4>Clear</h4>
								<p>Clears all executed calculations and measurements.</p>
								<h4>High Quality</h4>
								<p>Enables High Quality rendering in Jmol (enabled by default on fast devices) When turned off, anti-aliasing is disabled and the model is drawn using lines while transforming it.</p>
								<h4>Calculations</h4>
								<p>You can perform the following Jmol calculations in Jmol:</p>
								<ul>
									<li><b>MEP surface lucent/opaque:</b> calculates and projects molecular electrostatic potential on a translucent or opaque van der Waals surface</li>
									<li><b>Charge:</b> calculates and projects atomic charge as text label and white to atom color gradient</li>
									<li><b>Bond dipoles:</b> calculates and draws individual bond dipoles</li>
									<li><b>Overall dipole:</b> calculates and draws net bond dipole</li>
									<li><b>Energy minimization:</b> executes an interactive MMFF94 energy minimization <i>(note that this function only executes a maximum of 100 minimization steps at a time)</i></li>
								</ul>
								<h4>Measurement</h4>
								<p>You can measure distance, angle and torsion using Jmol. You can activate and deactivate one of these measurement types via the Jmol menu.</p>
								<ul>
									<li><b>Distance</b> distance between two atoms in nm</li>
									<li><b>Angle</b> angle between two bonds in degrees</li>
									<li><b>Torsion</b> torsion between four atoms in degrees</li>
								</ul>
								<p>Note that in some cases, the resolved 3D model is only an approach of the real molecule, this means you have to execute an <b>Energy minimization</b> in order to do reliable measurements.</p>
							</div>
						</div>
						<p>
							If you still have questions, found bugs or want to request new features. You can discuss them with me via social media or send me an email.
							<ul>
								<li>Twitter: <a class="link" target="_blank" title="Twitter page" href="https://twitter.com/molview">@molview</a></li>
								<li>Facebook: <a class="link" target="_blank" title="Facebook page" href="https://www.facebook.com/molview">MolView</a></li>
								<li>Google Plus: <a class="link" target="_blank" title="Google+ page" href="https://google.com/+MolViewOrganization" rel="publisher">+MolView</a></li>
								<li>Mail: <a class="link" target="_blank" title="Mail adress" href="mailto:support@molview.org">support@molview.org</a></li>
							</ul>
						</p>
						<div class="footer">
							<button class="btn close btn-primary">Close</button>
						</div>
					</div>
					<div class="dialog" id="share-dialog" style="display: none;">
						<h2>Share</h2>
						<div class="alert-box">
							<span id="share-2d-not-3d" class="alert-bar">Note: the strutural formula is not the same structure as the 3D model</span>
						</div>
						<div id="share-dialog-social" class="social">
							<div class="share share-facebook"></div>
							<div class="share share-twitter"></div>
							<div class="share share-googleplus"></div>
						</div>
						<p style="margin: 10px;">
							You can use the URL or below to link to the current 3D model.
						</p>
						<input id="share-link" class="input" type="text" autocomplete="off" spellcheck="false" />
						<div class="footer">
							<button class="btn close btn-primary">Close</button>
						</div>
					</div>
					<div class="dialog" id="embed-dialog" style="display: none;">
						<h2>Embed</h2>
						<div class="alert-box">
							<span id="embed-2d-not-3d" class="alert-bar">Note: the strutural formula is not the same structure as the 3D model</span>
						</div>
						<!-- <div class="danger-box">
							<span class="alert-bar">This embedding API is depreciated and will be removed in MolView 3. Be sure to follow the MolView Blog at <a class="link" href="http://blog.molview.org">http://blog.molview.org</a> to stay updated about changes to the embedding API.</span>
						</div> -->
						<h4>Width</h3>
						<input id="embed-width" class="input" type="text" value="500px" autocomplete="off" spellcheck="false" /><br/>
						<h4>Height</h4>
						<input id="embed-height" class="input" type="text" value="300px" autocomplete="off" spellcheck="false" />
						<h4>HTML code</h4>
						<p style="margin: 10px 0;">
							You can use the HTML code below to embed the current 3D model in your website.
						</p>
						<input id="embed-code" class="input" type="text" autocomplete="off" spellcheck="false" />
						<div class="footer">
							<button class="btn close btn-primary">Close</button>
						</div>
					</div>
					<div class="dialog" id="periodictable-dialog" style="display: none;">
						<h2>Periodic Table</h2>
						<div id="periodictable"></div>
						<div class="footer">
							<button class="btn close btn-primary">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
