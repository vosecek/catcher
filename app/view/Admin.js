Ext.define("catcher.view.Admin",{
	extend: "Ext.form.Panel",
	xtype: "adminPanel",
	requires:["Ext.field.Checkbox"],
	id: "adminPanel",
	config:{
		styleHtmlContent: true,	
		iconCls: "settings",
		title:"Organizátor",
		items:[
			{
				xtype: "titlebar",
				title: "Nastavení turnaje",
				docked: "top"
			},{
				xtype:"fieldset",
				title:"Základní parametry turnaje",
				instructions:"Zadané informace se projeví na online výsledcích na frisbee.cz",
				items:[
				{
					xtype:"textfield",
					name:"name",
					label:"Název"
				},{
					xtype:"textareafield",
					name:"note",
					label:"Poznámka"
				},
				]
			},{
				xtype:"fieldset",
				title:"Parametry turnaje",
				instructions:"Lze v průběhu turnaje měnit v případě změn",
				items:[
					{
						xtype:"textareafield",
						name:"skupiny",
						label:"Skupiny"
					},{
						xtype:"textareafield",
						name:"fields",
						label:"Hřiště"
					},{
						xtype:"numberfield",
						name:"default_length",
						label:"Zápas [min]"
					}
				]
			},{
				xtype:"fieldset",
				title:"Přepínače turnaje",
				instructions:"<strong>Ukončený</strong>: veřejné zobrazení Spiritu <br /> <strong>Aktivní</strong>: lze se přihlásit v Catcherovi <br /><strong>TOP 10</strong>: zobrazovat TOP 10 hráčů na webu (vhodné pokud se skóruje jmenovitě) <br /><strong>Spirit</strong>: zobrazovat Spirit of the Game na webu (pokud se zadává)",
				items:[
					{
						xtype:"checkboxfield",
						name:"finished",
						label:"Ukončený"
					},{
						xtype:"checkboxfield",
						name:"active",
						label:"Aktivní"
					},{
						xtype:"checkboxfield",
						name:"statistics",
						label:"TOP 10"
					},{
						xtype:"checkboxfield",
						name:"spirit",
						label:"Spirit"
					}
				]
			},{
				xtype:"button",
				ui:"confirm",
				text:"Uložit nastavení",
				iconCls:"check2"
			}
		],
		listeners:{
			painted: function(){
				Ext.Viewport.setMasked({
					xtype:"loadmask",
					message:"Načítám aktuální konfiguraci turnaje"
				});
				Ext.getStore("Tournaments").load(function(response){
					Ext.Viewport.setMasked(false);
		      catcher.app.getController("Admin").fillSettings();
		    });				
			}
		}
	}
});