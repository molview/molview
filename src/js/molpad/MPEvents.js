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

MolPad.prototype.onScroll = function(delta)
{
	var s = 1 + this.settings.zoomSpeed * delta;

	if(this.matrix[0] * s < this.settings.minZoom) s = this.settings.minZoom / this.matrix[0];

	var center = new MPPoint();
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		center.add(this.molecule.atoms[i].center);
	}
	center.divide(this.molecule.atoms.length);

	/*
	Transform center into absolute point
	relative pointer transformations:
	this.x = (this.x - mpctx.offset.left) * mpctx.devicePixelRatio;
	this.y = (this.y - mpctx.offset.top) * mpctx.devicePixelRatio;
	this.x = (this.x - mpctx.matrix[4]) / mpctx.matrix[0];
	this.y = (this.y - mpctx.matrix[5]) / mpctx.matrix[3];
	 */
	center.multiplyX(this.matrix[0]);
	center.multiplyY(this.matrix[3]);
	center.addX(this.matrix[4]);
	center.addY(this.matrix[5]);
	center.divide(this.devicePixelRatio);

	this.scaleAbsolute(s, center.x, center.y);
	this.redraw(true);
}

MolPad.prototype.onPointerDown = function(e)
{
	if(e.type == "mousedown" && this.pointer.targetTouchesNumber == 0)
	{
		this.pointer.touchGrab = false;
	}
	else if(e.type == "mousedown" && this.pointer.touchGrab)
	{
		return;
	}

	var oe = e.originalEvent;
	this.pointer.old.p.fromPointer(e);
	this.pointer.old.r.fromRelativePointer(e, this);

	if(["erase", "drag", "select"].indexOf(this.tool.type) == -1)
	{
		this.clearToolData();
	}

	if(oe.targetTouches && oe.targetTouches.length > 1)
	{
		this.pointer.targetTouchesNumber = oe.targetTouches.length;
		this.pointer.touchGrab = true;

		if(this.isChanged())
		{
			this.undo(true);
		}

		this.pointer.old.c.fromMultiTouchCenter(e);
		this.pointer.old.d = getMultiTouchDelta(e);
		this.pointer.handler = this.multiTouchHandler;
	}
	else if(e.which == 1 || (oe.targetTouches && oe.targetTouches.length == 1))
	{
		this.pointer.handler = undefined;

		this.handleEvent(this.pointer.old.r, "active", function(obj)
		{
			this.pointer.handler = obj.getHandler(this);
		});

		if(this.pointer.handler == undefined)
		{
			this.pointer.handler = this.getHandler();
		}

		if(this.pointer.handler && this.pointer.handler.onPointerDown)
		{
			this.pointer.handler.onPointerDown.call(this, e);
			this.validate();
		}
	}
	else if(e.which == 2)
	{
		this.pointer.handler = this.mouseDragHandler;
	}

	this.validate();
}

MolPad.prototype.onMouseMoveInContainer = function(e)
{
	if(this.pointer.touchGrab)
	{
		return;//dimiss mouse events if touch is active
	}

	if(this.pointer.handler === undefined)
	{
		this.hoverHandler.onPointerMove.call(this, e);
	}
}

MolPad.prototype.onMouseOut = function(e)
{
	if(this.pointer.handler === undefined)
	{
		this.forAllObjects(function(obj){ obj.setDisplay("normal"); });
		this.setCursor("default");
		this.validate();
	}
}

MolPad.prototype.onPointerMove = function(e)
{
	if(e.type == "mousemove" && this.pointer.touchGrab)
	{
		return;//dimiss mouse events if touch is active
	}

	if(this.pointer.handler && this.pointer.handler.onPointerMove)
	{
		this.pointer.handler.onPointerMove.call(this, e);
		this.validate();
	}
}

