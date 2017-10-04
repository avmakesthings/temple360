/* * * + + + + + + + + + + + + + + + + + + + + 
UI Components 
These have the display logic 
+ + + + + + + + + + + + + + + + + + + + * * */   
var activeMaterial = new THREE.MeshBasicMaterial( { color: 0xF333FF } );
var inactiveMaterial = new THREE.MeshBasicMaterial( { color: 0xFFA433 } );
var hoverMaterial = new THREE.MeshBasicMaterial( { color: 0x4286f4 } );

function setMaterial (geom, material){
    geom.traverse(function(item){
        item.material = material;
    });
};

//Marker to indicate where a user can teleport within the scene
AFRAME.registerComponent('ui-nav-pt-marker', {
    // multiple: true,
	schema: {
        location: {
            default: "{}",
            parse: function (value) {
                return JSON.parse(value)
            }
        },
        active: {default: false},
        hover: {default:false},
		src: {type: 'asset', default: 'url(/assets/ui-nav-pt-marker.obj)'}
		// collider: {type: 'asset'}
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
                //this.getGeometry().material = hoverMaterial;
                setMaterial(this.getGeometry(),hoverMaterial);
            }
        });

        el.addEventListener('mouseleave', ()=>{
            if(!this.data.active){
                setMaterial(this.getGeometry(),inactiveMaterial);
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
            setMaterial(this.getGeometry(),inactiveMaterial);
            this.el.removeEventListener('model-loaded')
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
                setMaterial(geom,activeMaterial);
                //geom.material = activeMaterial;
            } else {
                //geom.material = inactiveMaterial;
                setMaterial(geom,inactiveMaterial);
            }
        }
    }

});  


//UI component to display content available 
AFRAME.registerComponent('ui-nav-pt-content', {
	schema: {},
	init: function (){
	}
});


//UI component to display a range of dates
AFRAME.registerComponent('ui-timeline', {
	schema: {},
	init: function (){
	}
});


//UI component that displays a top model view and the location of navigation markers
AFRAME.registerComponent('ui-navigation-map', {
	schema: {},
	init: function (){
	}
});  
