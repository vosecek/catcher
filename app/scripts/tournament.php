<?php
class tournament{
  public $id;
  public $db;
  function __construct($id = false){
    $this->id = $id;
    $this->db = NotORM::make();
  }    
  
  // funkce pro pшepoинtбnн celkovйho skуre hrбищ, kteшн dali bod
  function teamStats($data){
    $query = $this->db->mod_catcher_player2subteam()->where("team_id",$data["team_id"]);
    $this->db->mod_catcher_player2tournament()->where("subteam_id",$data["team_id"])->update(array("order_score"=>0,"order_assist"=>0));
    foreach($query as $radek){  
      $player = new player($radek["player_id"],$this->id);
      $player->computeStats(true);     
    }
    
    $query = $this->db->mod_catcher_player2tournament()->where("subteam_id",$data["team_id"])->order("count_score DESC")->limit(3);
    foreach($query as $value){
      $this->db->mod_catcher_player2tournament()->where("id",$value["id"])->update(array("order_score"=>1));
    }
      
    $query = $this->db->mod_catcher_player2tournament()->where("subteam_id",$data["team_id"])->order("count_assist DESC")->limit(3);
    foreach($query as $value){
      $this->db->mod_catcher_player2tournament()->where("id",$value["id"])->update(array("order_assist"=>1));
    }
  }
}
?>