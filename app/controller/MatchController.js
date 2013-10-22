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
//                 itemtaphold: "confirmMatchDelete",
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
            "matchDetail button[name=matchScore]" : {
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
            }
        },
        listeners: {
          initialize: function(){            
          }
        }
    },
    
    confirmMatchDelete: function (el,index,target,record){
      el.suspendEvents();
      
      Ext.device.Notification.show({
          title: 'Smazat zápas',
          message: "Opravdu chceš smazat zápas? <br />"+record.get("home_name_full")+" vs. "+record.get("away_name_full"),
          buttons: [{text:"Zrušit", ui: "decline"},{text:"Smazat zápas", ui: "confirm"}],
          callback: function(button) {
              if (button == "Smazat zápas") {
                  var store = el.getStore();
                  store.remove(record);
                  Ext.Viewport.setMasked({xtype:"loadmask",message:"Mažu zápas na serveru"});
                  store.syncWithListener(function(response){            
                    Ext.Msg.alert("OK","Zápas odstraněn");
                    Ext.Viewport.setMasked(false);
                  });
              }
              el.resumeEvents(true);
              el.deselectAll();
          }
      });      
    },
    
    showMatchDetail : function(list,index,target,record,toFinish) {
      if(typeof toFinish == "undefined") toFinish = false;              
        Ext.getCmp("tournament").getTabBar().hide(); // skrytí hlavní navigace turnaje        
        var match = record;
        Ext.getCmp("matchesNavigation").query("button[navigation_only=true]").forEach(function(el){el.hide()}); // skrytí filtrovacích tlačítek 
        this.getMatchesNavigation().push({
            xtype : "matchDetail",
            title : match.get("home_name_short") + " x " + match.get("away_name_short"),
            data : match.data
        });
        
        catcher.app.getController("MatchController").updateMatchPoints(match.get("match_id"));
        
        var session = getSession();
        session.match_id = match.get("match_id");
        
        this.fillMatchDetail(match);
        if(toFinish == true) {
          var button = Ext.getCmp("actionSheet").query("button[iconCls=check2]")[0]; 
          button._handler();
        }
                
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
          number:0,
          type:1
        });
        MatchPlayerListScore.add(anonym);
        MatchPlayerListAssist.add(anonym);
        
        MatchPlayerListScore.sort([
          {
            "property":"type",
            "direction":"DESC"
          },{
            "property":"order_score",
            "direction":"DESC"
          },{
            "property":"nick",
            "direction":"ASC"
          }
        ]);
        
        MatchPlayerListAssist.sort([
          {
            "property":"type",
            "direction":"DESC"
          },{
            "property":"order_assist",
            "direction":"DESC"
          },{
            "property":"nick",
            "direction":"ASC"
          }
        ]);          
        
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

        session.score_player_id = record.data.player_id;        
        
        var MatchPlayerListAssist = Ext.getStore("MatchPlayerListAssist");                                                            
        
        // přidání CallahanGoal do nabídky pro asistenci
        var callahan = getCallahan();
                
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

        Ext.device.Notification.show({
            title: 'Zadat bod?',
            message: message,
            buttons: [{text:"Zrušit", ui: "decline"},{text:"Uložit", ui: "confirm"}],
            callback: function(button) {
                if (button == "Uložit") {
                    catcher.app.getController("MatchController").addPointInternal(assist_player_id,2);
                } else {
                    list.deselectAll();
                }
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
            controller.updateTeamPlayers(point.get("team_id"));
          });                                                                                                                                                                                                          
    },
    
    updateTeamPlayers : function(team){
      var players = Ext.getStore("Players");
      players.filterBy(function(item){
        if(item.get("team") == team) {          
          item.setDirty();
          return true;
        }
      });      
      
      players.syncWithListener(function(){
        players.clearFilter();        
      });
    },
    
    updateMatchInfo : function(match_id,pop_level){
      pop_level = typeof pop_level !== 'undefined' ? pop_level : 2;            
      var matches = Ext.getStore("Matches");      
      matches.getProxy().setExtraParam("id",match_id);
      var match = matches.findRecord("match_id",match_id,false,false,false,true);
      match.setDirty(true);
      matches.syncWithListener(function(){                
        var controller = catcher.app.getController("MatchController");
        controller.fillMatchDetail(match);
        if(pop_level > 0) controller.getMatchesNavigation().pop(pop_level);
        Ext.Viewport.setMasked(false);
        matches.getProxy().setExtraParams({});                
      });                  
    },    
    
    // nastavení počitadla u všech bodů konkrétního zápasu
    updateMatchPoints : function(match_id){
      var points = Ext.getStore("Points");
      points.clearFilter();
      points.getProxy().setExtraParam("match_id",match_id);
      points.load(function(){
        points.getProxy().setExtraParams({});
      });            
    },

    showScore : function(event) {
        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;
        this.getMatchesNavigation().push({
            xtype : "scoreList",
            title : "Skóre " + match["away_name_short"]+" vs. "+match["away_name_short"],
            store : getMatchScore(match.match_id)
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
        
        editPointDetail.query("selectfield[name=assistPlayer]")[0].setOptions(coPlayers).setValue(point.assist_player_id);
        coPlayers.splice(1,1);
        editPointDetail.query("selectfield[name=scoringPlayer]")[0].setOptions(coPlayers).setValue(point.player_id);
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
        Ext.getStore("Players").clearFilter();
        Ext.getStore("Points").syncWithListener(function(){
          var controller = catcher.app.getController("MatchController");          
          var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
          controller.getScoreList().setStore(getMatchScore(matchId));
          controller.getScoreList().deselectAll();
          Ext.Viewport.setMasked(false);
          controller.getMatchesNavigation().pop();
        });
    },

    deletePoint : function() {
      Ext.Viewport.setMasked({
        xtype:"loadmask",
        message:"Odstraňuji bod ze serveru"
      });
        var values = this.getEditPointDetail().getValues();
        var points = Ext.getStore("Points");
        var matches = Ext.getStore("Matches");        
        var remove = points.findRecord("point_id", values.pointId,false,false,false,true);        
        var match_id = remove.get("match_id");
                
        points.remove(remove);        
        points.syncWithListener(function(){
          var controller = catcher.app.getController("MatchController");
          controller.updateMatchPoints(match_id);
          controller.updateMatchInfo(match_id,2);
          Ext.Viewport.setMasked(false);
        });
        
//         if(remove.get("match_id")                               
    },    
    
    fillMatchDetail : function(match){            
      var home = this.getMatchDetail().query("label[name=score_home]")[0];
      var away = this.getMatchDetail().query("label[name=score_away]")[0];
            
      function updateCounter(counter){
        if((counter.getHtml() != match.get(counter.config.name)) && counter.getHtml()!==""){          
          counter.setStyle("color:red");                
          setTimeout(function(){
            counter.setHtml(match.get(counter.config.name));
            setTimeout(function(){
              counter.setStyle("color:black;");
            },1000);
          },1000);                        
        }else{
          counter.setHtml(match.get(counter.config.name));
        }
      }
      
      updateCounter(home);
      updateCounter(away);

      getMatchScore(match.get("match_id"));
      Ext.getStore("Points").clearFilter();
    },

    fillMatchDetailScore : function(match) {                            
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

        var cisla = new Array;
        for(var i = 0;i<100;i++){
          cisla.push({text:i,value:i});
        }
                
        var formular = this.getMatchDetailScore();      
        var selects = formular.query("selectfield").forEach(function(el){el.setOptions(cisla);});
        
        formular.setValues(match.data);
        formular.query("selectfield[name=score_home]")[0].setLabel("Skóre "+match.get("home_name_short"));
        formular.query("selectfield[name=spirit_home]")[0].setLabel("Spirit "+match.get("home_name_short"));
        formular.query("selectfield[name=score_away]")[0].setLabel("Skóre "+match.get("away_name_short"));
        formular.query("selectfield[name=spirit_away]")[0].setLabel("Spirit "+match.get("away_name_short"));                        
    },        
    
    fillMatchDetailSettings: function(match){
      var formular = this.getMatchDetailSettings();             
      formular.setValues(match.data);                  
      var session = getSession();
      var tournament_data = Ext.getStore("Tournaments").findRecord("tournament_id",session.get("tournament_id"),false,false,true);
      var fields2push = this.composeSelect(tournament_data.get("fields"),"fields");      
      var skupiny2push = this.composeSelect(tournament_data.get("skupiny"),"skupina");
      var times = new Array;
      for(i = 20;i<95;i = i + 5){
        times.push({
          text:i+" minut",
          value:i
        });
      }
      formular.query("selectfield[name=field]")[0].setOptions(fields2push).setValue(match.get("field"));            
      formular.query("selectfield[name=skupina]")[0].setOptions(skupiny2push).setValue(match.get("skupina"));
      formular.query("selectfield[name=length]")[0].setOptions(times).setValue(match.get("length"));
    },
    
    composeSelect:function(input,type){
      if(typeof type == "undefined") type = "fields"; 
      var options = new Array();
      
      source_data = input.split("*");
      
      var data = new Array;        
      var tmp = new Array;
      for(var i = 0;i < source_data.length;i++){        
        tmp = source_data[i].split("#");          
        if(tmp.length > 1){ 
          data[tmp[0]+"#"+tmp[1]] = tmp[1];
        }else{
          data[source_data[i]] = source_data[i];
        } 
      }                                  
                  
      for (key in data) {        
        options.push({
          text:data[key],
          value:key
        });         
      }
      return options;
    },
    
    updateMatchScore : function(){            
      var form = this.getMatchDetailScore();
      values = form.getValues(true, true);
      
      var matches = Ext.getStore("Matches");
      var match = matches.findRecord("match_id",values.match_id,false,false,true);
      
      var diffs = new Array;
      var diffs_fatal = new Array;
      
      if(values.score_home !== undefined){
        if(values.score_home < match.get("score_home")) diffs_fatal.push("Skóre "+match.get("home_name_short")+" je menší než počet uložených bodů ("+match.get("score_home")+"), pro uložení zápasu smaž některé body!");
        if(values.score_home > match.get("score_home")) diffs.push("Existující skóre "+match.get("home_name_short")+": "+match.get("score_home")+", vkládané: "+values.score_home);
        
        if(values.score_away < match.get("score_away")) diffs_fatal.push("Existující skóre "+match.get("away_name_short")+" je menší než počet uložených bodů ("+match.get("score_away")+"), pro uložení zápasu smaž některé body!");
        if(values.score_away > match.get("score_away")) diffs.push("Existující skóre "+match.get("away_name_short")+": "+match.get("score_away")+", vkládané: "+values.score_away); 
      }
      
      Ext.device.Notification.show({
          title: 'Zadávaný výsledek',
          message: "<span style='color:red'>"+match.get("home_name_short")+"</span> vs. <span style='color:lime'>"+match.get("away_name_short")+"</span><br /> <span style='color:red'>"+values.score_home+"</span>:"+"<span style='color:lime'>"+values.score_away+"</span>",
          buttons: [{text:"Zrušit", ui: "decline"},{text:"Uložit", ui: "confirm"}],
          callback: function(response) {
              if(response == "Uložit"){                       
                if(diffs_fatal.length > 0){
                  Ext.Msg.alert("Nižší skóre",diffs_fatal.join("<br />"));            
                }else{
                  Ext.Viewport.setMasked({
                      xtype : 'loadmask',
                      message : 'Ukládám informace o zápase'
                  });
                  if(diffs.length > 0){
                    Ext.device.Notification.show({
                      title:"Vyšší skóre",
                      message:"<span style='color:red'>Zadané skóre je vyšší než naskórované, vytvořím anonymní body, opravdu?</span><br />"+diffs.join("<br />"),
                      buttons: [{text:"Zrušit", ui: "decline"},{text:"Vytvořit body", ui: "confirm"}],
                      callback:function(response){              
                        if(response == "Vytvořit body") {              
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
                          
                          Ext.Ajax.request({
                            url:"http://www.frisbee.cz/catcher/app/scripts/data_process.php?operation=set_score",
                            params:{
                              score_home:values.score_home,
                              score_away:values.score_away,
                              spirit_home:values.spirit_home,
                              spirit_away:values.spirit_away,
                              home_id:match.get("home_id"),
                              away_id:match.get("away_id"),
                              match_id:match.get("match_id")
                            },
                            success: function(response){                  
                              var store = Ext.getStore("Points");
                              store.load(function(response){                        
                                catcher.app.getController("MatchController").updateMatchInfo(match.get("match_id"),-1);
                                saveMatchSettings(match,values);                      
                              });
                            }
                          });                                
                        }else{
                          Ext.Viewport.setMasked(false);
                        }
                      }                                  
                    });
                  }else{
                    saveMatchSettings(match,values);
                  }
                }
              }else{
                Ext.Viewport.setMasked(false);
              }
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
    },
    
    checkUnfinishedMatches : function (store){
      store.each(function(record){                      
        if(record.get("finished") == false){
          var length = record.get("length")*60*1000;
          var cap = 1200000;
          if(record.get("time").getTime()+length+cap < new Date().getTime()){
            Ext.device.Notification.show({
                title: 'Neukončený zápas',
                message: "Zápas <span style='color:white'>"+record.get("home_name_short")+" vs. "+record.get("away_name_short")+"</span> není ukončený a zřejmě již skončil.<br />Přejít do detailu zápasu a po zkontrolování výsledného skóre ukončit?.",
                buttons: [{text:"Zrušit", ui: "decline"},{text:"Ukončit zápas", ui: "confirm"}],
                callback: function(button) {
                    if (button == "Ukončit zápas") {
                        catcher.app.getController("MatchController").showMatchDetail(false,false,false,record,true);
                    }
                }
            });            
          }
        }
      });
    }
});

function saveMatchSettings(match,values){
  var matches = Ext.getStore("Matches");
  match.set(values);            
  match.setDirty();
  
  matches.getProxy().setExtraParam("match_id",values.match_id);                 
  
  matches.syncWithListener(function(){
    Ext.Viewport.setMasked(false);            
  });
}


function fullName(player) {    
    return player.nick + " #" + player.number + " <small>(" + player.surname + " " + player.name + ")</small>";
}

function fullNameInput(player) {    
    return player.nick + " #" + player.number + " (" + player.surname + " " + player.name + ")";
}

function getAnonym(team){
  if(typeof team == "undefined") team = 0;
  return Ext.create("catcher.model.Player",{
    nick:"Anonym",
    name:"Anonymní",
    surname:"Hráč",
    player_id:0,
    team:team,
    number:0,
    type:1
  });  
}

function getCallahan(team){
  return Ext.create("catcher.model.Player",{
    nick:"Callahan",
    name:"Callahan",
    surname:"Goal",
    player_id:2147483647,
    team:team,
    number:0,
    type:1
  });  
}

function getMatchScore(matchId) {
    var points = Ext.getStore("Points");
    points.clearFilter();
    points.filterBy(function(item){
      if(item.get("match_id") == matchId) return true
    });    

    var ScoreRoster = Ext.getStore("Players");
    
    ScoreRoster.clearFilter();        

    var pointsToDisplay = new Array();

    points.each(function(item, index, length) {
        var scoringPlayer = ScoreRoster.findRecord("player_id", new String(item.get("player_id")),false,false,false,true);
        var assistPlayer = ScoreRoster.findRecord("player_id", new String(item.get("assist_player_id")),false,false,false,true);
        if(item.get("player_id") == 0) scoringPlayer = getAnonym();                          
        if(item.get("assist_player_id") == 2147483647) assistPlayer = getCallahan();
        if(item.get("assist_player_id") == 0) assistPlayer = getAnonym();

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
    
    var anonym = getAnonym(team);    
    var callahan = getCallahan(team);
    
    coPlayers.push(createPlayerOption(anonym.data));        
    coPlayers.push(createPlayerOption(callahan.data));

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
