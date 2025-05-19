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

header('Content-Type: text');

// Allow embed.molview.org and molview.org.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin == 'http://molview.org' || $origin == 'https://embed.molview.org') {
  header("Access-Control-Allow-Origin: .$origin");
}

// Connect to COD MySQL database using PDO.
try {
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
    // Download CIF file.
    $cif = http_get("http://www.crystallography.net/$codid.cif");
    if ($cif === false) {
      http_response_code(404);
      echo 'Failed to download CIF file.';
      return;
    } else {
      echo $cif;
      return;
    }
  } else {
    http_response_code(404);
    echo 'Record has no coordinates.';
    return;
  }
} else {
  http_response_code(404);
  echo 'Record not found.';
  return;
}
