Ext.define("catcher.view.MatchesNavigation", {
    extend : "Ext.navigation.View",
    xtype : "matchesNavigation",
    id : "matchesNavigation",
    requires : [ "catcher.view.MatchDetail", "catcher.view.MatchesList", "catcher.view.AddPointDetail", "catcher.view.ScoreList", "catcher.view.MatchPlayerList", "catcher.view.EditorPanel","catcher.view.MainNavigation"],
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
              align:"right",
              handler:function(){                
                Ext.getCmp("actionSheet").show();
              }
            }                                    
          ]
        },
        listeners:{
          push:function(nav,view){
            var activeItem = nav.getActiveItem();
            var actionSheet = Ext.getCmp("actionSheet");
            nav.prepareActionSheet(actionSheet,activeItem);
          },
          pop:function(nav,view){            
            var activeItem = nav.getActiveItem();
            var actionSheet = Ext.getCmp("actionSheet");
            nav.prepareActionSheet(actionSheet,activeItem);
          },
          painted: function(){
            var actionSheet = Ext.getCmp("actionSheet") || new catcher.view.MainNavigation();
            if(!actionSheet.getParent()) Ext.Viewport.add(actionSheet);
            actionSheet.hide();
            this.prepareActionSheet(actionSheet,this.getActiveItem());            
          }
        }
    },
    
    prepareActionSheet:function(actionSheet,activeItem){
      activeItem = activeItem.getId()
//       console.log(activeItem);
      actionSheet.query("button").forEach(function(el){        
        if(el.config[activeItem] == true || el.config["all"] == true) {
          el.show();
        }else{
          el.hide();
        }
      });
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
      var session = getSession();      
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
      
      if(session.team_filter > 0){
        store.filterBy(function(record){          
          if(record.get("home_id") == session.team_filter) return true;
          if(record.get("away_id") == session.team_filter) return true;
          return false;
        });                                
      }
      if(msg != false) {
        window.setTimeout(function(){
          Ext.Viewport.setMasked(false);
        },1000);
      }
    }
});