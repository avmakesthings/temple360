//Behaviour for a button that resets 
AFRAME.registerComponent('ui-button-scene-nav', {
  schema: {
    nextScene: {type: 'string'},
  },
  init: function () {
    var data = this.data;
    var el = this.el;
    el.addEventListener('click', (e)=>{
      this.el.emit('activeSceneChanged',{ 
        activeScene: data.nextScene
      });
      console.log('clicked');
    });
  },
  setupFadeAnimation: function () {
    // Appends an <a-animation> that fades to black.
  }
});