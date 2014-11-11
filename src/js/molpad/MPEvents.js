/**
 * This file is part of MolView (https://molview.org)
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
	var oe = e.originalEvent;
	var p = getPointerCoords(e);
	this.pointer.old = p;
	this.pointer.oldr = this.getRelativeCoords({ x: p.x, y: p.y });//deep copy
	this.forAllObjects(function(obj){ obj.resetState(); });

	if(oe.targetTouches && oe.targetTouches.length > 1)
	{
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
				this.pointer.handler = obj.getHandler(this) || this.tool.defaultHandler;

				if(this.pointer.handler.onPointerDown)
				{
					this.pointer.handler.onPointerDown.call(this, e);
				}

				return true;
			}
		});

		if(this.pointer.handler == undefined)
		{
			this.pointer.handler = this.tool.defaultHandler;
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
	if(this.pointer.handler && this.pointer.handler.onPointerMove)
	{
		this.pointer.handler.onPointerMove.call(this, e);
	}
}

MolPad.prototype.onPointerUp = function(e)
{
	var oe = e.originalEvent;

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
		var redraw = false;
		this.setCursor("default");
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

MolPad.prototype.selectionToolHandler = {
	onPointerMove: function(e)
	{
	},
	onPointerUp: function(e)
	{
	}
}
