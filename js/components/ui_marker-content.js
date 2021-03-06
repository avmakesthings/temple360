/* * * + + + + + + + + + + + + + + + + + + + + 
MARKER_Content : A 3D UI element with content 
associated with it

has:
geom
material
location (in model)
content (similar to value)
onHover
onClick


+ + + + + + + + + + + + + + + + + + + + * * */

AFRAME.registerComponent("ui-marker-content", {
    schema: {},

    init: function() {
        this.addOBJ("base");
        this.addOBJ("bottom");

        this.addOBJ("fill");
        this.addOBJ("top");

        // Delay making it interactable
        // to prevent accidental activation by reticle on load
        setTimeout(() => {
            this.addClickCone();
        }, 5000);

        this.animate();
    },

    addOBJ: function(type, prefix = "ui_content-marker-") {
        this[type] = document.createElement("a-entity");

        const solidObj = document.createElement("a-entity");
        solidObj.setAttribute("obj-model", `obj: #${prefix}${type}`);
        solidObj.addEventListener("model-loaded", e => {
            globals.setMaterial(solidObj.object3D, globals.transAmberMaterial);
        });
        this[type].appendChild(solidObj);

        const wireObj = document.createElement("a-entity");
        wireObj.setAttribute("obj-model", `obj: #${prefix}${type}`);
        wireObj.addEventListener("model-loaded", e => {
            globals.setMaterial(
                wireObj.object3D,
                globals.wireframeBasicMaterial
            );
        });
        this[type].appendChild(wireObj);

        return this.el.appendChild(this[type]);
    },

    addClickCone: function() {
        this.clickCone = document.createElement("a-entity");
        this.clickCone.classList.add(window.globals.interactableClass);

        this.clickCone.setAttribute("geometry", {
            primitive: "cone",
            radiusBottom: 0.5,
            radiusTop: 0.15,
            height: 2.6
        });

        // FIXME: Having a material with 'visible: false' looks better,
        // but may not work with tracked controls Raycaster. Investigate.
        this.clickCone.setAttribute("material", {
            color: "#f8ff44",
            transparent: true,
            opacity: 0
        });

        this.clickCone.addEventListener("click", e => {
            if (this.el.clickHandler) {
                this.el.clickHandler(e);
            } else {
                console.warn("No click handler assigned");
            }
        });

        this.clickCone.setAttribute(
            "animation__enter",
            window.globals.animationEnter
        );
        this.clickCone.setAttribute(
            "animation__leave",
            window.globals.animationLeave
        );

        this.el.appendChild(this.clickCone);
    },

    highlight: function(delay) {
        const beacon = document.createElement("a-entity");
        const visibleFor = 4000;

        beacon.setAttribute("geometry", {
            primitive: "cone",
            radiusBottom: 0.55,
            radiusTop: 0.55,
            height: 400
        });

        beacon.setAttribute("material", {
            color: "#f8ff44",
            transparent: true,
            opacity: 0
        });

        const animation = document.createElement("a-animation");
        animation.setAttribute("attribute", "material.opacity");
        animation.setAttribute("direction", "alternate");
        animation.setAttribute("easing", "ease-cubic");
        animation.setAttribute("dur", visibleFor / 2);
        animation.setAttribute("from", "0");
        animation.setAttribute("to", "0.25");
        animation.setAttribute("repeat", 2);

        setTimeout(() => {
            this.el.appendChild(beacon);
            beacon.appendChild(animation);

            setTimeout(() => {
                this.el.removeChild(beacon);
            }, visibleFor + 1000);

            // NOTE: Some aframe/web audio bug causes 'Cannot decode detached ArrayBuffer' errors
            // if too many audio clips are attached at once.
            // Putting this here to take advantage of the sequential delay built into the 'highlight' code.
            if (window.globals.activateAmbient) {
                this.el.setAttribute("sound", {
                    src: "#content-hum-audio",
                    autoplay: "true",
                    loop: "true",
                    poolSize: 30,
                    volume: 20
                });
            }
        }, delay);
    },

    animate: function() {
        this.addRotationAnimation(this["fill"], 10000);
        this.addRotationAnimation(this["top"], 5000);
    },

    addRotationAnimation: function(el, dur) {
        const animation = document.createElement("a-animation");
        animation.setAttribute("attribute", "rotation");
        animation.setAttribute("direction", "normal");
        animation.setAttribute("easing", "linear");
        animation.setAttribute("dur", dur);
        animation.setAttribute("fill", "forwards");
        animation.setAttribute("to", "0 360 0");
        animation.setAttribute("repeat", "indefinite");
        el.appendChild(animation);
    }
});
