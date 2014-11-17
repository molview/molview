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

function MPAtom(obj)
{
	this.index = obj.i;
	this.position = { x: obj.x || 0, y: obj.y || 0 };//atom center
	this.element = obj.element || "C";
	this.charge = obj.charge || 0;
	this.isotope = obj.isotope || 0;
	this.bonds = obj.bonds || [];
	this.display = "normal";
}

/**
 * Data
 */

MPAtom.prototype.getKetcherData = function(mp)
{
	return new chem.Struct.Atom({
		pp: {
			x: this.position.x / mp.settings.bond.length,
			y: this.position.y / mp.settings.bond.length
		},
		label: this.element,
		charge: this.charge,
		isotope: this.isotope
	});
}

MPAtom.prototype.getPlainData = function()
{
	return {
		i: this.index,
		x: this.position.x,
		y: this.position.y,
		element: this.element,
		charge: this.charge,
		isotope: this.isotope,
		bonds: this.bonds.slice(0, this.bonds.length)
	};
}

MPAtom.prototype.getIndex = function() { return this.index; }
MPAtom.prototype.setIndex = function(index) { this.index = index; }

MPAtom.prototype.getPosition = function() { return this.position; }
MPAtom.prototype.setPosition = function(position) { this.position = position; }

MPAtom.prototype.getX = function() { return this.position.x; }
MPAtom.prototype.getY = function() { return this.position.y; }

MPAtom.prototype.getElement = function() { return this.element; }
MPAtom.prototype.setElement = function(element)
{
	this.element = element == "D" ? "H" : element;
}

MPAtom.prototype.getCharge = function() { return this.charge; }
MPAtom.prototype.setCharge = function(charge) { this.charge = charge; }

MPAtom.prototype.getIsotope = function() { return this.isotope; }
MPAtom.prototype.setIsotope = function(isotope) { this.isotope = isotope; }

MPAtom.prototype.addBond = function(bond)
{
	this.bonds.push(bond);
}

MPAtom.prototype.mapBonds = function(map)
{
	for(var i = 0; i < this.bonds.length; i++)
	{
		if(map[this.bonds[i]] !== undefined)
		{
			this.bonds[i] = map[this.bonds[i]];
		}
		else
		{
			this.bonds.splice(i, 1);
			i--;
		}
	}
}

MPAtom.prototype.getCenterLine = function()
{
	return this.line || {
		area: {
			point: this.position
		}
	};
}

MPAtom.prototype.getDisplay = function() { return this.display; }

/**
 * Sets display and returns wether the display has changed
 * @param  {String} state
 * @return {Boolean}
 */
MPAtom.prototype.setDisplay = function(state)
{
	var changed = this.lastDisplay != state;
	this.lastDisplay = this.display = state;
	return changed;
}

/**
 * Resets display to normal in case this.handle is not reached by the
 * hoverHandler (in this case, the state is drawn as normal and in the
 * next hoverHandler cycle, this.lastDisplay will become normal)
 * Saves the old state in this.lastDisplay to check the state change in
 * this.setDisplay later
 */
MPAtom.prototype.resetDisplay = function()
{
	this.lastDisplay = this.display;
	this.display = "normal";
}

/**
 * Finds this MPAtom if it is an implicit hydrogen atom
 * All H atoms bonded to a C atom without stereo information are considered implicit
 * @param  {MolPad}  mp
 * @return {Boolean}    Indicates if this atom is implicit
 */
MPAtom.prototype.isImplicit = function(mp)
{
	if(this.element == "H" && this.isotope == 0 &&
			this.charge == 0 && this.bonds.length == 1)
	{
		var bond = mp.molecule.bonds[this.bonds[0]];
		if(bond.getType() == MP_BOND_SINGLE && bond.getStereo() == MP_STEREO_NONE &&
			bond.isPair("C", "H", mp))
		{
			return true;
		}
	}
	return false;
}

