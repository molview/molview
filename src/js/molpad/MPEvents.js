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

MolPad.prototype.onScroll = function(delta, e)
{
	var s = 1 + this.settings.zoomSpeed * delta;
	if(this.matrix[0] * s < this.settings.minZoom) s = this.settings.minZoom / this.matrix[0];
	var p = new MPPoint().fromPointer(e);
	p.x -= this.offset.left;
	p.y -= this.offset.top;

	/*
	Transform center into absolute point
	relative pointer transformations:
	this.x = (this.x - mpctx.offset.left) * mpctx.devicePixelRatio;
	this.y = (this.y - mpctx.offset.top) * mpctx.devicePixelRatio;
	this.x = (this.x - mpctx.matrix[4]) / mpctx.matrix[0];
	this.y = (this.y - mpctx.matrix[5]) / mpctx.matrix[3];
	 */

	/*
	var center = new MPPoint();
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		center.add(this.molecule.atoms[i].center);
	}
	center.divide(this.molecule.atoms.length);
	center.multiplyX(this.matrix[0]);
	center.multiplyY(this.matrix[3]);
	center.addX(this.matrix[4]);
	center.addY(this.matrix[5]);
	center.divide(this.devicePixelRatio);
	this.scaleAbsolute(s, center.x, center.y);
	*/

	var f = 0.8;
	var hw = this.container.width() / 2, hh = this.container.height() / 2;
	this.scaleAbsolute(s, hw - (hw - p.x) * f, hh - (hh - p.y) * f);
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

	if(!oneOf(this.tool.type, ["erase", "select",  "drag"]))
	{
		this.clearToolData();
	}

	if(oe.targetTouches && oe.targetTouches.length > 1)
	{
		//simulate pointer up for old single pointer handler
		if(this.pointer.handler && this.pointer.handler.onPointerUp)
		{
			this.pointer.handler.onPointerUp(e, this);
		}
		//undo single pointer changes
		if(this.isChanged())
		{
			this.undo(true);
		}

		this.pointer.targetTouchesNumber = oe.targetTouches.length;
		this.pointer.touchGrab = true;
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
			this.pointer.handler.onPointerDown(e, this);
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
		this.hoverHandler.onPointerMove(e, this);
	}
}

