/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

MPAtom.prototype.getHandler = function()
{
	//TODO: calculateNewBondAngle use lone-pairs and valence

	if(this.mp.tool.type === "atom")
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
				if(!p.inCircle(this.scope.center, mp.s.atom.minAddRotateLength))
				{
					//create target atom if no target atom has been created yet
					if(this.data.atom === -1)
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
					this.data.currentAngle = mp.mol.rotateAtoms(
							this.scope.center, p, [this.data.atom],
							this.data.currentAngle,
							this.data.startAngle,
							mp.s.rotateSteps);
				}
			},
			onPointerUp: function(e, mp)
			{
				if(this.data.atom !== -1)
				{
					mp.mol.collapseAtoms([this.data.atom], true);
				}
			}
		};
	}
	else if(this.mp.tool.type === "bond")
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
				var bond = mp.mol.bonds[this.data.bond];

				//check for hovered secondary atoms
				for(var i = 0; i < mp.mol.atoms.length; i++)
				{
					//this atom and the new atom do not participate
					if(i === this.scope.index || i === this.data.atom) continue;

					//check for hover using active as event type
					if(mp.mol.atoms[i].handle(p, "active"))
					{
						//skip if the hovered atom is already the target atom
						if(bond.to !== i)
						{
							//reset old target atom to normal display
							//(for the almost impossible case MPAtom.handle is not reached yet)
							mp.mol.atoms[bond.to].setDisplay("normal");
							mp.mol.atoms[bond.to].removeBond(bond.index);

							//hide newly created target atom
							mp.mol.atoms[this.data.atom].setDisplay("hidden");

							//set target atom to new atom
							bond.setTo(i);

							//invalidate new atom
							mp.mol.atoms[i].addBond(bond.index);

							//check if new target atom is a neighbor of this atom
							var n = this.scope.getNeighborBond(i);
							if(n !== -1 && n !== this.data.bond)
							{
								//if so, check if we handled this neighbor before
								if(n !== this.data.neighbor)
								{
									//if not, save the neighbor bond index
									this.data.neighbor = n;

									//and hide the neighbor bond
									//(in order to replace it with this bond)
									mp.mol.bonds[n].setDisplay("hidden");
								}
							}
							else
							{
								//check if there is a neighbor bond we handled before
								if(this.data.neighbor !== undefined)
								{
									//if so, show this bond again and remove it from this.data
									mp.mol.bonds[this.data.neighbor].setDisplay("normal");
									this.data.neighbor = undefined;
								}
							}
						}

						//return so the next blocks of code are not reached
						return;
					}
				}

				//no hovered secondary atom so reset bond.to to this.data.atom
				if(bond.to !== this.data.atom)
				{
					//reshow newly created atom, this wil also invalidate the new bond
					mp.mol.atoms[this.data.atom].setDisplay("normal");

					//check if there is a neighbor bond we handled before
					if(this.data.neighbor !== undefined)
					{
						//if so, reshow this bond again and remove it from this.data
						mp.mol.bonds[this.data.neighbor].setDisplay("normal");
						this.data.neighbor = undefined;
					}

					//reset target atom
					mp.mol.atoms[bond.to].removeBond(bond.index);
					mp.mol.atoms[this.data.atom].addBond(bond.index);
					bond.setTo(this.data.atom);
				}

				//check if pointer is outside no-rotate circle
				if(!p.inCircle(this.scope.center, mp.s.atom.minAddRotateLength))
				{
					//if so, rotate the target atom around this atom
					this.data.currentAngle = mp.mol.rotateAtoms(
							this.scope.center, p, [this.data.atom],
							this.data.currentAngle,
							this.data.startAngle,
							mp.s.rotateSteps);
				}
			},
			onPointerUp: function(e, mp)
			{
				//get final target atom
				var to = mp.mol.bonds[this.data.bond].to;

				//check if final target atom is the newly created one
				if(to !== this.data.atom)
				{
					//if not, add the newly created bond to the real target atom
					mp.mol.atoms[to].addBond(this.data.bond);
					mp.mol.atoms.pop();//and pop the last atom (old target)

					//if final target is connected via an old neighbor bond
					if(this.data.neighbor !== undefined)
					{
						//then remove the old neighbor
						mp.mol.bonds.splice(this.data.neighbor, 1);
						mp.mol.updateIndices();
					}
				}
				else//try merging target atom with an existing one
				{
					mp.mol.collapseAtoms([to], true);
				}
			}
		};
	}
	else if(this.mp.tool.type === "fragment")
	{
		return {
			scope: this,
			data: {},
			onPointerDown: function(e, mp)
			{
				//determine if the fragment will be connected using a bond
				var bondConnection = this.scope.getBondCount() > 2 && this.scope.element === "C";

				//clone new fragment and transform it
				this.data = {
					frag: MPFragments.translate(
						MPFragments.scale(
							MPFragments.translate(
								MPFragments.clone(mp.tool.data.frag.toAtom),
								bondConnection ? 1 : 0, 0),
							mp.s.bond.length),
							this.scope.center.x, this.scope.center.y)
				};

				//make sure the selection is cleared
				mp.sel.clear();

				//setup selection parameters
				mp.sel.currentAngle = mp.sel.startAngle =
						this.scope.calculateNewBondAngle();
				mp.sel.center = this.scope.center.clone();

				//rotate new fragment using .sel.centerthe currentAngle
				MPFragments.rotate(this.data.frag,
						this.scope.center, mp.sel.currentAngle);

				//create and select the fragment and store the new fragment data
				var frag = mp.mol.createFragment(this.data.frag, true);

				if(bondConnection)
				{
					var connection = new MPBond(mp, {
						i: mp.mol.bonds.length,
						type: MP_BOND_SINGLE,
						stereo: MP_STEREO_NONE,
						from: this.scope.index,
						to: frag.atoms[0],
						selected: true
					});

					mp.mol.bonds.push(connection);
					mp.mol.atoms[connection.to].addBond(connection.index);
					this.scope.addBond(connection.index);
					this.scope.select(true);
				}
				else
				{
					mp.mol.mergeAtoms(frag.atoms[0], this.scope.index);
				}
			},
			onPointerMove: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				//check if pointer is outside no-rotate circle
				if(!p.inCircle(this.scope.center, mp.s.atom.minAddRotateLength))
				{
					//if so, rotate the selection (fragment) around this atom
					mp.sel.rotate(p);
				}
			},
			onPointerUp: function(e, mp)
			{
				mp.sel.collapse();
				mp.sel.clear();
			}
		};
	}
	else if(this.mp.tool.type === "charge")
	{
		return {
			scope: this,
			onPointerDown: function(e, mp)
			{
				this.scope.setCharge(this.scope.charge + mp.tool.data.charge);
			}
		};
	}
	else if(this.mp.tool.type === "chain")
	{
		return {
			scope: this,
			data: {
				startAngle: 0,
				length: this.mp.s.bond.length * Math.cos(this.mp.s.chain.devAngle),
				chain: [],//chain vertices
				ra: undefined//repel angle
			},
			onDraw: function(mp)
			{
				//draw chain
				mp.ctx.strokeStyle = mp.s.chain.strokeStyle;
				mp.ctx.lineWidth = mp.s.bond.width * mp.s.bond.scale;
				mp.ctx.lineCap = mp.s.chain.lineCap;
				mp.ctx.lineJoin = mp.s.chain.lineJoin;
				mp.ctx.setLineDash([
					2 * mp.s.bond.scale,
					5 * mp.s.bond.scale
				]);

				mp.ctx.beginPath();

				for(var i = 0; i < this.data.chain.length; i++)
				{
					if(i === 0) mp.ctx.moveTo(this.data.chain[i].x, this.data.chain[i].y);
					else mp.ctx.lineTo(this.data.chain[i].x, this.data.chain[i].y);
				}

				mp.ctx.stroke();

				//draw chain size
				if(this.data.chain.length > 0)
				{
					mp.setFont("chainSize");
					mp.ctx.fillStyle = mp.s.chain.color;

					//calculate label dimensions
					var text = "" + this.data.size;
					var w = mp.ctx.measureText(text).width;
					var h = mp.s.atom.scale * mp.s.fonts.chainSize.fontSize;

					//calculate label center
					var lblc = this.data.chain[this.data.chain.length - 1].clone();//label center
					var r = mp.s.atom.scale * mp.s.chain.padding + (w > h ? w : h);//radius from last carbon atom to size label center
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
				if(this.scope.bonds.length === 1)
				{
					//rotate angle of bond to the opposite side
					this.data.ra = posRad(mp.mol.bonds[this.scope.bonds[0]].getAngle(this.scope) + Math.PI);
				}
				else if(this.scope.bonds.length === 2)
				{
					//rotate new bond angle to opposite side to achieve reversed effect
					//(the chain will stick to the new bond angle)
					this.data.ra = posRad(this.scope.calculateNewBondAngle() + Math.PI);
				}
				else
				{
					this.data.ra = undefined;
				}
			},
			onPointerMove: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				//calculate new angle
				var a = clampedAngle(this.data.startAngle, this.scope.center, p,
						mp.s.chain.rotateSteps);

				//calculate new size
				var size = Math.floor(this.scope.center.distanceTo(p) /
						this.data.length);

				if(a !== this.data.a || size !== this.data.size)
				{
					this.data.a = a;
					this.data.size = size;

					//calculate deviation side
					var ds = this.data.a > -Math.PI / 2 && this.data.a < Math.PI / 2 ? 1 : -1;
					var da = this.data.a + ds * mp.s.chain.devAngle;
					if(this.data.ra !== undefined)
					{
						//copmare alternative and replace current angle with alternative angle
						var da_alt = this.data.a - ds * mp.s.chain.devAngle;
						if(smallestAngleBetween(da, this.data.ra) <
								smallestAngleBetween(da_alt, this.data.ra))
						{
							da = da_alt;
						}
					}

					//calculate chain vertices
					var ax = this.data.length * Math.cos(this.data.a);
					var ay = this.data.length * Math.sin(-this.data.a);//flipped y-axis
					var bx = mp.s.bond.length * Math.cos(da);
					var by = mp.s.bond.length * Math.sin(-da);

					this.data.chain = [];
					var c = this.scope.center.clone();
					for(var i = 0; i < this.data.size; i++)
					{
						if(i % 2 === 0)
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

					mp.requestRedraw();
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
						i: mp.mol.atoms.length,
						x: this.data.chain[i].x,
						y: this.data.chain[i].y,
						element: "C"
					});
					mp.mol.atoms.push(atom);
					chainIndices.push(atom.index);

					var bond = new MPBond(mp, {
						i: mp.mol.bonds.length,
						from: catom.index,
						to: atom.index,
						type: MP_BOND_SINGLE
					});
					mp.mol.bonds.push(bond);

					catom.addBond(bond.index);
					atom.addBond(bond.index);
					catom = atom;
				}

				//collapse chain
				mp.mol.collapseAtoms(chainIndices, true);
			}
		};
	}
	else if(this.mp.tool.type === "erase")
	{
		return {
			scope: this,
			onPointerDown: function(e, mp)
			{
				if(this.scope.isSelected()) mp.sel.remove();
				else mp.mol.removeAtom(this.scope.index, true);

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
				if(mp.sel.hasCenter())
				{
					mp.sel.startAngle =
							mp.sel.currentAngle =
							mp.sel.center.angleTo(p);
				}
			},
			onPointerMove: function(e, mp)
			{
				mp.setCursor("move");
				var p = new MPPoint().fromRelativePointer(e, mp);
				var dx = p.x - mp.pointer.old.r.x;
				var dy = p.y - mp.pointer.old.r.y;

				if(Math.sqrt(dx * dx + dy * dy) > mp.s.draggingThreshold || this.data.moved)
				{
					this.data.moved = true;

					if(this.scope.isSelected())
					{
						if(!mp.sel.hasCenter() || mp.sel.centerAtom === this.scope.index)
						{
							mp.sel.translate(dx, dy);
						}
						else
						{
							mp.sel.rotate(p);
						}
					}
					else
					{
						this.scope.translate(p.x - mp.pointer.old.r.x, p.y - mp.pointer.old.r.y);
					}

					mp.pointer.old.r = p;
				}
			},
			onPointerUp: function(e, mp)
			{
				if(!this.data.moved && oneOf(mp.tool.type, ["select", "drag"]))
				{
					this.scope.select(!this.scope.isSelected());
					mp.sel.updateRotationCenter();
				}
				else
				{
					if(this.scope.isSelected()) mp.sel.collapse();
					else mp.mol.collapseAtoms([this.scope.index], true);

					/* process possible changes to
					rotation center caused by collapsing */
					mp.sel.updateRotationCenter();
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
	if(this.line === undefined) return false;

	var r = this.mp.s.atom.selectionRadiusScaled;

	if(this.line.area.point)
	{
		if(point.inCircleBox(this.center, r))
		{
			if(point.inCircle(this.center, r))
			{
				this.setDisplay(type);
				return true;
			}
		}
	}
	else
	{
		var lp = new MPPoint(this.center.x + this.line.area.left, this.center.y);
		var rp = new MPPoint(this.center.x + this.line.area.right, this.center.y);
		if(point.inLineBox(lp, rp, r))
		{
			if(point.lineDistance(lp, rp) <= r)
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
