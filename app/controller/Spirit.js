Ext.define('catcher.controller.Spirit', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            spiritNavigation : "spiritNavigation",
            spiritSheet:"spiritSheet",
            spiritInspector:"spiritInspector"
        },
        control : {
          "spiritList" : {
            select : "showSpiritSheet"
          },
          "spiritSheet button":{
            tap:"submitSpirit"
          },
          "spiritInspector":{
            select:"showSpiritSheet"
          }
        },
        listeners: {          
        }
    },

    submitSpirit:function(){
      var form = this.getSpiritSheet();
      var form_data = form.getValues();
      var form_data_object = form_data;
      
      var spirit = 0;
      for (var key in form_data) {
        if (form_data.hasOwnProperty(key)) {          
          if(key != "comment") {
            form_data[key] = form_data[key][0];
            spirit = spirit + parseInt(form_data[key]);
          }
        }
      }

      var matches = Ext.getStore("Matches");
      var teamMatches = Ext.getCmp("spiritList").getStore();
      var session = getSession();
      var match = matches.findRecord("match_id",session.get("match_id"));

      if(session.get("active_subteam") == match.get("home_id")) {
        match.set("spirit_away_all",form_data);
        match.set("spirit_away",spirit);
      }
      if(session.get("active_subteam") == match.get("away_id")) {
        match.set("spirit_home_all",form_data_object);
        match.set("spirit_home",spirit);
      }

      match.set("operation","spirit");

      match.setDirty();

      Ext.Viewport.setMasked({
        xtype:"loadmask",
        message:"Ukládám spirit na server"
      });

      matches.syncWithListener(function(response){
        var teamMatch = teamMatches.findRecord("match_id",session.get("match_id"));
        teamMatch.set("spirit",spirit);
        teamMatch.set("spirit_all",form_data);
        Ext.Viewport.setMasked(false);
        catcher.app.getController("Spirit").getSpiritNavigation().pop();
      });

    },

    selectSpirit:function(subteams){
      var modalPanel = Ext.getCmp("modalPanel") || new catcher.view.ModalPanel();
      var session = getSession();
      if(!modalPanel.getParent()) Ext.Viewport.add(modalPanel);
      modalPanel.show();
      modalPanel.removeAll();
      var formular = Ext.create("Ext.form.Panel",{
        items:[
        {
          xtype:"toolbar",
          docked:"top",
          title:"Vyber tým",
          items:[
            {
              xtype: "button",
              align:"left",
              iconCls: "delete",
              ui: "decline",
              handler: function(){
                modalPanel.hide();
              }                    
            },
            {
              xtype: "spacer"
            },
            {
              xtype: "button",
              align:"right",
              iconCls: "check2",
              ui: "confirm",
              handler: function(){
                var data = formular.getValues();                
                session.set("active_subteam",data.team);
                session.set("team_name_full",subteams[data.team][0]);
                session.set("team_name_short",subteams[data.team][1]);
                catcher.app.getController("Spirit").prepareList();
                Ext.Viewport.setMasked({
                  xtype:"loadmask",
                  message:"Spirit týmu: "+subteams[data.team][0],
                  indicator:false
                });
                var popiska = "Spirit "+subteams[data.team][0];
                Ext.getCmp("spiritSelect").setText(popiska);
                Ext.getCmp("spiritNavigation").getNavigationBar().setTitle(popiska);
                hideMask();
                modalPanel.hide();
              }
            }
          ]
        },{
          xtype: "selectfield",
          label: "Tým",
          name: "team",
          options:[]
        }]
      }); 
      modalPanel.add(formular);
      modalPanel.setHeight("105px");
            
      var session = getSession();
      
      var teams2push = new Array;
      
      for(key in subteams){
        teams2push.push({
          text:subteams[key][0],
          value:key
        });
      }
      
      var selectfield = modalPanel.query("selectfield[name=team]")[0];
      selectfield.setOptions(teams2push);
      if(session.get("active_subteam")>0) selectfield.setValue(session.get("active_subteam"));
    },

    showSpiritSheet:function(list,record){
      if(Ext.getCmp("spiritList").length > 0) Ext.getCmp("spiritList").destroy();
      Ext.getCmp("modalPanel").hide(); // pokud jsme šli přes spiritInspector
      Ext.getCmp("tournament").getTabBar().hide(); // skrytí hlavní navigace turnaje
      var session = getSession();
      session.set("match_id",record.get("match_id"));
      if(typeof record.get("spiritInspector") != undefined){
        if(record.get("spiritInspector") == true){
          session.set("active_subteam",record.get("home_id"));
          session.set("team_name_full",record.get("home_name_full"));
          session.set("team_name_short",record.get("home_name_short"));          
          catcher.app.getController("Spirit").prepareList();
          var popiska = "Spirit "+record.get("home_name_full");
          Ext.getCmp("spiritNavigation").getNavigationBar().setTitle(popiska);
          Ext.getCmp("spiritSelect").setText(popiska);
        }
      }
      var data = record.get("spirit_all");
      if(data == null) data = Ext.JSON.decode('{"rules":2,"fouls":2,"fair":2,"positive":2,"communication":2,"comment":""}');

      this.getSpiritNavigation().push({
          xtype : "spiritSheet",
          title : "Spirit "+record.get("home_name_short")+" vs. "+record.get("away_name_short")
      });

      var sheet = Ext.getCmp("spiritSheet");
      var sliderFields = sheet.query("sliderfield");

      if(session.get("admin") == 3){
        var fieldsets = sheet.query("fieldset");
        for(key in fieldsets){
          fieldsets[key].setInstructions(false);
        }
      }

      for(key in sliderFields){
        var name = sliderFields[key].getName();
        var pocet = data[name];        
        sliderFields[key].setValue(pocet);
        // nastavení nadpisů všech sekcí
        var nadpis = sliderFields[key].getParent();
        var nadpis_text = nadpis.getTitle().split("<br />");
        var body = catcher.app.getController("Spirit").sklonuj(pocet,"bodů","bod","body");
        nadpis.setTitle(nadpis_text[0]+"<br />"+pocet+" "+body);        
      }
      sheet.query("textareafield")[0].setValue(data["comment"]);
    },

    prepareList:function(){
      var session = getSession();
      var store = getTeamMatches(session.get("active_subteam"));
      Ext.getCmp("spiritList").setStore(store);
      Ext.getCmp("spiritNavigation").setMasked(false);
    },

    showInfo:function(slider,pocet,kategorie){
      var body = catcher.app.getController("Spirit").sklonuj(pocet,"bodů","bod","body");
      var nadpis = slider.getParent();
      var nadpis_text = nadpis.getTitle().split("<br />");

      nadpis.setTitle(nadpis_text[0]+"<br />"+pocet+" "+body);

      Ext.Viewport.setMasked({
        xtype:"loadmask",
        message:"<font size='350%'><strong>"+pocet+" "+body+"</strong></font><br /><br />"+kategorie+"<br />",
        indicator:false
      });
      hideMask();
    },

    sklonuj:function(pocet,x,y,z){
      if(pocet == 0){
        return x;
      }else if(pocet == 1){
        return y;
      }else if(pocet < 5){
        return z;
      }else if(pocet > 4){
        return x;
      }
    }
});

