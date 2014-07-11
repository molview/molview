<?php
/*
PHP script for processing and retrieving data from the Crystallography Open Database

Parameters:
- q = {query}
- codids = {COD-ID,COD-ID,COD-ID}
- type = search (for {query}) || information (for {COD-IDs}) || smiles (for COD-IDs)
*/

//ini_set("display_errors", "on");
error_reporting(0);
parse_str($_SERVER["QUERY_STRING"]);

$cod_search_query = 'SELECT file
	FROM data
	WHERE (mineral LIKE ? OR commonname LIKE ? OR chemname LIKE ?)
	ORDER BY CHAR_LENGTH(formula) ASC
	LIMIT 100';
$cod_deep_search_query = 'SELECT file
	FROM data
	WHERE title LIKE ?
	ORDER BY CHAR_LENGTH(formula) ASC
	LIMIT 100';
$cod_csid_search_query = 'SELECT cod_id
	FROM chemspider_x_cod
	WHERE ext_id = ?
	LIMIT 100';

//connect to COD MySQL
$cod = new mysqli("www.crystallography.net", "cod_reader", "", "cod");
if($cod -> connect_errno > 0) die("Unable to connect to COD [".$cod -> connect_error."]");

function cod_search($query, $value, $params, $three)
{
	global $cod;
	
	if($stmt = $cod -> prepare($query))
	{
		if($three) $stmt -> bind_param($params, $value, $value, $value);
		else $stmt -> bind_param($params, $value);
		$stmt -> execute();
		
		$ret = array();
		$stmt -> bind_result($row);
		while($stmt -> fetch()) array_push($ret, $row);
		
		$stmt -> close();
		return $ret;
	}
	else return false;
}

//ChemSpider search
function cscod_search($q)
{
	global $cod_csid_search_query;
	
	$csid = file("http://cactus.nci.nih.gov/chemical/structure/".$q."/chemspider_id");
	if(count($csid) > 1) $csid = $csid[0];
	if(isset($csid))
	{
		$csid = str_replace("\n", "", $csid);//remove line breaks
		return cod_search($cod_csid_search_query, $csid, "i", false);
	}
	else return false;
}

if($type == "search" && isset($q))
{
	/*
	Order of search methods:
	- query COD name
	- query COD title
	- search CSID2COD
	
	Returns:
	{
		"records":[...]
	}
	*/
	
	header("Content-Type: application/json");
	
	//get list of COD IDs
	$array = cod_search($cod_search_query, $q, "sss", true);
	if($array === false || count($array) == 0)
	{
		$array = cscod_search($q);
		if($array === false || count($array) == 0)
		{
			$array = cod_search($cod_deep_search_query, "%".$q."%", "s", false);
		}
	}
	
	//echo list as JSON Array
	if(count($array) > 0) echo '{"records":["'.implode('","', $array).'"]}';
	else echo '{"records":[]}';
}
else if($type == "information" && isset($codids))
{
	/*	
	Returns:
	{
		"records": [
			{
				"codid": ...,
				"mineral": ...,
				"commonname": ...,
				"chemname": ...,
				"formula": ...,
				"title": ...,
			}
		]
	}
	*/
	
	header("Content-Type: application/json");
	
	$query = "SELECT file,mineral,commonname,chemname,formula,title FROM data WHERE file IN(".$codids.")";
	
	if($result = $cod -> query($query))
	{
		echo '{"records":[';
		$first_record = true;
		while($row = $result -> fetch_row())//print JSON
		{
			if($first_record) $first_record = false;
			else echo ",";
			
			echo "{";
			echo '"codid":'.json_encode($row[0]);
			if(isset($row[1])) if($row[1] != "?") echo ',"mineral":'.json_encode(utf8_encode($row[1]));
			if(isset($row[2])) if($row[2] != "?") echo ',"commonname":'.json_encode(utf8_encode($row[2]));
			if(isset($row[3])) if($row[3] != "?") echo ',"chemname":'.json_encode(utf8_encode($row[3]));
			if(isset($row[4])) if($row[4] != "?") echo ',"formula":'.json_encode(utf8_encode($row[4]));
			if(isset($row[5])) if($row[5] != "?") echo ',"title":'.json_encode(utf8_encode($row[5]));
			echo "}";
		}
		echo "]}";
	}
}
else if($type == "smiles" && isset($codids))
{
	/*	
	Returns:
	{
		"records": [
			{
				"codid": ...,
				"smiles": ...,
			}
		]
	}
	*/
	
	header("Content-Type: application/json");
	
	$query = "SELECT codid,value FROM smiles WHERE codid IN(".$codids.")";
	
	if($result = $cod -> query($query))
	{
		$smiles = array();
		while($row = $result -> fetch_row())//read data
		{
			$smiles[$row[0]] = $row[1];
		}
		
		echo '{"records":[';
		$first_record = true;
		$codids = explode(",", $codids);
		foreach($codids as $codid)//print JSON
		{
			if($first_record) $first_record = false;
			else echo ",";
			
			echo "{";
			echo '"codid":'.json_encode($codid).',"smiles":';
			if(isset($smiles[$codid])) echo json_encode(utf8_encode($smiles[$codid]));
			else
			{
				$smi = file_get_contents("http://www.crystallography.net/cod/chemistry/stoichiometric/".$codid.".smi");
				if(strlen($smi) > 9) echo json_encode(substr($smi, 0, strlen($smi) - 9));
				else echo '""';
			}
			echo "}";
		}
		echo "]}";
	}
}

//close COD connection
$cod -> close();
?>
