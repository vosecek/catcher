Ext.define("catcher.view.MatchDetailCounter", {
  extend : "Ext.Panel",
  xtype : "matchDetailCounter",      
  requires : [ "Ext.SegmentedButton"],
  config: {
    title : "Zápas",
    iconCls : "compose",
    id: "matchDetailCounter",
    layout: "vbox",
    align:"start",
    pack:"start",
    height:"100%",
    styleHtmlContent : true,
    
    items : [{
        xtype : "container",
        layout : "hbox",
        flex: 2,
        id:"scoreBoard",
        defaults:{
          style: {
            "text-align": "center",
            "font-family": "Digital-7"
          }
        },
        items : [ {
            xtype : "label",
            flex : 1,
            name : "score_home",
            html : "" 
        }, {
            xtype : "label",
            flex : 1,
            name : "score_away",
            html : ""
        } ]
    }, {
        xtype : "segmentedbutton",
        flex: 2,
        layout : {
            align : "stretchmax",
            pack : "center",
            type : "hbox"
        },
        style : {
          "font-size": "200%",
          "margin-top" : "20px"
        },
        items : [ {
            xtype : "button",
            flex : 1,
            name : "addPointHome",
            iconCls: "add",
            ui: "home",
            admin: 2
        }, {
            xtype : "button",
            flex : 1,
            name : "addPointAway",
            iconCls: "add",
            ui: "away",
            admin: 2
        }]
    },{
        xtype:"container",
        layout:"hbox",
        id:"timeBoard",
        flex:1,
        defaults:{
            flex: 1,
            xtype:"label",
            style: {
                "text-align": "center",
                "font-family": "Digital-7"
            }
        },
        items:[{
            xtype:"label",
            flex:1,
            layout:{
                pack:"center"
            },
            id:"timer",
            html:""
          },{
            xtype:"label",
            flex:1,
            layout:{
                pack:"center"
            },
            id:"length",
            html:""
          }]
      },{
        xtype:"container",
        layout:"hbox",
        flex:1,
        defaults:{
            style : "margin-top : 10px",
            flex: 1,
            xtype:"button"
        },
        items:[{  
            text: "Poslední bod",
            admin: 2,
            iconCls:"trash",
            ui: "decline",
            name : "dropPoint",
            style:"margin-right:1%"
          },{
            text: "Vložené body",
            ui: "confirm",
            name : "matchScore",
            style:"margin-left:1%"
          }]
        }],
      listeners : {
        painted : function(){            
            // nastavení maximální výšky textů v labels            
            var bigText = Ext.Viewport.getWindowHeight()*(1/5);
            var smallText = Ext.Viewport.getWindowHeight()*(1/10);
            Ext.getCmp("scoreBoard").query("label").forEach(function(el){
                el.setStyle({"text-align": "center", "font-family": "Digital-7","font-size":bigText+"px"});
            });

            var casomira = Ext.getCmp("timeBoard");
            casomira.query("label").forEach(function(el){
                el.setStyle({"text-align": "center", "font-family": "Digital-7","font-size":smallText+"px"});
            });

            catcher.app.getController("MatchController").stopWatch();            

          this.query('.button').forEach(function(c){
            var pressedCls = "x-button-pressed";         
            c.removeCls(pressedCls);
          });
          // if(Ext.device.Connection.isOnline() == false){
          //   Ext.Msg.alert("Offline","Zřejmě nejsi připojen k internetu, aplikace nebude fungovat správně.");
          // }
        },
        initialize:function(){
            setAccess(this);
        }          
      }
    }      
});