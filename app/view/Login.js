Ext.define("catcher.view.Login", {
    extend : "Ext.form.Panel",
    xtype : "loginPanel",
    requires : [ "Ext.form.FieldSet", "Ext.form.Select", "Ext.form.Password", "Ext.Object", "Ext.Array", "Ext.device.Device", "Ext.data.Model", "Ext.data.Store" ],

    config : {
        title : "Přihlášení",
        iconCls : "home",

        items : [ {
            xtype : "fieldset",
            title : "Přihlášení k turnaji",
            instructions : "Vyberte jeden z aktuálních turnajů, zatím free access",
            items : [ {
                xtype : "selectfield",
                displayField : "text",
                name : "tournament",
                id : "turnaj",
                label : "Turnaj:",
                placeHolder : "Vyberte turnaj",
                options : []
            }, {
                xtype : "passwordfield",
                name : "password",
                label : "Heslo"
            } ]
        }, {
            xtype : "button",
            text : "Přihlásit",
            ui : "confirm"
        } ]
    },

    // vložení možností do Selectu
    initialize : function() {
        var options = new Array();
        var store = Ext.getStore("Tournaments").load(function(records) {
            store.each(function(radek) {
                options.push({
                    text : radek.get("tournament_name"),
                    value : radek.get("tournament_id")
                });
            });
            Ext.getCmp("turnaj").setOptions(options);
        });
    }
});