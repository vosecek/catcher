<?php
class player{
  public $player_id,$number,$name,$surname,$team,$nick;
  public $count_score,$count_assist,$count_matches;
  public $order_score,$order_assist;
  public $tournament,$player2tournament,$subteam;
  private $db;

  function __construct($id,$tournament,$data = false){
    $this->db = NotORM::make();
    if(!is_array($data)){             
      $data = $this->db->mod_catcher_players()->where("id",$id)->fetch();      
    }    
    $this->player_id = $id;
    $this->tournament = $tournament;
    $this->number = $data["number"];
    $this->name = $data["name"];
    $this->surname = $data["surname"];
    $this->team = $data["team"];
    $this->nick = $data["nick"];
     
    
    $subteam = $this->db->mod_catcher_player2tournament->where("player_id",$this->player_id)->where("tournament_id",$this->tournament)->fetch();
    $this->subteam = $subteam["subteam_id"];
    $this->order_score = $subteam["order_score"];
    $this->order_assist = $subteam["order_assist"];
    $this->player2tournament = $subteam["id"]; 
  }
  
  function computeStats(){
    $matches = $this->db->mod_catcher_matches()->select("id")->where("home_id = ".$this->subteam." OR away_id = ".$this->subteam)->where("finished = 1 OR in_play = 1")->where("tournament_id",$this->tournament)->fetchPairs("id","id"); 
    $this->count_score = $this->db->mod_catcher_points()->where("match_id",$matches)->where("player_id",$this->player_id)->count();
    $this->count_assist = $this->db->mod_catcher_points()->where("match_id",$matches)->where("assist_player_id",$this->player_id)->count();
    $this->count_matches = count($matches);
    $update = array("count_score"=>$this->count_score,"count_assist"=>$this->count_assist,"count_matches"=>$this->count_matches);        
    $this->db->mod_catcher_player2tournament("id",$this->player2tournament)->update($update);            
  }
  
  function save(){    
    $update = array("name"=>$this->name,"surname"=>$this->surname,"number"=>$this->number,"nick"=>$this->nick);    
    $this->db->mod_catcher_players("id",$this->player_id)->update($update);
  }
}
?>