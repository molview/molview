<?php
/*
PHP script for mirroring CIF files form the Crystallography Open Database

Parameters:
- codid = {COD-ID}
*/

parse_str($_SERVER["QUERY_STRING"]);
header("Content-Type: text");
$cif = file_get_contents("http://www.crystallography.net/".$codid.".cif");

if(strpos($cif, "? ? ? ?") == false)
{
    echo $cif;
}
else
{
    header("HTTP/1.0 404 Not Found");
}
?>
