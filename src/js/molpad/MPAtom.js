/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * Create new MPAtom
 * @param {MolPad} mp
 * @param {Object} obj Configuration
 */
function MPAtom(mp, obj)
{
	this.mp = mp;
	this.index = obj.i;
	this.center = new MPPoint(obj.x || 0, obj.y || 0);
	this.element = obj.element || "C";
	this.charge = obj.charge || 0;
	this.isotope = obj.isotope || 0;
	this.bonds = obj.bonds !== undefined ? obj.bonds.slice() : [];//deep copy
	this.selected = obj.selected || false;
	this.display = "normal";
	this.valid = false;
	this.mp.requestRedraw();
}

MPAtom.prototype.getX = function() { return this.center.x; }
MPAtom.prototype.getY = function() { return this.center.y; }

/**
 * Retruns data which can be used as input by the Ketcher fork
 * @param {Object} mp
 * @return {Object}
 */
MPAtom.prototype.getKetcherData = function()
{
	return new chem.Struct.Atom({
		pp: {
			x: this.center.x / this.mp.s.bond.length,
			y: this.center.y / this.mp.s.bond.length
		},
		label: this.element,
		charge: this.charge,
		isotope: this.isotope
	});
}

/**
 * Retruns config data which can be used to reconstruct this object
 * @return {Object}
 */
MPAtom.prototype.getConfig = function()
{
	return {
		i: this.index,
		x: this.center.x,
		y: this.center.y,
		element: this.element,
		charge: this.charge,
		isotope: this.isotope,
		bonds: this.bonds.slice()
	};
}

/**
 * Retruns MPAtom string which can be compared to other MPAtom strings
 * @return {String}
 */
MPAtom.prototype.toString = function()
{
	var str = this.center.x.toString() + ","
		+ this.center.y.toString() + ","
		+ this.element.toString() + ","
		+ this.charge.toString() + ","
		+ this.isotope.toString();

	for(var i = 0; i < this.bonds.length; i++)
	{
		str += "," + this.mp.mol.bonds[this.bonds[i]].toString();
	}

	return str;
}

/**
 * Generates charge label for this atom
 * @return {String} Charge label as string
 */
MPAtom.prototype.getChargeLabel = function()
{
	return this.charge === 0 ? "" :
		this.charge === -1 ? "\u2212" :
		this.charge ===  1 ? "+" :
			(this.charge > 1 ? "+" : "-") + Math.abs(this.charge);
}

MPAtom.prototype.setIndex = function(index) { this.index = index; }

MPAtom.prototype.setCenter = function(x, y)
{
	this.center.replace(x, y);
	this.centerChanged();
}

MPAtom.prototype.setElement = function(element)
{
	this.element = element === "D" ? "H" : element;
	this.labelChanged();
}

MPAtom.prototype.setCharge = function(charge)
{
	this.charge = charge;
	this.labelChanged();
}

MPAtom.prototype.setIsotope = function(isotope)
{
	this.isotope = isotope;
	this.labelChanged();
}

/**
 * Sets display type
 * @param {String} type
 */
MPAtom.prototype.setDisplay = function(type)
{
	if(type !== this.display)
	{
		this.display = type;
		this.mp.requestRedraw();
	}
}

/**
 * Checks if this MPAtom is equal to another MPAtom
 * @param  {MPAtom} atom
 * @return {Booelan}
 */
MPAtom.prototype.equals = function(atom)
{
	return this.index === atom.index;
}

/**
 * Returns number of selected bonds
 * @return {Integer}
 */
MPAtom.prototype.getSelectedBonds = function()
{
	var ret = 0;
	for(var i = 0; i < this.bonds.length; i++)
	{
		if(this.mp.mol.bonds[this.bonds[i]].isSelected())
		{
			ret++;
		}
	}
	return ret;
}

/**
 * Checks if the given index is a neighbor atom and return connecting bond
 * @param  {Integer} idx
 * @return {Integer} Bond index or -1
 */
