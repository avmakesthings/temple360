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

		  if(!model.object3D){
			return
			}

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

		  if(!model.object3D){
			return
			}
		  phongMaterial = new THREE.MeshPhongMaterial( { 
			  //ambient: 0x555555, 
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