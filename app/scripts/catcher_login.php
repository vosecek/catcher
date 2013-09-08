<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");

header('content-type: text/html; charset=utf-8');
include "paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

global $tournament, $password;

$tournament = $_POST["tournament"];
$password = $_POST["password"];

$vysledek = mysql_query("select * from mod_catcher_tournaments where id = '$tournament'");
//  AND password = '$password'

if(mysql_num_rows($vysledek) == 1){
	$data = mysql_fetch_array($vysledek);
    $output["success"]=true;
    $output["tournament_id"] = $data["id"];
    $output["tournament_name"] = $data["name"];
    $output["fields"] = $data["fields"];
    $output["time"] = $data["time"];
    $output["default_length"] = $data["default_length"];
}else{
  $output["success"]=false;
  $output["message"]="Chybné heslo k turnaji";
}

if (isset($callback)) {
    header('Content-Type: text/javascript');
    echo $callback . '(' . json_encode($output) . ');';
} else {
    header('Content-Type: application/x-json');
    echo json_encode($output);
}

?>
