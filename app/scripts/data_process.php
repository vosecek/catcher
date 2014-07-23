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
$orm = NotORM::make();

switch($operation){
  case "clear_roster": // sestavování soupisky pro turnaj
    mysql_query("UPDATE $tab4 SET toDelete = 1 WHERE subteam_id = $_POST[team]");
    mysql_query("UPDATE $tab7 SET toDelete = 1 WHERE team_id = $_POST[team]");
  break;
  
  case "add_host": // hostování hráče na turnaji
    $team = $_POST["team"];
    $player_id = $_POST["player_id"];
    $tournament_id = $_POST["tournament_id"];
    $orm->$tab4->insert(array("player_id"=>$player_id,"tournament_id"=>$tournament_id,"subteam_id"=>$team));
    $orm->$tab7->insert(array("player_id"=>$player_id,"tournament_id"=>$tournament_id,"team_id"=>$team));
  break;

  case "dropPoint": // smazat poslední zadaný bod z konkrétního zápasu
    $match_id = $_POST["match_id"];
    $point = $orm->mod_catcher_points->where("match_id",$match_id)->order("id DESC")->limit(1)->fetch();
    $point->delete();
    //echo $orm->mod_catcher_points->where("match_id",$match_id)->order("id ")->limit(1);
  break;
  case "startMatch":
    $match_id = $_POST["match_id"];
    $match = $orm->mod_catcher_matches->where("id",$match_id)->fetch();
    $match->update(array("time_start"=>time(),"in_play"=>1));
  break;
  
  case "set_score":
    $set_score_home = $_POST["score_home"];
    $set_score_away = $_POST["score_away"];
    $home_id = $_POST["home_id"];
    $away_id = $_POST["away_id"];
    $match_id = $_POST["match_id"];
    
    $score_home = count($orm->mod_catcher_points->where("team_id",$home_id)->where("match_id",$match_id));
    $score_away = count($orm->mod_catcher_points->where("team_id",$away_id)->where("match_id",$match_id));
    
    $time = time();
    
    while($score_home < $set_score_home){
      $orm->mod_catcher_points->insert(array("anonymous"=>1,"time"=>$time++,"team_id"=>$home_id,"player_id"=>0,"assist_player_id"=>0,"match_id"=>$match_id));
      echo mysql_error();
      $score_home++;
    }
    
    while($score_away < $set_score_away){
      $orm->mod_catcher_points->insert(array("anonymous"=>1,"time"=>$time++,"team_id"=>$away_id,"player_id"=>0,"assist_player_id"=>0,"match_id"=>$match_id));
      echo mysql_error();
      $score_away++;
    }
  break;
}
?>