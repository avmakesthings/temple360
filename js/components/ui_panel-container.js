/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * @author JohnFaichney / http://github.com/johnfaichney
 * 
 * A-frame Panel Container Component: 
 * 
 * Creates a panel container 
 * Lays out child components within a panel container
 * Listens for child added events
 * Recalculates the bounding container size
 * Reflows layout to fit new children
 */

// should the position relative to the parent be set here?
// alignment options for children within the container --eg. float left, right, etc
// basepoint within the container for children to layout from -- defaults to center


const reflowPlaneToDir = {
    'xy': 'y', 
    'yz': 'z',  
    'xz': 'x'
}


/*
    6---7
   /|  /|
  2---3 |
  | 4-|-5
  |/  |/ 
  0---1

  0: min
  1: (max.x, min.y, min.z)
  2: (min.x, max.y, min.z)
  3: (max.x, max.y, min.z)
  4: (min.x, min.y, max.z)
  5: (max.x, min.y, max.z)
  6: (min.x, max.y,  max.z)
  7: max
  
*/
function previewBBox(parentObject3D, bbox){

    if(!parentObject3D.isObject3D || !bbox.isBox3){
        throw new Error("Expected Object3D & Box3 for previewBBox")
    }

    var material = new THREE.LineBasicMaterial({ 
        color: 0xf44295,
        linewidth: 2
    });
    var geometry = new THREE.Geometry();
    var min = bbox.min
    var max = bbox.max

    var v = [
        min,
        new THREE.Vector3(max.x, min.y, min.z),
        new THREE.Vector3(min.x, max.y, min.z),
        new THREE.Vector3(max.x, max.y, min.z),
        new THREE.Vector3(min.x, min.y, max.z),
        new THREE.Vector3(max.x, min.y, max.z),
        new THREE.Vector3(min.x, max.y, max.z),
        max
    ]

    var indices = [0,1,3,2,0,4,6,2,3,7,6,4,5,7,3,1,5]
    // var indices = [0,1,3,2]

    indices.forEach((i)=>{
        geometry.vertices.push(v[i])
    })

    var group = document.createElement('a-entity')
    parentObject3D.el.appendChild(group)

    var line = new THREE.Line(geometry, material);
    
    group.object3D.add(line)
}

// Note: Depth is an arbitrary parameter, since text is 2D
function getTextBBox(object3D, depth=10){
    var scale = object3D.scale
    var bbox = new THREE.Box3()
    bbox.setFromBufferAttribute(object3D.geometry.attributes.position)

    var min = new THREE.Vector3(
        bbox.min.x*scale.x, 
        bbox.max.y*scale.y,   
        0*scale.z
    )

    var max = new THREE.Vector3(
        bbox.max.x*scale.x, 
        bbox.min.y*scale.y,
        depth*scale.z
    )
    
    // TODO: Handle cases where text has different 
    // align/baseline attributes.
    // For now, it expects align: left & basline: bottom
    return  new THREE.Box3(min, max)
}

// TODO: This should be as simple as:
// return bbox = new THREE.Box3().setFromObject(object3D)
// But there are some funny things going on with transforms...
// for now, this works:
function getDefaultBBox(object3D){
    var scale = object3D.scale
    var bbox = new THREE.Box3()
    bbox.setFromBufferAttribute(object3D.geometry.attributes.position)

    var min = new THREE.Vector3(
        bbox.min.x*scale.x, 
        bbox.min.y*scale.y,  
        bbox.min.z*scale.z, 
    )

    var max = new THREE.Vector3(
        bbox.max.x*scale.x, 
        bbox.max.y*scale.y, 
        bbox.max.z*scale.z, 
    )
    return  new THREE.Box3(min, max)
}


function getBBox(object3D){
    var bbox;

    if(!object3D.geometry){
        // TODO: verify that it is a group..
        // TODO: Make sure it has a ui-panel-container
        if( object3D.el.components["ui-panel-container"]){
            return object3D.el.components["ui-panel-container"].getBBox()
        } else {
            // FIXME: Huge hack to not error out on 
            // groups with unknown consequences
            return new THREE.Box3()
        }
    }

    if(object3D.constructor.name == "Line"){
        bbox = new THREE.Box3()
        return bbox
    }

    switch (object3D.geometry.constructor.name){
        case "TextGeometry":
            bbox = getTextBBox(object3D)
            // previewBBox(object3D.parent, bbox)
            return bbox
            break;
        default:
            bbox = getDefaultBBox(object3D)
            // previewBBox(object3D.parent, bbox)
            return bbox
    }
}

//gets length of a bounding box in a specifed direction
//bc .getSize() wasn't working? 
function getBBoxDimInDir(dir,bbox){

    var min = bbox.min
    var max = bbox.max
    var dim

    switch(dir){
        case 'x':
            dim = max.x - min.x
            return dim
        case 'y':
            dim = max.y - min.y
            return dim
        case 'z':
            dim = max.z - min.z
            return dim
    }
}

//computes a total bounding box based on child bounding boxes
function getTotalBBoxFromMeshArr(childMeshArray){
    
    var concatBBox = new THREE.Box3()
    childMeshArray.forEach(function(childMesh){
        var thisBBox = getBBox(childMesh)
        concatBBox.union(thisBBox)
    })
    return concatBBox
} 