MPAtom.prototype.getNeighborBond = function(idx)
{
	for(var i = 0; i < this.bonds.length; i++)
	{
		if(this.mp.mol.bonds[this.bonds[i]].getOppositeAtom(this.index) === idx)
		{
			return this.bonds[i];
		}
	}
	return -1;
}

/**
 * Returns if this atom has any neighbor atoms which are not selected
 */
MPAtom.prototype.hasUnselectedNeighbors = function()
{
	for(var i = 0; i < this.bonds.length; i++)
	{
		if(!this.mp.mol.atoms[this.mp.mol.bonds[this.bonds[i]]
			.getOppositeAtom(this.index)].isSelected())
		{
			return true;
		}
	}
	return false;
}

/**
 * Wrapper for MPAtom.selected (for maintainability)
 */
MPAtom.prototype.isSelected = function()
{
	return this.selected;
}

/**
 * Finds this MPAtom if it is an implicit hydrogen atom
 * All H atoms bonded to a C atom without stereo information are considered implicit
 * @return {Boolean}    Indicates if this atom is implicit
 */
MPAtom.prototype.isImplicit = function()
{
	if(this.element === "H" && this.isotope === 0 &&
			this.charge === 0 && this.bonds.length === 1)
	{
		var bond = this.mp.mol.bonds[this.bonds[0]];
		if(bond.type === MP_BOND_SINGLE && bond.stereo === MP_STEREO_NONE &&
			bond.isPair("C", "H"))
		{
			return true;
		}
	}
	return false;
}

/**
 * Checks is this MPAtom is hidden (not the same as invisible)
 */
MPAtom.prototype.isHidden = function()
{
	return this.display === "hidden";
}

/**
 * Checks if this MPAtom is visible in the drawing based on MolPad display settings
 */
MPAtom.prototype.isVisible = function()
{
	return this.wasVisible === true;
}

/**
 * Selects or deselects this MPAtom
 * @param {Boolean} select
 */
MPAtom.prototype.select = function(select)
{
	if(this.isSelected() !== select)
	{
		this.selected = select;
		this.mp.sel.update();
		this.mp.requestRedraw();
	}
}

/**
 * MPPoint.translate wrapper of atom center point
 */
MPAtom.prototype.translate = function(dx, dy)
{
	if(Math.abs(dx) + Math.abs(dy) > 0)
	{
		this.center.translate(dx, dy);
		this.centerChanged();
	}
}

/**
 * MPPoint.mirror wrapper of atom center point
 */
MPAtom.prototype.mirror = function(line, s)
{
	if(this.center.mirror(line, s))
	{
		this.centerChanged();
	}
}

/**
 * MPPoint.rotateAroundCenter wrapper of atom center point
 */
MPAtom.prototype.rotateAroundCenter = function(c, a)
{
	this.center.rotateAroundCenter(c, a);
	this.centerChanged();
}

/**
 * Returns total bond count
 */
MPAtom.prototype.getBondCount = function()
{
	var ret = 0;
	for(var i = 0; i < this.bonds.length; i++)
	{
		ret += this.mp.mol.bonds[this.bonds[i]].type;
	}
	return ret;
}

/**
 * Add bond index to this atom
 * @param {Integer} bond Bond index
 */
MPAtom.prototype.addBond = function(bond)
{
	if(this.bonds.indexOf(bond) === -1)
	{
		this.bonds.push(bond);
		this.bondsChanged();
	}
}

/**
 * Remove bond index from this atom
 * @param {Integer} bond Bond index
 */
MPAtom.prototype.removeBond = function(bond)
{
	var i = this.bonds.indexOf(bond);
	if(i !== -1)
	{
		this.bonds.splice(i, 1);
		this.bondsChanged();
	}
}

/**
 * Map bond indices using an index map
 * The map should contain the new indexes as follows: map[old] = new
 * If map[old] === undefined, the old index is removed from the bonds list
 *
 * @param {Array}   map
 */
