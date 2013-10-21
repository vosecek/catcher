Ext.define("catcher.view.MatchesList", {
    extend : "Ext.List",
    xtype : "matchesList",    

    config : {
        title : "Zápasy",
        iconCls : "time",
        styleHtmlContent : true,
        id : "matchesList",
        
        plugins: [{
            xclass: 'Ext.plugin.PullRefresh',
            pullRefreshText: 'Táhni pro aktualizaci zápasů.',
            releaseRefreshText: 'Pusť pro aktualizaci zápasů.'
        }],

        store : "Matches",
        sorters: "time",
        grouped: true,        
        loadingText: "Aktualizuji data z www.frisbee.cz",
        itemTpl : "<div style=\"{[values.finished==1?\"font-style:italic; font-size:smaller;\":\"\"]}\">{home_name_full} vs. {away_name_full} ({score_home}:{score_away}) <br /> <small>{time:date('G:i, j.n')}</small></div>",
        onItemDisclosure : false,
        listeners : {
            painted : function() {
                var session = getSession();
                var time = new Date();                                
                if(session.get("match_reload").getTime()+(300*1000) < time.getTime()){
                  var store = this.getStore();
                  if(session.get("match_reload").getTime() == 1000) {
                    catcher.app.getController("MatchController").checkUnfinishedMatches(store);
                  }else{                  
                    Ext.Viewport.setMasked({xtype:"loadmask",message:"Aktualizuji zápasy"});
                    store.load(function(){
                      Ext.Viewport.setMasked(false);
                      catcher.app.getController("MatchController").checkUnfinishedMatches(store);
                    });
                  }
                  session.set("match_reload",time);
                }                 
                Ext.getCmp("matchesNavigation").query("button[navigation_only=true]").forEach(function(el) {el.show()});              
                Ext.getCmp("tournament").getTabBar().show();
                Ext.getCmp("matchesList").deselectAll();
                if(Ext.device.Connection.isOnline() == false){
                  Ext.Msg.alert("Offline","Zřejmě nejsi připojen k internetu, aplikace nebude fungovat správně.");
                }
            }
        }
    }
});