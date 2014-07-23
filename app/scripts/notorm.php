<?php
include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

class tournament{
  protected $tournament_id;
  function __construct($tournament_id = false){
    $this->tournament_id = $tournament_id;        
  }
  
  function getId(){
    echo "test";
    echo $this->tournament_id;
//     return $this->tournament_id;    
  }
}

class player extends tournament{
  public $player_id,$number,$name,$surname,$team,$nick;
  public $count_score,$count_assist,$count_matches;
  public $player2tournament,$subteam;
  private $db;

  function __construct($id,$data = false){
    $this->db = NotORM::make();
    if(!is_array($data)){             
      $data = $this->db->mod_catcher_players()->where("id",$id)->fetch();      
    }    
    $this->player_id = $id;
    parent::getId();
    $this->tournament = parent::getId();
    $this->number = $data["number"];
    $this->name = $data["name"];
    $this->surname = $data["surname"];
    $this->team = $data["team"];
    $this->nick = $data["nick"];
    
    echo $this->tournament;    
    
    $subteam = $this->db->mod_catcher_player2tournament->where("player_id",$this->player_id)->where("tournament_id",$this->tournament)->fetch();
    $this->subteam = $subteam["subteam_id"];
    $this->player2tournament = $subteam["id"]; 
  }
  
  function computeStats(){
    $matches = $this->db->mod_catcher_matches()->select("id")->where("home_id = ".$this->subteam." OR away_id = ".$this->subteam)->where("tournament_id",$this->tournament)->fetchPairs("id","id"); 
    $this->count_score = $this->db->mod_catcher_points()->where("match_id",$matches)->where("player_id",$this->player_id)->count();
    $this->count_assist = $this->db->mod_catcher_points()->where("match_id",$matches)->where("assist_player_id",$this->player_id)->count();
    $this->count_matches = count($matches);            
  }
  
  function save(){
    $update = array("count_score"=>$this->count_score,"count_assist"=>$this->count_assist);    
    $this->db->mod_catcher_player2tournament("id",$this->player2tournament)->update($update);
    $update = array("name"=>$this->name,"surname"=>$this->surname,"number"=>$this->number,"nick"=>$this->nick);    
    $this->db->mod_catcher_players("id",$this->player_id)->update($update);
  }
}

$tournament = new tournament(49);

$player = new player(402,false);

// $player->getId();
// $player->computeStats();
// $player->save();

?>