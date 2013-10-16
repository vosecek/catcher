Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.Panel",
    xtype : "matchDetail",            

    config : {
      id : "matchDetail",      
      layout : {
        animation:false
      },
        items:[
          {xtype: "matchDetailCounter"}          
        ]             
    }
});