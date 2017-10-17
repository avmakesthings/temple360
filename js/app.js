/* * * + + + + + + + + + + + + + + + + + + + + 
Temple360 - An A-frame web viewer for the design
& construction of the 2017 Burning Man temple
Author: AV
+ + + + + + + + + + + + + + + + + + + + * * */ 

require('aframe');
require('aframe-state-component');
require('aframe-text-geometry-component');
require('./materials.js');
require('./UIcomponents.js');

var isEqual = require('lodash.isequal');
var moment = require('moment');
var extras = require('aframe-extras'); //fix for A-frame GLtf 2.0 issues
extras.loaders.registerAll(); //Register 'A-frame extras' Loaders package and its dependencies.
var mainData = require('./mainData.js'); //Get JSON data 
var sceneEl = document.querySelector('a-scene'); //Scene element


function getState(event, key){
	return event.target.sceneEl.systems["state"].getState().app[key].toJSON()
}


/* * * + + + + + + + + + + + + + + + + + + + + 
State manager --
Based on K-frame Redux 'State' component  
+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerReducer('app', {
	initialState: {
		locations: mainData.locations,
		dates: mainData.dates,
		activeLocation: mainData.locations["00"],
		activeDate: mainData.dates["2016-11-01"],
		activeModel: {}
	},

	handlers: {
		
		changeDates: function (state, action) {
			var dates = action.dates;
			state.dates = dates;
			console.log('datesChanged',dates)
			AFRAME.scenes[0].emit('datesChanged', {dates});
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
			return state;
		},  
		  
		changeActiveLocation: function (state, action) {
			var activeLocation = action.activeLocation;
			state.activeLocation = activeLocation;
			console.log('activeLocationChanged', activeLocation)
			AFRAME.scenes[0].emit('activeLocationChanged', {activeLocation});
			return state;
		},  

		changeActiveModel: function (state, action) {
			var activeModel = action.activeModel;
			state.activeModel = activeModel;
			console.log('activeModelChanged', activeModel)
			AFRAME.scenes[0].emit('activeModelChanged', {activeModel});
			return state;
		},  
		changeActiveScene: function (state, action) {
			var activeScene = action.activeScene;
			state.activeScene = activeScene;
			console.log('activeSceneChanged', activeScene)
			AFRAME.scenes[0].emit('activeSceneChanged', {activeScene});
			return state;
		},  
	},
});

// Hack to ensure initial state gets published to components
window.onload = function() {
	document.querySelector('a-scene').addEventListener('loaded', function () {
		AFRAME.scenes[0].emit('changeLocations', {
			locations: mainData.locations
		});

		AFRAME.scenes[0].emit('changeDates', {
			dates: mainData.dates
		});

		AFRAME.scenes[0].emit('changeActiveLocation', {
			activeLocation: mainData.locations["00"]
		});

		AFRAME.scenes[0].emit('changeActiveDate', {
			activeDate: mainData.dates["2016-11-01"]
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
Scene Manager - currently not working for
scenes with a-sky 360 images
+ + + + + + + + + + + + + + + + + + + + * * */ 
AFRAME.registerComponent('scene-manager', {
	schema: {
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
		var sceneHome = document.getElementById('sceneHome');
		var scene360 = document.getElementById('scene360');
		var scene3DModel = document.getElementById('scene3DModel');	
		
		//stupid version of swapping logic
		if(nextScene == 'sceneHome'){
			scene360.setAttribute('visible', 'false');
			scene3DModel.setAttribute('visible', 'false');
			sceneHome.setAttribute('visible', 'true');
		}if(nextScene == 'scene360'){
			sceneHome.setAttribute('visible', 'false');
			scene3DModel.setAttribute('visible', 'false');
			scene360.setAttribute('visible', 'true');
		}if(nextScene == 'scene3DModel'){
			sceneHome.setAttribute('visible', 'false');
			scene360.setAttribute('visible', 'false');
			scene3DModel.setAttribute('visible', 'true');
		}
	}
});