/**
 * Checks if the given index is a neighbor atom
 * You can set an exclude bond index so it can be used for live bond collapsing
 * @param  {MolPad}  mp
 * @param  {Integer} idx
 * @param  {Integer} exclude
 * @return {Boolean}
 */
MPAtom.prototype.isNeighborAtom = function(mp, idx, exclude)
{
	for(var i = 0; i < this.bonds.length; i++)
	{
		if(this.bonds[i] == exclude) continue;
		if(mp.molecule.bonds[this.bonds[i]].hasAtom(idx))
		{
			return true;
		}
	}
	return false;
}

/**
 * Translate the atom using the given x and y distance
 * @param  {Float} x
 * @param  {Float} y
 */
MPAtom.prototype.translate = function(x, y)
{
	this.position.x += x;
	this.position.y += y;
}

/**
 * Saturate atom with hydrogens
 * C atoms are saturated using their four binding sites
 * @param {MolPad} mp
 */
MPAtom.prototype.addImplicitHydrogen = function(mp)
{
	if(this.element == "C")
	{
		if(this.getBondCount(mp) == 2 && this.bonds.length == 2)
		{
			var af = mp.molecule.bonds[this.bonds[0]].getAngle(mp, this);
			var at = mp.molecule.bonds[this.bonds[1]].getAngle(mp, this);
			var da = Math.max(af, at) - Math.min(af, at);

			if(da < Math.PI - mp.settings.bond.straightDev ||
				da > Math.PI + mp.settings.bond.straightDev)
			{
				var a = this.calculateNewBondAngle(mp, 2);
				if(a == 0) return;

				this.addNewBond(mp, {
					a: a[0],
					length: mp.settings.bond.lengthHydrogen,
					element: "H"
				});
				this.addNewBond(mp, {
					a: a[1],
					length: mp.settings.bond.lengthHydrogen,
					element: "H"
				});

				return;
			}
		}

		while(this.getBondCount(mp) < 4)
		{
			var a = this.calculateNewBondAngle(mp);

			//create new bond
			this.addNewBond(mp, {
				a: a,
				length: mp.settings.bond.lengthHydrogen,
				element: "H"
			});
		}
	}
}

MPAtom.prototype.getBondCount = function(mp)
{
	var ret = 0;
	for(var i = 0; i < this.bonds.length; i++)
	{
		ret += mp.molecule.bonds[this.bonds[i]].getType();
	}
	return ret;
}

/**
 * Event handlers
 */

