/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
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
 * 7. the first and the last atom in each fragment.toBond are the atoms
 *    you have to merge with (first => from, last => to)
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
		this.benzene = this.generateRing(6, true);
		this.cyclopropane = this.generateRing(3, false);
		this.cyclobutane = this.generateRing(4, false);
		this.cyclopentane = this.generateRing(5, false);
		this.cyclohexane = this.generateRing(6, false);
		this.cycloheptane = this.generateRing(7, false);
	},

	generateRing: function(vertices, alternating)
	{
		var as = PI2 / vertices;//angle step
		var r = 0.5 / Math.sin(as / 2) * this.length;

		var ret = {
			full: this.createRing(vertices, alternating ? 2 : 0),
			toAtom: this.translate(this.createRing(vertices, alternating ? 2 : 0), r, 0),//move bond start to (0,0)
			toBond: this.rotate(this.translate(this.createRing(vertices, alternating ? 2 : 0), r, 0),
					{ x: 0, y: 0 }, (Math.PI - as) / 2)//move bond start to (0,0), make first bond horizontal
		};
		return ret;
	},

	/**
	 * Create ring data
	 * @param {Integer} vertices    Number of ring vertices
	 * @param {Integer} alternating Double/single bond alternation:
	 *                              0 = none
	 *                              1 = first double on odd bonds
	 *                              2 = first double on even bonds
	 */
	createRing: function(vertices, alternating)
	{
		var frag = { atoms: [], bonds: [] };
		var as = PI2 / vertices;//angle step
		frag.r = 0.5 / Math.sin(as / 2) * this.length;

		//ring
		for(var i = 0; i < vertices; i++)
		{
			//move a = 0 to left side to apply rule 4
			frag.atoms.push({
				center: new MPPoint(
					frag.r * Math.cos(Math.PI + as * i),//start at the left side
					frag.r * Math.sin(Math.PI + as * i)),
				element: "C"
			});
			frag.bonds.push({
				from: i,
				to: i + 1 < vertices ? i + 1 : 0,
				type: alternating !== 0 ? (i % 2 === (2 - alternating) ? MP_BOND_SINGLE : MP_BOND_DOUBLE) : MP_BOND_SINGLE
			});
		}

		return frag;
	},

	clone: function(frag)
	{
		var copy = { atoms: [], bonds: [], r: frag.r };

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
