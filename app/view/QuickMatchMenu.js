Ext.define("catcher.view.QuickMatchMenu",{
	extend: "Ext.ActionSheet",
	xtype: "quickMatchMenu",
	id: "quickMatchMenu",				
	requires: ["Ext.Button"],
  
  config: {
    defaults: {
      iconMask: true
    },
    showAnimation:false,                   
    hideAnimation:false,
    items: [
        {
            xtype: 'titlebar',
            title: 'Rychlé menu',
            ui: 'dark',
            margin: "0em 0em 1em 0em"
        },
        {
            text: 'Smazat zápas',
            ui: "decline",
            iconCls:"trash",
            matchDetail: true,
            handler:function(){
              var session = getSession();                            
              var match = Ext.getStore("Matches").findRecord("match_id",session.match_id,false,false,false,true);
              catcher.app.getController("MatchController").confirmMatchDelete(match);                                          
              this.up("quickMatchMenu").hide();
            }
        },                      
        {
            text: 'Parametry zápasu',
            iconCls:"settings",
            matchDetail: true,
            handler:function(){
              var matchDetailSettings = Ext.getCmp("matchDetailSettings") || new catcher.view.MatchDetailSettings();                
              if(!matchDetailSettings.getParent()) Ext.Viewport.add(matchDetailSettings);
              matchDetailSettings.show();
              
              var session = getSession();                            
              var match = Ext.getStore("Matches").findRecord("match_id",session.match_id,false,false,false,true);              
              
              catcher.app.getController("MatchController").fillMatchDetailSettings(match);
              
              this.up("quickMatchMenu").hide();
            }
        },
        {
            text: 'Konec zápasu - čas, skóre a spirit',
            iconCls:"check2",
            matchDetail: true,
            handler:function(){
              var matchDetailScore = Ext.getCmp("matchDetailScore") || new catcher.view.MatchDetailScore();                
              if(!matchDetailScore.getParent()) Ext.Viewport.add(matchDetailScore);
              matchDetailScore.show();
              
              var session = getSession();                            
              var match = Ext.getStore("Matches").findRecord("match_id",session.match_id,false,false,false,true);
              
              catcher.app.getController("MatchController").fillMatchDetailScore(match);
              
              this.up("quickMatchMenu").hide();
            }
        },
        {
            text: 'Zavřít menu',
            ui:"action",
            iconCls: "close",
            margin: "1em 0em 0.5em 0em",
            all: true,
            handler:function(){
              this.up("quickMatchMenu").hide();
            }
        }
        ]                               
    }  
});