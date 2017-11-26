
/* * * + + + + + + + + + + + + + + + + + + + + 
PANEL_Timeline : 2 level timeline component
Uses configuration object and parsed dates to create hierarchical indicator
+ + + + + + + + + + + + + + + + + + + + * * */ 
var moment = require('moment');
var isEqual = require('lodash.isequal');

AFRAME.registerComponent('ui-panel-timeline-old', {
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
		//absolute position
		var basePosition = {
			x:-data.panelWidth/2+data.panelMargin - 0.07,
			y:data.panelHeight/2-data.panelMargin + 0.07,
			z:-data.panelDepth/2
		}
		
		//create container geometry 
		globals.createWireframeBox(el,data.panelHeight,data.panelWidth,data.panelDepth);
		globals.createMeshPlaneFill(el,data.panelHeight, data.panelWidth, data.panelDepth);

		//create timeline container -- can move into sub-compoennt
		var timelineContainer = document.createElement('a-entity');
		timelineContainer.setAttribute('id', 'timelineContainer');
		//set layout basepoint to top left
		timelineContainer.setAttribute('position',basePosition);
		// timelineContainer.setAttribute('ui-panel-container', {
		// 	panelType: 'scale-to-fit'
		// });
		el.appendChild(timelineContainer);

		//create panel heading -- can move into sub-compoennt
		var panelHeading = document.createElement('a-entity');
		panelHeading.setAttribute('id','panelHeading');
		panelHeading.setAttribute('mixins','text-panel-heading');
		panelHeading.setAttribute('geometry', {
			primitive:'plane',
			height: 0.1,
		});
		panelHeading.setAttribute('material', {
			opacity:0.0,
			transparent: true,
		});		
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
		var tl1Counter = 0;
		var thisTimeScale1; // eg.2016
		var thisTimeScale2; // eg.January
		var lastParentEl;
		var thisChildEl;
		var lastHeight;


		//TO-DO - this could be generalized further to support more than 2 timescales
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
							
							//currently using a fixed placeholder for childBasePosition
							var childrenBasePosition = {
								x:0,
								y:-0.1,
								z:0
							};
							
							//create container for child timeline componenets
							var timescale1Children = document.createElement('a-entity');
							timescale1Children.setAttribute('id', 'timescale1Children');
							timescale1Children.setAttribute('position', childrenBasePosition);
							timescale1Children.setAttribute('layout', {
								margin:-0.05,
								plane: 'yz'
							});
							lastParentEl.appendChild(timescale1Children);
							lastParentEl = timescale1Children;
							//set the counter
							timeCounter1 = thisTimeScale1;
							tl1Counter++;
						}
						break; 					
					case 1: //eg. month
						thisTimeScale2 = this.getTimescaleFromDate(date,data.timeScales[i]);
						//is timescale level 2 unique?
						if(timeCounter2 != thisTimeScale2){
							//create a child entity of the last known parent
							thisChildEl = this.createTimescaleContainer(lastParentEl,i);
							thisChildEl.setAttribute('id', data.timeScales[i] + thisTimeScale2);
							thisChildEl.setAttribute('position', {} );
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
		timescaleContainer.setAttribute('ui-panel-container',true)
		parentEl.appendChild(timescaleContainer);
		return timescaleContainer;

	},
	getGeometryHeight: function(){
		var height = el.getAttribute('geometry').height
		return height;
	}
});




AFRAME.registerComponent('ui-timeline-ts-1', {
	schema: {
		text:{default:''},
		dividerWidth: {default: 0.3},
		offset: {default:0.03},
		thisBasePosition: {default:
			{
				x: 0.0,
				y: -0.1,
				z:0.0
			}},
		height: {default:0.1}
	},
	init: function() {
		el = this.el;
		data = this.data;

		el.setAttribute('material', {
			opacity:0.0,
			transparent: true,
		});

		//set positions in the entity 
		el.setAttribute('position', data.thisBasePosition);

		//create text
		var timescale1Text = document.createElement('a-entity');
		timescale1Text.setAttribute('id', 'timescale1Text');
		timescale1Text.setAttribute('mixins', 'text-panel-sub-heading-1');
		timescale1Text.setAttribute('text', {
			value: data.text,
			anchor:'left',
		});
		timescale1Text.setAttribute('position', {
			x:0,
			y:-data.offset,
			z:0
		});
		el.appendChild(timescale1Text);

		//add divider line
		var timescale1Line = document.createElement('a-entity');
		timescale1Line.setAttribute('id', 'timescale1Line');
		timescale1Line.setAttribute('geometry',{
			primitive: 'box',
			height: 0.01,
			width: data.dividerWidth,
			depth: 0.01,
			color: 'brown'
		});
		timescale1Line.setAttribute('position', {
			x:data.dividerWidth/2,
			y:-(data.offset*2),
			z:0
		});		
		el.appendChild(timescale1Line);

		//hover animation

		//events
		
		el.addEventListener('click', (e)=>{
			
        });
	},
	update: function(){

	}
});




AFRAME.registerComponent('ui-timeline-ts-2', {
	schema: {
		text:{default:''},
		data: {},
		offset: {default: 0.03},
		thisBasePosition: {default: {
			x:0,
			y:-0.1,
			z:0
		}}
	},
	init: function() {
		el = this.el;
		data = this.data;

		//create geometry
		el.setAttribute('geometry', {
			primitive:'plane',
			height: 'auto',
			width: 'auto'
		});

		el.setAttribute('material', {
			opacity:0.0,
			transparent: true,
		});

		//create text
		el.setAttribute('mixins', 'text-panel-sub-heading-2');
		el.setAttribute('text', {
			value: data.text,
			// height: 0.1,
			anchor:'left',
			width: 1
		});

		//hover animation

		//click events
	}
});

