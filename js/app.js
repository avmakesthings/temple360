/* * * + + + + + + + + + + + + + + + + + + + + 
Temple360 - An A-frame web viewer for the design
& construction of the 2017 Burning Man temple
Author: AV
+ + + + + + + + + + + + + + + + + + + + * * */ 

require('aframe');
require('aframe-state-component');
var isEqual = require('lodash.isequal');

var extras = require('aframe-extras'); //fix for A-frame GLtf 2.0 issues
// Register 'A-frame extras' Loaders package and its dependencies.
extras.loaders.registerAll();

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
		activeDate: mainData.dates["Tue Aug 15 2017 17:00:00 GMT-0700 (PDT)"]
	},

	handlers: {
		
		//change state when date event is emited
		changeActiveDate: function (state,nextDate) {
			//lookup key for nextDate
			state.activeDate = mainData.dates[key];

			return state;
	  	},
		  
		changeActiveLocation: function (state,nextLocation) {
			state.activeLocation = nextLocation;
			//emit custom event that has broadcasts which state has changed and includes location change data
			AFRAME.scenes[0].emit('activeLocationHasChanged', {locationData: state.activeLocation});
			return state;
		}  
	},
});


// Helper to print state
AFRAME.registerComponent('print-state', {
	init: function (){
		this.state = {
			activeLocation: {}
		}
		window.addEventListener("statechanged", this.stateChanged.bind(this));
	},

	stateChanged: function(event){
		var nextActiveLocation = getState(event, "activeLocation");

		// If the state that we care about changed, do something
		if (!isEqual(this.state.activeLocation, nextActiveLocation)){
			//console.log("activeLocationCopy before state change", this.state.activeLocation);
			this.state.activeLocation = nextActiveLocation;
			//console.log("activeLocationCopy after state change", this.state.activeLocation);
			// Update the threejs geometry based on this new data here...
		}
	}
});

// Test to change location
AFRAME.registerComponent('change-location', {
	schema: {},
	init: function (){
		var el = this.el;
		var location1 = mainData.locations.ns2;
		var location2 = mainData.locations.ns5;
		var location = location1;
		el.addEventListener('click', function () {
			el.sceneEl.emit('changeActiveLocation',location);
			if(location == location1){
				location = location2;
			}else{
				location = location1;
			}
		});
	}
});

//Test to see whether location change event has been emitted by app and
//if data is available from the event 
AFRAME.registerComponent('test-location-change', {
	schema: {},
	init: function (){
		window.addEventListener('activeLocationHasChanged', function () {
			console.log(event.detail.locationData.description);
		});
	}
});

/* * * + + + + + + + + + + + + + + + + + + + + 
Navigation
+ + + + + + + + + + + + + + + + + + + + * * */ 

//create navigation-point-marker objects for each location

AFRAME.registerComponent('nav-markers', {
	schema: {},
	init: function (){
		var el = this.el;
		var i =0;
		document.querySelector('a-scene').addEventListener('loaded', function () {
			for (var location in mainData.locations){
				var thisLocation = mainData.locations[location];
				var thisMarker = document.createElement('a-entity');
				
				thisMarker.setAttribute('id', "marker-" + location);
				thisMarker.setAttribute('position', thisLocation.coord);
				thisMarker.setAttribute('description', thisLocation.description);
				thisMarker.setAttribute('ui-nav-pt-marker');
				
				//test geometry
				thisMarker.setAttribute('geometry', {
					primitive: 'box',
					height: .5,
					width: .5,
					depth: .5
				  });

				el.appendChild(thisMarker); //add them to the scene

				console.log(el);
				i++;
			}
		})		
	}
});


//set active marker

//change active marker 

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



/* * * + + + + + + + + + + + + + + + + + + + + 
UI Components
+ + + + + + + + + + + + + + + + + + + + * * */   

//UI component to indicate where a user can teleport within the scene.
AFRAME.registerComponent('ui-nav-pt-marker', {
	schema: {
		collider: {type: 'asset'},	
		activated: {type: 'boolean', default: false},
		mesh: {type: 'asset'}
	},
	init: function (){
		//when activated do this

	}
});  


//UI component to display a range of dates
AFRAME.registerComponent('ui-timeline', {
	schema: {},
	init: function (){
	}
});


//UI component that displays a top model view and the location of navigation markers
AFRAME.registerComponent('ui-navigation-map', {
	schema: {},
	init: function (){
	}
});  


/* * * + + + + + + + + + + + + + + + + + + + + 
Materials
+ + + + + + + + + + + + + + + + + + + + * * */  

//wireframe material component that updates the material of a the visible model
AFRAME.registerComponent('gltfpostprocessing', {
	schema: {},
	init: function () {
		window.addEventListener("model-loaded", function(e){
		  var sceneEl = this.el;
		  var myScene = document.querySelector('a-scene');
		  var model = myScene.querySelector( "#loaded-model" );

		  basicMaterial = new THREE.MeshBasicMaterial( { 
			  color: 0xffffff, 
			  opacity: 1,
			  wireframe: true, 
		  } );

		  model.object3D.traverse(function(item){
			  item.material = basicMaterial;
		  });
	  });
  }
});


//phong material component to update material of visible gltf
AFRAME.registerComponent('gltf-opaque', {
	schema: {},
	init: function () {
		window.addEventListener("model-loaded", function(e){
		  var sceneEl = this.el;
		  var myScene = document.querySelector('a-scene');
		  var model = myScene.querySelector( "#loaded-model-opaque" );

		  phongMaterial = new THREE.MeshPhongMaterial( { 
			  ambient: 0x555555, 
			  color: 0x555555,
			  specular: 0xffffff, 
			  shininess: 50, 
			  shading: THREE.SmoothShading, 
			  transparent: true,
			  opacity: 0.5,
		  } );

		  model.object3D.traverse(function(item){
			  item.material = phongMaterial;
		  });
	});
  }
});


//Update environment settings - refined shadows
AFRAME.registerComponent('update-sun', {
schema: {},
update: function (){
	env = document.querySelector('a-entity[environment]');
	mySun = env.components.environment.sunlight.components.light;
	mySun.light.shadow.mapSize.x = 4000;
	mySun.light.shadow.mapSize.y = 4000;
	}
});