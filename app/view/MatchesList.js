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
                var session = getSession();
                var time = new Date();                                
                if(session.get("match_reload").getTime() > 1000 && (session.get("match_reload").getTime()+600000 < time.getTime())){
                  var store = this.getStore();
                  Ext.Viewport.setMasked({xtype:"loadmask",message:"Aktualizuji zápasy"});
                  store.load(function(){
                    Ext.Viewport.setMasked(false);
                    store.each(function(record){                      
                      if(record.get("finished") == false){
                        var length = record.get("length")*60*1000;
                        var cap = 1200000;
                        if(record.get("time").getTime()+length+cap < new Date().getTime()){
                          Ext.Msg.confirm("Neukončený zápas","Zápas "+record.get("home_name_short")+" vs. "+record.get("away_name_short")+" není ukončený a zřejmě již skončil. Klikem na Yes přejdeš do detailu zápasu a po zkontrolování výsledného skóre jej ukončíš.",function(response){
                            if(response == "yes"){
                              catcher.app.getController("MatchController").showMatchDetail(false,false,false,record,true);
                            }
                          });
                        }
                      }
                    });
                  });
                }
                session.set("match_reload",time); 
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