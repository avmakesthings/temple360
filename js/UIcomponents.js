/* * * + + + + + + + + + + + + + + + + + + + + 
UI Components 
These have the display logic 
+ + + + + + + + + + + + + + + + + + + + * * */   

var moment = require('moment');

var activeMaterial = new THREE.MeshBasicMaterial( { color: 0xF333FF } );
var inactiveMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
var hoverMaterial = new THREE.MeshBasicMaterial( { color: 0x4286f4 } );

//a function to recursively set the material of all mesh objects in a given model
function setMaterial (geom, material){
    geom.traverse(function(item){
        item.material = material;
    });
};


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
                setMaterial(geom,activeMaterial);
            } else {
                setMaterial(geom,inactiveMaterial);
            }
        }
    }

});  


//UI component to display content available 
// AFRAME.registerComponent('ui-nav-pt-content', {
// 	schema: {},
// 	init: function (){
// 	}
// });

/* * * + + + + + + + + + + + + + + + + + + + + 
Timeline
+ + + + + + + + + + + + + + + + + + + + * * */  

// //UI component to display a range of dates
AFRAME.registerComponent('ui-time-mark', {
	schema: {
        date: {
            default: "{}",
            parse: function (value) {
                return JSON.parse(value)
            }
        },
        active: {default: false},
        hover: {default:false}
    },
	init: function (){
        var el = this.el;
        var geometry;
        var timelineMark;
    
        //create timeline marker
        geometry = new THREE.BoxGeometry(0.02,.1,0.01);
        timelineMark = new THREE.Mesh( geometry, inactiveMaterial );
        el.setObject3D('mesh', timelineMark);
        
        el.addEventListener('click', (e)=>{
            e.stopImmediatePropagation(); //fix for event firing twice
            el.emit('changeActiveDate', {
                activeDate: this.data.date
            });
        });

        el.addEventListener('mouseenter', ()=>{
            if(!this.data.active){
                setMaterial(this.getGeometry(),hoverMaterial);
            }
        });

        el.addEventListener('mouseleave', ()=>{
            if(!this.data.active){
                setMaterial(this.getGeometry(),inactiveMaterial);
            }
        });

        window.addEventListener('activeDateChanged', (e)=>{
            activeDate = e.detail.activeDate
            if(activeDate === this.data.date){
                this.el.setAttribute("ui-time-mark", "active: true")
            } else {
                this.el.setAttribute("ui-time-mark", "active: false")
            }

        // el.flushToDOM();

        });
    },//TO-DO -rewrite to be global
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
            } else {
                setMaterial(geom,inactiveMaterial);
            }
        }
    }
});


AFRAME.registerComponent('ui-time-text', {
	schema: {
        textposition: {type:'vec3', default:{x:0,y:0,z:0}},
        date: {
            default: "{}",
            parse: function (value) {
                return JSON.parse(value)
            }
        },
        active: {default: false},
        hover: {default:false}
    },
    init: function (){
        var el = this.el;

        //date label for marker
        textPosition = this.data.textposition;
        textPosition.y -= 0.1;
        el.setAttribute('position',textPosition );
        el.setAttribute('text', {
            align: "center",
            baseline: "top",
            value: 'T',
            width: 1.3,
            color: 0xd742f4
        });

        //expanded view title & description

    }
});





//UI component that displays a top model view and the location of navigation markers
// AFRAME.registerComponent('ui-navigation-map', {
// 	schema: {},
// 	init: function (){
// 	}
// });  
