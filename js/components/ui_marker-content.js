/* * * + + + + + + + + + + + + + + + + + + + + 
MARKER_Content : A 3D UI element with content 
associated with it

has:
geom
material
location (in model)
content (similar to value)
onHover
onClick


+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerComponent('ui-marker-content', {
	schema: {},
	init: function (){
		var geo = new THREE.BoxGeometry(1,1,1)
		var mesh = new THREE.Mesh( geo, globals.transAmberMaterial );
		this.el.object3D.add(mesh);

		this.flushToDOM();
	}
});