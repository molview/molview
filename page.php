<?php
/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014, Herman Bergwerf
 *
 * MolView is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MolView is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with MolView.  If not, see <http://www.gnu.org/licenses/>.
 */

include_once("php/Parsedown.php");
include_once("php/utility.php");

error_reporting(0);
parse_str($_SERVER["QUERY_STRING"]);

$map = array(
	"readme" => "README.md",
	"changelog" => "CHANGELOG.md",
	"license" => "LICENSE.md",
	"legal" => "LEGAL.md",
	"thankyou" => "pages/thankyou.md",
	"iesupport" => "pages/iesupport.md",
	"htmlcanvas" => "pages/htmlcanvas.md",
	"tracking" => "pages/tracking.md",
	"400" => "pages/400.md",
	"401" => "pages/401.md",
	"403" => "pages/403.md",
	"404" => "pages/404.md",
	"500" => "pages/500.md"
);

$titleMap = array(
	"readme" => "README",
	"changelog" => "Changelog",
	"license" => "License",
	"legal" => "Legal",
	"thankyou" => "Thank you!",
	"iesupport" => "No support",
	"htmlcanvas" => "No support",
	"tracking" => "Event tracking",
	"400" => "Bad request",
	"401" => "Authorization required",
	"403" => "Forbidden",
	"404" => "Not found",
	"500" => "Internal server error"
);

$copyrightMap = array(
	"readme" => false,
	"changelog" => false,
	"license" => true,
	"legal" => true,
	"thankyou" => false,
	"iesupport" => false,
	"htmlcanvas" => false,
	"tracking" => false,
	"400" => false,
	"401" => false,
	"403" => false,
	"404" => false,
	"500" => false
);

$md = file_get_contents($map[$id]);
$renderer = new Parsedown();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, user-scalable=no" />

		<?php echo "<title>".$titleMap[$id]."</title>"; ?>

		<link rel="shortcut icon" <?php echo 'href="'.$root.'favicon-32x32.png"' ?> />
		<meta name="author" content="Herman Bergwerf" />

		<link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700" />
		<link type="text/css" rel="stylesheet" <?php echo 'href="'.$root.'build/molview-page.min.css"' ?> />
	</head>
	<body>
		<div id="header">
		<img id="brand" <?php echo 'src="'.$root.'img/logo.png"' ?> />
		<a id="return-to-molview" <?php echo 'href="'.$root.'"' ?>>
			<span id="brand-label">MolView</span>
		</a>
		</div>
		<div id="content">
			<?php echo $renderer->text($md); ?>
		</div>
		<?php if($copyrightMap[$id]) echo '<div id="footer">Copyright &copy; 2014 Herman Bergwerf</div>'; ?>
	</body>
</html>
