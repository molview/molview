<?php
/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/*
PHP script for mirroring CIF files form the Crystallography Open Database

@param  codid
@return CIF file or HTTP error
*/

include_once("utility.php");

parse_str($_SERVER["QUERY_STRING"], $params);
$codid = $params["codid"] ?? "";

header("Content-Type: text");

//allow embed.molview.org and molview.org
$origin = $_SERVER["HTTP_ORIGIN"];
if($origin == 'http://molview.org' || $origin == 'https://embed.molview.org')
{
	header("Access-Control-Allow-Origin: ".$origin);
}

//connect to cod
$cod = new mysqli("www.crystallography.net", "cod_reader", "", "cod");
if($cod -> connect_errno > 0)
{
	http_response_code(500);
	echo "Internal Error";
	return;
}

//lookup record in database
$query = 'SELECT flags FROM data WHERE file="'.$codid.'"';
if($row = $cod -> query($query) -> fetch_row())
{
	$cod -> close();
	if(strpos($row[0], "has coordinates") !== false)
	{
		//get cif
		$cif = http_get("http://www.crystallography.net/".$codid.".cif");
		if($cif === false)
		{
			http_response_code(404);
			echo "Not Found";
			return;
		}
		else
		{
			echo $cif;
			return;
		}
	}
	else
	{
		http_response_code(404);
		echo "Not Found";
		return;
	}
}
else
{
	$cod -> close();
	http_response_code(404);
	echo "Not Found";
	return;
}
