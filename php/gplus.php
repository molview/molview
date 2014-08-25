<?php
header('content-type: application/json');

parse_str($_SERVER["QUERY_STRING"]);

libxml_use_internal_errors(true);

$html =  file_get_contents("https://plusone.google.com/_/+1/fastbutton?url=".urlencode($url));
$doc = new DOMDocument();
$doc -> loadHTML($html);
$counter = $doc -> getElementById('aggregateCount');
echo '{ "count": '.$counter -> nodeValue."}";

libxml_clear_errors();
