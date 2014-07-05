<?php
/*
PHP script for mirroring CIF files form the Crystallography Open Database

Parameters:
- codid = {COD-ID}
*/

parse_str($_SERVER["QUERY_STRING"]);
echo file_get_contents("http://www.crystallography.net/".$codid.".cif");
?>

