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
        var geometry;
        var timelineMark;
        var textPosition;
    
        //create timeline marker
        geometry = new THREE.BoxGeometry(0.01,.1,0.01);
        timelineMark = new THREE.Mesh( geometry, inactiveMaterial );
        el.setObject3D('mesh', timelineMark);

        //add date label
        // textPosition = this.data.textposition;
        // textPosition.y = textPosition.y-0.2;
        // el.setAttribute('text', {
        //     value: "some text",
        //     height: .2,
        //     letterSpacing: .01
        // } );
        
        el.addEventListener('click', ()=>{
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




//UI component that displays a top model view and the location of navigation markers
// AFRAME.registerComponent('ui-navigation-map', {
// 	schema: {},
// 	init: function (){
// 	}
// });  
