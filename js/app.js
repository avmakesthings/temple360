//fix for A-frame GLtf 2.0 issues
var extras = require('aframe-extras');
// Register a particular package, and its dependencies.
extras.loaders.registerAll();

//component to update the material of a model
AFRAME.registerComponent('gltfpostprocessing', {
  	schema: {},
  	init: function () {
	  	window.addEventListener("model-loaded", function(e){
			console.log("Model Loaded!")
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

AFRAME.registerComponent('gltf-opaque', {
  	schema: {},
  	init: function () {
	  	window.addEventListener("model-loaded", function(e){
			console.log("Model Loaded!")
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






AFRAME.registerComponent('update-sun', {
  schema: {},
  update: function (){
  	env = document.querySelector('a-entity[environment]');
  	mySun = env.components.environment.sunlight.components.light;
  	mySun.light.shadow.mapSize.x = 4000;
  	mySun.light.shadow.mapSize.y = 4000;
  }
});
	
