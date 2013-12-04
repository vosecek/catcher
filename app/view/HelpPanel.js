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
"<li>Postupně zapisovat body přes asistující a skórující hráče</li>",
"<li>Lze přidat anonymní bod, pokud není jisté, kdo se účastnil bodu, ze statistických důvodů je ale lepší dávat pozor na hru a psát to reálně :-)</li>",
"<li>Již vložené body lze smazat či upravit přes tlačítko Zobrazit zapsané body.",
"<li>Po konci zápasu v sekci Nastavení přepnout \"Zápas skončil\", je možné zadat kdykoliv později Spirit",
"<li>Není nutné skórovat každý bod, v sekci Skóre a spirit lze natvrdo zadat skóre vyšší, než je zadané. Body se vygenerují jako anonymní a následně lze pokračovat",
"<li>Možnost rychlého přístup k nastavení a celkovému skóre utkání pomocí podržení prstu na seznamu zápasů</li>",
"</ul>",
"<strong>Chybějící zápasy</strong>",
"<ul>",
"<li>Zápasy, které nejsou v aplikaci dostupné je nutné vytvořit pomocí ikonky vpravo nahoře. Je vhodné vybrat správné hřiště kvůli přehlednosti, stejně tak začátek dle rozpisu</li>",
"<li>Nesprávně zadané zápasy lze smazat přes rychlé menu zápasu (podržením prstu na zápasu v seznamu)",
"</ul>",
"<strong>Hráčské soupisky</strong>",
"<ul>",
"<li>Hráče, který není v soupisce v rámci zápasu (při přidání bodu) je možné přidat přes sekci Hráči připojením z Evidence ČALD (ikonka druhá zprava na detailu týmu)</li>",
"<li>Lze připojit hráče na \"hostování\" z jiného týmu. Pomocí ikonky + v nabídce připojení hráče z týmu se zobrazí dialog pro vyhledání dle jména či přezdívky. Hráč nesmí na turnaji již hrát.</li>",
"<li>Přezdívky a čísla hráčů prosím průběžně aktualizujte v detailu hráče (Hráči - název týmu - jméno hráče), data se použijí i pro další turnaje a průběžně se tak docílí přesné databáze čísel a přezdívek</li>",
"<li>Nového hráče nelze přidat v aplikaci, každý hráč by měl být v Evidenci ČALD. Pokud tam není, jeho body lze skórovat pouze jako Anonymní</li>",
"</ul>",    
"<strong>Online přístup</strong>",
"<ul>",
"<li>Aplikace musí být při používání online, v případě odpojení dřív nebo později přestane fungovat a bude nutné ji restartovat</li>",
"<li>Díky neustálé synchronizaci dat je možné skórovat jeden zápas z více zařízení</li>",
"<li>Výstup z aplikace (průběhy zápasů, tabulky) jsou k dispozici na www.frisbee.cz/online-vysledky.html</li>",
"</ul>"
].join("")		
	}				
});