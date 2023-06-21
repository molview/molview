/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

var MP_BOND_SINGLE = 1;
var MP_BOND_DOUBLE = 2;
var MP_BOND_TRIPLE = 3;
var MP_BOND_WEDGEHASH = 4;
var MP_BOND_CIS = 5;

var MP_STEREO_NONE = 0;
var MP_STEREO_UP = 1;
var MP_STEREO_DOWN = 6;
var MP_STEREO_CIS_TRANS = 3;
var MP_STEREO_EITHER = 4;

/**
 * Create new MPBond
 * @param {MolPad} mp
 * @param {Object} obj Configuration
 */
function MPBond(mp, obj)
{
	this.mp = mp;
	this.index = obj.i;
	this.type = obj.type || 0;
	this.stereo = obj.stereo || MP_STEREO_NONE;
	this.from = obj.from || 0;
	this.to = obj.to || 0;
	this.selected = obj.selected || false;
	this.display = "normal";
	this.hidden = false;//used internally to hide inverted bonds
	this.valid = false;
	this.mp.requestRedraw();
}

/**
 * Retruns data which can be used as input by the Ketcher fork
 * @param {Object} mp
 * @return {Object}
 */
MPBond.prototype.getKetcherData = function()
{
	return new chem.Struct.Bond({
		type: this.type,
		stereo: this.stereo,
		begin: this.from,
		end: this.to
	});
}

/**
 * Retruns config data which can be used to reconstruct this object
 * @return {Object}
 */
MPBond.prototype.getConfig = function()
{
	return {
		i: this.index,
		type: this.type,
		stereo: this.stereo,
		from: this.from,
		to: this.to
	};
}

/**
 * Retruns MPBond string which can be compared to other MPBond strings
 * @return {String}
 */
MPBond.prototype.toString = function()
{
	return this.type.toString()
		+ this.stereo.toString()
		+ this.to - this.from;//store up/down bond direction
}

MPBond.prototype.getLine = function()
{
	return new MPLine({
		from: this.mp.mol.atoms[this.from].center,
		to: this.mp.mol.atoms[this.to].center
	});
}

/**
 * Returns the from.angleTo(to)
 * @param  {Integer} from From atom
 * @return {Float}
 */
MPBond.prototype.getAngle = function(from)
{
	if(this.mp.mol.atoms[this.from].equals(from))
	{
		return this.mp.mol.atoms[this.from].center.angleTo(
			this.mp.mol.atoms[this.to].center);
	}
	else
	{
		return this.mp.mol.atoms[this.to].center.angleTo(
			this.mp.mol.atoms[this.from].center);
	}
}

MPBond.prototype.setIndex = function(index) { this.index = index; }

MPBond.prototype.setType = function(type)
{
	this.type = type;
	this.changed();
}

MPBond.prototype.setStereo = function(stereo)
{
	this.stereo = stereo;
	this.changed();
}

MPBond.prototype.setFrom = function(from)
{
	this.from = from;
	this.changed();
}

MPBond.prototype.setTo = function(to)
{
	this.to = to;
	this.changed();
}

/**
 * Sets display type
 * @param {String} type
 */
MPBond.prototype.setDisplay = function(type)
{
	if(type !== this.display)
	{
		this.display = type;
		this.mp.requestRedraw();
	}
}

/**
 * Replace a given atom with another atom
 * @param {Integer} i Atom index
 * @param {Integer} n New atom index
 */
MPBond.prototype.replaceAtom = function(i, n)
{
	if(this.from === i && this.to !== n) this.from = n;
	else if(this.to === i && this.from !== n) this.to = n;
	this.changed();
}

/**
 * Compares all properties of this bond with a plain MPBond configuration object
 * @param  {Object} config
 * @return {Boolean}
 */
MPBond.prototype.compare = function(config)
{
	return config.i === this.index
		&& config.type === this.type
		&& config.stereo === this.stereo
		&& config.from === this.from
		&& config.to === this.to;
}

/**
 * Checks if this MPBond is equal to another MPBond
 * @param  {MPBond} bond
 * @return {Booelan}
 */
MPBond.prototype.equals = function(bond)
{
	return bond.from === this.from && bond.to === this.to;
}

/**
 * Wrapper for MPBond.selected (for maintainability)
 */
MPBond.prototype.isSelected = function()
{
	return this.selected;
}

/**
 * Checks is this MPBond is hidden (not the same as invisible)
 */
MPBond.prototype.isHidden = function()
{
	return this.display === "hidden" || this.hidden;
}

/**
 * Checks if this bond is a pair of the given elements
 * @param  {String} a
 * @param  {String} b
 * @return {Booelan}
 */
MPBond.prototype.isPair = function(a, b)
{
	var _a = this.mp.mol.atoms[this.from].element;
	var _b = this.mp.mol.atoms[this.to].element;
	return _a === a && _b === b || _a === b && _b === a;
}

/**
 * Checks if this bond is bonded to the given MPAtom.index
 * @param  {Integer} i
 * @return {Booelan}
 */
MPBond.prototype.hasAtom = function(i)
{
	return this.from === i || this.to === i;
}

