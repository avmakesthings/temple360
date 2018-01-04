/* * * + + + + + + + + + + + + + + + + + + + + 
UI Manager 
+ + + + + + + + + + + + + + + + + + + + * * */   

require('./globals.js')
require('./components/effects_camera.js');
require('./components/effects_particles.js');
require('./components/ui_button.js');
require('./components/ui_panel-info.js');
require('./components/ui_panel-heading.js');
require('./components/ui_panel-timeline.js');
require('./components/ui_panel-preview.js');
require('./components/ui_menu-home.js');
require('./components/ui_menu-model.js');
require('./components/ui_menu-360.js');
require('./components/ui_markers.js');
require('./components/ui_marker-content.js');


AFRAME.registerComponent('ui-manager', {
	schema: {
    },
    init: function() {
        
        var currentScene

        window.addEventListener('activeSceneChanged',function (e) {
            currentScene = e.detail.activeScene
        })
        
        //same key press .. needs to know what the active scene is 
        //placeholder for toggling menus 
        window.addEventListener('keydown', (e)=>{
            var toggleMenu = e.keyCode === 77 
            if(e.keyCode === 77){
                // Key: m
                console.log('key pressed')
                switch(currentScene){
                    case "sceneHome":
                        this.el.emit('showHomeMenu')
                        break
                    case "scene3DModel":
                        this.el.emit('showModelMenu')
                        break  
                    case "scene360":
                        this.el.emit('show360Menu')
                        break
                    default:
                        console.log('menu toggle switch not working')
                }
            } 
        if(e.keyCode == 27){
            // Key: "escape"
            // Most likely, this is just for debug purposes
            switch(currentScene){
                case "scene3DModel":
                    this.el.emit('changeActiveScene', { 
                        activeScene: 'sceneHome'
                    })
                    break  
                case "scene360":
                    this.el.emit('changeActiveScene', { 
                        activeScene: 'scene3DModel'
                    })
                    break
                default:
                    console.log('scene switch not working')
            }  
        }
        });
    }
})







