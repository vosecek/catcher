Ext.define("catcher.view.Login", {
    extend : "Ext.form.Panel",
    xtype : "loginPanel",
    id: "loginPanel",
    requires : [ "Ext.form.FieldSet", "Ext.form.Select", "Ext.form.Password", "Ext.Object", "Ext.Array", "Ext.device.Device", "Ext.data.Model", "Ext.data.Store" ],

    config : {
        title : "Přihlášení",
        iconCls : "home",        
        styleHtmlContent: true,    

        items : [ {
            xtype : "fieldset",
            title : "Přihlášení k turnaji",
            instructions: "Organizátor: admin (heslo ví pořadatelé).<br />Správci týmů: zkratka týmu (heslo ví Zástupce oddílu).<br />Přihlásit jako divák - bez možnosti úprav.",
            items : [ {
                xtype : "selectfield",
                displayField : "text",
                name : "tournament",
                id : "turnaj",
                label : "Turnaj:",
                placeHolder : "Vyberte turnaj",
                options : []
            }, {
                xtype : "textfield",
                name : "user",
                id:"user",
                label : "Jméno"
            }, {
                xtype : "passwordfield",
                name : "password",
                label : "Heslo"
            }
            ]
        }, {
            xtype : "button",
            text : "Přihlásit",
            ui : "confirm",
            name: "admin",
            height:"40px"
        },{
            xtype : "button",
            name: "host",
            text : "Přihlásit jako divák",
            ui : "normal",
            height:"40px",
            margin: "1em 0em 0em 0em"
        },{
            xtype : "button",
            text : "Znovu načti turnaje",
            ui : "action",
            margin: "1em 0em 0em 0em",
            handler:function(){
              this.up("formpanel").loadTournaments();
            }
        }
         ],
        listeners:{
          // vložení možností do Selectu
          painted : function() {              
              var users = Ext.getStore("Users");
              users.load();
              if(users.getCount()>0){
                var x = users.last();
                if(typeof x != undefined) Ext.getCmp("user").setValue(x.get("user"));
              }
          },
          initialize:function(){
            this.loadTournaments();
          }
        }      
    },
    
    loadTournaments:function(){
      Ext.Viewport.setMasked({
        xtype:"loadmask",
        message:"Stahuji aktuální turnaje"
      });      
      var store = Ext.getStore("Tournaments");
      var options = new Array();
      store.load(function(response){              
        store.each(function(radek) {
          options.push({
            text : radek.get("name"),
            value : radek.get("tournament_id")
          });
        });
        Ext.getCmp("turnaj").setOptions(options);
        Ext.Viewport.setMasked(false);
      });

    }          
});