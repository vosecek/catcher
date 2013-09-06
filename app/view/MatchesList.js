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
        itemTpl : "<div style=\"{[values.finished==1?\"font-style:italic; font-size:smaller;\":\"\"]}\">{home_name_full} vs. {away_name_full} ({score_home}:{score_away}) <br /> <small>{time:date('G:i, j.n')}</small></div>",
        onItemDisclosure : false,
        listeners : {
            painted : function() {
//             force reload asi není zcela nutný, zbytečné prodlužování práce              
                var store = this.getStore();
//                 store.getProxy().setExtraParams({});
                store.clearFilter();
//                 store.load(function(){
//                   var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);                
//                   store.filter("tournament_id", session.get("tournament_id")*1);
//                 });
                // při zobrazení seznamu zápasů zobraz dle nastaveného filtru
                Ext.getCmp("matchesNavigation").query("button[navigation_only=true]").forEach(function(el) {el.show()});              
                Ext.getCmp("tournament").getTabBar().show();
                Ext.getCmp("matchesList").deselectAll();
            }
        }
    }
});