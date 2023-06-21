/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

MolPad.prototype.loadSettings = function()
{
    /**
	 * Settings
	 * @type {Object}
	 */
	this.s = {
		/**
		 * Maximum undo stack size
		 * @type {Integer}
		 */
		maxStackSize: 100,

		/**
		 * Mousewheel zoom type:
		 * - MP_ZOOM_TO_COG: center of gravity
		 * - MP_ZOOM_TO_POINTER: mousepointer
		 * @type {Integer}
		 */
		zoomType: MP_ZOOM_TO_POINTER,

		/**
		 * Mousewheel zoom speed (multiplier)
		 * @type {Float}
		 */
		zoomSpeed: 0.2,

		/**
		 * You cannot zoom below this level
		 * using the mousewheel
		 * @type {Float}
		 */
		minZoom: 0.01,

		/**
		 * Indicates if skeletal display is enabled
		 * @type {Boolean}
		 */
		skeletalDisplay: true,

		/**
		 * This fraction is used to calculate
		 * the padding around a centered molecule
		 * relative to the canas size
		 * @type {Float}
		 */
		relativePadding: 0.15,

		/**
		 * Pointer events are considered as
		 * dragging after moving this number of pixels
		 * (devicePixelRatio does not apply here)
		 * @type {Float}
		 */
		draggingThreshold: 2,

        /**
         * Number of rotation steps for rotating atoms
         * steps of 30deg: 360 / 30 = 12
         * @type {Float}
         */
        rotateSteps: 360 / 30,

		/**
		 * This object contains the configuration
		 * for various fonts used in MolPad
		 * They can be applied using MolPad.setFont()
		 * The fontSize is defined as pt
		 * @type {Object}
		 */
		fonts: {
			element: {
				fontStyle: "bold",
				fontFamily: 'sans-serif',
				fontSize: 12
			},
			charge: {
				fontStyle: "bold",
				fontFamily: 'sans-serif',
				fontSize: 8
			},
			isotope: {
				fontStyle: "bold",
				fontFamily: 'sans-serif',
				fontSize: 8
			},
			chainSize: {
				fontStyle: "normal",
				fontFamily: 'sans-serif',
				fontSize: 12
			},
		},

        /**
         * All settings related to MPAtom
         * @type {Object}
         */
		atom: {

            /**
             * Styles related to different MPAtom states
             */

			hover: {
				color: "#bfb"
			},
			active: {
				color: "#8f8"
			},
			incorrect: {
				color: "#f66"
			},
			selected: {
				color: "#8f8"
			},

            /**
             * Metrics related to different label sections
             * the padding is only applied between the sections (vertically)
             */

			charge: {
				padding: 1
			},
			isotope: {
				padding: 1
			},

            /**
             * MPAtom scale, this scale is recalculated if
             * the molecule is scaled in order to magnify
             * atom labels on very small global scales
             * @type {Float}
             */
			scale: 1,

            /**
             * Minimum atom scale, the s.atom.scale is scaled up
             * using a linear correlation to the global scale if
             * the global scale is below this value.
             * 12 * 1 / 1.5 = 8: 8pt is the smallest element label fontSize
             * @type {RegExp}
             */
			minScale: 1 / 1.5,

			/**
			 * Radius around atom center (line) for bond vertices
			 * @type {Float}
			 */
            radius: 12,

            /**
             * Radius around atom center (line) for selection area
             * (calculate using point-line distance)
             * @type {Float}
             */
			selectionRadius: 15,

            /**
             * Atom default color
             * @type {String}
             */
			color: "#111",

            /**
             * Atom element coloring
             * @type {Boolean}
             */
			colored: true,

            /**
             * Line-cap used to draw the center (line)
             * @type {String}
             */
			lineCap: "round",

            /**
             * The atom label will be surrounded with a (selection) circle
             * instead of a line if the label with <= circleClamp
             * @type {Number}
             */
			circleClamp: 15,

            /**
             * If you change the element of an atom and drag this far, a new
             * bond will be created wich connects to a new atom with the
             * specified element while the atom itself will be restored
             * @type {Number}
             */
			minAddRotateLength: 15,

            /**
             * Below this global scale, a mini-label will be drawn
             * (small square)
             * @type {Float}
             */
			maxMiniLabelScale: 1 / 5.0,

            /**
             * Mini-label square size in relative units
             * @type {Float}
             */
			miniLabelSize: 25,

            /**
             * This switch is updated automatically in MolPad.update()
             * and used in MPAtom.drawLabel()
             * @type {Boolean}
             */
			miniLabel: false
		},

        /**
         * All settings related to MPBond
         * @type {Object}
         */
		bond: {
            /**
             * If element coloring is enabled, a color gradient will
             * be drawed on this part of the bond
             * @type {Object}
             */
			gradient: {
				from: 0.4,
				to: 0.6
			},

            /**
             * Default MPBond color
             * @type {String}
             */
			color: "#111",

            /**
             * Bond gradient coloring switch
             * @type {Boolean}
             */
			colored: true,

            /**
             * MPBond state styles
             * @type {Object}
             */
			hover: {
				color: "#bfb"
			},
			active: {
				color: "#8f8"
			},
			selected: {
				color: "#8f8"
			},

            /**
             * MPBond metrics
             * @type {Array}
             */
			delta: [
				[],//no bond
				[0],//single bond
				[-4,4],//double bond
				[-8,8],//triple bond
				[-6,6],//wedge/hash bond
				[0,8]//cis bond
			],

            /**
             * Default MPBond length. Molfiles from PubChem etc. will be
             * magnfied using this value in order to scale to this bond length.
             * @type {Float}
             */
			length: 55,

            /**
             * Default MPBond length for hydrogen atoms
             * @type {Float}
             */
			lengthHydrogen: 34,

            /**
             * Radius around MPBond center line (selection area)
             * @type {Float}
             */
			radius: 8,

            /**
             * Line-cap used for MPBond selection area
             * @type {String}
             */
			lineCap: "round",

            /**
             * Line-join used for wedge bonds
             * @type {String}
             */
			lineJoin: "round",

			/**
			 * MPBond line-width
			 * @type {Float}
			 */
            width: 1.5,//in relative px

            /**
             * MPBond scale, this scale is recalculated if
             * the molecule is scaled in order to magnify
             * bond lines on very small global scales
             * @type {Float}
             */
			scale: 1,

            /**
             * Smallest bond scale.
             * 1.5 * 1 / 1.5 = 1: 1px is min bond width in px
             * @type {Float}
             */
			minScale: 1 / 1.5,

            /**
             * Smallest scale for magnifying the bond.delta
             * This will make sure the distance does not get smaller as 1px
             * @type {Float}
             */
			minDeltaScale: 1 / 4.0,

            /**
             * Below this scale, only one bond line is drawn
             * (also for wedge bonds etc.)
             * @type {Float}
             */
			singleOnlyScale: 1 / 5.0,

            /**
             * Space between lines in hash bonds in relative units
             * bondWidth = bond.width for hash bond lines too
             * @type {Float}
             */
			hashLineSpace: 2,

			/**
			 * Maximal bond.line.to.distanceTo(wedgeFitPoint)
			 * @type {Float}
			 */
            wedgeFitMaxD: 20,

            /**
             * Most ideal bisect angle for double/triple bonds
             * @type {Float}
             */
			bestBisect: Math.PI / 4,

            /**
             * Angle deviation to determine if different bond angles are
             * visually equal
             * @type {RegExp}
             */
			angleDev: Math.PI / 30
		},
		chain: {
            /**
             * Chain rotation steps
             * steps of 30deg: 360 / 30 = 12
             * @type {RegExp}
             */
			rotateSteps: 360 / 30,

            /**
             * Deviation angle to create a zig-zag carbon chain
             * @type {Float}
             */
			devAngle: Math.PI / 6,

            /**
             * Chain label padding in relative units
             * @type {Float}
             */
			padding: 2,

            /**
             * Chain label color
             * @type {String}
             */
			color: "#f50",

            /**
             * Chain line color
             * @type {String}
             */
			strokeStyle: "#f50",

            /**
             * Chain line-cap
             * @type {String}
             */
			lineCap: "round",

            /**
             * Chain line-join
             * @type {String}
             */
			lineJoin: "round"
		},
		select: {
            /**
             * Selection area fill style
             * @type {String}
             */
			fillStyle: "rgba(255, 85, 0, 0.3)",

            /**
             * Selection area stroke color
             * @type {String}
             */
			strokeStyle: "#f50",

            /**
             * Selection area stroke lineWidth
             * @type {Number}
             */
			lineWidth: 2,

            /**
             * Seletion area stroke lineCap
             * @type {String}
             */
			lineCap: "round",

            /**
             * Seletion area stroke lineJoin
             * @type {String}
             */
			lineJoin: "round"
		}
	};
}
