Ext.define('catcher.controller.Login', {
    extend : 'Ext.app.Controller',
    
    config : {
        refs : {
            loginForm : 'loginPanel'
        },
        control : {
            'loginPanel button' : {
                tap : 'doLogin'
            }
        }
    },

    doLogin : function() {
        Ext.Viewport.setMasked({
            xtype : 'loadmask',
            message : 'Přihlašuji a načítám data turnaje',
            indicator: true
        });
        var form = this.getLoginForm();
        values = form.getValues(true, true);
        
        Ext.Ajax.request({
            url : "http://www.frisbee.cz/catcher/app/scripts/catcher_login.php",
            params : {
                password : values.password,
                tournament : values.tournament
            },
            success: function(response) {
              response = Ext.JSON.decode(response.responseText);
              if(response.success == true){                
                  var store = Ext.data.StoreManager.lookup("Session");
                  var device = Ext.device.Device.uuid;
                  var save = {
                      uuid : device,
                      tournament_id : response.tournament_id,
                      tournament_name : response.tournament_name,
                      match_id : 0,
                      timestamp_logged : Date.now()
                  };
                  store.add(device, save);
                  Ext.getStore("Teams").setProxy({url:'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=teams&tournament_id='+response.tournament_id}).load(function(){
                    Ext.getStore("Players").setProxy({url:'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=players&tournament_id='+response.tournament_id}).load(function(){                        
                      catcher.app.getController("Evidence").sestavEvidenci(false);
                      // Evidenci sestavit až poté, co jsou načteny týmy i hráči                        
                    });
                  });
                  Ext.getStore("Matches").setProxy({url:'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=matches&tournament_id='+response.tournament_id}).load();
                  Ext.getStore("Points").setProxy({url:'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=points&tournament_id='+response.tournament_id}).load();                    
                  Ext.getStore("Rosters").setProxy({url:'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=rosters&tournament_id='+response.tournament_id});
                  Ext.Viewport.add({
                      xtype : "tournamentPanel"
                  });
                  Ext.Viewport.setActiveItem(1);
                  Ext.Viewport.setMasked(false);
                }else{
                  Ext.Viewport.setMasked(false);
                  Ext.Msg.alert("Nepřihlášen", response.message);
                }
              },
              failure: function(response) {
                Ext.Viewport.setMasked(false);
                Ext.Msg.alert("Chyba spojení","Pravděpodobně nejsi online, aktivuj připojení k internetu.");                  
              }            
        });
    }
});