/* * * + + + + + + + + + + + + + + + + + + + + 
MENU_Home : menu component for home scene
+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerComponent('ui-menu-home', {
	schema: {
	},
	init: function (){
		
		var el = this.el;
		
		//menu size variables
		var menuHeight = 1.2;
		var menuWidth = 2.5;
		var menuDepth = 0.3;
		var margin = 0.1;
		
		//get camera position
		var camPosition = document.querySelector('a-camera').components.position.data;
        var menuPosition = {
            x:camPosition.x, 
            y:camPosition.y+0.2, 
            z:camPosition.z-1.5 
		}
		
		//set menu position 
		el.setAttribute('position', {
			x:menuPosition.x,
			y:menuPosition.y,
			z:menuPosition.z
		});

		//create menu container geometry 
		var geometry = new THREE.BoxGeometry(menuWidth,menuHeight,menuDepth);
		var geo = new THREE.EdgesGeometry( geometry );
		var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 10 } );
		var wireframe = new THREE.LineSegments( geo, mat );
		el.object3D.add(wireframe);

		//add back fill
		var plane = new THREE.PlaneGeometry(menuWidth,menuHeight);
		var material = new THREE.MeshBasicMaterial( {
			color: 0x826D3D,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.6
		} );
		var mesh = new THREE.Mesh(plane, material);
		mesh.position.z = -(menuDepth/2);
		mesh.updateMatrix();
		el.object3D.add(mesh);

		//add layout component
		var layout = document.createElement('a-entity');
		layout.setAttribute('position', {
			x:0,
			y:-menuHeight/2+0.2,
			z:0
		})
		layout.setAttribute('layout', {
			type:'line',
			margin:0.4,
			plane:'yz'
		});
		el.appendChild(layout);

		//add enter button
		var navButton = document.createElement('a-entity');
		navButton.setAttribute('ui-button', {
			value:'start',
			click:'scene3DModel'
		});
		layout.appendChild(navButton);
		navButton.flushToDOM();

		//add description
		var textDescription = document.createElement('a-entity');

		// textDescription.setAttribute('geometry', {
		// 	primitive:'box',
		// 	height:0.5,
		// 	width: 1.2,
		// 	depth: 0.1,
		// });
		textDescription.setAttribute('text', {
			value: 'A Forest in the Desert is an A-frame based webVR interface for spatially and chronologically relating and presenting the content generated over the design, construction and installation of the 2017 Burning Man temple.',
			letterSpacing: 3.6,
			width: 1,
			align: 'center'
		});
		layout.appendChild(textDescription);

		//add heading
		var textHeading = document.createElement('a-entity');

		// textHeading.setAttribute('geometry', {
		// 	primitive:'box',
		// 	height:0.2,
		// 	width: 1,
		// 	depth: 0.5,
		// });
		// textHeading.setAttribute('color', 'blue');
		textHeading.setAttribute('text', {
			value: 'A forest in the desert',
			letterSpacing: 3.6,
			width: 2,
			align: 'center'
		});
		layout.appendChild(textHeading);
		// textHeading.createBoundingGeom(textHeading.el,0.2,1.0,0.5);

	},
	createBoundingGeom: function(sceneEl,height,width,depth) {
		var geometry = new THREE.BoxGeometry(height, width, depth);
		var geo = new THREE.EdgesGeometry( geometry );
		var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 10 } );
		var wireframe = new THREE.LineSegments( geo, mat );
		sceneEl.object3D.add(wireframe);
	}
});