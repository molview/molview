/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

MPBond.prototype.validate = function () {
	if (this.valid) return;
	this.valid = true;

	if (this.mp.mol.atoms[this.from].center.distanceTo(
		this.mp.mol.atoms[this.to].center) <=
		((this.mp.mol.atoms[this.from].isVisible() ? 1 : 0) +
			(this.mp.mol.atoms[this.to].isVisible() ? 1 : 0)) *
		this.mp.s.atom.radius) {
		this.hidden = true;
	}
	else {
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

		if (this.mp.s.bond.colored) {
			var f = this.mp.mol.atoms[this.from];
			var t = this.mp.mol.atoms[this.to];

			if (this.stereo === MP_STEREO_UP) {
				this.cache.bondColor = JmolAtomColorsHashHex["C"];
			}
			else if (f.element === t.element) {
				this.cache.bondColor = JmolAtomColorsHashHex[f.element] || JmolAtomColorsHashHex["C"];
			}
			else {
				this.cache.bondColor = this.mp.ctx.createLinearGradient(f.getX(), f.getY(), t.getX(), t.getY());
				this.cache.bondColor.addColorStop(this.mp.s.bond.gradient.from, JmolAtomColorsHashHex[f.element] || JmolAtomColorsHashHex["C"]);
				this.cache.bondColor.addColorStop(this.mp.s.bond.gradient.to, JmolAtomColorsHashHex[t.element] || JmolAtomColorsHashHex["C"]);
			}
		}
		else//fallback, this color is actually not used
		{
			this.cache.bondColor = this.mp.s.bond.color;
		}

		if (this.mp.getScale() >= this.mp.s.bond.singleOnlyScale) {
			if (this.stereo === MP_STEREO_CIS_TRANS && this.type === MP_BOND_DOUBLE) {
				var ends = transformArrayMult(this.mp.s.bond.delta[MP_BOND_CIS],
					-this.mp.s.bond.deltaScale);//flip ends because of flipped y-axis
				this.cache.ctd = {
					from: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, ends),
					to: this.mp.mol.atoms[this.to].calculateBondVertices(this.from, ends)
				};
			}
			else if (this.stereo === MP_STEREO_UP)//wedge bond
			{
				this.cache.wedge = {
					far: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, [0]),
					near: this.mp.mol.atoms[this.to].calculateBondVertices(this.from,
						transformArrayMult(this.mp.s.bond.delta[MP_BOND_WEDGEHASH],
							-this.mp.s.bond.deltaScale))//flip ends because of flipped y-axis
				};

				if (!this.mp.mol.atoms[this.to].isVisible()) {
					var bonds = this.mp.mol.atoms[this.to].calculateClosestBonds(this.index);

					if (!bonds.none) {
						if (this.mp.mol.bonds[bonds.lower].type == MP_BOND_SINGLE) {
							var i1 = this.mp.mol.bonds[bonds.lower].getLine().intersection(
								new MPLine({
									from: this.cache.wedge.far[0],
									to: this.cache.wedge.near[0]
								}));
							if (i1.p !== undefined && this.line.to.distanceTo(i1.p) < this.mp.s.bond.wedgeFitMaxD) {
								this.cache.wedge.near[0] = i1.p || this.cache.wedge.near[0];
							}
						}
						if (this.mp.mol.bonds[bonds.upper].type == MP_BOND_SINGLE) {
							var i2 = this.mp.mol.bonds[bonds.upper].getLine().intersection(
								new MPLine({
									from: this.cache.wedge.far[0],
									to: this.cache.wedge.near[1]
								}));
							if (i2.p !== undefined && this.line.to.distanceTo(i2.p) < this.mp.s.bond.wedgeFitMaxD) {
								this.cache.wedge.near[1] = i2.p || this.cache.wedge.near[1];
							}
						}
					}
				}
			}
			else if (this.stereo === MP_STEREO_DOWN)//hash bond
			{
				var far = this.mp.mol.atoms[this.from].calculateBondVertices(this.to, [0]);
				var near = this.mp.mol.atoms[this.to].calculateBondVertices(this.from,
					transformArrayMult(this.mp.s.bond.delta[MP_BOND_WEDGEHASH],
						-this.mp.s.bond.deltaScale));//flip ends because of flipped y-axis

				var dx1 = near[0].x - far[0].x;
				var dy1 = near[0].y - far[0].y;
				var dx2 = near[1].x - far[0].x;
				var dy2 = near[1].y - far[0].y;
				var d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
				var w = this.mp.s.bond.width * scale;
				var s = this.mp.s.bond.hashLineSpace * scale;

				this.cache.hashLines = [];
				while (d1 - s - w > 0) {
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
			else if (this.type === MP_BOND_DOUBLE || this.type === MP_BOND_TRIPLE) {
				var ends = [];
				var doubleSide = 1;
				var fromBonds = this.mp.mol.atoms[this.from].calculateClosestBonds(this.index);
				var toBonds = this.mp.mol.atoms[this.to].calculateClosestBonds(this.index);
				var refineUpperSkeletal = false, refineLowerSkeletal = false;


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

				if (skeletal) {
					/*
					Calculate best doubleSide
					=========================
					1. The sum of the deviation of the bisect angle relative to
					the bestBisect angle of the upper and the lower side are
					calculated. The side with the least bestBisect deviation
					is used for the double bond
					2. The approximated double bond length is calcualted
					using a horizontal bond with length this.line distance
					and bond delta = 8. Using this length, the bond refinement
					is skipped or the bond is force flipped to a different side
					*/
					var length = this.line.from.distanceTo(this.line.to);
					var upperLength = length, upperBisectD = 0;

					if (fromBonds.upperSectionAngle < Math.PI) {
						if (!this.mp.mol.atoms[this.from].isVisible())
							upperLength -= 8 / Math.tan(fromBonds.upperSectionAngle / 2);
						upperBisectD += Math.abs(this.mp.s.bond.bestBisect - fromBonds.upperSectionAngle / 2);
					}
					else upperBisectD += Math.abs(this.mp.s.bond.bestBisect - Math.PI / 2);

					if (toBonds.lowerSectionAngle < Math.PI) {
						if (!this.mp.mol.atoms[this.to].isVisible())
							upperLength -= 8 / Math.tan(toBonds.lowerSectionAngle / 2);
						upperBisectD += Math.abs(this.mp.s.bond.bestBisect - toBonds.lowerSectionAngle / 2);
					}
					else upperBisectD += Math.abs(this.mp.s.bond.bestBisect - Math.PI / 2);

					var lowerLength = length, lowerBisectD = 0;
					if (fromBonds.lowerSectionAngle < Math.PI) {
						if (!this.mp.mol.atoms[this.from].isVisible())
							lowerLength -= 8 / Math.tan(fromBonds.lowerSectionAngle / 2);
						lowerBisectD += Math.abs(this.mp.s.bond.bestBisect - fromBonds.lowerSectionAngle / 2);
					}
					else lowerBisectD += Math.abs(this.mp.s.bond.bestBisect - Math.PI / 2);

					if (toBonds.upperSectionAngle < Math.PI) {
						if (!this.mp.mol.atoms[this.to].isVisible())
							lowerLength -= 8 / Math.tan(toBonds.upperSectionAngle / 2);
						lowerBisectD += Math.abs(this.mp.s.bond.bestBisect - toBonds.upperSectionAngle / 2);
					}
					else lowerBisectD += Math.abs(this.mp.s.bond.bestBisect - Math.PI / 2);

					//check if the opposite sections are almost the same (like in a chain)
					//if so, a fallback rule is applied (in order to prevent from
					//inconsistent double bond sides in carbon chains)
					if (Math.abs(fromBonds.upperSectionAngle - toBonds.upperSectionAngle) +
						Math.abs(fromBonds.lowerSectionAngle - toBonds.lowerSectionAngle) < this.mp.s.bond.angleDev) {
						//fallback rule: double bond to the visual upper side
						var a = this.mp.mol.atoms[this.from].center.angleTo(this.mp.mol.atoms[this.to].center);
						doubleSide = a > -Math.PI / 2 + this.mp.s.bond.angleDev
							&& a <= Math.PI / 2 + this.mp.s.bond.angleDev ? 1 : -1;
					}
					else if (lowerBisectD < upperBisectD ||//the lower side has a smaller bestBisect deviation
						//or the lower side can apply bond refinement while the upper side cannot
						(upperLength < this.mp.s.atom.radius && lowerLength > this.mp.s.atom.radius)) {
						doubleSide = -1;
					}

					refineUpperSkeletal = (this.type === MP_BOND_TRIPLE || doubleSide === 1)
						&& upperLength > this.mp.s.atom.radius;
					refineLowerSkeletal = (this.type === MP_BOND_TRIPLE || doubleSide === -1)
						&& lowerLength > this.mp.s.atom.radius;
				}

				if (this.type === MP_BOND_DOUBLE) {
					ends = this.mp.s.bond.delta[MP_BOND_DOUBLE];
					if (skeletal) ends = transformArrayAdd(ends, -doubleSide * ends[0]);
				}
				else if (this.type === MP_BOND_TRIPLE) {
					ends = this.mp.s.bond.delta[MP_BOND_TRIPLE];
				}

				ends = transformArrayMult(ends, -this.mp.s.bond.deltaScale);//flip ends because of flipped y-axis
				var toEnds = transformArrayMult(ends, -1);//reversed upper/lower side relate to from
				this.cache.bond = {
					from: this.mp.mol.atoms[this.from].calculateBondVertices(this.to, ends),
					to: this.mp.mol.atoms[this.to].calculateBondVertices(this.from, toEnds)
				};

				if (!this.mp.mol.atoms[this.from].isVisible()) {
					if (!fromBonds.none) {
						if ((!skeletal || refineLowerSkeletal)
							&& fromBonds.lowerSectionAngle < Math.PI) {
							this.cache.bond.from[0] = this.refineBondVertex(
								skeletal, fromBonds.lowerBisectAngle,
								this.line.from, this.cache.bond.from[0], this.cache.bond.to[0],
								this.mp.mol.bonds[fromBonds.lower].getLine());
						}
						if ((!skeletal || refineUpperSkeletal)
							&& fromBonds.upperSectionAngle < Math.PI) {
							this.cache.bond.from[1] = this.refineBondVertex(
								skeletal, fromBonds.upperBisectAngle,
								this.line.from, this.cache.bond.from[1], this.cache.bond.to[1],
								this.mp.mol.bonds[fromBonds.upper].getLine());
						}
					}
				}

				if (!this.mp.mol.atoms[this.to].isVisible()) {
					if (!toBonds.none) {
						if ((!skeletal || refineLowerSkeletal)
							&& toBonds.upperSectionAngle < Math.PI) {
							this.cache.bond.to[0] = this.refineBondVertex(skeletal, toBonds.upperBisectAngle,
								this.line.to, this.cache.bond.to[0], this.cache.bond.from[0],
								this.mp.mol.bonds[toBonds.upper].getLine());
						}
						if ((!skeletal || refineUpperSkeletal)
							&& toBonds.lowerSectionAngle < Math.PI) {
							this.cache.bond.to[1] = this.refineBondVertex(skeletal, toBonds.lowerBisectAngle,
								this.line.to, this.cache.bond.to[1], this.cache.bond.from[1],
								this.mp.mol.bonds[toBonds.lower].getLine());
						}
					}
				}
			}
		}
	}
}


MPBond.prototype.refineBondVertex = function (skeletal, bisectAngle, lineFrom, bondFrom, bondTo, closestBondLine) {
	var intersection;
	if (skeletal) {
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
	else {
		intersection = closestBondLine.intersection(
			new MPLine({
				from: bondFrom,
				to: bondTo
			}));
		if (!intersection.onL1 || lineFrom.distanceTo(intersection.p) >
			closestBondLine.length() / 2) {
			intersection.p = undefined;
		}
	}

	return intersection.p !== undefined ? intersection.p : bondFrom;
}
