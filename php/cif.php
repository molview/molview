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

/*
PHP script for mirroring CIF files form the Crystallography Open Database

@param  codid
@return CIF file or HTTP error
*/

include_once("utility.php");

error_reporting(0);
parse_str($_SERVER["QUERY_STRING"]);
header("Content-Type: text");

//connect to cod
$cod = new mysqli("www.crystallography.net", "cod_reader", "", "cod");
if($cod -> connect_errno > 0)
{
    http_response_code(500);
    echo "Internal Error";
    return;
}

//lookup record in database
$query = 'SELECT flags FROM data WHERE file="'.$codid.'"';
if($row = $cod -> query($query) -> fetch_row())
{
    $cod -> close();
    if(strpos($row[0], "has coordinates") !== false)
    {
        //get cif
        $cif = get_curl("http://www.crystallography.net/".$codid.".cif");
        if($cif === false)
        {
            http_response_code(404);
            echo "Not Found";
            return;
        }
        else
        {
            echo $cif;
            return;
        }
    }
    else
    {
        http_response_code(404);
        echo "Not Found";
        return;
    }
}
else
{
    $cod -> close();
    http_response_code(404);
    echo "Not Found";
    return;
}
