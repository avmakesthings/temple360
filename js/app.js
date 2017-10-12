/* * * + + + + + + + + + + + + + + + + + + + + 
Temple360 - An A-frame web viewer for the design
& construction of the 2017 Burning Man temple
Author: AV
+ + + + + + + + + + + + + + + + + + + + * * */ 

require('aframe');
require('aframe-state-component');
require('aframe-text-geometry-component');
require('./materials.js');
require('./UIcomponents.js');

var isEqual = require('lodash.isequal');
var moment = require('moment');
var extras = require('aframe-extras'); //fix for A-frame GLtf 2.0 issues
extras.loaders.registerAll(); //Register 'A-frame extras' Loaders package and its dependencies.
var mainData = require('./mainData.js'); //Get JSON data 
var sceneEl = document.querySelector('a-scene'); //Scene element


function getState(event, key){
	return event.target.sceneEl.systems["state"].getState().app[key].toJSON()
}

/* * * + + + + + + + + + + + + + + + + + + + + 
State manager --
Based on K-frame Redux 'State' component  
+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerReducer('app', {
	initialState: {
		locations: mainData.locations,
		dates: mainData.dates,
		activeLocation: mainData.locations["00"],
		activeDate: mainData.dates["2016-11-01"],
		activeModel: {}
	},

	handlers: {
		
		changeDates: function (state, action) {
			var dates = action.dates;
			state.dates = dates;
			console.log('datesChanged',dates)
			AFRAME.scenes[0].emit('datesChanged', {dates});
			return state;
		}, 

		changeLocations: function (state, action) {
			var locations = action.locations;
			state.locations = locations;
			console.log('locationsChanged', locations)
			AFRAME.scenes[0].emit('locationsChanged', {locations});
			return state;
		}, 

		changeActiveDate: function (state, action) {
			var activeDate = action.activeDate;
			state.activeDate = activeDate;
			console.log('activeDateChanged', activeDate)
			AFRAME.scenes[0].emit('activeDateChanged', {activeDate});
			return state;
		},  
		  
		changeActiveLocation: function (state, action) {
			var activeLocation = action.activeLocation;
			state.activeLocation = activeLocation;
			console.log('activeLocationChanged', activeLocation)
			AFRAME.scenes[0].emit('activeLocationChanged', {activeLocation});
			return state;
		},  

		changeActiveModel: function (state, action) {
			var activeModel = action.activeModel;
			state.activeModel = activeModel;
			console.log('activeModelChanged', activeModel)
			AFRAME.scenes[0].emit('activeModelChanged', {activeModel});
			return state;
		},  
	},
});

// Hack to ensure initial state gets published to components
window.onload = function() {
	document.querySelector('a-scene').addEventListener('loaded', function () {
		AFRAME.scenes[0].emit('changeLocations', {
			locations: mainData.locations
		});

		AFRAME.scenes[0].emit('changeDates', {
			dates: mainData.dates
		});

		AFRAME.scenes[0].emit('changeActiveLocation', {
			activeLocation: mainData.locations["00"]
		});

		AFRAME.scenes[0].emit('changeActiveDate', {
			activeDate: mainData.dates["2016-11-01"]
		});

		AFRAME.scenes[0].emit('changeActiveModel', {
			activeModel: {}
		});
	})
}



/* * * + + + + + + + + + + + + + + + + + + + + 
Nav Manager
+ + + + + + + + + + + + + + + + + + + + * * */ 
//creates & locates nav-pt-marker objects, moves camera on location change
AFRAME.registerComponent('nav-manager', {
	schema: {},
	init: function (){
		var el = this.el;

		//create nav markers
		document.querySelector('a-scene').addEventListener('loaded', function () {
			
			var navMarkers = document.createElement('a-entity');
			navMarkers.setAttribute('id', "teleport-markers");
			
			for (var location in mainData.locations){
				var thisLocation = mainData.locations[location];
				var thisMarker = document.createElement('a-entity');

				thisMarker.setAttribute('position', thisLocation.coord);
				thisMarker.setAttribute('id', "marker-" + location);
				thisMarker.setAttribute('ui-nav-pt-marker', {
					location: JSON.stringify(thisLocation)
				});
				navMarkers.appendChild(thisMarker); //add to the scene

				//change camera position when new location is selected
				this.activeCamera = document.querySelector('a-camera');	
				window.addEventListener('activeLocationChanged', (e)=>{
					var l = e.detail.activeLocation.coord;
					this.activeCamera.setAttribute("position",{
						x: l.x, y: l.y+1.7, z: l.z
					});
				});

			}
			el.appendChild(navMarkers); 
			//A-frame debug tools
			document.querySelector('a-entity[ui-nav-pt-marker]').flushToDOM();
		})
	},
});


