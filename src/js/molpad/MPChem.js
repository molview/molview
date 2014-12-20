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

/**
 * Load molfile into MolPad
 * Uses Ketcher chem utils
 * @param {String}  mol
 * @param {Boolean} forceRemoveHydrogen
 */
MolPad.prototype.loadMOL = function(mol, forceRemoveHydrogen)
{
	this.saveToStack();

	this.molecule = { atoms: [], bonds: [] };

	var molecule = chem.Molfile.parseCTFile(mol.split("\n"));

	//convert Ketcher data format into MolPad molecule
	var scope = this;

	molecule.atoms.each(function(i, atomData)
	{
		var atom = new MPAtom(scope, {
			i: i,
			x: atomData.pp.x * scope.settings.bond.length,
			y: atomData.pp.y * scope.settings.bond.length,
			element: atomData.label,
			charge: atomData.charge,
			isotope: atomData.isotope
		});

		scope.molecule.atoms.push(atom);
	});

	molecule.bonds.each(function(i, bondData)
	{
		scope.molecule.atoms[bondData.begin].addBond(scope.molecule.bonds.length);
		scope.molecule.atoms[bondData.end].addBond(scope.molecule.bonds.length);

		var bond = new MPBond(scope, {
			i: i,
			type: bondData.type,
			stereo: bondData.stereo,
			from: bondData.begin,
			to: bondData.end
		});

		scope.molecule.bonds.push(bond);
	});

	if(this.settings.skeletonDisplay || forceRemoveHydrogen)
	{
		this.removeImplicitHydrogen();
	}

	this.center();
}

MolPad.prototype.getMOL = function()
{
	return new chem.MolfileSaver().saveMolecule(this.getKetcherData());
}

MolPad.prototype.getSMILES = function()
{
	if(this.molecule.atoms.length == 0) throw new Error("No atoms found");
	return new chem.SmilesSaver().saveMolecule(this.getKetcherData());
}

MolPad.prototype.getKetcherData = function()
{
	var molecule = new chem.Struct();

	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		molecule.atoms.add(this.molecule.atoms[i].getKetcherData(this));
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		molecule.bonds.add(this.molecule.bonds[i].getKetcherData(this));
	}

	molecule.initHalfBonds();
	molecule.initNeighbors();
	molecule.markFragments();

	return molecule;
}

MolPad.prototype.getPlainData = function()
{
	var molecule = { atoms: [], bonds: [] };

	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		molecule.atoms.push(this.molecule.atoms[i].getConfig());
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		molecule.bonds.push(this.molecule.bonds[i].getConfig());
	}

	return molecule;
}

MolPad.prototype.loadPlainData = function(data)
{
	this.molecule = { atoms: [], bonds: [] };

	for(var i = 0; i < data.atoms.length; i++)
	{
		this.molecule.atoms.push(new MPAtom(this, data.atoms[i]));
	}
	for(var i = 0; i < data.bonds.length; i++)
	{
		this.molecule.bonds.push(new MPBond(this, data.bonds[i]));
	}

	this.redraw(true);
}

/**
 * Create fragment from fragment data which is created using MPFragment
 * @param  {Object} fragment Fragment data
 * @return {Object}          New fragment data
 */
MolPad.prototype.createFragment = function(fragment)
{
	var ret = [];

	for(var i = 0; i < fragment.atoms.length; i++)
	{
		var atom = new MPAtom(this, {
			i: this.molecule.atoms.length,
			x: fragment.atoms[i].center.x,
			y: fragment.atoms[i].center.y,
			element: fragment.atoms[i].element
		});

		this.molecule.atoms.push(atom);
		ret.push(atom.index);
	}

	for(var i = 0; i < fragment.bonds.length; i++)
	{
		var bond = new MPBond(this, {
			i: this.molecule.bonds.length,
			type: fragment.bonds[i].type,
			stereo: MP_STEREO_NONE,
			from: ret[fragment.bonds[i].from],
			to: ret[fragment.bonds[i].to]
		});

		this.molecule.atoms[bond.from].addBond(bond.index);
		this.molecule.atoms[bond.to].addBond(bond.index);
		this.molecule.bonds.push(bond);
	}

	return ret;
}

/**
 * Rotate array of atoms around a center using the angle between the center
 * and a given point and an optional number of clampSteps
 *
 * @param  {MPPoint} center
 * @param  {MPPoint} point
 * @param  {Array}   atoms        Array of atom indices
 * @param  {Float}   currentAngle Current rotation angle of the selction
 * @param  {Float}   startAngle   Start rotation angle used for angle clamping
 * @param  {Integer} clampSteps   Number of steps the angle should be clamped to
 * @param  {Boolean} forced       Forced update
 * @return {Float}                New currentAngle
 */
MolPad.prototype.rotateAtoms = function(center, point, atoms, currentAngle, startAngle, clampSteps, forced)
{
	var a = currentAngle;
	if(clampSteps !== undefined) a = clampedAngle(startAngle, center, point, clampSteps);
	else a = center.angleTo(point);

	if(a != currentAngle || forced)
	{
		for(var i = 0; i < atoms.length; i++)
		{
			this.molecule.atoms[atoms[i]].rotateAroundCenter(center, a - currentAngle);
		}
		return a;
	}
	else return currentAngle;
}

/**
 * Merge atom src into atom dest
 * @param   {Integer} src     Index of srd atom
 * @param   {Integer} dest    Index of dest atom
 * @param   {Boolean} reverse Reverse src and dest but retain old dest atom
 * @return  {Array}           New index mapping
 */
