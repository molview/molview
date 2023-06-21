/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

function MPPoint(x, y)
{
	this.x = x || 0;
	this.y = y || 0;
}

/**
 * MPPoint From Object
 * @param {Object} obj
 */
function MPPFO(obj)
{
	return new MPPoint(obj.x, obj.y);
}

MPPoint.prototype.clone = function()
{
	return new MPPoint(this.x, this.y);
}

MPPoint.prototype.equals = function(point)
{
	return this.x === point.x && this.y === point.y;
}

MPPoint.prototype.set = function(x, y)
{
	this.x = x;
	this.y = y;
}

MPPoint.prototype.replace = function(p)
{
	this.x = p.x;
	this.y = p.y;
}

MPPoint.prototype.add = function(p)
{
	this.x += p.x;
	this.y += p.y;
}

MPPoint.prototype.addX = function(a) { this.x += a; }
MPPoint.prototype.addY = function(a) { this.y += a; }

MPPoint.prototype.divide = function(div)
{
	this.x /= div;
	this.y /= div;
}
MPPoint.prototype.divideX = function(a) { this.x /= a; }
MPPoint.prototype.divideY = function(a) { this.y /= a; }

MPPoint.prototype.multiply = function(mult)
{
	this.x *= mult;
	this.y *= mult;
}

MPPoint.prototype.multiplyX = function(a) { this.x *= a; }
MPPoint.prototype.multiplyY = function(a) { this.y *= a; }

MPPoint.prototype.translate = function(x, y)
{
	this.x += x;
	this.y += y;
}

MPPoint.prototype.scale = function(scale)
{
	this.x *= scale;
	this.y *= scale;
}

MPPoint.prototype.mirror = function(line, side)
{
	if(this.lineSide(line) !== side)
	{
		//http://stackoverflow.com/questions/3306838
		var dx = line.to.x - line.from.x;
		var dy = line.to.y - line.from.y;

		if(Math.abs(dx) < 0.001)
		{
			this.x = 2 * line.from.x - this.x;
		}
		else
		{
			var a = dy / dx;
			var c = line.from.y - a * line.from.x;//c = y - ax
			var d = (this.x + ((this.y - c) * a)) / (1 + a * a);
			this.x = 2 * d - this.x;
			this.y = 2 * d * a - this.y + 2 * c;
		}
		return true;
	}
	else return false;
}

/**
 * Find on which side of a line the given point is
 * @param  {Object} point { x: 0, y: 0 }
 * @param  {Object} line  { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }
 * @return {Integer}      -1: left, 0: on the line, +1: right
 */
MPPoint.prototype.lineSide = function(line)
{
    var s = sign((line.to.x - line.from.x) * (this.y - line.from.y) -
    		(line.to.y - line.from.y) * (this.x - line.from.x));
	return s > 0 ? 1 : s < 0 ? -1 : 0;
}

/**
 * Rotate a this point around a given center using a given angle
 * @param {MPPoint} c Center
 * @param {MPPoint} a Angle
 */
MPPoint.prototype.rotateAroundCenter = function(c, a)
{
	var dx = this.x - c.x;
	var dy = this.y - c.y;
	this.x = dx * Math.cos(-a) - dy * Math.sin(-a) + c.x;
	this.y = dx * Math.sin(-a) + dy * Math.cos(-a) + c.y;
}

/**
 * Calculate angle between the x-asix and the 'to' point where this point
 * is the center point
 * @param {MPPoint} to
 */
MPPoint.prototype.angleTo = function(to)
{
	return Math.atan2(-to.y + this.y, to.x - this.x);//flip y-axis
}

/**
 * Checks if the given point is inside the given circle
 * @param  {MPPoint} center Circle center
 * @param  {Float}   radius Cricle radius
 * @return {Boolean}
 */
MPPoint.prototype.inCircle = function(center, radius)
{
	return (this.x - center.x) * (this.x - center.x) +
		(this.y - center.y) * (this.y - center.y) < radius * radius;
}

/**
 * Calculates if point is NOT inside an R radius from line ab
 * @param  {MPPoint}  a Line vertex a
 * @param  {MPPoint}  b Line vertex b
 * @param  {Float}    r Radius around line
 * @return {Boolean}
 */
