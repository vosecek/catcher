<?

include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

// promazání bodů, které nemají svůj Match
$orm = NotORM::make();

$zapasy = array();
$matches = $orm->mod_catcher_matches;
foreach ($matches as $key => $value) {
	$zapasy[] = $value["id"];
}

$zapasy = implode(",",$zapasy);
$points = $orm->mod_catcher_points->where("match_id NOT IN ($zapasy)");
echo count($points);
foreach ($points as $key => $value) {
	echo $value["match_id"]."<br />";
}
?>