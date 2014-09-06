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

function is_below_IE10()
{
	return preg_match('/(?i)msie [0-9]/',$_SERVER['HTTP_USER_AGENT']);
}

function ieversion()
{
	ereg('MSIE ([0-9].[0-9])', $_SERVER['HTTP_USER_AGENT'], $reg);
	if(!isset($reg[1])) return -1;
	else return floatval($reg[1]);
}

function humanize($str)
{
	return preg_replace_callback('/(\b[A-Z]+\b)/', function($words)
	{
		return strtolower($words[0]);
	}, $str);
}

function is_available($url)
{
    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
    $response = curl_exec($handle);
    $http_code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    curl_close($handle);

    //if the document has loaded successfully without any redirection or error
    if($http_code >= 200 && $http_code < 300) return true;
    else return false;
}