MPAtom.prototype.mapBonds = function(map)
{
	var length = this.bonds.length;
	this.bonds = mapArray(this.bonds, map);

	if(this.bonds.length !== length)
	{
		this.bondsChanged();
	}

	/* CAUTION: this.invalidate should not be triggerd since it might
	hurt the mapping process */
}

/**
 * Replace a given bond index with another bond index
 * @param {Integer} o Old bond index
 * @param {Integer} n New bond index
 */
MPAtom.prototype.replaceBond = function(o, n)
{
	var idx = this.bonds.indexOf(o);
	var nidx = this.bonds.indexOf(n);

	if(idx !== -1)
	{
		if(nidx !== -1) this.bonds.splice(o, 1);
		else this.bonds[idx] = n;
	}

	this.bondsChanged();
}

/**
 * Adds new bond to this atom using the given element and angle
 * Does not redraw the canvas
 * @param  {Object} config { element, a, type, stereo }
 * @return {Object}        Tool data for this bond
 */
MPAtom.prototype.addNewBond = function(config)
{
	var atom = new MPAtom(this.mp, {
		i: this.mp.mol.atoms.length,
		x: this.getX() + (config.length || this.mp.s.bond.length) * Math.cos(config.a),
		y: this.getY() - (config.length || this.mp.s.bond.length) * Math.sin(config.a),//y axis is flipped
		element: config.element || "C"
	});

	var bond = new MPBond(this.mp, {
		i: this.mp.mol.bonds.length,
		type: config.type || MP_BOND_SINGLE,
		stereo: config.stereo || MP_STEREO_NONE,
		from: this.index,
		to: atom.index
	});

	this.mp.mol.atoms.push(atom);
	this.mp.mol.bonds.push(bond);

	atom.addBond(bond.index);
	this.addBond(bond.index);

	return {
		atom: atom.index,
		bond: bond.index,
		startAngle: config.a,
		currentAngle: config.a
	};
}

/**
 * Saturate atom with hydrogens
 * C atoms are saturated using their four binding sites
 */
MPAtom.prototype.addImplicitHydrogen = function()
{
	if(this.element === "C")
	{
		if(this.getBondCount() === 2 && this.bonds.length === 2)
		{
			var af = this.mp.mol.bonds[this.bonds[0]].getAngle(this);
			var at = this.mp.mol.bonds[this.bonds[1]].getAngle(this);
			var da = Math.max(af, at) - Math.min(af, at);

			//do only display 2 Hydrogens on one side if the bonds are not straight
			if(indev(da, Math.PI, this.mp.s.bond.angleDev))
			{
				var a = this.calculateNewBondAngle(2);
				if(a === 0) return;

				this.addNewBond({
					a: a[0],
					length: this.mp.s.bond.lengthHydrogen,
					element: "H"
				});
				this.addNewBond({
					a: a[1],
					length: this.mp.s.bond.lengthHydrogen,
					element: "H"
				});

				return;
			}
		}

		while(this.getBondCount() < 4)
		{
			this.cmap = this.calculateConnectionMap();
			var a = this.calculateNewBondAngle();
			this.addNewBond({
				a: a,
				length: this.mp.s.bond.lengthHydrogen,
				element: "H"
			});
		}
	}
}

/**
 * Invalidate cached render data
 */
MPAtom.prototype.invalidate = function()
{
	this.valid = false;
	this.mp.requestRedraw();
}

/**
 * Invalidation helper called when MPAtom.center has changed
 */
MPAtom.prototype.centerChanged = function()
{
	this.invalidate();
	for(var i = 0; i < this.bonds.length; i++)
	{
		this.mp.mol.bonds[this.bonds[i]].invalidate();
		this.mp.mol.atoms[this.mp.mol.bonds[this.bonds[i]].getOppositeAtom(this.index)].bondsChanged(true);
	}
	this.cmap = this.calculateConnectionMap();
}

/**
 * Invalidation helper called when MPAtom label has changed
 */
