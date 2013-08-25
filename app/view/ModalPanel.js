Ext.define("catcher.view.ModalPanel", {
    extend : "Ext.Panel",
    xtype : "modalPanel",
    id: "modalPanel",
    config: {
      modal: true,
      layout: "fit",
      hideOnMaskTap: true,
      centered: true,
      width: "95%",
      height:"95%",
      maxHeight:"550px",
      maxWidth:"550px",
      scrollVertical : true,      
      items:[
        
      ]
    }
})