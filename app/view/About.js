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
			"<h2>Build Spirit for Org 1.2.2</h2> <p>Pokročilá verze aplikace pro skórování zápasů ultimate frisbee s multiuživatelským přístupem a zadáváním Spiritu + možnost správy parametrů turnaje a jeho ukončení (spustí veřejné zobrazení Spiritu na frisbee.cz).</p><p>Problémy a otázky: Kačer TM, Ondra TM</p> <p>Nápady a podněty tamtéž </p><p>Online výstup z aplikace: www.frisbee.cz/online-vysledky.html</p>"
		].join("")		
	}				
});