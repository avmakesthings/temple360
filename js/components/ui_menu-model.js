/* * * + + + + + + + + + + + + + + + + + + + + 
MENU_Model : menu component for model scene
has:
panelTimeline
panelInfo
panelPreview
panelNav

+ + + + + + + + + + + + + + + + + + + + * * */ 
var mainData = require('./../mainData.js');

AFRAME.registerComponent('ui-menu-model', {
	schema: {
		menuHeight: {default: 1.2},
		menuWidth: {default: 2.5},
		menuDepth: {default: 0.3},
		margin: {default: 0.},
		active: {default: false}
	},
	init: function (){

		var el = this.el;
		data = this.data;
		
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
		layout.setAttribute('layout', {
			type:'box',
			margin: data.margin,
			plane:'xy',
			columns: 3,
			reverse:true
		});                                                       

		//add timeline component
		var timeline = document.createElement('a-entity');
		timeline.setAttribute('ui-panel-timeline',{
			timelineData: JSON.stringify(mainData.models),
			componentTitle:'timeline',
			active:true
		});
		layout.appendChild(timeline);

		//add navigation buttons


    }
});
