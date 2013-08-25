Ext.define("catcher.view.MatchesNavigation", {
    extend : "Ext.navigation.View",
    xtype : "matchesNavigation",
    requires : [ "catcher.view.MatchDetail", "catcher.view.MatchesList", "catcher.view.AddPointDetail", "catcher.view.ScoreList", "catcher.view.MatchPlayerList", "catcher.view.EditorPanel"],
    config : {
        title : "Zápasy",
        iconCls : "list",
        id : "matchesNavigation",

        items : [ {
            xtype : 'matchesList'
        } ],

        navigationBar : {
            id:"navigace",
            defaults: {
                iconMask: true
            },
            items : [ 
            {
              xtype: "button",
              iconCls:"time",
              name:"next",
              align:"left",
              filtr:true,
              navigation_only:true,
              handler:function(){
                if(this.getUi() == "decline"){
                  this.up("navigationview").showInfo("all","Všechna utkání");
                }else{
                  this.up("navigationview").showInfo("next","Zatím neodehraná utkání");
                }
              }
            },
            {
              xtype: "button",
              iconCls:"calendar2",
              name:"past",
              align:"left",
              filtr:true,
              navigation_only:true,
              handler:function(){
                if(this.getUi() == "decline"){
                  this.up("navigationview").showInfo("all","Všechna utkání");
                }else{
                  this.up("navigationview").showInfo("past","Již ukončené zápasy");
                }
              }
            },
            {
              xtype: "button",
              iconCls:"add",
              name:"new",
              navigation_only:true,
              align:"right",
              handler:function(){                
                var editorPanel = Ext.getCmp("editorPanel") || new catcher.view.EditorPanel();                
                if(!editorPanel.getParent()) Ext.Viewport.add(editorPanel);
                
                var formPanel = Ext.getCmp('editorPanel');
                var tournament_id = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).get("tournament_id");                
                var tournament = Ext.getStore("Tournaments").findRecord("tournament_id",tournament_id,false,false,true);
                var fields2push = catcher.app.getController("MatchController").composeFields(tournament.get("fields"));
                var teams = catcher.app.getController("Evidence").composeTeams();
                formPanel.query("selectfield[name=field]")[0].setOptions(fields2push);
                formPanel.query("selectfield[name=home_id]")[0].setOptions(teams);
                formPanel.query("selectfield[name=away_id]")[0].setOptions(teams);
                formPanel.setValues({
                  time:new Date()                  
                });                
                editorPanel.show();                                                          
              }
            },
            {
                xtype : "button",                
                iconCls : "refresh",
                ui:"confirm",                
                align : "right",
                name : "refreshConfirm",
                id : "refreshStores",
                handler : function() {                        
                    var matchList = Ext.getCmp("matchesList");
                    var scoreList = Ext.getCmp("scoreList");
                    var matchDetail = Ext.getCmp("matchDetail");
                    var points = Ext.getStore("Points");
                    points.sync();
                    
                    var matches = Ext.getStore("Matches");
                    var match_id = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
                    
                    if (typeof matchList != 'undefined') {
                        matchList.getStore().load();
                    }

                    
                    if (typeof scoreList != 'undefined') {                                          
                      points.clearFilter();
                      points.load(function(){
                        scoreList.getStore().load();
                      });                                                                  
                    }
                                                           
                    if (typeof match_id != 'undefined' && typeof matchDetail != 'undefined') {                        
                        Ext.Viewport.setMasked({
                          xtype : 'loadmask',
                          message : 'Aktualizuji data z www.frisbee.cz'
                        });                                                
                        matches.load(function(){
                          var match = matches.findRecord("match_id", match_id, false, false, false, true).data;
                          Ext.Viewport.setMasked(false);
                          catcher.app.getController("MatchController").fillMatchDetailContent(match);                          
                        });                                                  
                    }
                }
            }                        
          ]
        }
    },
    
    showInfo:function(show,msg){
      var btn = this.query("button[filtr=true]");
      btn.forEach(function(element){
        if(element.name != show) element.setUi("dark");
        if(element.name == show) element.setUi("decline");  
      });
      if(msg != false) {      
        Ext.Viewport.setMasked({
          xtype : 'loadmask',
          message: msg,
          indicator: false
        });
      }
      var store = Ext.getCmp("matchesList").getStore();
      store.clearFilter();
      if(show!="all"){
        store.filterBy(function(record){                    
          if(show == "past"){                            
            if(record.get("time_end").getTime() > 0) return true;
            return false;
          }
          if(show == "next"){                
            if(record.get("time_end").getTime() == 0) return true;
            return false;
          }
        });
      }
      if(msg != false) {
        window.setTimeout(function(){
          Ext.Viewport.setMasked(false);
        },1000);
      }
    }
});