MPAtom.prototype.getHandler = function(mp)
{
	//TODO: implement carbon chain
	//TODO: drag atom if bond count is filled
	//TODO: always enable horizontal/vertical rotate clamping
	//TODO: atom drag collapsing

	var scope = this;
	if(mp.tool.type == "atom")
	{
		return {
			onPointerDown: function(e)
			{
				e.preventDefault();

				this.tool.tmp = {
					atom: -1,
					oldElement: scope.getElement()
				};

				scope.setElement(this.tool.data.element);
				scope.update(this);
				scope.updateBonds(this);
				this.redraw();
			},
			onPointerMove: function(e)
			{
				e.preventDefault();
				var p = this.getRelativeCoords(getPointerCoords(e));

				if(!pointInsideCircle(p, scope.getPosition(),
						this.settings.atom.minAddRotateLength))//rotate around
				{
					var first = this.tool.tmp.atom == -1;
					if(first)
					{
						scope.setElement(this.tool.tmp.oldElement);
						scope.updateBonds(this);
						var a = scope.calculateNewBondAngle(this);
						this.tool.tmp = scope.addNewBond(this, {
							a: a,
							type: this.tool.data.type || MP_BOND_SINGLE,
							stereo: this.tool.data.stereo || MP_STEREO_NONE,
							element: this.tool.data.element
						});
					}

					if(scope.rotateAtomAround(this, p, this.tool.tmp.atom) || first)
					{
						this.redraw();
					}
				}
			},
			onPointerUp: function(e)
			{
				this.setCursor("pointer");
				scope.setDisplay(e.type == "mouseup" ? "hover" : "normal");
				this.redraw();
			}
		};
	}
	else if(mp.tool.type == "bond")
	{
		return {
			onPointerDown: function(e)
			{
				var a = scope.calculateNewBondAngle(this);

				this.tool.tmp = scope.addNewBond(this, {
					a: a,
					type: this.tool.data.type || MP_BOND_SINGLE,
					stereo: this.tool.data.stereo || MP_STEREO_NONE,
					element: this.tool.data.element
				});

				this.redraw();
			},
			onPointerMove: function(e)
			{
				e.preventDefault();
				var changed = false;
				var p = this.getRelativeCoords(getPointerCoords(e));
				var bond = this.molecule.bonds[this.tool.tmp.bond];

				for(var i = 0; i < this.molecule.atoms.length; i++)
				{
					if(i == scope.getIndex() || i == this.tool.tmp.atom) continue;

					if(this.molecule.atoms[i].handle(this, p, "active").hit)
					{
						if(bond.getTo() != i)
						{
							this.molecule.atoms[bond.getTo()].setDisplay("normal");
							this.molecule.atoms[this.tool.tmp.atom].setDisplay("hidden");
							bond.setTo(i);

							if(scope.isNeighborAtom(this, i, this.tool.tmp.bond))
							{
								bond.setDisplay("hidden");
							}
							else
							{
								bond.setDisplay("normal");
								bond.update(this);
							}

							this.redraw();
						}

						return;
					}
				}

				//reset bond.to to tool.tmp.atom
				if(bond.getTo() != this.tool.tmp.atom)
				{
					bond.setDisplay("normal");
					bond.setTo(this.tool.tmp.atom);
					this.molecule.atoms[this.tool.tmp.atom].setDisplay("normal");
					changed = true;
				}

				if(!pointInsideCircle(p, scope.getPosition(),
						this.settings.atom.minAddRotateLength))//rotate around
				{
					changed = scope.rotateAtomAround(this, p, this.tool.tmp.atom, changed) || changed;
				}

				if(changed) this.redraw();
			},
			onPointerUp: function(e)
			{
				var to = this.molecule.bonds[this.tool.tmp.bond].getTo();

				if(scope.isNeighborAtom(this, to, this.tool.tmp.bond))
				{
					scope.bonds.splice(scope.bonds.indexOf(this.tool.tmp.bond));
					this.molecule.bonds.pop();
					this.molecule.atoms.pop();
					scope.update(this);
					scope.updateBonds(this);
				}
				else if(to != this.tool.tmp.atom)
				{
					this.molecule.atoms[to].addBond(this.tool.tmp.bond);
					this.molecule.atoms.pop();
					scope.update(this);
					scope.updateBonds(this);
				}

				scope.setDisplay(e.type == "mouseup" ? "hover" : "normal");
				this.redraw();
			}
		};
	}
	else if(mp.tool.type == "fragment")
	{
		/**
		 * Add fragment to atom:
		 * 1. clone frag.toAtom and save tool.tmp.frag
		 * 2. scale fragment to bondLength
		 * 3. translate fragment to atom
		 * 4. calculate new bond angle and save to tool.tmp.startAngle
		 * 5. add fragment to MolPad.molecule and save new atom indices to tool.tmp.frag
		 * 5. rotate real fragment using the new bond angle
		 * 6. connect fragment frag.atoms.first to atom using a new MPBond
		 * 7. clamp and apply new angle onPointerMove
		 */
		return {
			onPointerDown: function(e)
			{
				var bondConnection = scope.getBondCount(this) > 2 && scope.getElement() == "C";

				this.tool.tmp = {
					frag: MPFragments.translate(
						MPFragments.scale(
							MPFragments.translate(
								MPFragments.clone(this.tool.data.frag.toAtom),
								bondConnection ? 1 : 0, 0),
							this.settings.bond.length),
							scope.position.x, scope.position.y),
					startAngle: scope.calculateNewBondAngle(this)
				};
				this.tool.tmp.currentAngle = this.tool.tmp.startAngle;

				var frag = MPFragments.rotate(this.tool.tmp.frag,
						scope.position, -this.tool.tmp.startAngle);//y axis is flipped: rotate clockwise

				//skip first atom (which will be this atom) if !bondConnection
				for(var i = bondConnection ? 0 : 1, n = this.settings.drawSkeletonFormula ?
					frag.size : frag.atoms.length; i < n; i++)
				{
					var atom = new MPAtom({
						i: this.molecule.atoms.length,
						x: frag.atoms[i].x,
						y: frag.atoms[i].y,
						element: frag.atoms[i].element
					});

					this.molecule.atoms.push(atom);
					this.tool.tmp.frag.atoms[i].i = atom.getIndex();
					atom.update(this);
				}

				for(var i = 0, n = this.settings.drawSkeletonFormula ?
					frag.size : frag.bonds.length; i < n; i++)
				{
					var from = !bondConnection && frag.bonds[i].from == 0 ? scope.getIndex() :
							this.tool.tmp.frag.atoms[frag.bonds[i].from].i;
					var to = !bondConnection && frag.bonds[i].to == 0 ? scope.getIndex() :
							this.tool.tmp.frag.atoms[frag.bonds[i].to].i;
					var bond = new MPBond({
						i: this.molecule.bonds.length,
						type: frag.bonds[i].type,
						stereo: MP_STEREO_NONE,
						from: from,
						to: to
					});

					this.molecule.atoms[bond.getFrom()].addBond(bond.getIndex());
					this.molecule.atoms[bond.getTo()].addBond(bond.getIndex());
					this.molecule.bonds.push(bond);
					this.tool.tmp.frag.bonds[i].i = bond.getIndex();
					bond.update(this);
				}

				if(bondConnection)
				{
					var connection = new MPBond({
						i: this.molecule.bonds.length,
						type: MP_BOND_SINGLE,
						stereo: MP_STEREO_NONE,
						from: scope.getIndex(),
						to: this.tool.tmp.frag.atoms[0].i
					});

					scope.addBond(connection.getIndex());
					this.molecule.atoms[connection.getTo()].addBond(connection.getIndex());
					this.molecule.bonds.push(connection);
					connection.update(this);
				}

				this.redraw();
			},
			onPointerMove: function(e)
			{
				e.preventDefault();
				var p = this.getRelativeCoords(getPointerCoords(e));

				if(!pointInsideCircle(p, scope.getPosition(),
						this.settings.atom.minAddRotateLength))//rotate around
				{
					var a = clampedAngle(this.tool.tmp.startAngle, scope.getPosition(),
							p, this.settings.bond.rotateSteps);

					if(a != this.tool.tmp.currentAngle)
					{
						var frag = MPFragments.rotate(this.tool.tmp.frag, scope.getPosition(),
								findAngleBetween(a, this.tool.tmp.currentAngle));
						this.tool.tmp.currentAngle = a;//after rotate or arot = 0

						for(var _i = 0; _i < this.tool.tmp.frag.atoms.length; _i++)
						{
							var i = frag.atoms[_i].i;
							if(i === undefined) continue;
							this.molecule.atoms[i].setPosition({
								x: frag.atoms[_i].x,
								y: frag.atoms[_i].y
							});
							this.molecule.atoms[i].update(this);
							this.molecule.atoms[i].updateBonds(this);
						}

						this.redraw();
					}
				}
			},
			onPointerUp: function(e)
			{
				//TODO: merge into exisiting atoms
				scope.setDisplay(e.type == "mouseup" ? "hover" : "normal");
				this.redraw();
			}
		};
	}
	else if(mp.tool.type == "charge")
	{
		return {
			onPointerDown: function(e)
			{
				e.preventDefault();
				scope.setCharge(scope.getCharge() + this.tool.data.charge);
				scope.update(this);
				scope.updateBonds(this);//because of modified width in certain cases
				this.redraw();
			},
			onPointerUp: function(e)
			{
				this.setCursor("pointer");
				scope.setDisplay(e.type == "mouseup" ? "hover" : "normal");
				this.redraw();
			}
		};
	}
	else if(mp.tool.type == "erase")
	{
		return {
			onPointerDown: function(e)
			{
				e.preventDefault();
				this.removeAtom(scope.getIndex());
				this.redraw(true);
			},
			onPointerUp: function(e)
			{
				this.setCursor("pointer");
				scope.setDisplay(e.type == "mouseup" ? "hover" : "normal");
				this.redraw();
			}
		};
	}
	else//drag, fallback
	{
		return {
			onPointerMove: function(e)
			{
				e.preventDefault();
				this.setCursor("move");
				var p = this.getRelativeCoords(getPointerCoords(e));

				scope.translate(p.x - this.pointer.oldr.x, p.y - this.pointer.oldr.y);
				scope.update(this);
				scope.updateBonds(this);

				this.pointer.oldr.x = p.x;
				this.pointer.oldr.y = p.y;
				this.redraw();
			},
			onPointerUp: function(e)
			{
				this.setCursor("pointer");
				scope.setDisplay(e.type == "mouseup" ? "hover" : "normal");
				this.redraw();
			}
		};
	}
}

