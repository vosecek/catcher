Ext.define('catcher.store.Tournaments', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.JsonP" ],
    config : {
        model : 'catcher.model.Tournament',
        storeId : 'Tournaments',
        proxy : {
            type : 'jsonp',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=tournaments'
        },
        autoLoad : true
    }
});