MolPad.prototype.onPointerUp = function(e)
{
	if(e.type == "mouseup" && this.pointer.touchGrab)
	{
		return;//dimiss mouse events if touch is active
	}

	var oe = e.originalEvent;

	if(this.pointer.handler)
	{
		if(this.pointer.handler.onPointerUp)
		{
			this.pointer.handler.onPointerUp.call(this, e);
		}

		if(this.pointer.handler.scope)
		{
			this.setCursor("pointer");
			this.resetEventDisplay();
			this.pointer.handler.scope.setDisplay(
					e.type == "mouseup" ? "hover" : "normal");
		}
		else
		{
			this.setCursor("default");
		}

		this.validate();
	}
	else
	{
		this.setCursor("default");
	}

	//only one multi-touch pointer left: switch to dragHandler
	if(oe.targetTouches)
	{
		this.pointer.targetTouchesNumber = oe.targetTouches.length;

		if(oe.targetTouches.length == 1)
		{
			//reset old pointer for smooth multi to single transition
			this.pointer.old.p = new MPPoint().fromPointer(e);
			this.pointer.old.r.fromRelativePointer(e, this);
			this.pointer.handler = this.mouseDragHandler;
		}
		else if(oe.targetTouches.length == 0)
		{
			this.pointer.handler = undefined;
			this.updateCopy();
		}
	}
	else
	{
		this.pointer.handler = undefined;
		this.updateCopy();
	}
}

MolPad.prototype.onBlur = function(e)
{
	this.dismissHandler();
}

/**
 * Template function for handling simple events
 * @param {MPPoint}  point    Event origin
 * @param {String}   type     Trigger type: hover || active
 * @param {Function} callback Callback for hits
 */
MolPad.prototype.handleEvent = function(point, type, callback)
{
	var completed = false;
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		if(completed)
		{
			this.molecule.atoms[i].setDisplay("normal");
		}
		else if(this.molecule.atoms[i].handle(point, type))
		{
			completed = true;
			callback.call(this, this.molecule.atoms[i]);
		}
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		if(completed)
		{
			this.molecule.bonds[i].setDisplay("normal");
		}
		else if(this.molecule.bonds[i].handle(point, type))
		{
			completed = true;
			callback.call(this, this.molecule.bonds[i]);
		}
	}
}

/**
 * Clears all temporary tool data
 */
MolPad.prototype.clearToolData = function()
{
	//clear selection
	for(var i = 0; i < this.tool.selection.length; i++)
	{
		if(this.tool.selection[i] > this.molecule.atoms.length)
		{
			this.tool.selection.splice(i, 1);
			i--;
		}
		else
		{
			this.molecule.atoms[this.tool.selection[i]].select(false);
			i--;
		}
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		this.molecule.bonds[i].select(false);
	}

	//clear tmp
	this.tool.tmp = {};
}

/**
 * Resets the current handler
 */
MolPad.prototype.dismissHandler = function()
{
	this.resetEventDisplay();
	this.clearToolData();
	this.setCursor("default");
	this.pointer.targetTouchesNumber = 0;
	this.pointer.handler = undefined;
	this.validate();
	this.updateCopy();
}

/**
 * Resets display to normal for all atoms and bonds
 */
MolPad.prototype.resetEventDisplay = function()
{
	this.forAllObjects(function(obj){ obj.setDisplay("normal"); });
}

/**
 * Event handlers
 */

MolPad.prototype.hoverHandler = {
	onPointerMove: function(e)
	{
		e.preventDefault();
		this.setCursor("default");
		var p = new MPPoint().fromRelativePointer(e, this);

		this.handleEvent(p, "hover", function(obj)
		{
			this.setCursor("pointer");
		});

		this.validate();
	}
}

MolPad.prototype.mouseDragHandler = {
	onPointerMove: function(e)
	{
		this.setCursor("move");
		e.preventDefault();
		var p = new MPPoint().fromPointer(e);

		if(p.equals(this.pointer.old)) return;
		this.translate((p.x - this.pointer.old.p.x) * this.devicePixelRatio,
					   (p.y - this.pointer.old.p.y) * this.devicePixelRatio);

		this.pointer.old.p = p;
		this.invalidate();
	},
	onPointerUp: function(e)
	{
		this.setCursor("default");
	}
}

MolPad.prototype.multiTouchHandler = {
	onPointerMove: function(e)
	{
		e.preventDefault();
		var c = new MPPoint().fromMultiTouchCenter(e);
		var d = getMultiTouchDelta(e);

		this.translate((c.x - this.pointer.old.c.x) * this.devicePixelRatio,
					   (c.y - this.pointer.old.c.y) * this.devicePixelRatio);

		this.scaleAbsolute(d / this.pointer.old.d,
			(c.x - this.offset.left) * this.devicePixelRatio,
			(c.y - this.offset.top) * this.devicePixelRatio);

		this.pointer.old.c = c;
		this.pointer.old.d = d;
		this.pointer.old.p.fromPointer(e);//transites smoothly to mouseDragHandler
		this.redraw(true);
	}
}

