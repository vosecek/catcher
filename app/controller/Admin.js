Ext.define('catcher.controller.Admin', {
  extend : 'Ext.app.Controller',

  config : {
      refs : {
          adminPanel:"adminPanel"
      },
      control : {
        "adminPanel button":{
          tap:"submitSettings"
        }
      },
      listeners: {          
      }
  },

  fillSettings:function(){
    var form = this.getAdminPanel();
    var tournaments = Ext.getStore("Tournaments");
    var session = getSession();
    var tournament_data = Ext.getStore("Tournaments").findRecord("tournament_id",session.get("tournament_id"),false,false,true);
    var data = tournament_data.data;
    data.skupiny = data.skupiny.split("*").join("\n");
    data.fields = data.fields.split("*").join("\n");
    form.setValues(data);
  },

  submitSettings:function(){
    var form = this.getAdminPanel();
    var form_data = form.getValues();    

    var tournaments = Ext.getStore("Tournaments");
    var session = getSession();
    var tournament_data = Ext.getStore("Tournaments").findRecord("tournament_id",session.get("tournament_id"),false,false,true);

    form_data.skupiny = form_data.skupiny.split("\n").join("*");
    form_data.fields = form_data.fields.split("\n").join("*");

    tournament_data.set(form_data);

    function submitData(){
      Ext.Viewport.setMasked({
        xtype:"loadmask",
        message:"Ukládám nastavení turnaje"
      });

      tournaments.syncWithListener(function(response){
        Ext.Viewport.setMasked(false);
      });
    }

    if(form_data.active != true){
      Ext.Msg.confirm('Zneaktivnit turnaj',"K turnaji se z Catchera již nepůjde přihlásit!",function(button) {
        if (button == "yes") {          
          submitData();
        }
      });    
    }else{
      submitData();
    }

  }
});