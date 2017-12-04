/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * @author JohnFaichney/ http://github.com/johnvf
 * 
 * A-frame Renderers
 */

//updates the material of a gltf model
//optionally creates wireframe edges
AFRAME.registerComponent('gltf-renderer', {
	schema: {},
	init: function () {
		var el = this.el;
		var myScene = document.querySelector('a-scene');
		var phongMaterial = new THREE.MeshPhongMaterial( {  
			color: 0x4286F4,
			specular: 0xffffff, 
			shininess: 50, 
			transparent: true,
			opacity: 0.5,
			polygonOffset: true,
			polygonOffsetFactor: 1, // positive value pushes polygon further away
			polygonOffsetUnits: 1
		} );
		var lineMat = new THREE.LineBasicMaterial( { 
			color: 0x000000, linewidth: 10 
		} );
		var wireframeEl = document.createElement('a-entity')
		wireframeEl.setAttribute('id', 'wireframe-el')

		//changed the event bc model-loaded was called for every model
		//object3dset is emitted once when all models have loaded
		el.addEventListener('object3dset',(e)=>{
			var modelGeo = el.object3D
			if(!modelGeo){
				return
			}
			modelGeo.traverse(function(item){
				item.material = phongMaterial;
				//this is supposed to add wireframe geo
				//to each child object3D 
				var geo = new THREE.WireframeGeometry( item );
				var wireframe = new THREE.LineSegments( geo, lineMat );
				wireframeEl.object3D.add(wireframe)
			});
		})
		el.appendChild(wireframeEl)
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