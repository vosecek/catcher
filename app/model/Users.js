Ext.define('catcher.model.Users', {
	extend : 'Ext.data.Model',
	config: {
		idProperty : 'id',
		identifier : {
        	type: "uuid"
        },
	    fields: [
	    	{name: 'id', type: 'int'},
			{name: 'user', type: 'string'}
	  	],
	  	proxy: {
	        type: 'localstorage',
	        id  : 'id'
	    }
	}
});