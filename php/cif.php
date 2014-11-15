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

/*
PHP script for mirroring CIF files form the Crystallography Open Database

Parameters:
- codid = {CODID}
*/

include_once("utility.php");

parse_str($_SERVER["QUERY_STRING"]);
header("Content-Type: text");
$cif = get_curl("http://www.crystallography.net/".$codid.".cif");

if(strpos($cif, "? ? ? ?") == false)
{
    echo $cif;
}
else
{
    http_response_code(404);
}
