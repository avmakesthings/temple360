require('aframe');
require('aframe-state-component');

var extras = require('aframe-extras'); //fix for A-frame GLtf 2.0 issues
// Register 'A-frame extras' Loaders package and its dependencies.
extras.loaders.registerAll();

var mainData = require('./mainData.js'); //Get JSON data 


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


	

//Iterate through data model and create a new state for each date
AFRAME.registerComponent('create-states', {
	schema: {
	//   date: {type: 'date', default: '2017-07-01'},
	  description: {type: 'string', default: "a description"},
	  defaultlocation: {type: 'vec3', default: {x:0,y:0,z:0}},
	  model: {type: 'string', default: '../assets/17-08-temple.gltf'},
	//   images: {type: 'array', default: '1,2,3'}
	},
	init: function () {

		var dates = mainData.dates;

		for(var i=0; i<dates.length; i++){
			// this[i].data.description = dates[i].description;
			console.log(dates);
		}
	}
});



//Update the state based on change-state events
//function setState







//Swap data variable - gets component by id, replace src based on event being called  
// AFRAME.registerComponent('update-model-mesh', {
// 	schema: {
// 		event: {type: 'string', default: ''}
// 	},
// 	init: function (){
// 		var sceneEl = this.el;
// 		var myScene = document.querySelector('a-scene');
// 		var model = myScene.querySelector( "#loaded-model" );

// 	}
//   });