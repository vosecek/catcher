Ext.define("catcher.view.MatchDetailCounter", {
  extend : "Ext.Panel",
  xtype : "matchDetailCounter",      
  requires : [ "Ext.SegmentedButton"],
  config: {
    title : "Zápas",
    iconCls : "compose",
    id: "matchDetailCounter",
    layout: "vbox",
    height: "100%",    
    styleHtmlContent : true,
    
    items : [{
        xtype : "container",
        layout : "hbox",
        flex: 2,
        style : "font-size: 7em",
        defaults:{
          style: {
            "text-align": "center",
            "font-family": "Digital-7",
            "line-height": "1.2em"
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
          "font-size": "4em",
          "margin-top" : "20px"
        },
        items : [ {
            xtype : "button",
            flex : 1,
            name : "addPointHome",
            text : "+",
            ui: "home"
        }, {
            xtype : "button",
            flex : 1,
            name : "addPointAway",
            text : "+",
            ui: "away"
        }]
      },{
        xtype: "button",
        flex: 1,
        text: "Zobraz zapsané body",
        ui: "confirm",
        name : "matchScore",
        style : "font-size:140%; margin-top : 20px"
      }],
      listeners : {
        painted : function(){
          this.query('.button').forEach(function(c){
            var pressedCls = "x-button-pressed";         
            c.removeCls(pressedCls);
          });
        }          
      }
    }      
});