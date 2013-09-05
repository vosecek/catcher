Ext.define("catcher.view.MatchPlayerList", {
    extend : "Ext.List",
    xtype : "matchPlayerList",
    requires : [ "Ext.Label" ],

    config : {
        scrollVertical : true,
        disableSelection: false,
        store : "Players",
        itemTpl : "<strong>{nick} #{number}</strong> <small>({surname} {name})</small>",
        onItemDisclosure : false,
        styleHtmlContent: true,
        listeners : {
            activate : function() {
                this.getStore().sort();
            },
            painted : function(){              
              this.deselectAll();
              var session = getSession();
              var list = this;
              // skórující hráè si nemùže nahrát sám sobì              
              if(this.getId() == "MatchPlayerListAssist"){
                if(session.score_player_id>0){          
                  var skorujici = Ext.getStore("MatchPlayerListAssist").find("player_id",session.score_player_id,false,false,false,true);                            
                  list.getItemAt(skorujici).hide();          
                }
              }                             
            },
            deactivate : function(){
              var session = getSession();
              var skorujici = Ext.getStore("MatchPlayerListAssist").find("player_id",session.score_player_id,false,false,false,true);
              if(this.getId() == "MatchPlayerListAssist") this.getItemAt(skorujici).hide();
            }
        }
    }
});
