/* * * + + + + + + + + + + + + + + + + + + + + 
Globals -- 
+ + + + + + + + + + + + + + + + + + + + * * */  
//COLORS
var colWhite = 0xFFFFFF,
    colBlack = 0x000000,
    colAmber = 0x826D3D,
    colClicked01= 0xF333FF,
    colHover01 = 0xF4B942,
    colActive01=  0xFFAA00;

window.globals = window.globals || {

    //FONTS

    //BASIC MATERIALS
    activeMaterial : new THREE.MeshBasicMaterial( {color: colActive01} ),
    inactiveMaterial : new THREE.MeshBasicMaterial({color:colWhite}),
    hoverMaterial : new THREE.MeshBasicMaterial({color:colHover01}),
    wireframeBasicMaterial: new THREE.MeshBasicMaterial( { 
        color: colWhite, 
        opacity: 1,
        wireframe: true, 
    } ),
    wireframeLineMaterial: new THREE.LineBasicMaterial( { color:colWhite, linewidth: 10 } ),
    transAmberMaterial: new THREE.MeshBasicMaterial( {
        color: colAmber,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    } ),

    //PHONG MATERIALS
    modelTransMaterial: new THREE.MeshPhongMaterial( { 
        //ambient: 0x555555, 
        color: 0x555555,
        specular: 0xffffff, 
        shininess: 50, 
        shading: THREE.SmoothShading, 
        transparent: true,
        opacity: 0.5,
    } ),

    //FUNCTIONS
    //a function to recursively set the material of all mesh objects in a given model
    setMaterial : function(geom, material){
        geom.traverse(function(item){
            item.material = material;
        })
    },
    //a function to create a wireframe box
    createWireframeBox: function(el,height,width,depth){
        var geometry = new THREE.BoxGeometry(width,height,depth);
		var geo = new THREE.EdgesGeometry( geometry );
		var mat = this.wireframeLineMaterial;
		var wireframe = new THREE.LineSegments( geo, mat );
		el.object3D.add(wireframe);
    },
    //a function create a planar fill for panels and buttons, can maybe work into wireframe box?
    createMeshPlaneFill: function(el,height,width, depth){
        var plane = new THREE.PlaneGeometry(width,height);
		var mesh = new THREE.Mesh(plane, this.transAmberMaterial);
		mesh.position.z = -(depth/2);
		mesh.updateMatrix();
		el.object3D.add(mesh);
    }

};







