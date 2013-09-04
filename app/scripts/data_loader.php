<?
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");

include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

function convert($string){
	return iconv("cp1250","utf-8",$string);;
}

function convert2($string){
	return iconv("utf-8","cp1250",$string);
}

$tab1 = "mod_catcher_teams";
$tab2 = "mod_catcher_players";
$tab3 = "mod_catcher_team2tournament";
$tab4 = "mod_catcher_player2tournament";
$tab5 = "mod_catcher_matches";
$tab6 = "mod_catcher_points";
$tab7 = "mod_catcher_player2subteam";
$tab8 = "mod_catcher_subteams";
       
$output = array();
$store = $_GET["store"];
if(isset($_GET["tournament_id"])) {
  $tournament_id = $_GET["tournament_id"];
  $tmp = explode("/",$tournament_id);
  if(count($tmp)>1) $tournament_id = $tmp[0];
  $tmp = false;
}
$method = $_SERVER['REQUEST_METHOD'];
if(isset($_REQUEST['callback'])) $callback = $_REQUEST['callback'];

$cols["tournaments"] = array("tournament_id"=>"id","tournament_name"=>"name","fields"=>"fields","time"=>"time","default_length"=>"default_length");
$cols["teams"] = array("team_id"=>"id","name_short"=>"name_short","name_full"=>"name_full","master_id"=>"master");
$cols["players"] = array("player_id"=>"id","name"=>"name","surname"=>"surname","number"=>"number","team"=>"team","nick"=>"nick");
$cols["matches"] = array("match_id"=>"id","tournament_id"=>"tournament_id","home_id"=>"home_id","home_name_full"=>"home_name_full","home_name_short"=>"home_name_short","away_name_full"=>"away_name_full","away_name_short"=>"away_name_short","away_id"=>"away_id","score_home"=>"score_home","score_away"=>"score_away","spirit_home"=>"spirit_home","spirit_away"=>"spirit_away","field"=>"field","time"=>"time","time_end"=>"time_end","length"=>"length","in_play"=>"in_play","finished"=>"finished");
$cols["points"] = array("point_id"=>"id","team_id"=>"team_id","player_id"=>"player_id","assist_player_id"=>"assist_player_id","match_id"=>"match_id","time"=>"time");
$cols["rosters"] = $cols["players"];

$cols_app = $cols;
$cols_app["players"]["player_id"] = $cols_app["rosters"]["player_id"] = "player_id";
$cols_app["matches"]["match_id"] = "match_id";
$cols_app["points"]["point_id"] = "point_id";

function update_match_settings($data){
  global $tab5,$output;
  $time = time();  
  switch($data["finished"]){
    case 0:
      mysql_query("UPDATE $tab5 SET finished = 0, time_end=0 WHERE id = $data[match_id]");       
    break;
    case 1:
      mysql_query("UPDATE $tab5 SET time_end = IF(finished>0,time_end,$time), finished = 1, in_play = 0 WHERE id = $data[match_id]");
    break;
  } 
  mysql_query("UPDATE $tab5 SET field = '$data[field]', length = '$data[length]', time = '$data[time]', spirit_away = '$data[spirit_away]', spirit_home = '$data[spirit_home]' WHERE id = $data[match_id]");   
  $result = mysql_fetch_array(mysql_query("SELECT in_play,time_end,finished FROM $tab5 WHERE id = $data[match_id]")); 
  $output["time_end"] = $result["time_end"];  
  $output["in_play"] = $result["in_play"];
  $output["finished"] = $result["finished"];
}

