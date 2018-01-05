/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * MENU_Home : menu component for home scene
 */

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
		var camPosition = document.getElementById('cameraRig').components.position.data;
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
			y:0.275,
			z:0
		})
		layout.setAttribute('id',"#home-menu")
		el.appendChild(layout);

		//build
		var textBuild = document.createElement('a-entity');
		textBuild.setAttribute('mixin', 'text-description-1');
		textBuild.setAttribute('text', {
			value: 'WIP Build 01/01/18',
			width: 0.7
		});
		textBuild.setAttribute('position', {
			x:0,
			y:-0.42,
			z:0
		})
		layout.appendChild(textBuild);

		//collaborators
		var textCollab = document.createElement('a-entity');
		textCollab.setAttribute('mixin', 'text-description-1');
		textCollab.setAttribute('text', {
			value: 'by Anastasia Victor & John Faichney',
			width: 0.9
		});
		textCollab.setAttribute('position', {
			x:0,
			y:-0.09,
			z:0
		})
		layout.appendChild(textCollab);


		//add heading
		var textHeading = document.createElement('a-entity');
		textHeading.setAttribute('mixin', 'text-heading-1');
		textHeading.setAttribute('text', {
			value: 'A Forest in the Desert',
		});
		textHeading.setAttribute('position', {
			x:0,
			y:0,
			z:0
		})
		layout.appendChild(textHeading);

		//add description
		var textDescription = document.createElement('a-entity');
		textDescription.setAttribute('mixin', 'text-description-1');
		textDescription.setAttribute('text', {
			value: 'An A-frame based webVR interface for presenting the design, construction and installation of the 2017 Burning Man temple, set in space and time.',
		});
		textDescription.setAttribute('position', {
			x:0,
			y:-0.254,
			z:0
		})
		layout.appendChild(textDescription);
		

		//add enter button
		var navButton = document.createElement('a-entity');
		navButton.setAttribute('ui-button', {
			value:'enter',
		});
		navButton.setAttribute('position', {
			x:0,
			y:-0.625,
			z:0
		})
		navButton.clickHandler = (e)=>{
			this.el.emit('changeActiveScene',{ 
				activeScene: 'scene3DModel'
			});
			//hack to ensure active date is initialized when start button is pressed
			//need to revise events 
			AFRAME.scenes[0].emit('changeActiveDate',{ 
				activeDate: '2017-08-01'
			});
		}
		layout.appendChild(navButton);
		navButton.flushToDOM();





	}
});