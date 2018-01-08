/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 *
 * A-frame Model Menu Component
 */
var getState = require("../getState");

var mainData = require("./../mainData.js");
var moment = require("moment");

AFRAME.registerComponent("ui-menu-model", {
    schema: {
        menuHeight: { default: 1.2 },
        menuWidth: { default: 2.1 },
        menuDepth: { default: 0.3 },
        margin: { default: 0.0 },
        active: { default: false }
    },
    init: function() {
        this.activeDate = getState("activeDate");
        this.activeModel = getState("activeModel");

        this.setPosition();
        this.el.setAttribute("visible", false);
        this.createMenu();

        //menu toggle - TODO - add support for VR controller keypress
        window.addEventListener("showModelMenu", e => {
            var menuState = this.el.getAttribute("visible");

            if (window.globals.activateSound) {
                this.el.setAttribute("sound", {
                    src: menuState ? "#menu-close-audio" : "#menu-open-audio",
                    volume: "0.5"
                });
                this.el.components.sound.playSound();
            }

            this.setPosition();
            this.el.setAttribute("visible", !menuState);
        });

        var buildingEl = document.getElementById("building-model");
        buildingEl.addEventListener("model-loaded", () => {
            this.hideLoading();
        });
    },
    showLoading: function() {
        var el = document.getElementById("model-menu-container");
        el.object3D.children[1].material.opacity = 0.2;
    },
    hideLoading: function() {
        var el = document.getElementById("model-menu-container");
        el.object3D.children[1].material.opacity = 0.6;
    },
    setPosition: function() {
        var cam = document.getElementById("cameraRig");
        var head = document.getElementById("head");
        var camPos = cam.components.position.data;
        var headPos = head.components.position.data;
        var camRot = head.components.rotation.data;

        this.el.setAttribute("position", {
            x: camPos.x + headPos.x,
            y: camPos.y + headPos.y,
            z: camPos.z + headPos.z
        });

        this.el.setAttribute("rotation", {
            x: 0,
            y: camRot.y,
            z: 0
        });
    },
    createMenu: function() {
        const layout = document.createElement("a-entity");
        layout.setAttribute("id", "model-menu-container");
        layout.setAttribute("position", {
            x: 0,
            y: 0.2,
            z: -1.5
        });
        this.createMenuGeo(layout);

        const layoutUpper = document.createElement("a-entity");
        layoutUpper.setAttribute("id", "layout-upper");
        layoutUpper.setAttribute("position", {
            x: 0,
            y: 0.07,
            z: 0
        });
        const layoutLower = document.createElement("a-entity");
        layoutLower.setAttribute("id", "layout-lower");
        layoutLower.setAttribute("position", {
            x: 0,
            y: -0.45,
            z: 0
        });
        layout.appendChild(layoutUpper);
        layout.appendChild(layoutLower);

        //hack - need to add condition for dates that don't match model months. works with current data
        var activeDate = moment(this.activeDate).format("YYYY-MM-DD");
        var day = moment(activeDate).format("DD");
        var monthYear = moment(activeDate).format("YYYY-MM");
        if (day !== "01") {
            activeDate = monthYear + "-01";
        }
        var preHeadingText = moment(activeDate).format("MM/DD/YYYY");
        var headingText = mainData.models[activeDate].title;
        var descriptionText = mainData.models[activeDate].description;

        const timeline = this.createTimelinePanel(layoutUpper);
        const info = this.createInfoPanel(
            layoutUpper,
            preHeadingText,
            headingText,
            descriptionText
        );
        const nav = this.createNavPanel(layoutLower);

        //add positioning logic
        timeline.setAttribute("position", {
            x: -0.556,
            y: 0,
            z: -0.126
        });
        info.setAttribute("position", {
            x: 0.149,
            y: -0.039,
            z: -0.032
        });

        this.el.appendChild(layout);

        window.addEventListener("activeDateChanged", e => {
            var activeScene = getState("activeScene");
            if (activeScene === "scene3DModel") {
                var activeDate = moment(e.detail.activeDate).format(
                    "YYYY-MM-DD"
                );
                var preHeadingText = moment(activeDate).format("MM/DD/YYYY");
                var headingText = mainData.models[activeDate].title;
                var descriptionText = mainData.models[activeDate].description;
                this.updateInfoPanel(
                    info,
                    preHeadingText,
                    headingText,
                    descriptionText
                );
            }
        });
    },
    createMenuGeo: function(el) {
        data = this.data;
        globals.createWireframeBox(
            el,
            data.menuHeight,
            data.menuWidth,
            data.menuDepth
        );
        globals.createMeshPlaneFill(
            el,
            data.menuHeight,
            data.menuWidth,
            data.menuDepth
        );
    },
    createTimelinePanel: function(el) {
        var timeline = document.createElement("a-entity");
        timeline.setAttribute("id", "timeline");
        timeline.setAttribute("ui-panel-timeline", {
            timelineData: JSON.stringify(mainData.models),
            timeScales: ["year", "month"],
            componentTitle: "timeline",
            active: true
        });
        timeline.clickHandler = e => {
            this.showLoading();
            this.el.emit("changeActiveDate", {
                activeDate: moment(e.key).format("YYYY-MM-DD")
            });
            this.el.emit("changeActiveModel", {
                activeModel: e.children.source
            });
        };
        el.appendChild(timeline);
        return timeline;
    },
    createInfoPanel: function(el, preHeading, title, description) {
        var info = document.createElement("a-entity");
        info.setAttribute("id", "info");
        info.setAttribute("ui-panel-info", {
            preHeadingVal: preHeading,
            headingVal: title,
            descriptionVal: description
        });
        el.appendChild(info);
        return info;
    },
    updateInfoPanel: function(el, preHeading, title, description = "...") {
        var preHeadingEl = el.querySelector("#preHeading");
        preHeadingEl.setAttribute("text", { value: preHeading });
        var headingEl = el.querySelector("#heading");
        headingEl.setAttribute("text", { value: title });
        var descripEl = el.querySelector("#description");
        descripEl.setAttribute("text", { value: description });
    },
    removeInfoPanel: function() {
        var info = document.getElementById("info");
        info.parentNode.removeChild(info);
    },
    createNavPanel: function(el) {
        var navPanel = document.createElement("a-entity");

        var homeButton = document.createElement("a-entity");
        homeButton.setAttribute("ui-button", {
            value: "home",
            height: 0.1,
            width: 0.2,
            depth: 0.1,
            mixin: "text-button-2"
        });
        homeButton.setAttribute("position", {
            x: 0.5
        });
        homeButton.clickHandler = e => {
            this.el.emit("changeActiveScene", {
                activeScene: "sceneHome"
            });
        };
        navPanel.appendChild(homeButton);

        el.appendChild(navPanel);
        return navPanel;
    }
});