MPAtom.prototype.labelChanged = function()
{
	this.invalidate();
	this.line = undefined;
	for(var i = 0; i < this.bonds.length; i++)
	{
		this.mp.mol.bonds[this.bonds[i]].invalidate();
		this.mp.mol.atoms[this.mp.mol.bonds[this.bonds[i]].getOppositeAtom(this.index)].bondsChanged();
	}
}

/**
 * Invalidation helper called when connected bonds are changed
 */
MPAtom.prototype.bondsChanged = function(moved)
{
	this.invalidate();
	if(this.mp.s.skeletalDisplay)
	{
		for(var i = 0; i < this.bonds.length; i++)
		{
			this.mp.mol.bonds[this.bonds[i]].invalidate();
		}
	}
}

/**
 * Validate this MPAtom by updating all its drawing data
 */
MPAtom.prototype.validate = function()
{
	if(this.valid) return;
	this.valid = true;
	this.wasVisible = this.calculateVisibility();
	this.cmap = this.calculateConnectionMap();

	/* IMPORTANT NOTE: you have to invalidate the MPAtom AND make its
	line object undefined in order to recalculate it. This is a trick
	to increase efficiency as the atom label line does not have to be
	recalculated after each invalidation */
	if(this.line === undefined) this.line = this.calculateCenterLine();
}

/**
 * Render methods
 */

/**
 * Draw additional MPAtom background based on MPAtom.display
 */
MPAtom.prototype.drawStateColor = function()
{
	if(this.isHidden() || this.line === undefined) return;

	var incorrect = false;//this.element == "C" && this.getBondCount() > 4;
	/* incorrect is currently not really working since the red is sometimes
	draw between other green selection areas and because the invalidation is not
	working correctly when adding fragments which are not yet collapsed */

	if(this.display === "hover" || this.display === "active" ||
			(this.display === "normal" && this.isSelected()) || incorrect)
	{
		var d = incorrect ? "incorrect" : (this.isSelected() ? "selected" : this.display);

		this.mp.ctx.beginPath();
		if(this.line.area.point)
		{
			this.mp.ctx.arc(this.center.x, this.center.y,
					this.mp.s.atom.selectionRadiusScaled, 0, PI2);
			this.mp.ctx.fillStyle = this.mp.s.atom[d].color;
			this.mp.ctx.fill();
		}
		else
		{
			this.mp.ctx.moveTo(this.center.x + this.line.area.left, this.center.y);
			this.mp.ctx.lineTo(this.center.x + this.line.area.right, this.center.y);
			this.mp.ctx.strokeStyle = this.mp.s.atom[d].color;
			this.mp.ctx.stroke();
		}
	}
}

/**
 * Draw actual atom label
 */
MPAtom.prototype.drawLabel = function()
{
	//TODO: add support for collapsed groups (CH2- to H2C-, OH- to HO-, etc.)

	if(this.isHidden() || this.line === undefined) return;

	if(this.isVisible())
	{
		if(this.mp.s.atom.colored)
		{
			this.mp.ctx.fillStyle = JmolAtomColorsHashHex[this.element] || JmolAtomColorsHashHex["C"];
		}

		if(this.mp.s.atom.miniLabel)
		{
			var s = this.mp.s.atom.miniLabelSize;
			this.mp.ctx.fillRect(this.center.x - s / 2, this.center.y - s / 2, s, s);
		}
		else
		{
			var x = this.center.x + this.line.text.offsetLeft;

			if(this.isotope > 0)
			{
				this.mp.setFont("isotope");
				this.mp.ctx.fillText("" + this.isotope, x, this.center.y +
						this.line.text.offsetTop - this.line.text.isotopeHeight);
				x += this.line.text.isotopeWidth;
			}

			this.mp.setFont("element");
			this.mp.ctx.fillText("" + this.element, x, this.center.y + this.line.text.offsetTop);
			x += this.line.text.labelWidth;

			if(this.charge !== 0)
			{
				this.mp.setFont("charge");
				this.mp.ctx.fillText(this.getChargeLabel(), x, this.center.y +
						this.line.text.offsetTop - this.line.text.chargeHeight);
			}
		}
	}
}