// pokud $match_id = false, updatuje se celý turnaj
function update_match($match_id = false){
  if($match_id == false){
    global $tournament_id,$tab5;
    $result = mysql_query("SELECT id FROM $tab5 WHERE tournament_id = '$tournament_id'");
    $matchesToUpdate = array();
    while($data = mysql_fetch_array($result)){
      $matchesToUpdate[]=$data["id"];
    }
  }else{
    $matchesToUpdate[]=$match_id;
  }  
  
  foreach($matchesToUpdate as $match_id){    
    $data = mysql_fetch_array(mysql_query("SELECT home_id, away_id, in_play FROM mod_catcher_matches WHERE id='$match_id'"));
    $score_home = mysql_fetch_array(mysql_query("SELECT count(id) as score FROM mod_catcher_points WHERE match_id = '$match_id' AND team_id='$data[home_id]'"));
    $score_away = mysql_fetch_array(mysql_query("SELECT count(id) as score FROM mod_catcher_points WHERE match_id = $match_id AND team_id='$data[away_id]'"));    
    
    mysql_query("UPDATE mod_catcher_matches SET score_home = '$score_home[score]', score_away = '$score_away[score]' WHERE id = $match_id");
    debuguj(($score_home["score"]+$score_away["score"])." - ".$data["in_play"],"catcher");
    if(($score_home["score"]+$score_away["score"])>0 && $data["in_play"] == 0){    
      mysql_query("UPDATE mod_catcher_matches SET in_play = 1 WHERE id = $match_id");
    }
  }
}
 

if($method == "POST"){ // insert dat ve storu
  $data = file_get_contents("php://input");
	$data = json_decode($data,true);
  foreach($cols_app[$store] as $index=>$value){
  	$data[$value] = convert2($data[$value]);
	}
    

  switch($store){
    case "matches":      
      mysql_query("INSERT INTO mod_catcher_$store (tournament_id,home_id,away_id,field,length,time) VALUES ($tournament_id,$data[home_id],$data[away_id],$data[field],'$data[length]',$data[time])");
      $id = mysql_insert_id();
      $radek = mysql_fetch_array(mysql_query("SELECT * FROM mod_catcher_$store WHERE id='$id'"));
      $output["match_id"] = $radek["id"];
      $output["time"] = $radek["time"];      
      
    break;
    case "points":
      // zahazujeme bod, pokud už tam je, což by se nemìlo stát, prùbìžnì logujeme    
      if(mysql_num_rows(mysql_query("SELECT * FROM mod_catcher_$store WHERE time = '$data[time]' AND match_id='$data[match_id]' AND team_id='$data[team_id]' AND player_id='$data[player_id]'")) == 0) {
    		mysql_query("INSERT INTO mod_catcher_$store (player_id,assist_player_id,match_id,team_id,time) VALUES ($data[player_id],$data[assist_player_id],$data[match_id],$data[team_id],$data[time])");
        $output["dirty"] = true;        
      }else{
        debuguj("Pokus o pøidání duplikátu: ".json_encode($data),"catcher");
        $output["success"] = true;
      }             
      update_match($data["match_id"]);
  	break;
    case "players":
      $master_team = mysql_fetch_array(mysql_query("SELECT master FROM $tab8 WHERE id=$data[team]"));
      mysql_query("INSERT INTO mod_catcher_$store (name,surname,number,team,nick, viditelnost) VALUES ('$data[name]','$data[surname]','$data[number]','$master_team[master]','$data[nick]',1)");
      mysql_query("INSERT INTO $tab4 (player_id, tournament_id, subteam_id) VALUES (".mysql_insert_id().",$tournament_id,$data[team])");
      $output["dirty"]=false;
      $output["id"]=mysql_insert_id();
    break;
  }
} 

