module.exports = {
    locations: {
        origin: {
            title: "Origin",
            description: "A hole to see the sky through",
            coord: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        interiorSouth: {
            title: "Interior South",
            description: "The path to civilization",
            coord: {
                x: 0,
                y: 0,
                z: -6
            }
        },
        interiorEast: {
            title: "Interior East",
            description: "The sun rises",
            coord: {
                x: 6,
                y: 0,
                z: 0
            }
        },
        interiorNorth: {
            title: "Interior North",
            description: "To eternity",
            coord: {
                x: 0,
                y: 0,
                z: 6
            }
        },
        interiorWest: {
            title: "Interior West",
            description: "Dusk over mountains",
            coord: {
                x: -6,
                y: 0,
                z: 0
            }
        },
        southGate: {
            title: "South Gate",
            // "description": "",
            coord: {
                x: 0,
                y: 0,
                z: -24
            }
        },
        southCourtyard: {
            title: "South Courtyard",
            // "description": "Into the fold",
            coord: {
                x: 0,
                y: 0,
                z: -20
            }
        },
        southCantilever: {
            title: "South Cantilever",
            // "description": "First Contact",
            coord: {
                x: 0,
                y: 0,
                z: -14
            }
        },
        southEntry: {
            title: "South Entry",
            // "description": "",
            coord: {
                x: 0,
                y: 0,
                z: -9
            }
        },
        northEntry: {
            title: "North Entry",
            // "description": "",
            coord: {
                x: 0,
                y: 0,
                z: 9
            }
        },
        northCantilever: {
            title: "North Cantilever",
            // "description": "The Edge of Civilization",
            coord: {
                x: 0,
                y: 0,
                z: 14
            }
        },
        northGate: {
            title: "North Gate",
            // "description": "",
            coord: {
                x: 0,
                y: 0,
                z: 24
            }
        },
        westGate: {
            title: "West Gate",
            // "description": "",
            coord: {
                x: -29,
                y: 0,
                z: 0
            }
        },
        westCourtyard: {
            title: "West Courtyard",
            // "description": "Ritual",
            coord: {
                x: -20,
                y: 0,
                z: 0
            }
        },
        westCantilever: {
            title: "West Cantilever",
            // "description": "Sunset Through the Trees",
            coord: {
                x: -14,
                y: 0,
                z: 0
            }
        },
        westEntry: {
            title: "West Entry",
            // "description": "",
            coord: {
                x: -9,
                y: 0,
                z: 0
            }
        },
        eastEntry: {
            title: "East Entry",
            // "description": "",
            coord: {
                x: 9,
                y: 0,
                z: 0
            }
        },
        eastCantilever: {
            title: "East Cantilever",
            // "description": "Dawn in the Forest",
            coord: {
                x: 14,
                y: 0,
                z: 0
            }
        },
        eastCourtyard: {
            title: "East Courtyard",
            // "description": "Introspection",
            coord: {
                x: 20,
                y: 0,
                z: 0
            }
        },
        eastGate: {
            title: "East Gate",
            // "description": "",
            coord: {
                x: 29,
                y: 0,
                z: 0
            }
        },
        northWestCantilever: {
            title: "North West Cantilever",
            // "description": "",
            coord: {
                x: -9,
                y: 0,
                z: 9
            }
        },
        southRoad: {
            title: "South Road",
            // "description": "",
            coord: {
                x: 0,
                y: 0,
                z: -34
            }
        },
        northRoad: {
            title: "North Road",
            // "description": "",
            coord: {
                x: 0,
                y: 0,
                z: -34
            }
        }
    },
    models: {
        "2016-11-01": {
            title: "Preliminary design - A forest",
            description:
                "This was the first concept model that the design team generated, inspired by the pine forests that our material was being sourced from.",
            location: "origin",
            source: "16-11-temple.gltf"
        },
        "2016-12-01": {
            title: "Design iteration #1",
            description:
                "The design team of 5 worked to develop the concept, bridging function with form. In this version we tried to create a denser, more forest-like canopy.",
            location: "origin",
            source: "16-12-temple.gltf"
        },
        "2017-01-01": {
            title: "Design iteration #2",
            description:
                "Sometimes things get a little crazy! We wrote a few python scripts to generate forms using Japanese style of stacked timber construction. Each iteration thought us something about the utility and form of the design.",
            location: "origin",
            source: "17-01-temple.gltf"
        },
        "2017-02-01": {
            title: "Burning Man Grant Submittal",
            description:
                "This was the design that was selected by Burning Man for the 2017 Temple honoraria grant.  Key aspects of the form like the ‘cloud’ cantilever, pedestal columns and the spire are depicted",
            location: "origin",
            source: "17-02-temple.gltf"
        },
        "2017-06-01": {
            title: "Design refinement #1",
            description:
                "After being awarded the submittal, we worked to resolve the construction detailing and sequencing. The structural and value engineering processes typically mean changes for the design.",
            location: "origin",
            source: "17-06-temple.gltf"
        },
        "2017-07-01": {
            title: "Design refinement #2",
            description:
                "Most of the structural engineering had been finalized by this point. Columns and beam grids are included, as well as some ideas for ceiling panels and other features",
            location: "origin",
            source: "17-07-temple.gltf"
        },
        "2017-08-01": {
            title: "Final design",
            description:
                "While not 100% architecturally resolved, this was our stopping point and the design that we brought to the desert, documented in 2D- plans, section, elevations",
            location: "origin",
            source: "17-08-temple.gltf"
        },
        "2017-09-01": {
            title: "Built installation",
            description:
                "We spent 3 weeks on-site in the Black Rock Desert with a crew of about 60 volunteers, building the Temple. Many details were developed through the build, like the prayer blocks for the interior altars.",
            location: "origin",
            source: "17-08-temple.gltf"
        }
    },
    threeSixtyImages: {
        "2017-08-18": [
            {
                title: "image1",
                description:
                    "Atrium is finished, the dome is ready to be picked!",
                location: "northEntry",
                source: "SAM_100_0004.jpg",
                phiStart: 90
            },
            {
                title: "image2",
                description:
                    "View from inside the atrium - altars have been roughed in.",
                location: "origin",
                source: "SAM_100_0005.jpg",
                phiStart: 90
            },
            {
                title: "image3",
                description:
                    "To the south, the pedestals, which were prebuilt in Oakland, are prepared for placement.",
                location: "southCantilever",
                source: "SAM_100_0006.jpg",
                phiStart: 270
            },
            {
                title: "image4",
                description:
                    "Looking towards the temple, pedestals are in the foreground and the dome and crane beyond. Looking south, the man base is visible in the distance.",
                location: "southRoad",
                source: "SAM_100_0007.jpg",
                phiStart: 270
            }
        ],
        "2017-08-19": [
            {
                title: "image5",
                description: "Under construction",
                location: "northCantilever",
                source: "SAM_100_0009.jpg",
                phiStart: 90
            },
            {
                title: "image6",
                description: "The spire begins construction to the left.",
                location: "northEntry",
                source: "SAM_100_0010.jpg",
                phiStart: 90
            },
            {
                title: "fdskjhs",
                description:
                    "The dome is in place! Pedestals under construction are visible in the distance.",
                location: "origin",
                source: "SAM_100_0011.jpg",
                phiStart: 90
            },
            {
                title: "image8",
                description: "The beam grid is layed out to the east.",
                location: "southCantilever",
                source: "SAM_100_0012.jpg",
                phiStart: 270
            },
            {
                title: "image9",
                description:
                    "The dome is picked. Posts are placed along the south road.",
                location: "southRoad",
                source: "SAM_100_0013.jpg",
                phiStart: 270
            }
            // Needs it's own location
            // {
            //     title: "image10",
            //     description: "test7",
            //     location: "northGate",
            //     source: "SAM_100_0016.jpg",
            //     phiStart: 90
            // }
        ],
        "2017-08-21": [
            {
                title: "this is a title",
                description: "Under construction",
                location: "northGate",
                source: "SAM_100_0018.jpg",
                phiStart: 270
            },
            {
                title: "this is a title",
                description: "Under construction",
                location: "northCantilever",
                source: "SAM_100_0019.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description:
                    "A scissor lift is parked inside while the pedestals are placed and attached.",
                location: "origin",
                source: "SAM_100_0022.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description:
                    "More beam grid is assembled to the west. Fence posts are built and posiitoned. Many pedestals are positioned and tied down.",
                location: "southCantilever",
                source: "SAM_100_0024.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description:
                    "A variable reach lift is used to lift the pedestals in place.",
                location: "southRoad",
                source: "SAM_100_0025.jpg",
                phiStart: 90
            }
        ],
        "2017-08-22": [
            {
                title: "this is a title",
                description: "Under construction",
                location: "northGate",
                source: "SAM_100_0027.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Under construction",
                location: "northCantilever",
                source: "SAM_100_0028.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description:
                    "Seems like it got a little taller in here - the lower spire has been picked!",
                location: "origin",
                source: "SAM_100_0029.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Lanterns are positioned near the fence posts.",
                location: "southCantilever",
                source: "SAM_100_0030.jpg",
                phiStart: 270
            },
            {
                title: "this is a title",
                description:
                    "Pedestals are placed, the lower spire is picked. The upper spire is under construction in the background.",
                location: "southRoad",
                source: "SAM_100_0031.jpg",
                phiStart: 270
            }
        ],
        "2017-08-23": [
            {
                title: "this is a title",
                description: "Under construction",
                location: "northGate",
                source: "SAM_100_0032.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Under construction",
                location: "northCantilever",
                source: "SAM_100_0033.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Work on the beam grid continues.",
                location: "origin",
                source: "SAM_100_0034.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Lanterns are hung, the fence is assembled.",
                location: "southCantilever",
                source: "SAM_100_0035.jpg",
                phiStart: 270
            },
            {
                title: "this is a title",
                description:
                    "The pedestals are placed! The upper spire is ready to be picked.",
                location: "southRoad",
                source: "SAM_100_0036.jpg",
                phiStart: 270
            }
        ],
        "2017-08-24": [
            {
                title: "this is a title",
                description:
                    "Tie-downs stabilize the pedestals while the beam grid is built connecting them.",
                location: "northEntry",
                source: "SAM_100_0037.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Look up! The upper spire has been picked.",
                location: "origin",
                source: "SAM_100_0039.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description:
                    "The beam grid is in place, the spire is topped out!",
                location: "southCantilever",
                source: "SAM_100_0040.jpg",
                phiStart: 270
            },
            {
                title: "this is a title",
                description: "The upper spire is picked!",
                location: "southRoad",
                source: "SAM_100_0041.jpg",
                phiStart: 270
            },
            {
                title: "this is a title",
                description: "Under construction",
                location: "northCantilever",
                source: "SAM_100_0042.jpg",
                phiStart: 90
            }
            // Needs it's own location
            // {
            //     title: "this is a title",
            //     description: "Under construction",
            //     location: "northGate",
            //     source: "SAM_100_0043.jpg",
            //     phiStart: 90
            // }
        ],
        "2017-08-28": [
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "northEntry",
                source: "SAM_100_0047.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "northCantilever",
                source: "SAM_100_0048.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "northGate",
                source: "SAM_100_0049.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "southGate",
                source: "SAM_100_0051.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "southRoad",
                source: "SAM_100_0053.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "origin",
                source: "SAM_100_0056.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "interiorWest",
                source: "SAM_100_0057.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "westEntry",
                source: "SAM_100_0058.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "westCantilever",
                source: "SAM_100_0059.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "eastEntry",
                source: "SAM_100_0060.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "eastCantilever",
                source: "SAM_100_0061.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "northGate",
                source: "SAM_100_0062.jpg",
                phiStart: 0
            },
            {
                title: "this is a title",
                description: "Construction wraps up.",
                location: "northRoad",
                source: "SAM_100_0065.jpg",
                phiStart: 90
            }
        ],
        "2017-09-02": [
            {
                title: "this is a title",
                description: "During the event.",
                location: "northGate",
                source: "SAM_100_0067.jpg",
                phiStart: 270
            },
            {
                title: "this is a title",
                description: "During the event.",
                location: "eastGate",
                source: "SAM_100_0069.jpg",
                phiStart: 180
            },
            {
                title: "this is a title",
                description: "During the event.",
                location: "southRoad",
                source: "SAM_100_0070.jpg",
                phiStart: 90
            }
        ],
        "2017-09-03": [
            {
                title: "this is a title",
                description: "During the event.",
                location: "origin",
                source: "SAM_100_0074.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "During the event.",
                location: "northEntry",
                source: "SAM_100_0077.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "During the event.",
                location: "eastCantilever",
                source: "SAM_100_0078.jpg",
                phiStart: 90
            },
            {
                title: "this is a title",
                description: "During the event.",
                location: "northCantilever",
                source: "SAM_100_0079.jpg",
                phiStart: 90
            }
        ]
    }
};
