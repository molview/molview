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

function getPointerCoords(e)
{
	var oe = e.originalEvent;
	if(oe.targetTouches && oe.targetTouches.length > 0)
	{
		return { x: oe.targetTouches[0].pageX, y: oe.targetTouches[0].pageY };
	}
	else
	{
		return { x: e.pageX, y: e.pageY };
	}
}

function getMultiTouchCenter(e)
{
	var t = e.originalEvent.targetTouches;
	if(t.length == 0) return { x: 0, y: 0 };
	else
	{
		var p = { x: t[0].pageX, y: t[0].pageY };
		for(var i = 1; i < t.length; i++)
		{
			p.x += t[i].pageX;
			p.y += t[i].pageY;
		}
		p.x /= t.length;
		p.y /= t.length;
		return p;
	}
}

function getMultiTouchDelta(e)
{
	var t = e.originalEvent.targetTouches;
	if(t.length == 0) return 0;
	else
	{
		var dx = Math.abs(t[0].pageX - t[1].pageX);
		var dy = Math.abs(t[0].pageY - t[1].pageY);
		return Math.sqrt(dx * dx + dy * dy);
	}
}

MolPad.prototype.onScroll = function(delta)
{
	var s = 1 + this.settings.zoomSpeed * delta;
	if(this.matrix[0] * s < this.settings.minZoom) s = this.settings.minZoom / this.matrix[0];
	this.scaleAbsolute(s, this.width() / 2, this.height() / 2);
	this.redraw();
}

MolPad.prototype.onPointerDown = function(e)
{
	var oe = e.originalEvent;
	this.pointer.old = getPointerCoords(e);

	if(oe.targetTouches && oe.targetTouches.length > 1)
	{
		this.pointer.oldc = getMultiTouchCenter(e);
		this.pointer.oldd = getMultiTouchDelta(e);
		this.pointer.handler = this.multiTouchHandler;
	}
	else if(e.which == 1 || oe.targetTouches && oe.targetTouches.length == 1)
	{
		this.pointer.handler = this.tool.handler;
	}
	else if(e.which == 2)
	{
		this.pointer.handler = this.mouseDragHandler;
	}
}

MolPad.prototype.onPointerMove = function(e)
{
	if(this.pointer.handler !== undefined)
	{
		this.pointer.handler.call(this, e);
	}
}

MolPad.prototype.onPointerUp = function(e)
{
	var oe = e.originalEvent;

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

MolPad.prototype.mouseDragHandler = function(e)
{
	var p = getPointerCoords(e);

	if(p.x == this.pointer.old.x && p.y == this.pointer.old.y) return;
	this.translate((p.x - this.pointer.old.x) * this.devicePixelRatio,
				   (p.y - this.pointer.old.y) * this.devicePixelRatio);

	this.pointer.old = p;
	this.redraw();
}

MolPad.prototype.multiTouchHandler = function(e)
{
	var c = getMultiTouchCenter(e);
	var d = getMultiTouchDelta(e);

	this.translate((c.x - this.pointer.oldc.x) * this.devicePixelRatio,
				   (c.y - this.pointer.oldc.y) * this.devicePixelRatio);

	this.scaleAbsolute(d / this.pointer.oldd,
		(c.x - this.offset.top) * this.devicePixelRatio,
		(c.y - this.offset.left) * this.devicePixelRatio);

	this.pointer.oldc = c;
	this.pointer.oldd = d;
	this.redraw();
}

MolPad.prototype.selectionToolHandler = function(e)
{
}
