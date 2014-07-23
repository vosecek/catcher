Ext.define('catcher.model.Tournament', {
  extend: 'Ext.data.Model',
  config: {
	  idProperty: 'tournament_id',
	    fields: [
	      {name: 'tournament_id', type: 'int'},
	      {name: 'name', type: 'string'},
	      {name: 'note', type: 'string'},
        {name: 'fields', type: 'string'},
        {name: 'time', type : 'date', dateFormat : "timestamp"},
        {name: 'default_length', type : 'int'},
        {name: 'skupiny', type : 'string'},
        {name: 'spirit', type: 'boolean'},
				{name: 'statistics', type: 'boolean'},
				{name: 'active', type: 'boolean'},
				{name: 'finished', type: 'boolean'}
	  ]
	}
});