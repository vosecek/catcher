Ext.define('catcher.model.Session', {
  extend: 'Ext.data.Model',
  config: {
	  idProperty: 'tournament_id',
	    fields: [
			{name: 'uuid', type: 'string'},
			{name: 'tournament_id', type: 'int'},			
			{name: 'timestamp_logged', type: 'int'},
			{name: 'active_team_node', type: 'string'},
			{name: 'match_reload', type: 'date', dateFormat: "timestamp", defaultValue: 1},
			{name: 'user_id', type: 'int'},
			{name: 'subteams', type: 'auto'},
			{name: 'subteams_count', type: 'int'},
			{name: 'active_subteam', type: 'int'},
			{name: 'team_name_full', type: 'string'},
			{name: 'team_name_short', type: 'string'},
			{name: 'user', type: 'string'},
			{name: 'admin', type: 'int'},
			{name: 'match_id', type: 'int'},
			{name: 'tournament_name', type: 'string'}
	  ]
	}
});