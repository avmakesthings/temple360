/* * * + + + + + + + + + + + + + + + + + + + + 
Navigation Markers
+ + + + + + + + + + + + + + + + + + + + * * */  

//Marker to indicate where a user can teleport within the scene
AFRAME.registerComponent('ui-nav-pt-marker', {
	schema: {
        location: {
            default: "{}",
            parse: function (value) {
                return JSON.parse(value)
            }
        },
        active: {default: false},
        hover: {default:false},
		src: {type: 'asset', default: 'url(/assets/ui-nav-pt-top.obj)'}
	},
	init: function (){
        var el = this.el;
        this.setGeometry();
        var callback = ()=>{}
       
        setTimeout(callback,0);
        
        el.addEventListener('click', ()=>{
            el.emit('changeActiveLocation', {
                activeLocation: this.data.location
            });
        });

        el.addEventListener('mouseenter', ()=>{
            if(!this.data.active){
                globals.setMaterial(this.getGeometry(),globals.hoverMaterial);
            }
        });

        el.addEventListener('mouseleave', ()=>{
            if(!this.data.active){
                globals.setMaterial(this.getGeometry(),globals.inactiveMaterial);
            }
        });

        window.addEventListener('activeLocationChanged', (e)=>{
            activeLocation = e.detail.activeLocation
            if(activeLocation === this.data.location){
                this.el.setAttribute("ui-nav-pt-marker", "active: true")
            } else {
                this.el.setAttribute("ui-nav-pt-marker", "active: false")
            }
        });
        
    },
    setGeometry: function(){
        this.el.setAttribute('obj-model', {obj: this.data.src});
        
        this.el.addEventListener('model-loaded', ()=>{
            globals.setMaterial(this.getGeometry(),globals.inactiveMaterial);
            //this.el.removeEventListener('model-loaded')
        });
    },
    getGeometry: function(){
        if(this.el.object3D && this.el.object3D.children.length > 0){
            return this.el.object3D.children[0]
        }
        return null
    },
    update: function(){
        var geom = this.getGeometry()
        if(geom){
            if(this.data.active){
                globals.setMaterial(geom,globals.activeMaterial);
            } else {
                globals.setMaterial(geom,globals.inactiveMaterial);
            }
        }
    }

});  