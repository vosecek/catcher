Ext.define("catcher.view.AddPointDetail", {
    extend : "Ext.Panel",
    xtype : "addPointDetail",

    config : {
        title : "Add Point",
        layout : "vbox",
        styleHtmlContent : true,

        items : [ {
            xtype : "fieldset",
            title : "Přidat bod",
            instructions : "Zadej nahrávající(ho)",

            items : [ {
                xtype : "selectfield",
                label : "Nahrávající",
                name : "assistPlayer",
                options : []
            } ]
        }, {
            xtype : "button",
            text : "Uložit",
            ui : "confirm",
            height : "60px"
        } ]
    }
});