Ext.define('catcher.store.Players', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.Rest"],
    config : {
        model : 'catcher.model.Player',
        storeId : 'Players',
        proxy : {
            type : 'rest',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=players&',
            appendId: false,
            listeners:{
              exception: function(proxy, response, operation) {
                Ext.Msg.alert("Synchronizace selhala","Požadavek se nepodařilo vyřídit");
                Ext.Viewport.setMasked(false);
                }
            }
        },
        sorters: 'nick',
        autoLoad : false
    }
});