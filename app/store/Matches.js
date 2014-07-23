Ext.define('catcher.store.Matches', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.Rest" ],
    config : {
        model : 'catcher.model.Match',
        storeId : 'Matches',
        proxy : {
            type : 'rest',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=matches&',
            appendId: false,
            listeners:{
              exception: function(proxy, response, operation) {
                Ext.Msg.alert("Synchronizace selhala","Požadavek se nepodařilo vyřídit");
                Ext.Viewport.setMasked(false);
              }
            }
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