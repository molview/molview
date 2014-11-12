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

MolPad.prototype.getRelativeCoords = function(p)
{
	p.x = (p.x - this.offset.left) * this.devicePixelRatio;
	p.y = (p.y - this.offset.top) * this.devicePixelRatio;
	p.x = (p.x - this.matrix[4]) / this.matrix[0];
	p.y = (p.y - this.matrix[5]) / this.matrix[3];
	return p;
}

MolPad.prototype.onScroll = function(delta)
{
	var s = 1 + this.settings.zoomSpeed * delta;
	if(this.matrix[0] * s < this.settings.minZoom) s = this.settings.minZoom / this.matrix[0];
	this.scaleAbsolute(s, this.width() / 2, this.height() / 2);
	this.update(true);
	this.redraw();
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
	var p = getPointerCoords(e);
	this.pointer.old = p;
	this.pointer.oldr = this.getRelativeCoords({ x: p.x, y: p.y });//deep copy
	this.forAllObjects(function(obj){ obj.resetState(); });

	if(oe.targetTouches && oe.targetTouches.length > 1)
	{
		this.pointer.targetTouchesNumber = oe.targetTouches.length;
		this.pointer.touchGrab = true;

		if(this.hasChanged)
		{
			this.hasChanged = false;
			this.undo(true);
		}

		this.pointer.oldc = getMultiTouchCenter(e);
		this.pointer.oldd = getMultiTouchDelta(e);
		this.pointer.handler = this.multiTouchHandler;
	}
	else if(e.which == 1 || (oe.targetTouches && oe.targetTouches.length == 1))
	{
		this.pointer.handler = undefined;

		this.forAllObjects(function(obj){ obj.resetState(); });
		this.forAllObjects(function(obj)
		{
			var result = obj.handle(this, this.pointer.oldr, "active");

			if(result.hit)
			{
				this.pointer.handler = obj.getHandler(this);

				if(this.pointer.handler !== undefined)
				{
					this.saveToStack();
				}

				if(this.pointer.handler && this.pointer.handler.onPointerDown)
				{
					this.pointer.handler.onPointerDown.call(this, e);
				}

				return true;
			}
		});

		if(this.pointer.handler == undefined)
		{
			this.pointer.handler = this.getHandler();

			if(this.pointer.handler.onPointerDown)
			{
				this.pointer.handler.onPointerDown.call(this, e);
			}
		}
	}
	else if(e.which == 2)
	{
		this.pointer.handler = this.mouseDragHandler;
	}

	this.redraw();
}

MolPad.prototype.onMouseMoveInContainer = function(e)
{
	if(this.pointer.touchGrab)
	{
		return;//dimiss mouse events if touch is active
	}

	if(this.pointer.handler == undefined)
	{
		this.hoverHandler.onPointerMove.call(this, e);
	}
}

