/* * * + + + + + + + + + + + + + + + + + + + + 
MARKER_Content : A 3D UI element with content 
associated with it

has:
geom
material
location (in model)
content (similar to value)
onHover
onClick


+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerComponent('ui-marker-content', {
	schema: {},

	init: function (){
		
		this.addOBJ('base')
		this.addOBJ('bottom')

		this.addOBJ('fill')
		this.addOBJ('top')
		
		this.animate()
	},


	addOBJ: function(type, prefix='ui_content-marker-'){
		this[type] = document.createElement('a-entity');

		const solidObj = document.createElement('a-entity');
		solidObj.setAttribute('obj-model', `obj: #${prefix}${type}`);
		solidObj.addEventListener("model-loaded", (e)=>{
			globals.setMaterial(solidObj.object3D, globals.transAmberMaterial)
		});
		this[type].appendChild(solidObj)

		const wireObj = document.createElement('a-entity');
		wireObj.setAttribute('obj-model', `obj: #${prefix}${type}`);
		wireObj.addEventListener("model-loaded", (e)=>{
			globals.setMaterial(wireObj.object3D, globals.wireframeBasicMaterial)
		});
		this[type].appendChild(wireObj)


		return this.el.appendChild(this[type]);
	},

	highlight: function(delay){
		const beacon = document.createElement('a-entity');
		const visibleFor = 15000

		beacon.setAttribute('geometry',{
			primitive: 'cone',
			radiusBottom: 0.25, 
			radiusTop: 0.25,
			height: 400
		})

		beacon.setAttribute('material',{
			color: '#f8ff44',
			transparent: true,
			opacity: 0
		})

		const animation = document.createElement('a-animation');
		animation.setAttribute('attribute', 'material.opacity');
		animation.setAttribute('direction', 'alternate')  
		animation.setAttribute('easing', 'ease-cubic')  
		animation.setAttribute('dur', visibleFor/6) 
		animation.setAttribute('from', '0');
		animation.setAttribute('to', '0.25');
		animation.setAttribute('repeat', 6) 

		setTimeout(()=>{
			this.el.appendChild(beacon)
			beacon.appendChild(animation)

			setTimeout(()=>{
				this.el.removeChild(beacon)
			}, visibleFor+1000)

		}, delay)
	},

	animate: function(){
		this.addRotationAnimation(this['fill'], 10000)
		this.addRotationAnimation(this['top'], 5000)
	},

	addRotationAnimation: function(el, dur){
		const animation = document.createElement('a-animation');
		animation.setAttribute('attribute', 'rotation')   
		animation.setAttribute('direction', 'normal')  
		animation.setAttribute('easing', 'linear')  
		animation.setAttribute('dur', dur) 
		animation.setAttribute('fill', 'forwards') 
		animation.setAttribute('to', '0 360 0') 
		animation.setAttribute('repeat', 'indefinite') 
		el.appendChild(animation)
	}


});