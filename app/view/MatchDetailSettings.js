Ext.define("catcher.view.MatchDetailSettings",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailSettings",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden","Ext.field.DatePicker","Ext.field.Number","Ext.ux.DateTimePicker","Ext.ux.field.DateTimePicker"],
	
	config:{
    modal: true,
    hideOnMaskTap: false,
//     styleHtmlContent: true,
    centered: true,
    width: "95%",
    height:"95%",
    maxHeight:"550px",
    maxWidth:"550px",
    
    title : "Nastavení",
    id: "matchDetailSettings",    
		
		items:[
			{
				xtype: "fieldset",
				instructions : "V případě změny oproti rozpisu je vhodné upravit tato data, standardně není třeba.",
				
				items:	[          
					{
						xtype: "selectfield",
						label: "Hřiště",
						name: "field",
            labelWidth: "45%",
						options: []
					},
          {
						xtype: "selectfield",
						label: "Typ zápasu",
						name: "skupina",
            labelWidth: "45%", 
						options: []
					},
          {
						xtype: "selectfield",
						label: "Délka utkání [min]",
            labelWidth: "45%",
						name: "length",
            options:[]
					},          
          {
						xtype: "datetimepickerfield",
            dateTimeFormat: "j.n.Y H:i",
						label: "Začátek dle rozpisu",
						name: "time",
            labelWidth: "45%",
						value: ""
					},
					{
						xtype: "hiddenfield",
						name: "match_id",
						value: ""
					}
				]				
			},
      {
        docked: 'top',
        xtype: 'toolbar',
        title: 'Parametry utkání'
      },{
        docked: 'bottom',
        ui: 'light',
        xtype: 'toolbar',
        items: [
          {
            ui: "decline",
            text: 'Zavřít',
            handler: function() {
                Ext.getCmp('matchDetailSettings').hide();
            }
          },{
            xtype: 'spacer'
          },{
            text: 'Uložit',
            ui: 'confirm',
            handler: function() {
              catcher.app.getController("MatchController").updateMatchSettings();
              Ext.getCmp('matchDetailSettings').hide();
            }
          }
        ]
      }			
		],
		listeners: {
		}														
	}				
});