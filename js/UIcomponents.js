/* * * + + + + + + + + + + + + + + + + + + + + 
UI Components 
These have the display logic 
+ + + + + + + + + + + + + + + + + + + + * * */   

//UI component to indicate where a user can teleport within the scene.
//knows if it's active or not 
AFRAME.registerComponent('ui-nav-pt-marker', {
	schema: {
		// collider: {type: 'asset'},	
		active: {default: false},
		src: {type: 'asset'},
		//geometry: {default:'box'},
		description: {default: "foo"}
	},
	init: function (){

		//
		// trying to initialize this component with a box
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshBasicMaterial( { color: 0xFFA433 } );
        var cube = new THREE.Mesh( geometry, material );
        this.el.object3D.add(cube);

		// document.querySelector('a-scene').addEventListener('loaded', function () {
			
		// 	//this.el.createObject3D();
		// 	this.el.setObject3D(cube);
		// });


		//if active  -- do this animation and change this color

		//else




	}
});  


//UI component to display content available 
AFRAME.registerComponent('ui-nav-pt-content', {
	schema: {},
	init: function (){
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