//horizontally align a bounding box
// function alignBBoxHorizontal(bbox,alignment,dir){
    
//     var offset
//     var vecTranslate

//     switch(dir){
//         case 'x':
//             offset = (bbox.getSize().x)/2
//             vecTranslate = new THREE.Vector3(offset,0,0)
//             break
//         case 'z':
//             offset = (bbox.getSize().z)/2
//             vecTranslate = new THREE.Vector3(0,0,offset)            
//             break
//     }
//     switch(alignment){
//         case 'left':
//             bbox.translate(vecTranslate)
//             return bbox
//         case 'right':
//             bbox.translate(-1*vecTranslate)
//             return bbox
//     }
// }

//vertically align a bounding box
// function alignBBoxVertical(bbox,alignment,dir){
    
//     var offset = (bbox.getSize().y)/2
//     var vecTranslate =new THREE.Vector3(0,offset,0)

//     switch(alignment){
//         case 'top':
//             bbox.translate(vecTranslate)
//             return bbox
//         case 'bottom':
//             bbox.translate(-1*vecTranslate)
//             return bbox
//     }
// }



// Groups do not generate valid bboxes, 
// so it is sometimes convenient to flatten 
// them out of the hierarchy
function skipGroups(object3D){
    // Special provisions needed 
    // for when children are containers?:
    isNotContainer = !object3D.el.hasAttribute('ui-panel-container') // TODO: Test if this is right...

    if(object3D.type == "Group"  && object3D.children.length > 0 && isNotContainer){
        return object3D.children.map((child)=>{
            return skipGroups(child)
        }).reduce(function(prev, curr) {
            return prev.concat(curr);
        });
    } else {
        return [object3D]
    } 
}

function getChildMeshArrays(object3D){
    return object3D.children.map((child)=>{
        return skipGroups(child)
    })
}



AFRAME.registerComponent('ui-panel-container', {
	schema: {
        panelType:{default:'scale-to-fit'},
        reflowPlane: {default: 'xy'},
        reverse: {default: true},
        wireframe: {default: true},
        panelID: {default:''},
		panelTitle: {default:''},
		panelHeight: {default:1.0},
		panelWidth:{default:0.5},
        panelDepth:{default:0.2},
        panelMargin: {default:0.0},
        boundingBoxOn: {default: true},
        verticalAlign: {default: 'bottom'},
        horizontalAlign: {default: 'left'}
        //add more support for themes later
	},
	init: function (){
        
        if(data.panelID){
            this.el.setAttribute('id', data.panelID);   
        }
     
        setTimeout(()=>{
            this.reflow();
            this.createContainerGeo()
        }, 0)
        
        this.el.addEventListener('child-attached', (e)=> {
            this.reflow();
        });
    },
    reflow: function(){
        console.log("reflow!!")
        const children = this.el.children
        const reflowDir = reflowPlaneToDir[this.data.reflowPlane]
        let totalLengthInDir = 0
        let i = 0
        let childBBoxes = []
        let transformedChildBBoxes = []
        childMeshArrays = getChildMeshArrays(this.el.object3D)

        //TODO- support different transform positions. currently text transform is
        //located bottom, back left while geo transforms are centered
        childMeshArrays.forEach((childMeshArray, i)=>{

            let bbox = getTotalBBoxFromMeshArr(childMeshArray)

            let boxSize = bbox.getSize()

            totalLengthInDir += boxSize[reflowDir] 
            let nextPos = new THREE.Vector3(0,0,0)

            if(this.data.reverse) { 
                nextPos[reflowDir] = totalLengthInDir * -1
            }else{
                nextPos[reflowDir] = totalLengthInDir
            }
            children[i].setAttribute("position", nextPos)
            totalLengthInDir += this.data.panelMargin
            childBBoxes.push(bbox)
            
            let transformedBBox = new THREE.Box3().copy(bbox)
            transformedBBox.translate(childMeshArray[0].parent.position)
            
            transformedChildBBoxes.push(transformedBBox)
        }) 

        let concatBBox = new THREE.Box3()
        transformedChildBBoxes.forEach(function(thisBBox){
            return concatBBox.union(thisBBox)
        })
        
        concatBBox.expandByScalar(0.01)
        this.setBBox(concatBBox)
        // previewBBox(this.el.object3D, concatBBox)
    },
    setBBox: function(bbox){
        this.bbox = bbox
    },
    getBBox: function(){
        if(this.bbox){
            return this.bbox
        } else {
            console.log("default BBOX!")
            return new THREE.Box3()
        }
    },
    previewBBox: function(){
        previewBBox(this.el.object3D, this.getBBox())
    },
    createContainerGeo: function(){
        const el = this.el
        const data = this.data

        switch(data.panelType){
            case 'fixed':
                if(data.wireframe){
                    globals.createWireframeBox(el,data.panelHeight,data.panelWidth,data.panelDepth);
                    globals.createMeshPlaneFill(el,data.panelHeight, data.panelWidth, data.panelDepth);
                }
                break
            case 'scale-to-fit':


                break
        }

    }
    

})