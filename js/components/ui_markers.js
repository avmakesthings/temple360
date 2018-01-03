/* * * + + + + + + + + + + + + + + + + + + + + 
MARKERS : A component which adds/removes markers

+ + + + + + + + + + + + + + + + + + + + * * */ 

var moment = require('moment');
var getState = require('../getState')

// If no threeSixty is found for this date, 
// find the first match within the month if one exists
// Note: assumes they're already sorted
function getFirstThreeSixty(activeDate, threeSixtyImages){
    var activeDateMonth = moment(activeDate).month()
    var firstThreeSixty = Object.keys(threeSixtyImages).find((date)=>{
        return moment(date).month() === activeDateMonth
    })
    return firstThreeSixty
}

AFRAME.registerComponent('ui-markers', {

	init: function (){
        this.locations = getState('locations')
        this.threeSixtyImages = getState('threeSixtyImages')
        this.activeDate = getState('activeDate')
        
        this.bestDate = getFirstThreeSixty(this.activeDate, this.threeSixtyImages)

        this.markers = this.addMarkers()
        // this.highlightMarkers()

        window.addEventListener('activeDateChanged',(e)=> {
            this.activeDate = e.detail.activeDate
            this.clearMarkers()
            this.markers = this.addMarkers()
            // this.highlightMarkers()
        });        
    },

    getMarkerData: function(){
        return this.threeSixtyImages[this.bestDate] || []
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
            
            marker.clickHandler = (e)=>{
                console.log("Clicked: ", thisMarkerData)
            
                //should also emit active location change
                this.el.emit('changeActiveLocation', { 
                        activeLocation: thisMarkerData.location
                })
                this.el.emit('changeActiveThreeSixty', { 
                        activeThreeSixty: thisMarkerData
                })
                // setTimeout(()=>{
                this.el.emit('changeActiveScene', { 
                        activeScene: 'scene360'
                    })
                // }, 2000)
            }

            markers.push(el.appendChild(marker))
        })

        return markers
    },

    highlightMarkers: function(){
        this.markers.forEach((markerEl, i)=>{
            markerEl.components['ui-marker-content'].highlight(i*500);
        })
    },
    
    clearMarkers: function(){
        this.markers.forEach((markerEl)=>{
            this.el.removeChild(markerEl)
        })
        this.markers = []
    }
});