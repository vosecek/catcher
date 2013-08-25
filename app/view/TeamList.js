Ext.define('catcher.view.TeamList', {                                             
  extend: "Ext.dataview.NestedList",
  requires: ["catcher.view.PlayersDetail","Ext.dataview.DataView","catcher.view.TeamRoster"],  
  xtype: "teamList",
  id: "teamList",  
  config: {
    store: "Evidence",
    fullscreen: true,
    title: 'Hráči',
    iconCls: "team",
    displayField: 'text',
    useTitleAsBackText: false,
    styleHtmlContent: true,
    detailCard: {
      xtype: "playersDetail"
    },
    toolbar: {
      defaults:{
        iconMask: true
      },
      items: [
      {
        xtype: "button",
        hidden: true,
        iconCls: "address_book",
        id: "connectPlayer",
        target: "",
        align: "right",
        handler: function(){
          var modalPanel = Ext.getCmp("modalPanel") || new catcher.view.ModalPanel();                
          if(!modalPanel.getParent()) Ext.Viewport.add(modalPanel);
          var teamRoster = Ext.getCmp("teamRoster") || new catcher.view.TeamRoster();
          modalPanel.add(teamRoster);
          modalPanel.show();
        }        
      },
				{
					xtype: "button",
					hidden: true,
					iconCls: "user_add",
					align: "right",
					id: "addPlayer",
					target: "",
					handler: function(){
            Ext.Msg.confirm("Přidat hráče","Tato možnost je pouze pro případ, že hráč není v Evidenci ČALD. Nejprve se prosím podívej do celkové soupisky týmu na vedlejší ikoně. <br />Opravdu natvrdo přidat hráče?",
            function(response){
							if(response == "yes"){
    						Ext.getCmp("addPlayer").hide();
    						var players = Ext.getStore("Players");
    						players.sort("player_id","ASC");
    						var evidence = Ext.getStore("Evidence"); 
    						var parent = evidence.getNodeById(this.target);
    						var novy_hrac = Ext.create("catcher.model.Player",{
                  nick: "",
    							name:"Nový",
    							surname: "Hráč",							
    							team: this.target,
    							number: 1,
    							player_id: false,
    							text: "Nový Hráč #1"
    						});
                
                novy_hrac.data.leaf = true;                        						
    						
    						var name_short = Ext.getStore("Teams").findRecord("team_id",this.target);						
    						Ext.getCmp("teamList").setBackText(name_short.get("name_short"));
                
                Ext.data.Store.prototype.syncWithListener = function(onWriteComplete, syncMethod) {
                  this.on('write', onWriteComplete, this, {single:true});  
                  var syncResult = syncMethod ? syncMethod.apply(this) : this.sync();
                  if (syncResult.added.length === 0 &&
                  syncResult.updated.length === 0 &&
                  syncResult.removed.length === 0) {  
                    this.removeListener('write', onWriteComplete, this, {single:true});
                    onWriteComplete(this);    
                  }
                  return syncResult;
                };
    																		 
                var cilovy_team = this.target;																							
    						players.add(novy_hrac);            
                novy_hrac.setDirty(true);						
    						players.syncWithListener(function(){
                    catcher.app.getController("Evidence").sestavEvidenci(cilovy_team);
                  }
                );
              }
            })
           }				
				},
				{
					xtype: "button",
					align: "right",
					hidden: true,
					iconMask: true,
					iconCls: "trash",
					ui: "decline",
					id: "deletePlayer",
					handler: function(){
						Ext.Msg.confirm("Smazat hráče","Opravdu natvrdo smazat hráče? Tato možnost je pouze pro případ omylem přidaného hráče přes tuto aplikaci, který není v Evidenci ČALD. Pokud hráč na turnaji nehraje, stačí ho odpojit od týmu v soupisce týmu.",
							function(response){
								if(response == "yes") catcher.app.getController("Evidence").deletePlayer()
							}              
						);						
					}
				}
			]
    },
    listeners: {
      leafitemtap: function(nestedList, list, index, target, record){
        catcher.app.getController("Evidence").showPlayer(list, record);
        Ext.getCmp("addPlayer").hide();
        Ext.getCmp("connectPlayer").hide();
      },
      itemtap: function(nested, list, index, target, record){      	
      	if(record.isLeaf() == false){
					// nastavuji master tým, protože zatím nevím jak zjistit aktuálně zobrazený node      		
      		Ext.getCmp("addPlayer").target = record.getId();
      		Ext.getCmp("addPlayer").show();
          Ext.getCmp("connectPlayer").show();
      		Ext.getCmp("teamList").setBackText("Týmy");
				}else{					
      		var shortName = Ext.getStore("Teams").findRecord("team_id",Ext.getCmp("addPlayer").target);
					Ext.getCmp("teamList").setBackText(shortName.get("name_short"));
					Ext.getCmp("addPlayer").hide();
          Ext.getCmp("connectPlayer").hide();
				}				
			},
			back:function(back,node){
				var addPlayer = Ext.getCmp("addPlayer"); // přidávací tlačítko
        var connectPlayer = Ext.getCmp("connectPlayer");   
				if(node.isLeaf()){
					Ext.getCmp("teamList").setBackText("Týmy");
					addPlayer.show(); // zobrazit, jsme na výpisu týmu, předchozí node byl leaf
          connectPlayer.show();
				}else{					
					addPlayer.hide(); // skrýt add button, předchozí node byla soupiska týmu a jsme na přehledu týmů
          connectPlayer.hide();
				} 
			}			
    }
  }
});
