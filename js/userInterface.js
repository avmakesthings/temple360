/* * * + + + + + + + + + + + + + + + + + + + + 
UI Components 
Layout for UI?? need to rethink this
+ + + + + + + + + + + + + + + + + + + + * * */   

require('./components/ui_nav-pt-marker.js');
require('./components/ui_timeline.js');
require('./components/ui_buttons.js');
var moment = require('moment');


/* * * + + + + + + + + + + + + + + + + + + + + 
360 View Components
+ + + + + + + + + + + + + + + + + + + + * * */  
AFRAME.registerComponent('view-toggle-test',{
    schema:{
        activeButton: {default: 'home'}
    },
    init: function(){
        var el = this.el;
        var testPosition = {x:0, y:1,z:2};
        var testRotation = {x:0, y:180 ,z:0 };
        var testScale = {x:0.2, y:0.2 ,z:0.2 };

        el.setAttribute('position',testPosition);
        el.setAttribute('rotation',testRotation);
        el.setAttribute('scale',testScale);

        var imgButton = document.createElement('a-triangle');
        var homeButton = document.createElement('a-triangle');
        var modelButton = document.createElement('a-plane');

        el.appendChild(imgButton);
        el.appendChild(homeButton);
        el.appendChild(modelButton);

        var buttons = el.getChildren();
        var j = 0;
        //set button positions
        for(var i =0; i<buttons.length; i++){
            buttons[i].setAttribute('position', {x:0,y:j,j:0});
            j+= 1.5;
        };

        imgButton.setAttribute('text',{value:'image', color: 'red', width:4, align:'center'});
        homeButton.setAttribute('text',{value:'home',color: 'red', width:4, align:'center'});
        modelButton.setAttribute('text',{value:'model',color: 'red', width:4, align:'center'});

        //el.flushToDOM();

        imgButton.addEventListener('click',()=> {
            console.log("image clicked");
            this.el.emit('activeSceneChanged',{ 
                activeScene: 'scene360' 
            });
        });

        homeButton.addEventListener('click',()=> {
            console.log("home clicked");
            this.el.emit('activeSceneChanged',{ 
                activeScene: 'sceneHome' 
            });
        });

        modelButton.addEventListener('click',()=> {
            console.log("model clicked");
            this.el.emit('activeSceneChanged',{ 
                activeScene: 'scene3DModel' 
            });
        });

    }
});


/* * * + + + + + + + + + + + + + + + + + + + + 
Buttons
+ + + + + + + + + + + + + + + + + + + + * * */  
