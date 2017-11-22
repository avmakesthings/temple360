/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * A-frame Panel Heading Component: 
 * Creates a text heading for a UI panel container
 */

AFRAME.registerComponent('ui-panel-heading', {
	schema: {
        value:{default:''},
        entityID: {default:''},
		width: {default: 1},
        mixin: {default:'text-panel-heading'}
        //add more support for colors later
    },
    init: function (){
        var panelHeading = document.createElement('a-entity');
		panelHeading.setAttribute('id','panelHeading');
		panelHeading.setAttribute('mixins',data.mixin);
		panelHeading.setAttribute('geometry', {
			primitive:'plane',
            height: 'auto',
            width: 'auto'
		});
		panelHeading.setAttribute('material', {
			opacity:0.0,
			transparent: true,
		});		
		panelHeading.setAttribute('text', {
			value: data.value,
			anchor: 'left', //these should be included & working in the mixin but aren't?
			baseline: 'top'
		});
		this.el.appendChild(panelHeading);     
    }
})