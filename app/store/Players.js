Ext.define('catcher.store.Players', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.Rest" ],
    config : {
        model : 'catcher.model.Player',
        storeId : 'Players',
        proxy : {
            type : 'rest',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=players&',
            appendId : false
        },
        sorters : 'nick',
        autoLoad : false
    }
});