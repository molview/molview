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

var PI2 = 2 * Math.PI;

function lineLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4)
{
    var div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    return {
        x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / div,
        y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / div
    };
}

/**
 * Calculate on which side b is relative to a in counter clockwise direction
 * @param {Float} a
 * @param {Float} b
 */
function radSide(a, b)
{
    return angleBetween(a, b) < Math.PI ? 1 : -1;
}

/**
 * Calculate angle between two angles where from is the first encountered angle
 * in counter clockwise direction
 * @param {Float} from
 * @param {Float} to
 */
function angleBetween(from, to)
{
    //loop till all angles are 0 <= a <= Math.PI
    while(from < 0) from += PI2;
    while(from > PI2) from -= PI2;
    while(to < 0) to += PI2;
    while(to > PI2) to -= PI2;

	if(to <= from)//the point 'to' on a circle is actually 2PI behind
	{
		return to - from + PI2;
	}
	else
	{
		return to - from;
	}
}

/**
 * Calculate the given clamped angle between a point and a center
 * @param  {Float}   start  Angle offset
 * @param  {MPPoint} center Center of rotation
 * @param  {MPPoint} point  Target point
 * @param  {Float}   steps  Number of rotation steps in one circle
 * @return {Float}
 */
function clampedAngle(start, center, point, steps)
{
	var a = center.angleTo(point);
	var clampFactor = steps / PI2;
	return Math.round((a - start) * clampFactor) / clampFactor
			+ start;//clamp to x steps, normalize to startAngle
}

/**
 * Maps an array using a given map, removes all elements which are not
 * in the map
 * @param  {Array}  array
 * @param  {Object} map
 * @return {Array}
 */
function mapArray(array, map)
{
    for(var i = 0; i < array.length; i++)
	{
		if(map[array[i]] !== undefined)
		{
			array[i] = map[array[i]];
		}
		else
		{
			array.splice(i, 1);
			i--;
		}
	}

    return array;
}

/**
 * Multiply all values in an array with a given multiplier into new array
 * @param  {Array} array
 * @param  {Float} mult
 * @return {Array}
 */
function multiplyAll(array, mult)
{
	var ret = []
	for(var i = 0; i < array.length; i++)
		ret.push(array[i] * mult);
	return ret;
}

/**
 * Also defined in main MolView Utility but this makes MolPad standalone
 * @param {String} nail
 * @param {Array}  haystack
 */
function oneOf(nail, haystack)
{
	return haystack.indexOf(nail) != -1;
}

function getMultiTouchDelta(e)
{
	var t = e.originalEvent.targetTouches;
	if(t.length <= 1) return 0;
	else
	{
		var dx = Math.abs(t[0].pageX - t[1].pageX);
		var dy = Math.abs(t[0].pageY - t[1].pageY);
		return Math.sqrt(dx * dx + dy * dy);
	}
}