MPAtom.prototype.handle = function(mp, point, type)
{
	var line = this.getCenterLine();
	var r = mp.settings.atom.radius * mp.settings.atom.scale;

	if(line.area.point)
	{
		if(fastPointInCircleBox(point, line.area.point, r))
		{
			if(pointInsideCircle(point, line.area.point, r))
			{
				return { hit: true, redraw: this.setDisplay(type) };
			}
		}
	}
	else
	{
		if(fastPointInLineBox(point, line.area.left, line.area.right, r))
		{
			var d = pointToLineDistance(point, line.area.left, line.area.right)
			if(d <= r)
			{
				return { hit: true, redraw: this.setDisplay(type) };
			}
		}
	}

	return { hit: false, redraw: this.setDisplay("normal") };
}

/**
 * Helpers
 */

/**
 * Adds new bond to this atom using the given element and angle
 * Does not redraw the canvas
 * @param  {MolPad} mp
 * @param  {Object} config { element, a, type, stereo }
 * @return {Object}        Tool data for this bond
 */
MPAtom.prototype.addNewBond = function(mp, config)
{
	var atom = new MPAtom({
		i: mp.molecule.atoms.length,
		x: this.getX() + (config.length || mp.settings.bond.length) * Math.cos(config.a),
		y: this.getY() - (config.length || mp.settings.bond.length) * Math.sin(config.a),//y axis is flipped
		element: config.element || "C"
	});

	var bond = new MPBond({
		i: mp.molecule.bonds.length,
		type: config.type || MP_BOND_SINGLE,
		stereo: config.stereo || MP_STEREO_NONE,
		from: this.index,
		to: atom.getIndex()
	});

	atom.addBond(bond.getIndex());
	this.addBond(bond.getIndex());

	mp.molecule.atoms.push(atom);
	mp.molecule.bonds.push(bond);
	atom.update(mp);
	this.update(mp);
	this.updateBonds(mp);

	return {
		atom: atom.getIndex(),
		bond: bond.getIndex(),
		startAngle: config.a,
		currentAngle: config.a
	};
}