if($method == "PUT"){ // update dat ve storu
	$data = file_get_contents("php://input");
	$data = json_decode($data,true);
	foreach($cols_app[$store] as $index=>$value){
  	$data[$value] = convert2($data[$value]);
	}
	switch($store){
    case "rosters":
      if(mysql_num_rows(mysql_query("SELECT player_id FROM $tab4 WHERE player_id = $data[player_id] AND subteam_id = $_GET[team] AND tournament_id = $tournament_id")) == 0){
        mysql_query("INSERT INTO $tab4 (player_id,subteam_id,tournament_id) VALUES ($data[player_id],$_GET[team],$tournament_id)");
        mysql_query("INSERT INTO $tab7 (player_id,team_id,tournament_id) VALUES ($data[player_id],$_GET[team],$tournament_id)");
      }else{
        mysql_query("UPDATE $tab4 SET toDelete = 0 WHERE player_id = $data[player_id] AND subteam_id = $_GET[team] AND tournament_id = $tournament_id");
        mysql_query("UPDATE $tab7 SET toDelete = 0 WHERE player_id = $data[player_id] AND team_id = $_GET[team] AND tournament_id = $tournament_id");        
      }                  
      $output["dirty"]=false;
    break;
    
		case "players":
			mysql_query("UPDATE mod_catcher_$store SET name = '$data[name]', surname = '$data[surname]', number = '$data[number]', nick='$data[nick]' WHERE id = $data[player_id]");
      $output["sucess"] = true;						
		break;
		
		case "matches":
      update_match($data["match_id"]);
      update_match_settings($data);      			
		break;
		
		case "points":
			mysql_query("UPDATE mod_catcher_$store SET player_id = '$data[player_id]', assist_player_id = '$data[assist_player_id]' WHERE id = '$data[point_id]'");
      $vysledek = mysql_query("SELECT * FROM mod_catcher_$store WHERE id = '$data[point_id]'");
      $output["sucess"] = true;
      update_match($data["match_id"]);
		break;
		
	}		
}

if($method == "DELETE"){ // budeme nìco mazat ze storu
	$data = file_get_contents("php://input");
	$data = json_decode($data,true);  

	switch($store){
		case "players":	
			mysql_query("DELETE FROM mod_catcher_$store WHERE id = $data[player_id]");
      mysql_query("DELETE FROM $tab7 WHERE player_id = $data[player_id] AND team_id = $data[team] AND $tournament_id");
      mysql_query("DELETE FROM $tab4 WHERE tournament_id = $tournament_id AND player_id = $data[player_id] AND subteam_id = $data[team]");
		break;
		
		case "points":			      
      mysql_query("DELETE FROM mod_catcher_$store WHERE id = $data[point_id]");
      $output["success"]="true";
      $output["point_id"]=$data["point_id"];
      update_match($data["match_id"]);
		break;
    
    case "matches":      
      mysql_query("DELETE FROM $tab5 WHERE id = '$data[match_id]'");      
      mysql_query("DELETE FROM $tab6 WHERE match_id = '$data[match_id]'");
    break;
	}
}

