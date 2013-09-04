Ext.define('catcher.model.Match', {
  extend: 'Ext.data.Model',
  config: {
	  idProperty : 'match_id',
      identifier : {
        type: "sequential"
      },
	    fields: [
	    	{name: 'match_id', type: 'int'},
	    	{name: 'tournament_id', type: 'int'},
	      {name: 'home_id', type: 'int'},
	      {name: 'away_id', type: 'int'},
	      {name: 'home_name_short', type: 'string'},
	      {name: 'away_name_short', type: 'string'},
	      {name: 'home_name_full', type: 'string'},
	      {name: 'away_name_full', type: 'string'},
	      {name: 'score_home', type: 'int'},
	      {name: 'score_away', type: 'int'},
	      {name: 'spirit_home', type: 'int'},
	      {name: 'spirit_away', type: 'int'},
	      {name: 'field', type: 'int'},
	      {name: 'time', type: 'date', dateFormat: "timestamp", defaultValue: 1},
        {name: 'time_end', type: 'date', dateFormat: "timestamp", defaultValue: 1},
//         {name: 'time_start', type: 'date', dateFormat: "timestamp", defaultValue: 1},
        {name: 'length', type: 'int'},
        {name: 'in_play', type: 'boolean'},
        {name: 'finished', type: 'boolean'}
	  ]
	}
});