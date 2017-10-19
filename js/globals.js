/* * * + + + + + + + + + + + + + + + + + + + + 
Globals -- WIP
+ + + + + + + + + + + + + + + + + + + + * * */  

//fonts


//colors


var activeMaterial = new THREE.MeshBasicMaterial( { color: 0xF333FF } );
var inactiveMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
var hoverMaterial = new THREE.MeshBasicMaterial( { color: 0x4286f4 } );

//a function to recursively set the material of all mesh objects in a given model
function setMaterial (geom, material){
    geom.traverse(function(item){
        item.material = material;
    });
};