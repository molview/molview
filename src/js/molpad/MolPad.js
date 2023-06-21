/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
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
	this.loadSettings();

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
	jQuery(this.buttons.undo).toggleClass("tool-button-disabled", this.mol.stack.length === 0);
	jQuery(this.buttons.redo).toggleClass("tool-button-disabled", this.mol.reverseStack.length === 0);
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

MolPad.prototype.setSkeletalDisplay = function(on)
{
	if(on === this.s.skeletalDisplay) return;

	this.dismissHandler();
	this.s.skeletalDisplay = on;

	if(on) this.mol.removeImplicitHydrogen();
	else this.mol.addImplicitHydrogen();

	this.mol.invalidateAll();

	this.clearRedrawRequest();
	this.mol.updateCopy();
}

MolPad.prototype.setColored = function(on)
{
	this.s.atom.colored = this.s.bond.colored = on;
	this.s.fonts.isotope.fontStyle = this.s.fonts.element.fontStyle =
			this.s.fonts.charge.fontStyle = on ? "bold" : "normal";
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
