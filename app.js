/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'catcher',

    requires: [
        'Ext.MessageBox'
    ],

    views : [ "Main", "Login", "About", "Tournament", "MatchesNavigation", "TeamList","MatchDetailCounter","MatchDetailSettings","MatchDetailScore","EditorPanel","HelpPanel","TeamRoster","ModalPanel","MainNavigation","QuickMatchMenu","SearchBox"],
    stores : [ "Tournaments", "Matches", "Session", "Teams", "Players", "Evidence", "Points","Rosters","MatchPlayerListScore","MatchPlayerListAssist","SearchBox"],
    models : [ "Tournament", "Match", "Session", "Team", "Player", "Evidence", "Point","Roster" ],
    controllers : [ "Login", "Evidence", "MatchController"],

    icon: {
        '57': 'resources/icons/catcher-icon.png',
        '72': 'resources/icons/catcher-icon.png',
        '114': 'resources/icons/catcher-icon.png',
        '144': 'resources/icons/catcher-icon.png'
    },

    isIconPrecomposed: true,

//     startupImage: {
//         '320x460': 'resources/startup/320x460.jpg',
//         '640x920': 'resources/startup/640x920.png',
//         '768x1004': 'resources/startup/768x1004.png',
//         '748x1024': 'resources/startup/748x1024.png',
//         '1536x2008': 'resources/startup/1536x2008.png',
//         '1496x2048': 'resources/startup/1496x2048.png'
//     },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('catcher.view.Main'));
        
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
        
        // hezÄŤĂ­ confirm message box (zelenĂ© a ÄŤervenĂ© tlaÄŤĂ­tko)
        var MB = Ext.MessageBox;
        Ext.apply(MB, {
        		YES: { text: 'Provést', itemId: 'yes', ui: 'confirm' },
        		NO: { text: 'Zrušit', itemId: 'no',ui:"decline" }
        });
        Ext.apply(MB, {
        		YESNO: [MB.NO, MB.YES]
        });
        
//         if (Ext.os.is('Android')) {
//           document.addEventListener("backbutton", Ext.bind(onBackKeyDown, this), false);
//       
//           function onBackKeyDown(eve) {
//       
//               eve.preventDefault();
//       
//               //do something
//               alert('back button pressed');
//       
//           }
//         }              
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
