Ext.define("catcher.view.MatchPlayerList", {
    extend : "Ext.List",
    xtype : "matchPlayerList",
    requires : [ "Ext.Label" ],

    config : {
        scrollVertical : true,
        disableSelection: false,
        store : "Players",
        itemTpl : "<div style=\"{[values.player_id==2147483647?\"font-style:italic; font-size:smaller;\":\"\"]} {[values.player_id==0?\"font-style:italic; font-size:smaller;\":\"\"]}\"><strong>{nick} #{number}</strong> <small>({surname} {name})</small></div>",        
        onItemDisclosure : false,
        styleHtmlContent: true,        
        listeners : {
            activate : function() {
                this.getStore().sort();
            },
            painted : function(){
              var message = "";
              if(this.getId() == "MatchPlayerListScore") message = "Vyber skórujícího hráče";
              if(this.getId() == "MatchPlayerListAssist") message = "Vyber nahrávajícího hráče";
              Ext.Viewport.setMasked({
                xtype: "loadmask",
                indicator: false,
                message: message
              });              
              this.deselectAll();
              var session = getSession();
              var list = this;
              // skórující hráč si nemůže nahrát sám sobě              
              if(this.getId() == "MatchPlayerListScore"){
                if(session.assist_player_id>0 && session.assist_player_id<2147483647){          
                  var asistujici = Ext.getStore("MatchPlayerListScore").find("player_id",session.assist_player_id,false,false,false,true);                            
                  list.getItemAt(asistujici).hide();          
                }
              }
              window.setTimeout(function(){
                Ext.Viewport.setMasked(false);
              },1000);                             
            },
            deactivate : function(){
              var session = getSession();
              var asistujici = Ext.getStore("MatchPlayerListAssist").find("player_id",session.assist_player_id,false,false,false,true);
              if(this.getId() == "MatchPlayerListScore") this.getItemAt(asistujici).hide();
            }
        }
    }
});
