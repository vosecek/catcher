Ext.define("catcher.view.SpiritInspector", {
    extend : "Ext.List",
    xtype : "spiritInspector",
    id : "spiritInspector",

    config : {
        scrollVertical : true,
        // disableSelection: true,
        itemTpl : "<div>{home_name_full} vs. {away_name_full}</div>",
        onItemDisclosure : false,
        styleHtmlContent: true,
        title : "Nevyplněný spirit",
        grouped:true,

        items:[{
          docked: 'top',
          xtype: 'toolbar',
          title: 'Nevyplněné zápasy',
          items:[{
            xtype:"button",
            ui:"decline",
            iconCls:"delete",
            handler:function(){
              this.up("modalPanel").hide();
            }
          }
          ]
        }],

        listeners:{
          painted:function(){
            this.setStore(getUnfilledSpirit());
          }
        }
    }
});