/**
 * Rotates atom around this.position using point and mp.tool.tmp.startAngle
 * Does not redraw the canvas
 * @param  {MolPad}  mp
 * @param  {Object}  point Rotation target point
 * @param  {Integer} atom  Atom index
 * @param  {Boolean} force Force angel refresh
 * @return {Boolean}       Indicates if atom angle has changed
 */
MPAtom.prototype.rotateAtomAround = function(mp, point, atom, force)
{
	var a = clampedAngle(mp.tool.tmp.startAngle, this.position,
			point, mp.settings.bond.rotateSteps);

	if(a != mp.tool.tmp.currentAngle || force)
	{
		mp.tool.tmp.currentAngle = a;
		mp.molecule.atoms[atom].setPosition({
			x: this.getX() + mp.settings.bond.length * Math.cos(a),
			y: this.getY() - mp.settings.bond.length * Math.sin(a)//y axis is flipped
		});
		mp.molecule.atoms[atom].update(mp);
		mp.molecule.atoms[atom].updateBonds(mp);

		return true;
	}
	else
	{
		return false;
	}
}

/**
 * Calculations
 */

MPAtom.prototype.equals = function(atom)
{
	return this.index == atom.getIndex();
}

MPAtom.prototype.updateBonds = function(mp, not)
{
	//TODO: prevent double update

	for(var i = 0; i < this.bonds.length; i++)
	{
		if(not && mp.molecule.bonds[this.bonds[i]].equals(not)) continue;
		mp.molecule.bonds[this.bonds[i]].update(mp);
	}
}

