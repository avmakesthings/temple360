/* * * + + + + + + + + + + + + + + + + + + + + 
Temple360 - An A-frame web viewer for the design
& construction of the 2017 Burning Man temple
Author: Anastasia Victor
+ + + + + + + + + + + + + + + + + + + + * * */ 

require('aframe');
require('aframe-state-component');
require('aframe-text-geometry-component');
require('aframe-template-component');
require('aframe-layout-component');
require('aframe-animation-component');
require('aframe-dev-components');

require('./globals.js');
require('./materials.js');
require('./userInterface.js');

var isEqual = require('lodash.isequal');
var extras = require('aframe-extras'); //fix for A-frame GLtf 2.0 issues
extras.loaders.registerAll(); //Register 'A-frame extras' Loaders package and its dependencies.
var mainData = require('./mainData.js'); //Get JSON data 
var sceneEl = document.querySelector('a-scene'); //Scene element


function getState(event, key){
	return event.target.sceneEl.systems["state"].getState().app[key].toJSON()
}

var sessionStorageHistoryPlugin = {
	getHistoryArray: function() {
		return JSON.parse(sessionStorage.getItem('historyArray'));
	},
	peekLastEvent: function() {
		sessionStorageHistoryArray = JSON.parse(sessionStorage.getItem('historyArray')) || [];
		return sessionStorageHistoryArray.pop();
	},
	pushEvent: function(event) {
		var historyArray = sessionStorage.getItem('historyArray') ?
			JSON.parse(sessionStorage.getItem('historyArray')) : [];
		historyArray.push(event);
		sessionStorage.setItem('historyArray', JSON.stringify(historyArray));
	},
	clearHistory: function() {
		sessionStorage.clear();
	},
};

/* * * + + + + + + + + + + + + + + + + + + + + 
State manager --
+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerReducer('app', {
	initialState: {
		locations: mainData.locations,
		models: mainData.models,
		threeSixtyImages: mainData.threeSixtyImages,
		activeLocation: mainData.locations["origin"],
		activeDate: "2017-08-15",
		activeModel: {},
		activeThreeSixty: {},
		activeScene: {},
		history: sessionStorageHistoryPlugin,
	},

	handlers: {
		
		changeModels: function (state, action) {
			var models = action.models;
			state.models = models;
			console.log('modelsChanged',models)
			AFRAME.scenes[0].emit('modelsChanged', {models});
			return state;
		}, 

		changeThreeSixtyImages: function (state, action) {
			var threeSixtyImages = action.threeSixtyImages;
			state.threeSixtyImages = threeSixtyImages;
			console.log('threeSixtyImagesChanged',threeSixtyImages)
			AFRAME.scenes[0].emit('threeSixtyImagesChanged', {threeSixtyImages});
			return state;
		}, 

		changeLocations: function (state, action) {
			var locations = action.locations;
			state.locations = locations;
			console.log('locationsChanged', locations)
			AFRAME.scenes[0].emit('locationsChanged', {locations});
			return state;
		}, 

		changeActiveDate: function (state, action) {
			var activeDate = action.activeDate;
			state.activeDate = activeDate;
			console.log('activeDateChanged', activeDate)
			AFRAME.scenes[0].emit('activeDateChanged', {activeDate});
			this.initialState.history.pushEvent(action);
			return state;
		},  
		  
		changeActiveLocation: function (state, action) {
			var activeLocation = action.activeLocation;
			state.activeLocation = activeLocation;
			console.log('activeLocationChanged', activeLocation)
			AFRAME.scenes[0].emit('activeLocationChanged', {activeLocation});
			this.initialState.history.pushEvent(action);
			return state;
		},  
		changeActiveThreeSixty: function (state, action) {
			var activeThreeSixty = action.activeThreeSixty;
			state.activeThreeSixty = activeThreeSixty;
			console.log('activeThreeSixty', activeThreeSixty)
			AFRAME.scenes[0].emit('activeThreeSixtyChanged', {activeThreeSixty});
			this.initialState.history.pushEvent(action);
			return state;
		},  
		changeActiveModel: function (state, action) {
			var activeModel = action.activeModel;
			state.activeModel = activeModel;
			console.log('activeModelChanged', activeModel)
			AFRAME.scenes[0].emit('activeModelChanged', {activeModel});
			this.initialState.history.pushEvent(action);
			return state;
		},  
		changeActiveScene: function (state, action) {
			var activeScene = action.activeScene;
			state.activeScene = activeScene;
			console.log('activeSceneChanged', activeScene)
			AFRAME.scenes[0].emit('activeSceneChanged', {activeScene});
			this.initialState.history.pushEvent(action);
			return state;
		},  
	},
});

// Hack to ensure initial state gets published to components
window.onload = function() {
	document.querySelector('a-scene').addEventListener('loaded', function () {
		AFRAME.scenes[0].emit('changeModels', {
			models: mainData.models
		});

		AFRAME.scenes[0].emit('changeThreeSixtyImages', {
			threeSixtyImages: mainData.threeSixtyImages
		});

		AFRAME.scenes[0].emit('changeLocations', {
			locations: mainData.locations
		});

		AFRAME.scenes[0].emit('changeActiveLocation', {
			activeLocation: mainData.locations["southGate"]
		});

		AFRAME.scenes[0].emit('changeActiveDate', {
			activeDate: "2017-08-15"
		});

		AFRAME.scenes[0].emit('changeActiveThreeSixty', {
			activeThreeSixty: {} 
		});

		AFRAME.scenes[0].emit('changeActiveModel', {
			activeModel: {}
		});

		AFRAME.scenes[0].emit('changeActiveScene', {
			activeScene: 'sceneHome'
		});

	})
}


/* * * + + + + + + + + + + + + + + + + + + + + 
Scene Manager 
+ + + + + + + + + + + + + + + + + + + + * * */ 
AFRAME.registerComponent('scene-manager', {
	schema: {
		sceneHome: {type: 'asset', default: 'templates/scene_home.html'},
		scene360: {type: 'asset', default: 'templates/scene_360.html'},
		scene3DModel: {type: 'asset', default: 'templates/scene_model.html'}
	},
	init: function (){
		var self = this
		var el = this.el;
		window.addEventListener('activeSceneChanged',(e)=> {
			nextScene = e.detail.activeScene;
			self.setScene(nextScene)
		});
	}, 
	setScene: function(nextScene){
		var scene = document.querySelector('a-scene');
		var managers = document.getElementById('managers');
		var sceneTemplate = document.getElementById('scene-template');
		var currentTemplate = sceneTemplate.getAttribute('template').src;

		if(nextScene == 'sceneHome'){
			if(currentTemplate == this.data.scene3DModel){
				this.resetEnv('scene3DModel');
			}
			sceneTemplate.setAttribute('template', 'src:' + this.data.sceneHome);
			
		}if(nextScene == 'scene360'){
			if(currentTemplate == this.data.scene3DModel){
				this.resetEnv('scene3DModel');
			}
			sceneTemplate.setAttribute('template', 'src:' + this.data.scene360);

		}if(nextScene == 'scene3DModel'){
			if(currentTemplate == this.data.sceneHome){
				this.resetEnv('sceneHome');
			}
			sceneTemplate.setAttribute('template', 'src:' + this.data.scene3DModel);
		}
	},
	resetEnv: function(currentTemplate){
		var env;
		if (currentTemplate == 'scene3DModel'){
			var env = document.querySelector('#model-env') 
		}else{
			var env = document.querySelector('#home-env') 
		}
		env.setAttribute('environment', {active:false});
	}
});