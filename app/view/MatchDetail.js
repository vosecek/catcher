Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.tab.Panel",
    xtype : "matchDetail",            

    config : {
      id : "matchDetail",
      styleHtmlContent : true,
      tabBarPosition : "bottom",
        items:[
          {xtype: "matchDetailCounter"}          
        ],
       listeners:{
        initialize:function(){
          this.add({xtype:"matchDetailSettings"});
          this.add({xtype:"matchDetailScore"});
        }
       }             
    }
});