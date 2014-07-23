Ext.define("catcher.view.SearchBox",{
	extend : "Ext.List",
  xtype : "searchBox",
  id: "searchBox",      
  
  config:{
    store:"SearchBox",
    styleHtmlContent:true,
    emptyText: "Žádný hráč nenalezen. <br />Vyhledejte hráče, který ještě není na soupisce žádného týmu pro tento turnaj.",        
    itemTpl : "<strong>{nick} #{number}</strong> <small>({surname} {name})</small>",
    items:[                      
      {
        docked: 'top',
        xtype: 'toolbar',
        title: '',
        items:[
          {
            xtype:"textfield",
            label:"Hledej: ",            
            name:"name",
            id:"searchText",
            width: "230px",
            value:""            
          },{
            xtype: 'spacer'
          },{
            iconMask:true,
            iconCls:"find",
            ui: 'confirm',
            handler: function() {
              var search = Ext.getCmp("searchText").getValue();              
              var store = Ext.getCmp("searchBox").getStore();
              var session = getSession();
              store.getProxy().setExtraParam("search",search);              
              store.getProxy().setExtraParam("tournament_id",session.get("tournament_id"));
              store.load(function(response){
                if(response.length == 0){
                  store.removeAll();
                }
                store.getProxy().setExtraParam({});
              });              
            }
          }
        ]            
      },{
        docked: 'bottom',
        ui: 'light',
        xtype: 'toolbar',
        items: [
          {
            xtype:"button",
            text:"Zrušit",
            ui:"decline",
            handler:function(){
//               this.up("modalPanel").removeAll();
              Ext.getCmp("searchBox").hide();
              this.up("modalPanel").hide();
            }
          },{
            xtype: 'spacer'
          },{
            xtype:"button",
            text:"Přidat hráče",
            ui:"confirm",
            handler:function(){
              var list = this.up("searchBox");
              var player = list.getSelection();
              var active_team = Ext.getCmp("connectPlayer").target;
              var modalPanel = list.up("modalPanel");
              list.setMasked({
                xtype : 'loadmask',
                message : 'Připojuji hráče k týmu pro turnaj'
              });
              if(player.length > 0){
                var session = getSession();
                Ext.Ajax.request({
                  url:"http://www.frisbee.cz/catcher/app/scripts/data_process.php?operation=add_host",
                  params:{
                    team: active_team,
                    tournament_id: session.get("tournament_id"), 
                    player_id: player[0].getId()
                  },
                  success: function(response){                  
                    var players = Ext.getStore("Players");
                    players.load(function(response){                      
                      list.setMasked(false);
                      Ext.getCmp("searchBox").hide();
                      modalPanel.hide();
                      Ext.Viewport.setMasked({
                        xtype : 'loadmask',
                        message : 'Sestavuji soupisky na tomto zařízení'
                      });                          
                      catcher.app.getController("Evidence").sestavEvidenci(active_team);
                    });
                  }
                });
              } 
            }            
          }                 
        ]
      }      
    ]
  }
});