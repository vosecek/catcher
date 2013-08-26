Ext.define('catcher.model.Point', {
    extend : 'Ext.data.Model',    
    config : {
        idProperty : 'point_id',
        identifier : {
          type: "uuid"
        },
        fields : [ {
            name : 'point_id',
            type : 'int'
        }, {
            name : 'team_id',
            type : 'int'
        }, {
            name : 'player_id',
            type : 'int'
        }, {
            name : 'assist_player_id',
            type : 'int'
        }, {
            name : 'match_id',
            type : 'int'
        }, {
        }, {
            name : 'score_home',
            type : 'int'
        }, {
        }, {
            name : 'score_away',
            type : 'int'
        }, {
            name : 'time',
            type : 'date',
            dateFormat : "timestamp"
        } ]
    }
});