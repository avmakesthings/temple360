/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 *
 * A-frame Generic Button Component
 */

AFRAME.registerComponent("ui-button", {
    schema: {
        buttonGeom: { type: "string", default: "box" },
        height: { default: 0.2 },
        width: { default: 0.4 },
        depth: { default: 0.2 },
        wireframe: { default: true },
        icon2D: { type: "string" },
        icon3D: { type: "string" },
        buttonMaterial: { type: "string" },
        iconMaterial: { type: "string" },
        value: { type: "string" },
        buttonType: { default: "nav" },
        mixin: { default: "text-button-1" }
    },
    init: function() {
        var data = this.data;
        var el = this.el;

        //switch statement for type of shape
        switch (data.buttonGeom) {
            case "box":
                //create button container geometry
                var geometry = new THREE.BoxGeometry(
                    data.width,
                    data.height,
                    data.depth
                );
                break;
            case "sphere":
                //create button container geometry
                var geometry = new THREE.SphereGeometry(data.width, 32, 32);
                break;
            default:
                console.log("button geo switch failed");
        }

        //create button geometry
        if (data.wireframe) {
            var geo = new THREE.EdgesGeometry(geometry);
            var mat = new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 10
            });
            var wireframe = new THREE.LineSegments(geo, mat);
            el.object3D.add(wireframe);
        } else {
            if (data.buttonMaterial) {
                console.log("material not found");
            } else {
                var material = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    wireframe: true
                });
                var mesh = new THREE.Mesh(geometry, material);
                el.object3D.add(mesh);
            }
        }
        //add button icon
        el.classList.add(window.globals.interactableClass);

        el.setAttribute("mixin", data.mixin);

        el.setAttribute("text", {
            value: data.value
        });

        el.setAttribute("geometry", {
            primitive: "box",
            height: data.height,
            width: data.width,
            depth: data.depth
        });

        el.setAttribute("material", {
            color: "#000000",
            transparent: true,
            opacity: 0.1
        });

        if (window.globals.activateSound) {
            el.setAttribute("sound", {
                src: "#button-click-audio",
                on: "click",
                volume: "0.5"
            });
        }

        //animations
        el.setAttribute("animation__enter", window.globals.animationEnter);

        el.setAttribute("animation__leave", window.globals.animationLeave);

        // el.setAttribute('animation__clicked', {
        // 	property:'geometry',
        // 	dur: 100,
        // 	to: {x:0.9, y:1.0, z:0.9},
        // 	easing: 'easeInSine',
        // 	startEvents: 'click',
        // });

        //click handler
        el.addEventListener("click", e => {
            // e.target.components.sound.playSound();	//not working bc sound hasn't loaded?
            //wait till animation finished before navigating
            // el.addEventListener('animation__[clicked]-complete',()=>{
            //})
            if (el.clickHandler) {
                el.clickHandler(e);
            } else {
                console.warn("No click handler assigned");
            }
        });
    }
});
