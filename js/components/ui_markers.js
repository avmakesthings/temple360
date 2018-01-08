/* * * + + + + + + + + + + + + + + + + + + + + 
MARKERS : A component which adds/removes markers

+ + + + + + + + + + + + + + + + + + + + * * */

var moment = require("moment");
var getState = require("../getState");

// If no threeSixty is found for this date,
// find the first match within the month if one exists
// Note: assumes they're already sorted
function getFirstThreeSixtyDate(date, locations, threeSixtyImages) {
    var activeDateMonth = moment(activeDate).month();
    var firstThreeSixtyDate = Object.keys(threeSixtyImages).find(date => {
        return moment(date).month() === activeDateMonth;
    });
    return firstThreeSixtyDate;
}

AFRAME.registerComponent("ui-markers", {
    init: function() {
        this.locations = getState("locations");
        this.threeSixtyImages = getState("threeSixtyImages");
        this.activeDate = getState("activeDate");

        this.markers = this.addMarkers();
        this.highlightMarkers();

        window.addEventListener("activeDateChanged", e => {
            this.activeDate = e.detail.activeDate;
            this.clearMarkers();
            this.markers = this.addMarkers();
            this.highlightMarkers();
        });
    },
    // Get all marker locations for the month
    getMarkerLocations: function() {
        var markerLocations = {};
        var activeDateMonth = moment(this.activeDate).month();
        var monthDateKeys = Object.keys(this.threeSixtyImages).filter(
            dateKey => {
                return moment(dateKey).month() === activeDateMonth;
            }
        );

        monthDateKeys.forEach(dateKey => {
            var dateImages = this.threeSixtyImages[dateKey];
            dateImages.forEach(dateImage => {
                var imageLocation = dateImage.location;
                if (!markerLocations[imageLocation]) {
                    markerLocations[imageLocation] = Object.assign(
                        {},
                        this.locations[imageLocation]
                    );
                    // Tacked on as a convenience later
                    markerLocations[imageLocation].first360 = dateImage;
                }
            });
        });

        return markerLocations;
    },

    addMarkers: function() {
        var el = this.el;
        var markers = [];
        var locations = this.getMarkerLocations();

        Object.keys(locations).forEach(locationKey => {
            var location = locations[locationKey];
            if (!location.coord) {
                throw new Error("no coordinates for location: ", location);
            }
            var marker = document.createElement("a-entity");
            var coord = location.coord;
            marker.setAttribute("position", coord);

            marker.setAttribute("ui-marker-content", {});

            marker.clickHandler = e => {
                //should also emit active location change
                this.el.emit("changeActiveLocation", {
                    activeLocation: locationKey
                });

                this.el.emit("changeActiveThreeSixty", {
                    activeThreeSixty: location.first360
                });

                this.el.emit("changeActiveScene", {
                    activeScene: "scene360"
                });
            };

            markers.push(el.appendChild(marker));
        });

        return markers;
    },

    highlightMarkers: function() {
        this.markers.forEach((markerEl, i) => {
            if (markerEl.components["ui-marker-content"]) {
                markerEl.components["ui-marker-content"].highlight(i * 1000);
            }
        });
    },

    clearMarkers: function() {
        this.markers.forEach(markerEl => {
            this.el.removeChild(markerEl);
        });
        this.markers = [];
    }
});
