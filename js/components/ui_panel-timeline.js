
/* * * + + + + + + + + + + + + + + + + + + + + 
PANEL_Timeline : 2 level timeline component
Uses configuration object and parsed dates to create hierarchical indicator
+ + + + + + + + + + + + + + + + + + + + * * */ 
var moment = require('moment');
var isEqual = require('lodash.isequal');

function getTimescaleFromDate(date,timeScale){
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
}

//TO-DO - this hasn't been tested for day, hour and minutes
function formatDateSegment(segment,timeScale){
	var formatDate;
	switch(timeScale){
		case "year":
		formatDate=moment(segment,'YYYY').format('YYYY');
		break;
	case "month":
		formatDate=moment(segment+1,'MM').format('MMMM');
		break;
	case 'day':
		formatDate=moment(segment+1,'DD').format('DDDD');
		break;
	case 'hour':
		formatDate=moment(segment+1,'HH').format('HHHH');
		break;
	case 'minute':
		formatDate=moment(segment+1,'mm').format('MMM');
		break;
	default :
		console.log('Formatting date segment did not work')
	}
	return formatDate
}



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
	},
	init: function (){
		var el = this.el;
		var data = this.data;

		var dateTree = this.timelineDataToDateTree(data.timelineData, data.timeScales)
		var datesEl = this.renderDateTree(dateTree)
		el.appendChild(datesEl)
	},
	timelineDataToDateTree: function(timelineData, timeScales){
		var dateTree = {}

		const leafTimescale = timeScales[timeScales.length - 1]

		Object.keys(timelineData).forEach((date)=>{
			var currentBranch = dateTree

			timeScales.forEach((timeScale)=>{

				var m = moment(date);
				var timeScaleVal = m.startOf(timeScale).toString();

				if(!currentBranch[timeScaleVal]){
					currentBranch[timeScaleVal] = {}
				}
				if(timeScale != leafTimescale){
					currentBranch = currentBranch[timeScaleVal]
				} else {
					var leaf = currentBranch[timeScaleVal] = timelineData[date]
					if (Array.isArray(leaf)){
						leaf.forEach((leafItem)=>{
							leafItem.key = date
						})
					} else {
						leaf.key = date
					}
					
				}
			})
		})

		return dateTree
	},
	renderDateTree: function (dateTree, depth=0){
		
		const isLeafTimescale = depth === this.data.timeScales.length
		var thisEl = document.createElement('a-entity')
		var containerEl = document.createElement('a-entity')
		
		if(isLeafTimescale){
			return thisEl
		}

		containerEl.setAttribute('ui-panel-container',{
			panelType:'scale-to-fit'
		})
		thisEl.appendChild(containerEl)

		Object.keys(dateTree).forEach((childKey)=>{
			var childEl = this.renderDateTree(dateTree[childKey], depth+1)

			childEl.setAttribute('id', childKey)
			var timeScale = this.data.timeScales[depth]
			var dateVal = getTimescaleFromDate(childKey, timeScale)
			childEl.setAttribute('text', {
				value: formatDateSegment(dateVal,timeScale),
				anchor: 'left',
				baseline: 'bottom'
			})
			// childEl.flushToDOM()

			containerEl.appendChild(childEl)
		})

		// FIXME: Temporary for debugging bbox issues with nested layouts
		if(depth == 1){
			setTimeout(()=>{
				containerEl.components["ui-panel-container"].previewBBox()
			}, 200)	
		}

		return thisEl
	}

});



