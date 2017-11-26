
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
	/*
		renderDateTree(2016)
			renderDateTree(2016-01)
				renderDateTree(2016-01-18)
					- add all children for days
					return container/children
				
				- add all children for months
				return container/children
			
			...

			element 
				el -2016
					09
					10
				el - 2017


	*/
	renderDateTree: function (dateTree, key="root", depth=0){
		
		const isLeafTimescale = depth === this.data.timeScales.length
		var thisEl = document.createElement('a-entity')
		thisEl.setAttribute('id', key)

		if(isLeafTimescale){
			return thisEl
		}

		Object.keys(dateTree).forEach((childKey)=>{
			var childEl = this.renderDateTree(dateTree[childKey], childKey, depth+1)
			thisEl.appendChild(childEl)
		})

		return thisEl
	}

});



