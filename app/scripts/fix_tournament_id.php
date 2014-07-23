<?
include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";
include "../scripts/tournament.php";
include "../scripts/player.php";

$tables = array("matches","team2tournament","subteams","player2tournament");

$fix = array(56=>51,57=>52,58=>53);

$o = NotORM::make();

foreach ($fix as $key => $value) {
	// $o->mod_catcher_tournaments->where("cald_id",$key)->update(array("cald_id"=>$value));
	// foreach ($tables as $table) {
	// 	$table = "mod_catcher_".$table;
	// 	$o->$table->where("tournament_id",$key)->update(array("tournament_id"=>$value));
	// }
}

?>