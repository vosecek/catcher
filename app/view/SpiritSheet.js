Ext.define("catcher.view.SpiritSheet",{
	extend: "Ext.form.Panel",
	xtype: "spiritSheet",
	id: "spiritSheet",
	requires:["Ext.field.Slider"],

	config:{
		styleHtmlContent: true,	
		items:[
			{
				xtype:"fieldset",
				title:"Znalost pravidel<br />2 body",
				instructions:"Znali pravidla nebo měli vůli se je učit. Nehlásili nepravdivě.",
				items:[
					{
						xtype:"sliderfield",
						name:"rules",
						minValue:0,
						maxValue:4,
						value:2,
						increment:1,
						listeners:{
							change:function(me,sl,thumb,newVal,oldVal){
								catcher.app.getController("Spirit").showInfo(me,newVal,"Znalost pravidel");								
							}
						}
					}
				]
			},{
				xtype:"fieldset",
				title:"Fauly a tělesný kontakt<br />2 body",
				instructions:"Hráči se snažili vyhnout faulům a porušování pravidel. Nevybíhali před výhozem apod. Věděli, kde se nachází ostatní hráči a vyhýbali se nebezpečné hře.",	
				items:[
					{
						xtype:"sliderfield",
						name:"fouls",
						minValue:0,
						maxValue:4,
						value:2,
						increment:1,
						listeners:{
							change:function(me,sl,thumb,newVal,oldVal){
								catcher.app.getController("Spirit").showInfo(me,newVal,"Fauly a tělesný kontakt");								
							}
						}
					}
				]
			},
			{
				xtype:"fieldset",
				title:"Férové smýšlení<br />2 body",
				instructions:"Hráči upozornili na své fauly. Opravovali hlášky svých spoluhráčů. V důležitých situacích byli ochotni připustit, že soupeř má pravdu. Vyvarovali se hlášení nejasných kroků a picků.",
				items:[
					{
						xtype:"sliderfield",
						name:"fair",
						minValue:0,
						maxValue:4,
						value:2,
						increment:1,
						listeners:{
							change:function(me,sl,thumb,newVal,oldVal){
								catcher.app.getController("Spirit").showInfo(me,newVal,"Férové smýšlení");								
							}
						}
					}
				]
			},
			{
				xtype:"fieldset",
				title:"Pozitivní přístup a sebeovládání<br />2 body",
				instructions:"Hráči se představili soupeři. Pochválili hezkou hru soupeře. Po hře zanechali v kolečku pozitivní dojem apod. Reakce soupeře proti neshodám, úspěchům a chybám byly dostatečně přirozené / normální / odpovídající.",
				items:[
					{
						xtype:"sliderfield",
						name:"positive",
						minValue:0,
						maxValue:4,
						value:2,
						increment:1,
						listeners:{
							change:function(me,sl,thumb,newVal,oldVal){
								catcher.app.getController("Spirit").showInfo(me,newVal,"Pozitivní přístup a sebeovládání");								
							}
						}
					}
				]
			},{
				xtype:"fieldset",
				title:"Komunikace<br />2 body",
				instructions:"Komunikovali s respektem, naslouchali. Dodrželi časový limit pro diskuze.",
				items:[
					{
						xtype:"sliderfield",
						name:"communication",
						minValue:0,
						maxValue:4,
						value:2,
						increment:1,
						listeners:{
							change:function(me,sl,thumb,newVal,oldVal){
								catcher.app.getController("Spirit").showInfo(me,newVal,"Komunikace");								
							}
						}
					}					
				]
			},{
				xtype:"fieldset",
				title:"Komentář ke spiritu",
				instructions:"Můžete uvést komentář ke spiritu. Pokud v nějaké kategorii dáte 0 bodů, je nutné komentář uvést.",
				items:[
				{
					xtype:"textareafield",
					name:"comment"
				}]
			},{
				xtype:"button",
				ui:"confirm",
				text:"Uložit Spirit",
				iconCls:"check2"
			}		
		]
	}
});