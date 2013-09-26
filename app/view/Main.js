var main = Ext.define('catcher.view.Main', {
    extend : 'Ext.tab.Panel',
    xtype : 'main',
    config : {
        tabBarPosition : 'bottom',

        layout : {
            animation : false
        },

        items : [ {
            xtype : 'loginPanel'
        }, {
            xtype : "aboutPanel"
        } ]
    }
});
