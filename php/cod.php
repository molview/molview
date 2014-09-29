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
PHP script for processing and retrieving data from the Crystallography Open Database

Parameters:
- q = {query}
- codids = {CODID,CODID,CODID}
- type = search (using query) || smiles (using codids)
*/

error_reporting(0);
parse_str($_SERVER["QUERY_STRING"]);

//connect to COD MySQL
$cod = new mysqli("www.crystallography.net", "cod_reader", "", "cod");
if($cod -> connect_errno > 0) die("Unable to connect to COD [".$cod -> connect_error."]");

if($type == "search" && isset($q))
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
				"title": ...
			}
		]
	}
	*/

	header("Content-Type: application/json");

	$q = strtolower($q);

	$query =
'SELECT file,mineral,commonname,chemname,formula,title FROM (
	SELECT file,mineral,commonname,chemname,formula,title FROM data
	WHERE mineral LIKE "%'.addslashes($q).'%"
	ORDER BY CHAR_LENGTH(mineral), mineral ASC
	LIMIT 100
) ALIAS

UNION

SELECT file,mineral,commonname,chemname,formula,title FROM (
	SELECT file,mineral,commonname,chemname,formula,title FROM data
	WHERE commonname LIKE "%'.addslashes($q).'%"
	ORDER BY CHAR_LENGTH(commonname), commonname ASC
	LIMIT 100
) ALIAS1

UNION

SELECT file,mineral,commonname,chemname,formula,title FROM (
	SELECT file,mineral,commonname,chemname,formula,title FROM data
	WHERE chemname LIKE "%'.addslashes($q).'%"
	ORDER BY CHAR_LENGTH(chemname), chemname ASC
	LIMIT 100
) ALIAS2';

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
			if(isset($row[1])) if($row[1] != "?" && $row[1] != "")
				echo ',"mineral":'.json_encode(utf8_encode($row[1]));
			if(isset($row[2])) if($row[2] != "?" && $row[2] != "")
				echo ',"commonname":'.json_encode(utf8_encode($row[2]));
			if(isset($row[3])) if($row[3] != "?" && $row[3] != "")
				echo ',"chemname":'.json_encode(utf8_encode($row[3]));
			if(isset($row[4])) if($row[4] != "?" && $row[4] != "")
				echo ',"formula":'.json_encode(utf8_encode($row[4]));
			if(isset($row[5])) if($row[5] != "?" && $row[5] != "")
				echo ',"title":'.json_encode(utf8_encode($row[5]));
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

/* ChemSpider ID lookup
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
}*/
