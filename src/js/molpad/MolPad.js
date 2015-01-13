/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014, 2015 Herman Bergwerf
 *
 * MolView is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MolView is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with MolView.  If not, see <http://www.gnu.org/licenses/>.
 */

var MP_ZOOM_TO_COG = 0;
var MP_ZOOM_TO_POINTER = 1;

/**
 * Initialize MolPad in the given container
 * TODO: larger touch targets on high DPI screens
 * TODO: add implicit hydrogen as subset of MPAtom
 * TODO: collapse newly added implicit H atoms if !skeletal
 * TODO: always on feature for select tool
 *
 * @param {DOMElement} container
 * @param {Float}      devicePixelRatio
 * @param {Object}     buttons
 */
function MolPad(container, devicePixelRatio, buttons)
{
	/**
	 * Settings
	 * @type {Object}
	 */
	this.s = {
		maxStackSize: 100,
		zoomType: MP_ZOOM_TO_POINTER,
		zoomSpeed: 0.2,
		minZoom: 0.01,
		skeletalDisplay: true,
		relativePadding: 0.15,
		draggingThreshold: 2,
		fonts: {
			element: {
				fontStyle: "bold",
				fontFamily: 'sans-serif',//"Open Sans", sans-serif
				fontSize: 12//in pt
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
		atom: {
			hover: {
				color: "#bfb"
			},
			active: {
				color: "#8f8"
			},
			selected: {
				color: "#8f8"
			},
			charge: {
				padding: 1
			},
			isotope: {
				padding: 1
			},
			scale: 1,//scale relative to global scale (in order to scale up small scales)
			radius: 12,//radius around atom center-line
			selectionRadius: 15,//radius around atom center-line
			color: "#111",
			colored: true,
			lineCap: "round",
			circleClamp: 15,//label width > circleClamp: atom center = line
			minAddRotateLength: 15,//min drag length to add a bond to an atom using the atom tool
			minScale: 1 / 1.5,//12 * 1 / 1.5 = 8
			maxMiniLabelScale: 1 / 5.0,
			miniLabelSize: 25,
			miniLabel: false
		},
		bond: {
			gradient: {
				from: 0.4,
				to: 0.6
			},
			hover: {
				color: "#bfb"
			},
			active: {
				color: "#8f8"
			},
			selected: {
				color: "#8f8"
			},
			delta: [
				[],//no bond
				[0],//single bond
				[-4,4],//double bond
				[-6,0,6],//triple bond
				[-6,6],//wedge/hash bond
				[0,8]//cis bond
			],
			length: 55,
			lengthHydrogen: 34,
			radius: 8,
			color: "#111111",
			colored: true,
			lineCap: "round",
			lineJoin: "round",
			width: 1.5,//in relative px
			scale: 1,//scale relative to global scale (in order to scale up small scales)
			minScale: 1 / 1.5,//minimal global scale (below this scale the global scale will be scaled up to keep the visual scaling at this scale)
			minDeltaScale: 1 / 3.0,//scale factor for s.bond.delta
			singleOnlyScale: 1 / 5.0,//draw only single bonds below this scale
			hashLineSpace: 2,//space between hash bond lines in relative px
			rotateSteps: 360 / 30,//steps of 30deg, 360 / 30 = 12
			straightDev: Math.PI / 10//deviation angle to determine if two bonds are straight
		},
		chain: {
			rotateSteps: 360 / 30,//steps of 30deg, 360 / 30 = 12
			devAngle: Math.PI / 6,//30deg, deviation angle
			padding: 2,
			strokeStyle: "#f50",
			lineCap: "round",
			lineJoin: "round",
			color: "#f50"
		},
		select: {
			fillStyle: "rgba(255, 85, 0, 0.3)",
			strokeStyle: "#f50",
			lineWidth: 2,
			lineCap: "round",
			lineJoin: "round"
		}
	};

	//active tool data
	this.tool = {
		type: "bond",//bond || fragment || chain || charge || erase || drag || select || atom
		data: { type: MP_BOND_SINGLE },
		selection: []//TMP
	};

	this.mol = new MPMolecule(this);
	this.sel = new MPSelection(this);

	this.buttons = buttons;
	this.container = jQuery(container);
	this.offset = this.container.offset();
	this.devicePixelRatio = devicePixelRatio || 1;

	this.setupEventHandling();
	this.setupGraphics();
}

/**
 * MolPad API
 */

MolPad.prototype.setTool = function(type, data)
{
	this.tool.type = type;
	this.tool.data = data;
}

MolPad.prototype.onChange = function(cb)
{
	this.changeCallback = cb;
}

MolPad.prototype.clear = function(cb)
{
	this.mol.clear();
	this.sel.update();

	//retain old molecule translation in case of an undo
	this.scaleAbsolute(1 / this.matrix[0], this.width() / 2, this.height() / 2);

	this.redraw(true);
	this.mol.updateCopy();
}

MolPad.prototype.changed = function()
{
	jQuery(this.buttons.undo).toggleClass("tool-button-disabled", this.mol.stack.length == 0);
	jQuery(this.buttons.redo).toggleClass("tool-button-disabled", this.mol.reverseStack.length == 0);
	if(this.changeCallback !== undefined) this.changeCallback();
}

MolPad.prototype.undo = function(noRedoPush)
{
	this.dismissHandler();
	if(this.mol.undo(noRedoPush)) this.changed();
}

MolPad.prototype.redo = function()
{
	this.dismissHandler();
	if(this.mol.redo()) this.changed();
}

MolPad.prototype.displaySkeletal = function(yes)
{
	if(yes == this.s.skeletalDisplay) return;

	this.dismissHandler();

	if(yes)
	{
		//so all new invisible carbons are invalidated
		this.s.skeletalDisplay = true;
	}
	for(var i = 0; i < this.mol.atoms.length; i++)
	{
		if(!this.mol.atoms[i].isVisible())
		{
			this.mol.atoms[i].invalidate(false);
		}
	}
	if(!yes)
	{
		//so all invisible carbon atoms are inavalidated before becoming visibile
		this.s.skeletalDisplay = false;
	}

	if(yes) this.mol.removeImplicitHydrogen();
	else this.mol.addImplicitHydrogen();

	this.validate();
	this.mol.updateCopy();
}

MolPad.prototype.setColored = function(yes)
{
	this.s.atom.colored = this.s.bond.colored = yes;
	this.s.fonts.isotope.fontStyle = this.s.fonts.element.fontStyle =
			this.s.fonts.charge.fontStyle = yes ? "bold" : "normal";
	this.redraw(true);
}

MolPad.prototype.toDataURL = function()
{
	return this.canvas.toDataURL("image/png");
}

/**
 * Load molfile
 * @param {String}  mol
 * @param {Boolean} forceRemoveHydrogen
 */
MolPad.prototype.loadMOL = function(mol, forceRemoveHydrogen)
{
	this.mol.loadMOL(mol);

	if(this.s.skeletalDisplay || forceRemoveHydrogen)
	{
		this.mol.removeImplicitHydrogen();
	}

	this.center();
	this.mol.updateCopy();
}

MolPad.prototype.getMOL = function()
{
	return this.mol.getMOL();
}

MolPad.prototype.getSMILES = function()
{
	return this.mol.getSMILES();
}
