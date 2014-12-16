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

MolPad.prototype.onScroll = function(delta)
{
	var s = 1 + this.settings.zoomSpeed * delta;
	if(this.matrix[0] * s < this.settings.minZoom) s = this.settings.minZoom / this.matrix[0];
	this.scaleAbsolute(s, this.width() / 2, this.height() / 2);
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

	if(oe.targetTouches && oe.targetTouches.length > 1)
	{
		this.pointer.targetTouchesNumber = oe.targetTouches.length;
		this.pointer.touchGrab = true;

		if(this.hasChanged)
		{
			this.hasChanged = false;
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

			if(this.pointer.handler !== undefined)
			{
				this.saveToStack();
			}
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
	this.hasChanged = false;

	if(this.pointer.handler)
	{
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

		if(this.pointer.handler.onPointerUp)
		{
			this.pointer.handler.onPointerUp.call(this, e);
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
			this.pointer.old.x = new MPPoint().fromPointer(e);
			this.pointer.handler = this.mouseDragHandler;
		}
		else if(oe.targetTouches.length == 0)
		{
			this.pointer.handler = undefined;
		}
	}
	else
	{
		this.pointer.handler = undefined;
	}
}

MolPad.prototype.onBlur = function(e)
{
	this.dismissHandler();
}

MolPad.prototype.dismissHandler = function()
{
	this.resetEventDisplay();
	this.hasChanged = false;
	this.setCursor("default");
	this.pointer.targetTouchesNumber = 0;
	this.pointer.handler = undefined;
	this.validate();
}

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
		var redraw = false;
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

//TODO: fully implement selection tool
MolPad.prototype.selectionToolHandler = {
	onPointerDown: function(e)
	{
		this.setCursor("pointer");
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
				points: [{
					x: p.x,
					y: p.y
				}]
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
		}
		else//lasso
		{
			this.tool.tmp.points.push(p);
		}

		this.redraw();
	},
	onPointerUp: function(e)
	{
		this.tool.tmp = {};
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
				this.saveToStack();

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
				this.saveToStack();

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
				this.saveToStack();

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
