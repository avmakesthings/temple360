/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * @author JohnFaichney/ http://github.com/johnvf
 * @author DavidLu/ http://github.com/daveeloo
 *
 * Temple360 - An A-frame web viewer for the design
 * & construction of the 2017 Burning Man temple
 */

require("aframe");
require("aframe-teleport-controls");
require("aframe-auto-detect-controllers-component");
require("aframe-state-component");
require("aframe-text-geometry-component");
require("aframe-template-component");
require("aframe-layout-component");
require("aframe-animation-component");
require("aframe-dev-components");
require("aframe-look-at-component");
require("aframe-rain");

require("./globals.js");
require("./renderers.js");
require("./ui_manager.js");

var isEqual = require("lodash.isequal");
var extras = require("aframe-extras"); //fix for A-frame GLtf 2.0 issues
extras.loaders.registerAll(); //Register 'A-frame extras' Loaders package and its dependencies.
var mainData = require("./mainData.js"); //Get JSON data
var sceneEl = document.querySelector("a-scene"); //Scene element
var getState = require("./getState.js");

/* * * + + + + + + + + + + + + + + + + + + + + 
History manager --
+ + + + + + + + + + + + + + + + + + + + * * */

var sessionStorageHistoryPlugin = {
    getHistoryArray: function() {
        return JSON.parse(sessionStorage.getItem("historyArray"));
    },
    peekLastEvent: function() {
        sessionStorageHistoryArray =
            JSON.parse(sessionStorage.getItem("historyArray")) || [];
        return sessionStorageHistoryArray.pop();
    },
    pushEvent: function(event) {
        var historyArray = sessionStorage.getItem("historyArray")
            ? JSON.parse(sessionStorage.getItem("historyArray"))
            : [];
        historyArray.push(event);
        // FIXME: Temporarily commented out:
        // Consider circular-safe JSON stringify?
        // sessionStorage.setItem('historyArray', JSON.stringify(historyArray));
    },
    clearHistory: function() {
        sessionStorage.clear();
    }
};

/* * * + + + + + + + + + + + + + + + + + + + + 
State manager --
+ + + + + + + + + + + + + + + + + + + + * * */

AFRAME.registerReducer("app", {
    initialState: {
        locations: mainData.locations,
        models: mainData.models,
        threeSixtyImages: mainData.threeSixtyImages,
        activeLocation: "origin",
        activeDate: "2017-08-18",
        activeModel: {},
        activeThreeSixty: {},
        activeScene: {},
        history: sessionStorageHistoryPlugin
    },

    handlers: {
        changeModels: function(state, action) {
            var models = action.models;
            state.models = models;
            console.log("modelsChanged", models);
            AFRAME.scenes[0].emit("modelsChanged", { models });
            return state;
        },

        changeThreeSixtyImages: function(state, action) {
            var threeSixtyImages = action.threeSixtyImages;
            state.threeSixtyImages = threeSixtyImages;
            console.log("threeSixtyImagesChanged", threeSixtyImages);
            AFRAME.scenes[0].emit("threeSixtyImagesChanged", {
                threeSixtyImages
            });
            return state;
        },

        changeLocations: function(state, action) {
            var locations = action.locations;
            state.locations = locations;
            console.log("locationsChanged", locations);
            AFRAME.scenes[0].emit("locationsChanged", { locations });
            return state;
        },

        changeActiveDate: function(state, action) {
            var activeDate = action.activeDate;
            state.activeDate = activeDate;
            console.log("activeDateChanged", activeDate);
            AFRAME.scenes[0].emit("activeDateChanged", { activeDate });
            this.initialState.history.pushEvent(action);
            return state;
        },

        changeActiveLocation: function(state, action) {
            var activeLocation = action.activeLocation;
            state.activeLocation = activeLocation;
            console.log("activeLocationChanged", activeLocation);
            AFRAME.scenes[0].emit("activeLocationChanged", { activeLocation });
            this.initialState.history.pushEvent(action);
            return state;
        },

        changeActiveThreeSixty: function(state, action) {
            var activeThreeSixty = action.activeThreeSixty;
            state.activeThreeSixty = activeThreeSixty;
            console.log("activeThreeSixtyChanged", activeThreeSixty);
            AFRAME.scenes[0].emit("activeThreeSixtyChanged", {
                activeThreeSixty
            });
            this.initialState.history.pushEvent(action);
            return state;
        },
        changeActiveModel: function(state, action) {
            var activeModel = action.activeModel;
            state.activeModel = activeModel;
            console.log("activeModelChanged", activeModel);
            AFRAME.scenes[0].emit("activeModelChanged", { activeModel });
            this.initialState.history.pushEvent(action);
            return state;
        },
        changeActiveScene: function(state, action) {
            var activeScene = action.activeScene;
            state.activeScene = activeScene;
            console.log("activeSceneChanged", activeScene);
            AFRAME.scenes[0].emit("activeSceneChanged", { activeScene });
            this.initialState.history.pushEvent(action);
            return state;
        }
    }
});

