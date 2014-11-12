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

function load_metadata($q, $smiles, $cid, $pdbid, $codid)
{
	//title
	$title = "MolView";
	if(isset($q))
		$title = ucfirst($q);
	else if(isset($pdbid))
		$title = strtoupper($pdbid);
	else if(isset($codid))
		$title = "COD: ".$codid;

	//description
	$description = "MolView is an Open-Source, intuitive web-application to make chemistry and biology more awesome!";
	if(isset($q) || isset($smiles) || isset($cid))
		$description = "View this molecule at http://molview.org";
	else if(isset($pdbid))
		$description = "View this macromolecule at http://molview.org";

	//keywords
	$keywords = "molview,free,chemistry,app,molecules,proteins,crystals,spectroscopy";
	if(isset($q)) $keywords .= ",".$q;

	//same as
	$same_as = "";
	if(isset($q))
		$same_as = "//en.wikipedia.org/wiki/".$q;
	else if(isset($cid))
		$same_as = "https://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=".$cid;
	else if(isset($pdbid))
		$same_as = "//www.rcsb.org/pdb/explore/explore.do?structureId=".$pdbid;

	//image
	$image_url = "http://molview.org/img/image.png";
	$pubchem_query = null;
	$pubchem_value = null;
	if(isset($cid))
		{ $pubchem_query = "cid"; $pubchem_value = $cid; }
	else if(isset($smiles))
		{ $pubchem_query = "smiles"; $pubchem_value = $smiles; }
	else if(isset($q))
		{ $pubchem_query = "name"; $pubchem_value = $q; }
	else if(isset($pdbid))
		$image_url = "http://www.rcsb.org/pdb/images/".$pdbid."_bio_r_500.jpg";

	if(isset($pubchem_query))//data via PubChem
	{
		$json = file_get_contents("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/".$pubchem_query."/description/json?".$pubchem_query.'='.urlencode($pubchem_value));
		$data = json_decode($json);

		if(isset($data -> InformationList -> Information[0] -> CID))
		{
			$same_as = "https://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=".
					$data -> InformationList -> Information[0] -> CID;

			if($pubchem_query != "cid")//redirect to ?cid
			{
				$query = preg_replace("/".($pubchem_query == "name" ? "q" : $pubchem_query).
						"=[^&]*/", "cid=".($data -> InformationList -> Information[0] -> CID),
						$_SERVER["QUERY_STRING"]);//remove old compound query
				header("Location: ?".$query, true, 302);
			}
		}
		if(isset($data -> InformationList -> Information[0] -> Title))
		{
			$title = ucfirst(humanize($data -> InformationList -> Information[0] -> Title));
		}
		if(isset($data -> InformationList -> Information[0] -> Description))
		{
			$description = $data -> InformationList -> Information[0] -> Description;
		}
	}
	else if(isset($pdbid))//data via RCSB
	{
		$xml = file_get_contents("http://www.rcsb.org/pdb/rest/customReport?pdbids=".$pdbid."&customReportColumns=structureId,structureTitle");
		$data = new SimpleXMLElement($xml);

		if(isset($data -> {"record"} -> {"dimStructure.structureId"}))
		{
			$title = $data -> {"record"} -> {"dimStructure.structureId"};
		}
		if(isset($data -> {"record"} -> {"dimStructure.structureTitle"}))
		{
			$description = $data -> {"record"} -> {"dimStructure.structureTitle"};
		}
	}
	else if(isset($codid))//data via COD
	{
		$cod = new mysqli("www.crystallography.net", "cod_reader", "", "cod");
		if($cod -> connect_errno == 0)
		{
			$query = 'SELECT mineral,commonname,chemname,title FROM data WHERE file = '.$codid;
			if($result = $cod -> query($query))
			{
				while($row = $result -> fetch_row())//print JSON
				{
					$title = isset($row[0]) ? $row[0] : (isset($row[1]) ? $row[1] : (isset($row[2]) ? $row[2] : $title));
					$description = $row[3];
				}
			}

			$cod -> close();
		}
	}

	return array(
		"title" => $title,
		"description" => $description,
		"keywords" => $keywords,
		"same_as" => $same_as,
		"image_url" => $image_url,
		"pubchem_query" => $pubchem_query,
		"pubchem_value" => $pubchem_value
	);
}
