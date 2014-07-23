Ext.define('catcher.store.Tournaments', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.Rest"],
    config : {
        model : 'catcher.model.Tournament',
        storeId : 'Tournaments',
        proxy : {
            type : 'rest',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=tournaments',
            appendId: false,
            listeners:{
              exception: function(proxy, response, operation) {
                Ext.Msg.alert("Synchronizace selhala","Požadavek se nepodařilo vyřídit");
                Ext.Viewport.setMasked(false);
                }
            }
        },
        autoLoad : true
    }
});