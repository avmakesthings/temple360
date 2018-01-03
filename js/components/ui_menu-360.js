/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * A-frame 360 Menu Component
 */
var getState = require('../getState')

//obj functions from Michael Jaspar
function getNextKey(obj, id){
	var keys = Object.keys( obj ),
		idIndex = keys.indexOf( id ),
		nextIndex = idIndex += 1;
	if(nextIndex >= keys.length){
		//we're at the end, there is no next
		return;
	}
	var nextKey = keys[ nextIndex ]
	return nextKey;
};

function getPreviousKey(obj, id){
	var keys = Object.keys( obj ),
		idIndex = keys.indexOf( id ),
		nextIndex = idIndex -= 1;
	if(idIndex === 0){
	//we're at the beginning, there is no previous
		return;
	}
	var nextKey = keys[ nextIndex ]
	return nextKey;
};

var mainData = require('./../mainData.js');
var moment = require('moment');

AFRAME.registerComponent('ui-menu-360', {
	schema: {
		menuHeight: {default: 1.2},
		menuWidth: {default: 2.1},
		menuDepth: {default: 0.3},
		margin: {default: 0.0},
		active: {default: false}
	},
	init: function (){
		
		var activeLocation = getState('activeLocation')
		this.menuData = this.filter360sByLocation(mainData.threeSixtyImages, activeLocation)
		this.activeDate = this.setActiveDate() //hack for dealing with date discrepencies
		this.setPosition()
		this.el.setAttribute('visible', false)
		this.createMenu()

		//menu toggle - TODO - add support for VR controller keypress
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
	},
	createMenu: function(){
		const layout = document.createElement('a-entity')
		layout.setAttribute('id','model-menu-container')
		layout.setAttribute('position', {
            x:0, 
            y:0.2, 
            z:-1.5 
		})
		this.createMenuGeo(layout)

		const layoutUpper = document.createElement('a-entity')
		layoutUpper.setAttribute('id','layout-upper')
		layoutUpper.setAttribute('position', {
            x:0, 
            y:0.07, 
            z:0
		})		
		const layoutLower = document.createElement('a-entity')
		layoutLower.setAttribute('id','layout-lower')
		layoutLower.setAttribute('position', {
            x:0, 
            y:-0.45, 
            z:0
		})			
		layout.appendChild(layoutUpper)
		layout.appendChild(layoutLower)
		
		const timeline = this.createTimelinePanel(layoutUpper)
		const info = this.createInfoPanel(layoutUpper)
		const nav = this.createNavPanel(layoutLower)
		
		//add positioning logic
		timeline.setAttribute('position', {
            x:-0.556, 
            y:0, 
            z:-0.126
		})
		info.setAttribute('position', {
            x:0.149, 
            y:-0.039, 
            z:-0.032
		})			
		
		this.el.appendChild(layout)

		window.addEventListener('activeDateChanged', (e)=>{
			this.activeDate = e.detail.activeDate
			var activeScene = getState('activeScene')
			if(activeScene === 'scene360'){
				this.updateInfoPanel(info, this.activeDate)
			}
		})
	},
	createMenuGeo: function(el){
		data = this.data
		globals.createWireframeBox(el,data.menuHeight, data.menuWidth, data.menuDepth)
		globals.createMeshPlaneFill(el,data.menuHeight, data.menuWidth, data.menuDepth)
	},
	createTimelinePanel: function(el){

		var timelineData = this.menuData
		var timeline = document.createElement('a-entity');		
		timeline.setAttribute('id','timeline');
		timeline.setAttribute('ui-panel-timeline',{
			timelineData: JSON.stringify(timelineData),
			timeScales: ['month','day'],
			componentTitle:'timeline',
			active:true
		});
		timeline.clickHandler = (e)=>{
			this.el.emit('changeActiveDate',{ 
				activeDate: e.key
			});
			this.el.emit('changeActiveThreeSixty',{ 
				activeThreeSixty: e.children
			});
		}
		el.appendChild(timeline);
		return timeline
	},
	createInfoPanel: function(el){
		
		var initialDate = moment(Object.keys(this.menuData)[0]).format('MM/DD/YYYY')
		var initialData = this.menuData[Object.keys(this.menuData)[0]]
		var infoEl = document.createElement('a-entity')		
		infoEl.setAttribute('id','info')
		infoEl.setAttribute('ui-panel-info',{
			preHeadingVal: initialDate,
			headingVal: initialData.title,
			descriptionVal: initialData.description
		});
		el.appendChild(infoEl)
		return infoEl
	},
	updateInfoPanel: function(el, activeDate){

		activeDate = moment(activeDate).format("YYYY-MM-DD")

		var preHeadingEl = el.querySelector('#preHeading')
		preHeadingEl.setAttribute('text', {
			value:moment(activeDate).format('MM/DD/YYYY')
		})
		var headingEl = el.querySelector('#heading')
		headingEl.setAttribute('text', {
			value:this.menuData[activeDate].title
		})
		var descripEl = el.querySelector('#description')
		descripEl.setAttribute('text', {
			value:this.menuData[activeDate].description
		})
	},
	createNavPanel: function(el){
		
		var navPanel = document.createElement('a-entity');
		
		var homeButton = document.createElement('a-entity');
		homeButton.setAttribute('id', 'button-home')
		homeButton.setAttribute('ui-button', {
			value:'home',
			height: 0.1,
			width: 0.2,
			depth: 0.1,	
			mixin: 'text-button-2'
		});
		homeButton.setAttribute('position', {
			x: -0.315
		});
		homeButton.clickHandler = (e)=>{
			this.el.emit('changeActiveScene',{ 
				activeScene: 'sceneHome'
			});
		}
		navPanel.appendChild(homeButton);
		
		var backButton = document.createElement('a-entity');
		backButton.setAttribute('id', 'button-back')		
		backButton.setAttribute('ui-button', {
			value:'Back to Model',
			height: 0.1,
			width: 0.45,
			depth: 0.1,	
			mixin: 'text-button-2'
		});
		backButton.setAttribute('position', {
			x: -0.695 
		});
		backButton.clickHandler = (e)=>{
			this.el.emit('changeActiveScene',{ 
				activeScene: 'scene3DModel'
			});
		}
		navPanel.appendChild(backButton);

		var prev360Button = document.createElement('a-entity')
		prev360Button.setAttribute('id', 'button-prev-360')	
		prev360Button.setAttribute('ui-button', {
			value:'Prev 360',
			height: 0.1,
			width: 0.3,
			depth: 0.1,	
			mixin: 'text-button-2'
		})
		prev360Button.setAttribute('position', {
			x: 0.345,
		})
		
		prev360Button.clickHandler = (e)=>{
			var prevDate = this.getPreviousDate()
			if (prevDate != this.activeDate){
				this.el.emit('changeActiveDate',{ 
					activeDate: prevDate
				})
				this.el.emit('changeActiveThreeSixty',{ 
					activeThreeSixty: this.menuData[prevDate]
				});
			}
		}
		navPanel.appendChild(prev360Button)	

		var next360Button = document.createElement('a-entity')
		next360Button.setAttribute('id', 'button-next-360')	
		next360Button.setAttribute('ui-button', {
			value:'Next 360',
			height: 0.1,
			width: 0.3,
			depth: 0.1,	
			mixin: 'text-button-2'
		})
		next360Button.setAttribute('position', {
			x: 0.695
		})

		next360Button.clickHandler = (e)=>{
			var nextDate = this.getNextDate()
			if (nextDate != this.activeDate){			
				this.el.emit('changeActiveDate',{ 
					activeDate: nextDate
				})
				this.el.emit('changeActiveThreeSixty',{ 
					activeThreeSixty: this.menuData[nextDate]
				});
			}
		}
		navPanel.appendChild(next360Button)	

		el.appendChild(navPanel);
		return navPanel
	},
	filter360sByLocation: function(data, activeLocation){
		
		var filteredData = {}
		Object.keys(data).forEach((date)=>{
			const item = data[date].find((item)=>{
				return item.location === activeLocation
			})
			if(item){
				filteredData[date] = item
			}
		})
		return filteredData
	},
	setActiveDate: function(){
		var firstDate = Object.keys(this.menuData)[0]
		el.emit('changeActiveDate',{activeDate:firstDate})
		return firstDate
	},
	getPreviousDate: function(){
		var prev360Key =  getPreviousKey(this.menuData, this.activeDate)
		if(prev360Key == undefined){
			return this.activeDate
		}
		return prev360Key
	},
	getNextDate: function(){
		var next360Key = getNextKey(this.menuData, this.activeDate) 
		if(next360Key == undefined){
			return this.activeDate
		}
		return next360Key
	}
});

