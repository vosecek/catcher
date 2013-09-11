Ext.define("catcher.view.TeamRoster", {
    extend : "Ext.List",
    xtype : "teamRoster",
    id: "teamRoster",

    config : {        
        mode: "MULTI",        
        store : "Rosters",
        itemTpl : "<strong>{nick} #{number}</strong> <small>({surname} {name})</small>",
        onItemDisclosure : false,
        loadingText: "Stahuji kompletní soupisku týmu",
        styleHtmlContent:true,                        
        items:[
          {
            docked: 'top',
            xtype: 'toolbar',
            title: 'Soupiska',
            defaults: {
              iconMask: true
            },
            items:[
              {
                xtype: "button",
                align:"left",
                iconCls: "delete",
                ui: "decline",
                handler: function(){
                  this.up("modalPanel").hide();
                }
              },
              {
                xtype: "spacer"
              },
              {
                xtype: "button",
                align:"right",
                iconCls: "check2",
                ui: "confirm",
                handler: function(){
                  var list = this.up("teamRoster");
                  var store = list.getStore();
                  var roster = list.getSelection();
                  var active_team = Ext.getCmp("connectPlayer").target;
                  var modalPanel = list.up("modalPanel");
                  
                  var length = roster.length;
                  for (var i = 0; i < length; i++) {
                    roster[i].setDirty();
                  }
                                    
                  list.setMasked({
                    xtype : 'loadmask',
                    message : 'Připojuji hráče k týmu pro turnaj'
                  });
                  
                  Ext.Ajax.request({
                    url:"http://www.frisbee.cz/catcher/app/scripts/data_process.php?operation=clear_roster",
                    params:{
                      team: active_team
                    },
                    success: function(response){
                      store.getProxy().setExtraParam("team",active_team);                                            
                      store.syncWithListener(function(){
                        Ext.getStore("Players").load(function(){
                          list.setMasked(false);
                          modalPanel.hide();
                          Ext.Viewport.setMasked({
                            xtype : 'loadmask',
                            message : 'Sestavuji soupisky na tomto zařízení'
                          });                          
                          catcher.app.getController("Evidence").sestavEvidenci(active_team);
                        });
                      });
                    }
                  });
                }
              }
            ]
          }
        ],
        listeners : {
            painted : function() {
              var store = this.getStore();              
              var active_team = Ext.getCmp("connectPlayer").target;              
              var active_team_master = Ext.getStore("Teams").findRecord("team_id",active_team,false,false,false,true).get("master_id");
              var list = this;
              store.clearFilter();
              store.getProxy().setExtraParam("team",active_team);
              store.load(function(){              
                store.filter([ {
                  filterFn : function(item) {
                      return item.get('team') == active_team_master;
                  }
                } ]);
                var aktivni = Ext.getStore("Players");
                var select = new Array;
                aktivni.filter("team",active_team);
                aktivni.each(function(item){
                  var toPush = store.findRecord("player_id",item.get("player_id"),false,false,false,true);
                  if(toPush !== null) select.push(toPush);                   
                });
                list.select(select);
              });
            }
        }
    }
});
