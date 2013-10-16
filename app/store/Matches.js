Ext.define('catcher.store.Matches', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.Rest" ],
    config : {
        model : 'catcher.model.Match',
        storeId : 'Matches',
        proxy : {
            type : 'rest',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=matches&',
            appendId: false
        },
        sorters : {
            property : "time",
            direction : "ASC"
        },
        grouper: {
          groupFn:function(record){
            return "Hřiště "+record.get("field");
          }
        },        
        autoLoad : false,
        
        listeners : {
          load:function(){
            var session = getSession();
            var time = new Date();
            session.set("match_reload",time);
          }
        }
        
    }
});