<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");

include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

$operation = $_GET["operation"];

$tab4 = "mod_catcher_player2tournament";
$tab7 = "mod_catcher_player2subteam";

switch($operation){
  case "clear_roster": // sestavování soupisky pro turnaj
    mysql_query("UPDATE $tab4 SET toDelete = 1 WHERE subteam_id = $_POST[team]");
    mysql_query("UPDATE $tab7 SET toDelete = 1 WHERE team_id = $_POST[team]");
  break;
}
?>