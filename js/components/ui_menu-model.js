/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * A-frame Model Menu Component
 */

function getState(key){
    var sceneEl = document.querySelector('a-scene');
    var appState = sceneEl.systems.state.state.app 
    return appState[key]
} 

var mainData = require('./../mainData.js');
var moment = require('moment');

AFRAME.registerComponent('ui-menu-model', {
	schema: {
		menuHeight: {default: 1.2},
		menuWidth: {default: 2.5},
		menuDepth: {default: 0.3},
		margin: {default: 0.0},
		active: {default: false}
	},
	init: function (){
		this.activeDate = getState('activeDate')
		this.activeModel = getState('activeModel')
		this.setPosition()
		// this.el.setAttribute('visible', false)
		this.createMenu()

		//menu toggle - TODO - add support for VR controller keypress
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
            y:-0.4, 
            z:0
		})			
		layout.appendChild(layoutUpper)
		layout.appendChild(layoutLower)
		
		const timeline = this.createTimelinePanel(layoutUpper)
		
		var headingText = JSON.stringify(mainData.models[this.activeDate].title)
		var descriptionText = JSON.stringify(mainData.models[this.activeDate].description)
		
		const info = this.createInfoPanel(layoutUpper,headingText, descriptionText)
		const nav = this.createNavPanel(layoutLower)
		
		//add positioning logic
		timeline.setAttribute('position', {
            x:-0.5, 
            y:0, 
            z:0
		})
		info.setAttribute('position', {
            x:0.5, 
            y:0, 
            z:0
		})			
		
		this.el.appendChild(layout)

		window.addEventListener('activeDateChanged', (e)=>{
			
			var activeDate = moment(e.detail.activeDate).format("YYYY-MM-DD")

			var headingText = JSON.stringify(mainData.models[activeDate].title)
			var descriptionText = JSON.stringify(mainData.models[activeDate].description)
			this.updateInfoPanel(info,headingText,descriptionText)
			
		})
	},
	createMenuGeo: function(el){
		data = this.data
		globals.createWireframeBox(el,data.menuHeight, data.menuWidth, data.menuDepth)
		globals.createMeshPlaneFill(el,data.menuHeight, data.menuWidth, data.menuDepth)
	},
	createTimelinePanel: function(el){
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
		el.appendChild(timeline);
		return timeline
	},
	createInfoPanel: function(el, title, description){

		var info = document.createElement('a-entity')		
		info.setAttribute('id','info')
		info.setAttribute('ui-panel-info',{
			headingVal: title,
			descriptionVal: description ,
		});
		el.appendChild(info)
		return info
	},
	updateInfoPanel: function(el,title, description){
		var headingEl = el.querySelector('#heading')
		headingEl.setAttribute('text', {value:title})
		var descripEl = el.querySelector('#description')
		descripEl.setAttribute('text', {value:description})
	},
	removeInfoPanel: function(){
		var info = document.getElementById('info')
		info.parentNode.removeChild(info)
	},
	createNavPanel: function(el){
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
		}
		el.appendChild(navButton);
		return navButton
	}
});

