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
$user = $_POST["user"];
$admin = $_POST["admin"];

$o = NotORM::make();

$vysledek = array();
$level = false;

$output["subteams"] = array();

if($admin == "host"){
    $vysledek = $o->mod_catcher_tournaments->where("id",$tournament)->fetch();
    $level = 1; // level 1 je divák view
}elseif($admin == "admin"){
    $vysledek = $o->mod_catcher_tournaments->where("id",$tournament)->where("password",$password);
    $subteams = $o->mod_catcher_subteams->where("tournament_id",$tournament);
    foreach ($subteams as $key => $value) {
        $output["subteams"][$value["id"]] = array(iconv("cp1250","utf8",$value["name_full"]),iconv("cp1250","utf8",$value["name_short"]));
    }
    if(count($vysledek)>0){
        $vysledek = $vysledek->fetch();
        $level = 3; // level 3 je admin turnaje
    }
}else{
    $vysledek = $o->mod_catcher_teams->where("name_short",$user)->where("password",$password)->where("password!=''");
    if(count($vysledek)>0){
        $vysledek = $vysledek->fetch();
        $subteams = $o->mod_catcher_subteams->where("tournament_id",$tournament)->where("master",$vysledek["id"]);
        foreach ($subteams as $key => $value) {
            $output["subteams"][$value["id"]] = array(iconv("cp1250","utf8",$value["name_full"]),iconv("cp1250","utf8",$value["name_short"]));
        }        
        $team_data = $o->mod_catcher_teams->where("id",$vysledek["id"])->fetch();
        $vysledek = $o->mod_catcher_tournaments->where("id",$tournament);
        if(count($vysledek)>0){
            $vysledek = $vysledek->fetch();
            $level = 2; // level 2 je team view s právem na zápis Spiritu, může měnit pouze soupisku vlastního týmu
        }
    }
}


if(count($vysledek) == 0){
  $output["success"]=false;
  $output["message"]="Chybné heslo či jméno";
}else{
    $output["subteams_count"] = count($output["subteams"]);
//     $output["subteams"] = json_encode($output["subteams"]);
    $output["tournament_id"] = $vysledek["id"];
    // $output["tournament_name"] = $vysledek["name"];
    $output["fields"] = $vysledek["fields"];
    $output["time"] = $vysledek["time"];
    $output["default_length"] = $vysledek["default_length"];    
    $output["success"] = true;
    $output["admin"] = $level;
    $output["user"] = $admin;
    if(isset($team_data) && !empty($team_data)){
        $output["team_name_full"] = iconv("cp1250", "utf8", $team_data["name_full"]);
        $output["team_name_short"] = iconv("cp1250", "utf8", $team_data["name_short"]);
    }else{
        $output["team_name_full"] = "";
        $output["team_name_short"] = "";
    }
}

if (isset($callback)) {
    header('Content-Type: text/javascript');
    echo $callback . '(' . json_encode($output) . ');';
} else {
    header('Content-Type: application/x-json');
    echo json_encode($output);
}

?>
