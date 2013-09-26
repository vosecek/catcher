Ext.define('catcher.model.Roster', {
    extend : 'catcher.model.Player',
    config : {
        idProperty : 'player_id',
        identifier : {
            type : "sequential"
        }
    },

    fullName : function() {
        var d = this.data;
        names = [ d.nick, "- " + d.name, d.surname, "#" + d.number ];
        return names.join(" ");
    }
});