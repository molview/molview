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

			if(this.stereo === MP_STEREO_UP)
			{
				this.cache.bondColor = JmolAtomColorsHashHex["C"];
			}
			else if(f.element === t.element)
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

		if(this.mp.getScale() >= this.mp.s.bond.singleOnlyScale)
		{
			if(this.stereo === MP_STEREO_CIS_TRANS && this.type === MP_BOND_DOUBLE)
			{
				var ends = transformArrayMult(this.mp.s.bond.delta[MP_BOND_CIS],
						this.mp.s.bond.deltaScale);
				this.cache.ctd = {
					from: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, ends),
					to: this.mp.mol.atoms[this.to].calculateBondVertices(this.from, ends)
				};
			}
			else if(this.stereo === MP_STEREO_UP)//wedge bond
			{
				this.cache.wedge = {
					far: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, [0]),
					near: this.mp.mol.atoms[this.to].calculateBondVertices(this.from,
							transformArrayMult(this.mp.s.bond.delta[MP_BOND_WEDGEHASH],
								this.mp.s.bond.deltaScale))
				};

				if(!this.mp.mol.atoms[this.to].isVisible())
				{
					var bonds = this.mp.mol.atoms[this.to].calculateClosestBonds(this.index);

					if(!bonds.none)
					{
						if(this.mp.mol.bonds[bonds.upper].type == MP_BOND_SINGLE)
						{
							var i1 = this.mp.mol.bonds[bonds.upper].getLine().intersection(
								new MPLine({
									from: this.cache.wedge.far[0],
									to: this.cache.wedge.near[0]
							}));
							if(i1.p !== undefined && this.line.to.distanceTo(i1.p) < this.mp.s.bond.wedgeFitMaxD)
							{
								this.cache.wedge.near[0] = i1.p || this.cache.wedge.near[0];
							}
						}
						if(this.mp.mol.bonds[bonds.lower].type == MP_BOND_SINGLE)
						{
							var i2 = this.mp.mol.bonds[bonds.lower].getLine().intersection(
								new MPLine({
									from: this.cache.wedge.far[0],
									to: this.cache.wedge.near[1]
							}));
							if(i2.p !== undefined && this.line.to.distanceTo(i2.p) < this.mp.s.bond.wedgeFitMaxD)
							{
								this.cache.wedge.near[1] = i2.p || this.cache.wedge.near[1];
							}
						}
					}
				}
			}
			else if(this.stereo === MP_STEREO_DOWN)//hash bond
			{
				var far = this.mp.mol.atoms[this.from].calculateBondVertices(this.to, [0]);
				var near = this.mp.mol.atoms[this.to].calculateBondVertices(this.from,
						transformArrayMult(this.mp.s.bond.delta[MP_BOND_WEDGEHASH],
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
			else if(this.type === MP_BOND_DOUBLE || this.type === MP_BOND_TRIPLE)
			{
				var ends = [];
				var doubleSide = 1;
				//check if this bond will be displayed using all skeletal display rules
				var skeletal = (this.mp.s.skeletalDisplay &&//skeleton display is enabled
						(!this.mp.mol.atoms[this.from].isVisible() || !this.mp.mol.atoms[this.to].isVisible()) &&//and at least one atom is visible
						//and the bond is not a bond which connects:
						!(this.mp.mol.atoms[this.from].bonds.length === 1 &&//an atom with no other bonds
							((this.mp.mol.atoms[this.from].isVisible() &&//which is visible
							this.mp.mol.atoms[this.to].bonds.length > 2) ||//to any atom that is connected to 2+ other atoms
							this.mp.mol.atoms[this.to].bonds.length === 1)) &&//or to another atom with no other bonds
						!(this.mp.mol.atoms[this.to].bonds.length === 1 &&
							((this.mp.mol.atoms[this.to].isVisible() &&
							this.mp.mol.atoms[this.from].bonds.length > 2) ||//to any atom that is connected to 2+ other atoms
							this.mp.mol.atoms[this.from].bonds.length === 1)));

				if(this.type === MP_BOND_DOUBLE)
				{
					var array = this.mp.s.bond.delta[MP_BOND_DOUBLE];
					if(skeletal) array = transformArrayAdd(array, -doubleSide * array[0]);
					ends = transformArrayMult(array, this.mp.s.bond.deltaScale);
				}
				else if(this.type === MP_BOND_TRIPLE)
				{
					ends = transformArrayMult(this.mp.s.bond.delta[MP_BOND_TRIPLE],
							this.mp.s.bond.deltaScale);
				}

				var flippedEnds = transformArrayMult(ends, -1);
				this.cache.bond = {
					from: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, ends),
					to: this.mp.mol.atoms[this.to].calculateBondVertices(this.from, flippedEnds)
				};

				if(!this.mp.mol.atoms[this.from].isVisible())
				{
					var fromBonds = this.mp.mol.atoms[this.from].calculateClosestBonds(this.index);

					if(!fromBonds.none)
					{
						if((doubleSide === 1 || !skeletal || this.type === MP_BOND_TRIPLE)
						&& fromBonds.lowerSectionAngle < Math.PI)
						{
							this.cache.bond.from[1] = this.refineBondVetex(
									skeletal, fromBonds.lowerBisectAngle,
									this.line.from, this.cache.bond.from[1], this.cache.bond.to[1],
									this.mp.mol.bonds[fromBonds.lower].getLine());
						}
						if((doubleSide === -1 || !skeletal || this.type === MP_BOND_TRIPLE)
						&& fromBonds.upperSectionAngle < Math.PI)
						{
							this.cache.bond.from[0] = this.refineBondVetex(
									skeletal, fromBonds.upperBisectAngle,
									this.line.from, this.cache.bond.from[0], this.cache.bond.to[0],
									this.mp.mol.bonds[fromBonds.upper].getLine());
						}
					}
				}

				if(!this.mp.mol.atoms[this.to].isVisible())
				{
					var toBonds = this.mp.mol.atoms[this.to].calculateClosestBonds(this.index);

					if(!toBonds.none)
					{
						if((doubleSide === 1 || !skeletal || this.type === MP_BOND_TRIPLE)
						&& toBonds.upperSectionAngle < Math.PI)
						{
							this.cache.bond.to[1] = this.refineBondVetex(skeletal, toBonds.upperBisectAngle,
									this.line.to, this.cache.bond.from[1], this.cache.bond.to[1],
									this.mp.mol.bonds[toBonds.upper].getLine());
						}
						if((doubleSide === -1 || !skeletal || this.type === MP_BOND_TRIPLE)
						&& toBonds.lowerSectionAngle < Math.PI)
						{
							this.cache.bond.to[0] = this.refineBondVetex(skeletal, toBonds.lowerBisectAngle,
									this.line.to, this.cache.bond.from[0], this.cache.bond.to[0],
									this.mp.mol.bonds[toBonds.lower].getLine());
						}
					}
				}
			}
		}
	}
}


MPBond.prototype.refineBondVetex = function(skeletal, bisectAngle, lineFrom, bondFrom, bondTo, closestBondLine)
{
	var intersection;
	if(skeletal)
	{
		intersection = new MPLine({
			from: lineFrom,
			to: MPPFO({
				x: lineFrom.x + Math.cos(bisectAngle),
				y: lineFrom.y + Math.sin(-bisectAngle)
			})
		}).intersection(
			new MPLine({
				from: bondFrom,
				to: bondTo
		}));
	}
	else
	{
		intersection = closestBondLine.intersection(
			new MPLine({
				from: bondFrom,
				to: bondTo
		}));
	}

	return intersection.p !== undefined && lineFrom.distanceTo(intersection.p) <
			this.mp.s.bond.multiBondFitMaxD ? intersection.p : bondFrom;
}
