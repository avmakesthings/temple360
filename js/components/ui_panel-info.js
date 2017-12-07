/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * A-frame UI-Panel-Info Component
 */

AFRAME.registerComponent('ui-panel-info', {
	schema: {
		headingVal: {default: "Title"},
		descriptionVal: {default: "Description"},
		// headingMixin: {default: ""},
		// descriptionMixin: {default: ""},
		panelID: {default: ""},
		panelHeight: {default: 0.7},
		panelWidth: {default: 1.0},
		panelDepth: {default: 0.2},
		panelMargin: {default: 0.05}
	},
	init: function (){
		var panelID = this.data.panelID

		this.createInfoPanel(panelID)

	}, //option to add a lifecycle method when the panel
	//height is recalculated instead of event listener? 
	createText: function(el){

		var data = this.data
		var textGeoMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.0
		})

		var heading = document.createElement('a-entity')
		heading.setAttribute('id', 'heading')
		heading.setAttribute('text',{
			value: data.headingVal,
			anchor: 'left'
		})
		// heading.setAttribute('mixin',{
		// 	value: data.headingMixin
		// }),
		heading.setAttribute('geometry',{
			primitive:'plane',
			height: 'auto',
			width: 'auto'
		})
		heading.setAttribute('material',textGeoMat)
		el.appendChild(heading)

		var description = document.createElement('a-entity')
		description.setAttribute('id', 'description')
		description.setAttribute('text',{
			value: data.descriptionVal,
			anchor: 'left'
		})
		// description.setAttribute('mixin',{
		// 	value: data.headingMixin
		// })
		description.setAttribute('position',{
			x:0,
			y:-this.getTextHeight(heading)-0.01, //placeholder
			z:0
		})
		// description.setAttribute('geometry',{
		// 	primitive:'plane',
		// 	height: 'auto',
		// })
		description.setAttribute('material',textGeoMat)
		el.appendChild(description)
	},
	getTextHeight: function(el){
		// textObj = el.components.el.attributes.components.
		// return textEl.components.geometry.height
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
			x: -0.45,
			y: 0.1,
			z:0
		} )
		this.createText(infoContainer)
		var panelHeight = this.calcPanelHeight(infoContainer)
		this.createPanelGeo(this.el,this.data.panelHeight,this.data.panelWidth,this.data.panelDepth)
		this.el.appendChild(infoContainer)
	},
	removeInfoPanel: function(panelID){
		thisPanel = document.querySelector('#'+ panelID)
		thisPanel.parentNode.removeChild(thisPanel)
	}
});
