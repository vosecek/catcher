Ext.define('catcher.model.Team', {
    // extend: 'catcher.model.Player',
    extend : 'Ext.data.Model',
    config : {
        idProperty : 'team_id',
        fields : [ {
            name : 'team_id',
            type : 'int'
        }, {
            name : 'master_id',
            type : 'int'
        }, {
            name : 'name_short',
            type : 'string'
        }, {
            name : 'name_full',
            type : 'string'
        } ]
    }
});