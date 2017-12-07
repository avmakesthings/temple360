/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * A-frame UI-Panel-Info Component
 */

AFRAME.registerComponent('ui-panel-info', {
	schema: {
		preHeading: {default: true},
		heading: {default: true},
		subHeading: {default: false},
		description: {default: true},
		preHeadingVal: {default: "Pre-heading"},
		headingVal: {default: "Title"},
		// subHeadingVal: {default: "Sub-heading"},
		descriptionVal: {default: "Description"},
		preHeadingMixin: {default: "text-panel-sub-heading-2"},
		headingMixin: {default: "text-heading-2"},
		// subHeadingMixin: {default: "text-heading-2"},
		descriptionMixin: {default: "text-description-2"},
		panelID: {default: ""},
		panelHeight: {default: 0.7},
		panelWidth: {default: 1.0},
		panelDepth: {default: 0.2},
		panelMargin: {default: 0.05},
	},
	init: function (){
		
		var panelID = this.data.panelID
		this.createInfoPanel(panelID)
	},
	createText: function(el){

		var data = this.data

		var preHeading = document.createElement('a-entity')
		preHeading.setAttribute('id', 'preHeading')
		preHeading.setAttribute('mixin',data.preHeadingMixin)
		preHeading.setAttribute('text',{
			value: data.preHeadingVal,
		})
		el.appendChild(preHeading)

		var heading = document.createElement('a-entity')
		heading.setAttribute('id', 'heading')
		heading.setAttribute('mixin',data.headingMixin)
		heading.setAttribute('text',{
			value: data.headingVal,
		})
		heading.setAttribute('position',{
			x:0,
			y:-0.056, //placeholder
			z:0
		})
		el.appendChild(heading)

		var description = document.createElement('a-entity')
		description.setAttribute('id', 'description')
		description.setAttribute('mixin',data.descriptionMixin)
		description.setAttribute('text',{
			value: data.descriptionVal,
		})
		description.setAttribute('position',{ //placeholder
			x:0,
			y:-0.454,
			z:0
		})
		el.appendChild(description)
	},
	getTextHeight: function(el){
		//not finished - need to calc bbox of text to 
		//size container
		return 0.1 //placeholder
	},
	calcPanelHeight: function(){
		var panelHeight = 0.5 //placeholder 
		return panelHeight
	},
	createPanelGeo: function(el,height, width, depth){
		globals.createWireframeBox(el,height,width,depth)
		globals.createMeshPlaneFill(el,height,width,depth)
	},
	createInfoPanel: function(panelID){
		var infoContainer = document.createElement('a-entity')
		infoContainer.setAttribute('id', panelID )
		infoContainer.setAttribute('position', {
			x: -0.42,
			y: 0.22,
			z:0
		} )
		this.createText(infoContainer)
		var panelHeight = this.calcPanelHeight(infoContainer)
		this.createPanelGeo(this.el,this.data.panelHeight,this.data.panelWidth,this.data.panelDepth)
		this.el.appendChild(infoContainer)
	}
});
