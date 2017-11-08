/* * * + + + + + + + + + + + + + + + + + + + + 
PANEL_Timeline : panel 2 level timeline component

has:
visual indicator
Parse dateTime strings for models/360 keys
Has configuration object like this:
{ 
model: {
 levels: [“year”,”month”], 
 onClick: (nextModel)=>{}
},
360: {
levels: { [“month”, “day”],
 onClick: (next360)=>{}

}
}
Uses configuration object and parsed dates to create hierarchical indicator
onClick
Calls specified onClick callback


+ + + + + + + + + + + + + + + + + + + + * * */ 

AFRAME.registerComponent('ui-panel-timeline', {
	schema: {},
	init: function (){

    }
});