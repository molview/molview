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
 * Input fragment data for MolPad
 * 1. you can pass this data as tool.data.frag
 * 2. all fragments use bondLength = 1 as default
 * 3. you have to multiply all coordinates with the real bondLength
 * 4. all fragments are centered on the positive side of the x-axis
 * 5. you can rotate the fragment coordinates around (0, 0)
 * 6. the first atom in each fragment.toAtom is the atom you have to connect to
 *    when adding the fragment to an atom
 * 7. all atoms/bonds after frag.size are H atoms/bonds
 */
var MPFragments = {
	benzene: {},
	cyclopropane: {},
	cyclobutane: {},
	cyclopentane: {},
	cyclohexane: {},
	cycloheptane: {},

	length: 1,
	lengthHydrogen: 34 / 55,//same as MolPad

	init: function()
	{
	//generate all fragments
	this.benzene = this.generate(6, true);
	this.cyclopropane = this.generate(3, false);
	this.cyclobutane = this.generate(4, false);
	this.cyclopentane = this.generate(5, false);
	this.cyclohexane = this.generate(6, false);
	this.cycloheptane = this.generate(7, false);
	},

	generate: function(vertices, alternating)
	{
		var as = 2 * Math.PI / vertices;//angle step
		var r = 0.5 / Math.sin(as / 2) * this.length;

		var ret = {
			full: this.createRing(vertices, alternating),
			toAtom: this.translate(this.createRing(vertices, alternating), r, 0)//r to move bond to the left
		};
		return ret;
	},

	createRing: function(vertices, alternating)
	{
		var frag = { atoms: [], bonds: [] };
		var as = 2 * Math.PI / vertices;//angle step
		var r = 0.5 / Math.sin(as / 2) * this.length;

		//ring
		for(var i = 0; i < vertices; i++)
		{
			//move a = 0 to left side to apply rule 4
			frag.atoms.push({
				center: new MPPoint(
					r * Math.cos(Math.PI + as * i),
					r * Math.sin(Math.PI + as * i)),
				element: "C"
			});
			frag.bonds.push({
				from: i,
				to: i + 1 < vertices ? i + 1 : 0,
				type: alternating ? (i % 2 == 0 ? MP_BOND_SINGLE : MP_BOND_DOUBLE) : MP_BOND_SINGLE
			});
		}

		return frag;
	},

	clone: function(frag)
	{
		var copy = { atoms: [], bonds: [], size: frag.size };

		for(var i = 0; i < frag.atoms.length; i++)
		{
			copy.atoms.push({
				center: frag.atoms[i].center.clone(),
				element: frag.atoms[i].element
			});
		}

		for(var i = 0; i < frag.bonds.length; i++)
		{
			copy.bonds.push({
				from: frag.bonds[i].from,
				to: frag.bonds[i].to,
				type: frag.bonds[i].type
			});
		}

		return copy;
	},

	scale: function(frag, scale)
	{
		for(var i = 0; i < frag.atoms.length; i++)
		{
			frag.atoms[i].center.scale(scale);
		}
		return frag;
	},

	rotate: function(frag, center, angle)
	{
		for(var i = 0; i < frag.atoms.length; i++)
		{
			frag.atoms[i].center.rotateAroundCenter(center, angle);
		}
		return frag;
	},

	translate: function(frag, dx, dy)
	{
		for(var i = 0; i < frag.atoms.length; i++)
		{
			frag.atoms[i].center.translate(dx, dy);
		}
		return frag;
	}
};
