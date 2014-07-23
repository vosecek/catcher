Ext.define("catcher.view.Tournament", {
    extend : "Ext.tab.Panel",
    xtype : "tournamentPanel",
    requires : [ "Ext.device.Device", "Ext.data.Model", "Ext.data.Store","Ext.device.Notification","Ext.device.Connection","Ext.plugin.PullRefresh"],
  
    config : {
      tabBarPosition : "bottom",
      tabBar:{
        defaults:{
          iconMask: true
        }        
      },
      id : "tournament",
      layout : {
        animation:false
      },
      items : [
        {xtype : "matchesNavigation"},
        {xtype : "teamList"}
      ],
      listeners:{
        initialize:function(){
          var session = getSession();
          if(session.get("subteams_count") > 0){
            Ext.getCmp("tournament").add({xtype:"spiritNavigation"});
          }

          if(session.get("admin") == 3) Ext.getCmp("tournament").add({xtype:"adminPanel"});

          Ext.getCmp("tournament").add({xtype:"helpPanel"});
        }
      }
    }
});