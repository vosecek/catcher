Ext.define('catcher.store.Teams', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.JsonP" ],
    config : {
        model : 'catcher.model.Team',
        storeId : 'Teams',
        proxy : {
            type : 'jsonp',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=teams'
        },
        sorters : "name_short",
        grouper : function(record) {
            return record.get("name_short")[0];
        },
        autoLoad : false
    }
});