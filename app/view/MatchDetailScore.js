Ext.define("catcher.view.MatchDetailScore",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailScore",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden","Ext.field.Toggle",],
	
	config:{
    title : "Skóre + spirit",
    iconCls : "check2",
    id: "matchDetailScore",
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "fieldset",
				title: "Výsledné skóre a spirit",
				instructions : "Po skončení utkání přepni Zápas skončil. <br />Spirit ve formátu kolik tým obdržel, ne kolik udělil. <br /> Výsledné skóre lze přepsat, body budou vloženy jako anonymní.",
				
				items:	[
          {
						xtype: "togglefield",
						label: "Zápas skončil",
						name: "finished",
            value: 0
					},
					{
						xtype: "selectfield",
						label: "Skóre domácí",
						name: "score_home",
						options: []
					},
          {
						xtype: "selectfield",
						label: "Skóre hosté",
						name: "score_away",  
						options: []
					},
          {
						xtype: "selectfield",
						label: "Spirit domácí",
						name: "spirit_home",
						options: []
					},
          {
						xtype: "selectfield",
						label: "Spirit hosté",
						name: "spirit_away",
						options: []
					},
					{
						xtype: "hiddenfield",
						name: "match_id",
						value: ""
					}
				]				
			},
			{
				xtype: "button",
        name: "submit",
				text: "Uložit",
				ui: "confirm"
			}			
		],
		listeners: {
							 
		}														
	}				
});