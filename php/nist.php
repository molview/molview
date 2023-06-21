<?php
/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/*
PHP script for processing and retrieving data from the NIST Chemistry Webbook

Available spectra on NIST Chemistry WebBook:
- Mass spectrum
- IR spectrum
- UV-Visible spectrum

Notes:
- Index = 0 for Mass spectrum
- Index = 0 - 2 for IR spectrum
- Index = 0 for UV-Visible spectrum

@param  type Query type: lookup, mass, ir, uvvis
@param  cas  CAS Registry Number
@param  i    IR spectrum index
@return      JSON data
*/

include_once("utility.php");

parse_str($_SERVER["QUERY_STRING"], $params);
$type = $params["type"] ?? "lookup";
$cas = $params["cas"] ?? "";
$i = $params["i"] ?? 0;

if($type == "lookup")
{
	header("Content-Type: application/json");

	/*
	Extract spectra from Coblentz and NIST Mass Spec Data Center

	Returns (example for cas=50-78-2):
	{
		"mass": true,
		"uvvis": true,
		"ir": [
			{
				"i": 0,
				"state": "Not specified, most likely a prism, grating, or hybrid spectrometer.",
				"source": "(NO SPECTRUM, ONLY SCANNED IMAGE IS AVAILABLE)"
			},
			{
				"i": 1,
				"state": "SOLID (KBr DISC) VS KBr",
				"source": "PERKIN-ELMER 21 (GRATING); DIGITIZED BY COBLENTZ SOCIETY (BATCH I) FROM HARD COPY; 2 cm"
			}
		]
	}
	*/

	$nist_page = http_get("https://webbook.nist.gov/cgi/cbook.cgi?Mask=80&ID=".$cas);

	echo "{";
	echo '"url":'.json_encode(utf8_encode("https://webbook.nist.gov/cgi/cbook.cgi?ID=".$cas));
	echo ',"mass":'.(strrpos($nist_page, "Mass spectrum (electron ionization)") === false ? "false" : "true");
	echo ',"uvvis":'.(strrpos($nist_page, "UV/Visible spectrum") === false ? "false" : "true");
	echo ',"ir":[';

	//if there is only one records (Index=0) the result is directly embeded into the webpage (see caffeine)
	// <tr><th style="text-align: left; vertical-align: top;">State<\/th><td style="text-align: left; vertical-align: top;">([^<]*)<\/td><\/tr>
	preg_match_all('/<tr><th style="text-align: left; vertical-align: top;">State<\/th><td style="text-align: left; vertical-align: top;">([^<]*)<\/td><\/tr>/', $nist_page, $records);

	if(count($records[0]) > 0)
	{
		preg_match_all('/Index=([0-9])/', $nist_page, $indexes);
		echo '{"i":'.$indexes[1][0].',"state":'.json_encode(utf8_encode($records[1][0])).',"source":""}';
	}
	else//second method
	{
		$nist_page = explode("\n", $nist_page);
		$inlist = false;
		$listnr = 0;
		$length = 0;

		$key = array_search('<h2 id="IR-Spec">IR Spectrum</h2>', $nist_page);
		if($key !== false)
		{
			$idx = $key + 1;//skip "Go to ..." line
		}
		else
		{
			echo "]}";
			return;
		}

		//loop trough NIST webpage lines
		for($idx = 0; $idx < count($nist_page); $idx++)
		{
			if($inlist == false)//we are not in an IR spectrum list
			{
				$pos1 = strpos($nist_page[$idx], '<p class="section-head"><strong>Data compiled by:</strong> <a href="/cgi/cbook.cgi?Contrib=COBLENTZ">Coblentz Society, Inc.</a></p>');
				$pos2 = strpos($nist_page[$idx], '<p class="section-head"><strong>Data compiled by:</strong> <a href="/cgi/cbook.cgi?Contrib=MSDC-IR">NIST Mass Spec Data Center, S.E. Stein, director</a></p>');
				if($pos1 !== false || $pos2 !== false)//we are in an IR spectrum list
				{
					$inlist = true;
					$listnr++;
					$idx++;//skip "<ul>"
				}
			}
			else
			{
				$pos = strpos($nist_page[$idx], 'Index=');
				if($pos !== false)//format the data of this IR spectrum
				{
					preg_match_all('/[i"]>([A-z][^;<]*)(?:[^<\/]{2}|)([^<]*)/', $nist_page[$idx], $results);
					if(count($results[0]) > 0)
					{
						preg_match_all('/Index=([0-9])/', $nist_page[$idx], $indexes);

						if($length > 0) echo ",";
						echo "{";
						echo '"i":'.json_encode(utf8_encode($indexes[1][count($indexes[1]) - 1])).",";//pick last Index=n in this line
						echo '"state":'.json_encode(utf8_encode($results[1][0])).",";
						echo '"source":'.json_encode(utf8_encode($results[2][0]));
						echo "}";

						$length++;
					}
				}
				else//this might be the end of this IR spectrum list
				{
					$pos = strpos($nist_page[$idx], '</ul>');
					if($pos !== false)
					{
						$inlist = false;
						if($listnr >= 2) break;
					}
				}
			}
		}
	}

	echo "]}";
}
else if($type == "mass")
{
	header("Content-Type: chemical/x-jcamp-dx");
	echo_curl("https://webbook.nist.gov/cgi/cbook.cgi?JCAMP=".$cas."&Type=Mass&Index=0");
}
else if($type == "ir")
{
	header("Content-Type: chemical/x-jcamp-dx");
	echo_curl("https://webbook.nist.gov/cgi/cbook.cgi?JCAMP=".$cas."&Type=IR&Index=".$i);
}
else if($type == "uvvis")
{
	header("Content-Type: chemical/x-jcamp-dx");
	echo_curl("https://webbook.nist.gov/cgi/cbook.cgi?JCAMP=".$cas."&Type=UVVis&Index=0");
}
