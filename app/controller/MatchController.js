Ext.define('catcher.controller.MatchController', {
    extend : 'Ext.app.Controller',
    require: ["catcher.model.Player"],

    config : {
        refs : {
            matchesNavigation : "matchesNavigation",
            matchDetail : "matchDetail",
            addPointDetail : "addPointDetail",
            editPointDetail : "editPointDetail",
            scoreList : "scoreList",
            matchDetailSettings: "matchDetailSettings",            
            matchDetailScore: "matchDetailScore"
        },
        control : {
            "matchesList" : {
//                 disclose : "showMatchDetail",
                itemsingletap : "showMatchDetail",
                itemtaphold: "confirmMatchDelete",
                itemswipe: "confirmMatchDelete"
            },
            "matchesNavigation matchPlayerList[name=score]" : {
//                 disclose : "showAssistPlayer",
                itemsingletap : "showAssistPlayer"
//                 select: "showAssistPlayer"
            },
            "matchesNavigation matchPlayerList[name=assist]" : {
//                 disclose : "addPoint",
                itemsingletap : "addPoint"
//                 select: "addPoint"
            },
            "matchDetail button[name=scoreHome]" : {
                tap : "showScore"
            },
            "matchDetail button[name=scoreAway]" : {
                tap : "showScore"
            },
            "matchDetail button[name=addPointHome]" : {
                tap : "showAddPoint"
            },
            "matchDetail button[name=addPointAway]" : {
                tap : "showAddPoint"
            },
            "scoreList" : {
//                 disclose : "showEditPoint",
                select : "showEditPoint"
            },
            "editPointDetail button[name=editConfirm]" : {
                tap : "updatePoint"
            },
            "matchDetailSettings button[name=submit]":{
                tap: "updateMatchSettings"
            },
            "matchDetailScore button[name=submit]":{
                tap: "updateMatchScore"
            }
        },
        listeners: {
          initialize: function(){            
          }
        }
    },
    
    confirmMatchDelete: function (el,index,target,record){
      el.suspendEvents();
      Ext.Msg.confirm("Smazat zápas","Opravdu chceš smazat zápas? <br />"+record.get("home_name_full")+" vs. "+record.get("away_name_full"),function(response){        
        if(response == "yes"){
          var store = el.getStore();
          store.remove(record);
          store.sync();
          Ext.Msg.alert("OK","Zápas odstraněn");                    
        }
        el.resumeEvents(true);
        el.deselectAll();
      })
    },
    
    showMatchDetail : function(list, index,target,record) {        
        var match = record.data;
        Ext.getCmp("matchesNavigation").query("button[navigation_only=true]").forEach(function(el){el.hide()}); // skrytí filtrovacích tlačítek
        this.getMatchesNavigation().push({
            xtype : "matchDetail",
            title : match.home_name_short + " x " + match.away_name_short,
            data : match
        });        
        Ext.getCmp("tournament").getTabBar().hide(); // skrytí hlavní navigace turnaje
        var session = getSession();
        session.match_id = match.match_id;
        this.fillMatchDetailContent(match);
        this.fillMatchDetailSettings(match);        
    },

    showAddPoint : function(event) {
        var session = getSession();
        var match = Ext.getStore("Matches").findRecord("match_id", session.match_id, false, false, false, true).data;         
        session.score_team_id = match[event.getUi()+"_id"];        

        var team = Ext.getStore("Teams").findRecord("team_id", session.score_team_id, false, false, false, true).data;
        session.score_team_name_short = team.name_short;

        var players = Ext.getStore("Players");
        players.clearFilter();
        players.filter([ {
            filterFn : function(item) {
                return item.get('team') == session.score_team_id;
            }
        } ]);
        
        
        var MatchPlayerListScore = Ext.getStore("MatchPlayerListScore");        
        var MatchPlayerListAssist = Ext.getStore("MatchPlayerListAssist");
        MatchPlayerListScore.setData(players.data.items);
        MatchPlayerListAssist.setData(players.data.items);
        
        // přidání anonymního hráče do nabídky pro skórování i nahrávání
        var anonym = Ext.create("catcher.model.Player",{
          nick:"Anonym",
          name:"Anonymní",
          surname:"Hráč",
          player_id:0,
          team:session.score_team_id,
          number:0
        });
        MatchPlayerListScore.add(anonym);
        MatchPlayerListAssist.add(anonym);
        
        if(players.getCount() == 0){
          this.addPointInternal(0,1);
        }
        
//         players.sort();

        this.getMatchesNavigation().push({
            xtype : "matchPlayerList",
            title : "Skóroval " + team.name_short,
            name : "score",
            store : MatchPlayerListScore,
            id: "MatchPlayerListScore"
        });
    },

    showAssistPlayer : function(list, index, target, record) {
        list.setDisableSelection(true);
        var session = getSession();
//         console.log(record);
//         console.log(list);
        session.score_player_id = record.data.player_id;        
        
        var MatchPlayerListAssist = Ext.getStore("MatchPlayerListAssist");                                                            
        
        // přidání CallahanGoal do nabídky pro asistenci
        var callahan = Ext.create("catcher.model.Player",{
          nick:"Callahan",
          name:"Callahan",
          surname:"Goal",
          player_id:2147483647,
          team:session.score_team_id,
          number:0
        });
                
        MatchPlayerListAssist.add(callahan);                
        
        this.getMatchesNavigation().push({
            xtype : "matchPlayerList",
            title : "Nahrával " + session.score_team_name_short,
            name : "assist",
            store : MatchPlayerListAssist,
            id: "MatchPlayerListAssist"
        });
        list.setDisableSelection(false);
    },

    addPoint : function(list, index, target, record) {
        list.setDisableSelection(true);
        var session = getSession();
        var assist_player_id = record.data.player_id;

        var MatchPlayerListScore = Ext.getStore("MatchPlayerListScore").findRecord("player_id", session.score_player_id, false, false, false, true).data;
        var MatchPlayerListAssist = Ext.getStore("MatchPlayerListAssist").findRecord("player_id", assist_player_id, false, false, false, true).data;
        var message = "Bod: " + fullName(MatchPlayerListScore) + "<br />Asistence: " + fullName(MatchPlayerListAssist);

        Ext.Msg.confirm("Zadat bod?", message, function(response) {
            if (response == "yes") {
                catcher.app.getController("MatchController").addPointInternal(assist_player_id,2);
            }else{
              list.deselectAll();
            }
        });
        list.setDisableSelection(false);
    },

    addPointInternal : function(assist_player_id,pop_level) {
        var session = getSession();
        var points = Ext.getStore("Points");
        var matches = Ext.getStore("Matches");
        
        // pop_level == 1 -> rychlé přidání bodu, žádný hráč na soupisce
        if(pop_level == 1) session.score_player_id = 0;

        var point = Ext.create("catcher.model.Point", {
            point_id: false,
            team_id : session.score_team_id,
            player_id : session.score_player_id,
            match_id : session.match_id,
            assist_player_id : assist_player_id,
            time : Math.round(+new Date()/1000),
            anonymous : false
        });
                                              
                                                            
        // přidat bod do interní DB, synchronizovat a označit jako zpracované
          point.setDirty();          
          points.add(point);
          Ext.Viewport.setMasked({
            xtype: "loadmask",
            message : "Ukládám bod na frisbee.cz"
          });                    
          
          points.syncWithListener(function(){
            var controller = catcher.app.getController("MatchController");                        
            controller.updateMatchPoints(point.get("match_id"));            
            controller.updateMatchInfo(point.get("match_id"),pop_level);
          });                                                                                                                                                                                                          
    },
    
    updateMatchInfo : function(match_id,pop_level){
      pop_level = typeof pop_level !== 'undefined' ? pop_level : 2;            
      var matches = Ext.getStore("Matches");
      matches.getProxy().setExtraParam("id",match_id);
      matches.load(function(){
        var match = matches.findRecord("match_id",match_id,false,false,false,true);
        var controller = catcher.app.getController("MatchController");
        controller.fillMatchDetailContent(match.data);        
        controller.fillMatchDetailSettings(match.data);
        if(pop_level > 0) controller.getMatchesNavigation().pop(pop_level);
        Ext.Viewport.setMasked(false);
        matches.getProxy().setExtraParams({});                
      });                  
    },    
    
    // nastavení počitadla u všech bodů konkrétního zápasu
    updateMatchPoints : function(match_id){
      var points = Ext.getStore("Points");
      points.getProxy().setExtraParam("match_id",match_id);
      points.load(function(){
        points.getProxy().setExtraParams({});
      });            
    },

    showScore : function(event) {
        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;
        var team = event.getUi();
        this.getMatchesNavigation().push({
            xtype : "scoreList",
            title : "Skóre " + match[team+"_name_short"],
            store : getTeamScore(match.match_id, match[team+"_id"])
        });
    },

    showEditPoint : function(list, record) {
        var point = Ext.getStore("Points").findRecord("point_id", record.data.pointId,false,false,false,true).data;

        this.getMatchesNavigation().push({
            xtype : "editPointDetail",
            data : record.data
        });

        var coPlayers = getCoPlayers(point.team_id);

        var editPointDetail = this.getEditPointDetail();

        editPointDetail.query("selectfield[name=scoringPlayer]")[0].setOptions(coPlayers).setValue(point.player_id);
        editPointDetail.query("selectfield[name=assistPlayer]")[0].setOptions(coPlayers).setValue(point.assist_player_id);
        editPointDetail.query("hiddenfield[name=pointId]")[0].setValue(point.point_id);
    },

    updatePoint : function() {
        var values = this.getEditPointDetail().getValues();

        var point = Ext.getStore("Points").findRecord("point_id", values.pointId,false,false,false,true);
        point.set("player_id", values.scoringPlayer);
        point.set("assist_player_id", values.assistPlayer);
        Ext.Viewport.setMasked({
          xtype:"loadmask",
          message: "aktualizuji bod na frisbee.cz"
        });
        Ext.getStore("Points").syncWithListener(function(){
          var controller = catcher.app.getController("MatchController");          
          var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
          var scoringPlayer = Ext.getStore("Players").findRecord("player_id", values.scoringPlayer,false,false,false,true).data;
          controller.getScoreList().setStore(getTeamScore(matchId, scoringPlayer.team));
          controller.getScoreList().deselectAll();
          Ext.Viewport.setMasked(false);
          controller.getMatchesNavigation().pop();
        });
    },

    deletePoint : function() {
        var values = this.getEditPointDetail().getValues();
        var points = Ext.getStore("Points");
        var matches = Ext.getStore("Matches");
        var remove = points.findRecord("point_id", values.pointId,false,false,false,true);
        var match_id = remove.get("match_id");
                
        points.remove(remove);        
        points.syncWithListener(function(){
          var controller = catcher.app.getController("MatchController");
          controller.updateMatchPoints(match_id);
          controller.updateMatchInfo(match_id);
        });                               
    },

    fillMatchDetailContent : function(match) {
        this.getMatchDetail().query("button[name=scoreHome]")[0].setText(new String(match.score_home));
        this.getMatchDetail().query("button[name=scoreAway]")[0].setText(new String(match.score_away));
        
        var cisla = new Array;
        for(var i = 0;i<100;i++){
          cisla.push({text:i,value:i});
        }        
//         var runner = this.getMatchDetailScore().query("togglefield")[0];
//         runner.on("change",function(field,slider,thumb,newValue,oldValue){      
//           Ext.Msg.confirm("Potvrdit akci","Opravdu začal či skončil zápas?",function(response){
//             if(response == "yes") {
//               return true;
//             }
//             runner.suspendEvents();
//             runner.toggle();
//             
//             runner.resumeEvents(true);          
//           });
//         });
        
        var formular = this.getMatchDetailScore();
        var selects = formular.query("selectfield").forEach(function(el){el.setOptions(cisla);});
        formular.setValues(match);
        
        formular.setValues(match);
        formular.query("selectfield[name=score_home]")[0].setLabel("Skóre "+match.home_name_short);
        formular.query("selectfield[name=spirit_home]")[0].setLabel("Spirit "+match.home_name_short);
        formular.query("selectfield[name=score_away]")[0].setLabel("Skóre "+match.away_name_short);
        formular.query("selectfield[name=spirit_away]")[0].setLabel("Spirit "+match.away_name_short);
        
        getTeamScore(match.match_id,match.home_id);
        getTeamScore(match.match_id,match.away_id);
        Ext.getStore("Points").clearFilter();
    },        
    
    fillMatchDetailSettings: function(match){            
      this.getMatchDetailSettings().setValues(match);            
      var session = getSession();
      var tournament_data = Ext.getStore("Tournaments").findRecord("tournament_id",session.get("tournament_id"),false,false,true);
      var fields2push = this.composeSelect(tournament_data.get("fields"));      
      var skupiny2push = this.composeSelect(tournament_data.get("skupiny"),"skupina");
      this.getMatchDetailSettings().query("selectfield[name=field]")[0].setOptions(fields2push).setValue(match.field);            
      this.getMatchDetailSettings().query("selectfield[name=skupina]")[0].setOptions(skupiny2push).setValue(match.skupina);
    },
    
    composeSelect:function(input,type){
      if(typeof type == "undefined") type = "fields"; 
      var data = input.split("*");
      var length = data.length,
      element = null;
      var options = new Array();
      var typy_skupin = new Array;
      typy_skupin["PO#Q"]="Čtvrtfinále";
      typy_skupin["PO#LQ"]="Křížový zápas 5-8. místo";
      typy_skupin["PO#WLQ"]="O 5. místo";
      typy_skupin["PO#LLQ"]="O 7. místo";
      typy_skupin["PO#S"]="Semifinále";
      typy_skupin["PO#LS"]="O 3. místo";
      typy_skupin["PO#F"]="Finále";            
      for (var i = 0; i < length; i++) {
        element = data[i];
        var element2 = element;
        if(type == "skupina") element2 = typy_skupin[element];
        if(typeof element2 == "undefined") element2 = element;
        options.push({
          text:element2,
          value:element
        });         
      }
      return options;
    },
    
    updateMatchScore : function(){
      Ext.Viewport.setMasked({
          xtype : 'loadmask',
          message : 'Ukládám informace o zápase'
      });
      
      var form = this.getMatchDetailScore();
      values = form.getValues(true, true);
      
      var matches = Ext.getStore("Matches");
      var match = matches.findRecord("match_id",values.match_id,false,false,true);
      
      var diffs = new Array;
      var diffs_fatal = new Array;
      
      if(values.score_home !== undefined){
        if(values.score_home < match.get("score_home")) diffs_fatal.push("Skóre "+match.get("home_name_short")+" je menší než počet uložených bodů ("+match.get("score_home")+"), pro uložení zápasu smaž některé body!");
        if(values.score_home > match.get("score_home")) diffs.push("Skóre "+match.get("home_name_short")+" je větší než počet uložených bodů ("+match.get("score_home")+"), při uložení dojde k vygenerování anonymních bodů. Opravdu?");
        
        if(values.score_away < match.get("score_away")) diffs_fatal.push("Skóre "+match.get("away_name_short")+" je menší než počet uložených bodů ("+match.get("score_away")+"), pro uložení zápasu smaž některé body!");
        if(values.score_away > match.get("score_away")) diffs.push("Skóre "+match.get("away_name_short")+" je větší než počet uložených bodů ("+match.get("score_away")+"), při uložení dojde k vygenerování anonymních bodů. Opravdu?"); 
      }
      
      Ext.Msg.confirm("Zadávaný výsledek",match.get("home_name_short")+" vs. "+match.get("away_name_short")+": "+values.score_home+":"+values.score_away,function(response){
        if(response == "yes"){                       
          if(diffs_fatal.length > 0){
            Ext.Msg.alert("Chybné skóre",diffs_fatal.join("<br />"));
          }else{
            if(diffs.length > 0){
              Ext.Msg.confirm("Chybné skóre",diffs.join("<br />"),function(response){              
                if(response == "yes") {              
                  var points = Ext.getStore("Points");              
                  function equalizer(difference,team_id,match_id){
                    var i = 0;
                    while(difference > i){
                      var equalizer = Ext.create("catcher.model.Point", {
                          team_id : team_id,
                          player_id : 0,
                          match_id : match.get("match_id"),
                          assist_player_id : 0,
                          time : Math.round(+new Date()/1000)+i,
                          anonymous: true
                      });
                      points.add(equalizer);                
                      i++;
                    }                
                  }
                  
                  if(values.score_home > match.get("score_home")) equalizer((values.score_home-match.get("score_home")),match.get("home_id"));
                  if(values.score_away > match.get("score_away")) equalizer((values.score_away-match.get("score_away")),match.get("away_id"));
                  points.syncWithListener(function(){
                    var controller = catcher.app.getController("MatchController");            
                    controller.updateMatchPoints(match.get("match_id"));            
                    controller.updateMatchInfo(match.get("match_id"),-1);
                    saveMatchSettings(match,values);                
                  });              
                }else{
                  Ext.Viewport.setMasked(false);
                }                                  
              });
            }else{
              saveMatchSettings(match,values);
            }
          }
        }else{
          Ext.Viewport.setMasked(false);
        }
      });
    },        
    
    updateMatchSettings : function(){
      Ext.Viewport.setMasked({
          xtype : 'loadmask',
          message : 'Ukládám informace o zápase'
      });      
      
      var form = this.getMatchDetailSettings();            
      values = form.getValues(true, true);
      
      var matches = Ext.getStore("Matches");
      var match = matches.findRecord("match_id",values.match_id,false,false,true);
      
      saveMatchSettings(match,values);                                                
    }
});

