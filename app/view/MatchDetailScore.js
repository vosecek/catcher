Ext.define("catcher.view.MatchDetailScore",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailScore",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden"],
	
	config:{
    title : "Skóre + spirit",
    iconCls : "check2",
    id: "matchDetailScore",
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "fieldset",
				title: "Výsledné skóre a spirit",
				instructions : "Spirit ve formátu kolik tým obdržel, ne kolik udělil. <br /> Výsledné skóre lze přepsat, body budou vloženy jako anonymní.",
				
				items:	[
					{
						xtype: "numberfield",
						label: "Skóre domácí",
						name: "score_home",
						value: 0
					},
          {
						xtype: "numberfield",
						label: "Skóre hosté",
						name: "score_away",
						value: 0
					},
          {
						xtype: "numberfield",
						label: "Spirit domácí",
						name: "spirit_home",
						value: 0
					},
          {
						xtype: "numberfield",
						label: "Spirit hosté",
						name: "spirit_away",
						value: 0
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