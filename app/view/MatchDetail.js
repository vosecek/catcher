Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.Panel",
    xtype : "matchDetail",            

    config : {
      id : "matchDetail",
      styleHtmlContent : true,
      layout : {
        animation:false
      },
        items:[
          {xtype: "matchDetailCounter"}          
        ]             
    }
});