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

include_once("utility.php");

error_reporting(0);
parse_str($_SERVER["QUERY_STRING"]);

header('content-type: application/json');

libxml_use_internal_errors(true);

$html =  http_get("https://plusone.google.com/_/+1/fastbutton?url=".urlencode($url));
$doc = new DOMDocument();
$doc -> loadHTML($html);
$counter = $doc -> getElementById('aggregateCount');
echo '{ "count": '.json_encode($counter -> nodeValue)."}";

libxml_clear_errors();
