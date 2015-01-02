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
	//TODO: calculateNewBondAngle use lone-pairs and valence
	//TODO: drag atom if bond count is filled

	if(this.mp.tool.type == "atom")
	{
		return {
			scope: this,
			data: {},
			onPointerDown: function(e, mp)
			{
				this.data = {
					atom: -1,
					oldElement: this.scope.element
				};

				this.scope.setElement(mp.tool.data.element);
			},
			onPointerMove: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				//check if pointer is outside no-rotate circle
				if(!p.inCircle(this.scope.center, mp.settings.atom.minAddRotateLength))
				{
					//create target atom if no target atom has been created yet
					if(this.data.atom == -1)
					{
						this.scope.setElement(this.data.oldElement);
						this.data.startAngle = this.scope.calculateNewBondAngle();
						this.data = this.scope.addNewBond({
							a: this.data.startAngle,
							type: mp.tool.data.type || MP_BOND_SINGLE,
							stereo: mp.tool.data.stereo || MP_STEREO_NONE,
							element: mp.tool.data.element
						});
					}

					//rotate the target atom around this atom
					this.data.currentAngle = mp.rotateAtoms(
							this.scope.center, p, [this.data.atom],
							this.data.currentAngle,
							this.data.startAngle,
							mp.settings.bond.rotateSteps);
				}
			},
			onPointerUp: function(e, mp)
			{
				if(this.data.atom != -1)
				{
					mp.collapseAtoms([this.data.atom], true);
				}
			}
		};
	}
	else if(this.mp.tool.type == "bond")
	{
		return {
			scope: this,
			data: {},
			onPointerDown: function(e, mp)
			{
				var a = this.scope.calculateNewBondAngle();

				this.data = this.scope.addNewBond({
					a: a,
					type: mp.tool.data.type || MP_BOND_SINGLE,
					stereo: mp.tool.data.stereo || MP_STEREO_NONE,
					element: mp.tool.data.element
				});
			},
			onPointerMove: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);
				var bond = mp.molecule.bonds[this.data.bond];

				//check for hovered secondary atoms
				for(var i = 0; i < mp.molecule.atoms.length; i++)
				{
					//this atom and the new atom do not participate
					if(i == this.scope.index || i == this.data.atom) continue;

					//check for hover using active as event type
					if(mp.molecule.atoms[i].handle(p, "active"))
					{
						//skip if the hovered atom is already the target atom
						if(bond.to != i)
						{
							//reset old target atom to normal display
							//(for the almost impossible case MPAtom.handle is not reached yet)
							mp.molecule.atoms[bond.to].setDisplay("normal");

							//hide newly created target atom
							mp.molecule.atoms[this.data.atom].setDisplay("hidden");

							//set target atom to new atom
							bond.setTo(i);

							//check if new target atom is a neighbor of this atom
							var n = this.scope.getNeighborBond(i);
							if(n != -1 && n != this.data.bond)
							{
								//if so, check if we handled this neighbor before
								if(n != this.data.neighbor)
								{
									//if not, save the neighbor bond index
									this.data.neighbor = n;

									//and hide the neighbor bond
									//(in order to replace it with this bond)
									mp.molecule.bonds[n].setDisplay("hidden");
								}
							}
							else
							{
								//check if there is a neighbor bond we handled before
								if(this.data.neighbor !== undefined)
								{
									//if so, show this bond again and remove it from this.data
									mp.molecule.bonds[this.data.neighbor].setDisplay("normal");
									this.data.neighbor = undefined;
								}
							}
						}

						//return so the next blocks of code are not reached
						return;
					}
				}

				//no hovered secondary atom so reset bond.to to this.data.atom
				if(bond.to != this.data.atom)
				{
					//reshow newly created atom, this wil also invalidate the new bond
					mp.molecule.atoms[this.data.atom].setDisplay("normal");

					//check if there is a neighbor bond we handled before
					if(this.data.neighbor !== undefined)
					{
						//if so, reshow this bond again and remove it from this.data
						mp.molecule.bonds[this.data.neighbor].setDisplay("normal");
						this.data.neighbor = undefined;
					}

					//reset target atom
					bond.setTo(this.data.atom);
				}

				//check if pointer is outside no-rotate circle
				if(!p.inCircle(this.scope.center, mp.settings.atom.minAddRotateLength))
				{
					//if so, rotate the target atom around this atom
					this.data.currentAngle = mp.rotateAtoms(
							this.scope.center, p, [this.data.atom],
							this.data.currentAngle,
							this.data.startAngle,
							mp.settings.bond.rotateSteps);
				}
			},
			onPointerUp: function(e, mp)
			{
				//get final target atom
				var to = mp.molecule.bonds[this.data.bond].to;

				//check if final target atom is the newly created one
				if(to != this.data.atom)
				{
					//if not, add the newly created bond to the real target atom
					mp.molecule.atoms[to].addBond(this.data.bond);
					mp.molecule.atoms.pop();//and pop the last atom (old target)

					//if final target is connected via an old neighbor bond
					if(this.data.neighbor !== undefined)
					{
						//then remove the old neighbor
						mp.molecule.bonds.splice(this.data.neighbor, 1);
						mp.updateIndices();
					}
				}
				else//try merging target atom with an existing one
				{
					mp.collapseAtoms([to], true);
				}
			}
		};
	}
	else if(this.mp.tool.type == "fragment")
	{
		return {
			scope: this,
			data: {},
			onPointerDown: function(e, mp)
			{
				//determine if the fragment will be connected using a bond
				var bondConnection = this.scope.getBondCount() > 2 && this.scope.element == "C";

				//clone new fragment and transform it
				this.data = {
					frag: MPFragments.translate(
						MPFragments.scale(
							MPFragments.translate(
								MPFragments.clone(mp.tool.data.frag.toAtom),
								bondConnection ? 1 : 0, 0),
							mp.settings.bond.length),
							this.scope.center.x, this.scope.center.y),
					startAngle: this.scope.calculateNewBondAngle()
				};
				this.data.currentAngle = this.data.startAngle;

				//rotate new fragment using the startAngle
				MPFragments.rotate(this.data.frag,
						this.scope.center, this.data.startAngle);

				//create the fragment and store the new fragment data
				mp.tool.selection = mp.createFragment(this.data.frag);

				if(bondConnection)
				{
					var connection = new MPBond(mp, {
						i: mp.molecule.bonds.length,
						type: MP_BOND_SINGLE,
						stereo: MP_STEREO_NONE,
						from: this.scope.index,
						to: mp.tool.selection[0]
					});

					this.scope.addBond(connection.index);
					mp.molecule.atoms[connection.to].addBond(connection.index);
					mp.molecule.bonds.push(connection);
				}
				else
				{
					mp.mergeAtoms(mp.tool.selection[0], this.scope.index);
				}
			},
			onPointerMove: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				//check if pointer is outside no-rotate circle
				if(!p.inCircle(this.scope.center, mp.settings.atom.minAddRotateLength))
				{
					//if so, rotate the target fragment around this atom
					this.data.currentAngle = mp.rotateAtoms(
							this.scope.center, p, mp.tool.selection,
							this.data.currentAngle,
							this.data.startAngle,
							mp.settings.bond.rotateSteps);
				}
			},
			onPointerUp: function(e, mp)
			{
				mp.collapseAtoms(mp.tool.selection.slice());
				mp.clearToolData();//clears selection
			}
		};
	}
	else if(this.mp.tool.type == "charge")
	{
		return {
			scope: this,
			onPointerDown: function(e, mp)
			{
				this.scope.setCharge(this.scope.charge + mp.tool.data.charge);
			}
		};
	}
	else if(this.mp.tool.type == "chain")
	{
		//TODO: straight chain when toggling chain button
		return {
			scope: this,
			data: {
				startAngle: 0,
				length: this.mp.settings.bond.length * Math.cos(this.mp.settings.chain.devAngle),
				chain: [],//chain vertices
				ca: undefined//connecting bond angle
			},
			onDraw: function(mp)
			{
				//draw chain
				mp.ctx.strokeStyle = mp.settings.chain.strokeStyle;
				mp.ctx.lineWidth = mp.settings.bond.width * mp.settings.bond.scale;
				mp.ctx.lineCap = mp.settings.chain.lineCap;
				mp.ctx.lineJoin = mp.settings.chain.lineJoin;
				mp.ctx.setLineDash([
					2 * mp.settings.bond.scale,
					5 * mp.settings.bond.scale
				]);

				mp.ctx.beginPath();

				for(var i = 0; i < this.data.chain.length; i++)
				{
					if(i == 0) mp.ctx.moveTo(this.data.chain[i].x, this.data.chain[i].y);
					else mp.ctx.lineTo(this.data.chain[i].x, this.data.chain[i].y);
				}

				mp.ctx.stroke();

				//draw chain size
				if(this.data.chain.length > 0)
				{
					mp.setFont("chainSize");
					mp.ctx.fillStyle = mp.settings.chain.color;

					//calculate label dimensions
					var text = "" + this.data.size;
					var w = mp.ctx.measureText(text).width;
					var h = mp.settings.atom.scale * mp.settings.fonts.chainSize.fontSize;

					//calculate label center
					var lblc = this.data.chain[this.data.chain.length - 1].clone();//label center
					var r = mp.settings.atom.scale * mp.settings.chain.padding + (w > h ? w : h);//radius from last carbon atom to size label center
					lblc.x += r * Math.cos(this.data.a);
					lblc.y += r * Math.sin(-this.data.a);//flip y-axis
					lblc.x -= w / 2;
					lblc.y += h / 2;

					mp.ctx.fillText(text, lblc.x, lblc.y);
				}
			},
			onPointerDown: function(e, mp)
			{
				//calculate new startAngle
				this.data.startAngle = this.scope.calculateNewBondAngle();

				//calculate starting deviation side
				if(this.scope.bonds.length == 1)
				{
					this.data.ca = mp.molecule.bonds[this.scope.bonds[0]].getAngle(this.scope) + Math.PI;
				}
				else
				{
					this.data.ca = undefined;
				}
			},
			onPointerMove: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				//calculate new angle
				var a = clampedAngle(this.data.startAngle, this.scope.center, p,
						mp.settings.chain.rotateSteps);

				//calculate new size
				var size = Math.floor(this.scope.center.distanceTo(p) /
						this.data.length);

				if(a != this.data.a || size != this.data.size)
				{
					this.data.a = a;
					this.data.size = size;

					//calculate deviation side
					var ds = this.data.a > -Math.PI / 2 && this.data.a < Math.PI / 2 ? 1 : -1;
					if(this.data.ca !== undefined)
					{
						ds *= -radSide(this.data.a, this.data.ca);
					}

					//calculate chain vertices
					var ax = this.data.length * Math.cos(this.data.a);
					var ay = this.data.length * Math.sin(-this.data.a);//flipped y-axis
					var bx = mp.settings.bond.length * Math.cos(this.data.a + ds * mp.settings.chain.devAngle);
					var by = mp.settings.bond.length * Math.sin(-this.data.a - ds * mp.settings.chain.devAngle);

					this.data.chain = [];
					var c = this.scope.center.clone();
					for(var i = 0; i < this.data.size; i++)
					{
						if(i % 2 == 0)
						{
							this.data.chain.push(MPPFO({
								x: c.x + bx,
								y: c.y + by
							}));
						}
						else
						{
							c.x += 2 * ax;
							c.y += 2 * ay;
							this.data.chain.push(c.clone());
						}
					}

					//calculate begin vertex (for drawing purposes)
					if(this.data.chain.length > 0)
					{
						this.data.chain.unshift(this.scope._calculateBondVertices(this.data.chain[0], [0])[0]);
					}

					mp.invalidate();
				}
			},
			onPointerUp: function(e, mp)
			{
				//create chain, skip first vertex
				var catom = this.scope;//connect atom
				var chainIndices = [];//store new atom indices to collapse chain
				for(var i = 1; i < this.data.chain.length; i++)
				{
					var atom = new MPAtom(mp, {
						i: mp.molecule.atoms.length,
						x: this.data.chain[i].x,
						y: this.data.chain[i].y,
						element: "C"
					});
					mp.molecule.atoms.push(atom);
					chainIndices.push(atom.index);

					var bond = new MPBond(mp, {
						i: mp.molecule.bonds.length,
						from: catom.index,
						to: atom.index,
						type: MP_BOND_SINGLE
					});
					mp.molecule.bonds.push(bond);

					catom.addBond(bond.index);
					atom.addBond(bond.index);
					catom = atom;
				}

				//collapse chain
				mp.collapseAtoms(chainIndices, true);
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
				else mp.removeAtom(this.scope.index);

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
				var p = new MPPoint().fromRelativePointer(e, mp);
				if(mp.tool.rotationCenter.point !== undefined)
				{
					mp.tool.rotationCenter.startAngle =
							mp.tool.rotationCenter.currentAngle =
							mp.tool.rotationCenter.point.angleTo(p);
				}
			},
			onPointerMove: function(e, mp)
			{
				mp.setCursor("move");
				var p = new MPPoint().fromRelativePointer(e, mp);
				this.data.moved = true;

				if(this.scope.selected)
				{
					if(mp.tool.rotationCenter.point === undefined || mp.tool.rotationCenter.atom == this.scope.index)
					{
						mp.translateSelection(p.x - mp.pointer.old.r.x, p.y - mp.pointer.old.r.y);
					}
					else
					{
						mp.tool.rotationCenter.currentAngle = mp.rotateAtoms(
								mp.tool.rotationCenter.point, p, mp.tool.selection,
								mp.tool.rotationCenter.currentAngle,
								mp.tool.rotationCenter.startAngle,
								mp.settings.bond.rotateSteps);
					}
				}
				else
				{
					this.scope.translate(p.x - mp.pointer.old.r.x, p.y - mp.pointer.old.r.y);
				}

				mp.pointer.old.r = p;
			},
			onPointerUp: function(e, mp)
			{
				if(!this.data.moved && oneOf(mp.tool.type, ["select", "drag"]))
				{
					this.scope.select(!this.scope.selected);
					mp.updateBondSelection();
					mp.updateRotationCenter();
				}
				else
				{
					if(this.scope.selected) mp.collapseAtoms(mp.tool.selection.slice(), true, true);
					else mp.collapseAtoms([this.scope.index], true, true);

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
 * @return {Boolean}       Indicates if event is handled by this MPAtom
 */
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

MPAtom.prototype.handleRectSelect = function(rect)
{
	this.select(this.center.inRect(rect));
}

MPAtom.prototype.handlePolygonSelect = function(polygon)
{
	this.select(this.center.inPolygon(polygon));
}
