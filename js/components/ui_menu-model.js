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
		
		//create menu container geometry 
		globals.createWireframeBox(el,data.menuHeight, data.menuWidth, data.menuDepth);
		globals.createMeshPlaneFill(el,data.menuHeight, data.menuWidth, data.menuDepth);

		//add layout component & set base position 
		var layout = document.createElement('a-entity');
		el.appendChild(layout);	
		layout.setAttribute('position', {
			x:-data.menuWidth/2+0.5,
			y:0,
			z:0
		});                                   
		layout.setAttribute('id','model-menu-container');

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
		var camPos = document.querySelector('a-camera').components.position.data;
		this.el.setAttribute('position', {
            x:camPos.x, 
            y:camPos.y+0.2, 
            z:camPos.z-1.5 
		})
	}
});

		// timeline.setAttribute('ui-panel-timeline',{
		// 	timelineData: JSON.stringify(mainData.threeSixtyImages),
		// 	timeScales: ['month','day'],
		// 	componentTitle:'timeline',
		// 	active:true
		// });