/* * * + + + + + + + + + + + + + + + + + + + + 
MARKERS : A component which adds/removes markers

+ + + + + + + + + + + + + + + + + + + + * * */ 

// TODO: Rename 'app' to 'appState' or 'state' in app.js
// Move that reducer, the window events, & this helper to the same file
// Import & use this helper wherever appState needs to be pulled
// Require the rest into app.js
function getState(key){
    var sceneEl = document.querySelector('a-scene');
    var appState = sceneEl.systems.state.state.app 
    return appState[key]
}

AFRAME.registerComponent('ui-markers', {

	init: function (){
        this.locations = getState('locations')
        this.threeSixtyImages = getState('threeSixtyImages')
        this.activeDate = getState('activeDate')

        this.markers = this.addMarkers()
        this.highlightMarkers()

        window.addEventListener('activeDateChanged',(e)=> {
            this.activeDate = getState('activeDate')
            this.markers = this.addMarkers()
            this.highlightMarkers()
        });        
    },

    getMarkerData: function(){
        return this.threeSixtyImages[this.activeDate] || []
    },

	addMarkers: function(){
        var el = this.el;
        var markers = []
        var markerData = this.getMarkerData()

        markerData.forEach((thisMarkerData)=>{
            var marker = document.createElement('a-entity');
            var coord = this.locations[thisMarkerData.location].coord
            marker.setAttribute('position', coord)
            
            marker.setAttribute('ui-marker-content', {
                data: thisMarkerData
            })
            
            markers.push(el.appendChild(marker))
        })

        return markers
    },

    highlightMarkers: function(){
        this.markers.forEach((el, i)=>{
            el.components['ui-marker-content'].highlight(i*500);
        })
    },
    
    clearMarkers: function(){
        
    }
});