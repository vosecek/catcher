Ext.define('catcher.store.Session', {
    extend : 'Ext.data.Store',
    config : {
        model : 'catcher.model.Session',
        storeId : 'Session',
        autoLoad : true
    }
});