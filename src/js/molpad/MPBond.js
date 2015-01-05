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

var MP_BOND_SINGLE = 1;
var MP_BOND_DOUBLE = 2;
var MP_BOND_TRIPLE = 3;
var MP_BOND_WEDGEHASH = 4;

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
	this.mp.invalidate();
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
	return {
		from: this.mp.mol.atoms[this.from].center,
		to: this.mp.mol.atoms[this.to].center
	}
}

MPBond.prototype.setIndex = function(index) { this.index = index; }

MPBond.prototype.setType = function(type)
{
	this.type = type;
	this.invalidate();
}

MPBond.prototype.setStereo = function(stereo)
{
	this.stereo = stereo;
	this.invalidate();
}

MPBond.prototype.setFrom = function(from)
{
	this.from = from;
	this.invalidate();
}

MPBond.prototype.setTo = function(to)
{
	this.to = to;
	this.invalidate();
}

/**
 * Sets display type
 * @param {String} type
 */
MPBond.prototype.setDisplay = function(type)
{
	if(type != this.display)
	{
		this.display = type;
		this.invalidate();
	}
}

/**
 * Replace a given atom with another atom
 * @param {Integer} i Atom index
 * @param {Integer} n New atom index
 */
MPBond.prototype.replaceAtom = function(i, n)
{
	if(this.from == i && this.to != n) this.from = n;
	else if(this.to == i && this.from != n) this.to = n;
	this.invalidate();
}

/**
 * Compares all properties of this bond with a plain MPBond configuration object
 * @param  {Object} config
 * @return {Boolean}
 */
MPBond.prototype.compare = function(config)
{
	return config.i == this.index
		&& config.type == this.type
		&& config.stereo == this.stereo
		&& config.from == this.from
		&& config.to == this.to;
}

/**
 * Checks if this MPBond is equal to another MPBond
 * @param  {MPBond} bond
 * @return {Booelan}
 */
MPBond.prototype.equals = function(bond)
{
	return bond.from == this.from && bond.to == this.to;
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
	return this.display == "hidden" || this.hidden;
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
	return _a == a && _b == b || _a == b && _b == a;
}

/**
 * Checks if this bond is bonded to the given MPAtom.index
 * @param  {Integer} i
 * @return {Booelan}
 */
MPBond.prototype.hasAtom = function(i)
{
	return this.from == i || this.to == i;
}

/**
 * Get the atom index of the atom on the other side of the given MPAtom.index
 * @param  {Integer} i
 * @return {Integer}
 */
MPBond.prototype.getOppositeAtom = function(i)
{
	return this.from == i ? this.to : this.from;
}

/**
 * Selects or deselects this MPBond
 * @param {Boolean} select
 */
MPBond.prototype.select = function(select)
{
	if(this.isSelected() != select)
	{
		this.selected = select;
		this.mp.sel.update();
		this.mp.invalidate();
	}
}

/**
 * Invalidate this bond
 * If this bond changes, secondary bonds of invisible atom are always invalidated
 */
MPBond.prototype.invalidate = function()
{
	this.valid = false;

	if(!this.mp.mol.atoms[this.from].isVisible())
		this.mp.mol.atoms[this.from].invalidateBonds();
	if(!this.mp.mol.atoms[this.to].isVisible())
		this.mp.mol.atoms[this.to].invalidateBonds();

	this.mp.invalidate();
}

MPBond.prototype.invalidateFrom = function(from, updateSecondary)
{
	this.valid = false;

	if(from !== undefined)
	{
		var t = from == this.from ? this.to : this.from;

		if(updateSecondary && !this.mp.mol.atoms[t].isVisible())
		{
			this.mp.mol.atoms[t].invalidateBonds();
		}
	}

	this.mp.invalidate();
}

