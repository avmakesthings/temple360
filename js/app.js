/* * * + + + + + + + + + + + + + + + + + + + + 
Temple360 - An A-frame web viewer for the design
& construction of the 2017 Burning Man temple
Author: AV
+ + + + + + + + + + + + + + + + + + + + * * */ 

require('aframe');
require('aframe-state-component');
require('./materials.js');
require('./UIcomponents.js');

var isEqual = require('lodash.isequal');
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
		activeDate: mainData.dates["1477958400"],
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
			activeDate: mainData.dates["Tue Aug 15 2017 17:00:00 GMT-0700 (PDT)"]
		});

		AFRAME.scenes[0].emit('changeActiveModel', {
			activeModel: {}
		});
	})
}



/* * * + + + + + + + + + + + + + + + + + + + + 
Nav Manager
+ + + + + + + + + + + + + + + + + + + + * * */ 
//creates & locates nav-pt-marker objects, moves camera on location change
AFRAME.registerComponent('nav-manager', {
	schema: {},
	init: function (){
		var el = this.el;
		var i =0;

		//create nav markers
		document.querySelector('a-scene').addEventListener('loaded', function () {
			for (var location in mainData.locations){
				var thisLocation = mainData.locations[location];
				var thisMarker = document.createElement('a-entity');

				thisMarker.setAttribute('position', thisLocation.coord);
				thisMarker.setAttribute('id', "marker-" + location);

				thisMarker.setAttribute('ui-nav-pt-marker', {
					location: JSON.stringify(thisLocation)
				});
				// thisMarker.setAttribute('ui-nav-pt-base', {
				// 	location: JSON.stringify(thisLocation)
				// });
				el.appendChild(thisMarker); //add them to the scene
				i++;

				//change camera position when new location is selected
				this.activeCamera = document.querySelector('a-camera');	
				window.addEventListener('activeLocationChanged', (e)=>{
					var l = e.detail.activeLocation.coord;
					this.activeCamera.setAttribute("position",{
						x: l.x, y: l.y+1.7, z: l.z
					});
				});

			}
			//A-frame debug tools
			document.querySelector('a-entity[ui-nav-pt-marker]').flushToDOM();
		})
	},
});



/* * * + + + + + + + + + + + + + + + + + + + + 
Model manager
+ + + + + + + + + + + + + + + + + + + + * * */ 

//Changes the model being viewed based on date change state
AFRAME.registerComponent('model-viewer', {
	schema: {},
	init: function (){
	}
});


//Changes the 360s that are loaded viewed based location state
AFRAME.registerComponent('360-viewer', {
	schema: {},
	init: function (){
	}
});



/* * * + + + + + + + + + + + + + + + + + + + + 
Tests
+ + + + + + + + + + + + + + + + + + + + * * */ 
//Test location change -is event emitted by app?
//is data is available from the event? 
// AFRAME.registerComponent('test-location-change', {
// 	schema: {},
// 	init: function (){
// 		window.addEventListener('activeLocationChanged', function (event) {
// 			console.log(
// 				"Test responding to activeLocationChanged in JS",
// 				event.detail.activeLocation
// 			);
// 		});
// 	}
// });


// Test to location change on click event
// AFRAME.registerComponent('change-location', {
// 	schema: {},
// 	init: function (){
// 		var el = this.el;
// 		var location1 = mainData.locations.ns2;
// 		var location2 = mainData.locations.ns5;
// 		var activeLocation = location1;
// 		el.addEventListener('click', function () {
// 			el.emit('changeActiveLocation', {activeLocation});
// 			if(activeLocation == location1){
// 				activeLocation = location2;
// 			}else{
// 				activeLocation = location1;
// 			}
// 		});
// 	}
// });


//Test date change
AFRAME.registerComponent('test-date-change', {
	schema: {},
	init: function (){
		window.addEventListener('activeDateChanged', function (event) {
			console.log(
				"Test responding to activeDateChanged in JS",
				event.detail.activeDate
			);
		});
	}
});

//Test date change on-click event
AFRAME.registerComponent('change-date', {
	schema: {},
	init: function (){
		var el = this.el;
		var activeDate;
		
		//initialize to the correct date
		window.addEventListener('activeDateChanged', (e)=>{
			activeDate = e.detail.activeDate;
		});
		//if clicked emit a change active date event
		el.addEventListener('click', function () {
			el.emit('changeActiveDate', {activeDate});
		});
	}
});