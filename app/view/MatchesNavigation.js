Ext.define("catcher.view.MatchesNavigation", {
    extend : "Ext.navigation.View",
    xtype : "matchesNavigation",
    id : "matchesNavigation",
    requires : [ "catcher.view.MatchDetail", "catcher.view.MatchesList", "catcher.view.AddPointDetail", "catcher.view.ScoreList", "catcher.view.MatchPlayerList", "catcher.view.EditorPanel","Ext.ActionSheet"],
    config : {
        title : "Zápasy",
        iconCls : "list",        
        items : [ {
            xtype : 'matchesList'
        } ],
        
        layout : {
          animation:false
        },

        navigationBar : {
            id:"navigace",
            defaults: {
                iconMask: true
            },
            items : [
            {
              xtype: "button",
              iconCls:"list",
              id:"menu",
              align:"left",
              navigation_only:true,
              handler:function(){
                var actionSheet = Ext.create('Ext.ActionSheet', {
                    defaults: {
                      iconMask: true
                    },
                    showAnimation:false,                   
                    hideAnimation:false,
                    items: [                      
                        {
                            text: 'Odhlásit z turnaje',
                            ui  : 'decline',
                            iconCls:"power_on",
                            handler:function(){
                              Ext.Msg.confirm("Odhlášení", "Opravdu se chcete odhlásit?", function(response) {
                                if (response == "yes") {
                                  window.location.reload();
                                }
                              });
                            }
                        },
                        {
                            text: 'Zobrazit neodehraná utkání',
                            iconCls:"time",
                            handler:function(){
                              Ext.getCmp("matchesNavigation").showInfo("next","Neukončené zápasy");
                              actionSheet.hide();
                            }
                        },
                        {
                            text: 'Zobrazit skončené zápasy',
                            iconCls:"calendar2",
                            handler:function(){
                              Ext.getCmp("matchesNavigation").showInfo("past","Již skončené zápasy");
                              actionSheet.hide();
                            }
                        },                        
                        {
                            text: 'Zobrazit všechna utkání',
                            iconCls: "star",
                            handler:function(){
                              Ext.getCmp("matchesNavigation").showInfo("all","Všechna utkání");
                              actionSheet.hide();
                            }
                        },
                        {
                            text: 'Přidat nové utkání',
                            iconCls:"add",
                            ui: "confirm",
                            handler:function(){
                              var editorPanel = Ext.getCmp("editorPanel") || new catcher.view.EditorPanel();                
                              if(!editorPanel.getParent()) Ext.Viewport.add(editorPanel);
                              
                              var formPanel = Ext.getCmp('editorPanel');
                              var tournament_id = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).get("tournament_id");                
                              var tournament = Ext.getStore("Tournaments").findRecord("tournament_id",tournament_id,false,false,true);
                              var fields2push = catcher.app.getController("MatchController").composeSelect(tournament.get("fields"));
                              var skupiny2push = catcher.app.getController("MatchController").composeSelect(tournament.get("skupiny"),"skupina");
                              var teams = catcher.app.getController("Evidence").composeTeams();
                              formPanel.query("selectfield[name=field]")[0].setOptions(fields2push);
                              formPanel.query("selectfield[name=skupina]")[0].setOptions(skupiny2push);
                              formPanel.query("selectfield[name=home_id]")[0].setOptions(teams);
                              formPanel.query("selectfield[name=away_id]")[0].setOptions(teams);
                              formPanel.setValues({
                                time:new Date(),
                                length: tournament.get("default_length")
                              });
                              actionSheet.hide();                
                              editorPanel.show();    
                            }
                        },
                        {
                            text: 'Zavřít menu',
                            ui:"action",
                            iconCls: "close",
                            handler:function(){
                              actionSheet.hide();
                            }
                        }
                    ]
                });                
                Ext.Viewport.add(actionSheet);
                actionSheet.show();
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
            if(record.get("finished") == 1) return true;
            return false;
          }
          if(show == "next"){                
            if(record.get("finished") == 0) return true;
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