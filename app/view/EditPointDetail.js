Ext.define("catcher.view.EditPointDetail", {
    extend : "Ext.form.Panel",
    xtype : "editPointDetail",
    requires : [ "Ext.form.FieldSet", "Ext.form.Select", "Ext.field.Hidden" ],        

    config : {
        styleHtmlContent : true,
        title:"Upravit bod",

        items : [ {
            xtype : "fieldset",
            title : "Informace o bodu",
            instructions : "Možno změnit skórující(ho), asistující(ho) či bod smazat.",

            items : [ {
                xtype : "selectfield",
                label : "Skórující",
                name : "scoringPlayer",
                options : []
            }, {
                xtype : "selectfield",
                label : "Asistující",
                name : "assistPlayer",
                options : []
            }, {
                xtype : "hiddenfield",
                name : "pointId",
                value : ""
            } ]
        }, {
            xtype : "button",
            text : "Uložit",
            name : "editConfirm",
            ui : "confirm",
            height : "60px"
        }, {
            xtype : "button",
            text: "Smazat",
            ui : "decline",
            name : "deleteConfirm",
            id : "deletePoint",
            height : "60px",
            style : "margin-top : 20px",
            handler : function() {
                Ext.Msg.confirm("Smazat bod", "Opravdu chcete bod smazat?", function(response) {
                    if (response == "yes")
                        catcher.app.getController("MatchController").deletePoint();
                });
            }
        } ]
    }
});