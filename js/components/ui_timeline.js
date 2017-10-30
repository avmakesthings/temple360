/* * * + + + + + + + + + + + + + + + + + + + + 
Timeline
+ + + + + + + + + + + + + + + + + + + + * * */  

//require('./../globals.js');


// Marker geometry for UI component to display a range of dates
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
        timelineMark = new THREE.Mesh( geometry, globals.inactiveMaterial );
        el.setObject3D('mesh', timelineMark);
        
        el.addEventListener('click', (e)=>{
            e.stopImmediatePropagation(); //fix for event firing twice
            el.emit('changeActiveDate', {
                activeDate: this.data.date
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
                globals.setMaterial(geom,globals.activeMaterial);
            } else {
                globals.setMaterial(geom,globals.inactiveMaterial);
            }
        }
    }
});

//Text labels for UI component to display a range of dates
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
            align: 'center',
            baseline: 'top',
            value: 'T',
            width: 1.3,
            color: 0xd742f4
        });

        //expanded view title & description

    }
});
