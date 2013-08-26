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
              if (typeof matchList != 'undefined') {
                Ext.getCmp("matchPlayerList").deselectAll();
              }
            }
        }
    }
});
