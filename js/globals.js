/* * * + + + + + + + + + + + + + + + + + + + + 
Globals -- 
+ + + + + + + + + + + + + + + + + + + + * * */  
window.globals = window.globals || {

    //FONTS


    //COLORS


    //BASIC MATERIALS
    activeMaterial : new THREE.MeshBasicMaterial( { color: 0xF333FF } ),
    inactiveMaterial : new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ),
    hoverMaterial : new THREE.MeshBasicMaterial( { color: 0x4286f4 } ),

    //FUNCTIONS
    //a function to recursively set the material of all mesh objects in a given model
    setMaterial : function(geom, material){
        geom.traverse(function(item){
            item.material = material;
        })
    }

};







