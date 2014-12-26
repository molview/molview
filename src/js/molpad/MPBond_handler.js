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

MPBond.prototype.getHandler = function()
{
	var scope = this;
	if(this.mp.tool.type == "bond")
	{
		return {
			scope: this,
			onPointerDown: function(e)
			{
				//TODO: implement up to up bonds

				e.preventDefault();

				if(this.tool.data.type)
				{
					scope.setType(this.tool.data.type == MP_BOND_TRIPLE ? MP_BOND_TRIPLE :
						(scope.type == MP_BOND_TRIPLE || scope.stereo != MP_STEREO_NONE) ? this.tool.data.type :
							scope.type == MP_BOND_SINGLE ? MP_BOND_DOUBLE : MP_BOND_SINGLE);
					scope.setStereo(MP_STEREO_NONE);
				}
				else if(this.tool.data.stereo)
				{
					scope.setType(MP_BOND_SINGLE);

					if(scope.stereo == this.tool.data.stereo)
					{
						var f = scope.from;
						scope.setFrom(scope.to);
						scope.setTo(f);
					}
					else
					{
						scope.setStereo(this.tool.data.stereo);
					}
				}
			}
		};
	}
	else if(this.mp.tool.type == "fragment" && this.mp.tool.data.frag.toBond !== undefined)
	{
		return {
			scope: this,
			onPointerDown: function(e)
			{
				var p = new MPPoint().fromRelativePointer(e, this);
				var f = this.molecule.atoms[scope.from].center;
				var t = this.molecule.atoms[scope.to].center;
				var a = f.angleTo(t);

				//clone new fragment and transform it
				this.tool.tmp = {
					frag: MPFragments.rotate(
						MPFragments.translate(
							MPFragments.scale(
								MPFragments.clone(this.tool.data.frag.toBond),
								this.settings.bond.length),
							f.x, f.y), f, a)
				};

				//create the fragment and store the new fragment data
				this.tool.selection = this.createFragment(this.tool.tmp.frag);

				//IMPORTANT: do not merge the other way around or the scope will be lost
				this.mergeAtoms(this.tool.selection[0], scope.from);
				this.mergeAtoms(this.tool.selection[this.tool.selection.length - 1], scope.to);

				//resolve tool.tmp.side
				var s = 0;
				for(var i = 0; i < this.tool.selection.length; i++)
				{
					s += this.molecule.atoms[this.tool.selection[i]].center.lineSide(scope.getLine());
				}
				this.tool.tmp.side = s > 0 ? 1 : -1;

				//get number collapsing atoms
				var collA = this.countCollapses(this.tool.selection);

				//mirror fragment
				for(var i = 0; i < this.tool.selection.length; i++)
				{
					this.molecule.atoms[this.tool.selection[i]].center.mirror(
							scope.getLine(), -this.tool.tmp.side);
				}

				//get new number collapsing atoms
				var collB = this.countCollapses(this.tool.selection);

				//mirror back if old number of collapsing atoms is lower
				if(collA < collB)
				{
					for(var i = 0; i < this.tool.selection.length; i++)
					{
						this.molecule.atoms[this.tool.selection[i]].center.mirror(
								scope.getLine(), this.tool.tmp.side);
					}
				}
				else
				{
					this.tool.tmp.side = -this.tool.tmp.side;
				}
			},
			onPointerMove: function(e)
			{
				e.preventDefault();
				var p = new MPPoint().fromRelativePointer(e, this);
				var s = p.lineSide(scope.getLine());

				//check if pointer is outside no-rotate circle
				if(s != this.tool.tmp.side && s != 0)
				{
					this.tool.tmp.side = s;

					for(var i = 0; i < this.tool.selection.length; i++)
					{
						this.molecule.atoms[this.tool.selection[i]].center.mirror(scope.getLine(), s);
						this.molecule.atoms[this.tool.selection[i]].invalidate();
					}
				}
			},
			onPointerUp: function(e)
			{
				this.collapseAtoms(this.tool.selection.slice());
			}
		};
	}
	else if(this.mp.tool.type == "erase")
	{
		return {
			scope: this,
			onPointerDown: function(e)
			{
				e.preventDefault();

				if(scope.selected) this.removeSelection();
				else this.removeBond(scope.index);

				//dismiss all further calls to this handler
				this.pointer.handler = undefined;
			}
		};
	}
	else//drag, fallback
	{
		return {
			scope: this,
			onPointerMove: function(e)
			{
				e.preventDefault();
				this.setCursor("move");
				var p = new MPPoint().fromRelativePointer(e, this);
				var dx = p.x - this.pointer.old.r.x;
				var dy = p.y - this.pointer.old.r.y;

				if(scope.selected)
				{
					this.translateSelection(dx, dy);
				}
				else
				{
					this.molecule.atoms[scope.from].translate(dx, dy);
					this.molecule.atoms[scope.to].translate(dx, dy);
				}

				this.pointer.old.r = p;
			},
			onPointerUp: function(e)
			{
				this.molecule.atoms[scope.from].setDisplay("normal");
				this.molecule.atoms[scope.to].setDisplay("normal");

				if(scope.selected) this.collapseAtoms(this.tool.selection.slice(), true);
				else this.collapseAtoms([scope.from, scope.to], true);
			}
		};
	}
}

/**
 * Handler for mouse events
 * @param  {MPPoint} point Event origin
 * @param  {String}  type  Event type (hover || active)
 * @return {Boolean}       Indicates if event is handled by this MPBond
 */
MPBond.prototype.handle = function(point, type)
{
	if(this.display == "hidden") return false;

	this.validate();

	var r = this.mp.settings.bond.radiusScaled;

	if(point.inLineBox(this.line.from, this.line.to, r))
	{
		if(point.lineDistance(this.line.from, this.line.to) <= r)
		{
			if(type == "active" && this.mp.tool.type == "drag")
			{
				this.mp.molecule.atoms[this.from].setDisplay("active");
				this.mp.molecule.atoms[this.to].setDisplay("active");
			}
			this.setDisplay(type);
			return true;
		}
	}

	this.setDisplay("normal");
	return false;
}

MPBond.prototype.handleSelect = function()
{
	this.select(this.mp.tool.selection.indexOf(this.from) != -1
			 && this.mp.tool.selection.indexOf(this.to) != -1);
}
