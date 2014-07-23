<?
include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";
include "../scripts/tournament.php";
include "../scripts/player.php";

$finale = new tournament(77);
$finale->teamStats(array("team_id"=>425,"subteam_id"=>425));
echo $finale->id;

// $vysledek = mysql_query("SELECT DISTINCT(subteam_id) FROM mod_catcher_player2tournament");

// echo mysql_error();

// while($data = mysql_fetch_array($vysledek)){
// $x = mysql_query("SELECT id,tournament_id FROM mod_catcher_subteams WHERE id = $data[subteam_id]");
// echo mysql_error();
//   $team_id = mysql_fetch_array($x);
//   $nove = $team_id["tournament_id"];
//   mysql_query("UPDATE mod_catcher_player2tournament SET tournament_id=$nove WHERE subteam_id = $team_id[id]");
//   echo "UPDATE mod_catcher_player2tournament SET tournament_id=$nove WHERE subteam_id = $team_id[id]";
//   echo "<br />";
// }
?>