if($method == "GET"){ // stažení dat, rùzné prùbìžné aktualizaèní požadavky
	if(!empty($store)){
    $skryte = "AND viditelnost=1";
    if(isset($tournament_id)) $t_cond = "tournament_id=$tournament_id";
    switch($store){
      case "teams":
        $vysledek = mysql_query("SELECT $tab8.* FROM $tab8 LEFT JOIN $tab3 ON $tab3.team_id=$tab8.id WHERE $tab3.tournament_id=$tournament_id");
        echo mysql_error();
      break;
      case "matches":
        if(isset($_GET["id"])){
          // dotaz na jediný konkrétní zápas
          $vysledek = mysql_query("SELECT * FROM $tab5 WHERE id = '".$_GET["id"]."'");
        }else{
          // standardní naèítání dat
          update_match();
          $vysledek = mysql_query("SELECT * FROM $tab5 WHERE $t_cond ORDER BY time");
        }        
      break;
      case "points":
        if(isset($_GET["match_id"])){
          // dotaz na jediný konkrétní zápas (aktualizace poèitadel)
          $vysledek = mysql_query("SELECT $tab6.* FROM $tab6 LEFT JOIN $tab5 ON $tab5.id=$tab6.match_id WHERE $tab6.match_id = '".$_GET["match_id"]."'");
        }else{
          // standardní naèítání dat
          $vysledek = mysql_query("SELECT $tab6.* FROM $tab6 LEFT JOIN $tab5 ON $tab5.id=$tab6.match_id");
        }
      break;
      case "players":
        mysql_query("DELETE FROM $tab4 WHERE toDelete = 1 AND $t_cond");
        mysql_query("DELETE FROM $tab7 WHERE toDelete = 1 AND $t_cond");
        $vysledek = mysql_query("SELECT $tab2.surname,$tab2.id,$tab2.name,$tab2.number,$tab2.nick,$tab4.subteam_id AS team FROM $tab2 LEFT JOIN $tab4 ON $tab4.player_id=$tab2.id WHERE $tab4.$t_cond $skryte");                
      break;
      case "rosters":
        $team = mysql_fetch_array(mysql_query("SELECT master FROM $tab8 WHERE id = '$_GET[team]'"));
        $result = mysql_query("SELECT $tab2.team AS master,$tab7.player_id AS id FROM $tab2 LEFT JOIN $tab7 ON $tab2.id = $tab7.player_id WHERE $tab7.team_id = '$_GET[team]'");
        $master_teams = array();
        $players_ids = array();
        while($data = mysql_fetch_array($result)){
          $players_ids[] = $data["id"];
          if(!in_array($data["master"], $master_teams)) $master_teams[] = $data["master"];
        }        
        unset($master_teams[array_search($team["master"],$master_teams)]);
        $players_ids = implode(",",$players_ids);
        $vysledek = mysql_query("SELECT $tab2.team,$tab2.surname,$tab2.id,$tab2.name,$tab2.number,$tab2.nick FROM $tab2 WHERE team = $team[master] $skryte");
        $vysledek2 = mysql_query("SELECT $tab2.team,$tab2.surname,$tab2.id,$tab2.name,$tab2.number,$tab2.nick FROM $tab2 WHERE $tab2.id IN ($players_ids) $skryte");        
      break;
      case "tournaments":
        $vysledek = mysql_query("SELECT * FROM mod_catcher_tournaments WHERE active=1 ORDER BY name");
      break;
    }						
		
    if(isset($vysledek)) {
  		while($data = mysql_fetch_array($vysledek)){
  			if($store == "matches"){        
  				$home = mysql_fetch_array(mysql_query("SELECT * FROM mod_catcher_subteams WHERE id = $data[home_id]"));
  				$away = mysql_fetch_array(mysql_query("SELECT * FROM mod_catcher_subteams WHERE id = $data[away_id]"));
  				$data["home_name_short"] = $home["name_short"];
  				$data["home_name_full"] = $home["name_full"];
  				$data["away_name_short"] = $away["name_short"];
  				$data["away_name_full"] = $away["name_full"];
          if($data["in_play"] == 0) $data["in_play"] = 0;
  			}        
  			foreach($cols[$store] as $index=>$value){
  	    	$data[$value] = convert($data[$value]);          
  	    	$tmp[$index] = $data[$value];
  	  	}        
        if($store == "points"){          
          $match_info = mysql_fetch_array(mysql_query("SELECT home_id, away_id FROM mod_catcher_matches WHERE id = '$data[match_id]'"));
          $score["score_home"] = mysql_fetch_array(mysql_query("SELECT count(id) as score FROM mod_catcher_points WHERE team_id='$match_info[home_id]' AND match_id='$data[match_id]' AND time <= $data[time]"));
          $score["score_away"] = mysql_fetch_array(mysql_query("SELECT count(id) as score FROM mod_catcher_points WHERE team_id='$match_info[away_id]' AND match_id='$data[match_id]' AND time <= $data[time]"));
          mysql_query("UPDATE mod_catcher_points SET score_home = '".$score["score_home"]["score"]."', score_away = '".$score["score_away"]["score"]."' WHERE id = '".$data["id"]."'");
          $tmp["score_home"] = $score["score_home"]["score"];        
          $tmp["score_away"] = $score["score_away"]["score"];
          $tmp["id"] = $tmp["point_id"];
        }        
  	  	$output[] = $tmp;
  		}
    }
    
    if(isset($vysledek2)){
      while($data = mysql_fetch_array($vysledek2)){        
        foreach($cols[$store] as $index=>$value){
  	    	$data[$value] = convert($data[$value]);          
  	    	$tmp[$index] = $data[$value];
  	  	}
        if($store == "rosters"){
          $tmp["team"] = $team["master"];
        }
        $output[] = $tmp;
      }
    }
	}					
}

// print_r($output);

if (isset($callback)) {
    header('Content-Type: text/javascript');
    echo $callback . '(' . json_encode($output) . ');';
} else {
    header('Content-Type: application/x-json');
    echo json_encode($output);
}		

?>