MPAtom.prototype.update = function(mp)
{
	this.line = this.calculateCenterLine(mp);
}

MPAtom.prototype.calculateNewBondAngle = function(mp, n)
{
	if(this.bonds.length == 0) return 0;

	//create bond map with bond angles
	var bondMap = [];
	for(var i = 0; i < this.bonds.length; i++)
	{
		bondMap.push({
			i: this.bonds[i],
			a: mp.molecule.bonds[this.bonds[i]].getAngle(mp, this)
		});
	}

	//sort bondMap in ascending bond angle order
	bondMap.sort(function(a, b)
	{
		return a.a - b.a;
	});

	//convert bondMap to sections
	var sections = [];
	for(var i = 0; i < bondMap.length; i++)
	{
		var from = i == 0 ? bondMap.length - 1 : i - 1;
		var to = i;
		sections.push({
			from: from,
			to: to,
			a: findAngleBetween(bondMap[from].a, bondMap[to].a)
		});
	}

	//find larges section
	var largest = 0;//skip i = 0 since it is already used for the first comparison
	for(var i = 1; i < sections.length; i++)
	{
		if(sections[i].a > sections[largest].a)
		{
			largest = i;
		}
	}

	//find new bond angle
	if(n === undefined)
	{
		return bondMap[sections[largest].from].a + sections[largest].a / 2;
	}
	else
	{
		var p = n !== undefined ? n + 1 : 2;
		var a = sections[largest].a / (n + 1);
		var ret = [];
		for(var i = 1; i <= n; i++)
		{
			ret.push(bondMap[sections[largest].from].a + i * a);
		}
		return ret;
	}
}

/**
 * Returns MPAtom area as a line with a surrounding area defined by a radius
 * (area border: d(P, line) = r) + label drawing box
 * @return {Object} Area line or point:
 *                  { from: { x: 0, y: 0 }} or
 *                  { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }
 *                  Label drawing box:
 *                  { offsetLeft: 0, offsetTop: 0 }
 */
MPAtom.prototype.calculateCenterLine = function(mp)
{
	if(mp.settings.atom.miniLabel)
	{
		return {
			text: { offsetLeft: 0, offsetTop: 0 },
			area: { point: this.position }
		};
	}

	var scale = mp.settings.atom.scale;
	var text = {};

	this.setFont(mp, "label");
	text.labelWidth = this.isVisible(mp) ? mp.ctx.measureText("" + this.element).width : 0;
	var w = text.labelWidth;

	if(this.isotope > 0)
	{
		this.setFont(mp, "isotope");
		text.isotopeHeight = mp.settings.atom.isotope.fontSize * scale;
		text.isotopeWidth = mp.ctx.measureText("" + this.isotope).width +
				mp.settings.atom.isotope.pad * scale;
		w += text.isotopeWidth;
	}

	if(this.charge != 0)
	{
		this.setFont(mp, "charge");
		text.chargeHeight = mp.settings.atom.charge.fontSize * scale;
		text.chargeWidth = mp.ctx.measureText("" + this.getChargeLabel()).width;
		text.labelWidth += mp.settings.atom.isotope.pad * scale;
		w += text.chargeWidth + mp.settings.atom.isotope.pad * scale;
	}

	var h = mp.settings.atom.label.fontSize * scale;
	var halfw = w / 2;
	text.offsetLeft = -halfw;
	text.offsetTop = h / 2;

	if(w > mp.settings.atom.circleClamp)
	{
		var pad = mp.settings.atom.radius * scale - h / 2;
		return {
			text: text,
			area: {
				half: halfw + pad,
				left: { x: this.position.x - halfw + pad, y: this.position.y },
				right: { x: this.position.x + halfw - pad, y: this.position.y }
			}
		};
	}
	else
	{
		return {
			text: text,
			area: { point: this.position }
		};
	}
}

