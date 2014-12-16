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

MPAtom.prototype.getHandler = function()
{
	//TODO: implement carbon chain
	//TODO: drag atom if bond count is filled
	//TODO: always enable horizontal/vertical rotate clamping
	//TODO: atom drag collapsing

	var scope = this;
	if(this.mp.tool.type == "atom")
	{
		return {
			scope: this,
			onPointerDown: function(e)
			{
				e.preventDefault();

				this.tool.tmp = {
					atom: -1,
					oldElement: scope.element
				};

				scope.setElement(this.tool.data.element);
			},
			onPointerMove: function(e)
			{
				e.preventDefault();
				var p = new MPPoint().fromRelativePointer(e, this);

				//check if pointer is outside no-rotate circle
				if(!p.inCircle(scope.center, this.settings.atom.minAddRotateLength))
				{
					//create target atom if no target atom has been created yet
					if(this.tool.tmp.atom == -1)
					{
						scope.setElement(this.tool.tmp.oldElement);
						this.tool.tmp.startAngle = scope.calculateNewBondAngle();
						this.tool.tmp = scope.addNewBond({
							a: this.tool.tmp.startAngle,
							type: this.tool.data.type || MP_BOND_SINGLE,
							stereo: this.tool.data.stereo || MP_STEREO_NONE,
							element: this.tool.data.element
						});
					}

					//rotate the target atom around this atom
					this.tool.tmp.currentAngle = this.rotateAtoms(
							scope.center, p, [this.tool.tmp.atom],
							this.tool.tmp.currentAngle,
							this.tool.tmp.startAngle,
							this.settings.bond.rotateSteps);
				}
			}
		};
	}
	else if(this.mp.tool.type == "bond")
	{
		return {
			scope: this,
			onPointerDown: function(e)
			{
				var a = scope.calculateNewBondAngle();

				this.tool.tmp = scope.addNewBond({
					a: a,
					type: this.tool.data.type || MP_BOND_SINGLE,
					stereo: this.tool.data.stereo || MP_STEREO_NONE,
					element: this.tool.data.element
				});
			},
			onPointerMove: function(e)
			{
				e.preventDefault();
				var p = new MPPoint().fromRelativePointer(e, this);
				var bond = this.molecule.bonds[this.tool.tmp.bond];

				//check for hovered secondary atom
				for(var i = 0; i < this.molecule.atoms.length; i++)
				{
					//this atom and the new atom do not participate
					if(i == scope.index || i == this.tool.tmp.atom) continue;

					//check for hover using active as event type
					if(this.molecule.atoms[i].handle(p, "active"))
					{
						//skip if the hovered atom is already the target atom
						if(bond.to != i)
						{
							//reset old target atom to normal display
							//(for the almost impossible case MPAtom.handle is not reached yet)
							this.molecule.atoms[bond.to].setDisplay("normal");

							//hide newly created target atom
							this.molecule.atoms[this.tool.tmp.atom].setDisplay("hidden");

							//set target atom to new atom
							bond.setTo(i);

							//check if new target atom is a neighbor of this atom
							var n = scope.getNeighborBond(i);
							if(n != -1 && n != this.tool.tmp.bond)
							{
								//if so, check if we handled this neighbor before
								if(n != this.tool.tmp.neighbor)
								{
									//if not, save the neighbor bond index
									this.tool.tmp.neighbor = n;

									//and hide the neighbor bond
									//(in order to replace it with this bond)
									this.molecule.bonds[n].setDisplay("hidden");
								}
							}
							else
							{
								//check if there is a neighbor bond we handled before
								if(this.tool.tmp.neighbor !== undefined)
								{
									//if so, reshow this bond again and remove it from tool.tmp
									this.molecule.bonds[this.tool.tmp.neighbor].setDisplay("normal");
									this.tool.tmp.neighbor = undefined;
								}
							}
						}

						//return so the next blocks of code are not reached
						return;
					}
				}

				//no hovered secondary atom so reset bond.to to tool.tmp.atom
				if(bond.to != this.tool.tmp.atom)
				{
					//reshow newly created atom, this wil also invalidate the new bond
					this.molecule.atoms[this.tool.tmp.atom].setDisplay("normal");

					//check if there is a neighbor bond we handled before
					if(this.tool.tmp.neighbor !== undefined)
					{
						//if so, reshow this bond again and remove it from tool.tmp
						this.molecule.bonds[this.tool.tmp.neighbor].setDisplay("normal");
						this.tool.tmp.neighbor = undefined;
					}

					//reset target atom
					bond.setTo(this.tool.tmp.atom);
				}

				//check if pointer is outside no-rotate circle
				if(!p.inCircle(scope.center, this.settings.atom.minAddRotateLength))
				{
					//if so, rotate the target atom around this atom
					this.tool.tmp.currentAngle = this.rotateAtoms(
							scope.center, p, [this.tool.tmp.atom],
							this.tool.tmp.currentAngle,
							this.tool.tmp.startAngle,
							this.settings.bond.rotateSteps);
				}
			},
			onPointerUp: function(e)
			{
				//get final target atom
				var to = this.molecule.bonds[this.tool.tmp.bond].to;

				//check if final target atom is the newly created one
				if(to != this.tool.tmp.atom)
				{
					//if not, add the newly created bond to the real target atom
					this.molecule.atoms[to].addBond(this.tool.tmp.bond);
					this.molecule.atoms.pop();//and pop the last atom (old target)

					//if final target is connected via an old neighbor bond
					if(this.tool.tmp.neighbor !== undefined)
					{
						//then remove the old neighbor
						this.molecule.bonds.splice(this.tool.tmp.neighbor, 1);
						this.updateIndices();
					}
				}

				this.resetEventDisplay();
				scope.setDisplay(e.type == "mouseup" ? "hover" : "normal");
			}
		};
	}
	else if(this.mp.tool.type == "fragment")
	{
		//TODO: merge into exisiting atoms
		return {
			scope: this,
			onPointerDown: function(e)
			{
				//determine if the fragment will be connected using a bond
				var bondConnection = scope.getBondCount() > 2 && scope.element == "C";

				//clone new fragment and transform it
				this.tool.tmp = {
					frag: MPFragments.translate(
						MPFragments.scale(
							MPFragments.translate(
								MPFragments.clone(this.tool.data.frag.toAtom),
								bondConnection ? 1 : 0, 0),
							this.settings.bond.length),
							scope.center.x, scope.center.y),
					startAngle: scope.calculateNewBondAngle()
				};
				this.tool.tmp.currentAngle = this.tool.tmp.startAngle;

				//rotate new fragment using the startAngle
				MPFragments.rotate(this.tool.tmp.frag,
						scope.center, this.tool.tmp.startAngle);

				//create the fragment and store the new fragment data
				this.tool.tmp.selection = this.createFragment(this.tool.tmp.frag);

				if(bondConnection)
				{
					var connection = new MPBond(this, {
						i: this.molecule.bonds.length,
						type: MP_BOND_SINGLE,
						stereo: MP_STEREO_NONE,
						from: scope.index,
						to: this.tool.tmp.selection[0]
					});

					scope.addBond(connection.index);
					this.molecule.atoms[connection.to].addBond(connection.index);
					this.molecule.bonds.push(connection);
				}
				else
				{
					this.mergeAtoms(this.tool.tmp.selection[0], scope.index);
				}
			},
			onPointerMove: function(e)
			{
				var p = new MPPoint().fromRelativePointer(e, this);

				//check if pointer is outside no-rotate circle
				if(!p.inCircle(scope.center, this.settings.atom.minAddRotateLength))
				{
					//if so, rotate the target fragment around this atom
					this.tool.tmp.currentAngle = this.rotateAtoms(
							scope.center, p, this.tool.tmp.selection,
							this.tool.tmp.currentAngle,
							this.tool.tmp.startAngle,
							this.settings.bond.rotateSteps);
				}
			}
		};
	}
	else if(this.mp.tool.type == "charge")
	{
		return {
			scope: this,
			onPointerDown: function(e)
			{
				scope.setCharge(scope.charge + this.tool.data.charge);
			}
		};
	}
	else if(this.mp.tool.type == "erase")
	{
		return {
			scope: this,
			onPointerDown: function(e)
			{
				this.removeAtom(scope.index);
			}
		};
	}
	else//drag, fallback
	{
		return {
			scope: this,
			onPointerMove: function(e)
			{
				this.setCursor("move");
				var p = new MPPoint().fromRelativePointer(e, this);
				scope.translate(p.x - this.pointer.old.r.x, p.y - this.pointer.old.r.y);
				this.pointer.old.r = p;
			}
		};
	}
}

MPAtom.prototype.handle = function(point, type)
{
	if(this.display == "hidden") return false;

	this.validate();

	var r = this.mp.settings.atom.radiusScaled;

	if(this.line.area.point)
	{
		if(point.inCircleBox(this.line.area.point, r))
		{
			if(point.inCircle(this.line.area.point, r))
			{
				this.setDisplay(type);
				return true;
			}
		}
	}
	else
	{
		if(point.inLineBox(this.line.area.left, this.line.area.right, r))
		{
			if(point.lineDistance(this.line.area.left, this.line.area.right) <= r)
			{
				this.setDisplay(type);
				return true;
			}
		}
	}

	this.setDisplay("normal");
	return false;
}