/* * * + + + + + + + + + + + + + + + + + + + + 
Timeline manager
+ + + + + + + + + + + + + + + + + + + + * * */ 

//Changes the model being viewed based on date change state
AFRAME.registerComponent('timeline-manager', {
	schema: {},
	init: function (){
		var el = this.el;

		document.querySelector('a-scene').addEventListener('loaded', function () {
			var myScene = document.querySelector('a-scene');
			var thisModel = myScene.querySelector("#loaded-model");
			var thisModelOpaque = myScene.querySelector("#loaded-model-opaque");
			var basePosition = {x:-0.3, y:1.5,z:-1};
			var timeline = document.createElement('a-entity');
			timeline.setAttribute('id',"timeline");

			
			for(var date in mainData.dates){
				//console.log(moment(date));
				var thisDate = mainData.dates[date];
				if(thisDate[0].type == "model"){
					
					//create markers
					var tMarker = document.createElement('a-entity');
					tMarker.setAttribute('position', basePosition);
					tMarker.setAttribute('id', moment(date)._d);

					//create marker geometry
					var tGeometry = document.createElement('a-entity');	
					tGeometry.setAttribute('id', "t-mesh");
					tGeometry.setAttribute('ui-time-mark', {
						date: JSON.stringify(thisDate)
					});
					
					//create text labels
					var tText = document.createElement('a-entity');
					tText.setAttribute('id', "t-label");
					tText.setAttribute('ui-time-text', {
						date: JSON.stringify(thisDate),
						textposition: basePosition
					});
					
					tMarker.appendChild(tGeometry);
					tMarker.appendChild(tText);					
					timeline.appendChild(tMarker);
					el.appendChild(timeline); //add to the scene
					basePosition.x += 0.06;

					//document.querySelector('a-entity[ui-time-mark]').flushToDOM();
				}
			}
			
			window.addEventListener('activeDateChanged', function (event) {
				var nextModelPath = event.detail.activeDate[0].source;
				if(nextModelPath){
					thisModel.setAttribute('gltf-model', "url(./assets/" + nextModelPath + ")");
					thisModelOpaque.setAttribute('gltf-model', "url(./assets/" + nextModelPath + ")");
				}
			});
		});
	},
});



/* * * + + + + + + + + + + + + + + + + + + + + 
Model manager 
+ + + + + + + + + + + + + + + + + + + + * * */ 

