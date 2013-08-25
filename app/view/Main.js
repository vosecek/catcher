var main = Ext.define('catcher.view.Main', {
	extend : 'Ext.tab.Panel',
	xtype : 'main',
	config : {
		tabBarPosition : 'bottom',

		items : [ {
			xtype : 'loginPanel'
		}, {
			xtype : "aboutPanel"
		} ]
	}
});
