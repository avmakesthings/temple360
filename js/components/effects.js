/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * Effects for A-frame scenes 
 */


AFRAME.registerComponent('camera-mask', {
	schema: {
    },
    init: function(){
        el = this.el
        el.setAttribute('visible', false)

        var geometry = new THREE.SphereGeometry( 3, 32, 32 );
        //makes a nice mask, good for windows 
        var matMul = new THREE.MeshBasicMaterial( {
            // color: 0x826D3D,
            color: 0x5B481B,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.3,
            blending: THREE.MultiplyBlending
        } )
        var matAdd = new THREE.MeshBasicMaterial( {
            // color: 0x826D3D,
            color: 0x5B481B,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        } )



        var sphere = new THREE.Mesh( geometry, matMul );
        el.object3D.add(sphere);


        window.addEventListener('changeActiveScene', (e)=>{
            if(e.detail.activeScene === 'scene360'){
                el.setAttribute('visible', true)
            }else{
                el.setAttribute('visible', false)
            }
		})
    }
})