Ext.define('catcher.store.Rosters', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.Rest" ],
    config : {
        model : 'catcher.model.Roster',
        storeId : 'Rosters',        
        proxy : {
            type : 'rest',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=rosters&',
            appendId: false
        },
        sorters: 'nick',
        autoLoad : false
    }
});