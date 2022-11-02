<?php
/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014, 2015 Herman Bergwerf
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
