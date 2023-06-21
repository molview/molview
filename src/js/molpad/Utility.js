/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

var PI2 = 2 * Math.PI;

/**
 * Calculate if value is inside deviation relative to a number
 * @param  {Float} val Input value
 * @param  {Float} num Deviation base
 * @param  {Float} dev Deviation value
 * @return {Boolean}
 */
function indev(val, num, dev)
{
    return val > num - dev && val < num + dev;
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
 * Normalize angle to value between 0 and 2PI
 * @param {Float} a
 */
function posRad(a)
{
    while(a < 0) a += PI2;
    while(a > PI2) a -= PI2;
    return a;
}

/**
 * Calcualte smallest angle between two angles
 * @param {Float} a
 * @param {Float} b
 */
function smallestAngleBetween(a, b)
{
    var d = Math.abs(posRad(a) - posRad(b));
    return d < PI2 - d ? d : PI2 - d;
}

/**
 * Calculate angle between two angles where from is the first encountered angle
 * in counter clockwise direction
 * @param {Float} from
 * @param {Float} to
 */
function angleBetween(from, to)
{
    from = posRad(from);
    to = posRad(to);

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
	return posRad(Math.round((a - start) * clampFactor) / clampFactor
			+ start);//clamp to x steps, normalize to startAngle
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
function transformArrayMult(array, mult)
{
	var ret = []
	for(var i = 0; i < array.length; i++)
		ret.push(array[i] * mult);
	return ret;
}

/**
 * Copy array into new array and add value
 * @param  {Array} array
 * @param  {Float} val
 * @return {Array}
 */
function transformArrayAdd(array, val)
{
	var ret = []
	for(var i = 0; i < array.length; i++)
		ret.push(array[i] + val);
	return ret;
}

/**
 * Also defined in main MolView Utility but this makes MolPad standalone
 * @param {String} nail
 * @param {Array}  haystack
 */
function oneOf(nail, haystack)
{
	return haystack.indexOf(nail) !== -1;
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

function sign(x)
{
    //polyfill from Mozilla
    x = +x;// convert to a number
    if(x === 0 || isNaN(x)) return x
    return x > 0 ? 1 : -1
}