/**
 * Calculate bond attach vertices for a bond from $begin to $this.position
 * @param  {CanvasRenderingContext2D}
 * @param  {Object}
 * @param  {Object}
 * @param  {Object} begin Beginning of line
 * @param  {Array}  ends  Requested end vertices perpendicular to the end of line $begin$this.position
 *                        (values are in counter clockwise direction)
 * @return {Array}        Calculated ends
 */
MPAtom.prototype.calculateBondVertices = function(mp, begin, ends)
{
	var line = this.getCenterLine();

	//TODO: implement bonding site for collapsed groups (only left or right)

	if(begin.x == this.position.x)
	{
		var ret = [];
		var r = this.isVisible(mp) ? mp.settings.atom.radius : 0;
		var below = begin.y < this.position.y;
		for(var i = 0; i < ends.length; i++)
		{
			ret.push({
				x: this.position.x + (below ? ends[i] : -ends[i]),//counter clockwise
				y: this.position.y + (below ? -r : r)
			});
		}
		return ret;
	}
	else if(begin.y == this.position.y)
	{
		var ret = [];
		var r = this.isVisible(mp) ? line.area.half  || mp.settings.atom.radius : 0;
		var right = begin.x > this.position.x;
		for(var i = 0; i < ends.length; i++)
		{
			ret.push({
				x: this.position.x + (right ? r : -r),
				y: this.position.y + (right ? ends[i] : -ends[i])//counter clockwise
			});
		}
		return ret;
	}
	else if(!this.isVisible(mp))
	{
		/**
		 * TODO: implement full skeleton display
		 * double/triple bonds inside ring
		 * wedge bonds perfect fit
		 */

		if(ends.length == 1 && ends[0] == 0)
		{
			return [{ x: this.position.x, y: this.position.y }];
		}
		else
		{
			var dx = begin.x - this.position.x;
			var dy = begin.y - this.position.y;
			var d = Math.sqrt(dx * dx + dy * dy);
			var A = dx / d;//dx = a = A * c = d
			var B = dy / d;//dy = b = B * c = d

			var ret = [];
			for(var i = 0; i < ends.length; i++)
			{
				ret.push({
					x: -B * ends[i],
					y: A * ends[i]
				});
			}

			//TODO: perfect fit for double/triple bond

			//translate to real position
			for(var i = 0; i < ret.length; i++)
			{
				ret[i].x += this.position.x;
				ret[i].y += this.position.y;
			}

			return ret;
		}
	}
	else
	{
		/**
		 * Super awesome MATH!!
		 */

		var ac = this.position;//aligin center
		var bc = this.position;//bond center
		var tdir = 1;//tangent direction

		if(line.area.left && begin.x < this.position.x)
		{
			ac = line.area.left;
		}
		else if(line.area.right && begin.x > this.position.x)
		{
			ac = line.area.right;
			tdir = -1;
		}

		var acbc = Math.abs(ac.x - bc.x);//distance between align center and bond center
		var r = mp.settings.atom.radius;
		var dx = begin.x - bc.x;
		var dy = begin.y - bc.y;
		var d = Math.sqrt(dx * dx + dy * dy);
		var A = dx / d;//dx = a = A * c = d
		var B = dy / d;//dy = b = B * c = d

		//alignCenter tangent crossing with bond line
		var td = (tdir > 0 ? r - A * acbc : r + A * acbc);
		var tx = A * td;
		var ty = B * td;

		var x = bc.x + tx;
		var y = bc.y + ty;

		var ret = [];
		for(var i = 0; i < ends.length; i++)
		{
			ret.push({
				x: x - B * ends[i],
				y: y + A * ends[i]
			});
		}
		return ret;
	}
}

