/* * * + + + + + + + + + + + + + + + + + + + + 
Temple360 - An A-frame web viewer for the design
& construction of the 2017 Burning Man temple
Author: AV
+ + + + + + + + + + + + + + + + + + + + * * */ 

require('aframe');
require('aframe-state-component');
require('./materials.js');
require('./UIcomponents.js');
require('./manager.js');

var isEqual = require('lodash.isequal');
var extras = require('aframe-extras'); //fix for A-frame GLtf 2.0 issues
extras.loaders.registerAll(); //Register 'A-frame extras' Loaders package and its dependencies.
var mainData = require('./mainData.js'); //Get JSON data 
var sceneEl = document.querySelector('a-scene'); //Scene element

function getState(event, key){
	return event.target.sceneEl.systems["state"].getState().app[key].toJSON()
}

/* * * + + + + + + + + + + + + + + + + + + + + 
State management --
Based on K-frame Redux 'State' component  
https://github.com/ngokevin/kframe/tree/master/components/state
+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerReducer('app', {
	initialState: {
		locations: mainData.locations,
		dates: mainData.dates,
		activeLocation: mainData.locations.origin,
		activeDate: mainData.dates["Tue Aug 15 2017 17:00:00 GMT-0700 (PDT)"],
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
			activeLocation: mainData.locations.origin
		});

		AFRAME.scenes[0].emit('changeActiveDate', {
			activeDate: mainData.dates["Tue Aug 15 2017 17:00:00 GMT-0700 (PDT)"]
		});

		AFRAME.scenes[0].emit('changeActiveModel', {
			activeModel: {}
		});
	})
}


// Test to change location
AFRAME.registerComponent('change-location', {
	schema: {},
	init: function (){
		var el = this.el;
		var location1 = mainData.locations.ns2;
		var location2 = mainData.locations.ns5;
		var activeLocation = location1;
		el.addEventListener('click', function () {
			el.emit('changeActiveLocation', {activeLocation});
			if(activeLocation == location1){
				activeLocation = location2;
			}else{
				activeLocation = location1;
			}
		});
	}
});


//Test to see whether location change event has been emitted by app and
//if data is available from the event 
AFRAME.registerComponent('test-location-change', {
	schema: {},
	init: function (){
		window.addEventListener('activeLocationChanged', function (event) {
			console.log(
				"Test responding to activeLocationChanged in JS",
				event.detail.activeLocation
			);
		});
	}
});



/* * * + + + + + + + + + + + + + + + + + + + + 
Environment / view components
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
