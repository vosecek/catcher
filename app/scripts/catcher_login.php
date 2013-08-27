<?php
header('content-type: text/html; charset=utf-8');
include "paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

global $tournament, $password, $callback;

$tournament = $_GET["tournament"];
$password = $_GET["password"];
$callback = $_GET["callback"];

$vysledek = mysql_query("select * from mod_catcher_tournaments where id = '$tournament'");
// zatím se s heslem nebudeme párat, přihlásíme se kamkoliv a kdykoliv 
//  and password = '$password'

if(mysql_num_rows($vysledek) == 1 && isset($callback)){
	$data = mysql_fetch_array($vysledek);
    $output["success"]=true;
    $output["tournament_id"] = $data["id"];
    $output["tournament_name"] = $data["name"];
    $output["fields"] = $data["fields"];
    $output["time"] = $data["time"];
    $output["default_length"] = $data["default_length"];
}else{
  $output["success"]=false;
  $output["tournament_id"]="chybné heslo či neexistují turnaj";
}

header('Content-Type: text/javascript');
echo $callback . '(' . json_encode($output) . ');';

?>
