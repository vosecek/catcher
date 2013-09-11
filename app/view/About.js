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
			"<h2>Build MČR mix verze 1.0</h2> <p>Ostrá verze aplikace, určeno pro skórování všech zápasů</p><p>Problémy a otázky: Kačer TM, Ondra TM</p> <p>Nápady a podněty tamtéž </p><p>Online výstup z aplikace: www.frisbee.cz/online-vysledky.html</p>"
		].join("")		
	}				
});