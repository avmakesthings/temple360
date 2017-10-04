/* * * + + + + + + + + + + + + + + + + + + + + 
UI Components 
These have the display logic 
+ + + + + + + + + + + + + + + + + + + + * * */   
var activeMaterial = new THREE.MeshBasicMaterial( { color: 0xF333FF } );
var inactiveMaterial = new THREE.MeshBasicMaterial( { color: 0xFFA433 } );
var hoverMaterial = new THREE.MeshBasicMaterial( { color: 0xFFA433 } );

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
		src: {type: 'asset'}
		// collider: {type: 'asset'}
	},
	init: function (){
        var el = this.el
        this.setGeometry()

        el.addEventListener('click', ()=>{
            el.emit('changeActiveLocation', {
                activeLocation: this.data.location
            });
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
		var geometry = new THREE.BoxGeometry(0.2,0.2,0.2);
        var cube = new THREE.Mesh( geometry, inactiveMaterial );
        this.el.setObject3D('geometry', cube)
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
                geom.material = activeMaterial;
            } else {
                geom.material = inactiveMaterial;
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