MolPad.prototype.selectionToolHandler = {
	onPointerDown: function(e)
	{
		this.setCursor("pointer");
		this.clearToolData();
		var p = new MPPoint().fromRelativePointer(e, this);

		if(this.tool.data.type == "rect")
		{
			this.tool.tmp = {
				rect: {
					x: p.x,
					y: p.y,
					width: 0,
					height: 0
				}
			};
		}
		else//lasso
		{
			this.tool.tmp = {
				points: [p.clone()]
			};
		}
	},
	onPointerMove: function(e)
	{
		e.preventDefault();
		this.setCursor("default");
		var p = new MPPoint().fromRelativePointer(e, this);

		if(this.tool.data.type == "rect")
		{
			this.tool.tmp.rect.width = p.x - this.tool.tmp.rect.x;
			this.tool.tmp.rect.height = p.y - this.tool.tmp.rect.y;

			//refresh selection
			for(var i = 0; i < this.molecule.atoms.length; i++)
			{
				this.molecule.atoms[i].handleRectSelect(this.tool.tmp.rect);
			}
		}
		else//lasso
		{
			this.tool.tmp.points.push(p);

			//refresh selection
			for(var i = 0; i < this.molecule.atoms.length; i++)
			{
				this.molecule.atoms[i].handlePolygonSelect(this.tool.tmp.points);
			}
		}

		//refresh bond display style
		for(var i = 0; i < this.molecule.bonds.length; i++)
		{
			this.molecule.bonds[i].handleSelect();
		}

		this.redraw();
	},
	onPointerUp: function()
	{
		//check if selection is rotatable
		var v = [];
		for(var i = 0; i < this.tool.selection.length; i++)
		{
			if(this.molecule.atoms[this.tool.selection[i]].hasUnselectedNeighbors())
			{
				v.push(this.tool.selection[i]);
			}
		}

		if(v.length == 1 && this.tool.selection.length > 1)
		{
			this.tool.tmp = {
				centerAtom: v[0],
				rotationCenter: this.molecule.atoms[v[0]].center
			};
		}
		else
		{
			this.tool.tmp = {};//clear previous rotation center
		}

		this.redraw();
	}
}

MolPad.prototype.getHandler = function()
{
	if(this.tool.type == "atom")
	{
		return {
			onPointerDown: function(e)
			{
				var p = new MPPoint().fromRelativePointer(e, this);
				var atom = new MPAtom(this, {
					i: this.molecule.atoms.length,
					x: p.x,
					y: p.y,
					element: this.tool.data.element
				});
				this.molecule.atoms.push(atom);

				this.pointer.handler.scope = atom;
			}
		};
	}
	else if(this.tool.type == "bond")
	{
		return {
			onPointerDown: function(e)
			{
				var p = new MPPoint().fromRelativePointer(e, this);

				var atom1 = new MPAtom(this, {
					i: this.molecule.atoms.length,
					x: p.x - this.settings.bond.length / 2,
					y: p.y,
					element: "C"
				});
				this.molecule.atoms.push(atom1);

				var atom2 = new MPAtom(this, {
					i: this.molecule.atoms.length,
					x: p.x + this.settings.bond.length / 2,
					y: p.y,
					element: "C"
				});
				this.molecule.atoms.push(atom2);

				var bond = new MPBond(this, {
					i: this.molecule.bonds.length,
					from: atom1.index,
					to: atom2.index,
					type: this.tool.data.type,
					stereo: this.tool.data.stereo
				});
				this.molecule.bonds.push(bond);

				atom1.addBond(bond.index);
				atom2.addBond(bond.index);

				this.pointer.handler.scope = bond;
			}
		};
	}
	else if(this.tool.type == "fragment")
	{
		return {
			onPointerDown: function(e)
			{
				var p = new MPPoint().fromRelativePointer(e, this);

				var frag = MPFragments.translate(
						MPFragments.scale(MPFragments.clone(this.tool.data.frag.full),
							this.settings.bond.length),
							p.x, p.y);

				this.createFragment(frag);
			}
		};
	}
	else if(this.tool.type == "select")
	{
		return this.selectionToolHandler;
	}
	else
	{
		return this.mouseDragHandler;
	}
}
