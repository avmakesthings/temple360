/* * * + + + + + + + + + + + + + + + + + + + + 
MENU_Home : menu component for home scene
+ + + + + + + + + + + + + + + + + + + + * * */ 



AFRAME.registerComponent('ui-menu-home', {
	schema: {
	},
	init: function (){
		
		var el = this.el;
		
		//menu size variables - move to schema
		var menuHeight = 1.2;
		var menuWidth = 2.5;
		var menuDepth = 0.3;
		var menuMargin = 0.4;
		
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
		var mesh = new THREE.Mesh(plane, globals.transAmberMaterial);
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
			margin: menuMargin,
			plane:'yz'
		});
		layout.setAttribute('id',"#home-menu")
		el.appendChild(layout);

		//add enter button
		var navButton = document.createElement('a-entity');
		navButton.setAttribute('ui-button', {
			value:'start',
		});
		navButton.clickHandler = (e)=>{
			this.el.emit('changeActiveScene',{ 
				activeScene: 'scene3DModel'
			});
		}
		layout.appendChild(navButton);
		navButton.flushToDOM();

		//add description
		var textDescription = document.createElement('a-entity');
		textDescription.setAttribute('mixin', 'text-description-1');
		textDescription.setAttribute('text', {
			value: 'A Forest in the Desert is an A-frame based webVR interface for spatially and chronologically relating and presenting the content generated over the design, construction and installation of the 2017 Burning Man temple.',
		});

		layout.appendChild(textDescription);

		//add heading
		var textHeading = document.createElement('a-entity');
		textHeading.setAttribute('mixin', 'text-heading-1');
		textHeading.setAttribute('text', {
			value: 'A forest in the desert',
		});

		layout.appendChild(textHeading);

	}
});