MPBond.prototype.validate = function()
{
	if(this.valid) return;
	this.valid = true;

	if(this.mp.mol.atoms[this.from].center.distanceTo(
			this.mp.mol.atoms[this.to].center) <=
			((this.mp.mol.atoms[this.from].isVisible() ? 1 : 0) +
			(this.mp.mol.atoms[this.to].isVisible() ? 1 : 0)) *
			this.mp.s.atom.radius)
	{
		this.hidden = true;
	}
	else
	{
		this.hidden = false;

		var scale = this.mp.s.bond.scale;

		this.cache = {};
		this.line = {
			from: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, [0])[0],
			to: this.mp.mol.atoms[this.to].calculateBondVertices(this.from, [0])[0]
		};
		this.line.center = new MPPFO({
			x: (this.line.from.x + this.line.to.x) / 2,
			y: (this.line.from.y + this.line.to.y) / 2
		});

		if(this.mp.s.bond.colored)
		{
			var f = this.mp.mol.atoms[this.from];
			var t = this.mp.mol.atoms[this.to];

			if(this.stereo == MP_STEREO_UP)
			{
				this.cache.bondColor = JmolAtomColorsHashHex["C"];
			}
			else if(f.element == t.element)
			{
				this.cache.bondColor = JmolAtomColorsHashHex[f.element];
			}
			else
			{
				this.cache.bondColor = this.mp.ctx.createLinearGradient(f.getX(), f.getY(), t.getX(), t.getY());
				this.cache.bondColor.addColorStop(this.mp.s.bond.gradient.from, JmolAtomColorsHashHex[f.element]);
				this.cache.bondColor.addColorStop(this.mp.s.bond.gradient.to, JmolAtomColorsHashHex[t.element]);
			}
		}
		else//fallback, this color is actually not used
		{
			this.cache.bondColor = this.mp.s.bond.color;
		}

		if(this.stereo == MP_STEREO_CIS_TRANS && this.type == MP_BOND_DOUBLE)
		{
			//TODO: connect one double CIS-TRANS bond to [0] endpoint
			var ends = multiplyAll(this.mp.s.bond.delta[MP_BOND_DOUBLE],
					this.mp.s.bond.deltaScale);
			this.cache.ctd = {
				from: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, ends),
				to: this.mp.mol.atoms[this.to].calculateBondVertices(this.from, ends)
			};
		}
		else if(this.stereo == MP_STEREO_UP)//wedge bond
		{
			this.cache.wedge = {
				far: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, [0]),
				near: this.mp.mol.atoms[this.to].calculateBondVertices(this.from,
						multiplyAll(this.mp.s.bond.delta[MP_BOND_WEDGEHASH],
							this.mp.s.bond.deltaScale))
			}
		}
		else if(this.stereo == MP_STEREO_DOWN)//hash bond
		{
			var far = this.mp.mol.atoms[this.from].calculateBondVertices(this.to, [0]);
			var near = this.mp.mol.atoms[this.to].calculateBondVertices(this.from,
					multiplyAll(this.mp.s.bond.delta[MP_BOND_WEDGEHASH],
						this.mp.s.bond.deltaScale));

			var dx1 = near[0].x - far[0].x;
			var dy1 = near[0].y - far[0].y;
			var dx2 = near[1].x - far[0].x;
			var dy2 = near[1].y - far[0].y;
			var d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
			var w = this.mp.s.bond.width * scale;
			var s = this.mp.s.bond.hashLineSpace * scale;

			this.cache.hashLines = [];
			while(d1 - s - w > 0)
			{
				var mult = (d1 - s - w) / d1;
				d1 *= mult;
				dx1 *= mult; dy1 *= mult;
				dx2 *= mult; dy2 *= mult;

				this.cache.hashLines.push({
					from: { x: far[0].x + dx1, y: far[0].y + dy1 },
					to: { x: far[0].x + dx2, y: far[0].y + dy2 }
				});
			}
		}
		else if(this.type >= MP_BOND_DOUBLE && this.type <= MP_BOND_TRIPLE)
		{
			var ends = multiplyAll(this.mp.s.bond.delta[this.type],
					this.mp.s.bond.deltaScale);
			this.cache.bond = {
				from: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, ends),
				to: this.mp.mol.atoms[this.to].calculateBondVertices(this.from, ends.reverse())
			};
		}
	}
}

/**
 * Returns the from.angleTo(to)
 * @param  {Integer} from From atom index
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

/**
 * Render methods
 */

MPBond.prototype.drawStateColor = function()
{
	this.validate();
	if(this.isHidden()) return;//maybe this is hidden in the validation

	if(this.display == "hover" || this.display == "active" ||
			(this.display == "normal" && this.isSelected()))
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
	this.validate();
	if(this.isHidden()) return;//maybe this is hidden in the validation

	var scale = this.mp.s.bond.scale;
	var ctx = this.mp.ctx;

	if(this.mp.s.bond.colored && !this.mp.s.atom.miniLabel)
	{
		ctx.strokeStyle = this.cache.bondColor;
		if(this.stereo == MP_STEREO_UP) ctx.fillStyle = this.cache.bondColor;
	}

	if(this.stereo == MP_STEREO_CIS_TRANS && this.type == MP_BOND_DOUBLE)
	{
		ctx.beginPath();
		ctx.moveTo(this.cache.ctd.from[0].x, this.cache.ctd.from[0].y);
		ctx.lineTo(this.cache.ctd.to[0].x, this.cache.ctd.to[0].y);
		ctx.moveTo(this.cache.ctd.from[1].x, this.cache.ctd.from[1].y);
		ctx.lineTo(this.cache.ctd.to[1].x, this.cache.ctd.to[1].y);
		ctx.stroke();
	}
	else if(this.stereo == MP_STEREO_UP)//wedge bond
	{
		ctx.beginPath();
		ctx.moveTo(this.cache.wedge.far[0].x, this.cache.wedge.far[0].y);
		ctx.lineTo(this.cache.wedge.near[0].x, this.cache.wedge.near[0].y);
		ctx.lineTo(this.cache.wedge.near[1].x, this.cache.wedge.near[1].y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
	else if(this.stereo == MP_STEREO_DOWN)//hash bond
	{
		ctx.beginPath();
		for(var i = 0; i < this.cache.hashLines.length; i++)
		{
			ctx.moveTo(this.cache.hashLines[i].from.x, this.cache.hashLines[i].from.y);
			ctx.lineTo(this.cache.hashLines[i].to.x, this.cache.hashLines[i].to.y);
		}
		ctx.stroke();
	}
	else if(this.type == MP_BOND_SINGLE)
	{
		ctx.beginPath();
		ctx.moveTo(this.line.from.x, this.line.from.y);
		ctx.lineTo(this.line.to.x, this.line.to.y);
		ctx.stroke();
	}
	else if(this.type > 0 && this.type <= MP_BOND_TRIPLE)
	{
		ctx.beginPath();
		for(var i = 0; i < this.cache.bond.from.length; i++)
		{
			ctx.moveTo(this.cache.bond.from[i].x, this.cache.bond.from[i].y);
			ctx.lineTo(this.cache.bond.to[i].x, this.cache.bond.to[i].y);
		}
		ctx.stroke();
	}
}
