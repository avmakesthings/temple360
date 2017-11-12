/* * * + + + + + + + + + + + + + + + + + + + + 
PANEL_Preview : previews geom, thumbnail or 360

has:
TBD
+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerComponent('ui-panel-preview', {
	schema: {
		headingText: {default:'some heading'},
		descriptionText: {default:'some description'}
	},
	init: function (){
		
		var el = this.el;
		
		console.log('preview');
		var textHeading = document.createElement('a-entity');
		textHeading.setAttribute('text', {
			value: data.headingText,
			letterSpacing: 3.6,
			width: 2,
			align: 'center'
		});
		el.appendChild(textHeading);
		
		var textDescription = document.createElement('a-entity');
		textDescription.setAttribute('text', {
			value: data.descriptionText,
			letterSpacing: 3.6,
			width: 1,
			align: 'center'
		});
		el.appendChild(textDescription);
    }
});