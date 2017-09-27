/* * * + + + + + + + + + + + + + + + + + + + + 
Temple360 - An A-frame web viewer for the design
& construction of the 2017 Burning Man temple
Author: AV
+ + + + + + + + + + + + + + + + + + + + * * */ 

require('aframe');
require('aframe-state-component');

var extras = require('aframe-extras'); //fix for A-frame GLtf 2.0 issues
// Register 'A-frame extras' Loaders package and its dependencies.
extras.loaders.registerAll();

var mainData = require('./mainData.js'); //Get JSON data 

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
		
		printState: function(state) {
			// console.log("this is working");
			console.log(state);
			return state;
		},
		
		//change state when date event is emited
		changeActiveDate: function (state,nextDate) {
			//lookup key for nextDate
			state.activeDate = mainData.dates[key];
			//toggle data being 
			return state;
	  	},
		  
		changeActiveLocation: function (state,nextLocation) {
			console.log(nextLocation);
			state.activeLocation = nextLocation;
			return state;
		}  
	},
});


// Helper to print state
AFRAME.registerComponent('print-state', {
	schema: {},
	init: function (){
		var el = this.el;
		el.addEventListener('loaded', function () {
			el.sceneEl.emit('printState');
		});
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

//A UI component to indicate where a user can teleport within the scene. Knows the users location
AFRAME.registerComponent('ui-navigation-point-marker', {
	schema: {},
	init: function (){
	}
});  


//UI component that shows a plan view of the scene. Knows the users location & how much conent is located at each nav-pt-marker
AFRAME.registerComponent('ui-navigation-map', {
	schema: {},
	init: function (){
	}
});  


//Allows user to switch between dates - knows state
AFRAME.registerComponent('ui-timeline', {
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