/**
 * This file is part of MolView (https://molview.org)
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
 * @param {String} mol
 */
MolPad.prototype.loadMOL = function(mol)
{
	this.molecule = { atoms: [], bonds: [] };

	var molecule = chem.Molfile.parseCTFile(mol.split("\n"));

	//convert Ketcher data format into MolPad molecule
	var scope = this;

	molecule.atoms.each(function(i, atomData)
	{
		var atom = new MPAtom();
		atom.setPosition({
			x: atomData.pp.x * scope.settings.bond.length,
			y: atomData.pp.y * scope.settings.bond.length
		});
		atom.setElement(atomData.label);
		atom.setCharge(atomData.charge);
		atom.setIsotope(atomData.isotope);
		scope.molecule.atoms.push(atom);
	});

	molecule.bonds.each(function(i, bondData)
	{
		scope.molecule.atoms[bondData.begin].addBond(scope.molecule.bonds.length);
		scope.molecule.atoms[bondData.end].addBond(scope.molecule.bonds.length);

		var bond = new MPBond();
		bond.setType(bondData.type);
		bond.setStereo(bondData.stereo);
		bond.setFrom(bondData.begin);
		bond.setTo(bondData.end);
		scope.molecule.bonds.push(bond);
	});

	if(this.settings.removeImplicitHydrogen)
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
		var pp = this.molecule.atoms[i].getPosition();
		molecule.atoms.add(new chem.Struct.Atom({
			pp: {
				x: pp.x / this.settings.bond.length,
				y: pp.y / this.settings.bond.length
			},
			label: this.molecule.atoms[i].getElement(),
			charge: this.molecule.atoms[i].getCharge(),
			isotope: this.molecule.atoms[i].getIsotope()
		}));
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		molecule.bonds.add(new chem.Struct.Bond({
			type: this.molecule.bonds[i].getType(),
			stereo: this.molecule.bonds[i].getStereo(),
			begin: this.molecule.bonds[i].getFrom(),
			end: this.molecule.bonds[i].getTo()
		}));
	}

	molecule.initHalfBonds();
	molecule.initNeighbors();
	molecule.markFragments();

	return molecule;
}

MolPad.prototype.toDataURL = function()
{
	return this.canvas.toDataURL("image/png");
}