MPAtom.prototype.isVisible = function(mp)
{
	if(this.display == "hidden")
	{
		return false;
	}
	else if(mp.settings.drawSkeletonFormula)
	{
		if(this.element == "C")
		{
			var singleBonds = 0;
			if(this.bonds.length == 0) return true;
			else if(this.bonds.length == 2 &&
				mp.molecule.bonds[this.bonds[0]].getType() ==
				mp.molecule.bonds[this.bonds[1]].getType() &&
				mp.molecule.bonds[this.bonds[0]].getType() != MP_BOND_SINGLE)
			{
				return true;
			}
			else return false;
		}
		return true;
	}
	else return true;
}

/**
 * Render methods
 */

MPAtom.prototype.setFont = function(mp, type)
{
	var font = mp.settings.atom[type].fontStyle + " " +
			Math.round((mp.settings.atom[type].fontSize
				* mp.settings.atom.scale) * 96 / 72) + "px " +
			mp.settings.atom[type].fontFamily;

	if(font != mp.ctx.font)
	{
		mp.ctx.font = font;
	}
}

MPAtom.prototype.drawStateColor = function(mp)
{
	if(this.display == "hover" || this.display == "active" || this.display == "selected")
	{
		var line = this.getCenterLine();

		mp.ctx.beginPath();
		if(line.area.point)
		{
			mp.ctx.arc(line.area.point.x, line.area.point.y,
					mp.settings.atom.radius * mp.settings.atom.scale,
					0, 2 * Math.PI);
			mp.ctx.fillStyle = mp.settings.atom[this.display].color;
			mp.ctx.fill();
		}
		else
		{
			mp.ctx.moveTo(line.area.left.x, line.area.left.y);
			mp.ctx.lineTo(line.area.right.x, line.area.right.y);
			mp.ctx.strokeStyle = mp.settings.atom[this.display].color;
			mp.ctx.stroke();
		}
	}
}

MPAtom.prototype.getChargeLabel = function()
{
	return this.charge == 0 ? "" :
		this.charge == -1 ? "\u2212" :
		this.charge ==  1 ? "+" :
			(this.charge > 1 ? "+" : "-") + Math.abs(this.charge);
}

MPAtom.prototype.drawLabel = function(mp)
{
	//TODO: add support for collapsed groups (CH2- to H2C-, OH- to HO-, etc.)
	//TODO: add support for charge and isotope display

	if(this.isVisible(mp))
	{
		var line = this.getCenterLine();

		if(mp.settings.atom.colored)
		{
			mp.ctx.fillStyle = JmolAtomColorsHashHex[this.element];
		}

		if(mp.settings.atom.miniLabel)
		{
			var s = mp.settings.atom.miniLabelSize;
			mp.ctx.fillRect(this.position.x - s / 2, this.position.y - s / 2, s, s);
		}
		else
		{
			var x = this.position.x + line.text.offsetLeft;

			if(this.isotope > 0)
			{
				this.setFont(mp, "isotope");
				mp.ctx.fillText("" + this.isotope, x, this.position.y +
						line.text.offsetTop - line.text.isotopeHeight);
				x += line.text.isotopeWidth;
			}

			this.setFont(mp, "label");
			mp.ctx.fillText("" + this.element, x, this.position.y + line.text.offsetTop);
			x += line.text.labelWidth;

			if(this.charge != 0)
			{
				this.setFont(mp, "charge");
				mp.ctx.fillText(this.getChargeLabel(), x, this.position.y +
						line.text.offsetTop - line.text.chargeHeight);
			}
		}
	}
}
