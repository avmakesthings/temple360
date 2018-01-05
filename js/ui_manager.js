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

const delay = 2000

AFRAME.registerComponent('ui-manager', {
	schema: {
    },
    init: function() {
        
        this.currentScene

		// TODO: Check that they are supported VR gamepads
		this.gamepadCount = window.navigator.getGamepads().length
		this.reticleActive = true
		this.controls = document.getElementById("controls")

		this.controls.addEventListener('buttondown', this.handleGamePadButtonDown.bind(this))
		window.addEventListener('gamepadconnected', this.handleGamepadConnected.bind(this))
		window.addEventListener('gamepaddisconnected', this.handleGamepadDisonnected.bind(this))        
        window.addEventListener('keydown', this.handleKeyDown.bind(this));

		window.addEventListener('activeSceneChanged',(e)=>{
            this.currentScene = e.detail.activeScene
        })
    },

	tick: function(){

		if(this.gamepadCount > 0 && this.reticleActive){
			setTimeout(()=>{
				if(this.gamepadCount > 0  && this.reticleActive){
					this.toggleReticle()
				}
			}, delay)
		}

		if(this.gamepadCount < 1  && !this.reticleActive){
			setTimeout(()=>{
				if(this.gamepadCount < 1 && !this.reticleActive){
					this.toggleReticle()
				}
			}, delay)
		}
	},

	handleGamepadConnected: function(e){
		// TODO: Validate that this is a VR Controller before incrementing 
		this.gamepadCount+=1
	},

	handleGamepadDisonnected: function(e){
		// TODO: Validate that this is a VR Controller before decrementing
		this.gamepadCount-=1
	},

	handleKeyDown: function(e){
        if(e.keyCode === 77){
            // Key: m
            this.toggleMenu()
        }
	},

	handleGamePadButtonDown: function(e){

		if(e.detail.id === 3){
            // Key: menu
            this.toggleMenu()
        }
	},

	toggleMenu: function(){
	    switch(this.currentScene){
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
	},

	toggleReticle: function(){
		this.reticleActive = !this.reticleActive
		const reticle = document.getElementById("reticle")
		if(this.reticleActive){
			reticle.setAttribute('visible', true)			
		} else {
			reticle.setAttribute('visible', false)			
		}
	}
})







