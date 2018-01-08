/**
 * @author AnastasiaVictor/ http://github.com/avmakesthings
 * @author JohnFaichney / http://github.com/johnfaichney
 *
 * A-frame Nested Timeline Component:
 */

var moment = require("moment");
var isEqual = require("lodash.isequal");
var getState = require("../getState");

function getTimescaleFromDate(date, timeScale) {
    var dateSegment;
    switch (timeScale) {
        case "year":
            dateSegment = moment(date).year();
            break;
        case "month":
            dateSegment = moment(date).month();
            break;
        case "day":
            dateSegment = moment(date).date();
            break;
        case "hour":
            dateSegment = moment(date).hour();
            break;
        case "minute":
            dateSegment = moment(date).minute();
            break;
        default:
            console.log("Getting timescale from date did not work");
    }
    return dateSegment;
}

//TO-DO - this hasn't been tested for day, hour and minutes
function formatDateSegment(segment, timeScale) {
    var formatDate;
    switch (timeScale) {
        case "year":
            formatDate = moment(segment, "YYYY").format("YYYY");
            break;
        case "month":
            formatDate = moment(segment + 1, "MM").format("MMM");
            break;
        case "day":
            formatDate = moment(segment, "DD").format("Do");
            break;
        case "hour":
            formatDate = moment(segment + 1, "HH").format("HHHH");
            break;
        case "minute":
            formatDate = moment(segment + 1, "mm").format("MMM");
            break;
        default:
            console.log("Formatting date segment did not work");
    }
    return formatDate;
}

// Expects only a single textChild, returns it
function getTextChildMesh(el) {
    var textGroups = el.object3D.children.filter(e => {
        return e.geometry && e.geometry.constructor.name == "TextGeometry";
    });
    if (textGroups.length > 1) throw new Error("Multple text groups found");
    if (textGroups.length < 1) throw new Error("No text groups found");
    return textGroups[0];
}

function getTextBBox(object3D, depth = 10) {
    var scale = object3D.scale;
    var bbox = new THREE.Box3();
    bbox.setFromBufferAttribute(object3D.geometry.attributes.position);

    var min = new THREE.Vector3(
        bbox.min.x * scale.x,
        bbox.max.y * scale.y,
        0 * scale.z
    );

    var max = new THREE.Vector3(
        bbox.max.x * scale.x,
        bbox.min.y * scale.y,
        depth * scale.z
    );

    var bbox = new THREE.Box3(min, max);
    return bbox;
}

function appendBoxEl(el) {
    var textObject3D = getTextChildMesh(el);
    var bbox = getTextBBox(textObject3D);
    var dims = bbox.getSize();
    var boxEl = document.createElement("a-entity");

    // NOTE: BBOX comes back a bit too small/weirdly offset
    // due to text margin attributes that aren't part of bufferGeometry
    // For now, use padding as a hack....
    const padding = 0.01;

    boxEl.setAttribute("geometry", {
        primitive: "box",
        width: dims.x + padding,
        height: dims.y + padding,
        depth: dims.z
    });
    boxEl.setAttribute("material", {
        color: "#000000",
        transparent: true,
        opacity: 0.0
    });

    boxEl.setAttribute("position", {
        x: dims.x / 2,
        y: -dims.y / 2 + padding,
        z: 0
    });
    return el.appendChild(boxEl);
}

