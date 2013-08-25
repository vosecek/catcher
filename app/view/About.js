Ext.define("catcher.view.About",{
	extend: "Ext.Panel",
	xtype: "aboutPanel",
	requires: ['Ext.TitleBar'],	
	
	config:{
		title: "O aplikaci",
		iconCls: "info",
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "titlebar",
				title: "O aplikaci",
				docked: "top"
			}
		],
		
		html: [
			"<h2>Mix kvalifikace build 0.9</h2> <p>Beta verze aplikace, určeno pro testování skórování všech zápasů</p><p>Problémy a otázky: Kačer TM, Ondra TM</p> <p>Nápady a podněty tamtéž </p>"
		].join("")		
	}				
});