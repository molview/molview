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

include_once('utility.php');

parse_str($_SERVER['QUERY_STRING'], $params);
$codid = intval($params['codid'] ?? '');

function download_cod_cif(int $codid) {
  $cif = file_get_contents("http://www.crystallography.net/$codid.cif");
  if ($cif === false) {
    http_response_code(404);
    echo 'Failed to download CIF file.';
  } else {
    echo $cif;
  }
}

header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: https://embed.molview.org');

download_cod_cif($codid);

// Connect to COD MySQL database using PDO.
// For unknown reasons A2Hosting started blocking this.
/*try {
  $dsn = 'mysql:host=www.crystallography.net;dbname=cod';
  $db = new PDO($dsn, 'cod_reader', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo 'Failed to open COD database.';
  return;
}

// Lookup record in database.
$s = $db->prepare('SELECT flags FROM data WHERE file = :codid');
$s->execute(['codid' => $codid]);
if ($row = $s->fetch(PDO::FETCH_ASSOC)) {
  if (strpos($row['flags'], 'has coordinates') !== false) {
    download_cod_cif($codid);
  } else {
    http_response_code(404);
    echo 'Record has no coordinates.';
    return;
  }
} else {
  http_response_code(404);
  echo 'Record not found.';
  return;
}*/
