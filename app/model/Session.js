Ext.define('catcher.model.Session', {
  extend: 'Ext.data.Model',
  config: {
	  idProperty: 'tournament_id',
	    fields: [
	    	{name: 'uuid', type: 'string'},
	      {name: 'tournament_id', type: 'int'},
	      {name: 'tournament_name', type: 'string'},
	      {name: 'timestamp_logged', type: 'int'},
	      {name: 'active_team_node', type: 'string'}
	  ]
	}
});