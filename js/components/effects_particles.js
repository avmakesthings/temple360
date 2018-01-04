/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * 
 * A-frame Particle system component using Shader Particle Engine
 * by @squarefeet https://github.com/squarefeet/ShaderParticleEngine
 */

var SPE = require('../scripts/SPE.min.js');

AFRAME.registerComponent('particles', {
	schema: {
		preset: {type:'', default: 'dustCloud'}
    },
    init: function(){

        switch(this.data.preset){
            case 'dustCloud':
                this.createDustCloud()
                break
            case 'fireflies':
                this.createFireflies()
                break
            default:
                console.log('no particle system preset selected')
        }
    },
    tick: function(){
        
        this.particleGroup.tick( this.timeDelta/2 )
    },
    createDustCloud: function(){
 
        var texture = new THREE.TextureLoader().load( '../assets/cloud.png' )

        var particleGroup = this.particleGroup = new SPE.Group({
            texture: {
                value: texture
            },
            blending: THREE.NormalBlending,
            fog: true,
            maxParticleCount: 750
        });

        var emitter = new SPE.Emitter({
            particleCount: 300,
            maxAge: {
                value: 30,
            },
            position: {
                value: new THREE.Vector3( 0, -15, -50 ),
                spread: new THREE.Vector3( 100, 30, 100 )
            },
            velocity: {
                value: new THREE.Vector3( 0, 0, 2 )
            },
            wiggle: {
                spread: 10
            },
            size: {
                value: 75,
                spread: 50
            },
            opacity: {
                value: [ 0, 0.2, 0 ]
            },
            color: {
                value: new THREE.Color( 244, 206, 168 ),
                spread: new THREE.Color( 0.1, 0.1, 0.1 )
            },
            angle: {
                value: [ 0, Math.PI * 0.125 ]
            }
        });

        particleGroup.addEmitter( emitter )
        this.el.object3D.add( particleGroup.mesh )
        
        
    },
    createFireflies: function(){

        var thisTex = new THREE.TextureLoader().load( '../assets/smokeparticle.png' )

        var particleGroup = this.particleGroup = new SPE.Group({
            texture: {
                value: thisTex
            },
            maxParticleCount: 200
        });
        var emitter = new SPE.Emitter({
            type: SPE.distributions.BOX,
            maxAge: {
                value: 20
            },
            position: {
                value: new THREE.Vector3(0, 10, 0),
                spread: new THREE.Vector3( 100, 100, 100)
            },
            acceleration: {
                value: new THREE.Vector3(0, 0, 0),
                spread: new THREE.Vector3( 0, 0, 0 )
            },
            velocity: {
                value: new THREE.Vector3(1, 0.3, 1),
                spread: new THREE.Vector3(0.5, 1, 0.5)
            },
            color: {
                value: new THREE.Color('white')
            },
            size: {
                value: 1
            },
            particleCount: 100,
            randomize: false,
            opacity: {
                value: [ 1 ]
            },
            direction: 1,
            rotationAxis:'x',
            rotationAngle: 3.14,
            duration: null
        });

        particleGroup.addEmitter( emitter )
        this.el.object3D.add( particleGroup.mesh )

    },
})
