Ext.define("catcher.view.PlayersDetail",{
	extend: "Ext.form.Panel",
	xtype: "playersDetail",
	id: "playersDetail",				
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden","Ext.field.Number"],
	
	config:{
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "fieldset",
				title: "Informace o hráči",
				instructions: "Změna je platná i pro jiné turnaje! Změň dle potřeby číslo hráče a přezdívku, nic jiného se měnit běžně nemusí.",
				
				items:	[
					{
						xtype: "selectfield",
						label: "Číslo hráče",
						name: "number",
						options:[]
					},
          {
						xtype: "textfield",
						label: "Přezdívka",
						name: "nick",
						value: ""
					},
					{
						xtype: "textfield",
						label: "Jméno",
						name: "name",
						value: ""
					},
					{
						xtype: "textfield",
						label: "Příjmení",
						name: "surname",
						value: ""
					},
					{
						xtype: "hiddenfield",
						name: "player_id",
						value: ""
					}
				]				
			},
			{
				xtype: "button",
				text: "Uložit",
				ui: "confirm",
				iconCls:"check2"
			}			
		],
		listeners: {
	 	// 	activate: function(){
	 	// 		Ext.getCmp("deletePlayer").show();
			// },
			// deactivate: function(){			
			//  	Ext.getCmp("deletePlayer").hide();
			// }							 
		}														
	}				
});