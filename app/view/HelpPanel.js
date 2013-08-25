Ext.define("catcher.view.HelpPanel",{
	extend: "Ext.Panel",
	xtype: "helpPanel",
	id: "helpPanel",				
  
  config: {
    modal: true,
    hideOnMaskTap: true,
    styleHtmlContent: true,
    centered: true,
    width: "90%",
    height:"90%",
//     maxHeight:"550px",
//     maxWidth:"550px",
    
    scrollable: true,
    items: [
      {
        docked: 'top',
        xtype: 'toolbar',
        title: 'Nápověda ke skórování'
      },
      {xtype:"button",iconCls:"add",iconMask:true,align:"left",ui:"action"}
    ]        
  }      
});