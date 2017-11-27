/* * * + + + + + + + + + + + + + + + + + + + + 
MENU_360 : menu component for 360 scene
has:
panelTimeline
panelInfo
panelPreview
panelNav

+ + + + + + + + + + + + + + + + + + + + * * */ 

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

		
		//get camera position
		var camPosition = document.querySelector('a-camera').components.position.data;
        var menuPosition = {
            x:camPosition.x, 
            y:camPosition.y+0.2, 
            z:camPosition.z-1.5 
		}

		el.setAttribute('visible', false);
		
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
                                                  
		layout.setAttribute('id','360-menu-container');

		//add timeline panel component
		var timeline = document.createElement('a-entity');
		timeline.setAttribute('id','timeline');

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

		window.addEventListener('show360Menu', (e)=>{
			var menuState = this.el.getAttribute('visible')
			this.el.setAttribute('visible', (!menuState))
			console.log('360 menu toggled')
		})



    }
});