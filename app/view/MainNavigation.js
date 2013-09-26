Ext.define("catcher.view.MainNavigation", {
    extend : "Ext.ActionSheet",
    xtype : "actionSheet",
    id : "actionSheet",
    requires : [ "Ext.Button" ],

    config : {
        defaults : {
            iconMask : true
        },
        showAnimation : false,
        hideAnimation : false,
        items : [
                {
                    text : 'Odhlásit z turnaje',
                    ui : 'decline',
                    iconCls : "power_on",
                    matchesList : true,
                    handler : function() {
                        Ext.Msg.confirm("Odhlášení", "Opravdu se chcete odhlásit?", function(response) {
                            if (response == "yes") {
                                // this.up("actionSheet").hide();
                                window.location.reload();
                            }
                        });
                    }
                },
                {
                    text : 'Přidat nové utkání',
                    iconCls : "add",
                    matchesList : true,
                    ui : "confirm",
                    handler : function() {
                        var editorPanel = Ext.getCmp("editorPanel") || new catcher.view.EditorPanel();
                        if (!editorPanel.getParent())
                            Ext.Viewport.add(editorPanel);

                        var formPanel = Ext.getCmp('editorPanel');
                        var tournament_id = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).get("tournament_id");
                        var tournament = Ext.getStore("Tournaments").findRecord("tournament_id", tournament_id, false, false, true);
                        var fields2push = catcher.app.getController("MatchController").composeSelect(tournament.get("fields"));
                        var skupiny2push = catcher.app.getController("MatchController").composeSelect(tournament.get("skupiny"), "skupina");
                        var teams = catcher.app.getController("Evidence").composeTeams();
                        var times = new Array;
                        for (i = 20; i < 95; i = i + 5) {
                            times.push({
                                text : i + " minut",
                                value : i
                            });
                        }

                        formPanel.query("selectfield[name=field]")[0].setOptions(fields2push);
                        formPanel.query("selectfield[name=skupina]")[0].setOptions(skupiny2push);
                        formPanel.query("selectfield[name=home_id]")[0].setOptions(teams);
                        formPanel.query("selectfield[name=away_id]")[0].setOptions(teams);
                        formPanel.query("selectfield[name=length]")[0].setOptions(times);
                        formPanel.setValues({
                            time : new Date()
                        });
                        this.up("actionSheet").hide();
                        editorPanel.show();
                    }
                },
                {
                    text : 'Parametry zápasu',
                    iconCls : "settings",
                    matchDetail : true,
                    handler : function() {
                        var matchDetailSettings = Ext.getCmp("matchDetailSettings") || new catcher.view.MatchDetailSettings();
                        if (!matchDetailSettings.getParent())
                            Ext.Viewport.add(matchDetailSettings);
                        matchDetailSettings.show();

                        var session = getSession();
                        var match = Ext.getStore("Matches").findRecord("match_id", session.match_id, false, false, false, true);

                        catcher.app.getController("MatchController").fillMatchDetailSettings(match);

                        this.up("actionSheet").hide();
                    }
                },
                {
                    text : 'Konec zápasu - čas, skóre a spirit',
                    iconCls : "check2",
                    matchDetail : true,
                    handler : function() {
                        var matchDetailScore = Ext.getCmp("matchDetailScore") || new catcher.view.MatchDetailScore();
                        if (!matchDetailScore.getParent())
                            Ext.Viewport.add(matchDetailScore);
                        matchDetailScore.show();

                        var session = getSession();
                        var match = Ext.getStore("Matches").findRecord("match_id", session.match_id, false, false, false, true);

                        catcher.app.getController("MatchController").fillMatchDetailScore(match);

                        this.up("actionSheet").hide();
                    }
                },
                {
                    text : 'Zobrazit neodehraná utkání',
                    iconCls : "time",
                    matchesList : true,
                    listFilter : true,
                    handler : function() {
                        Ext.getCmp("actionSheet").setFilters(this, "next", "Neodehraná utkání");
                    }
                },
                {
                    text : 'Zobrazit skončené zápasy',
                    iconCls : "calendar2",
                    listFilter : true,
                    matchesList : true,
                    handler : function() {
                        Ext.getCmp("actionSheet").setFilters(this, "past", "Již skončené zápasy");
                    }
                },
                {
                    text : 'Filtr týmu: žádný',
                    iconCls : "find",
                    id : "filtr",
                    matchesList : true,
                    handler : function() {
                        // Ext.getCmp("matchesNavigation").showInfo("all","Všechna utkání");
                        var modalPanel = Ext.getCmp("modalPanel") || new catcher.view.ModalPanel();
                        if (!modalPanel.getParent())
                            Ext.Viewport.add(modalPanel);
                        modalPanel.show();
                        modalPanel.removeAll();
                        var formular = Ext.create("Ext.form.Panel", {
                            items : [
                                    {
                                        xtype : "toolbar",
                                        docked : "top",
                                        title : "Filtr na tým",
                                        items : [
                                                {
                                                    xtype : "button",
                                                    align : "left",
                                                    text : "Zrušit",
                                                    ui : "decline",
                                                    handler : function() {
                                                        session.team_filter = 0;
                                                        var filtr = "žádný"
                                                        Ext.getCmp("matchesNavigation").showInfo("all", "Všechna utkání");
                                                        Ext.getCmp("actionSheet").query("button").forEach(function(el) {
                                                            if (el.config["listFilter"] == true)
                                                                el.setUi("");
                                                        });
                                                        Ext.getCmp("filtr").setText("Filtr týmu: " + filtr);
                                                        modalPanel.hide();
                                                    }
                                                },
                                                {
                                                    xtype : "spacer"
                                                },
                                                {
                                                    xtype : "button",
                                                    align : "right",
                                                    text : "Nastavit",
                                                    ui : "confirm",
                                                    handler : function() {
                                                        var data = formular.getValues();
                                                        var session = getSession();
                                                        session.team_filter = data.team;
                                                        if (session.team_filter > 0) {
                                                            var filtr = Ext.getStore("Teams").findRecord("team_id", data.team, false, false, false,
                                                                    true).get("name_full");
                                                            Ext.getCmp("matchesNavigation").showInfo("all", "Utkání týmu <br />" + filtr);
                                                        } else {
                                                            var filtr = "žádný"
                                                            Ext.getCmp("matchesNavigation").showInfo("all", "Všechna utkání");
                                                        }
                                                        Ext.getCmp("actionSheet").query("button").forEach(function(el) {
                                                            if (el.config["listFilter"] == true)
                                                                el.setUi("");
                                                        });
                                                        Ext.getCmp("filtr").setText("Filtr týmu: " + filtr);
                                                        modalPanel.hide();
                                                    }
                                                } ]
                                    }, {
                                        xtype : "selectfield",
                                        label : "Tým",
                                        name : "team",
                                        options : []
                                    } ]
                        });
                        modalPanel.add(formular);
                        modalPanel.setHeight("105px");
                        var data = Ext.getStore("Teams").data;
                        var teams2push = new Array;
                        teams2push.push({
                            text : "všechny týmy",
                            value : 0
                        })
                        data.each(function(record) {
                            teams2push.push({
                                text : record.get("name_full"),
                                value : record.get("team_id")
                            });
                        });
                        var session = getSession();
                        if (typeof session.team_filter == "undefined")
                            session.team_filter = 0;
                        modalPanel.query("selectfield[name=team]")[0].setOptions(teams2push).setValue(session.team_filter);
                        this.up("actionSheet").hide();
                    }
                },
                {
                    text : "Aktualizovat data ze serveru",
                    iconCls : "refresh",
                    // matchesList: true,
                    matchDetail : true,
                    // scoreList:true,
                    ui : "confirm",
                    handler : function() {
                        this.up("actionSheet").hide();
                        var matchList = Ext.getCmp("matchesList");
                        var scoreList = Ext.getCmp("scoreList");
                        var matchDetail = Ext.getCmp("matchDetail");
                        var points = Ext.getStore("Points");
                        points.sync();

                        var matches = Ext.getStore("Matches");
                        var match_id = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;

                        if (typeof matchList != 'undefined') {
                            matchList.getStore().load();
                            Ext.getStore("Points").load();
                        }

                        if (typeof scoreList != 'undefined') {
                            points.clearFilter();
                            var session = getSession();
                            points.load(function() {
                                catcher.app.getController("MatchController").getScoreList().setStore(
                                        getTeamScore(session.match_id, session.showScoreTeamId));
                            });
                        }

                        if (typeof match_id != 'undefined' && typeof matchDetail != 'undefined') {
                            Ext.Viewport.setMasked({
                                xtype : 'loadmask',
                                message : 'Aktualizuji data z www.frisbee.cz'
                            });
                            Ext.getStore("Points").sync();
                            matches.load(function() {
                                var match = matches.findRecord("match_id", match_id, false, false, false, true);
                                Ext.Viewport.setMasked(false);
                                catcher.app.getController("MatchController").fillMatchDetail(match);
                            });
                        }
                    }
                }, {
                    text : 'Zavřít menu',
                    ui : "action",
                    iconCls : "close",
                    margin : "1em 0em 0.5em 0em",
                    all : true,
                    handler : function() {
                        this.up("actionSheet").hide();
                    }
                } ]
    },

    setFilters : function(button, view, msg) {
        var ui = button.getUi();
        if (ui == "away") {
            ui = "";
            view = "all";
            msg = "Všechny zápasy";
        } else {
            ui = "away";
        }
        Ext.getCmp("actionSheet").query("button").forEach(function(el) {
            if (el.config["listFilter"] == true)
                el.setUi(false);
        });
        Ext.getCmp("matchesNavigation").showInfo(view, msg);
        button.setUi(ui);
        button.up("actionSheet").hide();
    }
});