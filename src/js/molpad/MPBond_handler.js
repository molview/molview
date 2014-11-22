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

MPBond.prototype.getHandler = function(mp)
{
	//TODO: fragment to bond tool
	//TODO: bond drag collapsing

	var scope = this;
	if(mp.tool.type == "bond")
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
	else if(mp.tool.type == "erase")
	{
		return {
			scope: this,
			onPointerDown: function(e)
			{
				e.preventDefault();
				this.removeBond(scope.index);
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

				this.molecule.atoms[scope.from].translate(dx, dy);
				this.molecule.atoms[scope.to].translate(dx, dy);

				this.pointer.old.r = p;
			},
			onPointerUp: function(e)
			{
				this.setCursor("pointer");
				this.resetEventDisplay();
				scope.setDisplay(e.type == "mouseup" ? "hover" : "normal");
				this.molecule.atoms[scope.from].setDisplay("normal");
				this.molecule.atoms[scope.to].setDisplay("normal");
			}
		};
	}
}

MPBond.prototype.handle = function(point, type)
{
	if(this.display == "hidden") return false;

	this.validate();

	var r = this.mp.settings.bond.radius * this.mp.settings.bond.scale;

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
