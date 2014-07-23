Ext.define("catcher.view.SpiritRanking", {
    extend : "Ext.List",
    xtype : "spiritRanking",
    id : "spiritRanking",

    config : {
        scrollVertical : true,
        disableSelection: true,
        itemTpl : "<div>{team_name_full} ({spirit})</div>",
        onItemDisclosure : false,
        styleHtmlContent: true,
        title : "Pořadí SotG",

        items:[{
          docked: 'top',
          xtype: 'toolbar',
          title: 'Pořadí SotG',
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
            this.setStore(getSpiritRanking());
          }
        }
    }
});
