/* * * + + + + + + + + + + + + + + + + + + + + 
PANEL_Timeline : 2 level timeline component
Uses configuration object and parsed dates to create hierarchical indicator
+ + + + + + + + + + + + + + + + + + + + * * */ 
var moment = require('moment');
var isEqual = require('lodash.isequal');

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
		panelMargin: {default:0.1}
	},
	init: function (){
		var el = this.el;
		var data = this.data;
		
		//create container geometry
		globals.createWireframeBox(el,data.panelHeight,data.panelWidth,data.panelDepth);
		globals.createMeshPlaneFill(el,data.panelHeight, data.panelWidth, data.panelDepth);

		//create timeline container
		var timelineContainer = document.createElement('a-entity');
		timelineContainer.setAttribute('id', 'timelineContainer');
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
		panelHeading.setAttribute('id','panelHeading');
		panelHeading.setAttribute('mixins','text-panel-heading');
		panelHeading.setAttribute('text', {
			value: data.componentTitle,
			anchor: 'left', //these should be included & working in the mixin but aren't?
			baseline: 'top'
		});
		timelineContainer.appendChild(panelHeading);                                

		//Create timeline entities 
		var dates = Object.keys(data.timelineData);
		var timeCounter1 = null;
		var timeCounter2 = null;
		var thisTimeScale1; // eg.2016
		var thisTimeScale2; // eg.January
		var lastParentEl;
		var thisChildEl;

		dates.forEach((date)=>{
			for(var i=0; i<data.timeScales.length;i++){	
				switch(i){
					case 0: //eg. year
						thisTimeScale1 = this.getTimescaleFromDate(date,data.timeScales[i]);
						//is timescale level 1 unique?
						if(timeCounter1 != thisTimeScale1){
							//create a new child entity of timelineContainer
							lastParentEl = this.createTimescaleContainer(timelineContainer,i);			
							lastParentEl.setAttribute('id', data.timeScales[i] + thisTimeScale1);
							lastParentEl.setAttribute('ui-timeline-ts-1',{
								text: thisTimeScale1
							})
							//set the counter
							timeCounter1 = thisTimeScale1;
						}
						break; 					
					case 1: //eg. month
						thisTimeScale2 = this.getTimescaleFromDate(date,data.timeScales[i]);
						//is timescale level 2 unique?
						if(timeCounter2 != thisTimeScale2){
							console.log('month',thisTimeScale2);
							//create a child entity of the last known parent
							thisChildEl = this.createTimescaleContainer(lastParentEl,i);
							thisChildEl.setAttribute('id', data.timeScales[i] + thisTimeScale2);
							thisChildEl.setAttribute('ui-timeline-ts-2',{
								text:this.formatDateSegment(thisTimeScale2,data.timeScales[i]),
								data:data.timelineData[date]
							})
							//set the counter
							timeCounter2 = thisTimeScale2;
						}
						break;
				}
			}
		});

		//needs to publish active date changed too so that content markers etc will know what the active date is

	},
	getTimescaleFromDate: function(date,timeScale){
		var dateSegment;
		switch(timeScale){
			case "year":
				dateSegment=moment(date).year();
				break;
			case "month":
				dateSegment=moment(date).month();
				break;
			case 'day':
				dateSegment=moment(date).day();
				break;
			case 'hour':
				dateSegment=moment(date).hour();
				break;
			case 'minute':
				dateSegment=moment(date).minute();
				break;
			default :
				console.log('Getting timescale from date did not work')
		}
		return dateSegment;
	},
	//TO-DO - this hasn't been tested for day, hour and minutes
	formatDateSegment: function(segment,timeScale){
		var formatDate;
		switch(timeScale){
			case "year":
			formatDate=moment(segment,'YY').format('YYYY');
			break;
		case "month":
			formatDate=moment(segment,'MM').format('MMMM');
			break;
		case 'day':
			formatDate=moment(segment,'DD').format('DDDD');
			break;
		case 'hour':
			formatDate=moment(segment,'HH').format('HHHH');
			break;
		case 'minute':
			formatDate=moment(segment,'mm').format('MMM');
			break;
		default :
			console.log('Formatting date segment did not work')
		}
		return formatDate
	},
	createTimescaleContainer: function(parentEl,i){
		var timescaleContainer = document.createElement('a-entity');
		// var thisItemName = 'timeScaleContainer';
		// var thisID = thisItemName.concat(i);
		// timescaleContainer.setAttribute('id', thisID);
		// timescaleContainer.setAttribute('layout',{
		// 	margin: 0.01
		// });
		parentEl.appendChild(timescaleContainer);
		return timescaleContainer;
	},
	updateLayout: function(){
		//need to think through how items get positioned 
		//a function to reflow the layout or something? 
		//need to fix 
		/*
		vars - basePosition, align, maxHeight
		
		every item in the timeline has a height that's summed to a running total
		for the entire timeline

		-use the running total to set the vertical position of each element
		-get delta of total height of all elements in the timeline & max height
		-divide by number of elements minus 1 --> gives a gap distance per element
		-then relocate elements  ... tranlations need to be cumulative 

		*/



	}
});

AFRAME.registerComponent('ui-timeline-ts-1', {
	schema: {
		text:{default:''},
		dividerWidth: {default: 0.3},
		margin: {default:0.1}
	},
	init: function() {
		//create geometry
		el = this.el;
		data = this.data;
		// var timescale1El = document.createElement('a-entity');

		el.setAttribute('layout', {
			type:'line',
			margin: 0.1,
			plane:'yz',
			reverse: true
		});

		// el.setAttribute('geometry', {
		// 	primitive:'plane',
		// 	height: 0.1,
		// });

		var geometry = new THREE.BoxGeometry(data.dividerWidth,.01,0.01);
        var timelineMark = new THREE.Mesh( geometry, globals.inactiveMaterial );
        el.setObject3D('mesh', timelineMark);

		//create text
		el.setAttribute('text', {
            value: data.text
		});
		el.setAttribute('mixin', 'text-description-1');
		// el.appendChild(timescale1El);

		//hover animation

		//click events
		el.addEventListener('click', (e)=>{
			//some behaviour? ..expand in the UI? 
        });
	}
});

AFRAME.registerComponent('ui-timeline-ts-2', {
	schema: {
		text:{default:''},
		data: {}
	},
	init: function() {
		el = this.el;
		data = this.data;
		//create level 2 child 
		// var timescale2El = document.createElement('a-entity');
		
		// timescale2El.setAttribute('layout', {
        //     margin: 0.01
		// });

		//create geometry
		
		//create text
		el.setAttribute('text', {
			value: data.text,
			height: 0.1
		});
		el.setAttribute('mixin', 'text-description-1');

		// el.appendChild(timescale2El);

		//hover animation

		//click events
	}
});