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
- action = search (using text) || smiles (using codids) || name (using codids)
- q = {query} || {CODID,CODID,CODID}
*/

include_once("utility.php");

error_reporting(0);
parse_str($_SERVER["QUERY_STRING"]);

//connect to COD MySQL
$cod = new mysqli("www.crystallography.net", "cod_reader", "", "cod");
if($cod -> connect_errno > 0) die('{"error":"Unable to connect to COD ['.$cod -> connect_error.']"}');

if($action == "search" && isset($q))
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

	Or, in case of an error:
	{
		"error": "Error message"
	}
	*/

	header("Content-Type: application/json");

	$q = strtolower(urldecode($q));

	$query =
'SELECT file,mineral,commonname,chemname,formula,title FROM data
WHERE (mineral LIKE "%'.addslashes($q).'%" OR commonname LIKE "%'.addslashes($q).'%" OR chemname LIKE "%'.addslashes($q).'%") LIMIT 500';

	if($result = $cod -> query($query))
	{
		$records = array();

		while($row = $result -> fetch_row())
		{
			$record = array();

			$record["codid"] = utf8_encode($row[0]);
			if(isset($row[1]))
			{
				if($row[1] != "?" && $row[1] != "" && !is_null($row[1]))
					$record["mineral"] = utf8_encode($row[1]);
			}
			if(isset($row[2]))
			{
				if($row[2] != "?" && $row[2] != "" && !is_null($row[2]))
					$record["commonname"] = utf8_encode($row[2]);
			}
			if(isset($row[3]))
			{
				if($row[3] != "?" && $row[3] != "" && !is_null($row[3]))
					$record["chemname"] = utf8_encode($row[3]);
			}
			if(isset($row[4]))
			{
				if($row[4] != "?" && $row[4] != "" && !is_null($row[4]))
					$record["formula"] = utf8_encode($row[4]);
			}
			if(isset($row[5]))
			{
				if($row[5] != "?" && $row[5] != "" && !is_null($row[5]))
					$record["title"] = utf8_encode($row[5]);
			}

			array_push($records, $record);
		}

		//sort by priority
		usort($records, function($a, $b)
		{
			global $q;

			$albl = isset($a["mineral"]) ? $a["mineral"] :
					(isset($a["commonname"]) ? $a["commonname"] :
					(isset($a["chemname"]) ? $a["chemname"] : $a["codid"]));
			$blbl = isset($b["mineral"]) ? $b["mineral"] :
					(isset($b["commonname"]) ? $b["commonname"] :
					(isset($b["chemname"]) ? $b["chemname"] : $b["codid"]));

			similar_text($q, strtolower($albl), $ap);
			similar_text($q, strtolower($blbl), $bp);

			if($ap == $bp)
			{
				return intval($a["codid"]) < intval($b["codid"]) ? -1 : 1;
			}
			else
			{
				return $ap > $bp ? -1 : 1;
			}
		});

		echo '{"records":[';
		for($i = 0; $i < count($records); $i++)
		{
			if($i > 0) echo ",";

			echo "{";
			echo '"codid":'.json_encode($records[$i]["codid"]);
			if(isset($records[$i]["mineral"]))
				echo ',"mineral":'.json_encode($records[$i]["mineral"]);
			if(isset($records[$i]["commonname"]))
				echo ',"commonname":'.json_encode($records[$i]["commonname"]);
			if(isset($records[$i]["chemname"]))
				echo ',"chemname":'.json_encode($records[$i]["chemname"]);
			if(isset($records[$i]["formula"]))
				echo ',"formula":'.json_encode($records[$i]["formula"]);
			if(isset($records[$i]["title"]))
				echo ',"title":'.json_encode($records[$i]["title"]);
			echo "}";
		}
		echo "]}";
	}
}
else if($action == "smiles" && isset($q))
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

	$query = "SELECT codid,value FROM smiles WHERE codid IN(".$q.")";

	if($result = $cod -> query($query))
	{
		$smiles = array();
		while($row = $result -> fetch_row())//read data
		{
			$smiles[$row[0]] = $row[1];
		}

		echo '{"records":[';
		$first_record = true;
		$q = explode(",", $q);
		foreach($q as $codid)//print JSON
		{
			if($first_record) $first_record = false;
			else echo ",";

			echo "{";
			echo '"codid":'.json_encode($codid).',"smiles":';
			if(isset($smiles[$codid])) echo json_encode(utf8_encode($smiles[$codid]));
			else
			{
				$smi = get_curl("http://www.crystallography.net/cod/chemistry/stoichiometric/".$codid.".smi");
				if(strlen($smi) > 9) echo json_encode(substr($smi, 0, strlen($smi) - 9));
				else echo '""';
			}
			echo "}";
		}
		echo "]}";
	}
}
else if($action == "name" && isset($q))
{
	/*
	Returns:
	{
		"records": [
			{
				"codid": ...,
				"name": ...,
			}
		]
	}
	*/

	header("Content-Type: application/json");

	$query = "SELECT file,mineral,commonname,chemname FROM data WHERE file IN(".$q.")";

	if($result = $cod -> query($query))
	{
		$names = array();
		while($row = $result -> fetch_row())//read data
		{
			$names[$row[0]] = isset($row[1]) ? $row[1] : (isset($row[2]) ? $row[2] : (isset($row[3]) ? $row[3] : ""));
		}

		echo '{"records":[';
		$first_record = true;
		$q = explode(",", $q);
		foreach($q as $codid)//print JSON
		{
			if($first_record) $first_record = false;
			else echo ",";
			echo '{"codid":'.json_encode($codid).',"name":'.json_encode(utf8_encode($names[$codid]))."}";
		}
		echo "]}";
	}
}
else
{
	echo "{}";
}

//close COD connection
$cod -> close();
