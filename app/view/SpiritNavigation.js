Ext.define("catcher.view.SpiritNavigation", {
    extend : "Ext.navigation.View",
    xtype : "spiritNavigation",
    id : "spiritNavigation",
    requires : [ "catcher.view.SpiritSheet", "catcher.view.SpiritList"],
    config : {
        title : "Spirit",
        iconCls : "compose",        
        items : [ {
            xtype : 'spiritList'
        } ],
        
        layout : {
          animation:false
        },

        navigationBar : {
            id:"spiritNavigace",
            defaults: {
                iconMask: true
            },
            items : [
              {
                xtype: "button",
                iconCls:"list",
                id:"menuSpirit",
                align:"right",
                handler:function(){                
                  Ext.getCmp("actionSheet").show();
                }
              }
          ]
        },

        listeners:{
          push:function(nav,view){
            Ext.getCmp("matchesNavigation").prepareActionSheet(Ext.getCmp("actionSheet"),nav.getActiveItem(),Ext.getCmp("menuSpirit"));
          },
          pop:function(nav,view){            
            Ext.getCmp("matchesNavigation").prepareActionSheet(Ext.getCmp("actionSheet"),nav.getActiveItem(),Ext.getCmp("menuSpirit"));
            var session = getSession();
            var spiritNavigation = Ext.getCmp("spiritNavigation");              
            if(session.get("team_name_short").length > 0) spiritNavigation.setTitle("Spirit "+session.get("team_name_short"));
            if(session.get("team_name_full").length > 0) spiritNavigation.getNavigationBar().setTitle("Spirit "+session.get("team_name_full"));            
          },
          painted: function(){
            Ext.getCmp("matchesNavigation").prepareActionSheet(Ext.getCmp("actionSheet"),this.getActiveItem(),Ext.getCmp("menuSpirit"));
            var session = getSession();
            var subteams = session.get("subteams");
            var pocet_tymu = session.get("subteams_count");
            if(pocet_tymu == 1){
              // zobrazujeme zápasy jediného týmu
              for (var key in subteams) if (subteams.hasOwnProperty(key)) break;
              session.set("active_subteam",key);
              catcher.app.getController("Spirit").prepareList();
            }else if(session.get("active_subteam") != null){
              // víc týmů, ale už je nějaký zvolený
              catcher.app.getController("Spirit").prepareList();
            }else{
              // víc týmů, musí se volit co zobrazit
              catcher.app.getController("Spirit").prepareList();
              catcher.app.getController("Spirit").selectSpirit(subteams);
            }
            var spiritNavigation = Ext.getCmp("spiritNavigation");
            if(session.get("team_name_short").length > 0) spiritNavigation.setTitle("Spirit "+session.get("team_name_short"));
            if(session.get("team_name_full").length > 0) spiritNavigation.getNavigationBar().setTitle("Spirit "+session.get("team_name_full"));            
          }
        }
    }
});