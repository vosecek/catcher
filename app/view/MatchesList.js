Ext.define("catcher.view.MatchesList", {
    extend : "Ext.List",
    xtype : "matchesList",    

    config : {
        title : "Zápasy",
        iconCls : "time",
        styleHtmlContent : true,
        id : "matchesList",      

        store : "Matches",
        sorters: "time",
        grouped: true,        
        loadingText: "Aktualizuji data z www.frisbee.cz",
        itemTpl : "{home_name_full} vs. {away_name_full} ({score_home}:{score_away}) <br /> <small>{time:date('G:i, j.n')}</small>",
        onItemDisclosure : false,
        listeners : {
            painted : function() {              
                var store = Ext.getStore("Matches");
                store.getProxy().setExtraParams({});
                store.clearFilter();
                store.load(function(){
                  var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);                
                  store.filter("tournament_id", session.get("tournament_id")*1);
                });
                // při zobrazení seznamu zápasů zobraz dle nastaveného filtru
                Ext.getCmp("matchesNavigation").query("button[navigation_only=true]").forEach(function(el) {el.show()});
                Ext.getCmp("matchesNavigation").query("button[filtr=true]").forEach(function(el){
                    if(el.getUi() == "decline") el.up("navigationview").showInfo(el.name,false);                    
                  }
                );                
                Ext.getCmp("tournament").getTabBar().show();
                Ext.getCmp("matchesList").deselectAll();
            }
        }
    }
});