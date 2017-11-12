/* * * + + + + + + + + + + + + + + + + + + + + 
PANEL_Timeline : 2 level timeline component
Uses configuration object and parsed dates to create hierarchical indicator
+ + + + + + + + + + + + + + + + + + + + * * */ 
var moment = require('moment');

AFRAME.registerComponent('ui-panel-timeline', {
	schema: {
		timelineData: {
            default: "{}",
            parse: function (value) {
                return JSON.parse(value)
            }
		},
		timeScales:{default:['year','month','day']},
		active:{default: false},
		componentTitle: {default:''},
		panelHeight: {default:1.0},
		panelWidth:{default:0.5},
		panelDepth:{default:0.2},
		panelMargin: {default:0.05}
	},
	init: function (){
		var el = this.el;
		var data = this.data;
		
		//create container geometry
		globals.createWireframeBox(el,data.panelHeight,data.panelWidth,data.panelDepth);
		globals.createMeshPlaneFill(el,data.panelHeight, data.panelWidth, data.panelDepth);

		//create timeline container
		var timelineContainer = document.createElement('a-entity');
		//set layout basepoint to top left
		timelineContainer.setAttribute('position',{
			x:-data.panelWidth/2+data.panelMargin,
			y:data.panelHeight/2-data.panelMargin,
			z:-data.panelDepth/2
		});
		timelineContainer.setAttribute('layout', {
			primitive: 'line',
			plane:'yz',
			margin: data.panelMargin,
			reverse:true
		});
		el.appendChild(timelineContainer);

		//add panel heading
		var panelHeading = document.createElement('a-entity');
		panelHeading.setAttribute('mixins','text-panel-heading');
		panelHeading.setAttribute('text', {
			value: data.componentTitle,
			anchor: 'left', //these should be included & working in the mixin but aren't?
			baseline: 'top'
		});
		timelineContainer.appendChild(panelHeading);
		
		//add entities for each item in level 1
		for (var items in data.timelineData){
			//get number of years
			var lvl1Items = [];
			lvl1Items.push(moment(items).year());
			console.log(lvl1Items);
			//create a timeline lvl 1 component for each year
		}

		//add entities for each item in level 2

		//level 2 marks and text

    }
});

AFRAME.registerComponent('ui-timeline-lvl-1', {
	schema: {
		text:{default:''},
		dividerWidth: {default: 0.3}
	},
	init: function() {
		//create geometry
		el = this.el;
		data = this.data;

		var geometry = new THREE.BoxGeometry(data.dividerWidth,.1,0.01);
        var timelineMark = new THREE.Mesh( geometry, globals.inactiveMaterial );
        el.setObject3D('mesh', timelineMark);

		//create text
		el.setAttribute('text', {
            value: data.text
        });
		
		//hover animation

		//click events
		el.addEventListener('click', (e)=>{
			//some behaviour? ..expand in the UI? 
        });
	}
});

AFRAME.registerComponent('ui-timeline-lvl-2', {
	schema: {},
	init: function() {
		//create geometry

		//create text
		
		//hover animation

		//click events
	}
});