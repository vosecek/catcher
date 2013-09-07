Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.Panel",
    xtype : "matchDetail",            

    config : {
      id : "matchDetail",
      styleHtmlContent : true,
      layout : {
        animation:false
      },
//       tabBarPosition : "bottom",
        items:[
          {xtype: "matchDetailCounter"}          
        ],
       listeners:{
        initialize:function(){
//           this.add({xtype:"matchDetailSettings"});
//           this.add({xtype:"matchDetailScore"});
        }
       }             
    }
});