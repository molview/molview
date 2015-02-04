<?php
/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014, 2015 Herman Bergwerf
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

/*
PHP script for mirroring metadata images

@param dbid Database ID
@param i    Database index
*/

include_once("utility.php");

error_reporting(0);
parse_str($_SERVER["QUERY_STRING"]);

if($id == "cid")
{
	header("Content-Type: image/png");
	echo_curl("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/".$i."/png?record_type=2d");
	exit;
}
else if($id == "pdb")
{
	header("Content-Type: image/jpeg");
	echo_curl("http://www.rcsb.org/pdb/images/".strtoupper($i)."_bio_r_500.jpg");
	exit;
}
