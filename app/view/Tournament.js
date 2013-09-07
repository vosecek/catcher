Ext.define("catcher.view.Tournament", {
    extend : "Ext.tab.Panel",
    xtype : "tournamentPanel",
    requires : [ "Ext.device.Device", "Ext.data.Model", "Ext.data.Store" ],
  
    config : {
      tabBarPosition : "bottom",
      tabBar:{
        defaults:{
          iconMask: true
        },
        
      },
      id : "tournament",
      layout : {
        animation:false
      },
      items : [
        {xtype : "matchesNavigation"},
        {xtype : "teamList"},
        {xtype : "helpPanel"}
      ],
      listeners:{
        initialize: function(){
//           ,{
//             xtype:"button",
//             id:"help",
//             iconCls:"help",
//             left: "1%",        
//             height: "50%",
//             margin: "10 0 0 0",
//             handler:function(){                
//               var helpPanel = Ext.getCmp("helpPanel") || new catcher.view.HelpPanel();
//               
//               if(!helpPanel.getParent()){
//                 Ext.Viewport.add(helpPanel);
//               }
// 
//                               
//               helpPanel.show();                                                          
//             }
//           }
//           );
        }
      }
    }
});