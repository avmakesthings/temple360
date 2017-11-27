/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * A-frame Model Menu Component
 */

var mainData = require('./../mainData.js');

AFRAME.registerComponent('ui-menu-model', {
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

		//add timeline panel component
		var timeline = document.createElement('a-entity');
		timeline.setAttribute('id','timeline');
		timeline.setAttribute('ui-panel-timeline',{
			timelineData: JSON.stringify(mainData.models),
			timeScales: ['year','month'],
			componentTitle:'timeline',
			active:true
		});
		timeline.clickHandler = (e)=>{
			console.log('just clicked a timeline element')
			this.el.emit('changeActiveDate',{ 
				activeDate: e.key
			});
			this.el.emit('changeActiveModel',{ 
				activeModel: e.children.source
			});
		}
		layout.appendChild(timeline);

		//add info panel component --TODO
		var info = document.createElement('a-entity');
		info.setAttribute('id','info');

		//add preview panel component

		//add navigation panel component 
		//test nav button
		var navButton = document.createElement('a-entity');
		navButton.setAttribute('ui-button', {
			value:'home',
		});
		navButton.setAttribute('position', {
			x: 0.5
		});
		navButton.clickHandler = (e)=>{
			this.el.emit('changeActiveScene',{ 
				activeScene: 'sceneHome'
			});
			//active location changed?
		}
		layout.appendChild(navButton);

		//menu toggle - replace with VR controller keypress
		window.addEventListener('showModelMenu', (e)=>{
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

		// timeline.setAttribute('ui-panel-timeline',{
		// 	timelineData: JSON.stringify(mainData.threeSixtyImages),
		// 	timeScales: ['month','day'],
		// 	componentTitle:'timeline',
		// 	active:true
		// });