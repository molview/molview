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
	if(this.mp.tool.type == "bond")
	{
		return {
			scope: this,
			onPointerDown: function(e, mp)
			{
				//TODO: implement up to up bonds

				if(mp.tool.data.type)
				{
					this.scope.setType(mp.tool.data.type == MP_BOND_TRIPLE ? MP_BOND_TRIPLE :
						(this.scope.type == MP_BOND_TRIPLE || this.scope.stereo != MP_STEREO_NONE) ? mp.tool.data.type :
							this.scope.type == MP_BOND_SINGLE ? MP_BOND_DOUBLE : MP_BOND_SINGLE);
					this.scope.setStereo(MP_STEREO_NONE);
				}
				else if(mp.tool.data.stereo)
				{
					this.scope.setType(MP_BOND_SINGLE);

					if(this.scope.stereo == mp.tool.data.stereo)
					{
						var f = this.scope.from;
						this.scope.setFrom(this.scope.to);
						this.scope.setTo(f);
					}
					else
					{
						this.scope.setStereo(mp.tool.data.stereo);
					}
				}
			}
		};
	}
	else if(this.mp.tool.type == "fragment" && this.mp.tool.data.frag.toBond !== undefined)
	{
		return {
			scope: this,
			data: {},
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);
				var f = mp.molecule.atoms[this.scope.from].center;
				var t = mp.molecule.atoms[this.scope.to].center;
				var a = f.angleTo(t);

				//clone new fragment and transform it
				this.data.frag= MPFragments.rotate(
					MPFragments.translate(
						MPFragments.scale(
							MPFragments.clone(mp.tool.data.frag.toBond),
							mp.settings.bond.length),
						f.x, f.y), f, a);

				//create the fragment and store the new fragment data
				mp.tool.selection = mp.createFragment(this.data.frag);

				//IMPORTANT: do not merge the other way around or the scope will be lost
				mp.mergeAtoms(mp.tool.selection[0], this.scope.from);
				mp.mergeAtoms(mp.tool.selection[mp.tool.selection.length - 1], this.scope.to);

				//resolve this.data.side
				var s = 0;
				for(var i = 0; i < mp.tool.selection.length; i++)
				{
					s += mp.molecule.atoms[mp.tool.selection[i]].center.lineSide(this.scope.getLine());
				}
				this.data.side = s > 0 ? 1 : -1;

				//get number collapsing atoms
				var collA = mp.countCollapses(mp.tool.selection);

				//mirror fragment
				for(var i = 0; i < mp.tool.selection.length; i++)
				{
					mp.molecule.atoms[mp.tool.selection[i]].center.mirror(
							this.scope.getLine(), -this.data.side);
				}

				//get new number collapsing atoms
				var collB = mp.countCollapses(mp.tool.selection);

				//check if new fragment is already added
				if(collA == mp.tool.selection.length && collB == mp.tool.selection.length)
				{
					this.data.lock = true;
					mp.removeSelection();
					return;
				}

				//mirror back if old number of collapsing atoms is lower
				if(collA < collB)
				{
					for(var i = 0; i < mp.tool.selection.length; i++)
					{
						mp.molecule.atoms[mp.tool.selection[i]].center.mirror(
								this.scope.getLine(), this.data.side);
					}

					this.data.lock = collB == mp.tool.selection.length;
				}
				else
				{
					this.data.side = -this.data.side;
					this.data.lock = collA == mp.tool.selection.length;
				}
			},
			onPointerMove: function(e, mp)
			{
				if(this.data.lock) return;//do not mirror fragment if mirror is useless
				var p = new MPPoint().fromRelativePointer(e, mp);
				var s = p.lineSide(this.scope.getLine());

				//check if pointer is outside no-rotate circle
				if(s != this.data.side && s != 0)
				{
					this.data.side = s;

					for(var i = 0; i < mp.tool.selection.length; i++)
					{
						mp.molecule.atoms[mp.tool.selection[i]].center.mirror(this.scope.getLine(), s);
						mp.molecule.atoms[mp.tool.selection[i]].invalidate();
					}
				}
			},
			onPointerUp: function(e, mp)
			{
				mp.collapseAtoms(mp.tool.selection.slice());
				mp.clearToolData();//clears selection
			}
		};
	}
	else if(this.mp.tool.type == "erase")
	{
		return {
			scope: this,
			onPointerDown: function(e, mp)
			{
				if(this.scope.selected) mp.removeSelection();
				else mp.removeBond(this.scope.index);

				//dismiss all further calls to this handler
				mp.pointer.handler = undefined;
			}
		};
	}
	else//drag, fallback
	{
		return {
			scope: this,
			data: {},
			onPointerDown: function(e, mp)
			{
				mp.molecule.atoms[this.scope.from].setDisplay("active");
				mp.molecule.atoms[this.scope.to].setDisplay("active");
			},
			onPointerMove: function(e, mp)
			{
				mp.setCursor("move");
				var p = new MPPoint().fromRelativePointer(e, mp);
				var dx = p.x - mp.pointer.old.r.x;
				var dy = p.y - mp.pointer.old.r.y;
				this.data.moved = true;

				if(this.scope.selected)
				{
					mp.translateSelection(dx, dy);
				}
				else
				{
					mp.molecule.atoms[this.scope.from].translate(dx, dy);
					mp.molecule.atoms[this.scope.to].translate(dx, dy);
				}

				mp.pointer.old.r = p;
			},
			onPointerUp: function(e, mp)
			{
				mp.molecule.atoms[this.scope.from].setDisplay("normal");
				mp.molecule.atoms[this.scope.to].setDisplay("normal");

				if(!this.data.moved && oneOf(mp.tool.type, ["select", "drag"]))
				{
					this.scope.select(!this.scope.selected, true);
					mp.updateBondSelection();
					mp.updateRotationCenter();
				}
				else
				{
					if(this.scope.selected) mp.collapseAtoms(mp.tool.selection.slice(), true, true);
					else mp.collapseAtoms([this.scope.from, this.scope.to], true, true);

					/* process possible changes to
					rotation center caused by collapsing */
					mp.updateRotationCenter();
				}
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
