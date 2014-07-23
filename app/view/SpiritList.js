Ext.define("catcher.view.SpiritList", {
    extend : "Ext.List",
    xtype : "spiritList",

    config : {
        iconCls : "time",
        styleHtmlContent : true,
        id : "spiritList",
        sorters: "time",
        title:"Spirit",
        loadingText: "Získávám zadané spirity",
        itemTpl : "<div>{home_name_full} vs. {away_name_full} ({score_home}:{score_away}) <br /> <small>{time:date('l')}, zadaný spirit: {spirit}</small></div>",
        onItemDisclosure : false,
        emptyText: "Vyber přes menu nahoře vpravo tým, jehož Spirit budeš zadávat.",

        listeners : {
            painted : function() {
                Ext.getCmp("tournament").getTabBar().show();
                if(this.hasLoadedStore) this.deselectAll();
            }
        }
    }
});