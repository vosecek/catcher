Ext.define("catcher.view.MatchDetailScore",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailScore",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden","Ext.field.Toggle"],
	
	config:{
    modal: true,
    hideOnMaskTap: false,
//     styleHtmlContent: true,
    centered: true,
    width: "95%",
    height:"95%",
    maxHeight:"550px",
    maxWidth:"550px",
    
    title : "Skóre + spirit",
    id: "matchDetailScore",
		
		items:[
			{
				xtype: "fieldset",
				instructions : "Po konci času přepni Zápas skončil. <br />Spirit ve formátu kolik tým obdržel, ne kolik udělil. <br /> Výsledné skóre lze přepsat, body budou vloženy jako anonymní.",
				
				items:	[
          {
						xtype: "togglefield",
						label: "Zápas skončil",
						name: "finished",
            labelWidth:"45%",
            ui: "decline",
            value: 0
					},
					{
						xtype: "selectfield",
						label: "Skóre domácí",
						name: "score_home",
            labelWidth:"45%",
						options: []
					},
          {
						xtype: "selectfield",
						label: "Skóre hosté",
						name: "score_away",
            labelWidth:"45%",  
						options: []
					},
          {
						xtype: "selectfield",
						label: "Spirit domácí",
						name: "spirit_home",
            labelWidth:"45%",
						options: []
					},
          {
						xtype: "selectfield",
						label: "Spirit hosté",
						name: "spirit_away",
            labelWidth:"45%",
						options: []
					},
					{
						xtype: "hiddenfield",
						name: "match_id",
						value: ""
					}
				]				
			},{
        docked: 'top',
        xtype: 'toolbar',
        title: 'Výsledek zápasu'
      },{
        docked: 'bottom',
        ui: 'light',
        xtype: 'toolbar',
        items: [
          {
            ui: "decline",
            text: 'Zavřít',
            handler: function() {
                Ext.getCmp('matchDetailScore').hide();
            }
          },{
            xtype: 'spacer'
          },{
            text: 'Uložit',
            ui: 'confirm',
            handler: function() {
              catcher.app.getController("MatchController").updateMatchScore();
              Ext.getCmp('matchDetailScore').hide();
            }
          }
        ]
      }			
		]														
	}				
});