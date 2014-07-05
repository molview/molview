<?php
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
?>