MolPad.prototype.onMouseOut = function(e)
{
	var redraw = false;
	this.forAllObjects(function(obj){ redraw = obj.setState("normal") || redraw; });
	if(redraw) this.redraw();
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

	if(this.pointer.handler && this.pointer.handler.onPointerUp)
	{
		this.pointer.handler.onPointerUp.call(this, e);
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
			this.pointer.old = getPointerCoords(e);
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

/**
 * Event handlers
 */

MolPad.prototype.hoverHandler = {
	onPointerMove: function(e)
	{
		e.preventDefault();
		this.setCursor("default");
		var redraw = false;
		var p = this.getRelativeCoords(getPointerCoords(e));

		this.forAllObjects(function(obj){ obj.resetState(); });
		this.forAllObjects(function(obj)
		{
			var result = obj.handle(this, p, "hover");
			redraw = result.redraw || redraw;

			if(result.hit)
			{
				e.preventDefault();
				this.setCursor("pointer");
				if(result.redraw) this.redraw();
				return true;
			}
		});

		if(redraw) this.redraw();
	}
}

MolPad.prototype.mouseDragHandler = {
	onPointerMove: function(e)
	{
		this.setCursor("move");
		e.preventDefault();
		var p = getPointerCoords(e);

		if(p.x == this.pointer.old.x && p.y == this.pointer.old.y) return;
		this.translate((p.x - this.pointer.old.x) * this.devicePixelRatio,
					   (p.y - this.pointer.old.y) * this.devicePixelRatio);

		this.pointer.old = p;
		this.redraw();
	}
}

MolPad.prototype.multiTouchHandler = {
	onPointerMove: function(e)
	{
		e.preventDefault();
		var c = getMultiTouchCenter(e);
		var d = getMultiTouchDelta(e);

		this.translate((c.x - this.pointer.oldc.x) * this.devicePixelRatio,
					   (c.y - this.pointer.oldc.y) * this.devicePixelRatio);

		this.scaleAbsolute(d / this.pointer.oldd,
			(c.x - this.offset.left) * this.devicePixelRatio,
			(c.y - this.offset.top) * this.devicePixelRatio);

		this.pointer.oldc = c;
		this.pointer.oldd = d;
		this.update(true);
		this.redraw();
	}
}

//TODO: fully implement selection tool
MolPad.prototype.selectionToolHandler = {
	onPointerDown: function(e)
	{
		this.setCursor("pointer");
		var p = this.getRelativeCoords(getPointerCoords(e));

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
		var p = this.getRelativeCoords(getPointerCoords(e));

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

				var p = this.getRelativeCoords(getPointerCoords(e));
				var atom = new MPAtom({
					i: this.molecule.atoms.length,
					x: p.x,
					y: p.y,
					element: this.tool.data.element
				});
				atom.update(this);
				this.molecule.atoms.push(atom);
				this.redraw();
			}
		};
	}
	else if(this.tool.type == "bond")
	{
		return {
			onPointerDown: function(e)
			{
				this.saveToStack();

				var p = this.getRelativeCoords(getPointerCoords(e));

				var atom1 = new MPAtom({
					i: this.molecule.atoms.length,
					x: p.x - this.settings.bond.length / 2,
					y: p.y,
					element: "C"
				});
				this.molecule.atoms.push(atom1);

				var atom2 = new MPAtom({
					i: this.molecule.atoms.length,
					x: p.x + this.settings.bond.length / 2,
					y: p.y,
					element: "C"
				});
				this.molecule.atoms.push(atom2);

				var bond = new MPBond({
					i: this.molecule.bonds.length,
					from: atom1.getIndex(),
					to: atom2.getIndex(),
					type: this.tool.data.type,
					stereo: this.tool.data.stereo
				});
				this.molecule.bonds.push(bond);

				atom1.addBond(bond.getIndex());
				atom2.addBond(bond.getIndex());
				atom1.update(this);
				atom2.update(this);
				bond.update(this);

				this.redraw();
			}
		};
	}
	else if(this.tool.type == "fragment")
	{
		return {
			onPointerDown: function(e)
			{
				this.saveToStack();

				var p = this.getRelativeCoords(getPointerCoords(e));

				var frag = MPFragments.translate(
						MPFragments.scale(MPFragments.clone(this.tool.data.frag.full),
							this.settings.bond.length),
							p.x, p.y);

				for(var i = 0, n = this.settings.drawSkeletonFormula ?
					frag.size : frag.atoms.length; i < n; i++)
				{
					var atom = new MPAtom({
						i: this.molecule.atoms.length,
						x: frag.atoms[i].x,
						y: frag.atoms[i].y,
						element: frag.atoms[i].element
					});

					this.molecule.atoms.push(atom);
					frag.atoms[i].i = atom.getIndex();
					atom.update(this);
				}

				for(var i = 0, n = this.settings.drawSkeletonFormula ?
					frag.size : frag.bonds.length; i < n; i++)
				{
					var bond = new MPBond({
						i: this.molecule.bonds.length,
						type: frag.bonds[i].type,
						stereo: MP_STEREO_NONE,
						from: frag.atoms[frag.bonds[i].from].i,
						to: frag.atoms[frag.bonds[i].to].i
					});

					this.molecule.atoms[bond.getFrom()].addBond(bond.getIndex());
					this.molecule.atoms[bond.getTo()].addBond(bond.getIndex());
					this.molecule.bonds.push(bond);
					bond.update(this);
				}

				this.redraw();
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