/* * * + + + + + + + + + + + + + + + + + + + + 
Nav Manager : creates & locates nav-pt-marker 
objects, moves camera on location change
+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerComponent('nav-manager', {
	schema: {},
	init: function (){
		var el = this.el;

		//create nav markers
		document.querySelector('a-scene').addEventListener('loaded', function () {
			
			var navMarkers = document.createElement('a-entity');
			navMarkers.setAttribute('id', "teleport-markers");
			
			for (var location in mainData.locations){
				var thisLocation = mainData.locations[location];
				var thisMarker = document.createElement('a-entity');

				thisMarker.setAttribute('position', thisLocation.coord);
				thisMarker.setAttribute('id', "marker-" + location);
				thisMarker.setAttribute('ui-nav-pt-marker', {
					location: JSON.stringify(thisLocation)
				});
				navMarkers.appendChild(thisMarker); //add to the scene

				//change camera position when new location is selected
				this.activeCamera = document.querySelector('a-camera');	
				window.addEventListener('activeLocationChanged', (e)=>{
					var l = e.detail.activeLocation.coord;
					this.activeCamera.setAttribute("position",{
						x: l.x, y: l.y+1.7, z: l.z
					});
				});

			}
			el.appendChild(navMarkers); 
			//A-frame debug tools
			document.querySelector('a-entity[ui-nav-pt-marker]').flushToDOM();
		})
	},
});


/* * * + + + + + + + + + + + + + + + + + + + + 
Timeline manager :: Changes the model being viewed based on date change state
+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerComponent('timeline-manager', {
	schema: {},
	init: function (){
		var el = this.el;

		document.querySelector('a-scene').addEventListener('loaded', function () {
			var myScene = document.querySelector('a-scene');
			var thisModel = myScene.querySelector("#loaded-model");
			var thisModelOpaque = myScene.querySelector("#loaded-model-opaque");
			var basePosition = {x:-0.3, y:1.5,z:-1};
			var timeline = document.createElement('a-entity');
			timeline.setAttribute('id',"timeline");

			
			for(var date in mainData.dates){
				//console.log(moment(date));
				var thisDate = mainData.dates[date];
				if(thisDate[0].type == "model"){
					
					//create markers
					var tMarker = document.createElement('a-entity');
					tMarker.setAttribute('position', basePosition);
					tMarker.setAttribute('id', moment(date)._d);

					//create marker geometry
					var tGeometry = document.createElement('a-entity');	
					tGeometry.setAttribute('id', "t-mesh");
					tGeometry.setAttribute('ui-time-mark', {
						date: JSON.stringify(thisDate)
					});
					
					//create text labels
					var tText = document.createElement('a-entity');
					tText.setAttribute('id', "t-label");
					tText.setAttribute('ui-time-text', {
						date: JSON.stringify(thisDate),
						textposition: basePosition
					});
					
					tMarker.appendChild(tGeometry);
					tMarker.appendChild(tText);					
					timeline.appendChild(tMarker);
					el.appendChild(timeline); //add to the scene
					basePosition.x += 0.06;

					//document.querySelector('a-entity[ui-time-mark]').flushToDOM();
				}
			}
			
			window.addEventListener('activeDateChanged', function (event) {
				var nextModelPath = event.detail.activeDate[0].source;
				if(nextModelPath){
					thisModel.setAttribute('gltf-model', "url(./assets/" + nextModelPath + ")");
					thisModelOpaque.setAttribute('gltf-model', "url(./assets/" + nextModelPath + ")");
				}
			});
		});
	},
});



/* * * + + + + + + + + + + + + + + + + + + + + 
Tests
+ + + + + + + + + + + + + + + + + + + + * * */ 

//Add basic ui buttons to test scene toggle
AFRAME.registerComponent('test-manager', {
	schema: {
		activeModel: {default:'model'}
	},
	init: function (){
		var el = this.el;
		document.querySelector('a-scene').addEventListener('loaded', function () {
			
			var sceneEl = document.querySelector('a-scene');
			var bgContainer = document.createElement('a-entity');

			bgContainer.setAttribute('view-toggle-test', {
				activeButton: 'this'
			});
			bgContainer.setAttribute('id',"view-toggle");
			el.appendChild(bgContainer);
		});
	}

});