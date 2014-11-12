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

function rotateAround(p, c, a)
{
    return {
		x: c.x + (p.x - c.x) * Math.cos(a) - (p.y - c.y) * Math.sin(a),
		y: c.y + (p.x - c.x) * Math.sin(a) + (p.y - c.y) * Math.cos(a)
	};
}

/**
 * Input fragment data for MolPad
 * 1. you can pass this data as tool.data.frag
 * 2. all fragments use bondLength = 1 as default
 * 3. you have to multiply all coordinates with the real bondLength
 * 4. all fragments are positioned on the positive side of the x-axis
 * 5. you can rotate the fragment coordinates around (0, 0)
 * 6. the first atom in each fragment.toAtom is the atom you have to connect to
 *    when adding the fragment to an atom
 * 7. the bond.from and the bond.to of the first bond in each fragment.toBond are the atoms
 *    to connect to when adding the fragment to a bond
 * 8. all atoms/bonds after frag.size are H atoms/bonds
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
            full: this.createRing(vertices, alternating, false),
            toAtom: this.translate(this.createRing(vertices, alternating, true), r, 0),//r to move bond to the left
            toBond: this.rotate(this.createRing(vertices, alternating, false), (as + Math.PI) / 2, { x: 0, y: 0 })
        };
        //ret.toBond.bonds.shift();//remove first bond to apply rule 7
		//ret.toBond.atoms.splice(vertices, alternating ? 1 : 2);//also remove second (pair of) H atoms to apply rule 7
        //ret.toBond.atoms.splice(0, 2);//remove first two atoms to apply rule 7
        return ret;
    },

    createRing: function(vertices, alternating, skipFirstH)
    {
        var frag = { atoms: [], bonds: [], size: vertices };
        var as = 2 * Math.PI / vertices;//angle step
        var r = 0.5 / Math.sin(as / 2) * this.length;

        //ring
        for(var i = 0; i < vertices; i++)
        {
            //move a = 0 to left side to apply rule 4
            frag.atoms.push({
                x: r * Math.cos(Math.PI + as * i),
                y: r * Math.sin(Math.PI + as * i),
                element: "C"
            });
            frag.bonds.push({
                from: i,
                to: i + 1 < vertices ? i + 1 : 0,
                type: alternating ? (i % 2 == 0 ? MP_BOND_SINGLE : MP_BOND_DOUBLE) : MP_BOND_SINGLE
            });
        }

        //saturate
        var s = skipFirstH ? 1 : 0;
        var hr = this.lengthHydrogen;
        for(var i = s; i < vertices; i++)
        {
            if(alternating)//one H atom
            {
                frag.atoms.push({
                    x: frag.atoms[i].x + hr * Math.cos(Math.PI + as * i),
                    y: frag.atoms[i].y + hr * Math.sin(Math.PI + as * i),
                    element: "H"
                });
                frag.bonds.push({
                    from: i,
                    to: frag.atoms.length - 1,
                    type: MP_BOND_SINGLE
                });
            }
            else//two H atoms
            {
                var a = (Math.PI + as) / 3 / 2;

                frag.atoms.push({
                    x: frag.atoms[i].x + hr * Math.cos(Math.PI + as * i + a),
                    y: frag.atoms[i].y + hr * Math.sin(Math.PI + as * i + a),
                    element: "H"
                });
                frag.bonds.push({
                    from: i,
                    to: frag.atoms.length - 1,
                    type: MP_BOND_SINGLE
                });
                frag.atoms.push({
                    x: frag.atoms[i].x + hr * Math.cos(Math.PI + as * i - a),
                    y: frag.atoms[i].y + hr * Math.sin(Math.PI + as * i - a),
                    element: "H"
                });
                frag.bonds.push({
                    from: i,
                    to: frag.atoms.length - 1,
                    type: MP_BOND_SINGLE
                });
            }
        }

        return frag;
    },

	clone: function(frag)
	{
		var copy = { atoms: [], bonds: [], size: frag.size };

		for(var i = 0; i < frag.atoms.length; i++)
		{
			copy.atoms.push({
				x: frag.atoms[i].x,
				y: frag.atoms[i].y,
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
            frag.atoms[i].x *= scale;
            frag.atoms[i].y *= scale;
        }
        return frag;
    },

    rotate: function(frag, center, angle)
    {
        for(var i = 0; i < frag.atoms.length; i++)
        {
            var p = rotateAround(frag.atoms[i], center, angle);
            frag.atoms[i].x = p.x;
            frag.atoms[i].y = p.y;
        }
        return frag;
    },

    translate: function(frag, dx, dy)
    {
        for(var i = 0; i < frag.atoms.length; i++)
        {
            frag.atoms[i].x += dx;
            frag.atoms[i].y += dy;
        }
        return frag;
    }
};