// Hack to ensure initial state gets published to components
window.onload = function() {
    document.querySelector("a-scene").addEventListener("loaded", function() {
        AFRAME.scenes[0].emit("changeModels", {
            models: mainData.models
        });

        AFRAME.scenes[0].emit("changeThreeSixtyImages", {
            threeSixtyImages: mainData.threeSixtyImages
        });

        AFRAME.scenes[0].emit("changeLocations", {
            locations: mainData.locations
        });

        AFRAME.scenes[0].emit("changeActiveLocation", {
            activeLocation: "southGate"
        });

        // AFRAME.scenes[0].emit('changeActiveDate', {
        // 	activeDate: "2017-08-01"
        // });

        // AFRAME.scenes[0].emit('changeActiveThreeSixty', {
        // 	activeThreeSixty: {}
        // });

        // AFRAME.scenes[0].emit('changeActiveModel', {
        // 	activeModel: "17-08-temple.gltf"
        // });

        AFRAME.scenes[0].emit("changeActiveScene", {
            activeScene: "sceneHome"
        });
    });
};

// Change active model
window.addEventListener("activeModelChanged", function(event) {
    var thisModel = document.querySelector("#building-model");
    var nextModelPath = event.detail.activeModel;
    console.log("about to change model");
    if (nextModelPath) {
        thisModel.setAttribute(
            "gltf-model",
            "url(./assets/" + nextModelPath + ")"
        );
        // thisModelOpaque.setAttribute('gltf-model', "url(./assets/" + nextModelPath + ")");
    }
});

/* * * + + + + + + + + + + + + + + + + + + + + 
Scene Manager 

+ + + + + + + + + + + + + + + + + + + + * * */

AFRAME.registerComponent("scene-manager", {
    schema: {
        sceneHome: { type: "asset", default: "templates/scene_home.html" },
        scene360: { type: "asset", default: "templates/scene_360.html" },
        scene3DModel: { type: "asset", default: "templates/scene_model.html" }
    },
    init: function() {
        var self = this;
        var el = this.el;
        window.addEventListener("activeSceneChanged", e => {
            nextScene = e.detail.activeScene;
            self.setScene(nextScene);
        });
        window.addEventListener("activeThreeSixtyChanged", e => {
            next360 = `assets/${e.detail.activeThreeSixty.source}`;
            const phiStart = e.detail.activeThreeSixty.phiStart;
            this.change360(next360, phiStart);
        });
    },
    setScene: function(nextScene) {
        var scene = document.querySelector("a-scene");
        var managers = document.getElementById("managers");
        var sceneTemplate = document.getElementById("scene-template");
        var currentTemplate = sceneTemplate.getAttribute("template").src;

        if (nextScene == "sceneHome") {
            if (currentTemplate == this.data.scene3DModel) {
                this.resetEnv("scene3DModel");
            }
            sceneTemplate.setAttribute(
                "template",
                "src:" + this.data.sceneHome
            );

            this.setCameraPos({ x: 0, z: 0 });

            if (window.globals.activateAmbient) {
                var entity = document.getElementById("envAudio");
                entity.components.sound.stopSound();
                entity.setAttribute("sound", "src: #home-audio; volume: 0.5;");
                entity.components.sound.playSound();
            }
        }
        if (nextScene == "scene360") {
            if (currentTemplate == this.data.scene3DModel) {
                this.resetEnv("scene3DModel");
            }
            sceneTemplate.setAttribute("template", "src:" + this.data.scene360);

            setTimeout(() => {
                const activeThreeSixty = getState("activeThreeSixty");
                next360 = `assets/${activeThreeSixty.source}`;
                const phiStart = activeThreeSixty.phiStart;
                this.set360(next360, phiStart);
            }, 0);
            // this.setCameraPos(new THREE.Vector3(0,1.6,0))
        }
        if (nextScene == "scene3DModel") {
            if (currentTemplate == this.data.sceneHome) {
                this.resetEnv("sceneHome");

                if (window.globals.activateAmbient) {
                    var entity = document.getElementById("envAudio");
                    entity.components.sound.stopSound();
                    entity.setAttribute(
                        "sound",
                        "src: #model-audio; volume: 0.5;"
                    );
                    entity.components.sound.playSound();
                }

                this.setCameraPos({ x: 0, z: 40 });
            }
            sceneTemplate.setAttribute(
                "template",
                "src:" + this.data.scene3DModel
            );
        }
    },
    resetEnv: function(currentTemplate) {
        var env;
        if (currentTemplate == "scene3DModel") {
            var env = document.querySelector("#model-env");
        } else {
            var env = document.querySelector("#home-env");
        }
        env.setAttribute("environment", { active: false });
    },
    // Accepts any partial positionChange argument:  {x:#, y:#, z:#},  {x:#, z:#},  {x:#} etc...
    setCameraPos: function(positionChange) {
        const cameraEl = document.getElementById("cameraRig");
        const cameraPosition = cameraEl.getAttribute("position");
        const nextPosition = Object.assign({}, cameraPosition, positionChange);
        cameraEl.setAttribute("position", nextPosition);
    },
    set360: function(image, phiStart) {
        var sky = document.querySelector("a-sky");
        if (!sky) {
            sky = document.createElement("a-sky");
        }

        var sceneEl = document.querySelector("a-scene");

        sky.setAttribute("src", image);
        sky.setAttribute("phi-start", phiStart);
        this.el.appendChild(sky);
    },
    remove360: function() {
        var sky = document.querySelector("a-sky");
        sky.parentNode.removeChild(sky);
    },
    change360: function(image, phiStart) {
        var sky = document.querySelector("a-sky");
        sky.setAttribute("src", image);
        sky.setAttribute("phi-start", phiStart);
    }
});
