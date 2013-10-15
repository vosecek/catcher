Ext.define('catcher.store.SearchBox', {
    extend : 'catcher.store.Players',
    config : {
        model : 'catcher.model.Player',
        storeId : 'SearchBox',
        proxy : {
          type : 'rest',
          url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=searchBox',
          appendId: false
        }
    }
});