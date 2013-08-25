Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.tab.Panel",
    xtype : "matchDetail",            

    config : {
      id : "matchDetail",
      styleHtmlContent : true,
      tabBarPosition : "bottom",
        items:[
          {xtype: "matchDetailCounter"},
          {xtype: "matchDetailSettings"},
          {xtype: "matchDetailScore"}
        ]      
    }
});