/**
 * Get the atom index of the atom on the other side of the given MPAtom.index
 * @param  {Integer} i
 * @return {Integer}
 */
MPBond.prototype.getOppositeAtom = function(i)
{
	return this.from === i ? this.to : this.from;
}

/**
 * Selects or deselects this MPBond
 * @param {Boolean} select
 */
MPBond.prototype.select = function(select)
{
	if(this.isSelected() !== select)
	{
		this.selected = select;
		this.mp.sel.update();
		this.mp.requestRedraw();
	}
}

/**
 * Invalidate this bond
 */
MPBond.prototype.invalidate = function()
{
	this.valid = false;
	this.mp.requestRedraw();
}

/**
 * Invalidation helper called when bond is changed
 */
MPBond.prototype.changed = function()
{
	this.invalidate();
	this.mp.mol.atoms[this.from].bondsChanged();
	this.mp.mol.atoms[this.to].bondsChanged();
}

/**
 * Render methods
 */

MPBond.prototype.drawStateColor = function()
{
	if(this.isHidden() || this.line === undefined) return;

	if(this.display === "hover" || this.display === "active" ||
			(this.display === "normal" && this.isSelected()))
	{
		var d = this.isSelected() ? "selected" : this.display;

		this.mp.ctx.beginPath();

		var f = this.line.from;
		var t = this.line.to;

		//stick to 'from' atom center if 'from' atom is selected (multi-select)
		if(this.mp.mol.atoms[this.from].isSelected())
		{
			f = this.mp.mol.atoms[this.from].center;
		}
		//stick to 'to' atom center if 'to' atom is selected (multi-select)
		if(this.mp.mol.atoms[this.to].isSelected())
		{
			t = this.mp.mol.atoms[this.to].center;
		}

		this.mp.ctx.moveTo(f.x, f.y);
		this.mp.ctx.lineTo(t.x, t.y);

		this.mp.ctx.strokeStyle = this.mp.s.bond[d].color;
		this.mp.ctx.stroke();
	}
}

MPBond.prototype.drawBond = function()
{
	if(this.isHidden() || this.line === undefined) return;

	var scale = this.mp.s.bond.scale;
	var ctx = this.mp.ctx;

	if(this.mp.s.bond.colored && !this.mp.s.atom.miniLabel)
	{
		ctx.strokeStyle = this.cache.bondColor;
		if(this.stereo === MP_STEREO_UP) ctx.fillStyle = this.cache.bondColor;
	}

	if(this.mp.getScale() < this.mp.s.bond.singleOnlyScale)
	{
		ctx.beginPath();
		ctx.moveTo(this.line.from.x, this.line.from.y);
		ctx.lineTo(this.line.to.x, this.line.to.y);
		ctx.stroke();
	}
	else if(this.stereo === MP_STEREO_CIS_TRANS && this.type === MP_BOND_DOUBLE)
	{
		ctx.beginPath();
		ctx.moveTo(this.cache.ctd.from[0].x, this.cache.ctd.from[0].y);
		ctx.lineTo(this.cache.ctd.to[0].x, this.cache.ctd.to[0].y);
		ctx.moveTo(this.cache.ctd.from[1].x, this.cache.ctd.from[1].y);
		ctx.lineTo(this.cache.ctd.to[1].x, this.cache.ctd.to[1].y);
		ctx.stroke();
	}
	else if(this.stereo === MP_STEREO_UP)//wedge bond
	{
		ctx.beginPath();
		ctx.moveTo(this.cache.wedge.far[0].x, this.cache.wedge.far[0].y);
		ctx.lineTo(this.cache.wedge.near[0].x, this.cache.wedge.near[0].y);
		ctx.lineTo(this.line.to.x, this.line.to.y);
		ctx.lineTo(this.cache.wedge.near[1].x, this.cache.wedge.near[1].y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
	else if(this.stereo === MP_STEREO_DOWN)//hash bond
	{
		ctx.beginPath();
		for(var i = 0; i < this.cache.hashLines.length; i++)
		{
			ctx.moveTo(this.cache.hashLines[i].from.x, this.cache.hashLines[i].from.y);
			ctx.lineTo(this.cache.hashLines[i].to.x, this.cache.hashLines[i].to.y);
		}
		ctx.stroke();
	}
	else if(this.type === MP_BOND_SINGLE)
	{
		ctx.beginPath();
		ctx.moveTo(this.line.from.x, this.line.from.y);
		ctx.lineTo(this.line.to.x, this.line.to.y);
		ctx.stroke();
	}
	else if(this.type === MP_BOND_DOUBLE || this.type === MP_BOND_TRIPLE)
	{
		ctx.beginPath();
		for(var i = 0; i < this.cache.bond.from.length; i++)
		{
			ctx.moveTo(this.cache.bond.from[i].x, this.cache.bond.from[i].y);
			ctx.lineTo(this.cache.bond.to[i].x, this.cache.bond.to[i].y);
		}
		if(this.type === MP_BOND_TRIPLE)
		{
			ctx.moveTo(this.line.from.x, this.line.from.y);
			ctx.lineTo(this.line.to.x, this.line.to.y);
		}
		ctx.stroke();
	}
}