//Knows whether to render a model view or a 360 
AFRAME.registerComponent('model-manager', {
	schema: {
		activeModel: {default:'model'}
	},
	init: function (){
		//initialize in model view with camera in activeLocation
		var el = this.el;

		document.querySelector('a-scene').addEventListener('loaded', function () {
			
			var bgContainer = document.createElement('a-entity');
			var img_tsixty = document.createElement('a-sky');
			var video_tsixty = document.createElement('a-videosphere');

			//test buttons to toggle between different content types
			var testButtons = document.createElement('a-entity');
			var imgButton = document.createElement('a-triangle');
			var vidButton = document.createElement('a-triangle');
			var modelButton = document.createElement('a-plane');
			var testPosition = {x:0, y:1,z:2};
			var testRotation = {x:0, y:180 ,z:0 };
			var testScale = {x:0.2, y:0.2 ,z:0.2 };
			
			img_tsixty.setAttribute('id','360-image');
			video_tsixty.setAttribute('id','360-video');

			testButtons.setAttribute('position',testPosition);
			testButtons.setAttribute('rotation',testRotation);
			testButtons.setAttribute('scale',testScale);

			bgContainer.setAttribute('id',"view-toggle");
			testButtons.appendChild(imgButton);
			testButtons.appendChild(vidButton);
			testButtons.appendChild(modelButton);
			bgContainer.appendChild(testButtons);

			var buttons = testButtons.getChildren();
			console.log(buttons);
			var j = 0;
			//set button positions
			for(var i =0; i<buttons.length; i++){
				buttons[i].setAttribute('position', {x:0,y:j,j:0});
				j+= 1.5;
			};

			imgButton.setAttribute('text',{value:'image', color: 'red', width:4, align:'center'});
			vidButton.setAttribute('text',{value:'video',color: 'red', width:4, align:'center'});
			modelButton.setAttribute('text',{value:'model',color: 'red', width:4, align:'center'});
			
			bgContainer.appendChild(img_tsixty);
			bgContainer.appendChild(video_tsixty);
			el.appendChild(bgContainer);

			imgButton.addEventListener('click',(e)=> {
				console.log("image clicked");
				//el.emit('activeModelChanged');
				//toggleView('image');
			});

			vidButton.addEventListener('click',(e)=> {

				//toggleView('video');
			});

			modelButton.addEventListener('click',(extras)=> {
				console.log("model clicked");

				//toggleView('model');
			});

		});

	},
	// toggleView: function(view){
	// 	currentView = this.data.activeModel;
	// 	imgEl = document.getElementById('#360-image');
	// 	vidEl = document.getElementById('#360-video');
	// 	if(view =='model'){
	// 		if(currentView == 'image'){
	// 			imgEl.removeAttribute('src');
	// 		}else if(currentView == 'video'){
	// 			vidEl.removeAttribute('src');
	// 		}
	// 	}if(view == 'video'){
	// 		if(currentView == 'image'){
	// 			imgEl.removeAttribute('src');	
	// 		}
	// 		vidEl.setAttribute('src','../assets/360-video.mp4');		
	// 	}if(view == 'image'){
	// 		if(currentView == 'video'){
	// 			vidEl.removeAttribute('src');
	// 		}
	// 		imgEl.setAttribute('src','../assets/360-photo.jpg');
	// 	}
	// 	this.data.activeModel = view;
	// }
});




/* * * + + + + + + + + + + + + + + + + + + + + 
Tests
+ + + + + + + + + + + + + + + + + + + + * * */ 
//Test location change -is event emitted by app?
//is data is available from the event? 
// AFRAME.registerComponent('test-location-change', {
// 	schema: {},
// 	init: function (){
// 		window.addEventListener('activeLocationChanged', function (event) {
// 			console.log(
// 				"Test responding to activeLocationChanged in JS",
// 				event.detail.activeLocation
// 			);
// 		});
// 	}
// });


// Test to location change on click event
// AFRAME.registerComponent('change-location', {
// 	schema: {},
// 	init: function (){
// 		var el = this.el;
// 		var location1 = mainData.locations.ns2;
// 		var location2 = mainData.locations.ns5;
// 		var activeLocation = location1;
// 		el.addEventListener('click', function () {
// 			el.emit('changeActiveLocation', {activeLocation});
// 			if(activeLocation == location1){
// 				activeLocation = location2;
// 			}else{
// 				activeLocation = location1;
// 			}
// 		});
// 	}
// });


//Test date change
AFRAME.registerComponent('test-date-change', {
	schema: {},
	init: function (){
		document.querySelector('a-scene').addEventListener('loaded', function () {
			window.addEventListener('activeDateChanged', function (event) {
				console.log(
					"Test responding to activeDateChanged in JS",
					event.detail.activeDate[0].title
				);
			});
		});

	}
});

//Test date change on-click event
// AFRAME.registerComponent('change-date', {
// 	schema: {},
// 	init: function (){
// 		var el = this.el;
// 		var activeDate;
		
// 		//initialize to the correct date
// 		window.addEventListener('activeDateChanged', (e)=>{
// 			activeDate = e.detail.activeDate;
// 		});
// 		//if clicked emit a change active date event
// 		el.addEventListener('click', function () {
// 			el.emit('changeActiveDate', {activeDate});
// 		});
// 	}
// });