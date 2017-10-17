/* * * + + + + + + + + + + + + + + + + + + + + 
Tests
+ + + + + + + + + + + + + + + + + + + + * * */ 
//Test location change -is event emitted by app?
//is data is available from the event? 
AFRAME.registerComponent('test-location-change', {
	schema: {},
	init: function (){
		window.addEventListener('activeLocationChanged', function (event) {
			console.log(
				"Test responding to activeLocationChanged in JS",
				event.detail.activeLocation
			);
		});
	}
});


// Test to location change on click event
AFRAME.registerComponent('change-location', {
	schema: {},
	init: function (){
		var el = this.el;
		var location1 = mainData.locations.ns2;
		var location2 = mainData.locations.ns5;
		var activeLocation = location1;
		el.addEventListener('click', function () {
			el.emit('changeActiveLocation', {activeLocation});
			if(activeLocation == location1){
				activeLocation = location2;
			}else{
				activeLocation = location1;
			}
		});
	}
});


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
AFRAME.registerComponent('change-date', {
	schema: {},
	init: function (){
		var el = this.el;
		var activeDate;
		
		//initialize to the correct date
		window.addEventListener('activeDateChanged', (e)=>{
			activeDate = e.detail.activeDate;
		});
		//if clicked emit a change active date event
		el.addEventListener('click', function () {
			el.emit('changeActiveDate', {activeDate});
		});
	}
});