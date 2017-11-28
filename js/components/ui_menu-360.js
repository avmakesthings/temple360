/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * A-frame 360 Menu Component
 */

var mainData = require('./../mainData.js');

AFRAME.registerComponent('ui-menu-360', {
	schema: {

		menuHeight: {default: 1.2},
		menuWidth: {default: 2.5},
		menuDepth: {default: 0.3},
		margin: {default: 0.0},
		active: {default: false}
	},
	init: function (){
		var el = this.el;
		data = this.data;

		
		this.setPosition()
		el.setAttribute('visible', false);
		//add layout component & set base position 
		var layout = document.createElement('a-entity');
		layout.setAttribute('id','model-menu-container');
		layout.setAttribute('position', {
            x:0, 
            y:0.2, 
            z:-1.5 
		})
		//create menu container geometry 
		globals.createWireframeBox(layout,data.menuHeight, data.menuWidth, data.menuDepth);
		globals.createMeshPlaneFill(layout,data.menuHeight, data.menuWidth, data.menuDepth);
		el.appendChild(layout);			
                                        
		layout.setAttribute('id','360-menu-container');

		//add timeline panel component
		var timeline = document.createElement('a-entity');
		timeline.setAttribute('id','timeline');
		
		//absolute pos placeholder
		timeline.setAttribute('position',{
			X: -0.9,
			Y: 0.3,
			Z: 0
		})

		timeline.setAttribute('ui-panel-timeline',{
			timelineData: JSON.stringify(mainData.threeSixtyImages),
			timeScales: ['month','day'],
			componentTitle:'timeline',
			active:true
		});

		timeline.clickHandler = (e)=>{
			this.el.emit('changeActiveDate',{ 
				activeDate: e.key
			});
			this.el.emit('changeActiveThreeSixty',{ 
				activeThreeSixty: e.children.source
			});
		}

		layout.appendChild(timeline);


		//add nav button
		var navButton = document.createElement('a-entity');
		navButton.setAttribute('ui-button', {
			value:'Back',
		});
		navButton.clickHandler = (e)=>{
			this.el.emit('changeActiveScene',{ 
				activeScene: 'scene3DModel'
			});
			//active location changed?
		}
		layout.appendChild(navButton);

		window.addEventListener('show360Menu', (e)=>{
			var menuState = this.el.getAttribute('visible')
			this.setPosition()
			this.el.setAttribute('visible', (!menuState))
		})
	},
	setPosition: function(){
		var cam = document.querySelector('a-camera')
		var camPos = cam.components.position.data;
		var camRot = cam.components.rotation.data;
		this.el.setAttribute('rotation',{
			x:0,
			y:camRot.y,
			z:0
		})
		this.el.setAttribute('position', camPos)
	}
});