MolPad.prototype.mergeAtoms = function(src, dest, reverse)
{
	var _src = this.molecule.atoms[src];
	var _dest = this.molecule.atoms[dest];
	_dest.center.replace(_src.center);
	for(var j = 0; j < _src.bonds.length; j++)//transfer bonds
	{
		/* only transfer bond if bond destination is not
		already included in the current set of bonds */
		var n = _dest.getNeighborBond(this.molecule.bonds[_src.bonds[j]]
				.getOppositeAtom(src));
		if(n == -1)
		{
			this.molecule.bonds[_src.bonds[j]].replaceAtom(src, dest);
			_dest.addBond(_src.bonds[j]);
		}
		else if(this.molecule.bonds[_src.bonds[j]].type == MP_BOND_SINGLE)
		{
			//always force single bond over any other bond types
			this.molecule.bonds[n].setType(MP_BOND_SINGLE);
		}
	}

	//carbon atoms are less important
	if(_dest.element == "C")
	{
		_dest.setElement(_src.element);
	}

	this.molecule.atoms.splice(src, 1);//remove atom
	return this.updateIndices();
}

/**
 * Collapse set of atom indices into the entire molecule
 * @param {Array}   atoms   Atom indices
 * @param {Boolean} reverse If set, the $atoms centers will not be used
 */
MolPad.prototype.collapseAtoms = function(atoms, reverse)
{
	for(var i = 0; i < atoms.length; i++)
	{
		for(var j = 0; j < this.molecule.atoms.length; j++)
		{
			if(atoms.indexOf(j) != -1) continue;

			if(this.molecule.atoms[atoms[i]].center.inCircle(
					this.molecule.atoms[j].center, this.settings.atom.radiusScaled))
			{
				var map = this.mergeAtoms(j, atoms[i], reverse);
				atoms = mapArray(atoms, map.amap);
				break;//atoms[i] has been handled
			}
		}
	}
}

/**
 * Collapse set of atom indices into the entire molecule
 * @param {Array}   atoms  Atom indices
 * @param {Boolean} retain Set wether the set should be merged from or to
 */
MolPad.prototype.countCollapses = function(atoms, retain)
{
	var ret = 0;
	for(var i = 0; i < atoms.length; i++)
	{
		for(var j = 0; j < this.molecule.atoms.length; j++)
		{
			if(atoms.indexOf(j) != -1) continue;

			if(this.molecule.atoms[atoms[i]].center.inCircle(
					this.molecule.atoms[j].center, this.settings.atom.radiusScaled))
			{
				ret++;
			}
		}
	}
	return ret;
}

/**
 * Remove an atom with the given index from the current molecule
 * @param {Integer} index Atom index
 */
MolPad.prototype.removeAtom = function(index)
{
	this.molecule.atoms.splice(index, 1);
	this.updateIndices();
}

/**
 * Remove a bond with the given index from the current molecule
 * @param {Integer} index Bond index
 */
MolPad.prototype.removeBond = function(index)
{
	var f = this.molecule.bonds[index].from;
	var t = this.molecule.bonds[index].to;
	this.molecule.atoms.splice(f > t ? f : t, 1);
	this.molecule.atoms.splice(f < t ? f : t, 1);
	this.molecule.bonds.splice(index, 1);
	this.updateIndices();
}

/**
 *
 * @return {Array} New index mapping
 */
MolPad.prototype.updateIndices = function()
{
	/* CAUTION: nobody is allowed to execute any methods during this process.
	Therefore, only manual data modifications should be used */

	var atomIndexMap = {}, bondIndexMap = {};
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		atomIndexMap[this.molecule.atoms[i].index] = i;
		this.molecule.atoms[i].index = i;
		this.molecule.atoms[i].valid = false;
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		var bond = this.molecule.bonds[i];
		var from = atomIndexMap[bond.from];
		var to = atomIndexMap[bond.to];

		if(from !== undefined && to !== undefined)
		{
			bondIndexMap[bond.index] = i;
			bond.index = i;
			bond.from = from;
			bond.to = to;
			bond.valid = false;//manual invalidate
		}
		else
		{
			this.molecule.bonds.splice(i, 1);
			i--;
		}
	}
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		this.molecule.atoms[i].mapBonds(bondIndexMap);
	}

	//map indices of tool data
	if(this.tool.tmp.selection)
	{
		for(var i = 0; i < this.tool.tmp.selection.length; i++)
		{
			if(atomIndexMap[this.tool.tmp.selection[i]] !== undefined)
			{
				this.tool.tmp.selection[i] = atomIndexMap[this.tool.tmp.selection[i]];
			}
			else
			{
				this.tool.tmp.selection.splice(i, 1);
				i--;
			}
		}
	}

	return {
		amap: atomIndexMap,
		bmap: bondIndexMap
	};
}

MolPad.prototype.removeImplicitHydrogen = function()
{
	var implicit = [];

	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		if(this.molecule.atoms[i].isImplicit(this))
		{
			implicit.push(i);
		}
	}

	for(var i = 0; i < implicit.length; i++)
	{
		this.molecule.atoms.splice(implicit[i] - i, 1);
	}

	this.updateIndices();
}

MolPad.prototype.addImplicitHydrogen = function()
{
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		this.molecule.atoms[i].addImplicitHydrogen(this);
	}
}