MPPoint.prototype.inLineBox = function(a, b, r)
{
	var bl = {}, tr = {};//bottom left, top right
	if(a.x < b.x) { bl.x = a.x, tr.x = b.x; }
	else		  { bl.x = b.x, tr.x = a.x; }
	if(a.y < b.y) { bl.y = a.y, tr.y = b.y; }
	else		  { bl.y = b.y, tr.y = a.y; }

	return !(this.x < bl.x - r || this.x > tr.x + r
		  || this.y < bl.y - r || this.y > tr.y + r);
}

/**
 * Calculates if point is NOT inside an R radius from point a
 * @param  {MPPoint}  a Point a
 * @param  {Float}    r Radius around line
 * @return {Boolean}
 */
MPPoint.prototype.inCircleBox = function(a, r)
{
	return !(this.x < a.x - r || this.x > a.x + r
		  || this.y < a.y - r || this.y > a.y + r);
}

MPPoint.prototype.inRect = function(rect)
{
	//clone to prevent from reference cluttering
	var x = rect.x, y = rect.y, w = rect.width, h = rect.height;
	if(w < 0)
	{
		w = -w;
		x -= w;
	}
	if(h < 0)
	{
		h = -h;
		y -= h;
	}
	return this.x > x && this.x < x + w
		&& this.y > y && this.y < y + h;
}

MPPoint.prototype.inPolygon = function(polygon)
{
	var c = false;
	for(var i = 0, j = polygon.length - 1; i < polygon.length; j = i++)
	{
		if((polygon[i].y > this.y) !== (polygon[j].y > this.y) &&
			this.x < ((polygon[j].x - polygon[i].x) * (this.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x))
		{
			c = !c;
		}
	}
	return c;
}

/**
 * Calculate shortest distance between a point and a line
 * @param  {MPPoint} a Line vertex a
 * @param  {MPPoint} b Line vertex b
 * @return {Float}
 */
MPPoint.prototype.lineDistance = function(a, b)
{
	var A = this.x - a.x;
	var B = this.y - a.y;
	var C = b.x - a.x;
	var D = b.y - a.y;

	var dot = A * C + B * D;
	var len_sq = C * C + D * D;
	var param = dot / len_sq;

	var xx, yy;

	if(param < 0 || (a.x === b.x && a.y === b.y))
	{
		xx = a.x;
		yy = a.y;
	}
	else if(param > 1)
	{
		xx = b.x;
		yy = b.y;
	}
	else
	{
		xx = a.x + param * C;
		yy = a.y + param * D;
	}

	var dx = this.x - xx;
	var dy = this.y - yy;
	return Math.sqrt(dx * dx + dy * dy);
}

MPPoint.prototype.distanceTo = function(p)
{
	return Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y));
}

MPPoint.prototype.fromPointer = function(e)
{
	var oe = e.originalEvent;
	if(oe.targetTouches && oe.targetTouches.length > 0)
	{
		this.set(oe.targetTouches[0].pageX, oe.targetTouches[0].pageY);
	}
	else
	{
		this.set(oe.pageX, oe.pageY);
	}

	return this;
}

MPPoint.prototype.fromRelativePointer = function(e, mpctx)
{
	this.fromPointer(e);

	this.x = (this.x - mpctx.offset.left) * mpctx.devicePixelRatio;
	this.y = (this.y - mpctx.offset.top) * mpctx.devicePixelRatio;
	this.x = (this.x - mpctx.matrix[4]) / mpctx.matrix[0];
	this.y = (this.y - mpctx.matrix[5]) / mpctx.matrix[3];

	return this;
}

MPPoint.prototype.fromMultiTouchCenter = function(e)
{
	var t = e.originalEvent.targetTouches;
	if(t.length > 1)
	{
		this.x = t[0].pageX;
		this.y = t[0].pageY;
		for(var i = 1; i < t.length; i++)
		{
			this.x += t[i].pageX;
			this.y += t[i].pageY;
		}
		this.x /= t.length;
		this.y /= t.length;
	}

	return this;
}