function getSpiritRanking(){
  Ext.define("SpiritRanking", {
      extend : "Ext.data.Model",
      config : {
        fields : [
          {name : 'team_name_full',type : 'string'},
          {name : 'team_name_short',type : 'string'},
          {name : 'spirit',type : 'float'},
          {name : 'team_id',type : 'int'}
        ]
      }
  });

  var spiritRanking = new Ext.data.Store({
      model : 'SpiritRanking',        
      sorters : [
        {property : 'spirit',direction : 'DESC'},
        {property : 'team_name_full',direction : 'ASC'}
      ]      
  });

  var matches = Ext.getStore("Matches");
  var spirit = new Array();
  var teams = new Array();

  for(key in matches.data.all){
    var item = matches.data.all[key];
    if(!teams.hasOwnProperty(item.get("home_id"))) {
      teams[item.get("home_id")] = new Array(); 
      spirit[item.get("home_id")] = {team_name_full:item.get("home_name_full"),team_name_short:item.get("home_name_short"),spirit:0};
    }

    if(!teams.hasOwnProperty(item.get("away_id"))) {
      teams[item.get("away_id")] = new Array();
      spirit[item.get("away_id")] = {team_name_full:item.get("away_name_full"),team_name_short:item.get("away_name_short"),spirit:0};
    }
    
    if(item.get("spirit_home_all") != null) teams[item.get("home_id")][item.get("match_id")] = item.get("spirit_home");
    if(item.get("spirit_away_all") != null) teams[item.get("away_id")][item.get("match_id")] = item.get("spirit_away");
  };

  var celkem = 0;
  for(team_id in teams){
    spirit[team_id].spirit = 0;
    var i = 0;
    for(match_id in teams[team_id]){      
      spirit[team_id].spirit = spirit[team_id].spirit + teams[team_id][match_id];
      i = i + 1;
    }
    if(i>0){
      spirit[team_id].spirit = Math.round((spirit[team_id].spirit/i)*10000)/10000;
    }else{
      spirit[team_id].spirit = 0;
    }
    celkem = celkem + i;
  }

  var diff = matches.data.all.length*2 - celkem;
  if(diff>0){
    var msg = "Nejsou vyplněna všechna utkání.<br /> Zbývá zadat "+diff+" "+catcher.app.getController("Spirit").sklonuj(diff,"spiritů","spirit","spirity")
  }else{
    var msg = "Všechny spirity zadané.<br />Pokud existují všechny zápasy, je pořadí SotG.";
  }

  Ext.getCmp("spiritRanking").setMasked({
    xtype:"loadmask",
    message:msg,
    indicator:false
  });
  setTimeout(function(){
    Ext.getCmp("spiritRanking").setMasked(false);
  },3000);

  var spirit2push = new Array();
  for(team_id in spirit){
    spirit2push.push({
      spirit:spirit[team_id].spirit,
      team_name_full:spirit[team_id].team_name_full,
      team_name_short:spirit[team_id].team_name_short,
      team_id:team_id
    });
  }

  spiritRanking.setData(spirit2push);

  return spiritRanking;
}

