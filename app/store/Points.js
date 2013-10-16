Ext.define('catcher.store.Points', {
    extend : 'Ext.data.Store',
    requires : [ "Ext.data.proxy.Rest" ],
    config : {
        model : 'catcher.model.Point',
        storeId : 'Points',
        proxy : {
            type : 'rest',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=points',
            appendId: false
//             listeners:{
//               exception: function(proxy, response, operation) {
//                 Ext.Msg.alert("Synchronizace selhala","Zařízení není online, nebo je nedostupný server. <br /> Pro bezpečný zápis dalších bodů je vhodné aplikaci ukončit a znovu spustit, až bude internet dostupný.");
//                 Ext.Viewport.setMasked(false);
//               }
//           }
        },
        autoLoad : false              
    }
});