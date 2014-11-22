/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014, Herman Bergwerf
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
	this.display = "normal";

	this.valid = false;
	this.mp.invalidate();
}

MPBond.prototype.getKetcherData = function()
{
	return new chem.Struct.Bond({
		type: this.type,
		stereo: this.stereo,
		begin: this.from,
		end: this.to
	});
}

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

MPBond.prototype.equals = function(bond)
{
	return bond.from == this.from && bond.to == this.to;
}

MPBond.prototype.isPair = function(a, b)
{
	var _a = this.mp.molecule.atoms[this.from].element;
	var _b = this.mp.molecule.atoms[this.to].element;
	return _a == a && _b == b || _a == b && _b == a;
}

MPBond.prototype.hasAtom = function(i)
{
	return this.from == i || this.to == i;
}

MPBond.prototype.oppositeAtom = function(i)
{
	return this.from == i ? this.to : this.from;
}

/**
 * Invalidate this bond
 * If this bond changes, secondary bonds of invisible atom are always invalidated
 */
MPBond.prototype.invalidate = function()
{
	this.valid = false;

	if(!this.mp.molecule.atoms[this.from].isVisible())
		this.mp.molecule.atoms[this.from].invalidateBonds();
	if(!this.mp.molecule.atoms[this.to].isVisible())
		this.mp.molecule.atoms[this.to].invalidateBonds();

	this.mp.invalidate();
}

MPBond.prototype.invalidateFrom = function(from, updateSecondary)
{
	this.valid = false;

	if(from !== undefined)
	{
		var t = from == this.from ? this.to : this.from;

		if(updateSecondary && !this.mp.molecule.atoms[t].isVisible())
		{
			this.mp.molecule.atoms[t].invalidateBonds();
		}
	}

	this.mp.invalidate();
}

MPBond.prototype.validate = function()
{
	if(this.valid) return;
	this.valid = true;

	var scale = this.mp.settings.bond.scale;

	this.cache = {};
	this.line = {
		from: this.mp.molecule.atoms[this.from].calculateBondVertices(this.to, [0])[0],
		to: this.mp.molecule.atoms[this.to].calculateBondVertices(this.from, [0])[0]
	};

	if(this.mp.settings.bond.colored)
	{
		var f = this.mp.molecule.atoms[this.from];
		var t = this.mp.molecule.atoms[this.to];

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
			this.cache.bondColor.addColorStop(this.mp.settings.bond.gradient.from, JmolAtomColorsHashHex[f.element]);
			this.cache.bondColor.addColorStop(this.mp.settings.bond.gradient.to, JmolAtomColorsHashHex[t.element]);
		}
	}
	else//fallback, this color is actually not used
	{
		this.cache.bondColor = this.mp.settings.bond.color;
	}

	if(this.stereo == MP_STEREO_CIS_TRANS && this.type == MP_BOND_DOUBLE)
	{
		//TODO: connect one double CIS-TRANS bond to [0] endpoint
		var ends = multiplyAll(this.mp.settings.bond.delta[MP_BOND_DOUBLE],
				this.mp.settings.bond.deltaScale);
		this.cache.ctd = {
			from: this.mp.molecule.atoms[this.from].calculateBondVertices(this.to, ends),
			to: this.mp.molecule.atoms[this.to].calculateBondVertices(this.from, ends)
		};
	}
	else if(this.stereo == MP_STEREO_UP)//wedge bond
	{
		this.cache.wedge = {
			far: this.mp.molecule.atoms[this.from].calculateBondVertices(this.to, [0]),
			near: this.mp.molecule.atoms[this.to].calculateBondVertices(this.from,
					multiplyAll(this.mp.settings.bond.delta[MP_BOND_WEDGEHASH],
						this.mp.settings.bond.deltaScale))
		}
	}
	else if(this.stereo == MP_STEREO_DOWN)//hash bond
	{
		var far = this.mp.molecule.atoms[this.from].calculateBondVertices(this.to, [0]);
		var near = this.mp.molecule.atoms[this.to].calculateBondVertices(this.from,
				multiplyAll(this.mp.settings.bond.delta[MP_BOND_WEDGEHASH],
					this.mp.settings.bond.deltaScale));

		var dx1 = near[0].x - far[0].x;
		var dy1 = near[0].y - far[0].y;
		var dx2 = near[1].x - far[0].x;
		var dy2 = near[1].y - far[0].y;
		var d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
		var w = this.mp.settings.bond.width * scale;
		var s = this.mp.settings.bond.hashLineSpace * scale;

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
		var ends = multiplyAll(this.mp.settings.bond.delta[this.type],
				this.mp.settings.bond.deltaScale);
		this.cache.bond = {
			from: this.mp.molecule.atoms[this.from].calculateBondVertices(this.to, ends),
			to: this.mp.molecule.atoms[this.to].calculateBondVertices(this.from, ends.reverse())
		};
	}
}

MPBond.prototype.getAngle = function(from)
{
	//Note: flip y coords
	if(this.mp.molecule.atoms[this.from].equals(from))
		return Math.atan2(
			from.getY() - this.mp.molecule.atoms[this.to].getY(),
			this.mp.molecule.atoms[this.to].getX() - from.getX());
	else
		return Math.atan2(
			from.getY() - this.mp.molecule.atoms[this.from].getY(),
			this.mp.molecule.atoms[this.from].getX() - from.getX());
}

/**
 * Render methods
 */

MPBond.prototype.drawStateColor = function()
{
	this.validate();

	if(this.display == "hover" || this.display == "active")
	{
		this.mp.ctx.beginPath();

		var f = this.line.from;
		var t = this.line.to;
		if(this.mp.molecule.atoms[this.from].display != "normal")
			f = this.mp.molecule.atoms[this.from].center;
		if(this.mp.molecule.atoms[this.to].display != "normal")
			t = this.mp.molecule.atoms[this.to].center;

		this.mp.ctx.moveTo(f.x, f.y);
		this.mp.ctx.lineTo(t.x, t.y);

		this.mp.ctx.strokeStyle = this.mp.settings.bond[this.display].color;
		this.mp.ctx.stroke();
	}
}

MPBond.prototype.drawBond = function()
{
	this.validate();

	if(this.display == "hidden") return;

	var scale = this.mp.settings.bond.scale;
	var ctx = this.mp.ctx;

	if(this.mp.settings.bond.colored && !this.mp.settings.atom.miniLabel)
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
