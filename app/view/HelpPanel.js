Ext.define("catcher.view.HelpPanel",{
	extend: "Ext.Panel",
	xtype: "helpPanel",
	requires: ['Ext.TitleBar'],	
	
	config:{
		title: "Nápověda",
		iconCls: "help",
		styleHtmlContent: true,
    fullscreen: true,
    scrollable: {
      direction: 'vertical',
      directionLock: true
    },
    
		
		items:[
			{
				xtype: "titlebar",
				title: "Nápověda",
				docked: "top"
			}
		],
		
		html: [      
"<strong>Jak skórovat zápas</strong>",
"<ul>",
"<li>Na začátku každého zápasu nejdříve v Nastavení přepnout \"čas běží\"</li>",
"<li>Postupně zapisovat body přes asistující a skórující hráče</li>",
"<li>Tapnutím na skóre je možné vypsat již zadané body daného týmu a lze je upravit či smazat",
"<li>Po konci zápasu v sekci Nastavení vypnout \"čas běží\", je možné zadat kdykoliv později Spirit",
"<li>Není nutné skórovat každý bod, v sekci Skóre a spirit lze natvrdo zadat skóre vyšší, než je zadané. Body se vygenerují jako anonymní a následně lze pokračovat",
"</ul>",
"<strong>Chybějící zápasy</strong>",
"<ul>",
"<li>Zápasy, které nejsou v aplikaci dostupné je nutné vytvořit pomocí ikonky vpravo nahoře. Je vhodné vybrat správné hřiště kvůli přehlednosti, stejně tak začátek dle rozpisu</li>",
"<li>Nesprávně zadané zápasy lze smazat podržením v seznamu zápasů či přejetím (swipe) prstem zprava doleva v seznamu zápasů",
"</ul>",
"<strong>Hráčské soupisky</strong>",
"<ul>",
"<li>Hráče, který není v soupisce v rámci zápasu (při přidání bodu) je možné přidat přes sekci Hráči připojením z Evidence ČALD (ikonka druhá zprava na detailu týmu)</li>",
"<li>Přezdívky a čísla hráčů prosím průběžně aktualizujte v detailu hráče (Hráči - název týmu - jméno hráče), data se použijí i pro další turnaje a průběžně se tak docílí přesné databáze čísel a přezdívek</li>",
"<li>Nového hráče přidat pouze v situaci, kdy hráč není v kompletní evidenci (viz výše), tato situace by neměla nastat</li>",
"</ul>",    
"<strong>Online přístup</strong>",
"<ul>",
"<li>Aplikace musí být při používání online, v případě odpojení hrozí její nestabilita</li>",
"<li>Díky neustálé synchronizaci dat je možné skórovat jeden zápas z více zařízení</li>",
"<li>Výstup z aplikace (průběhy zápasů) jsou k dispozici na www.frisbee.cz/online-vysledky.html</li>",
"</ul>"
].join("")		
	}				
});