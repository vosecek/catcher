Ext.define("catcher.view.EditorPanel",{
	extend: "Ext.form.Panel",
	xtype: "editorPanel",
	id: "editorPanel",				
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden","Ext.field.Number"],
  
  config: {
    modal: true,
    hideOnMaskTap: false,
    centered: true,
    width: "95%",
    height:"95%",
    maxHeight:"550px",
    maxWidth:"550px",
    
    scrollable: true,        
    items: [
      {
        xtype: 'fieldset',
        items: [
          {
            xtype: 'selectfield',
            name: 'home_id',
            label: "První tým",
            labelWidth: "40%",
            height:"100%",
            options:[]
          },{
            xtype: 'selectfield',
            name: 'away_id',
            label: "Druhý tým",
            labelWidth: "40%",
            options:[]
          },{
						xtype: "selectfield",
						label: "Hřiště",
						name: "field",
            labelWidth: "40%",
						options: []
					},{
          },{
						xtype: "selectfield",
						label: "Typ zápasu",
						name: "skupina",
            labelWidth: "40%",
						options: []
					},{
						xtype: "selectfield",
						label: "Délka utkání [min]",
            labelWidth: "40%",
						name: "length",
            options: []
					},{
						xtype: "datetimepickerfield",
            dateTimeFormat: "j.n.Y H:i",
						label: "Začátek dle rozpisu",
            labelWidth: "40%",
						name: "time",
						value: ""
					}
        ]
      },{
        docked: 'top',
        xtype: 'toolbar',
        title: 'Nový zápas'
      },{
        docked: 'bottom',
        ui: 'light',
        xtype: 'toolbar',
        items: [
          {
            ui: "decline",
            text: 'Zrušit',
            handler: function() {
                Ext.getCmp('editorPanel').hide();
            }
          },{
            xtype: 'spacer'
          },{
            text: 'Vytvořit',
            ui: 'confirm',
            handler: function() {
              var formPanel = Ext.getCmp('editorPanel');
              var data = formPanel.getValues();
              var message = new Array();
              if(data.home_id == data.away_id) message.push("Tým nemůže hrát sám proti sobě");
              if(data.length == null || data.length == 0) message.push("Zadej délku zápasu v minutách");
              if(data.skupina == "0") message.push("Vyber správný typ zápasu dle rozpisu");
              
              if(message.length > 0){
                Ext.Msg.alert("Chybějící data",message.join("<br />"));
              }else{
                            
                Ext.Viewport.setMasked({
                  xtype: "loadmask",
                  message: "Ukládám zápas na frisbee.cz"
                });              
                formPanel.hide();
                var match = Ext.create("catcher.model.Match",data);                
                var store = Ext.getCmp("matchesList").getStore(); 
                store.add(match);                                
                store.syncWithListener(function(){
                  store.load(function(){
                    Ext.Viewport.setMasked(false);                
                  });
                });
               }                              
            }
          }
        ]
      }
    ],
    listerners:{
      painted:function(){
        
      }
    }  
  }  
});