function saveMatchSettings(match,values){
  var matches = Ext.getStore("Matches");
  match.set(values);            
  match.setDirty();
  
  matches.getProxy().setExtraParam("match_id",values.match_id);                 
  
  matches.syncWithListener(function(){
    Ext.Msg.alert("OK","Informace o zápasu aktualizovány.");
    Ext.Viewport.setMasked(false);            
  });
}


function fullName(player) {    
    return player.nick + " #" + player.number + " <small>(" + player.surname + " " + player.name + ")</small>";
}

function fullNameInput(player) {    
    return player.nick + " #" + player.number + " (" + player.surname + " " + player.name + ")";
}

function getTeamScore(matchId, teamId) {
    var points = Ext.getStore("Points");
    points.clearFilter();
    points.filter("match_id", matchId);
    points.filter("team_id", teamId);

    var ScoreRoster = Ext.getStore("MatchPlayerListAssist");

    var pointsToDisplay = new Array();
    points.each(function(item, index, length) {

        var scoringPlayer = ScoreRoster.findRecord("player_id", new String(item.get("player_id")));
        var assistPlayer = ScoreRoster.findRecord("player_id", new String(item.get("assist_player_id")));
        if(scoringPlayer == null) {
          
        }                  
        pointsToDisplay.push({          
            scoringPlayer : scoringPlayer != null ? fullName(scoringPlayer.data) : "nezadáno",
            assistPlayer : assistPlayer != null ? fullName(assistPlayer.data) : "nezadáno",
            pointId : item.get("point_id"),
            time : item.get("time"),
            score_home: item.get("score_home"),
            score_away: item.get("score_away")              
        });
    });        

    Ext.define("PointView", {
        extend : "Ext.data.Model",
        config : {
            fields : [ {
                name : 'scoringPlayer',
                type : 'string'
            }, {
                name : 'assistPlayer',
                type : 'string'
            }, {
                name : 'pointId',
                type : 'int'
            }, {
            }, {
                name : 'score_home',
                type : 'int'
            }, {
            }, {
                name : 'score_away',
                type : 'int'
            }, {
                name : 'time',
                type : 'date',
                dateFormat : 'timestamp'
            } ]
        }
    });

    return new Ext.data.Store({
        model : 'PointView',
        data : pointsToDisplay,
        sorters : [ {
            property : 'time',
            direction : 'DESC'
        } ]
    });        
}

function getCoPlayers(team) {
    var players = Ext.getStore("Players");
    players.clearFilter();
    players.filter("team", team);

    var coPlayers = new Array();        

    players.each(function(item, index, length) {
        var player = item.data;
        coPlayers.push(createPlayerOption(player));
    });
    return coPlayers;
}

function createPlayerOption(player) {
    return {
        text : fullNameInput(player),
        value : player.player_id
    };
}

function getSession(){
  return Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
}