var mainData = require('./mainData.js'); //Get JSON data 
/* * * + + + + + + + + + + + + + + + + + + + + 
Navigation
+ + + + + + + + + + + + + + + + + + + + * * */ 

//creates, locates, activates & deactivates navigation-point-marker objects

AFRAME.registerComponent('nav-manager', {
	schema: {},
	init: function (){
		var el = this.el;
		var i =0;

		//create nav markers
		document.querySelector('a-scene').addEventListener('loaded', function () {
			for (var location in mainData.locations){
				var thisLocation = mainData.locations[location];
				var thisMarker = document.createElement('a-entity');
				thisMarker.setAttribute('position', thisLocation.coord); 
				thisMarker.setAttribute('id', "marker-" + location);
				thisMarker.setAttribute('ui-nav-pt-marker', {active: true } );
				// if (app.activeLocation == location){
				// 	thisMarker.setAttribute('ui-nav-pt-marker', {active: true } );
				// }else{
				// 	thisMarker.setAttribute('ui-nav-pt-marker', {active: false } );
				// }
				//thisMarker.setAttribute('ui-nav-pt-marker', {description:thisLocation.description, active: false } );

				//test geometry
				// thisMarker.setAttribute('geometry', {
				// 	primitive: 'box',
				// 	height: .5,
				// 	width: .5,
				// 	depth: .5
				//   });

				el.appendChild(thisMarker); //add them to the scene

				//console.log(el);
				i++;
			}


		})
				
	},
	// update: function(){
	// 			//get state
				
	// 			//pass state to child when location change is called
	// 			el.addEventListener('activeLocationChanged', function () {
	// 				event.detail.locationData
	// 			});
	// }
});