AFRAME.registerComponent("ui-panel-timeline", {
    schema: {
        timelineData: {
            default: "{}",
            parse: function(value) {
                return JSON.parse(value);
            }
        },
        timeScales: { default: ["year", "month", "day"] },
        rowHeight: { default: 0.032 },
        margin: { default: 0.04 },
        active: { default: false },
        componentTitle: { default: "" }
    },
    init: function() {
        var el = this.el;
        var data = this.data;

        // Use this to handle complex interactions
        this.dateTree = this.timelineDataToDateTree(
            data.timelineData,
            data.timeScales
        );

        var datesEl = this.renderDateTree(this.dateTree);

        var totalHeight = datesEl.getAttribute("height");
        var adjustedHeight = totalHeight + 0.1;

        //create container geometry
        globals.createWireframeBox(el, totalHeight, 0.3, 0.2);
        globals.createMeshPlaneFill(el, totalHeight, 0.3, 0.2);

        datesEl.setAttribute("position", {
            x: -0.13,
            y: totalHeight / 2 - 0.05,
            z: 0.01
        });

        el.appendChild(datesEl);

        this.highlightListener = e => {
            this.highlightActiveDate(e.detail.activeDate);
        };

        window.addEventListener("activeDateChanged", this.highlightListener);

        setTimeout(() => {
            this.highlightActiveDate(getState("activeDate"));
        }, 0);
    },

    remove: function() {
        window.removeEventListener("activeDateChanged", this.highlightListener);
    },

    timelineDataToDateTree: function(timelineData, timeScales) {
        var dateTree = {
            key: "root",
            children: {}
        };

        const leafTimescale = timeScales[timeScales.length - 1];

        Object.keys(timelineData).forEach(date => {
            var currentBranch = dateTree.children;

            timeScales.forEach(timeScale => {
                var m = moment(date);
                var timeScaleVal = m.startOf(timeScale).toString();

                if (!currentBranch[timeScaleVal]) {
                    currentBranch[timeScaleVal] = {
                        key: timeScaleVal,
                        timeScale: timeScale,
                        children: {}
                    };
                }
                if (timeScale != leafTimescale) {
                    currentBranch = currentBranch[timeScaleVal].children;
                } else {
                    currentBranch[timeScaleVal].isLeaf = true;
                    var leaf = (currentBranch[timeScaleVal].children =
                        timelineData[date]);
                }
            });
        });

        return dateTree;
    },

    renderDateTree: function(parent, depth = 0) {
        var el = document.createElement("a-entity");
        var totalHeight = 0;

        // Render node if it isn't the root
        if (parent.key != "root") {
            this.renderNode(el, parent);
            totalHeight +=
                parseFloat(el.getAttribute("height")) + this.data.margin;
        }

        // If this is a leaf, return
        if (parent.isLeaf) {
            return el;
        }

        // Else, render children
        Object.keys(parent.children).forEach(childKey => {
            var childEl = this.renderDateTree(
                parent.children[childKey],
                depth + 1
            );

            var childPos = new THREE.Vector3(depth * 0.05, -totalHeight, 0);
            childEl.setAttribute("position", childPos);
            totalHeight +=
                parseFloat(childEl.getAttribute("height")) + this.data.margin;
            el.appendChild(childEl);
        });

        el.setAttribute("height", totalHeight);
        return el;
    },

    renderNode: function(el, nodeData) {
        var dateVal = getTimescaleFromDate(nodeData.key, nodeData.timeScale);
        el.setAttribute("text", {
            value: formatDateSegment(dateVal, nodeData.timeScale),
            anchor: "left",
            baseline: "top"
        });

        // Ensure this is set for renderDateTree heights to work correctly
        el.setAttribute("height", this.data.rowHeight);

        if (nodeData.timeScale === this.data.timeScales[0]) {
            el.setAttribute("text", {
                letterSpacing: 5,
                opacity: 0.8
            });
        }

        if (nodeData.timeScale !== this.data.timeScales[0]) {
            el.setAttribute("text", {
                letterSpacing: 3,
                opacity: 0.5
            });
            indicatorGeo = document.createElement("a-entity");
            indicatorGeo.setAttribute("geometry", {
                primitive: "plane",
                width: 0.04,
                height: 0.002
            });
            indicatorGeo.setAttribute("material", {
                color: "white",
                opacity: 0.5
            });
            indicatorGeo.setAttribute("position", {
                x: -0.02,
                y: -0.026
            });
            indicatorGeo.setAttribute("id", "indicator");
            el.appendChild(indicatorGeo);
        }

        if (nodeData.isLeaf) {
            el.setAttribute("id", moment(nodeData.key).format("YYYY-MM-DD"));

            setTimeout(() => {
                var boxEl = appendBoxEl(el);

                boxEl.classList.add(window.globals.interactableClass);

                boxEl.setAttribute(
                    "animation__enter",
                    window.globals.animationEnter
                );
                boxEl.setAttribute(
                    "animation__leave",
                    window.globals.animationLeave
                );

                boxEl.addEventListener("click", e => {
                    //this will be a problem if multiple instances
                    //of timeline exist in a scene - how do you access
                    //the component data from here? can set the id that way
                    timelineEl = document.querySelector("#timeline");
                    if (window.globals.activateSound) {
                        timelineEl.setAttribute("sound", {
                            src: "#timeline-click-audio",
                            on: "click",
                            volume: "0.5"
                        });
                    }

                    if (timelineEl.clickHandler) {
                        timelineEl.clickHandler(nodeData);
                    } else {
                        console.warn("No click handler assigned");
                    }
                });
            }, 0);
        }
    },
    highlightActiveDate: function(activeDate) {
        if (this.activeItem !== undefined && this.activeItem !== null) {
            this.activeItem.setAttribute("position", this.activeItemPos);
            this.activeItem.setAttribute("text", {
                opacity: 0.5
            });
            this.activeIndicator.setAttribute(
                "position",
                this.activeIndicatorPos
            );
            this.activeIndicator.setAttribute("geometry", {
                width: 0.04,
                height: 0.002
            });
        } else {
            console.warn("this.activeItem was null or undefined");
        }

        this.activeItem = document.getElementById(activeDate);
        this.activeItemPos = this.activeItem.components.position.attrValue;
        this.activeIndicator = this.activeItem.querySelector("#indicator");
        this.activeIndicatorPos = this.activeIndicator.components.position.attrValue;

        this.activeItem.setAttribute("text", {
            opacity: 1
        });
        this.activeItem.setAttribute("position", {
            x: 0.137,
            y: this.activeItemPos.y,
            z: this.activeItemPos.z
        });

        this.activeIndicator.setAttribute("position", {
            x: -0.069,
            y: -0.023 + 0.005,
            z: this.activeIndicatorPos.z
        });
        this.activeIndicator.setAttribute("geometry", {
            width: 0.12,
            height: 0.02
        });
    }
});