function getUnfilledSpirit(){
  Ext.define("SpiritInspector", {
      extend : "Ext.data.Model",
      config : {
        fields : [
          {name : 'home_name_full',type : 'string'},
          {name : 'home_name_short',type : 'string'},
          {name : 'spirit_all',type : 'string'},
          {name : 'home_id',type : 'int'},
          {name : 'away_id',type : 'int'},
          {name : 'away_name_short',type : 'string'},
          {name : 'away_name_full',type : 'string'},
          {name : 'match_id',type : 'int'},          
          {name : 'spiritInspector',type : 'boolean'},
          {name: 'time', type: 'date', dateFormat: "timestamp", defaultValue: 1}
        ]
      }
  });

  var spiritInspector = new Ext.data.Store({
      model : 'SpiritInspector',        
      sorters : [
        {property : 'home_name_full',direction : 'ASC'},
        {property : 'time',direction : 'DESC'}
      ],
      grouper: {
        groupFn:function(record){
          return "Tým "+record.get("home_name_full");
        }
      }
  });

  var matches = Ext.getStore("Matches");
  var unfilledSpirit = new Array();

  for(key in matches.data.all){
    var item = matches.data.all[key];
    if(item.get("spirit_away_all") == null){
      unfilledSpirit.push({
          home_name_full:item.get("home_name_full"),
          home_name_short:item.get("home_name_short"),
          away_name_short:item.get("away_name_short"),
          away_name_full:item.get("away_name_full"),
          spirit_all:item.get("spirit_away_all"),
          match_id:item.get("match_id"),
          home_id:item.get("home_id"),
          spiritInspector:true,
          time:item.get("time")
      });
    }

    if(item.get("spirit_home_all") == null){
      unfilledSpirit.push({
          away_name_short:item.get("home_name_short"),
          away_name_full:item.get("home_name_full"),
          home_name_full:item.get("away_name_full"),
          home_name_short:item.get("away_name_short"),          
          match_id:item.get("match_id"),
          home_id:item.get("away_id"),
          spiritInspector:true,
          spirit_all:item.get("spirit_home_all"),          
          time:item.get("time")
      });
    }
  };

  spiritInspector.setData(unfilledSpirit);

  return spiritInspector;
}

function getTeamMatches(team_id) {
    Ext.define("SpiritView", {
        extend : "catcher.model.Match",
        config : {
            fields : [{
                name : 'spirit',
                type : 'int'
            }, {
                name : 'spirit_all',
                type : 'auto'
            }
            ]
        }
    });

    var spiritStore = new Ext.data.Store({
        model : 'SpiritView',        
        sorters : [ {
            property : 'time',
            direction : 'ASC'
        } ]
    });

    var matches = Ext.getStore("Matches");
    var session = getSession();

    var teamMatches = new Array();

    for(key in matches.data.all){
      var item = matches.data.all[key];
        if(item.get("home_id") == session.get("active_subteam") || item.get("away_id") == session.get("active_subteam")){
          var side = getSide(item,true);
          teamMatches.push({  
              spirit: item.get("spirit_"+side),
              spirit_all: item.get("spirit_"+side+"_all"),
              home_name_full: item.get("home_name_full"),
              away_name_full: item.get("away_name_full"),
              home_name_short: item.get("home_name_short"),
              away_name_short: item.get("away_name_short"),
              score_home:item.get("score_home"),
              score_away:item.get("score_away"),
              time:item.get("time"),
              match_id:item.get("match_id"),
              home_id:item.get("home_id"),
              away_id:item.get("away_id")
          });
        }
    };

    spiritStore.setData(teamMatches);

    return spiritStore;    
}

function getSide(match,reverse,active_subteam){
  if(typeof active_subteam == "undefined"){
    var session = getSession();
    active_subteam = session.get("active_subteam");
  }

  if(typeof reverse != "undefined" && reverse == true){
    if(match.get("home_id") == active_subteam) side = "away";
    if(match.get("away_id") == active_subteam) side = "home";
  }else{
    if(match.get("home_id") == active_subteam) side = "home";
    if(match.get("away_id") == active_subteam) side = "away";
  }  

  return side;
}