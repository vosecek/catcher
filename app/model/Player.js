Ext.define('catcher.model.Player', {
    extend : 'Ext.data.Model',
    config : {
        idProperty : 'player_id',
        identifier : {
          type: "sequential"
        },
        fields : [ {
            name : 'player_id',
            type : 'int'
        }, {
            name : 'name',
            type : 'string'
        }, {
            name : 'surname',
            type : 'string'
        }, {
        }, {
            name : 'nick',
            type : 'string'
        }, {
            name : 'team',
            type : 'int'
        }, {
            name : 'number',
            type : 'int'
        } ]
    },

    fullName : function() {
        var d = this.data;
        names = [d.nick, "- " + d.name, d.surname, "#" + d.number ];
        return names.join(" ");
    }
});