MolPad.prototype.onMouseOut = function(e)
{
	if(this.pointer.handler === undefined)
	{
		this.resetEventDisplay();
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
		this.pointer.handler.onPointerMove(e, this);
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
			this.pointer.handler.onPointerUp(e, this);
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

	this.tool.rotationCenter = {};
}

/**
 * Resets the current handler
 * This will terminate the active handler
 * instead of finishing the current action
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
	onPointerMove: function(e, mp)
	{
		e.preventDefault();
		mp.setCursor("default");
		var p = new MPPoint().fromRelativePointer(e, mp);

		mp.handleEvent(p, "hover", function(obj)
		{
			mp.setCursor("pointer");
		});

		mp.validate();
	}
}

MolPad.prototype.mouseDragHandler = {
	data: {},
	onPointerMove: function(e, mp)
	{
		mp.setCursor("move");
		e.preventDefault();
		var p = new MPPoint().fromPointer(e);
		this.data.moved = true;

		if(p.equals(mp.pointer.old)) return;
		mp.translate((p.x - mp.pointer.old.p.x) * mp.devicePixelRatio,
					 (p.y - mp.pointer.old.p.y) * mp.devicePixelRatio);

		mp.pointer.old.p = p;
		mp.invalidate();
	},
	onPointerUp: function(e, mp)
	{
		if(!this.data.moved)
		{
			mp.clearToolData();
		}

		mp.setCursor("default");
	}
}

MolPad.prototype.multiTouchHandler = {
	onPointerMove: function(e, mp)
	{
		e.preventDefault();
		var c = new MPPoint().fromMultiTouchCenter(e);
		var d = getMultiTouchDelta(e);

		mp.translate((c.x - mp.pointer.old.c.x) * mp.devicePixelRatio,
					 (c.y - mp.pointer.old.c.y) * mp.devicePixelRatio);

		mp.scaleAbsolute(d / mp.pointer.old.d,
			(c.x - mp.offset.left) * mp.devicePixelRatio,
			(c.y - mp.offset.top) * mp.devicePixelRatio);

		mp.pointer.old.c = c;
		mp.pointer.old.d = d;
		mp.pointer.old.p.fromPointer(e);//transites smoothly to mouseDragHandler
		mp.redraw(true);
	}
}

MolPad.prototype.selectionToolHandler = {
	data: {},
	onDraw: function(mp)
	{
		mp.ctx.fillStyle = mp.settings.select.fillStyle;
		mp.ctx.strokeStyle = mp.settings.select.strokeStyle;
		mp.ctx.lineWidth = mp.settings.select.lineWidth / mp.getScale();
		mp.ctx.lineCap = mp.settings.select.lineCap;
		mp.ctx.lineJoin = mp.settings.select.lineJoin;
		mp.ctx.setLineDash([
			2 / mp.getScale(),
			5 / mp.getScale()
		]);

		mp.ctx.beginPath();

		if(mp.tool.data.type == "rect" && this.data.rect)
		{
			mp.ctx.rect(this.data.rect.x, this.data.rect.y,
						this.data.rect.width, this.data.rect.height);

			mp.ctx.fill();
			mp.ctx.stroke();
		}
		else if(mp.tool.data.type == "lasso" && this.data.points)//lasso
		{
			for(var i = 0; i < this.data.points.length; i++)
			{
				if(i == 0) mp.ctx.moveTo(this.data.points[i].x, this.data.points[i].y);
				else mp.ctx.lineTo(this.data.points[i].x, this.data.points[i].y);
			}

			mp.ctx.mozFillRule = "evenodd";
			mp.ctx.msFillRule = "evenodd";
			mp.ctx.fillRule = "evenodd";
			mp.ctx.fill("evenodd");
			mp.ctx.stroke();
		}
	},
	onPointerDown: function(e, mp)
	{
		mp.setCursor("pointer");
		this.data = {};
		var p = new MPPoint().fromRelativePointer(e, mp);

		if(!mp.keys.ctrl)
		{
			mp.clearToolData();
			this.data.selectionAdd = [];
		}
		else
		{
			this.data.selectionAdd = mp.tool.selection.slice();
		}

		if(mp.tool.data.type == "rect")
		{
			this.data.rect = {
				x: p.x,
				y: p.y,
				width: 0,
				height: 0
			};
		}
		else//lasso
		{
			this.data.points = [p.clone()];
		}
	},
	onPointerMove: function(e, mp)
	{
		e.preventDefault();
		mp.setCursor("default");
		var p = new MPPoint().fromRelativePointer(e, mp);

		if(mp.tool.data.type == "rect")
		{
			this.data.rect.width = p.x - this.data.rect.x;
			this.data.rect.height = p.y - this.data.rect.y;

			//refresh selection
			for(var i = 0; i < mp.molecule.atoms.length; i++)
			{
				mp.molecule.atoms[i].handleRectSelect(this.data.rect);
			}
		}
		else//lasso
		{
			this.data.points.push(p);

			//refresh selection
			for(var i = 0; i < mp.molecule.atoms.length; i++)
			{
				mp.molecule.atoms[i].handlePolygonSelect(this.data.points);
			}
		}

		//select additional atoms
		for(var i = 0; i < this.data.selectionAdd.length; i++)
		{
			mp.molecule.atoms[this.data.selectionAdd[i]].select(true);
		}

		mp.updateBondSelection();
		mp.invalidate();
	},
	onPointerUp: function(e, mp)
	{
		mp.updateRotationCenter();
		mp.invalidate();
	}
}

MolPad.prototype.getHandler = function()
{
	if(this.tool.type == "atom")
	{
		return {
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);
				var atom = new MPAtom(mp, {
					i: mp.molecule.atoms.length,
					x: p.x,
					y: p.y,
					element: mp.tool.data.element
				});
				mp.molecule.atoms.push(atom);
				mp.pointer.handler.scope = atom;
			}
		};
	}
	else if(this.tool.type == "bond")
	{
		return {
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				var atom1 = new MPAtom(mp, {
					i: mp.molecule.atoms.length,
					x: p.x - mp.settings.bond.length / 2,
					y: p.y,
					element: "C"
				});
				mp.molecule.atoms.push(atom1);

				var atom2 = new MPAtom(mp, {
					i: mp.molecule.atoms.length,
					x: p.x + mp.settings.bond.length / 2,
					y: p.y,
					element: "C"
				});
				mp.molecule.atoms.push(atom2);

				var bond = new MPBond(mp, {
					i: mp.molecule.bonds.length,
					from: atom1.index,
					to: atom2.index,
					type: mp.tool.data.type,
					stereo: mp.tool.data.stereo
				});
				mp.molecule.bonds.push(bond);

				atom1.addBond(bond.index);
				atom2.addBond(bond.index);

				mp.pointer.handler.scope = bond;
			}
		};
	}
	else if(this.tool.type == "fragment")
	{
		return {
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				var frag = MPFragments.translate(
						MPFragments.scale(MPFragments.clone(mp.tool.data.frag.full),
							mp.settings.bond.length),
							p.x, p.y);

				mp.createFragment(frag);
			}
		};
	}
	else if(this.tool.type == "chain")
	{
		return {
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				var atom = new MPAtom(mp, {
					i: mp.molecule.atoms.length,
					x: p.x, y: p.y,
					element: "C"
				});
				mp.molecule.atoms.push(atom);
				mp.pointer.handler = atom.getHandler();
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
