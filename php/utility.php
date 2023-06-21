<?php
/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

error_reporting(0);
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

function humanize($str)
{
	return preg_replace_callback('/(\b[A-Z]+\b)/', function($words)
	{
		return strtolower($words[0]);
	}, $str);
}

function is_available($url)
{
	$ch = curl_init($url);
	curl_setopt($ch,  CURLOPT_RETURNTRANSFER, TRUE);
	$out = curl_exec($ch);
	$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);

	//if the document has loaded successfully without any redirection or error
	if($http_code >= 200 && $http_code < 300) return true;
	else return false;
}

function http_get($url)
{
	return file_get_contents($url);
}

function echo_curl($url)
{
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
	echo curl_exec($ch);
	curl_close($ch);
}
